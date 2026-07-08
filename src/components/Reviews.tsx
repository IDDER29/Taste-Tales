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
import { Avatar } from "./ui/Avatar";
import { Button } from "./ui/Button";
import { Textarea } from "./ui/Textarea";

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
    <section className="rounded-3xl border border-sand-200/70 bg-white p-6 shadow-card sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-sand-950">
          Reviews
        </h2>
        <div className="flex items-center gap-3">
          <StarRating value={avg.value} />
          <span className="text-sm text-sand-600">
            {avg.count > 0
              ? `${avg.value} · ${avg.count} review${avg.count === 1 ? "" : "s"}`
              : "No reviews yet"}
          </span>
        </div>
      </div>

      {/* Review list */}
      {reviews.length > 0 && (
        <ul className="mt-6 space-y-5">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="flex gap-4 border-b border-sand-100 pb-5 last:border-0 last:pb-0"
            >
              <Avatar name={review.author} size="md" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-semibold text-sand-900">
                    {review.author}
                  </span>
                  <StarRating value={review.rating} size="text-sm" />
                  {formatDate(review.date) && (
                    <span className="text-xs text-sand-400">
                      {formatDate(review.date)}
                    </span>
                  )}
                </div>
                {review.comment && (
                  <p className="mt-1.5 text-sand-700">{review.comment}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Write a review (requires sign-in) */}
      <div className="mt-8 rounded-2xl bg-sand-50/70 p-5 sm:p-6">
        {session?.user ? (
          <form onSubmit={handleSubmit}>
            <h3 className="font-display text-lg font-semibold text-sand-950">
              Leave a review
            </h3>
            <p className="mt-1 text-sm text-sand-500">
              Writing as{" "}
              <span className="font-medium text-sand-700">
                {session.user.name || session.user.email}
              </span>
            </p>

            <div className="mt-4">
              <span className="mb-1.5 block text-sm font-medium text-sand-700">
                Your rating
              </span>
              <StarRating value={rating} onChange={setRating} size="text-2xl" />
            </div>

            <div className="mt-4">
              <label
                htmlFor="review-comment"
                className="mb-1.5 block text-sm font-medium text-sand-700"
              >
                Comment
              </label>
              <Textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share how it turned out, any tweaks you made…"
              />
            </div>

            {error && <p className="mt-3 text-sm text-brand-600">{error}</p>}

            <Button
              type="submit"
              className="mt-4"
              loading={loading || submitting}
            >
              {submitting ? "Submitting…" : "Submit review"}
            </Button>
          </form>
        ) : (
          <p className="text-center text-sand-600">
            <Link
              href="/login"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Sign in
            </Link>{" "}
            to write a review.
          </p>
        )}
      </div>
    </section>
  );
}

export default Reviews;
