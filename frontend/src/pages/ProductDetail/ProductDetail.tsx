import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@services/product.service';
import { useCart } from '@hooks/useCart';
import ProductImages from '@components/product/ProductImage/ProductImage';
import ProductPrice from '@components/product/ProductPrice/ProductPrice';
import ProductVariants from '@components/product/ProductVariants/ProductVariants';
import ProductSpecs from '@components/product/ProductSpecs/ProductSpecs';
import ProductReviews from '@components/product/ProductReviews/ProductReviews';
import ProductCard from '@components/product/ProductCard/ProductCard';
import QuantitySelector from '@components/common/QuantitySelector/QuantitySelector';
import PrimeBadge from '@components/common/PrimeBadge/PrimeBadge';
import BestSellerBadge from '@components/common/BestSellerBadge/BestSellerBadge';
import DeliveryInfo from '@components/common/DeliveryInfo/DeliveryInfo';
import Rating from '@components/ui/Rating/Rating';
import Button from '@components/ui/Button/Button';
import Tabs from '@components/ui/Tabs/Tabs';
import Spinner from '@components/ui/Spinner/Spinner';
import { 
  FaShoppingCart, 
  FaHeart, 
  FaRegHeart, 
  FaShare, 
  FaShieldAlt, 
  FaUndo,
  FaMedal,
  FaStar
} from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * Product Detail Page Component
 */
const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Fetch product
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProductById(id!),
    enabled: !!id,
  });

  // Fetch related products
  const { data: relatedProducts } = useQuery({
    queryKey: ['related-products', id],
    queryFn: () => productService.getRelatedProducts(id!, 8),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-amazon mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Not Found</h1>
        <Link to="/products" className="text-amazon-blue hover:underline mt-4 inline-block">
          Browse Products
        </Link>
      </div>
    );
  }

  const currentVariant = product.variants?.find(v => v.id === selectedVariant);
  const currentPrice = currentVariant?.price || product.pricing?.salePrice || product.pricing?.basePrice || 0;
  const originalPrice = currentVariant?.compareAtPrice || product.pricing?.compareAtPrice;
  const isOnSale = product.pricing?.isOnSale || false;
  const isPrimeEligible = product.amazonFeatures?.isPrimeEligible || false;
  const isBestSeller = product.amazonFeatures?.isBestSeller || false;
  const isAmazonChoice = product.amazonFeatures?.isAmazonChoice || false;

  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      await addToCart({
        productId: product.id,
        variantId: selectedVariant || undefined,
        quantity,
      });
      toast.success('Added to cart!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle buy now
  const handleBuyNow = async () => {
    await handleAddToCart();
    window.location.href = '/checkout';
  };

  // Prepare tabs data
  const tabData = [
    {
      id: 'description',
      label: 'Description',
      content: (
        <div className="prose max-w-none">
          <h3 className="text-lg font-semibold mb-3">Product Description</h3>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
          
          {product.bulletPoints && product.bulletPoints.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-2">Key Features:</h4>
              <ul className="list-disc list-inside space-y-2">
                {product.bulletPoints.map((point: string, index: number) => (
                  <li key={index} className="text-gray-700">{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'specifications',
      label: 'Specifications',
      content: product.specifications ? (
        <ProductSpecs specifications={product.specifications} />
      ) : (
        <p className="text-gray-500">No specifications available</p>
      ),
    },
    {
      id: 'reviews',
      label: `Reviews (${product.reviewSummary?.totalReviews || 0})`,
      content: (
        <ProductReviews
          productId={product.id}
          reviewSummary={product.reviewSummary}
          reviews={product.reviews}
        />
      ),
    },
  ];

  return (
    <div className="max-w-amazon mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-amazon-blue">Home</Link>
        <span className="mx-2">›</span>
        <Link to={`/products?category=${product.category}`} className="hover:text-amazon-blue">
          {product.category?.replace(/_/g, ' ')}
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{product.title}</span>
      </nav>

      {/* Product Main Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product Images */}
          <div className="lg:col-span-1">
            <ProductImages images={product.images} />
          </div>

          {/* Product Info */}
          <div className="lg:col-span-1">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2">
              {product.title}
            </h1>
            
            {product.subtitle && (
              <p className="text-gray-500 mb-3">{product.subtitle}</p>
            )}

            {/* Brand */}
            <p className="text-sm text-gray-600 mb-3">
              Brand: <Link to={`/products?brand=${product.brand}`} className="text-amazon-blue hover:underline">{product.brand}</Link>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-4">
              <Rating 
                rating={product.reviewSummary?.averageRating || 0} 
                count={product.reviewSummary?.totalReviews}
                size="md"
              />
              {isBestSeller && <BestSellerBadge />}
              {isAmazonChoice && <span className="badge-amazon-choice text-xs">Amazon's Choice</span>}
            </div>

            <hr className="my-4" />

            {/* Price */}
            <ProductPrice
              currentPrice={currentPrice}
              originalPrice={originalPrice}
              isOnSale={isOnSale}
              savingsPercentage={product.pricing?.savingsPercentage}
            />

            {/* Prime & Delivery */}
            <div className="mt-4 space-y-2">
              {isPrimeEligible && <PrimeBadge />}
              <DeliveryInfo shipping={product.shipping} />
            </div>

            {/* Variants */}
            {product.options && product.options.length > 0 && (
              <div className="mt-6">
                <ProductVariants
                  options={product.options}
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                />
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity:
              </label>
              <QuantitySelector
                quantity={quantity}
                maxQuantity={currentVariant?.quantity || product.totalQuantity || 10}
                onChange={setQuantity}
              />
            </div>

            {/* Condition & Availability */}
            <div className="mt-4 text-sm">
              <p className="text-gray-600">
                Condition: <span className="font-medium">{product.condition?.replace(/_/g, ' ')}</span>
              </p>
              <p className={`font-medium ${product.availability === 'IN_STOCK' ? 'text-green-600' : 'text-red-600'}`}>
                {product.availability === 'IN_STOCK' ? '✓ In Stock' : '× Out of Stock'}
              </p>
            </div>

            {/* Seller Info */}
            <p className="mt-4 text-sm text-gray-500">
              Sold by: <span className="text-amazon-blue">{product.sellerName}</span>
              {product.sellerRating && (
                <span className="ml-2">
                  <FaStar className="inline text-yellow-400" /> {product.sellerRating.toFixed(1)}
                </span>
              )}
            </p>
          </div>

          {/* Buy Box */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-24">
              <ProductPrice
                currentPrice={currentPrice}
                originalPrice={originalPrice}
                isOnSale={isOnSale}
                savingsPercentage={product.pricing?.savingsPercentage}
                size="lg"
              />

              {isPrimeEligible && (
                <div className="mt-2">
                  <PrimeBadge />
                  <p className="text-sm text-gray-600 mt-1">
                    FREE delivery: <span className="font-medium">Tomorrow</span>
                  </p>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <p className={`text-sm ${product.availability === 'IN_STOCK' ? 'text-green-600' : 'text-red-600'}`}>
                  {product.availability === 'IN_STOCK' ? 'In Stock' : 'Currently Unavailable'}
                </p>

                {/* Quantity for Buy Box */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Qty:</span>
                  <QuantitySelector
                    quantity={quantity}
                    maxQuantity={currentVariant?.quantity || product.totalQuantity || 10}
                    onChange={setQuantity}
                    size="sm"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  loading={isAddingToCart}
                  disabled={product.availability === 'OUT_OF_STOCK'}
                >
                  <FaShoppingCart className="mr-2" />
                  Add to Cart
                </Button>

                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={handleBuyNow}
                  disabled={product.availability === 'OUT_OF_STOCK'}
                >
                  Buy Now
                </Button>
              </div>

              {/* Wishlist & Share */}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => setIsWishlisted(!isWishlisted)}
                >
                  {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                  <span className="ml-2">{isWishlisted ? 'Saved' : 'Add to Wishlist'}</span>
                </Button>
                <Button variant="outline" size="sm">
                  <FaShare />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <FaShieldAlt className="text-green-600" />
                  <span>Secure transaction</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUndo className="text-blue-600" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMedal className="text-yellow-600" />
                  <span>Amazon's Choice</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <Tabs tabs={tabData} variant="underline" />
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((related: any) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
