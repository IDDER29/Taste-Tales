"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  getReviews,
  postReview,
  selectReviewsForBlog,
  selectReviewsStatus,
} from "../features/review/reviewSlice";
import { averageRating } from "../utils/recipe";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import StarRating from "./StarRating";

interface ReviewsProps {
  blogId: string;
}

// Format an ISO date string, guarding against invalid dates.
function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString();
}

function Reviews({ blogId }: ReviewsProps) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const reviews = useAppSelector(selectReviewsForBlog(blogId));
  const status = useAppSelector(selectReviewsStatus);

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getReviews(blogId));
  }, [dispatch, blogId]);

  const avg = averageRating(reviews);
  const loading = status === "loading";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      setError("Please select a rating.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await dispatch(postReview({ blogId, rating, comment })).unwrap();
      setRating(0);
      setComment("");
    } catch {
      setError("Could not submit your review. Please try again.");
    } finally {
      setSubmitting(false);
    }
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

      {/* Write a review (requires sign-in) */}
      {session?.user ? (
        <form onSubmit={handleSubmit}>
          <h3 className="text-lg font-semibold mb-3">
            Write a review as{" "}
            <span className="text-red-500">
              {session.user.name || session.user.email}
            </span>
          </h3>

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
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setComment(e.target.value)
              }
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading || submitting}
            className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      ) : (
        <p className="text-gray-600">
          <Link href="/login" className="text-red-500 font-medium hover:underline">
            Sign in
          </Link>{" "}
          to write a review.
        </p>
      )}
    </section>
  );
}

export default Reviews;
