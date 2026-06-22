import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { fetchReviewsByBlog, createReview } from "../../services/apiReviews";

export const getReviews = createAsyncThunk("reviews/get", async (blogId) => {
    const response = await fetchReviewsByBlog(blogId);
    return { blogId, reviews: response.data };
});

export const postReview = createAsyncThunk(
    "reviews/post",
    async ({ blogId, author, rating, comment }) => {
        const review = {
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

const reviewSlice = createSlice({
    name: "review",
    initialState: {
        // reviews grouped by blogId
        byBlog: {},
        status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
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

export const selectReviewsForBlog = (blogId) => (state) =>
    state.review.byBlog[blogId] || [];
export const selectReviewsStatus = (state) => state.review.status;

export default reviewSlice.reducer;
