import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import api from '../services/api';
import type { Product } from '../models/models';

interface ProductDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onSaved: () => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ open, onClose, product, onSaved }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'currentQuantity' | 'rowVersion'>>({
    name: '',
    sku: '',
    price: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const isEdit = product !== null;

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        price: product.price,
      });
    } else {
      setFormData({ name: '', sku: '', price: 0 });
    }
    setError(null);
  }, [product, open]);

  const handleSubmit = async () => {
    if (!formData.name || !formData.sku || formData.price <= 0) {
      setError('All fields are required and price must be positive.');
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/api/Products/${product!.id}`, {
          ...product,
          name: formData.name,
          sku: formData.sku,
          price: formData.price,
        });
      } else {
        await api.post('/api/Products', formData);
      }
      onSaved();
      onClose();
    } catch (err: any) {
      console.log(err)
      setError(err.response?.data || 'Failed to save product.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEdit ? 'Edit Product' : 'Create New Product'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{xs: 12}}>
            <TextField
              label="Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </Grid>
          <Grid size={{xs: 12}}>
            <TextField
              label="SKU"
              fullWidth
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              required
            />
          </Grid>
          <Grid size={{xs: 12}}>
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              inputProps={{ min: 0, step: '0.01' }}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEdit ? 'Save Changes' : 'Create Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;