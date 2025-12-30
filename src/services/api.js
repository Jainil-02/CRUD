import axios from "axios";

const API = axios.create({
  baseURL: "https://fakestoreapi.com",
});

export const getProducts = () => API.get("/products");
export const createProduct = (data) => API.post("/products", data);
export const editProduct = (id, data) => API.put(`/products/${id}`, data);
export const removeProduct = (id) => API.delete(`/products/${id}`);
