
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User as AuthUser } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { Product, CartItem, Profile, Order, Review, Promotion, Category, SiteContent, TeamMember, TablesInsert, TablesUpdate } from '../types';

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
  
  // Auth & User
  session: Session | null;
  user: AuthUser | null;
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
  
  placeOrder: (
    items: CartItem[], 
    total: number, 
    shippingDetails: { address: string; city: string; zip: string; country: string; }, 
    paymentMethod: string
  ) => Promise<Order | null>;
  
  addReview: (reviewData: TablesInsert<'reviews'>) => Promise<void>;

  updateProfile: (details: Partial<Profile>) => Promise<void>;

  // Admin functions
  addProduct: (product: Omit<Product, 'id' | 'created_at' | 'avg_rating' | 'review_count'>) => Promise<Product | null>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  addCategory: (categoryData: TablesInsert<'categories'>) => Promise<void>;
  updateCategory: (id: number, categoryData: TablesUpdate<'categories'>) => Promise<void>;
  renameCategoryAndUpdateProducts: (id: number, oldName: string, newName: string) => Promise<void>;
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
    session: null,
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const fetchAllUserData = async (user: AuthUser) => {
    try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (!profile) {
            // If profile is not found, maybe it's still being created. We can just clear user data.
             setState(s => ({ ...s, profile: null, cart: [], wishlist: [], orders: [], users: [] }));
             return;
        }

        let userData = { profile, cart: [], wishlist: [], orders: [], users: [] };

        if (profile.is_admin) {
            const { data: usersData } = await supabase.from('profiles').select('*');
            const { data: allOrders } = await supabase.from('orders').select('*, order_items(*, products(*)), profiles(*)').order('created_at', { ascending: false });
            userData.users = usersData || [];
            userData.orders = (allOrders as any) || [];
        } else {
            const { data: cartData } = await supabase.from('cart_items').select('*, products(*)').eq('user_id', user.id);
            const { data: wishlistData } = await supabase.from('wishlist_items').select('product_id').eq('user_id', user.id);
            const { data: ordersData } = await supabase.from('orders').select('*, order_items(*, products(*)), profiles(*)').eq('user_id', user.id).order('created_at', { ascending: false });

            userData.cart = (cartData || []).filter(item => item.products).map(item => ({ ...(item.products as Product), quantity: item.quantity }));
            userData.wishlist = wishlistData?.map(item => item.product_id) || [];
            userData.orders = (ordersData as any) || [];
        }

        setState(s => ({ ...s, ...userData }));
    } catch (error) {
        console.error("Error fetching user data:", error);
        setState(s => ({ ...s, profile: null, cart: [], wishlist: [], orders: [], users: [] }));
    }
  };


  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 1. Fetch all public data and the initial session concurrently.
        const [
            productsRes,
            categoriesRes,
            promotionsRes,
            siteContentRes,
            teamMembersRes,
            reviewsRes,
            sessionRes,
        ] = await Promise.all([
            supabase.from('products').select('*').order('id'),
            supabase.from('categories').select('*').order('display_order'),
            supabase.from('promotions').select('*').order('id'),
            supabase.from('site_content').select('*').eq('id', 1).maybeSingle(),
            supabase.from('team_members').select('*'),
            supabase.from('reviews').select('*, profiles(name)'),
            supabase.auth.getSession(),
        ]);
        
        // Error checking for robust startup
        const results = [productsRes, categoriesRes, promotionsRes, siteContentRes, teamMembersRes, reviewsRes, sessionRes];
        for (const res of results) {
          if ('error' in res && res.error) throw res.error;
        }

        const session = sessionRes.data.session;
        const publicData = {
          products: productsRes.data || [],
          categories: categoriesRes.data || [],
          promotions: promotionsRes.data || [],
          reviews: (reviewsRes.data as any) || [],
          siteContent: siteContentRes.data ? { ...(siteContentRes.data as any), team_members: teamMembersRes.data || [] } : null,
        };

        // 2. Set public data and initial session state.
        setState(s => ({ ...s, ...publicData, session, user: session?.user ?? null }));

        // 3. If a user session exists, fetch all user-specific data.
        if (session?.user) {
          await fetchAllUserData(session.user);
        }

      } catch (err: any) {
        console.error("Error initializing app:", err);
        setState(s => ({ ...s, error: err }));
      } finally {
        // 4. Once all initial data (public and private) is loaded, turn off the spinner.
        setState(s => ({ ...s, loading: false }));
      }
    };
    
    initializeApp();

    // 5. Set up the auth listener for subsequent login/logout events.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
        setState(s => ({ ...s, session: newSession, user: newSession?.user ?? null }));
        if (newSession?.user) {
            await fetchAllUserData(newSession.user);
        } else {
            // Clear all user data on logout.
            setState(s => ({ ...s, profile: null, cart: [], wishlist: [], orders: [], users: [] }));
        }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // This effect runs only once on mount.


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
  
  const placeOrder = async (
    items: CartItem[], 
    total: number, 
    shippingDetails: { address: string; city: string; zip: string; country: string; },
    paymentMethod: string
  ): Promise<Order | null> => {
    if (!state.user) return null;
    
    const { data: orderData, error: orderError } = await supabase.from('orders')
      .insert({ 
        user_id: state.user.id, 
        total, 
        status: 'Pending',
        payment_method: paymentMethod,
        shipping_address_line1: shippingDetails.address,
        shipping_address_city: shippingDetails.city,
        shipping_address_zip: shippingDetails.zip,
        shipping_address_country: shippingDetails.country,
      })
      .select('*, order_items(*, products(*)), profiles(*)')
      .single();

    if (orderError || !orderData) {
      console.error(orderError);
      return null;
    }

    const orderItems = items.map(item => ({
      order_id: orderData.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_purchase: item.sale_price ?? item.price,
      status: 'Pending'
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
    
    if (itemsError) {
      console.error(itemsError);
      return null;
    }

    await clearCart();
    
    const fullOrder = { ...orderData, order_items: orderItems.map(oi => ({ ...oi, products: items.find(i => i.id === oi.product_id) || null })) } as any;

    setState(s => ({ ...s, orders: [fullOrder, ...s.orders] }));
    
    try {
      const { error: funcError } = await supabase.functions.invoke('send-order-confirmation', {
        body: { order: fullOrder },
      });
      if (funcError) throw funcError;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
    }
    
    return fullOrder;
  };
  
  const addReview = async (reviewData: TablesInsert<'reviews'>) => {
    if (!state.user || !state.profile) return;
    const fullReviewData = { ...reviewData, user_id: state.user.id };
    const { data, error } = await supabase.from('reviews').insert(fullReviewData).select().single();
    if (error) { console.error("Error adding review:", error); return; }
    if (data) {
        const reviewWithProfile = { ...data, profiles: { name: state.profile.name } };
        const updatedProductList = state.products.map(p => {
            if (p.id === data.product_id) {
                const newReviewCount = (p.review_count || 0) + 1;
                const newAvgRating = ((p.avg_rating || 0) * (p.review_count || 0) + data.rating) / newReviewCount;
                return { ...p, review_count: newReviewCount, avg_rating: newAvgRating };
            }
            return p;
        });
        setState(s => ({
            ...s,
            reviews: [reviewWithProfile, ...s.reviews],
            products: updatedProductList,
        }));
    }
  };
  
  const updateProfile = async (details: Partial<Profile>) => {
      if (!state.user) return;
      const { data, error } = await supabase.from('profiles').update(details).eq('id', state.user.id).select().single();
      if(error) { console.error(error); return; }
      setState(s => ({...s, profile: data}));
  };

  // --- ADMIN FUNCTIONS ---
  const addProduct = async (productData: Omit<Product, 'id' | 'created_at' | 'avg_rating' | 'review_count'>) => {
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

  const deleteProduct = async (productId: number) => {
    const { error } = await supabase.from('products').delete().eq('id', productId);
    if (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
    setState(s => ({...s, products: s.products.filter(p => p.id !== productId)}));
  };
  
  const addCategory = async (categoryData: TablesInsert<'categories'>) => {
    const { data, error } = await supabase.from('categories').insert(categoryData).select().single();
    if (error) { console.error(error); throw error; }
    if (data) {
        setState(s => ({
            ...s,
            categories: [...s.categories, data].sort((a,b) => (a.display_order || 99) - (b.display_order || 99))
        }));
    }
  };

  const updateCategory = async (id: number, categoryData: TablesUpdate<'categories'>) => {
    const { data, error } = await supabase.from('categories').update(categoryData).eq('id', id).select().single();
    if (error) { console.error(error); throw error; }
    if (data) {
        setState(s => ({
            ...s,
            categories: s.categories.map(c => c.id === id ? data : c).sort((a,b) => (a.display_order || 99) - (b.display_order || 99))
        }));
    }
  };
  
  const renameCategoryAndUpdateProducts = async (id: number, oldName: string, newName: string) => {
    const { error } = await supabase.rpc('update_category_and_products', {
      p_category_id: id,
      p_new_name: newName,
    });
    
    if (error) {
      console.error("Error renaming category via RPC:", error);
      throw error;
    }
    
    const { data: products } = await supabase.from('products').select('*');
    const { data: categories } = await supabase.from('categories').select('*').order('display_order');
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
    setState(s => ({ ...s, orders: s.orders.map(o => o.id === orderId ? { ...o, status } : o) }));

    try {
      const { error: funcError } = await supabase.functions.invoke('send-shipping-update', {
        body: { orderId, status },
      });
      if (funcError) throw funcError;
    } catch (error) {
      console.error('Failed to send shipping update email:', error);
    }
  };

  const updateOrderItemStatus = async (itemId: number, status: string) => {
    const { error } = await supabase.from('order_items').update({ status }).eq('id', itemId);
    if (error) { console.error(error); return; }
    setState(s => ({
        ...s,
        orders: s.orders.map(o => ({
            ...o,
            order_items: o.order_items.map(i => i.id === itemId ? { ...i, status } as any : i)
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
    deleteProduct,
    addCategory,
    updateCategory,
    renameCategoryAndUpdateProducts,
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
