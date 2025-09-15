import React, { useState, useEffect, useMemo } from 'react';
import { AdminTab, Product, Profile, ThemeColors, Category, Order, Promotion, OrderItem, TeamMember, SiteContent, TablesInsert, TablesUpdate } from '../types';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import AdminProductRow from '../components/AdminProductRow';
import AdminProductForm from '../components/AdminProductForm';
import Modal from '../components/Modal';
import SimpleBarChart from '../components/SimpleBarChart';
import AdminPromotionForm from '../components/AdminPromotionForm';
import AdminCategoryForm from '../components/AdminCategoryForm';

const AnalyticsStatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-gray-50 p-6 rounded-lg flex items-center space-x-4 shadow-sm">
        <div className="bg-primary/10 text-primary p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const AdminPage: React.FC = () => {
  const { 
    products, 
    categories, 
    users, 
    orders, 
    promotions, 
    siteContent: initialSiteContent,
    updatePromotion, 
    updateOrderStatus, 
    updateOrderItemStatus,
    updateSiteContent,
    updateTeamMembers,
    addCategory,
    updateCategory,
    renameCategoryAndUpdateProducts,
    deleteCategory,
    addProduct,
    updateProduct,
    deleteProduct,
    addPromotion,
    deletePromotion
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.USERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  
  // Category editing state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Site content state
  const [siteContent, setSiteContent] = useState(initialSiteContent);
  const [teamMembers, setTeamMembers] = useState(initialSiteContent?.team_members || []);
  const [themeColors, setThemeColors] = useState<ThemeColors>({
      primary: initialSiteContent?.theme_primary || '#1a237e',
      secondary: initialSiteContent?.theme_secondary || '#ffab40',
      accent: initialSiteContent?.theme_accent || '#f50057'
  });

  // Effect to sync local state with the global context state when it updates
  useEffect(() => {
    if (initialSiteContent) {
      setSiteContent(initialSiteContent);
      setTeamMembers(initialSiteContent.team_members || []);
      setThemeColors({
        primary: initialSiteContent.theme_primary || '#1a237e',
        secondary: initialSiteContent.theme_secondary || '#ffab40',
        accent: initialSiteContent.theme_accent || '#f50057',
      });
    }
  }, [initialSiteContent]);


  // Team Member Modal State
  const [isTeamMemberModalOpen, setIsTeamMemberModalOpen] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | Partial<TeamMember> | null>(null);

  // Promotions state
  const [isAddPromotionModalOpen, setIsAddPromotionModalOpen] = useState(false);
  const [isEditPromotionModalOpen, setIsEditPromotionModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | undefined>(undefined);
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null);

  // Order viewing state
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [filteredUser, setFilteredUser] = useState<Profile | null>(null);

  // Search state
  const [searchQueries, setSearchQueries] = useState({
    [AdminTab.PRODUCTS]: '',
    [AdminTab.CATEGORIES]: '',
    [AdminTab.USERS]: '',
    [AdminTab.ORDERS]: '',
  });
  
  // Image Uploading State
  const [pendingUpload, setPendingUpload] = useState<{ imageSrc: string; onConfirm: () => void } | null>(null);

  const handleSearchChange = (tab: AdminTab, query: string) => {
    setSearchQueries(prev => ({ ...prev, [tab]: query }));
  };

  const handleAddNewProduct = (newProduct: Omit<Product, 'id' | 'created_at' | 'avg_rating' | 'review_count'>) => {
    addProduct(newProduct);
    setIsAddModalOpen(false);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    updateProduct(updatedProduct);
    setIsEditModalOpen(false);
    setEditingProduct(undefined);
  };

  const handleDeleteProduct = (product: Product) => {
    setDeletingProduct(product);
  };

  const confirmDeleteProduct = async () => {
    if (deletingProduct) {
        try {
            await deleteProduct(deletingProduct.id);
            alert('Product deleted successfully!');
        } catch (error: any) {
            alert(`Error: ${error.message}`);
        } finally {
            setDeletingProduct(null);
        }
    }
  };

  const handleOrderItemStatusChange = (orderId: number, itemId: number, status: string) => {
    updateOrderItemStatus(itemId, status);
    if (viewingOrder) {
        const updatedItems = viewingOrder.order_items.map(item => 
            item.id === itemId ? { ...item, status } : item
        );
        setViewingOrder({ ...viewingOrder, order_items: updatedItems as any });
    }
  };

  const handleContentSave = async () => {
      if (!siteContent) return;
      const contentToSave = { 
        ...siteContent, 
        theme_primary: themeColors.primary,
        theme_secondary: themeColors.secondary,
        theme_accent: themeColors.accent,
      };
      await updateSiteContent(contentToSave);
      await updateTeamMembers(teamMembers);
      alert('Site content and team updated successfully!');
  };

  const handleSaveCategory = async (formData: Category | TablesInsert<'categories'>) => {
    try {
      if ('id' in formData && formData.id) { // Editing existing category
        const originalCategory = categories.find(c => c.id === formData.id);
        if (originalCategory && originalCategory.name !== formData.name) {
          // Name changed, so we need to use the RPC to update products
          await renameCategoryAndUpdateProducts(formData.id, originalCategory.name, formData.name);
        }
        // Update other details like image, highlight status, and order
        await updateCategory(formData.id, {
          image_url: formData.image_url,
          is_highlighted: formData.is_highlighted,
          display_order: formData.display_order,
        });
      } else { // Adding new category
        await addCategory(formData as TablesInsert<'categories'>);
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
    } catch (error: any) {
      alert(`Error saving category: ${error.message}`);
    }
  };

  const handleToggleHighlight = (category: Category) => {
    updateCategory(category.id, { is_highlighted: !category.is_highlighted });
  };
  
  const handleDeleteCategoryClick = (category: Category) => {
    setDeletingCategory(category);
    setIsDeleteCategoryModalOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (deletingCategory) {
        deleteCategory(deletingCategory.id);
        setDeletingCategory(null);
        setIsDeleteCategoryModalOpen(false);
    }
  };

  const handleAddPromotion = (newPromotionData: Omit<Promotion, 'id'>) => {
    addPromotion(newPromotionData);
    setIsAddPromotionModalOpen(false);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setEditingPromotion(promotion);
    setIsEditPromotionModalOpen(true);
  };

  const handleUpdatePromotion = (updatedPromotion: Promotion) => {
    updatePromotion(updatedPromotion);
    setIsEditPromotionModalOpen(false);
    setEditingPromotion(undefined);
  };

  const handleDeletePromotion = (promotion: Promotion) => {
      setDeletingPromotion(promotion);
  };
  
  const confirmDeletePromotion = () => {
      if (deletingPromotion) {
          deletePromotion(deletingPromotion.id);
          setDeletingPromotion(null);
      }
  };

  const handleTogglePromotionStatus = (promotion: Promotion) => {
      updatePromotion({ ...promotion, is_active: !promotion.is_active });
  };

  const handleSiteContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isChecked = (e.target as HTMLInputElement).checked;
    
    setSiteContent(prev => prev ? ({
        ...prev,
        [name]: type === 'checkbox' ? isChecked : value
    }) : null);
  };

  const handleThemeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setThemeColors(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof SiteContent) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPendingUpload({
            imageSrc: result,
            onConfirm: () => {
                setSiteContent(prev => prev ? ({...prev, [field]: result }) : null);
                setPendingUpload(null);
            }
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleTeamMemberImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingTeamMember) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPendingUpload({
            imageSrc: result,
            onConfirm: () => {
                setEditingTeamMember(p => p ? ({ ...p, image_url: result }) : null);
                setPendingUpload(null);
            }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveTeamMember = () => {
    if (!editingTeamMember || !editingTeamMember.name || !editingTeamMember.title || !editingTeamMember.image_url) {
        alert("Please fill all fields for the team member.");
        return;
    }

    const newTeamMembers = [...teamMembers];
    
    if ('id' in editingTeamMember && typeof editingTeamMember.id === 'number' && editingTeamMember.id < Date.now()) { // Editing existing
        const index = newTeamMembers.findIndex(m => m.id === editingTeamMember.id);
        if (index > -1) {
            newTeamMembers[index] = editingTeamMember as TeamMember;
        }
    } else { // Adding new
        newTeamMembers.push({ ...editingTeamMember, id: Date.now() } as TeamMember);
    }

    setTeamMembers(newTeamMembers);
    setIsTeamMemberModalOpen(false);
    setEditingTeamMember(null);
  };

  const handleDeleteTeamMember = (id: number) => {
    if (window.confirm("Are you sure you want to delete this team member?")) {
        const updatedMembers = teamMembers.filter(m => m.id !== id);
        setTeamMembers(updatedMembers);
    }
  };

  // --- ANALYTICS DATA CALCULATION ---
  const analyticsData = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalCustomers = users.filter(u => !u.is_admin).length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    return {
      totalRevenue,
      totalOrders,
      totalCustomers,
      avgOrderValue,
    };
  }, [orders, users]);
  
  const salesLast7DaysData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
    }).reverse();

    return last7Days.map(date => {
        const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayStart = new Date(date.setHours(0, 0, 0, 0)).toISOString();
        const dayEnd = new Date(date.setHours(23, 59, 59, 999)).toISOString();

        const total = orders
            .filter(o => o.created_at && o.created_at >= dayStart && o.created_at <= dayEnd)
            .reduce((sum, o) => sum + o.total, 0);
        
        return { label: dayLabel, value: Math.round(total) };
    });
  }, [orders]);
  
  const topSellingProductsData = useMemo(() => {
    const productSales = new Map<number, { name: string; quantity: number }>();
    
    orders.forEach(order => {
        order.order_items.forEach(item => {
            const existing = productSales.get(item.product_id);
            const productName = item.products?.name || 'Unknown Product';
            productSales.set(item.product_id, {
                name: productName,
                quantity: (existing?.quantity || 0) + item.quantity,
            });
        });
    });

    return Array.from(productSales.values())
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map(p => ({ label: p.name, value: p.quantity }));
  }, [orders]);
  
  const lowStockProducts = useMemo(() => {
    return products.filter(p => p.stock < 10).sort((a, b) => a.stock - b.stock);
  }, [products]);


  const renderContent = () => {
    switch (activeTab) {
      case AdminTab.PRODUCTS:
        const filteredProducts = products.filter(product =>
          product.name.toLowerCase().includes(searchQueries[AdminTab.PRODUCTS].toLowerCase())
        );
        return (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h3 className="text-2xl font-semibold">Manage Products</h3>
               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchQueries[AdminTab.PRODUCTS]}
                  onChange={(e) => handleSearchChange(AdminTab.PRODUCTS, e.target.value)}
                  className="w-full md:w-64 p-2 border border-gray-300 rounded-md shadow-sm"
                />
                <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto justify-center">Add New Product</Button>
              </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 text-left">Product</th>
                            <th className="py-3 px-4 text-left">Price</th>
                            <th className="py-3 px-4 text-left">Stock</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(p => <AdminProductRow key={p.id} product={p} onEdit={handleEditProduct} onDelete={handleDeleteProduct} />)
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">No products found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        );
    case AdminTab.CATEGORIES:
        const filteredCategories = categories.filter(category =>
            category.name.toLowerCase().includes(searchQueries[AdminTab.CATEGORIES].toLowerCase())
        );
        return (
            <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-2xl font-semibold">Manage Categories</h3>
                     <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={searchQueries[AdminTab.CATEGORIES]}
                            onChange={(e) => handleSearchChange(AdminTab.CATEGORIES, e.target.value)}
                            className="w-full md:w-64 p-2 border border-gray-300 rounded-md shadow-sm"
                        />
                        <Button onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }} className="w-full sm:w-auto justify-center">Add New Category</Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-4 text-left">Image</th>
                                <th className="py-3 px-4 text-left">Category Name</th>
                                <th className="py-3 px-4 text-left">Order</th>
                                <th className="py-3 px-4 text-left">Highlighted</th>
                                <th className="py-3 px-4 text-left">Product Count</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map(cat => {
                                    const productCount = products.filter(p => p.categories?.includes(cat.name)).length;
                                    return (
                                    <tr key={cat.id} className="border-b">
                                        <td className="py-3 px-4">
                                            <img src={cat.image_url || 'https://via.placeholder.com/100x100.png?text=No+Image'} alt={cat.name} className="w-16 h-16 object-cover rounded"/>
                                        </td>
                                        <td className="py-3 px-4 font-semibold">{cat.name}</td>
                                        <td className="py-3 px-4">{cat.display_order}</td>
                                        <td className="py-3 px-4">
                                            <div className="relative inline-flex items-center cursor-pointer" onClick={() => handleToggleHighlight(cat)}>
                                                <input type="checkbox" readOnly checked={cat.is_highlighted || false} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{productCount}</td>
                                        <td className="py-3 px-4 flex items-center space-x-4">
                                            <button onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }} className="text-sm text-indigo-600 hover:text-indigo-900">
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteCategoryClick(cat)} 
                                                className="text-sm text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                )})
                            ) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">No categories found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
      case AdminTab.USERS:
        const filteredUsers = users.filter(user =>
            (user.name || '').toLowerCase().includes(searchQueries[AdminTab.USERS].toLowerCase())
        );
        return (
          <div>
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-2xl font-semibold">Manage Users</h3>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQueries[AdminTab.USERS]}
                    onChange={(e) => handleSearchChange(AdminTab.USERS, e.target.value)}
                    className="w-full md:w-64 p-2 border border-gray-300 rounded-md shadow-sm"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 text-left">Name</th>
                            <th className="py-3 px-4 text-left">Phone</th>
                            <th className="py-3 px-4 text-left">Country</th>
                            <th className="py-3 px-4 text-left">Admin</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user: Profile) => (
                                <tr key={user.id} className="border-b">
                                    <td className="py-3 px-4">{user.name || 'N/A'}</td>
                                    <td className="py-3 px-4">{user.phone || 'N/A'}</td>
                                    <td className="py-3 px-4">{user.country || 'N/A'}</td>
                                    <td className="py-3 px-4">
                                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.is_admin ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                          {user.is_admin ? 'Yes' : 'No'}
                                      </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button 
                                            onClick={() => { setFilteredUser(user); setActiveTab(AdminTab.ORDERS); }} 
                                            className="text-sm text-indigo-600 hover:text-indigo-900"
                                        >
                                            View Orders
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        );
      case AdminTab.ORDERS:
        const searchQuery = searchQueries[AdminTab.ORDERS].toLowerCase();
        const ordersToDisplay = filteredUser 
            ? orders.filter(order => order.user_id === filteredUser.id)
            : orders;

        const filteredOrders = ordersToDisplay.filter(order =>
            order.id.toString().slice(-6).includes(searchQuery) ||
            (order.profiles?.name || '').toLowerCase().includes(searchQuery)
        );
        const statusColors: { [key: string]: string } = {
            'Pending': 'bg-gray-100 border-gray-200 text-gray-800',
            'Processing': 'bg-yellow-100 border-yellow-200 text-yellow-800',
            'Shipped': 'bg-blue-100 border-blue-200 text-blue-800',
            'Delivered': 'bg-green-100 border-green-200 text-green-800',
            'Cancelled': 'bg-red-100 border-red-200 text-red-800',
        };

        return (
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-2xl font-semibold">Manage Orders</h3>
                <input
                    type="text"
                    placeholder="Search by ID or name..."
                    value={searchQueries[AdminTab.ORDERS]}
                    onChange={(e) => handleSearchChange(AdminTab.ORDERS, e.target.value)}
                    className="w-full md:w-64 p-2 border border-gray-300 rounded-md shadow-sm"
                />
            </div>

            {filteredUser && (
                <div className="mb-4 bg-indigo-100 p-3 rounded-md flex justify-between items-center">
                    <p className="text-indigo-800 font-semibold">
                        Showing orders for: {filteredUser.name}
                    </p>
                    <button onClick={() => setFilteredUser(null)} className="text-sm font-bold text-indigo-600 hover:text-indigo-900">
                        Clear Filter
                    </button>
                </div>
            )}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="py-3 px-4 text-left">Order ID</th>
                            <th className="py-3 px-4 text-left">Customer</th>
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Total</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order: Order) => (
                                <tr key={order.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-4 text-sm font-medium">#{order.id.toString().slice(-6)}</td>
                                    <td className="py-3 px-4">
                                        <div>{order.profiles?.name}</div>
                                        <div className="text-xs text-gray-500">{order.user_id}</div>
                                    </td>
                                    <td className="py-3 px-4">{new Date(order.created_at!).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">₦{order.total.toLocaleString()}</td>
                                    <td className="py-3 px-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            className={`p-1 border rounded-md text-sm ${statusColors[order.status] || 'bg-gray-100'}`}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="py-3 px-4">
                                        <button onClick={() => setViewingOrder(order)} className="text-sm text-indigo-600 hover:text-indigo-900">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        );
    case AdminTab.ANALYTICS:
        const CurrencyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>);
        const OrdersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>);
        const UsersIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.965 5.965 0 0112 13a5.965 5.965 0 013 1.197" /></svg>);

        if (orders.length === 0) {
            return (
                <div className="text-center py-16">
                    <h3 className="text-2xl font-semibold text-gray-700">No Analytics Data Yet</h3>
                    <p className="text-gray-500 mt-2">Check back after you've made some sales.</p>
                </div>
            )
        }
        return (
            <div>
                <h3 className="text-2xl font-semibold mb-6">Store Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <AnalyticsStatCard title="Total Revenue" value={`₦${analyticsData.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={<CurrencyIcon />} />
                    <AnalyticsStatCard title="Total Orders" value={analyticsData.totalOrders.toLocaleString()} icon={<OrdersIcon />} />
                    <AnalyticsStatCard title="Total Customers" value={analyticsData.totalCustomers.toLocaleString()} icon={<UsersIcon />} />
                    <AnalyticsStatCard title="Avg. Order Value" value={`₦${analyticsData.avgOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} icon={<CurrencyIcon />} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-surface p-6 rounded-lg shadow-sm">
                        <h4 className="text-lg font-bold mb-4">Sales Over Last 7 Days (₦)</h4>
                        <SimpleBarChart data={salesLast7DaysData} />
                    </div>
                    <div className="bg-surface p-6 rounded-lg shadow-sm">
                        <h4 className="text-lg font-bold mb-4">Top 5 Selling Products (Units)</h4>
                        <SimpleBarChart data={topSellingProductsData} />
                    </div>
                </div>
                
                <div>
                    <h4 className="text-lg font-bold mb-4">Low Stock Alerts (under 10 units)</h4>
                    {lowStockProducts.length > 0 ? (
                        <div className="overflow-x-auto bg-surface rounded-lg shadow-sm">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Product Name</th>
                                        <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Stock Remaining</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lowStockProducts.map(product => (
                                        <tr key={product.id} className="border-t">
                                            <td className="py-3 px-4">{product.name}</td>
                                            <td className="py-3 px-4"><span className="font-bold text-accent">{product.stock}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="bg-surface p-6 rounded-lg shadow-sm text-center text-gray-500">
                            No products with low stock. Great job!
                        </div>
                    )}
                </div>
            </div>
        )
      case AdminTab.SITE_CONTENT:
        if (!siteContent) return null;
        return (
             <div>
                <h3 className="text-2xl font-semibold mb-6">Manage Site Content & Theme</h3>
                <div className="space-y-8 max-w-4xl mx-auto">
                    {/* General & Theme */}
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h4 className="text-lg font-bold mb-4">General & Theme</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Site Name</label>
                                <input type="text" name="site_name" value={siteContent.site_name || ''} onChange={handleSiteContentChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Sender Email (for notifications)</label>
                                <input type="email" name="sender_email" value={siteContent.sender_email || ''} onChange={handleSiteContentChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="notifications@example.com" />
                            </div>
                            <div className="md:col-span-2 grid grid-cols-3 gap-4 items-center">
                                {Object.entries(themeColors).map(([key, value]) => (
                                    <div key={key}>
                                        <label className="block text-sm font-medium text-gray-700 capitalize">{key} Color</label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <input type="color" name={key} value={value} onChange={handleThemeColorChange} className="h-10 w-10 p-1 border border-gray-300 rounded-md cursor-pointer" />
                                            <input type="text" value={value} onChange={handleThemeColorChange} name={key} className="block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Homepage Hero */}
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h4 className="text-lg font-bold mb-4">Homepage Hero Section</h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hero Title</label>
                                <input type="text" name="hero_title" value={siteContent.hero_title || ''} onChange={handleSiteContentChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hero Subtitle</label>
                                <textarea name="hero_subtitle" value={siteContent.hero_subtitle || ''} onChange={handleSiteContentChange} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Sales Banner */}
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h4 className="text-lg font-bold mb-4">Sales Banner</h4>
                        <div className="space-y-4">
                             <label className="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" name="sales_banner_is_active" checked={siteContent.sales_banner_is_active || false} onChange={handleSiteContentChange} className="h-5 w-5 rounded text-primary focus:ring-primary"/>
                                <span className="text-gray-700">Is Banner Active?</span>
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Banner Title</label>
                                    <input type="text" name="sales_banner_title" value={siteContent.sales_banner_title || ''} onChange={handleSiteContentChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Banner End Date</label>
                                    <input type="datetime-local" name="sales_banner_end_date" value={siteContent.sales_banner_end_date?.slice(0,16) || ''} onChange={handleSiteContentChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Banner Subtitle</label>
                                <input type="text" name="sales_banner_subtitle" value={siteContent.sales_banner_subtitle || ''} onChange={handleSiteContentChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                        </div>
                    </div>

                    {/* About Us Page */}
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h4 className="text-lg font-bold mb-4">About Us Page</h4>
                        <div className="space-y-4">
                           <input type="text" name="about_title" placeholder="About Page Title" value={siteContent.about_title || ''} onChange={handleSiteContentChange} className="block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                           <textarea name="about_subtitle" placeholder="About Page Subtitle" value={siteContent.about_subtitle || ''} onChange={handleSiteContentChange} rows={2} className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                           <hr/>
                           <input type="text" name="about_story_title" placeholder="Story Title" value={siteContent.about_story_title || ''} onChange={handleSiteContentChange} className="block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                           <textarea name="about_story_content" placeholder="Story Content" value={siteContent.about_story_content || ''} onChange={handleSiteContentChange} rows={5} className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                           <div>
                                <label className="block text-sm font-medium text-gray-700">Story Image</label>
                                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'about_story_image_url')} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-primary hover:file:bg-violet-100" />
                                {siteContent.about_story_image_url && <img src={siteContent.about_story_image_url} alt="Preview" className="mt-2 h-32 w-auto object-cover rounded-md" />}
                            </div>
                        </div>
                    </div>

                    {/* Team Members */}
                     <div className="p-6 border rounded-lg shadow-sm">
                        <h4 className="text-lg font-bold mb-4">Team Members Section</h4>
                        <input type="text" name="about_team_title" placeholder="Team Section Title (e.g., Meet the Team)" value={siteContent.about_team_title || ''} onChange={handleSiteContentChange} className="mb-4 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                        <div className="space-y-2">
                            {teamMembers.map(member => (
                                <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div className="flex items-center gap-3">
                                        <img src={member.image_url || 'https://via.placeholder.com/40'} alt={member.name || ''} className="w-10 h-10 rounded-full object-cover"/>
                                        <span>{member.name} - {member.title}</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => { setEditingTeamMember(member); setIsTeamMemberModalOpen(true); }} className="text-sm text-indigo-600 hover:underline">Edit</button>
                                        <button onClick={() => handleDeleteTeamMember(member.id)} className="text-sm text-red-600 hover:underline">Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button onClick={() => { setEditingTeamMember({}); setIsTeamMemberModalOpen(true); }} className="mt-4">Add Team Member</Button>
                    </div>

                    {/* Contact & Socials */}
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h4 className="text-lg font-bold mb-4">Contact & Socials</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input type="text" name="contact_address" placeholder="Address" value={siteContent.contact_address || ''} onChange={handleSiteContentChange} className="p-2 border rounded-md" />
                            <input type="email" name="contact_email" placeholder="Email" value={siteContent.contact_email || ''} onChange={handleSiteContentChange} className="p-2 border rounded-md" />
                            <input type="tel" name="contact_phone" placeholder="Phone" value={siteContent.contact_phone || ''} onChange={handleSiteContentChange} className="p-2 border rounded-md" />
                            <input type="text" name="social_instagram" placeholder="Instagram Handle" value={siteContent.social_instagram || ''} onChange={handleSiteContentChange} className="p-2 border rounded-md" />
                            <input type="text" name="social_tiktok" placeholder="TikTok Handle" value={siteContent.social_tiktok || ''} onChange={handleSiteContentChange} className="p-2 border rounded-md" />
                            <input type="text" name="social_facebook" placeholder="Facebook Handle" value={siteContent.social_facebook || ''} onChange={handleSiteContentChange} className="p-2 border rounded-md" />
                            <input type="text" name="social_twitter" placeholder="Twitter Handle" value={siteContent.social_twitter || ''} onChange={handleSiteContentChange} className="p-2 border rounded-md" />
                            <input type="text" name="social_whatsapp" placeholder="WhatsApp Number" value={siteContent.social_whatsapp || ''} onChange={handleSiteContentChange} className="p-2 border rounded-md" />
                        </div>
                    </div>
                    
                    {/* Legal Pages */}
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h4 className="text-lg font-bold mb-4">Legal Pages</h4>
                         <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Privacy Policy</label>
                                <textarea name="privacy_policy_content" value={siteContent.privacy_policy_content || ''} onChange={handleSiteContentChange} rows={8} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Terms of Service</label>
                                <textarea name="terms_of_service_content" value={siteContent.terms_of_service_content || ''} onChange={handleSiteContentChange} rows={8} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleContentSave} className="w-full text-lg py-3 sticky bottom-4">Save All Changes</Button>
                </div>
            </div>
        );
      case AdminTab.PROMOTIONS:
        return (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-semibold">Manage Promotions</h3>
                    <Button onClick={() => setIsAddPromotionModalOpen(true)}>Add New Promotion</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-4 text-left">Title</th>
                                <th className="py-3 px-4 text-left">Discount</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map(promo => (
                                <tr key={promo.id} className="border-b">
                                    <td className="py-3 px-4 font-medium">{promo.title}</td>
                                    <td className="py-3 px-4">{promo.discount_percentage}%</td>
                                    <td className="py-3 px-4">
                                        <div className="relative inline-flex items-center cursor-pointer" onClick={() => handleTogglePromotionStatus(promo)}>
                                            <input type="checkbox" readOnly checked={promo.is_active || false} className="sr-only peer" />
                                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                            <span className="ml-3 text-sm font-medium text-gray-900">{promo.is_active ? 'Active' : 'Inactive'}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 flex items-center space-x-4">
                                        <button onClick={() => handleEditPromotion(promo)} className="text-sm text-indigo-600 hover:text-indigo-900">Edit</button>
                                        <button onClick={() => handleDeletePromotion(promo)} className="text-sm text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-surface p-8 rounded-lg shadow-xl animate-fade-in">
      <h1 className="text-4xl font-extrabold mb-8">Admin Dashboard</h1>
      <div className="flex border-b mb-6 overflow-x-auto">
        {Object.values(AdminTab).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 px-4 text-lg font-medium whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div>{renderContent()}</div>
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
        <AdminProductForm onSubmit={handleAddNewProduct} />
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <AdminProductForm onSubmit={handleUpdateProduct} initialData={editingProduct} />
      </Modal>
       <Modal isOpen={!!deletingProduct} onClose={() => setDeletingProduct(null)}>
        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">
            Are you sure you want to delete the product "{deletingProduct?.name}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setDeletingProduct(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDeleteProduct}>Delete</Button>
        </div>
      </Modal>
    <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">{editingCategory ? 'Edit' : 'Add New'} Category</h2>
        <AdminCategoryForm 
            onSubmit={handleSaveCategory} 
            initialData={editingCategory || undefined}
        />
    </Modal>
    <Modal isOpen={isDeleteCategoryModalOpen} onClose={() => setIsDeleteCategoryModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">
            Are you sure you want to delete the category "{deletingCategory?.name}"? Products in this category will not be deleted but will no longer be associated with it. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setIsDeleteCategoryModalOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDeleteCategory}>Delete</Button>
        </div>
    </Modal>
    <Modal isOpen={isAddPromotionModalOpen} onClose={() => setIsAddPromotionModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Add New Promotion</h2>
        <AdminPromotionForm onSubmit={handleAddPromotion} />
    </Modal>
    <Modal isOpen={isEditPromotionModalOpen} onClose={() => setIsEditPromotionModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Edit Promotion</h2>
        <AdminPromotionForm onSubmit={handleUpdatePromotion} initialData={editingPromotion} />
    </Modal>
    <Modal isOpen={!!deletingPromotion} onClose={() => setDeletingPromotion(null)}>
        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">
            Are you sure you want to delete the promotion "{deletingPromotion?.title}"?
        </p>
        <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setDeletingPromotion(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDeletePromotion}>Delete</Button>
        </div>
    </Modal>
    <Modal isOpen={isTeamMemberModalOpen} onClose={() => setIsTeamMemberModalOpen(false)}>
      {editingTeamMember && (
        <div>
          <h2 className="text-2xl font-bold mb-4">{'id' in editingTeamMember ? 'Edit' : 'Add'} Team Member</h2>
          <div className="space-y-4">
            <input 
              type="text"
              placeholder="Name"
              value={editingTeamMember.name || ''}
              onChange={e => setEditingTeamMember(p => p ? ({...p, name: e.target.value}) : null)}
              className="w-full p-2 border rounded"
            />
            <input 
              type="text"
              placeholder="Title"
              value={editingTeamMember.title || ''}
              onChange={e => setEditingTeamMember(p => p ? ({...p, title: e.target.value}) : null)}
              className="w-full p-2 border rounded"
            />
            <div>
                <label className="block text-sm font-medium text-gray-700">Member Image</label>
                <input 
                type="file"
                accept="image/*"
                onChange={handleTeamMemberImageChange}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-primary hover:file:bg-violet-100"
                />
                {editingTeamMember.image_url && <img src={editingTeamMember.image_url} alt="Preview" className="mt-2 h-24 w-24 rounded-full object-cover" loading="lazy" decoding="async" />}
            </div>
            <Button onClick={handleSaveTeamMember}>Save Member</Button>
          </div>
        </div>
      )}
    </Modal>
    <Modal isOpen={!!viewingOrder} onClose={() => setViewingOrder(null)}>
        {viewingOrder && (
            <div>
                <h2 className="text-2xl font-bold mb-2">Order Details</h2>
                <p className="text-gray-500 mb-1">ID: #{viewingOrder.id.toString().slice(-6)}</p>
                <p className="text-gray-500 mb-4">Customer: {viewingOrder.profiles?.name}</p>
                
                <div className="overflow-x-auto -mx-8 px-8">
                    <table className="min-w-full">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-3 text-left text-sm font-semibold">Item</th>
                                <th className="py-2 px-3 text-left text-sm font-semibold">Qty</th>
                                <th className="py-2 px-3 text-left text-sm font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y">
                            {viewingOrder.order_items.map(item => (
                                <tr key={item.id}>
                                    <td className="py-2 px-3 flex items-center gap-3">
                                        <img src={item.products?.image_url || ''} alt={item.products?.name} className="w-10 h-10 object-cover rounded" loading="lazy" decoding="async" />
                                        <span className="font-medium text-sm">{item.products?.name}</span>
                                    </td>
                                    <td className="py-2 px-3 text-sm">{item.quantity}</td>
                                    <td className="py-2 px-3">
                                        <select
                                            value={item.status}
                                            onChange={(e) => handleOrderItemStatusChange(viewingOrder.id, item.id, e.target.value)}
                                            className="p-1 border rounded-md text-sm w-full"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-6 text-right">
                    <Button variant="secondary" onClick={() => setViewingOrder(null)}>Close</Button>
                </div>
            </div>
        )}
    </Modal>
    <Modal isOpen={!!pendingUpload} onClose={() => setPendingUpload(null)}>
        {pendingUpload && (
            <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Upload this Image?</h3>
            <img src={pendingUpload.imageSrc} alt="Preview" className="max-w-full max-h-80 mx-auto rounded-md mb-6" />
            <div className="flex justify-center gap-4">
                <Button variant="secondary" onClick={() => setPendingUpload(null)}>
                Cancel
                </Button>
                <Button onClick={pendingUpload.onConfirm}>
                Upload
                </Button>
            </div>
            </div>
        )}
    </Modal>
    </div>
  );
};

export default AdminPage;