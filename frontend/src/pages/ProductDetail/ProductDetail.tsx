import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '@hooks/useCart';
import ProductPrice from '@components/product/ProductPrice/ProductPrice';
import Rating from '@components/ui/Rating/Rating';
import Button from '@components/ui/Button/Button';
import QuantitySelector from '@components/common/QuantitySelector/QuantitySelector';
import PrimeBadge from '@components/common/PrimeBadge/PrimeBadge';
import BestSellerBadge from '@components/common/BestSellerBadge/BestSellerBadge';
import DeliveryInfo from '@components/common/DeliveryInfo/DeliveryInfo';
import StockIndicator from '@components/common/StockIndicator/StockIndicator';
import { FaShoppingCart, FaHeart, FaRegHeart, FaShare, FaShieldAlt, FaUndo, FaTruck, FaChevronRight, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getApiUrl } from '@utils/apiBase';

const API_BASE = getApiUrl('');

// ── Helper: MongoDB ka simple product document ko is page ke expected (rich) shape mein convert karta hai ──
// Humara DB schema basic hai (title, basePrice, image string, rating) — lekin ye UI zyada detailed
// fields expect karta hai (images[], pricing{}, shipping{}, dimensions{}). Jo fields DB mein nahi hain,
// unke liye sensible defaults de diye hain taake page crash na ho aur sahi dikhe.
const normalizeProduct = (p: any) => {
  const basePrice = p.basePrice || 0;
  const salePrice = p.salePrice && p.salePrice < basePrice ? p.salePrice : undefined;
  const isOnSale = !!salePrice;
  const savingsPercentage = isOnSale ? Math.round(((basePrice - salePrice!) / basePrice) * 100) : 0;

  return {
    id: p._id,
    title: p.title,
    subtitle: '',
    brand: p.brand || 'Generic',
    manufacturer: p.brand || 'Unknown',
    description: p.description || 'No description available for this product yet.',
    bulletPoints: p.bulletPoints || [],
    category: p.category || 'ELECTRONICS',
    condition: 'NEW',
    originCountry: p.originCountry || 'N/A',
    images: p.image
      ? [{ id: 'img-1', url: p.image, thumbnailUrl: p.image, altText: p.title, isPrimary: true }]
      : [],
    pricing: {
      basePrice,
      salePrice,
      compareAtPrice: isOnSale ? basePrice : undefined,
      isOnSale,
      savingsPercentage,
    },
    rating: p.rating || 0,
    reviewCount: p.totalReviews || 0,
    isPrimeEligible: true,
    isBestSeller: !!p.isBestSeller,
    isAmazonChoice: false,
    availability: p.isActive === false ? 'OUT_OF_STOCK' : 'IN_STOCK',
    totalQuantity: 50, // Actual stock quantity DB mein track nahi ho raha abhi
    shipping: {
      freeShipping: true,
      estimatedDelivery: {
        standard: { minDays: 3, maxDays: 5, businessDays: true },
      },
      shipsFrom: 'US',
      internationalShipping: true,
    },
    sellerName: p.brand || 'Marketplace Seller',
    sellerRating: 4.5,
    badges: p.isBestSeller ? [{ type: 'BEST_SELLER', text: 'Best Seller' }] : [],
    dimensions: null,
  };
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // ── Real product fetch state ─────────────────────────────────────────
  const [rawProduct, setRawProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [relatedRaw, setRelatedRaw] = useState<any[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const res = await fetch(`${API_BASE}/products/${id}`, { cache: 'no-store' });
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const json = await res.json();
        if (json.success) {
          setRawProduct(json.data);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        toast.error('Could not connect to the server');
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // ── Related products (baaki sab products se, khud ko chhod kar) ────────
  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
        const json = await res.json();
        if (json.success) {
          setRelatedRaw(json.data.products.filter((p: any) => p._id !== id).slice(0, 4));
        }
      } catch (err) {
        // Related products fail hone par bhi page kaam karta rahe, koi error na dikhayein
      }
    };
    if (id) fetchRelated();
  }, [id]);

  const product = useMemo(() => (rawProduct ? normalizeProduct(rawProduct) : null), [rawProduct]);

  // 👇 NAYA: Jab product load ho, check karein ke ye pehle se wishlist mein hai ya nahi
  useEffect(() => {
    if (!product) return;
    const wishlist = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    setIsWishlisted(wishlist.some((w: any) => w.productId === product.id));
  }, [product]);
  const relatedProducts = useMemo(() => relatedRaw.map(normalizeProduct), [relatedRaw]);

  if (loading) {
    return (
      <div className="max-w-amazon mx-auto px-4 py-20 text-center text-gray-400">
        <FaSpinner className="animate-spin mx-auto mb-3" size={28} />
        <p>Loading product...</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="max-w-amazon mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">📦</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Button variant="primary" onClick={() => navigate('/products')}>Browse Products</Button>
      </div>
    );
  }

  const currentPrice = product.pricing?.salePrice || product.pricing?.basePrice || 0;
  const originalPrice = product.pricing?.compareAtPrice;
  const isOnSale = product.pricing?.isOnSale || false;
  const savings = product.pricing?.savingsPercentage || 0;

  // Add to Cart handler
  const handleAddToCart = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    setIsAddingToCart(true);

    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingIndex = cartItems.findIndex((item: any) => item.productId === product.id);

    if (existingIndex >= 0) {
      cartItems[existingIndex].quantity += quantity;
    } else {
      cartItems.push({
        productId: product.id,
        title: product.title,
        brand: product.brand,
        image: product.images?.[0]?.url || '',
        price: currentPrice,
        quantity: quantity,
        addedAt: new Date().toISOString(),
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
    window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { itemCount: totalItems } }));

    toast.success('Added to cart!');
    setTimeout(() => setIsAddingToCart(false), 400);
  };

  // Buy Now handler
  const handleBuyNow = () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    const buyNowItem = {
      productId: product.id,
      title: product.title,
      brand: product.brand,
      image: product.images?.[0]?.url || '',
      price: currentPrice,
      quantity: quantity,
    };

    localStorage.setItem('buyNowItem', JSON.stringify(buyNowItem));
    navigate('/checkout?buyNow=true');
  };

  return (
    <div className="max-w-amazon mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1 flex-wrap">
        <Link to="/" className="hover:text-amazon-blue">Home</Link>
        <FaChevronRight size={10} />
        <Link to="/products" className="hover:text-amazon-blue">Products</Link>
        <FaChevronRight size={10} />
        <Link to={`/products?category=${product.category?.toLowerCase()}`} className="hover:text-amazon-blue">
          {product.category?.replace(/_/g, ' ')}
        </Link>
        <FaChevronRight size={10} />
        <span className="text-gray-900 truncate">{product.title?.substring(0, 50)}...</span>
      </nav>

      {/* Main Product Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* ===== PRODUCT IMAGES ===== */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4 border">
                <img
                  src={product.images?.[selectedImage]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'}
                  alt={product.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform cursor-zoom-in"
                />
              </div>
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img: any, index: number) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index ? 'border-amazon-orange shadow-md' : 'border-gray-200 hover:border-gray-400'
                        }`}
                    >
                      <img src={img.thumbnailUrl || img.url} alt={img.altText} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ===== PRODUCT INFO ===== */}
          <div className="lg:col-span-1">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 mb-2 leading-snug">{product.title}</h1>
            {product.subtitle && <p className="text-gray-500 mb-3">{product.subtitle}</p>}

            <p className="text-sm text-gray-600 mb-3">
              Brand: <Link to={`/products?brand=${product.brand}`} className="text-amazon-blue hover:underline font-medium">{product.brand}</Link>
            </p>

            <div className="flex items-center flex-wrap gap-3 mb-4">
              <Rating rating={product.rating || 0} count={product.reviewCount} size="md" />
              {product.isBestSeller && <BestSellerBadge />}
              {product.isAmazonChoice && (
                <span className="bg-amazon-navy text-white text-xs px-2 py-1 rounded font-medium">Amazon's Choice</span>
              )}
            </div>

            <hr className="my-4" />

            <ProductPrice currentPrice={currentPrice} originalPrice={originalPrice} isOnSale={isOnSale} savingsPercentage={savings} size="lg" />

            <div className="mt-4 space-y-2">
              {product.isPrimeEligible && <PrimeBadge />}
              <DeliveryInfo shipping={product.shipping} isPrime={product.isPrimeEligible} />
            </div>

            <div className="mt-4">
              <StockIndicator availability={product.availability || 'IN_STOCK'} quantity={product.totalQuantity} />
            </div>

            {product.bulletPoints && product.bulletPoints.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">About this item</h3>
                <ul className="space-y-2">
                  {product.bulletPoints.map((point: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 flex gap-2">{point}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
              <QuantitySelector quantity={quantity} maxQuantity={Math.min(product.totalQuantity || 10, 30)} onChange={setQuantity} />
            </div>

            <p className="mt-4 text-sm text-gray-500">
              Sold by: <span className="text-amazon-blue font-medium">{product.sellerName}</span>
              {product.sellerRating && (
                <span className="ml-2 text-yellow-500">⭐ {product.sellerRating?.toFixed(1)}</span>
              )}
            </p>

            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {product.badges.map((badge: any, i: number) => (
                  <span key={i} className={`px-2 py-1 rounded-full text-xs font-medium ${badge.type === 'BEST_SELLER' ? 'bg-amazon-orange text-white' :
                    badge.type === 'AMAZON_CHOICE' ? 'bg-amazon-navy text-white' :
                      badge.type === 'SALE' ? 'bg-red-500 text-white' :
                        'bg-green-500 text-white'
                    }`}>{badge.text}</span>
                ))}
              </div>
            )}
          </div>

          {/* ===== BUY BOX ===== */}
          <div className="lg:col-span-1">
            <div className="border-2 border-gray-200 rounded-xl p-5 sticky top-24 bg-white shadow-sm">
              <ProductPrice currentPrice={currentPrice} originalPrice={originalPrice} isOnSale={isOnSale} savingsPercentage={savings} size="lg" />

              {product.isPrimeEligible && (
                <div className="mt-2">
                  <PrimeBadge />
                  <p className="text-sm text-gray-600 mt-1">FREE delivery: <span className="font-medium">Tomorrow</span></p>
                </div>
              )}

              <div className="mt-4 space-y-2">
                <StockIndicator availability={product.availability || 'IN_STOCK'} quantity={product.totalQuantity} />

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Qty:</span>
                  <QuantitySelector quantity={quantity} maxQuantity={Math.min(product.totalQuantity || 10, 30)} onChange={setQuantity} size="sm" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleAddToCart}
                  loading={isAddingToCart}
                  disabled={product.availability === 'OUT_OF_STOCK'}
                >
                  <FaShoppingCart className="mr-2" />
                  {product.availability === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
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

              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  onClick={() => {
                    const wishlist = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
                    if (isWishlisted) {
                      const updated = wishlist.filter((w: any) => w.productId !== product.id);
                      localStorage.setItem('wishlistItems', JSON.stringify(updated));
                      toast.success('Removed from wishlist');
                    } else {
                      wishlist.push({
                        productId: product.id,
                        title: product.title,
                        brand: product.brand,
                        image: product.images?.[0]?.url || '',
                        price: currentPrice,
                        originalPrice: originalPrice,
                        rating: product.rating,
                        reviewCount: product.reviewCount,
                        addedAt: new Date().toISOString(),
                      });
                      localStorage.setItem('wishlistItems', JSON.stringify(wishlist));
                      toast.success('Added to wishlist!');
                    }
                    setIsWishlisted(!isWishlisted);
                  }}
                >
                  {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                  <span className="ml-2">{isWishlisted ? 'Saved' : 'Add to Wishlist'}</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!'); }}>
                  <FaShare />
                </Button>
              </div>

              <div className="mt-6 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2"><FaShieldAlt className="text-green-600" /> Secure transaction</div>
                <div className="flex items-center gap-2"><FaUndo className="text-blue-600" /> 30-day easy returns</div>
                <div className="flex items-center gap-2"><FaTruck className="text-amazon-orange" /> Fast delivery available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PRODUCT DESCRIPTION ===== */}
      {product.description && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500">Brand</span>
              <p className="font-medium">{product.brand}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500">Manufacturer</span>
              <p className="font-medium">{product.manufacturer}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500">Condition</span>
              <p className="font-medium">{product.condition}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <span className="text-gray-500">Origin</span>
              <p className="font-medium">{product.originCountry}</p>
            </div>
          </div>
        </div>
      )}

      {/* ===== RELATED PRODUCTS ===== */}
      {relatedProducts.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {relatedProducts.map((related: any) => (
              <Link key={related.id} to={`/product/${related.id}`} className="card-amazon group overflow-hidden">
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <img
                    src={related.images?.[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'}
                    alt={related.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-amazon-blue">{related.title}</p>
                  <div className="mt-1"><Rating rating={related.rating || 0} count={related.reviewCount} size="sm" showValue={false} /></div>
                  <p className="text-lg font-bold text-gray-900 mt-1">${(related.pricing?.salePrice || related.pricing?.basePrice || 0).toFixed(2)}</p>
                  {related.isPrimeEligible && <span className="text-xs text-amazon-blue font-medium mt-1 block">✓ Prime</span>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;