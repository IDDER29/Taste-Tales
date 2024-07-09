import api from '../api/posts';
export const fetchArticles = () => api.get('/blogs');
export const createArticle = (data) => api.post('/blogs', data);
export const deleteArticle = (id) => api.delete(`/blogs/${id}`);
export const updateArticle = (id, data) => api.put(`/blogs/${id}`, data);
export const fetchArticleById = (id) => api.get(`/blogs/${id}`);

