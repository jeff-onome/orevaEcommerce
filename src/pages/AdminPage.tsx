import React, { useState, useEffect } from 'react';
import { AdminTab, Product, Profile, ThemeColors, Order, Promotion, OrderItem, TeamMember, SiteContent } from '../types';
import { useAppContext } from '../context/AppContext';
import Button from '../components/Button';
import AdminProductRow from '../components/AdminProductRow';
import AdminProductForm from '../components/AdminProductForm';
import Modal from '../components/Modal';
import SimpleBarChart from '../components/SimpleBarChart';
import AdminPromotionForm from '../components/AdminPromotionForm';
import { uploadImage } from '../utils/storage';

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
    deleteCategory,
    addProduct,
    updateProduct,
    addPromotion,
    deletePromotion,
    updateUserSuspension,
    deleteUser,
  } = useAppContext();
  
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.USERS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  
  // Category editing state
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: number; oldName: string; newName: string } | null>(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<{id: number; name: string} | null>(null);

  // Site content state
  const [siteContent, setSiteContent] = useState(initialSiteContent);
  const [teamMembers, setTeamMembers] = useState(initialSiteContent?.team_members || []);
  const [themeColors, setThemeColors] = useState<ThemeColors>({
      primary: initialSiteContent?.theme_primary || '#1a237e',
      secondary: initialSiteContent?.theme_secondary || '#ffab40',
      accent: initialSiteContent?.theme_accent || '#f50057'
  });
  const [isUploading, setIsUploading] = useState(false);
  
  // User Management state
  const [suspendingUser, setSuspendingUser] = useState<Profile | null>(null);
  const [deletingUser, setDeletingUser] = useState<Profile | null>(null);

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

  const handleOrderItemStatusChange = (orderId: number, itemId: number, status: string) => {
    updateOrderItemStatus(itemId, status);
    if (viewingOrder) {
        const updatedItems = viewingOrder.items.map(item => 
            item.id === itemId ? { ...item, status } : item
        );
        setViewingOrder({ ...viewingOrder, items: updatedItems as any });
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

  const handleEditCategory = (id: number, name: string) => {
    setEditingCategory({ id, oldName: name, newName: name });
    setIsEditCategoryModalOpen(true);
  };
  
  const handleAddCategory = async () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
        alert("Category name cannot be empty.");
        return;
    }
    
    const result = await addCategory(trimmedName);
    
    if (result.success) {
        alert('Category added successfully!');
        setNewCategoryName('');
        setIsAddCategoryModalOpen(false);
    } else {
        alert(`Failed to add category: ${result.message}`);
    }
  };

  const handleDeleteCategoryClick = (id: number, name: string) => {
    setDeletingCategory({id, name});
    setIsDeleteCategoryModalOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (deletingCategory) {
        deleteCategory(deletingCategory.id);
        setDeletingCategory(null);
        setIsDeleteCategoryModalOpen(false);
    }
  };

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.oldName && editingCategory.newName && editingCategory.oldName !== editingCategory.newName) {
        updateCategory(editingCategory.id, editingCategory.oldName, editingCategory.newName);
    }
    setIsEditCategoryModalOpen(false);
    setEditingCategory(null);
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

  const handleSiteContentChange = (field: keyof Omit<SiteContent, 'team_members' | 'id'>, value: any) => {
    setSiteContent(prev => prev ? ({...prev, [field]: value }) : null);
  };

  const handleStoryImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const publicUrl = await uploadImage(file, 'site-content');
        handleSiteContentChange('about_story_image_url', publicUrl);
      } catch (error) {
        alert('Image upload failed. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };
  
  const handleTeamMemberImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingTeamMember) {
      setIsUploading(true);
      try {
        const publicUrl = await uploadImage(file, 'team-members');
        setEditingTeamMember(p => p ? ({ ...p, image_url: publicUrl }) : null);
      } catch (error) {
        alert('Image upload failed. Please try again.');
      } finally {
        setIsUploading(false);
      }
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

  const handleSuspendClick = (user: Profile) => {
    setSuspendingUser(user);
  };

  const confirmSuspend = async () => {
    if (suspendingUser) {
        await updateUserSuspension(suspendingUser.id, !suspendingUser.is_suspended);
        setSuspendingUser(null);
    }
  };

  const handleDeleteClick = (user: Profile) => {
      setDeletingUser(user);
  };

  const confirmDelete = async () => {
      if (deletingUser) {
          const result = await deleteUser(deletingUser.id);
          if (!result.success) {
              alert(`Failed to delete user: ${result.message}`);
          }
          setDeletingUser(null);
      }
  };


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
                            filteredProducts.map(p => <AdminProductRow key={p.id} product={p} onEdit={handleEditProduct} />)
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
                        <Button onClick={() => setIsAddCategoryModalOpen(true)} className="w-full sm:w-auto justify-center">Add New Category</Button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="py-3 px-4 text-left">Category Name</th>
                                <th className="py-3 px-4 text-left">Product Count</th>
                                <th className="py-3 px-4 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map(cat => {
                                    const productCount = products.filter(p => p.categories?.includes(cat.name)).length;
                                    const isDeletable = productCount === 0;
                                    return (
                                    <tr key={cat.id} className="border-b">
                                        <td className="py-3 px-4">{cat.name}</td>
                                        <td className="py-3 px-4">{productCount}</td>
                                        <td className="py-3 px-4 flex items-center space-x-4">
                                            <button onClick={() => handleEditCategory(cat.id, cat.name)} className="text-sm text-indigo-600 hover:text-indigo-900">
                                                Edit
                                            </button>
                                            <div className="relative group">
                                                <button 
                                                    onClick={() => handleDeleteCategoryClick(cat.id, cat.name)} 
                                                    className={`text-sm ${isDeletable ? 'text-red-600 hover:text-red-900' : 'text-gray-400 cursor-not-allowed'}`}
                                                    disabled={!isDeletable}
                                                    aria-label={!isDeletable ? 'Cannot delete category with products' : 'Delete category'}
                                                >
                                                    Delete
                                                </button>
                                                {!isDeletable && (
                                                    <span className="absolute left-0 bottom-full mb-2 w-max bg-gray-700 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                        Cannot delete. Reassign products first.
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )})
                            ) : (
                                <tr>
                                    <td colSpan={3} className="text-center py-8 text-gray-500">No categories found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
      case AdminTab.USERS:
        const filteredUsers = users.filter(user =>
            (user.name || '').toLowerCase().includes(searchQueries[AdminTab.USERS].toLowerCase()) ||
            (user.email || '').toLowerCase().includes(searchQueries[AdminTab.USERS].toLowerCase())
        );
        return (
          <div>
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h3 className="text-2xl font-semibold">Manage Users</h3>
                <input
                    type="text"
                    placeholder="Search by name or email..."
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
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user: Profile) => (
                                <tr key={user.id} className="border-b">
                                    <td className="py-3 px-4">{user.name || 'N/A'}</td>
                                    <td className="py-3 px-4 text-sm text-gray-600">{user.email || 'N/A'}</td>
                                    <td className="py-3 px-4">
                                        <div className="flex flex-wrap gap-1">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.is_suspended ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                {user.is_suspended ? 'Suspended' : 'Active'}
                                            </span>
                                            {user.is_admin && (
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    Admin
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center space-x-4">
                                            <button className="text-sm text-yellow-600 hover:text-yellow-900 font-medium" onClick={() => handleSuspendClick(user)}>
                                                {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                                            </button>
                                            <button className="text-sm text-red-600 hover:text-red-900 font-medium" onClick={() => handleDeleteClick(user)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        );
      case AdminTab.ORDERS:
        const searchQuery = searchQueries[AdminTab.ORDERS].toLowerCase();
        const filteredOrders = orders.filter(order =>
            order.id.toString().slice(-6).includes(searchQuery) ||
            (order.profiles?.name || '').toLowerCase().includes(searchQuery)
        );
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
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                                            className={`p-1 border rounded-md text-sm ${
                                                order.status === 'Delivered' ? 'bg-green-100 border-green-200' : 
                                                order.status === 'Shipped' ? 'bg-blue-100 border-blue-200' : 'bg-yellow-100 border-yellow-200'
                                            }`}
                                        >
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Delivered">Delivered</option>
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
        const pageViewData = [
            { label: 'Home', value: 1200 },
            { label: 'Shop', value: 950 },
            { label: 'Laptop', value: 800 },
            { label: 'Contact', value: 450 },
            { label: 'About', value: 300 },
        ];
        return (
            <div>
                <h3 className="text-2xl font-semibold mb-6">Store Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="text-lg font-bold mb-4">Most Viewed Pages</h4>
                        <SimpleBarChart data={pageViewData} />
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                         <h4 className="text-lg font-bold mb-4">Top Selling Products</h4>
                         <ul className="space-y-3">
                             {products.slice(0,5).map((p, i) => (
                                 <li key={p.id} className="flex justify-between">
                                     <span>{i+1}. {p.name}</span>
                                     <span className="font-semibold">{15 - i} sales</span>
                                 </li>
                             ))}
                         </ul>
                    </div>
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
                                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">App Name</label>
                                <input type="text" id="siteName" value={siteContent.site_name || ''} onChange={(e) => handleSiteContentChange('site_name', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="heroTitle" className="block text-sm font-medium text-gray-700">Hero Title</label>
                                <input type="text" id="heroTitle" value={siteContent.hero_title || ''} onChange={(e) => handleSiteContentChange('hero_title', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="heroSubtitle" className="block text-sm font-medium text-gray-700">Hero Subtitle</label>
                                <textarea id="heroSubtitle" value={siteContent.hero_subtitle || ''} onChange={(e) => handleSiteContentChange('hero_subtitle', e.target.value)} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Sales Banner */}
                    <div className="p-6 border rounded-lg">
                        <h4 className="text-lg font-bold mb-4">Sales Countdown Banner</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="bannerIsActive" className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        id="bannerIsActive"
                                        checked={siteContent.sales_banner_is_active || false}
                                        onChange={(e) => handleSiteContentChange('sales_banner_is_active', e.target.checked)}
                                        className="h-5 w-5 rounded text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm font-medium text-gray-700">Display Banner</span>
                                </label>
                            </div>
                            <div /> 
                            <div>
                                <label htmlFor="bannerTitle" className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    id="bannerTitle"
                                    value={siteContent.sales_banner_title || ''}
                                    onChange={(e) => handleSiteContentChange('sales_banner_title', e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="bannerSubtitle" className="block text-sm font-medium text-gray-700">Subtitle</label>
                                <input
                                    type="text"
                                    id="bannerSubtitle"
                                    value={siteContent.sales_banner_subtitle || ''}
                                    onChange={(e) => handleSiteContentChange('sales_banner_subtitle', e.target.value)}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label htmlFor="bannerEndDate" className="block text-sm font-medium text-gray-700">Sale End Date & Time</label>
                                <input
                                    type="datetime-local"
                                    id="bannerEndDate"
                                    value={(siteContent.sales_banner_end_date || '').substring(0, 16)}
                                    onChange={(e) => {
                                        const date = new Date(e.target.value);
                                        handleSiteContentChange('sales_banner_end_date', date.toISOString());
                                    }}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Page */}
                    <div className="p-6 border rounded-lg">
                        <h4 className="text-lg font-bold mb-4">Contact Page Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="contactAddress" className="block text-sm font-medium text-gray-700">Address</label>
                                <input type="text" id="contactAddress" value={siteContent.contact_address || ''} onChange={(e) => handleSiteContentChange('contact_address', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="contactEmail" value={siteContent.contact_email || ''} onChange={(e) => handleSiteContentChange('contact_email', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                             <div>
                                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="tel" id="contactPhone" value={siteContent.contact_phone || ''} onChange={(e) => handleSiteContentChange('contact_phone', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                            </div>
                        </div>
                    </div>

                    {/* Social Media Handles */}
                    <div className="p-6 border rounded-lg">
                        <h4 className="text-lg font-bold mb-4">Social Media Handles</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="instagramHandle" className="block text-sm font-medium text-gray-700">Instagram Handle (without @)</label>
                                <input 
                                    type="text" 
                                    id="instagramHandle" 
                                    value={siteContent.social_instagram || ''} 
                                    onChange={(e) => handleSiteContentChange('social_instagram', e.target.value)} 
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    placeholder="EShopPro"
                                />
                            </div>
                            <div>
                                <label htmlFor="tiktokHandle" className="block text-sm font-medium text-gray-700">TikTok Handle (with @)</label>
                                <input 
                                    type="text" 
                                    id="tiktokHandle" 
                                    value={siteContent.social_tiktok || ''} 
                                    onChange={(e) => handleSiteContentChange('social_tiktok', e.target.value)} 
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    placeholder="@eshopro.official"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* About Page */}
                    <div className="p-6 border rounded-lg">
                        <h4 className="text-lg font-bold mb-4">About Us Page</h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="aboutTitle" className="block text-sm font-medium text-gray-700">Page Title</label>
                                    <input type="text" id="aboutTitle" value={siteContent.about_title || ''} onChange={(e) => handleSiteContentChange('about_title', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="aboutSubtitle" className="block text-sm font-medium text-gray-700">Page Subtitle</label>
                                    <textarea id="aboutSubtitle" value={siteContent.about_subtitle || ''} onChange={(e) => handleSiteContentChange('about_subtitle', e.target.value)} rows={2} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                                </div>
                                <div>
                                    <label htmlFor="storyTitle" className="block text-sm font-medium text-gray-700">Story Title</label>
                                    <input type="text" id="storyTitle" value={siteContent.about_story_title || ''} onChange={(e) => handleSiteContentChange('about_story_title', e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                                </div>
                                 <div>
                                    <label htmlFor="storyImageUrl" className="block text-sm font-medium text-gray-700">Upload Your Image</label>
                                    <input type="file" id="storyImageUrl" accept="image/*" onChange={handleStoryImageChange} disabled={isUploading} className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-primary hover:file:bg-violet-100" />
                                    {isUploading && siteContent.about_story_image_url && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                                    {siteContent.about_story_image_url && !isUploading && <img src={siteContent.about_story_image_url} alt="Story preview" className="mt-2 h-32 w-auto rounded-md shadow-sm" loading="lazy" decoding="async" />}
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="storyContent" className="block text-sm font-medium text-gray-700">Story Content</label>
                                    <textarea id="storyContent" value={siteContent.about_story_content || ''} onChange={(e) => handleSiteContentChange('about_story_content', e.target.value)} rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></textarea>
                                </div>
                            </div>

                            {/* Team Management */}
                            <div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                    <h5 className="text-md font-bold">Meet the Team</h5>
                                    <Button variant="secondary" onClick={() => { setEditingTeamMember({}); setIsTeamMemberModalOpen(true); }}>Add Member</Button>
                                </div>
                                <div className="mt-4 space-y-2">
                                    {teamMembers.map(member => (
                                        <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                                            <div className="flex items-center gap-3">
                                                <img src={member.image_url || ''} alt={member.name || ''} className="w-10 h-10 rounded-full object-cover" loading="lazy" decoding="async"/>
                                                <div>
                                                    <p className="font-semibold">{member.name}</p>
                                                    <p className="text-sm text-gray-500">{member.title}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="secondary" onClick={() => { setEditingTeamMember(member); setIsTeamMemberModalOpen(true); }}>Edit</Button>
                                                <Button variant="danger" onClick={() => handleDeleteTeamMember(member.id)}>Delete</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Theme Colors */}
                    <div className="p-6 border rounded-lg">
                        <h4 className="text-lg font-bold mb-4">Theme Colors</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">Primary</label>
                                <input type="color" id="primaryColor" value={themeColors.primary} onChange={(e) => setThemeColors(p => ({...p, primary: e.target.value}))} className="mt-1 h-10 w-full block border border-gray-300 cursor-pointer rounded-md" />
                            </div>
                             <div>
                                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">Secondary</label>
                                <input type="color" id="secondaryColor" value={themeColors.secondary} onChange={(e) => setThemeColors(p => ({...p, secondary: e.target.value}))} className="mt-1 h-10 w-full block border border-gray-300 cursor-pointer rounded-md" />
                            </div>
                             <div>
                                <label htmlFor="accentColor" className="block text-sm font-medium text-gray-700">Accent</label>
                                <input type="color" id="accentColor" value={themeColors.accent} onChange={(e) => setThemeColors(p => ({...p, accent: e.target.value}))} className="mt-1 h-10 w-full block border border-gray-300 cursor-pointer rounded-md" />
                            </div>
                        </div>
                    </div>

                    <Button onClick={handleContentSave} isLoading={isUploading} className="w-full text-lg py-3">Save All Changes</Button>
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
       <Modal isOpen={isEditCategoryModalOpen} onClose={() => setIsEditCategoryModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Edit Category Name</h2>
        {editingCategory && (
            <div className="space-y-4">
                <div>
                    <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                        Editing: <span className="font-semibold">{editingCategory.oldName}</span>
                    </label>
                    <input 
                        type="text"
                        id="categoryName"
                        value={editingCategory.newName} 
                        onChange={(e) => setEditingCategory(cat => cat ? {...cat, newName: e.target.value} : null)}
                        className="mt-1 w-full p-2 border rounded-md"
                    />
                </div>
                <Button onClick={handleUpdateCategory}>Save Changes</Button>
            </div>
        )}
    </Modal>
    <Modal isOpen={isAddCategoryModalOpen} onClose={() => setIsAddCategoryModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Add New Category</h2>
        <div className="space-y-4">
            <div>
                <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700">
                    Category Name
                </label>
                <input 
                    type="text"
                    id="newCategoryName"
                    value={newCategoryName} 
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="mt-1 w-full p-2 border rounded-md"
                    placeholder="e.g., Fitness"
                />
            </div>
            <Button onClick={handleAddCategory}>Save Category</Button>
        </div>
    </Modal>
    <Modal isOpen={isDeleteCategoryModalOpen} onClose={() => setIsDeleteCategoryModalOpen(false)}>
        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">
            Are you sure you want to delete the category "{deletingCategory?.name}"? This action cannot be undone.
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
                <label className="block text-sm font-medium text-gray-700">Upload Your Image</label>
                <input 
                type="file"
                accept="image/*"
                onChange={handleTeamMemberImageChange}
                disabled={isUploading}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-primary hover:file:bg-violet-100"
                />
                {isUploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
                {editingTeamMember.image_url && !isUploading && <img src={editingTeamMember.image_url} alt="Preview" className="mt-2 h-24 w-24 rounded-full object-cover" loading="lazy" decoding="async" />}
            </div>
            <Button onClick={handleSaveTeamMember} isLoading={isUploading}>Save Member</Button>
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
                            {viewingOrder.items.map(item => (
                                <tr key={item.id}>
                                    <td className="py-2 px-3 flex items-center gap-3">
                                        <img src={item.products?.image_url || ''} alt={item.products?.name} className="w-10 h-10 object-cover rounded" loading="lazy" decoding="async" />
                                        <span className="font-medium text-sm">{item.products?.name}</span>
                                    </td>
                                    <td className="py-2 px-3 text-sm">{item.quantity}</td>
                                    <td className="py-2 px-3">
                                        <select
                                            value={item.status}
                                            onChange={(e) => handleOrderItemStatusChange(viewingOrder.id, item.id, e.target.value as OrderItem['status'])}
                                            className="p-1 border rounded-md text-sm w-full"
                                        >
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
    <Modal isOpen={!!suspendingUser} onClose={() => setSuspendingUser(null)}>
        <h2 className="text-2xl font-bold mb-4">Confirm Action</h2>
        <p className="text-gray-600 mb-6">
            Are you sure you want to {suspendingUser?.is_suspended ? 'unsuspend' : 'suspend'} the account for "{suspendingUser?.name}"?
        </p>
        <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setSuspendingUser(null)}>Cancel</Button>
            <Button variant={suspendingUser?.is_suspended ? 'primary' : 'danger'} onClick={confirmSuspend}>
                {suspendingUser?.is_suspended ? 'Unsuspend' : 'Suspend'} Account
            </Button>
        </div>
    </Modal>
    <Modal isOpen={!!deletingUser} onClose={() => setDeletingUser(null)}>
        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
        <p className="text-gray-600 mb-6">
            Are you sure you want to permanently delete the account for "{deletingUser?.name}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
            <Button variant="secondary" onClick={() => setDeletingUser(null)}>Cancel</Button>
            <Button variant="danger" onClick={confirmDelete}>Delete User</Button>
        </div>
    </Modal>
    </div>
  );
};

export default AdminPage;