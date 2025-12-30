import { useEffect, useState } from "react";
import { TextField, Button } from "@mui/material";
import "./ProductForm.css"; // <-- important

const initialState = {
  title: "",
  price: "",
  category: "",
  description: "",
  image: null,
};

export default function ProductForm({ onSubmit, editingProduct }) {
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (editingProduct) setFormData(editingProduct);
    else setFormData(initialState);
  }, [editingProduct]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const max = 300;
        let { width, height } = img;

        if (width > height ? width > max : height > max) {
          const scale = max / (width > height ? width : height);
          width *= scale;
          height *= scale;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setFormData({ ...formData, image: resizedBase64 });
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
if (!formData.image) {
  onSubmit(null, "Please upload an image"); // pass error message
  return;
}

    const products = JSON.parse(localStorage.getItem("products")) || [];
    if (editingProduct) {
      const updated = products.map((p) =>
        p.id === editingProduct.id ? { ...formData, id: p.id } : p
      );
      localStorage.setItem("products", JSON.stringify(updated));
    } else {
      products.push({ ...formData, id: Date.now() });
      localStorage.setItem("products", JSON.stringify(products));
    }

    onSubmit(formData);
    setFormData(initialState);
  };

  return (
    <div className="product-card">
      <form onSubmit={handleSubmit} className="form-wrapper">

        {/* Image Upload Section */}
        <label className="upload-box">
          {formData.image ? (
            <img src={formData.image} alt="Preview" className="preview-img" />
          ) : (
            <div className="upload-text">
              <span className="upload-icon">📤</span>
              <p>Click to Upload</p>
              <small>PNG or JPG up to 10MB</small>
            </div>
          )}
          <input type="file" accept="image/*" hidden onChange={handleFileChange} />
        </label>

        {/* Text Inputs */}
        <TextField label="Product Title" name="title" value={formData.title} onChange={handleChange} fullWidth required sx={{borderRadius:"10px"}}/>
        
        <div className="row">
<TextField
  label="Price"
  name="price"
  type="number"
  value={formData.price}
  onChange={handleChange}
  required
  fullWidth
  inputProps={{ min: 0 }}         // ⛔ prevents negative typing via UI
  onInput={(e) => {              // extra guard
    if (e.target.value < 0) e.target.value = "";
  }}
/>     
     <TextField label="Category" name="category" value={formData.category} onChange={handleChange} required fullWidth />
        </div>

        <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} />

        {/* Submit Button */}
        <Button className="submit-btn" type="submit">
          {editingProduct ? "Update Product" : "Add Product"}
        </Button>
      </form>
    </div>
  );
}
