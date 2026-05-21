import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@services/api';
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign, FaSearch, FaEdit, FaTrash, FaStar, FaToggleOn, FaToggleOff, FaTimes } from 'react-icons/fa';
import Spinner from '@components/ui/Spinner/Spinner';
import { formatPrice } from '@utils/formatPrice';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // ========== QUERIES ==========
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => apiService.get('/admin/dashboard'),
    retry: false,
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: () => apiService.get('/admin/users', { page: 1, limit: 50, search: searchTerm || undefined }),
    enabled: activeTab === 'users',
    retry: false,
  });

  const { data: products } = useQuery({
    queryKey: ['admin-products', searchTerm],
    queryFn: () => apiService.get('/admin/products', { page: 1, limit: 50, search: searchTerm || undefined }),
    enabled: activeTab === 'products',
    retry: false,
  });

  // ========== MUTATIONS ==========

  // Toggle User Status (Active/Banned)
  const toggleStatusMutation = useMutation({
    mutationFn: (userId: string) => apiService.put(`/admin/users/${userId}/toggle-status`),
    onSuccess: (data: any) => {
      toast.success(data?.message || 'Status updated!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update status');
    },
  });

  // Update User Role
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      apiService.put(`/admin/users/${userId}/role`, { role }),
    onSuccess: (data: any) => {
      toast.success(data?.message || 'Role updated!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setShowUserModal(false);
      setEditingUser(null);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update role');
    },
  });

  // Delete User
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => apiService.delete(`/admin/users/${userId}`),
    onSuccess: (data: any) => {
      toast.success(data?.message || 'User deleted!');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete user');
    },
  });

  // Toggle Product Featured
  const toggleFeaturedMutation = useMutation({
    mutationFn: (productId: string) => apiService.put(`/admin/products/${productId}/toggle-featured`),
    onSuccess: (data: any) => {
      toast.success(data?.message || 'Product featured status updated!');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update product');
    },
  });

  // Delete Product
  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) => apiService.delete(`/admin/products/${productId}`),
    onSuccess: (data: any) => {
      toast.success(data?.message || 'Product deleted!');
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete product');
    },
  });

  // ========== HANDLERS ==========
  const handleToggleStatus = (userId: string) => {
    if (window.confirm('Are you sure you want to toggle this user status?')) {
      toggleStatusMutation.mutate(userId);
    }
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleEditUser = (user: any) => {
    setEditingUser(user);
    setShowUserModal(true);
  };

  const handleRoleChange = (role: string) => {
    if (editingUser) {
      updateRoleMutation.mutate({ userId: editingUser.id, role });
    }
  };

  const handleToggleFeatured = (productId: string) => {
    toggleFeaturedMutation.mutate(productId);
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(productId);
    }
  };

  // ========== LOADING ==========
  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  // ========== STATS ==========
  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FaUsers />, color: 'bg-blue-500' },
    { label: 'Active Users', value: stats?.activeUsers || 0, icon: <FaUsers />, color: 'bg-green-500' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: <FaBox />, color: 'bg-purple-500' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <FaShoppingCart />, color: 'bg-orange-500' },
    { label: 'Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: <FaDollarSign />, color: 'bg-amazon-orange' },
    { label: 'Pending Orders', value: stats?.pendingOrders || 0, icon: <FaShoppingCart />, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-amazon-navy text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Panel</h1>
            <p className="text-sm text-gray-300">Manage your entire store</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            System Online
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
              <span className={`${stat.color} text-white p-2 rounded-lg inline-block mb-2 text-sm`}>{stat.icon}</span>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'users', label: '👥 Users' },
              { id: 'products', label: '📦 Products' },
              { id: 'orders', label: '📋 Orders' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? 'border-amazon-orange text-amazon-orange bg-orange-50' : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">

          {/* ========== OVERVIEW TAB ========== */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Manage Users', desc: 'View, edit, or ban users', icon: <FaUsers size={28} />, action: () => setActiveTab('users') },
                { title: 'Manage Products', desc: 'Feature or remove products', icon: <FaBox size={28} />, action: () => setActiveTab('products') },
                { title: 'View Orders', desc: 'Track and manage orders', icon: <FaShoppingCart size={28} />, action: () => setActiveTab('orders') },
              ].map((item, i) => (
                <button key={i} onClick={item.action} className="p-6 border-2 border-gray-100 rounded-xl hover:border-amazon-orange hover:bg-orange-50 transition-all text-center group">
                  <span className="text-amazon-orange block mb-3 group-hover:scale-110 transition-transform">{item.icon}</span>
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          )}

          {/* ========== USERS TAB ========== */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="relative max-w-md flex-1">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text" placeholder="Search users by name or email..." value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange text-sm"
                  />
                </div>
                <span className="text-sm text-gray-500 ml-4">
                  {users?.total || 0} users found
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">User</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users?.users?.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-500">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                            user.role === 'SELLER' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>{user.role}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                              }`}
                            title="Click to toggle status"
                          >
                            {user.isActive ? <><FaToggleOn className="inline mr-1" /> Active</> : <><FaToggleOff className="inline mr-1" /> Banned</>}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1.5 rounded transition-colors mr-1"
                            title="Edit user role"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded transition-colors"
                            title="Delete user"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!users?.users || users.users.length === 0) && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========== PRODUCTS TAB ========== */}
          {activeTab === 'products' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="relative max-w-md flex-1">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text" placeholder="Search products..." value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange text-sm"
                  />
                </div>
                <span className="text-sm text-gray-500 ml-4">
                  {products?.total || 0} products found
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Product</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Price</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Rating</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Reviews</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Stock</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">Featured</th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products?.products?.map((product: any) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">{product.title}</p>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </td>
                        <td className="px-4 py-3 font-medium">{formatPrice(product.basePrice)}</td>
                        <td className="px-4 py-3">
                          <span className="text-yellow-500">⭐</span> {product.averageRating?.toFixed(1) || '0.0'}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{product.totalReviews || 0}</td>
                        <td className="px-4 py-3">
                          <span className={`font-medium ${product.totalQuantity === 0 ? 'text-red-600' : product.totalQuantity < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                            {product.totalQuantity || 0}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleFeatured(product.id)}
                            className={`cursor-pointer hover:scale-110 transition-transform ${product.isBestSeller ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
                              }`}
                            title={product.isBestSeller ? 'Click to unfeature' : 'Click to feature'}
                          >
                            <FaStar size={18} />
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded transition-colors"
                            title="Delete product"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!products?.products || products.products.length === 0) && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500">
                          No products found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========== ORDERS TAB ========== */}
          {activeTab === 'orders' && (
            <div className="text-center py-16">
              <FaShoppingCart size={56} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Orders Section</h3>
              <p className="text-gray-500">Full order management coming soon!</p>
            </div>
          )}
        </div>
      </div>

      {/* ========== EDIT USER MODAL ========== */}
      {showUserModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Edit User Role</h3>
              <button
                onClick={() => { setShowUserModal(false); setEditingUser(null); }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-4">
              <p className="font-medium">{editingUser.firstName} {editingUser.lastName}</p>
              <p className="text-sm text-gray-500">{editingUser.email}</p>
              <p className="text-sm text-gray-500 mt-1">Current Role: <span className="font-semibold">{editingUser.role}</span></p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Select New Role:</p>
              {['CUSTOMER', 'SELLER', 'ADMIN'].map(role => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  disabled={updateRoleMutation.isPending}
                  className={`w-full text-left px-4 py-2.5 rounded-lg border transition-colors text-sm ${editingUser.role === role
                    ? 'border-amazon-orange bg-orange-50 text-amazon-orange font-medium'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                >
                  {role === 'CUSTOMER' && '👤 Customer - Can only buy products'}
                  {role === 'SELLER' && '🏪 Seller - Can sell products'}
                  {role === 'ADMIN' && '👑 Admin - Full access'}
                </button>
              ))}
            </div>

            <button
              onClick={() => { setShowUserModal(false); setEditingUser(null); }}
              className="w-full mt-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;