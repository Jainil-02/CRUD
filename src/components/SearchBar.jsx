import { TextField, Box } from "@mui/material";

export default function SearchBar({ products, setFilteredProducts }) {
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  return (
    <Box mb={3}>
      <TextField
        fullWidth
        label="Search by title or category"
        variant="outlined"
        onChange={handleSearch}
      />
    </Box>
  );
}
