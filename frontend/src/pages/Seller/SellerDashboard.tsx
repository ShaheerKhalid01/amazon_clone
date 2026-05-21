import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Button from '@components/ui/Button/Button';
import Spinner from '@components/ui/Spinner/Spinner';
import { formatPrice } from '@utils/formatPrice';
import { 
  FaBox, FaDollarSign, FaStar, FaChartLine, FaPlus, 
  FaEdit, FaTrash, FaEye, FaSearch, FaFilter 
} from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import toast from 'react-hot-toast';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Seller Dashboard Component
 */
const SellerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Mock seller stats
  const stats = {
    totalProducts: 45,
    activeProducts: 38,
    totalSales: 1234,
    totalRevenue: 45678.90,
    averageRating: 4.5,
    totalReviews: 892,
  };

  // Mock products
  const { data: products, isLoading } = useQuery({
    queryKey: ['seller-products', { searchQuery, statusFilter, sortBy }],
    queryFn: async () => {
      return [
        {
          id: '1',
          title: 'Wireless Bluetooth Headphones',
          price: 99.99,
          stock: 150,
          sales: 234,
          revenue: 23397.66,
          rating: 4.5,
          status: 'active',
          lastUpdated: '2024-01-15',
          image: '/placeholder.png',
        },
        {
          id: '2',
          title: 'Yoga Mat Premium',
          price: 49.99,
          stock: 89,
          sales: 567,
          revenue: 28344.33,
          rating: 4.8,
          status: 'active',
          lastUpdated: '2024-01-14',
          image: '/placeholder.png',
        },
        {
          id: '3',
          title: 'Gaming Laptop Stand',
          price: 79.99,
          stock: 0,
          sales: 123,
          revenue: 9838.77,
          rating: 4.3,
          status: 'out_of_stock',
          lastUpdated: '2024-01-13',
          image: '/placeholder.png',
        },
      ];
    },
  });

  // Sales chart data
  const salesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Sales',
        data: [120, 190, 300, 250, 280, 350],
        borderColor: '#FF9900',
        backgroundColor: 'rgba(255, 153, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Revenue',
        data: [5000, 8000, 12000, 10000, 11500, 15000],
        borderColor: '#146EB4',
        backgroundColor: 'rgba(20, 110, 180, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      toast.success('Product deleted successfully');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">Active</span>;
      case 'out_of_stock':
        return <span className="px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">Out of Stock</span>;
      case 'draft':
        return <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium">Draft</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your products and track performance</p>
        </div>
        <Button variant="primary" size="lg" onClick={() => navigate('/seller/add-product')}>
          <FaPlus className="mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {[
          { label: 'Total Products', value: stats.totalProducts, icon: <FaBox />, color: 'text-blue-600' },
          { label: 'Active Products', value: stats.activeProducts, icon: <FaBox />, color: 'text-green-600' },
          { label: 'Total Sales', value: stats.totalSales, icon: <FaChartLine />, color: 'text-purple-600' },
          { label: 'Revenue', value: formatPrice(stats.totalRevenue), icon: <FaDollarSign />, color: 'text-amazon-orange' },
          { label: 'Avg Rating', value: `${stats.averageRating} ⭐`, icon: <FaStar />, color: 'text-yellow-600' },
          { label: 'Reviews', value: stats.totalReviews, icon: <FaStar />, color: 'text-pink-600' },
        ].map((stat) => (
          <div key={stat.label} className="card-amazon p-4">
            <div className={`text-2xl mb-2 ${stat.color}`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="card-amazon p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sales Overview</h2>
        <div className="h-64">
          <Line data={salesChartData} options={chartOptions} />
        </div>
      </div>

      {/* Products Table */}
      <div className="card-amazon overflow-hidden">
        {/* Table Header */}
        <div className="p-6 border-b">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Products</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amazon-orange text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amazon-orange"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="draft">Draft</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amazon-orange"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price_high">Price: High to Low</option>
                <option value="price_low">Price: Low to High</option>
                <option value="best_selling">Best Selling</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Sales</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Revenue</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products?.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{product.title}</p>
                          <p className="text-xs text-gray-500">{product.lastUpdated}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{formatPrice(product.price)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-600' : product.stock < 20 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.sales}</td>
                    <td className="px-6 py-4 text-sm font-medium">{formatPrice(product.revenue)}</td>
                    <td className="px-6 py-4 text-sm">⭐ {product.rating}</td>
                    <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="p-2 hover:bg-gray-100 rounded text-gray-600"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => navigate(`/seller/edit-product/${product.id}`)}
                          className="p-2 hover:bg-gray-100 rounded text-blue-600"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-gray-100 rounded text-red-600"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
