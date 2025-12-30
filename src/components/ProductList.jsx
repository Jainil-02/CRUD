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
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { teal, purple, orange, pink, green, blue } from "@mui/material/colors";

export default function ProductList({ products, onEdit, onDelete }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const truncate = (text, max = 50) =>
    text.length > max ? text.slice(0, max) + "…" : text;

  const categoryColors = [
    teal[300],
    purple[300],
    orange[300],
    pink[300],
    green[300],
    blue[300],
  ];

  const getCategoryColor = (category) => {
    const index = category.charCodeAt(0) % categoryColors.length;
    return categoryColors[index];
  };

  if (isMobile) {
    return (
      <Stack spacing={2}>
        {products.map((p) => (
          <Card
            key={p.id}
            sx={{
              display: "flex",
              alignItems: "center",
              borderRadius: 3,
              background: "#fff7f8",
              boxShadow: 3,
              transition: "0.3s",
              "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
            }}
          >
            <CardMedia
              component="img"
              image={p.image}
              alt={p.title}
              sx={{
                width: 100,
                height: 100,
                objectFit: "contain",
                p: 1,
                backgroundColor: "#fdfdfd",
                borderRadius: 2,
              }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography fontWeight={600}>{truncate(p.title)}</Typography>
              <Chip
                label={p.category}
                sx={{
                  mt: 0.5,
                  backgroundColor: getCategoryColor(p.category),
                  color: "#fff",
                  fontWeight: 600,
                }}
              />

              <Typography fontWeight={700} mt={1} fontSize={15}>
                ${p.price}
              </Typography>
              <Stack direction="row" spacing={1} mt={1}>
                <IconButton color="primary" onClick={() => onEdit(p)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(p.id)}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <Paper elevation={3} sx={{ borderRadius: 3, mb: 4 }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#f4f6f8" }}>
          <TableRow>
            <TableCell>
              <b>Product</b>
            </TableCell>
            <TableCell>
              <b>Category</b>
            </TableCell>
            <TableCell>
              <b>Price</b>
            </TableCell>
            <TableCell align="right">
              <b>Actions</b>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((p) => (
            <TableRow
              key={p.id}
              hover
              sx={{
                "&:last-child td": { borderBottom: 0 },
                backgroundColor: "#fff5f8",
                transition: "0.3s",
                "&:hover": { backgroundColor: "#ffd6e8" },
              }}
            >
              <TableCell>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    component="img"
                    src={p.image}
                    alt={p.title}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: "contain",
                      borderRadius: 2,
                      backgroundColor: "#fafafa",
                      p: 1,
                    }}
                  />
                  <Typography fontWeight={600}>{truncate(p.title)}</Typography>
                </Stack>
              </TableCell>

              <TableCell>
                {" "}
                <Chip
                  label={p.category}
                  sx={{
                    backgroundColor: getCategoryColor(p.category),
                    color: "#fff",
                    fontWeight: 600,
                  }}
                />
              </TableCell>
              <TableCell fontWeight={700}>${p.price}</TableCell>

              <TableCell align="right">
                <IconButton color="primary" onClick={() => onEdit(p)}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => onDelete(p.id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
