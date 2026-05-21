import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@components/ui/Button/Button';
import Input from '@components/ui/Input/Input';
import { FaUpload, FaSave, FaArrowLeft, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * Product Form Schema
 */
const productSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').max(500),
  brand: z.string().min(2, 'Brand is required'),
  category: z.string().min(1, 'Category is required'),
  subCategory: z.string().optional(),
  basePrice: z.string().min(1, 'Price is required'),
  salePrice: z.string().optional(),
  quantity: z.string().min(1, 'Quantity is required'),
  condition: z.enum(['NEW', 'RENEWED', 'USED']),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  bulletPoints: z.string().optional(),
  weight: z.string().optional(),
  length: z.string().optional(),
  width: z.string().optional(),
  height: z.string().optional(),
  isPrimeEligible: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

/**
 * Add Product Page Component
 */
const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      condition: 'NEW',
      isPrimeEligible: false,
    },
  });

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (images.length + files.length > 9) {
      toast.error('Maximum 9 images allowed');
      return;
    }

    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Handle form submission
  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, String(value));
        }
      });
      
      images.forEach(image => {
        formData.append('images', image);
      });

      // TODO: API call to save product
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Product added successfully!');
      navigate('/seller/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Electronics',
    'Fashion',
    'Home & Kitchen',
    'Books',
    'Sports & Outdoors',
    'Beauty',
    'Toys & Games',
    'Automotive',
  ];

  const conditions = [
    { value: 'NEW', label: 'New' },
    { value: 'RENEWED', label: 'Renewed' },
    { value: 'USED_LIKE_NEW', label: 'Used - Like New' },
    { value: 'USED_VERY_GOOD', label: 'Used - Very Good' },
    { value: 'USED_GOOD', label: 'Used - Good' },
    { value: 'USED_ACCEPTABLE', label: 'Used - Acceptable' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-700">
            <FaArrowLeft className="text-xl" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-500 text-sm">Fill in the details below to list your product</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Basic Information */}
        <div className="card-amazon p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <Input
              label="Product Title *"
              placeholder="Enter product title"
              error={errors.title?.message}
              {...register('title')}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Brand *"
                placeholder="Enter brand name"
                error={errors.brand?.message}
                {...register('brand')}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  {...register('category')}
                  className="input-amazon"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-sm text-red-600 mt-1">{errors.category.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition *</label>
              <select
                {...register('condition')}
                className="input-amazon"
              >
                {conditions.map(cond => (
                  <option key={cond.value} value={cond.value}>{cond.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="card-amazon p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Base Price ($) *"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.basePrice?.message}
              {...register('basePrice')}
            />
            <Input
              label="Sale Price ($)"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.salePrice?.message}
              {...register('salePrice')}
            />
            <Input
              label="Quantity *"
              type="number"
              placeholder="0"
              error={errors.quantity?.message}
              {...register('quantity')}
            />
          </div>
        </div>

        {/* Description */}
        <div className="card-amazon p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Description</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Description *</label>
              <textarea
                {...register('description')}
                rows={6}
                placeholder="Describe your product in detail..."
                className="input-amazon resize-none"
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bullet Points</label>
              <textarea
                {...register('bulletPoints')}
                rows={4}
                placeholder="Enter key features (one per line)"
                className="input-amazon resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">One feature per line</p>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card-amazon p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Images</h2>
          
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-4">
            {/* Image Previews */}
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
                <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <FaTimes className="text-xs" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 bg-amazon-orange text-white text-xs px-2 py-0.5 rounded">
                    Main
                  </span>
                )}
              </div>
            ))}

            {/* Upload Button */}
            {images.length < 9 && (
              <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-amazon-orange transition-colors">
                <FaUpload className="text-2xl text-gray-400 mb-2" />
                <span className="text-xs text-gray-500">Upload Image</span>
                <span className="text-xs text-gray-400">{images.length}/9</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Shipping */}
        <div className="card-amazon p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Dimensions</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Input
              label="Weight (kg)"
              type="number"
              step="0.01"
              {...register('weight')}
            />
            <Input
              label="Length (cm)"
              type="number"
              step="0.1"
              {...register('length')}
            />
            <Input
              label="Width (cm)"
              type="number"
              step="0.1"
              {...register('width')}
            />
            <Input
              label="Height (cm)"
              type="number"
              step="0.1"
              {...register('height')}
            />
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register('isPrimeEligible')}
                className="w-4 h-4 text-amazon-orange rounded focus:ring-amazon-orange"
              />
              <span className="text-sm text-gray-700">Prime Eligible (FBA)</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
          >
            <FaSave className="mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
