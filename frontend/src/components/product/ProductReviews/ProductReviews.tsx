import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@components/ui/Button/Button';
import Rating from '@components/ui/Rating/Rating';
import { FaStar, FaThumbsUp, FaFlag, FaCheck, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';

/**
 * Review Schema
 */
const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(5, 'Title must be at least 5 characters').max(100),
  content: z.string().min(20, 'Review must be at least 20 characters').max(2000),
  pros: z.string().optional(),
  cons: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ProductReviewsProps {
  productId: string;
  reviewSummary?: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
    percentageRecommend: number;
  };
  reviews?: any[];
}

/**
 * Product Reviews Component
 */
const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  reviewSummary,
  reviews = [],
}) => {
  const [showForm, setShowForm] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [sortBy, setSortBy] = useState('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
    },
  });

  const watchedRating = watch('rating', 0);

  const handleReviewSubmit = (data: ReviewFormData) => {
    console.log(`Review submitted for product ${productId}:`, data);
    toast.success('Review submitted successfully!');
    setShowForm(false);
  };

  return (
    <div>
      {/* Review Summary */}
      {reviewSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Average Rating */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl font-bold text-gray-900">
                {reviewSummary.averageRating.toFixed(1)}
              </span>
              <div>
                <Rating rating={reviewSummary.averageRating} size="lg" />
                <p className="text-sm text-gray-500 mt-1">
                  {reviewSummary.totalReviews.toLocaleString()} total ratings
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              {reviewSummary.percentageRecommend}% of customers recommend this product
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviewSummary.ratingDistribution[star] || 0;
              const percentage = reviewSummary.totalReviews > 0
                ? (count / reviewSummary.totalReviews) * 100
                : 0;

              return (
                <button
                  key={star}
                  onClick={() => setFilterRating(filterRating === star ? null : star)}
                  className={`w-full flex items-center gap-3 text-sm hover:bg-gray-50 px-2 py-1 rounded transition-colors
                    ${filterRating === star ? 'bg-amazon-orange bg-opacity-10' : ''}`}
                >
                  <span className="w-12 text-right">{star} star</span>
                  <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-gray-500">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Write Review Button */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Customer Reviews ({reviews.length})
        </h3>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          Write a Review
        </Button>
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="card-amazon p-6 mb-8 animate-fade-in">
          <h4 className="font-semibold text-gray-900 mb-4">Write Your Review</h4>
          
          <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating *
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setValue('rating', star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    <FaStar
                      className={
                        star <= (hoverRating || watchedRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-sm text-red-600 mt-1">{errors.rating.message}</p>
              )}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Review Title *
              </label>
              <input
                {...register('title')}
                placeholder="Summarize your review"
                className="input-amazon"
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review *
              </label>
              <textarea
                {...register('content')}
                rows={4}
                placeholder="What did you like or dislike? What did you use this product for?"
                className="input-amazon resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 20 characters
              </p>
              {errors.content && (
                <p className="text-sm text-red-600 mt-1">{errors.content.message}</p>
              )}
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pros (optional)
                </label>
                <textarea
                  {...register('pros')}
                  rows={2}
                  placeholder="What did you like?"
                  className="input-amazon resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cons (optional)
                </label>
                <textarea
                  {...register('cons')}
                  rows={2}
                  placeholder="What could be improved?"
                  className="input-amazon resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                Submit Review
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Sort Reviews */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-gray-600">Sort by:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 border rounded text-sm"
        >
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-0">
            <div className="flex items-start gap-3">
              {/* User Avatar */}
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUser className="text-gray-500" />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{review.userName}</span>
                  {review.verifiedPurchase && (
                    <span className="text-xs text-green-600 flex items-center gap-1">
                      <FaCheck />
                      Verified Purchase
                    </span>
                  )}
                  {review.isTopContributor && (
                    <span className="text-xs bg-amazon-orange text-white px-2 py-0.5 rounded">
                      Top Contributor
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <Rating rating={review.rating} size="sm" showValue={false} />
                  <span className="text-sm font-medium text-gray-900">{review.title}</span>
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Reviewed on {new Date(review.createdAt).toLocaleDateString()}
                </p>

                {review.variantInfo && (
                  <p className="text-xs text-gray-500 mt-1">
                    {Object.entries(review.variantInfo).map(([key, value]) => (
                      `${key}: ${value}`
                    )).join(', ')}
                  </p>
                )}

                <p className="text-sm text-gray-700 mt-3">{review.content}</p>

                {/* Pros & Cons */}
                {review.pros && review.pros.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-green-700">Pros:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {review.pros.map((pro: string, i: number) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {review.cons && review.cons.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-700">Cons:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {review.cons.map((con: string, i: number) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((img: string, i: number) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Review image ${i + 1}`}
                        className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                      />
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-gray-500">
                    {review.helpfulCount} people found this helpful
                  </span>
                  <button className="text-xs text-amazon-blue hover:underline flex items-center gap-1">
                    <FaThumbsUp />
                    Helpful
                  </button>
                  <button className="text-xs text-gray-500 hover:underline">
                    <FaFlag />
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
