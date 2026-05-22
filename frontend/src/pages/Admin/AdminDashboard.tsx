import React, { useState } from 'react';
import { FaUsers, FaBox, FaShoppingCart, FaDollarSign, FaSearch, FaEdit, FaTrash, FaStar, FaToggleOn, FaToggleOff, FaTimes } from 'react-icons/fa';
import { formatPrice } from '@utils/formatPrice';
import toast from 'react-hot-toast';
import { mockAdminDashboard, mockUsers, mockProducts } from '@services/mockData';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const stats = mockAdminDashboard;
  const users = { users: searchTerm ? mockUsers.filter(u => u.email.includes(searchTerm) || u.firstName.includes(searchTerm)) : mockUsers, total: mockUsers.length };
  const products = { products: searchTerm ? mockProducts.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase())) : mockProducts, total: mockProducts.length };

  const handleToggleStatus = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (user) { user.isActive = !user.isActive; toast.success(`User ${user.isActive ? 'activated' : 'deactivated'}`); }
  };
  const handleDeleteUser = (userId: string) => {
    const idx = mockUsers.findIndex(u => u.id === userId);
    if (idx !== -1) { mockUsers.splice(idx, 1); toast.success('User deleted!'); }
  };
  const handleEditUser = (user: any) => { setEditingUser(user); setShowUserModal(true); };
  const handleRoleChange = (role: string) => {
    if (editingUser) { editingUser.role = role; toast.success('Role updated!'); setShowUserModal(false); setEditingUser(null); }
  };
  const handleToggleFeatured = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) { product.isBestSeller = !product.isBestSeller; toast.success(`Product ${product.isBestSeller ? 'featured' : 'unfeatured'}`); }
  };
  const handleDeleteProduct = (productId: string) => {
    const idx = mockProducts.findIndex(p => p.id === productId);
    if (idx !== -1) { mockProducts.splice(idx, 1); toast.success('Product deleted!'); }
  };

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: <FaUsers />, color: 'bg-blue-500' },
    { label: 'Active Users', value: stats?.activeUsers || 0, icon: <FaUsers />, color: 'bg-green-500' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: <FaBox />, color: 'bg-purple-500' },
    { label: 'Revenue', value: formatPrice(stats?.totalRevenue || 0), icon: <FaDollarSign />, color: 'bg-amazon-orange' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-amazon-navy text-white px-6 py-4"><div className="max-w-7xl mx-auto"><h1 className="text-2xl font-bold">Admin Panel</h1><p className="text-sm text-gray-300">Manage your store (Mock Data)</p></div></div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm p-4">
              <span className={`${stat.color} text-white p-2 rounded-lg inline-block mb-2 text-sm`}>{stat.icon}</span>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p><p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex border-b">
            {[{ id: 'overview', label: '📊 Overview' }, { id: 'users', label: '👥 Users' }, { id: 'products', label: '📦 Products' }, { id: 'orders', label: '📋 Orders' }].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-5 py-3.5 text-sm font-medium border-b-2 ${activeTab === tab.id ? 'border-amazon-orange text-amazon-orange bg-orange-50' : 'border-transparent text-gray-500'}`}>{tab.label}</button>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-3 gap-4">
              {[{ title: 'Manage Users', icon: <FaUsers size={28} />, action: () => setActiveTab('users') }, { title: 'Manage Products', icon: <FaBox size={28} />, action: () => setActiveTab('products') }, { title: 'View Orders', icon: <FaShoppingCart size={28} />, action: () => setActiveTab('orders') }].map((item, i) => (
                <button key={i} onClick={item.action} className="p-6 border-2 border-gray-100 rounded-xl hover:border-amazon-orange text-center"><span className="text-amazon-orange block mb-2">{item.icon}</span><span className="font-semibold">{item.title}</span></button>
              ))}
            </div>
          )}
          {activeTab === 'users' && (
            <div>
              <div className="mb-4"><div className="relative max-w-md"><FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search users..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange text-sm" /></div></div>
              <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3">User</th><th className="text-left px-4 py-3">Email</th><th className="text-left px-4 py-3">Role</th><th className="text-left px-4 py-3">Status</th><th className="text-right px-4 py-3">Actions</th></tr></thead>
                <tbody className="divide-y">{users.users.map((u: any) => (<tr key={u.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium">{u.firstName} {u.lastName}</td><td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td><td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>{u.role}</span></td><td className="px-4 py-3"><button onClick={() => handleToggleStatus(u.id)} className={`px-2 py-1 rounded-full text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.isActive ? <><FaToggleOn className="inline mr-1" />Active</> : <><FaToggleOff className="inline mr-1" />Banned</>}</button></td><td className="px-4 py-3 text-right"><button onClick={() => handleEditUser(u)} className="text-blue-600 hover:text-blue-800 mr-2"><FaEdit /></button><button onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button></td></tr>))}</tbody></table>
            </div>
          )}
          {activeTab === 'products' && (
            <div>
              <table className="w-full text-sm"><thead className="bg-gray-50"><tr><th className="text-left px-4 py-3">Product</th><th className="text-left px-4 py-3">Price</th><th className="text-left px-4 py-3">Rating</th><th className="text-left px-4 py-3">Featured</th><th className="text-right px-4 py-3">Actions</th></tr></thead>
                <tbody className="divide-y">{products.products.map((p: any) => (<tr key={p.id} className="hover:bg-gray-50"><td className="px-4 py-3 font-medium max-w-xs truncate">{p.title}</td><td className="px-4 py-3">{formatPrice(p.pricing?.salePrice || p.pricing?.basePrice || 0)}</td><td className="px-4 py-3">⭐ {p.rating?.toFixed(1) || '0.0'}</td><td className="px-4 py-3"><button onClick={() => handleToggleFeatured(p.id)} className={p.isBestSeller ? 'text-yellow-500' : 'text-gray-300'}><FaStar size={18} /></button></td><td className="px-4 py-3 text-right"><button onClick={() => handleDeleteProduct(p.id)} className="text-red-600 hover:text-red-800"><FaTrash /></button></td></tr>))}</tbody></table>
            </div>
          )}
          {activeTab === 'orders' && <div className="text-center py-16 text-gray-500"><FaShoppingCart size={56} className="mx-auto mb-4 text-gray-300" /><p className="text-lg">Orders coming soon!</p></div>}
        </div>
      </div>
      {showUserModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96"><h3 className="text-lg font-semibold mb-2">Edit Role - {editingUser.firstName}</h3>
            {['CUSTOMER', 'SELLER', 'ADMIN'].map(r => (<button key={r} onClick={() => handleRoleChange(r)} className={`w-full text-left px-4 py-2.5 rounded-lg border mb-2 ${editingUser.role === r ? 'border-amazon-orange bg-orange-50' : ''}`}>{r}</button>))}
            <button onClick={() => setShowUserModal(false)} className="w-full mt-2 py-2 bg-gray-200 rounded-lg">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;