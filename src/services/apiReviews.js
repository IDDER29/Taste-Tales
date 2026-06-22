import api from "../api/posts";

// Reviews are a json-server resource: /reviews, filtered by blogId.
export const fetchReviewsByBlog = (blogId) =>
    api.get(`/reviews?blogId=${encodeURIComponent(blogId)}`);

export const createReview = (data) => api.post("/reviews", data);
