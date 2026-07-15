import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign, FaSearch, FaEdit, FaTrash, FaStar, FaSpinner, FaLock } from 'react-icons/fa';
import { formatPrice } from '@utils/formatPrice';
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Real user state fetched from the backend
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Real product state fetched from the backend
  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Real order state fetched from the backend
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Real dashboard stats fetched from backend
  const [stats, setStats] = useState<any>({
    totalUsers: 0,
    activeUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    newUsersToday: 0,
    pendingOrders: 0,
  });
  const [statsLoading, setStatsLoading] = useState(false);

  // ── Refresh access token ───────────────────────────────────────────────
  const refreshAccessToken = useCallback(async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return null;

      const res = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!res.ok) return null;

      const json = await res.json();
      if (json.accessToken) {
        localStorage.setItem('accessToken', json.accessToken);
        return json.accessToken;
      }
      return null;
    } catch (err) {
      return null;
    }
  }, [API_BASE]);

  // ── Handle expired / invalid token ──────────────────────────────────────
  const handleAuthError = useCallback(async () => {
    const newToken = await refreshAccessToken();
    if (newToken) {
      return newToken;
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    toast.error('Session expired. Please log in again.');
    navigate('/login');
    return null;
  }, [navigate, refreshAccessToken]);

  // ── Fetch dashboard stats from the real backend API ─────────────────────
  const fetchDashboardStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      let token = localStorage.getItem('accessToken');
      let res = await fetch(`${API_BASE}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (res.status === 401 || res.status === 403) {
        const newToken = await handleAuthError();
        if (newToken) {
          res = await fetch(`${API_BASE}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${newToken}` },
            cache: 'no-store',
          });
        } else {
          return;
        }
      }

      const json = await res.json();
      if (json.success || json) {
        setStats(json);
      } else {
        toast.error(json.message || 'Failed to load dashboard stats');
      }
    } catch (err) {
      toast.error('Could not connect to the server');
    } finally {
      setStatsLoading(false);
    }
  }, [handleAuthError, API_BASE]);

  // ── Fetch users from the real backend API ──────────────────────────────
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      let token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        const newToken = await handleAuthError();
        if (newToken) {
          const retryRes = await fetch(`${API_BASE}/admin/users`, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
          const json = await retryRes.json();
          if (json.success) {
            setUsers(json.data.users);
          } else {
            toast.error(json.message || 'Failed to load users');
          }
        }
        return;
      }

      const json = await res.json();
      if (json.success) {
        setUsers(json.data.users);
      } else {
        toast.error(json.message || 'Failed to load users');
      }
    } catch (err) {
      toast.error('Could not connect to the server');
    } finally {
      setUsersLoading(false);
    }
  }, [handleAuthError, API_BASE]);

  // ── Fetch products from the real backend API ────────────────────────────
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      let token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/admin/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        const newToken = await handleAuthError();
        if (newToken) {
          const retryRes = await fetch(`${API_BASE}/admin/products`, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
          const json = await retryRes.json();
          if (json.success) {
            setProducts(json.data.products);
          } else {
            toast.error(json.message || 'Failed to load products');
          }
        }
        return;
      }

      const json = await res.json();
      if (json.success) {
        setProducts(json.data.products);
      } else {
        toast.error(json.message || 'Failed to load products');
      }
    } catch (err) {
      toast.error('Could not connect to the server');
    } finally {
      setProductsLoading(false);
    }
  }, [handleAuthError, API_BASE]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, fetchUsers]);

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
  }, [activeTab, fetchProducts]);

  // ── Fetch orders from the real backend API ──────────────────────────────
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      let token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        const newToken = await handleAuthError();
        if (newToken) {
          const retryRes = await fetch(`${API_BASE}/admin/orders`, {
            headers: { Authorization: `Bearer ${newToken}` },
          });
          const json = await retryRes.json();
          if (json.success) setOrders(json.data.orders);
        }
        return;
      }

      const json = await res.json();
      if (json.success) {
        setOrders(json.data.orders);
      } else {
        toast.error(json.message || 'Failed to load orders');
      }
    } catch (err) {
      toast.error('Could not connect to the server');
    } finally {
      setOrdersLoading(false);
    }
  }, [handleAuthError, API_BASE]);

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
  }, [activeTab, fetchOrders]);

  // ── Update order status via API ─────────────────────────────────────────
  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      let token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
        toast.success('Order status updated');
      } else {
        toast.error(json.message || 'Failed to update order');
      }
    } catch (err) {
      toast.error('Could not connect to the server');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // ── Overview: initial fetch + live WebSocket updates ────────────────────
  useEffect(() => {
    if (activeTab !== 'overview') return;

    // Pehle turant data le aayein (initial load)
    fetchDashboardStats();

    // Phir WebSocket connect karein taake future updates automatically aayein
    const token = localStorage.getItem('accessToken');
    const socket: Socket = io(`${API_BASE.replace('/api', '')}/admin`, {
      auth: { token },
    });

    // Jab bhi backend "dashboard:update" event bheje, stats turant refresh ho jayein
    socket.on('dashboard:update', (data) => {
      setStats(data);
    });

    socket.on('connect_error', (err) => {
      console.log('Admin socket connect failed:', err.message);
    });

    // Cleanup: jab user "overview" tab se hat jaye ya component unmount ho,
    // socket connection band kar dein taake memory leak na ho
    return () => {
      socket.disconnect();
    };
  }, [activeTab, API_BASE, fetchDashboardStats]);

  // ── Delete user via API ────────────────────────────────────────────────
  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    setDeletingId(userId);
    try {
      let token = localStorage.getItem('accessToken');
      let res = await fetch(`${API_BASE}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        const newToken = await handleAuthError();
        if (newToken) {
          res = await fetch(`${API_BASE}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${newToken}` },
          });
        } else {
          return;
        }
      }

      const json = await res.json();
      if (json.success) {
        // Remove from local state immediately — no refresh needed
        setUsers(prev => prev.filter(u => u._id !== userId));
        toast.success('User deleted successfully');
      } else {
        toast.error(json.message || 'Failed to delete user');
      }
    } catch (err) {
      toast.error('Could not connect to the server');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Update user role via API ───────────────────────────────────────────
  const handleRoleChange = async (role: string) => {
    if (!editingUser) return;
    try {
      let token = localStorage.getItem('accessToken');
      let res = await fetch(`${API_BASE}/admin/users/${editingUser._id}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });

      if (res.status === 401 || res.status === 403) {
        const newToken = await handleAuthError();
        if (newToken) {
          res = await fetch(`${API_BASE}/admin/users/${editingUser._id}/role`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${newToken}` },
            body: JSON.stringify({ role }),
          });
        } else {
          setShowUserModal(false);
          setEditingUser(null);
          return;
        }
      }

      const json = await res.json();
      if (json.success) {
        setUsers(prev => prev.map(u => u._id === editingUser._id ? { ...u, role } : u));
        toast.success('Role updated successfully');
      } else {
        toast.error(json.message || 'Failed to update role');
      }
    } catch (err) {
      toast.error('Could not connect to the server');
    } finally {
      setShowUserModal(false);
      setEditingUser(null);
    }
  };

  // ── Toggle product featured status via API ──────────────────────────────
  const handleToggleFeatured = async (productId: string) => {
    try {
      let token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/admin/products/${productId}/toggle-featured`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setProducts(prev => prev.map(p => p._id === productId ? { ...p, isBestSeller: !p.isBestSeller } : p));
        toast.success(json.message || 'Product updated');
      } else {
        toast.error(json.message || 'Failed to update product');
      }
    } catch (err) {
      toast.error('Could not connect to the server');
    }
  };

  // ── Delete product via API ───────────────────────────────────────────────
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      let token = localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) {
        setProducts(prev => prev.filter(p => p._id !== productId));
        toast.success('Product deleted!');
      } else {
        toast.error(json.message || 'Failed to delete product');
      }
    } catch (err) {
      toast.error('Could not connect to the server');
    }
  };

  const filteredUsers = searchTerm
    ? users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()))
    : users;

  const filteredProducts = searchTerm
    ? products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : products;

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FaUsers />, color: 'bg-blue-500' },
    { label: 'Active Users', value: stats?.activeUsers || 0, icon: <FaUsers />, color: 'bg-green-500' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: <FaBox />, color: 'bg-purple-500' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: <FaShoppingCart />, color: 'bg-yellow-500' },
    { label: 'Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: <FaDollarSign />, color: 'bg-amazon-orange' },
    { label: 'New Today', value: stats?.newUsersToday || 0, icon: <FaUsers />, color: 'bg-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-amazon-navy text-white px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-gray-300">Manage your store</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <span className={`${stat.color} text-white p-2 rounded-lg inline-block mb-2 text-sm`}>{stat.icon}</span>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            {[{ id: 'overview', label: '📊 Overview' }, { id: 'users', label: '👥 Users' }, { id: 'products', label: '📦 Products' }, { id: 'orders', label: '📋 Orders' }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-5 py-3.5 text-sm font-medium border-b-2 ${activeTab === tab.id ? 'border-amazon-orange text-amazon-orange bg-orange-50' : 'border-transparent text-gray-500'}`}>{tab.label}</button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          {/* Overview */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-4">
              {[{ title: 'Manage Users', icon: <FaUsers size={28} />, action: () => setActiveTab('users') }, { title: 'Manage Products', icon: <FaBox size={28} />, action: () => setActiveTab('products') }, { title: 'View Orders', icon: <FaShoppingCart size={28} />, action: () => setActiveTab('orders') }].map((item, i) => (
                <button key={i} onClick={item.action} className="p-6 border-2 border-gray-100 rounded-xl hover:border-amazon-orange text-center">
                  <span className="text-amazon-orange block mb-2">{item.icon}</span>
                  <span className="font-semibold">{item.title}</span>
                </button>
              ))}
            </div>
          )}

          {/* Users — fetched from real API */}
          {activeTab === 'users' && (
            <div>
              <div className="mb-4">
                <div className="relative max-w-md">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search users by name or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange text-sm" />
                </div>
              </div>
              {usersLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                  <FaSpinner className="animate-spin mr-2" size={20} /> Loading users...
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <FaUsers size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No users found. Registered users will appear here.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3">User</th>
                      <th className="text-left px-4 py-3">Email</th>
                      <th className="text-left px-4 py-3">Role</th>
                      <th className="text-left px-4 py-3">Joined</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.map((u: any) => (
                      <tr key={u._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : u.role === 'SELLER' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-right">
                          <button onClick={() => { setEditingUser(u); setShowUserModal(true); }} className="text-blue-600 hover:text-blue-800 mr-3" title="Edit role"><FaEdit /></button>
                          <button
                            onClick={() => handleDeleteUser(u._id)}
                            disabled={deletingId === u._id}
                            className="text-red-600 hover:text-red-800 disabled:opacity-40"
                            title="Delete user"
                          >
                            {deletingId === u._id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Products — fetched from real API */}
          {activeTab === 'products' && (
            <div>
              {productsLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                  <FaSpinner className="animate-spin mr-2" size={20} /> Loading products...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <FaBox size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No products found. Add products to see them here.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3">Product</th>
                      <th className="text-left px-4 py-3">Price</th>
                      <th className="text-left px-4 py-3">Rating</th>
                      <th className="text-left px-4 py-3">Featured</th>
                      <th className="text-right px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredProducts.map((p: any) => (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium max-w-xs truncate">{p.title}</td>
                        <td className="px-4 py-3">{formatPrice(p.salePrice || p.basePrice || 0)}</td>
                        <td className="px-4 py-3">⭐ {p.rating?.toFixed(1) || '0.0'}</td>
                        <td className="px-4 py-3"><button onClick={() => handleToggleFeatured(p._id)} className={p.isBestSeller ? 'text-yellow-500' : 'text-gray-300'}><FaStar size={18} /></button></td>
                        <td className="px-4 py-3 text-right"><button onClick={() => handleDeleteProduct(p._id)} className="text-red-600 hover:text-red-800"><FaTrash /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Orders — fetched from real API */}
          {activeTab === 'orders' && (
            <div>
              {ordersLoading ? (
                <div className="flex items-center justify-center py-16 text-gray-400">
                  <FaSpinner className="animate-spin mr-2" size={20} /> Loading orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <FaShoppingCart size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No orders yet. Orders placed by customers will appear here.</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3">Order ID</th>
                      <th className="text-left px-4 py-3">Customer</th>
                      <th className="text-left px-4 py-3">Items</th>
                      <th className="text-left px-4 py-3">Total</th>
                      <th className="text-left px-4 py-3">Date</th>
                      <th className="text-left px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((o: any) => (
                      <tr key={o._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs text-gray-500">{o._id.slice(-8).toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <div>{o.userId ? `${o.userId.firstName || ''} ${o.userId.lastName || ''}`.trim() || 'Unknown' : 'Guest'}</div>
                          {o.userId?.email && <div className="text-xs text-gray-400">{o.userId.email}</div>}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{o.items?.length || 0} item(s)</td>
                        <td className="px-4 py-3 font-medium">{formatPrice(o.total || 0)}</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <select
                            value={o.status}
                            disabled={updatingOrderId === o._id}
                            onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                            className={`text-xs font-medium rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-amazon-orange ${
                              o.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                              o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                              o.status === 'PROCESSING' ? 'bg-yellow-100 text-yellow-700' :
                              o.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <option value="PENDING">Pending</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Role Edit Modal */}
      {showUserModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96">
            <h3 className="text-lg font-semibold mb-1">Edit Role</h3>
            <p className="text-sm text-gray-500 mb-4">{editingUser.firstName} {editingUser.lastName} · {editingUser.email}</p>
            {['CUSTOMER', 'SELLER', 'ADMIN'].map(r => (
              <button key={r} onClick={() => handleRoleChange(r)} className={`w-full text-left px-4 py-2.5 rounded-lg border mb-2 font-medium ${editingUser.role === r ? 'border-amazon-orange bg-orange-50 text-amazon-orange' : 'border-gray-200 hover:border-gray-400'}`}>
                {r}
              </button>
            ))}
            <button onClick={() => { setShowUserModal(false); setEditingUser(null); }} className="w-full mt-2 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;