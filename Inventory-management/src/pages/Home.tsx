import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../services/api';
import type { Product } from '../models/models';
import ProductDialog from '../components/ProductDialog';
import AdjustmentDialog from '../components/AdjustmentDialog';
import HistoricalDialog from '../components/HistoricalDialog';
import { TextField, InputAdornment } from '@mui/material';
interface HomeProps {
  onLogout: () => void;
}

export default function Home({ onLogout }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false);
  const [historicalDialogOpen, setHistoricalDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');
  const [searchSkuName, setSearchSkuName] = useState('');

  const loadProducts = async () => {
    try {
      const response = await api.get<Product[]>('/api/Products');
      setProducts(response.data);
    } catch (error) {
      toast.error('Failed to load products. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await api.delete(`/api/Products/${productToDelete.id}`);
      toast.success(`Product "${productToDelete.name}" deleted successfully`);
      loadProducts();
    } catch (error: any) {
      console.log(error.response.status)
      if(error.response.status == 404){
        toast.error('Product not found, please refresh the page and try again')
      }
      else{
        toast.error(error.response?.data || 'Failed to delete product');
      }
    }
    setDeleteConfirmOpen(false);
    setProductToDelete(null);
  };

  const openAdjustment = (product: Product, type: 'add' | 'remove') => {
    setSelectedProduct(product);
    setAdjustmentType(type);
    setAdjustmentDialogOpen(true);
  };

  const openHistorical = (product: Product) => {
    setSelectedProduct(product);
    setHistoricalDialogOpen(true);
  };

  const onProductSaved = () => {
    toast.success('Product saved successfully');
    loadProducts();
  };

  const onStockAdjusted = () => {
    toast.success(`Stock ${adjustmentType === 'add' ? 'added' : 'removed'} successfully`);
    loadProducts();
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Inventory Management
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={onLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
          <Box sx={{ my: 6 }}>
            <Typography variant="h5" align="center" color="text.secondary" gutterBottom>
              Products in inventory
            </Typography>

            <Box sx={{ mt: 4, textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setSelectedProduct(null);
                  setProductDialogOpen(true);
                }}
              >
                New Product
              </Button>
            </Box>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Container>
                <Box sx={{ mb: 4, maxWidth: 400 }}>
                  <TextField
                    fullWidth
                    label="Search by SKU or Name"
                    value={searchSkuName}
                    onChange={(e) => setSearchSkuName(e.target.value)}
                    variant="outlined"
                  />
                </Box>
                <TableContainer component={Paper} sx={{ mt: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Name</strong></TableCell>
                        <TableCell><strong>SKU</strong></TableCell>
                        <TableCell align="right"><strong>Price</strong></TableCell>
                        <TableCell align="center"><strong>Current Stock</strong></TableCell>
                        <TableCell align="center"><strong>Add Remove Stock</strong></TableCell>
                        <TableCell align="center"><strong></strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.filter((product) =>
                          searchSkuName === '' || 
                          product.sku.toLowerCase().includes(searchSkuName.toLowerCase()) ||
                          product.name.toLowerCase().includes(searchSkuName.toLowerCase())
                        ).map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell align="right">${product.price.toFixed(2)}</TableCell>
                          <TableCell align="center">
                            <Typography
                              variant="h6"
                              color={product.currentQuantity === 0 ? 'error' : 'success.main'}
                            >
                              {product.currentQuantity}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Add Stock">
                              <IconButton color="success" onClick={() => openAdjustment(product, 'add')}>
                                <AddIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove Stock">
                              <IconButton color="warning" onClick={() => openAdjustment(product, 'remove')}>
                                <RemoveIcon />
                              </IconButton>
                            </Tooltip>
                            
                          </TableCell>
                          <TableCell align="center">
                            <Tooltip title="Edit Product">
                              <IconButton
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setProductDialogOpen(true);
                                }}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View History">
                              <IconButton color="info" onClick={() => openHistorical(product)}>
                                <HistoryIcon />
                              </IconButton>
                            </Tooltip>
                              {/* <IconButton color="error" onClick={() => handleDeleteClick(product)}>
                                <DeleteIcon />
                              </IconButton> */}
                            <Button onClick={() => handleDeleteClick(product)} color="error" variant="contained">
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Container>
            )}
          </Box>

          <ProductDialog
            open={productDialogOpen}
            onClose={() => setProductDialogOpen(false)}
            product={selectedProduct}
            onSaved={onProductSaved}
          />

          <AdjustmentDialog
            open={adjustmentDialogOpen}
            onClose={() => setAdjustmentDialogOpen(false)}
            product={selectedProduct}
            type={adjustmentType}
            onAdjusted={onStockAdjusted}
          />

          <HistoricalDialog
            open={historicalDialogOpen}
            onClose={() => setHistoricalDialogOpen(false)}
            product={selectedProduct}
          />

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete "{productToDelete?.name}"?.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
              <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
    </>
  );
}