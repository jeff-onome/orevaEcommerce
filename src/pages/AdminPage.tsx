


import React, { useState, useEffect, useMemo } from 'react';
import { AdminTab, Product, Profile, Category, Order, Promotion, OrderItem, TeamMember, SiteContent, TablesInsert } from '../types';
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

  useEffect(() => {
    setSiteContent(initialSiteContent);
  }, [initialSiteContent]);

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
  
  const handleSearchChange = (tab: AdminTab, query: string) => {
    setSearchQueries(prev => ({ ...prev, [tab]: query }));
  };

  const handleAddNewProduct = (newProduct: Omit<Product, 'id' | 'created_at'>) => {
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
      await updateSiteContent(siteContent);
      alert('Site content updated successfully!');
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
                <div className="space-y-8 max-w-4xl">
                    {/* General & Hero */}
                    <div className="p-6 border rounded-lg">
                        <h4 className="text-lg font-bold mb-4">General & Homepage</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">Site Name</label>
                                <input type="text" id="siteName" value={siteContent.site_name || ''} onChange={(e) => setSiteContent(p => p ? ({ ...p, site_name: e.target.value }) : null)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700">Sender Email</label>
                                <input type="email" id="senderEmail" value={siteContent.sender_email || ''} onChange={(e) => setSiteContent(p => p ? ({ ...p, sender_email: e.target.value }) : null)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="notifications@example.com" />
                            </div>
                            <div>
                                <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700">Hero Title</label>
                                <input type="text" id="heroTitle" value={siteContent.hero_title || ''} onChange={(e) => setSiteContent(p => p ? ({ ...p, hero_title: e.target.value }) : null)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700">Hero Subtitle</label>
                                <textarea id="heroSubtitle" value={siteContent.hero_subtitle || ''} onChange={(e) => setSiteContent(p => p ? ({ ...p, hero_subtitle: e.target.value }) : null)} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                            </div>
                        </div>
                    </div>
                    {/* ... other sections ... */}
                    <Button onClick={handleContentSave} className="w-full text-lg py-3">Save All Changes</Button>
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
    </div>
  );
};

export default AdminPage;
