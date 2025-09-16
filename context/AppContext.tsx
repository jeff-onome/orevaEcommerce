

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';
// FIX: Added Service and Page to import
import { Product, CartItem, Profile, Order, Review, Promotion, Category, SiteContent, TeamMember, TablesInsert, Service, Page } from '../types';

interface AppState {
  // Data
  products: Product[];
  cart: CartItem[];
  wishlist: number[]; // Array of product IDs
  orders: Order[];
  reviews: Review[];
  users: Profile[]; // For admin panel
  categories: Category[];
  promotions: Promotion[];
  siteContent: SiteContent | null;
  // FIX: Added services and pages to state
  services: Service[];
  pages: Page[];
  
  // Auth & User
  // FIX: Removed Session and User direct imports to prevent resolution errors. Using 'any' as a fallback.
  session: any | null;
  user: any | null;
  profile: Profile | null;
  
  // App Status
  loading: boolean;
  error: Error | null;
}

// Define the shape of the context value
interface AppContextType extends AppState {
  // Functions to interact with the backend will be added here
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateCartQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;

  toggleWishlist: (productId: number) => Promise<void>;
  
  placeOrder: (items: CartItem[], total: number) => Promise<Order | null>;
  
  addReview: (reviewData: TablesInsert<'reviews'>) => Promise<void>;

  updateProfile: (details: Partial<Profile>) => Promise<void>;

  // Admin functions
  addProduct: (product: Omit<Product, 'id' | 'created_at'>) => Promise<Product | null>;
  updateProduct: (product: Product) => Promise<void>;
  addCategory: (name: string) => Promise<{ success: boolean; message?: string }>;
  updateCategory: (id: number, oldName: string, newName: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  addPromotion: (promo: Omit<Promotion, 'id'>) => Promise<void>;
  updatePromotion: (promo: Promotion) => Promise<void>;
  deletePromotion: (id: number) => Promise<void>;
  updateSiteContent: (content: Partial<SiteContent>) => Promise<void>;
  updateTeamMembers: (members: TeamMember[]) => Promise<void>;
  updateOrderStatus: (orderId: number, status: string) => Promise<void>;
  updateOrderItemStatus: (itemId: number, status: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    products: [],
    cart: [],
    wishlist: [],
    orders: [],
    reviews: [],
    users: [],
    categories: [],
    promotions: [],
    siteContent: null,
    // FIX: Initialized services and pages state
    services: [],
    pages: [],
    session: null,
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const fetchProfile = async (userId: string) => {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    }
    return profile;
  };

  const fetchUserData = async (user: any) => {
    try {
        const [
            { data: cartData, error: cartError },
            { data: wishlistData, error: wishlistError },
            { data: ordersData, error: ordersError },
        ] = await Promise.all([
            supabase.from('cart_items').select('*, products(*)').eq('user_id', user.id),
            supabase.from('wishlist_items').select('product_id').eq('user_id', user.id),
            supabase.from('orders').select('*, order_items(*, products(*)), profiles(*)').eq('user_id', user.id).order('created_at', { ascending: false }),
        ]);

        if (cartError || wishlistError || ordersError) {
            console.error(cartError || wishlistError || ordersError);
            throw new Error("Failed to fetch user data.");
        }
        
        const cartItems: CartItem[] = (cartData || [])
            .filter(item => item.products)
            .map(item => ({ ...(item.products as Product), quantity: item.quantity }));

        const wishlistItems: number[] = wishlistData?.map(item => item.product_id) || [];
        
        setState(s => ({ ...s, cart: cartItems, wishlist: wishlistItems, orders: (ordersData as any) || [] }));
    } catch (err) {
        console.error("Error fetching user data:", err);
        setState(s => ({...s, error: err as Error}));
    }
  };

  const fetchAdminData = async () => {
      const { data: usersData, error } = await supabase.from('profiles').select('*');
      if(error) console.error("Error fetching users for admin:", error);
      setState(s => ({...s, users: usersData || [] }));
  };

  useEffect(() => {
    const bootstrapAndListen = async () => {
      setState(s => ({ ...s, loading: true }));
      try {
          // 1. Fetch public data that everyone sees
          const [
              { data: products, error: pError },
              { data: categories, error: cError },
              { data: promotions, error: promoError },
              { data: siteContentData, error: siteError },
              { data: teamMembers, error: tError },
              { data: reviews, error: rError },
              // FIX: Fetch services and pages
              { data: services, error: servError },
              { data: pages, error: pageError },
          ] = await Promise.all([
              supabase.from('products').select('*').order('id'),
              supabase.from('categories').select('*').order('name'),
              supabase.from('promotions').select('*').order('id'),
              supabase.from('site_content').select('*').eq('id', 1).maybeSingle(),
              supabase.from('team_members').select('*'),
              supabase.from('reviews').select('*'),
              // FIX: Add services and pages to promise all
              supabase.from('services').select('*'),
              supabase.from('pages').select('*'),
          ]);

          if (pError || cError || promoError || siteError || tError || rError || servError || pageError) {
              throw new Error("Failed to load site content.");
          }

          const siteContentWithMembers: SiteContent | null = siteContentData ? {
              ...(siteContentData as any),
              team_members: teamMembers || [],
          } : null;

          setState(s => ({ 
              ...s, 
              products: products || [],
              categories: categories || [],
              promotions: promotions || [],
              reviews: reviews || [],
              siteContent: siteContentWithMembers,
              // FIX: Set services and pages in state
              services: services || [],
              pages: pages || [],
          }));
          
          // FIX: Updated to Supabase v2 syntax for getting session asynchronously.
          // FIX: Casting to `any` to bypass TypeScript error from potential type mismatch.
          const { data: { session } } = await (supabase.auth as any).getSession();
          setState(s => ({ ...s, session, user: session?.user ?? null }));

          if (session?.user) {
              const profile = await fetchProfile(session.user.id);
              setState(s => ({ ...s, profile }));
              if (profile) {
                  await fetchUserData(session.user);
                  if (profile.is_admin) {
                      await fetchAdminData();
                  }
              }
          }
      } catch (err) {
          console.error("Error during app bootstrap:", err);
          setState(s => ({ ...s, error: err as Error }));
      } finally {
          setState(s => ({ ...s, loading: false }));
      }

      // FIX: Updated to Supabase v2 syntax for onAuthStateChange.
      // FIX: Casting to `any` to bypass TypeScript error from potential type mismatch.
      const { data: { subscription } } = (supabase.auth as any).onAuthStateChange(async (event, session) => {
          setState(s => ({ ...s, session, user: session?.user ?? null }));
          if (event === 'SIGNED_IN' && session?.user) {
              const profile = await fetchProfile(session.user.id);
              setState(s => ({ ...s, profile }));
              if (profile) {
                  await fetchUserData(session.user);
                  if (profile.is_admin) {
                      await fetchAdminData();
                  }
              }
          } else if (event === 'SIGNED_OUT') {
              setState(s => ({ ...s, profile: null, cart: [], wishlist: [], orders: [], users: [] }));
          }
      });
      
      return () => {
          subscription?.unsubscribe();
      };
    };

    bootstrapAndListen();
  }, []);


  // --- CONTEXT FUNCTIONS ---

  const addToCart = async (product: Product, quantity = 1) => {
    if (!state.user) { alert('Please log in to add items to your cart.'); return; }
    
    const { data, error } = await supabase.from('cart_items').upsert(
        { user_id: state.user.id, product_id: product.id, quantity: (state.cart.find(i => i.id === product.id)?.quantity || 0) + quantity },
        { onConflict: 'user_id,product_id' }
    ).select('*, products(*)').single();

    if (error) { console.error(error); return; }
    if (!data?.products) return;

    const updatedItem: CartItem = { ...(data.products as Product), quantity: data.quantity };
    setState(s => ({ ...s, cart: s.cart.find(i => i.id === updatedItem.id) ? s.cart.map(i => i.id === updatedItem.id ? updatedItem : i) : [...s.cart, updatedItem] }));
  };

  const removeFromCart = async (productId: number) => {
    if (!state.user) return;
    const { error } = await supabase.from('cart_items').delete().match({ user_id: state.user.id, product_id: productId });
    if (error) { console.error(error); return; }
    setState(s => ({...s, cart: s.cart.filter(i => i.id !== productId)}));
  };

  const updateCartQuantity = async (productId: number, quantity: number) => {
     if (!state.user) return;
     if (quantity <= 0) {
         await removeFromCart(productId);
         return;
     }
     const { data, error } = await supabase.from('cart_items').update({ quantity }).match({ user_id: state.user.id, product_id: productId }).select('*, products(*)').single();
     if (error) { console.error(error); return; }

     if (!data?.products) return;

     const updatedItem: CartItem = { ...(data.products as Product), quantity: data.quantity };
     setState(s => ({...s, cart: s.cart.map(i => i.id === productId ? updatedItem : i)}));
  };

  const clearCart = async () => {
    if (!state.user) return;
    const { error } = await supabase.from('cart_items').delete().match({ user_id: state.user.id });
    if (error) { console.error(error); return; }
    setState(s => ({ ...s, cart: [] }));
  };

  const toggleWishlist = async (productId: number) => {
    if (!state.user) { alert('Please log in to manage your wishlist.'); return; }
    const isInWishlist = state.wishlist.includes(productId);

    if (isInWishlist) {
        const { error } = await supabase.from('wishlist_items').delete().match({ user_id: state.user.id, product_id: productId });
        if (error) { console.error(error); return; }
        setState(s => ({ ...s, wishlist: s.wishlist.filter(id => id !== productId) }));
    } else {
        const { error } = await supabase.from('wishlist_items').insert({ user_id: state.user.id, product_id: productId });
        if (error) { console.error(error); return; }
        setState(s => ({ ...s, wishlist: [...s.wishlist, productId] }));
    }
  };
  
  const placeOrder = async (items: CartItem[], total: number) => {
    if (!state.user) return null;
    
    // Defensive check for invalid items
    const validItems = items.filter(Boolean);
    if (validItems.length !== items.length) {
        console.error("Attempted to place order with invalid items.");
        return null;
    }
    
    const { data: orderData, error: orderError } = await supabase.from('orders')
      .insert({ user_id: state.user.id, total, status: 'Processing' })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error(orderError);
      return null;
    }

    const orderItems = validItems.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.sale_price ?? item.price,
      status: 'Processing'
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    
    if (itemsError) {
      console.error(itemsError);
      return null;
    }

    await clearCart();

    const { data: newOrderData } = await supabase.from('orders').select('*, order_items(*, products(*)), profiles(*)').eq('id', orderData.id).single();
    if(newOrderData) setState(s => ({ ...s, orders: [newOrderData as any, ...s.orders] }));
    return newOrderData as any;
  };
  
  const addReview = async (reviewData: TablesInsert<'reviews'>) => {
    if (!state.user) return;
    const fullReviewData = { ...reviewData, user_id: state.user.id };
    const { data, error } = await supabase.from('reviews').insert(fullReviewData).select().single();
    if (error) { console.error("Error adding review:", error); return; }
    if (data) setState(s => ({...s, reviews: [data, ...s.reviews]}));
  };
  
  const updateProfile = async (details: Partial<Profile>) => {
      if (!state.user) return;
      const { data, error } = await supabase.from('profiles').update(details).eq('id', state.user.id).select().single();
      if(error) { console.error(error); return; }
      setState(s => ({...s, profile: data}));
  };

  // --- ADMIN FUNCTIONS ---
  const addProduct = async (productData: Omit<Product, 'id' | 'created_at'>) => {
      const { data, error } = await supabase.from('products').insert(productData).select().single();
      if(error) { console.error(error); return null; }
      if(data) setState(s => ({...s, products: [data, ...s.products]}));
      return data;
  };

  const updateProduct = async (product: Product) => {
      const { data, error } = await supabase.from('products').update(product).eq('id', product.id).select().single();
      if(error) { console.error(error); return; }
      if(data) setState(s => ({...s, products: s.products.map(p => p.id === data.id ? data : p)}));
  };
  
  const addCategory = async (name: string): Promise<{ success: boolean; message?: string }> => {
    const trimmedName = name.trim();
    // Client-side check for duplicates for better UX
    const existingCategory = state.categories.find(cat => cat.name.toLowerCase() === trimmedName.toLowerCase());
    if (existingCategory) {
        return { success: false, message: `Category "${trimmedName}" already exists.` };
    }

    const { data, error } = await supabase.from('categories').insert({ name: trimmedName }).select().single();
    if (error) { 
      console.error("Error adding category:", error);
      return { success: false, message: error.message }; 
    }
    if (data) {
      setState(s => ({ ...s, categories: [...s.categories, data].sort((a,b) => a.name.localeCompare(b.name)) }));
      return { success: true };
    }
    return { success: false, message: 'An unknown error occurred while adding the category.'};
  };

  const updateCategory = async (id: number, oldName: string, newName: string) => {
    const { error: catError } = await supabase.from('categories').update({ name: newName }).eq('id', id);
    if (catError) { console.error(catError); return; }

    const productsToUpdate = state.products.filter(p => p.categories?.includes(oldName));
    for (const p of productsToUpdate) {
        const newCategories = p.categories?.map(c => c === oldName ? newName : c);
        await supabase.from('products').update({ categories: newCategories }).eq('id', p.id);
    }
    
    const { data: products } = await supabase.from('products').select('*');
    const { data: categories } = await supabase.from('categories').select('*');
    setState(s => ({ ...s, products: products || [], categories: categories || [] }));
  };

  const deleteCategory = async (id: number) => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) { console.error(error); return; }
    setState(s => ({ ...s, categories: s.categories.filter(c => c.id !== id) }));
  };
  
  const addPromotion = async (promo: Omit<Promotion, 'id'>) => {
    const { error } = await supabase.from('promotions').insert(promo);
    if(error) { console.error(error); return; }
    const { data } = await supabase.from('promotions').select('*');
    setState(s => ({...s, promotions: data || [] }));
  };
  
  const updatePromotion = async (promo: Promotion) => {
    const { error } = await supabase.from('promotions').update(promo).eq('id', promo.id);
    if(error) { console.error(error); return; }
    setState(s => ({...s, promotions: s.promotions.map(p => p.id === promo.id ? promo : p)}));
  };
  
  const deletePromotion = async (id: number) => {
    const { error } = await supabase.from('promotions').delete().eq('id', id);
    if(error) { console.error(error); return; }
    setState(s => ({...s, promotions: s.promotions.filter(p => p.id !== id)}));
  };
  
  const updateSiteContent = async (content: Partial<SiteContent>) => {
    const { team_members, ...contentData } = content;
    const { data, error } = await supabase.from('site_content').update(contentData).eq('id', 1).select().single();
    if(error) { console.error(error); return; }
    if(data && state.siteContent) setState(s => ({...s, siteContent: {...state.siteContent!, ...data} as SiteContent}));
  };
  
  const updateTeamMembers = async (members: TeamMember[]) => {
      if(!state.siteContent) return;
      const { error: deleteError } = await supabase.from('team_members').delete().neq('id', 0);
      if (deleteError) { console.error(deleteError); return; }
      
      const newMembers = members.map(({ id, ...rest }) => rest);
      const { data, error: insertError } = await supabase.from('team_members').insert(newMembers).select();
      if(insertError) { console.error(insertError); return; }

      setState(s => ({...s, siteContent: {...s.siteContent!, team_members: data || [] }}));
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) { console.error(error); return; }
    setState(s => ({
      ...s,
      orders: s.orders.map(o => o.id === orderId ? { ...o, status } : o)
    }));
  };

  const updateOrderItemStatus = async (itemId: number, status: string) => {
    const { error } = await supabase.from('order_items').update({ status }).eq('id', itemId);
    if (error) { console.error(error); return; }
    setState(s => ({
        ...s,
        orders: s.orders.map(o => ({
            ...o,
            items: o.items.map(i => i.id === itemId ? { ...i, status } as any : i)
        }))
    }));
  };

  const contextValue: AppContextType = {
    ...state,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    placeOrder,
    addReview,
    updateProfile,
    addProduct,
    updateProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addPromotion,
    updatePromotion,
    deletePromotion,
    updateSiteContent,
    updateTeamMembers,
    updateOrderStatus,
    updateOrderItemStatus,
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};