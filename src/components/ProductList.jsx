import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Typography,
  Box,
  Stack,
  Card,
  Chip,
  CardContent,
  CardMedia,
  Tooltip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";

import { teal, purple, orange, pink, green, blue } from "@mui/material/colors";

export default function ProductList({ products, onEdit, onDelete }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const truncate = (text, max = 50) =>
    text.length > max ? text.slice(0, max) + "…" : text;

  const categoryColors = [teal[400], purple[400], orange[400], pink[400], green[400], blue[400]];
  const getCategoryColor = (c) => categoryColors[c.charCodeAt(0) % categoryColors.length];

  /* Empty State */
  if (products.length === 0)
    return (
      <Card sx={{
        textAlign: "center", p: 5, border: "2px dashed #d0d0d0",
        borderRadius: 4, bgcolor: "#fafafa", boxShadow: "0px 4px 20px rgba(0,0,0,0.05)"
      }}>
        <Box sx={{
          width: 80, height: 80, borderRadius: "50%", background: "#f0f0f0",
          mx: "auto", mb: 2, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <ShoppingBagRoundedIcon sx={{ fontSize: 40, color: "#777" }} />
        </Box>
        <Typography fontSize={22} fontWeight={700}>No Products Available</Typography>
        <Typography color="gray" fontSize={14}>Add products to populate list</Typography>
      </Card>
    );

  /* ---------------- MOBILE CARD UI ---------------- */
  if (isMobile) {
    return (
      <Stack spacing={2} mt={2}>
        {products.map((p) => (
          <Card
            key={p.id}
            sx={{
              display: "flex", p: 2, borderRadius: 4,
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              transition: ".3s", "&:hover": { transform: "scale(.98)" }
            }}
          >
            <CardMedia
              component="img"
              image={p.image}
              alt={p.title}
              sx={{ width: 90, height: 90, borderRadius: 3, mr: 2, objectFit: "cover" }}
            />

            <CardContent sx={{ p: 0, flex: 1 }}>
              <Typography fontSize={18} fontWeight={600}>{truncate(p.title, 25)}</Typography>

              <Chip
                label={p.category}
                size="small"
                sx={{
                  mt: .7, background: getCategoryColor(p.category),
                  color: "#fff", fontWeight: 600, borderRadius: "50px"
                }}
              />

              <Typography mt={1} fontSize={18} fontWeight={700}>
                <span style={{ opacity: .6 }}>$</span>{parseFloat(p.price).toFixed(2)}
              </Typography>

              <Stack direction="row" spacing={1} mt={1}>
                <Tooltip title="Edit Product">
                  <IconButton size="small" color="primary" onClick={() => onEdit(p)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Product">
                  <IconButton size="small" color="error" onClick={() => onDelete(p.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  /* ---------------- DESKTOP MODERN TABLE ---------------- */
  return (
    <Paper elevation={0} sx={{
      overflow: "hidden", borderRadius: 4,
      backdropFilter: "blur(6px)",
      border: "1px solid #e8e8e8",
      boxShadow: "0 8px 30px rgba(0,0,0,0.06)"
    }}>

      {/* Header */}
      <Box sx={{
        p: 3, display: "flex", alignItems: "center", gap: 2,
        background: "linear-gradient(90deg,#fff7f1 0%,#fff2e2 100%)",
        borderBottom: "1px solid #eee"
      }}>
        <Box sx={{
          width: 50, height: 50, borderRadius: "12px",
          background: "rgba(255,122,47,.17)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Inventory2RoundedIcon sx={{ fontSize: 28, color: "#ff7a2f" }} />
        </Box>

        <Box>
          <Typography variant="h6" fontWeight={700}>Product Inventory</Typography>
          <Typography fontSize={14} color="gray">
            {products.length} {products.length===1?"item":"items"} available
          </Typography>
        </Box>
      </Box>

      {/* Table */}
      <Table sx={{ "& th":{fontWeight:700}, "& td":{py:2} }}>
        <TableHead>
          <TableRow sx={{ background:"#f9f9f9" }}>
            <TableCell>Product</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id} hover sx={{
              transition:"0.25s", cursor:"pointer",
              "&:hover":{ background:"#fff9f3", transform:"scale(1.002)" }
            }}>
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box component="img" src={p.image} alt={p.title}
                    sx={{ width:65, height:65, borderRadius:3, objectFit:"cover" }} />
                  <Typography fontWeight={600}>{p.title}</Typography>
                </Stack>
              </TableCell>

              <TableCell>
                <Chip label={p.category}
                  sx={{ background:getCategoryColor(p.category), color:"#fff", fontWeight:600, borderRadius:"50px" }} />
              </TableCell>

              <TableCell>
                <Typography fontSize={17} fontWeight={700}>
                  <span style={{ opacity:.6 }}>$</span>{parseFloat(p.price).toFixed(2)}
                </Typography>
              </TableCell>

              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton color="primary" onClick={() => onEdit(p)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton color="error" onClick={() => onDelete(p.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
