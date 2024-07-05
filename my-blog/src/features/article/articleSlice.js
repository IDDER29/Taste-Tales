import { v4 as uuid } from "uuid";
import { createSlice } from "@reduxjs/toolkit";
import { createArticle, deleteArticle, fetchArticleById, fetchArticles, updateArticle } from "../../services/apiPostes";
const initialState = {
    articles: []
}

export const articleSlice = createSlice({
    name: "article",
    initialState,
    reducers: {
        getAllArticles: (state) => {
            state.articles = [{
                "id": "8",
                "title": "Best Grilled Salmon",
                "subtitle": "Healthy and Tasty",
                "category": "Appetizer",
                "imageUrl": "https://media.istockphoto.com/id/516329534/photo/last-straw.jpg?s=2048x2048&w=is&k=20&c=1L46K6jtSK0cuy9YTGuR7yf8621sftHxEpTkoWtmmk4=",
                "views": 3100,
                "likes": 800,
                "publishedDate": "Nov 22, 2006",
                "publisher": {
                    "name": "Alice Johnson",
                    "image": "https://via.placeholder.com/40x40.png?text=AJ"
                },
                "content": "\n      <h1>Best Grilled Salmon</h1>\n      <h2>Healthy and Tasty</h2>\n      <p>Our grilled salmon is a delightful appetizer that combines healthiness with great taste. Perfectly grilled to bring out the rich flavors of the fish, it's sure to impress your guests.</p>\n      <h3>Ingredients</h3>\n      <ul>\n        <li>4 salmon fillets</li>\n        <li>2 tablespoons olive oil</li>\n        <li>1 tablespoon lemon juice</li>\n        <li>1 teaspoon garlic powder</li>\n        <li>Salt and pepper to taste</li>\n      </ul>\n      <h3>Preparation</h3>\n      <p>Brush salmon fillets with olive oil, lemon juice, and sprinkle with garlic powder, salt, and pepper. Grill over medium-high heat for about 5-7 minutes on each side or until the fish flakes easily with a fork. Serve with a side of vegetables or a fresh salad.</p>\n    "
            }];
        },
        addArticle: (state, action) => {
            const request = {
                id: uuid(),
                ...action.payload,
                views: 0,
                likes: 0,
                publishedDate: action.payload.publishedDate || new Date().toISOString(),
                publisher: action.payload.author || {
                    name: "Anonymous",
                    image: "https://via.placeholder.com/40x40.png?text=JD",
                }
            };
            const response = createArticle(request);
            state.articles.push(response.data);
            //  setArticleData([...articleData, response.data]);
            //setNotifications([...notifications, { type: 'new', message: 'New article created!' }]);
        },
        deleteAnArticle: (state, action) => {
            deleteArticle(action.payload);
            state.articles = state.articles.filter(article => article.id !== action.payload);
            // setArticleData(articleData.filter(article => article.id !== id));
            //setNotifications([...notifications, { type: 'delete', message: 'Article deleted!' }]);
        },
        updateAnArticle: (state, action) => {
            updateArticle(action.payload.id, action.payload);
            state.articles = state.articles.map(article => article.id === action.payload.id ? action.payload : article);
            // setArticleData(articleData.map(article => article.id === updatedArticle.id ? updatedArticle : article));
            //setNotifications([...notifications, { type: 'edit', message: 'Article updated!' }]);
        },
    }
})

export const { getAllArticles, addArticle, deleteAnArticle, updateAnArticle } = articleSlice.actions;
export default articleSlice.reducer;