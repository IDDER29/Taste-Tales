import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getReviews,
  postReview,
  selectReviewsForBlog,
  selectReviewsStatus,
} from "../features/review/reviewSlice";
import { averageRating } from "../utils/recipe";
import StarRating from "./StarRating";

// Format an ISO date string, guarding against invalid dates.
function formatDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString();
}

function Reviews({ blogId }) {
  const dispatch = useDispatch();
  const reviews = useSelector(selectReviewsForBlog(blogId));
  const status = useSelector(selectReviewsStatus);

  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(getReviews(blogId));
  }, [dispatch, blogId]);

  const avg = averageRating(reviews);
  const loading = status === "loading";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating < 1) {
      setError("Please select a rating.");
      return;
    }
    setError("");
    dispatch(postReview({ blogId, author, rating, comment }));
    setAuthor("");
    setRating(0);
    setComment("");
  };

  return (
    <section className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {/* Average rating summary */}
      <div className="flex items-center gap-3 mb-6">
        <StarRating value={avg.value} />
        <span className="text-gray-600">
          {avg.count > 0
            ? `${avg.value} out of 5 · ${avg.count} review${
                avg.count === 1 ? "" : "s"
              }`
            : "No reviews yet"}
        </span>
      </div>

      {/* Review list */}
      {reviews.length > 0 && (
        <ul className="space-y-4 mb-8">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="font-bold">{review.author}</span>
                <StarRating value={review.rating} size="text-sm" />
                {formatDate(review.date) && (
                  <span className="text-sm text-gray-400">
                    {formatDate(review.date)}
                  </span>
                )}
              </div>
              {review.comment && (
                <p className="text-gray-700 mt-1">{review.comment}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Write a review */}
      <form onSubmit={handleSubmit}>
        <h3 className="text-lg font-semibold mb-3">Write a review</h3>

        <div className="mb-3">
          <label
            htmlFor="review-author"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            id="review-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Anonymous"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="mb-3">
          <span className="block text-sm font-medium text-gray-700 mb-1">
            Your rating
          </span>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="mb-3">
          <label
            htmlFor="review-comment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Comment
          </label>
          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </section>
  );
}

export default Reviews;
