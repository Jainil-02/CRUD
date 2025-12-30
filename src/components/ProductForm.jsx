import { useEffect, useState } from "react";
import { TextField, Button, Stack } from "@mui/material";

const initialState = {
  title: "",
  price: "",
  category: "",
  description: "",
  image: null, // store image as Base64
};

export default function ProductForm({ onSubmit, editingProduct }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    } else {
      setFormData(initialState);
    }
  }, [editingProduct]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Resize and compress image before storing
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxWidth = 200;
        const maxHeight = 200;
        let width = img.width;
        let height = img.height;

        // Maintain aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG ~70%
        const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setFormData({ ...formData, image: resizedBase64 });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please upload an image for the product.");
      return;
    }

    try {
      const products = JSON.parse(localStorage.getItem("products")) || [];

      if (editingProduct) {
        // Update existing product
        const updatedProducts = products.map((p) =>
          p.id === editingProduct.id ? { ...formData, id: p.id } : p
        );
        localStorage.setItem("products", JSON.stringify(updatedProducts));
      } else {
        // Add new product with unique id
        const newProduct = { ...formData, id: Date.now() };
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
      }

      onSubmit(formData);
      setFormData(initialState);
    } catch (e) {
      if (e.name === "QuotaExceededError") {
        alert(
          "Local storage is full! Please remove some products or use smaller images."
        );
      } else {
        console.error(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={2}>
        <TextField
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <TextField
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
        />

        <Button variant="contained" component="label">
          {formData.image ? "Change Image" : "Upload Image"}
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>

        {formData.image && (
          <img
            src={formData.image}
            alt="Preview"
            style={{ maxWidth: "200px", marginTop: "10px" }}
          />
        )}

        <Button variant="contained" type="submit">
          {editingProduct ? "Update Product" : "Add Product"}
        </Button>
      </Stack>
    </form>
  );
}
