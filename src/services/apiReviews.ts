import api from "../api/posts";
import type { Review } from "../types";
import { apiReviewToReview, type ApiReview, type Envelope } from "../api/mappers";

// Reviews are nested under a recipe: /api/v1/recipes/:id/reviews.

export const fetchReviewsByBlog = async (
    blogId: string
): Promise<{ data: Review[] }> => {
    const res = await api.get<Envelope<ApiReview[]>>(
        `/recipes/${blogId}/reviews`
    );
    return { data: res.data.data.map(apiReviewToReview) };
};

// Author is taken from the authenticated session server-side; the client only
// sends rating + comment.
export const createReview = async (
    blogId: string,
    rating: number,
    comment: string
): Promise<{ data: Review }> => {
    const res = await api.post<Envelope<ApiReview>>(
        `/recipes/${blogId}/reviews`,
        { rating, comment }
    );
    return { data: apiReviewToReview(res.data.data) };
};
