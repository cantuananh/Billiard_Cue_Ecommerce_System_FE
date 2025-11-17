import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, User, MoreHorizontal } from 'lucide-react';
import WriteReview from './WriteReview';

const ReviewSection = ({ product }) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest, lowest
  const [showWriteReview, setShowWriteReview] = useState(false);

  // Mock reviews data - sau này sẽ thay bằng API thật
  const mockReviews = [
    {
      id: 1,
      userName: "Nguyễn Văn A",
      rating: 5,
      comment: "Sản phẩm rất tốt, chất lượng vượt mong đợi. Gậy cầm rất chắc tay, thiết kế đẹp. Giao hàng nhanh, đóng gói cẩn thận. Sẽ ủng hộ shop lâu dài!",
      date: "2024-11-15",
      helpful: 12,
      images: ["/review1.jpg", "/review2.jpg"],
      verified: true
    },
    {
      id: 2,
      userName: "Trần Thị B",
      rating: 4,
      comment: "Gậy đẹp, chất lượng ok. Tuy nhiên giá hơi cao so với mặt bằng chung. Nhưng nhìn chung vẫn hài lòng với sản phẩm.",
      date: "2024-11-10",
      helpful: 8,
      images: [],
      verified: true
    },
    {
      id: 3,
      userName: "Lê Minh C",
      rating: 5,
      comment: "Xuất sắc! Đây là lần đầu tôi mua gậy bi-a online và rất hài lòng. Sản phẩm giống hình 100%, chất lượng tuyệt vời.",
      date: "2024-11-08",
      helpful: 15,
      images: ["/review3.jpg"],
      verified: false
    },
    {
      id: 4,
      userName: "Phạm Văn D",
      rating: 3,
      comment: "Sản phẩm bình thường, không có gì đặc biệt. Giao hàng hơi chậm.",
      date: "2024-11-05",
      helpful: 3,
      images: [],
      verified: true
    },
    {
      id: 5,
      userName: "Hoàng Thị E",
      rating: 5,
      comment: "Cực kỳ hài lòng! Gậy rất đẹp và chất lượng. Shop tư vấn nhiệt tình, giao hàng nhanh. Chắc chắn sẽ quay lại mua thêm!",
      date: "2024-11-03",
      helpful: 20,
      images: ["/review4.jpg", "/review5.jpg", "/review6.jpg"],
      verified: true
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const calculateRatingStats = () => {
    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    mockReviews.forEach(review => {
      stats[review.rating]++;
    });
    return stats;
  };

  const ratingStats = calculateRatingStats();
  const totalReviews = mockReviews.length;
  const averageRating = mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  const displayedReviews = showAllReviews ? mockReviews : mockReviews.slice(0, 3);

  const handleWriteReviewSubmit = (reviewData) => {
    // Handle the submitted review data
    console.log('New review submitted:', reviewData);
    // Later: Add API call to submit review
  };

  return (
    <div className="bg-white border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h2>
        
        {/* Rating Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-sm text-gray-500">
              {totalReviews} đánh giá
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="lg:col-span-2">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = ratingStats[rating];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-3">
                    <span className="text-sm font-medium w-8">{rating} sao</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sort and Filter */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="highest">Điểm cao nhất</option>
              <option value="lowest">Điểm thấp nhất</option>
              <option value="helpful">Hữu ích nhất</option>
            </select>
          </div>
          
          <div className="text-sm text-gray-500">
            Hiển thị {displayedReviews.length} / {totalReviews} đánh giá
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {displayedReviews.map(review => (
            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {review.userName}
                      </h4>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Đã mua hàng
                        </span>
                      )}
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Rating and Date */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(review.date)}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Review Images */}
                  {review.images.length > 0 && (
                    <div className="flex space-x-2 mb-4">
                      {review.images.map((image, index) => (
                        <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg border overflow-hidden">
                          <img
                            src={image}
                            alt={`Review ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg';
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Helpful Actions */}
                  <div className="flex items-center space-x-4 text-sm">
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-indigo-600">
                      <ThumbsUp className="h-4 w-4" />
                      <span>Hữu ích ({review.helpful})</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-600">
                      <ThumbsDown className="h-4 w-4" />
                      <span>Không hữu ích</span>
                    </button>
                    <button className="text-gray-500 hover:text-indigo-600">
                      Trả lời
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {!showAllReviews && mockReviews.length > 3 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAllReviews(true)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Xem thêm {mockReviews.length - 3} đánh giá
            </button>
          </div>
        )}

        {/* Show Less Button */}
        {showAllReviews && mockReviews.length > 3 && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAllReviews(false)}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Thu gọn
            </button>
          </div>
        )}

        {/* Write Review Button */}
        <div className="mt-8 pt-6 border-t">
          <button 
            onClick={() => setShowWriteReview(true)}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300"
          >
            Viết đánh giá
          </button>
        </div>
      </div>

      {/* Write Review Modal */}
      <WriteReview
        product={product}
        isOpen={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        onSubmit={handleWriteReviewSubmit}
      />
    </div>
  );
};

export default ReviewSection;