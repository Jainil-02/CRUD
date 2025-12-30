import { useEffect, useState, useRef } from "react";
import { Container, Typography, Paper, Snackbar, Box } from "@mui/material";
import { purple, teal, orange, pink } from "@mui/material/colors";
import ProductForm from "./components/ProductForm";
import ProductList from "./components/ProductList";
import SearchBar from "./components/SearchBar";

import { getProducts, editProduct, removeProduct } from "./services/api"; // API call to fetch products

export default function App() {
  const [apiProducts, setApiProducts] = useState([]); // products from API
  const [localProducts, setLocalProducts] = useState([]); // products added locally
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const formRef = useRef();

  const showSnack = (msg) => {
    setSnackbarMessage(msg);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    async function fetchProducts() {
      const res = await getProducts();
      const apiData = res.data.map((p) => ({ ...p, source: "api" })); // mark API products
      setApiProducts(apiData);

      const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
      setLocalProducts(savedProducts);

      setFilteredProducts([...apiData, ...savedProducts]);
    }
    fetchProducts();
  }, []);

  // Add product locally
  const handleAddProduct = (data, msg) => {
      if(!data) return showSnack("Image required");

    const newProduct = { ...data, id: Date.now() };
    const updatedLocalProducts = [newProduct, ...localProducts];

    setLocalProducts(updatedLocalProducts);
    setFilteredProducts([...apiProducts, ...updatedLocalProducts]);
    localStorage.setItem("products", JSON.stringify(updatedLocalProducts));
    setOpenSnackbar(true);
    showSnack("Product added");

  };
  const handleUpdateProduct = async (data, msg) => {
      if(!data) return showSnack("Image required");

    if (editingProduct.source === "api") {
      await editProduct(editingProduct.id, data); // call backend
      const updatedApiProducts = apiProducts.map((p) =>
        p.id === editingProduct.id ? { ...p, ...data } : p
      );
      setApiProducts(updatedApiProducts);
      setFilteredProducts([...updatedApiProducts, ...localProducts]);
    } else {
      const updatedLocalProducts = localProducts.map((p) =>
        p.id === editingProduct.id ? { ...p, ...data } : p
      );
      setLocalProducts(updatedLocalProducts);
      setFilteredProducts([...apiProducts, ...updatedLocalProducts]);
      localStorage.setItem("products", JSON.stringify(updatedLocalProducts));
    }
    setEditingProduct(null);
    showSnack("Product updated");

  };

  const handleDeleteProduct = async (id) => {
    const product = [...apiProducts, ...localProducts].find((p) => p.id === id);

    if (product.source === "api") {
      await removeProduct(id); // delete from backend
      const updatedApiProducts = apiProducts.filter((p) => p.id !== id);
      setApiProducts(updatedApiProducts);
      setFilteredProducts([...updatedApiProducts, ...localProducts]);
    } else {
      const updatedLocalProducts = localProducts.filter((p) => p.id !== id);
      setLocalProducts(updatedLocalProducts);
      setFilteredProducts([...apiProducts, ...updatedLocalProducts]);
      localStorage.setItem("products", JSON.stringify(updatedLocalProducts));
    }
      showSnack("Product deleted");
  };

  const handleEditClick = (product) => {
  setEditingProduct(product);
  setTimeout(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 200);
};


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box
        sx={{
          mb: 3,
          py: 2,
          px: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${purple[500]}, ${teal[400]}, ${orange[400]})`,
          color: "#fff",
          textAlign: "center",
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          🛒 Product Management Dashboard
        </Typography>
      </Box>
      <Paper
      // sx={{
      //   p: 3,
      //   mb: 3,
      //   border: `3px solid ${pink[300]}`,
      //   backgroundColor: "#fef6ff",
      // }}
      >
        <div ref={formRef}>
          <ProductForm
            onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
            editingProduct={editingProduct}
            onNotify={showSnack}
          />
        </div>
      </Paper>

      <Paper
      // sx={{
      //   mb: 3,
      //   p: 2,
      //   borderRadius: 2,
      //   backgroundColor: teal[50],
      //   border: `2px dashed ${teal[200]}`,
      // }}
      >
        <SearchBar
          products={[...apiProducts, ...localProducts]}
          setFilteredProducts={setFilteredProducts}
        />
      </Paper>

      <ProductList
        products={filteredProducts}
        onEdit={handleEditClick}
        onDelete={handleDeleteProduct}
      />

      <Snackbar
  open={openSnackbar}
  autoHideDuration={2500}
  onClose={() => setOpenSnackbar(false)}
  message={snackbarMessage}
  anchorOrigin={{ vertical: "top", horizontal: "center" }}
  sx={{
    "& .MuiSnackbarContent-root": {
      background: "#181818",
      color: "#fff",
      fontSize: "15px"
    }
  }}
/>

    </Container>
  );
}
