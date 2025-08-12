import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const mockVendors = [
  {
    id: 1,
    name: 'Mama Chika',
    type: 'Elderly/Trusted Vendor',
    verified: true,
    products: [
      { id: 1, name: 'Jollof Rice', price: 1500, rating: 4.8 },
      { id: 2, name: 'Moi Moi', price: 500, rating: 4.5 },
    ],
    reviews: [
      { id: 1, user: 'Ada', comment: 'Delicious food!', rating: 5 },
      { id: 2, user: 'Tunde', comment: 'Fast service.', rating: 4 },
    ],
  },
  {
    id: 2,
    name: 'John Doe',
    type: 'Student Vendor',
    verified: true,
    products: [
      { id: 1, name: 'Custom T-shirt', price: 3500, rating: 4.2 },
    ],
    reviews: [
      { id: 1, user: 'Bola', comment: 'Nice quality!', rating: 4 },
    ],
  },
];

const VendorProfile = () => {
  const { id } = useParams();
  const vendor = mockVendors.find(v => v.id === Number(id));

  // Add state for reviews
  const [reviews, setReviews] = useState(vendor ? vendor.reviews : []);
  const [reviewForm, setReviewForm] = useState({ user: '', comment: '', rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  if (!vendor) {
    return <div className="text-center text-white py-10">Vendor not found.</div>;
  }

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setReviewForm({ ...reviewForm, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setReviews([
        ...reviews,
        {
          id: reviews.length + 1,
          ...reviewForm,
          rating: Number(reviewForm.rating),
        },
      ]);
      setReviewForm({ user: '', comment: '', rating: 5 });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="bg-gray-800 rounded-lg p-6 mb-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-2xl font-bold text-white">
            {vendor.name[0]}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{vendor.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-300">{vendor.type}</span>
              {vendor.verified && (
                <span className="ml-2 px-2 py-1 bg-green-600 text-white text-xs rounded">Verified</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-white mb-2">Products</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {vendor.products.map(product => (
            <div key={product.id} className="bg-gray-900 rounded p-4 text-white">
              <div className="font-semibold">{product.name}</div>
              <div className="text-gray-400">₦{product.price}</div>
              <div className="text-yellow-400">Rating: {product.rating} ★</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Reviews</h3>
        <div className="space-y-3 mb-6">
          {reviews.map(review => (
            <div key={review.id} className="bg-gray-900 rounded p-3 text-white">
              <div className="flex items-center gap-2">
                <span className="font-bold">{review.user}</span>
                <span className="text-yellow-400">{'★'.repeat(review.rating)}</span>
              </div>
              <div className="text-gray-300">{review.comment}</div>
            </div>
          ))}
        </div>

        {/* Review Submission Form */}
        <form onSubmit={handleReviewSubmit} className="bg-gray-800 rounded p-4 space-y-3">
          <h4 className="text-white font-semibold mb-2">Leave a Review</h4>
          <div>
            <input
              type="text"
              name="user"
              value={reviewForm.user}
              onChange={handleReviewChange}
              required
              placeholder="Your Name"
              className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <textarea
              name="comment"
              value={reviewForm.comment}
              onChange={handleReviewChange}
              required
              placeholder="Your review"
              className="w-full px-3 py-2 rounded bg-gray-900 text-white border border-gray-700 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-gray-300 mr-2">Rating:</label>
            <select
              name="rating"
              value={reviewForm.rating}
              onChange={handleReviewChange}
              className="px-2 py-1 rounded bg-gray-900 text-white border border-gray-700"
            >
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorProfile;