import api from "../api/posts";
import { Review } from "../types";

// Reviews are a json-server resource: /reviews, filtered by blogId.
export const fetchReviewsByBlog = (blogId: string) =>
    api.get<Review[]>(`/reviews?blogId=${encodeURIComponent(blogId)}`);

export const createReview = (data: Review) => api.post<Review>("/reviews", data);
