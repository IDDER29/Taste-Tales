import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { fetchReviewsByBlog, createReview } from "../../services/apiReviews";
import type { RootState } from "../../app/store";
import type { Review } from "../../types";

type RequestStatus = "idle" | "loading" | "succeeded" | "failed";

interface ReviewState {
    byBlog: Record<string, Review[]>;
    status: RequestStatus;
    error: string | null;
}

interface PostReviewArgs {
    blogId: string;
    author?: string;
    rating: number | string;
    comment?: string;
}

export const getReviews = createAsyncThunk("reviews/get", async (blogId: string) => {
    const response = await fetchReviewsByBlog(blogId);
    return { blogId, reviews: response.data };
});

export const postReview = createAsyncThunk(
    "reviews/post",
    async ({ blogId, author, rating, comment }: PostReviewArgs) => {
        const review: Review = {
            id: uuidv4(),
            blogId,
            author: author || "Anonymous",
            rating: Number(rating) || 0,
            comment: comment || "",
            date: new Date().toISOString(),
        };
        const response = await createReview(review);
        return response.data;
    }
);

const initialState: ReviewState = {
    byBlog: {},
    status: "idle",
    error: null,
};

const reviewSlice = createSlice({
    name: "review",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getReviews.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(getReviews.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.byBlog[action.payload.blogId] = action.payload.reviews;
            })
            .addCase(getReviews.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error?.message || "Failed to load reviews";
            })
            .addCase(postReview.fulfilled, (state, action) => {
                const r = action.payload;
                if (!state.byBlog[r.blogId]) state.byBlog[r.blogId] = [];
                state.byBlog[r.blogId].push(r);
            });
    },
});

export const selectReviewsForBlog = (blogId: string) => (state: RootState) =>
    state.review.byBlog[blogId] || [];
export const selectReviewsStatus = (state: RootState) => state.review.status;

export default reviewSlice.reducer;
