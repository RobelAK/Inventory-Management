import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import api from '../services/api';
import type { Product } from '../models/models';
import { toast } from 'react-toastify';

interface AdjustmentDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  type: 'add' | 'remove';
  onAdjusted: () => void;
}

const AdjustmentDialog: React.FC<AdjustmentDialogProps> = ({
  open,
  onClose,
  product,
  type,
  onAdjusted,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => { 
    setError(null);
  }, [open]);

  const handleSubmit = async () => {
    console.log("handlesubmit is called")
    if (quantity <= 0) {
      setError('Quantity must be positive.');
      return;
    }

    if (!product) return;
    const endpoint = type === 'add'
      ? `/api/StockAdjustments/add/${product.id}`
      : `/api/StockAdjustments/remove/${product.id}`;
    try {
      await api.post(endpoint, {
        quantity,
        originalConcurrencyGuid: product!.concurrencyGuid,
      });
      console.log("update success")
      toast.success(`Stock ${type === 'add' ? 'added' : 'removed'} successfully`);
      onAdjusted();
      onClose();
    } catch (err: any) {
      if (err.response?.status === 409) {
        toast.error('Concurrency conflict: Another user modified the stock. Refreshing data...');
        onAdjusted(); // Force reload
      } else {
        toast.error(err.response?.data || 'Adjustment failed');
      }
      onClose();
    }
    // try {
    //   await api.post(endpoint, quantity);
    //   onAdjusted();
    //   onClose();
    // } catch (err: any) {
    //   const message = err.response?.data || 'Adjustment failed.';
    //   setError(
    //     type === 'remove' && message.includes('Insufficient')
    //       ? message
    //       : message.includes('Concurrency')
    //       ? 'Race condition detected. Only one adjustment succeeded. Please refresh.'
    //       : message
    //   );
    // }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        {type === 'add' ? 'Add Stock' : 'Remove Stock'} - {product?.name}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>
          Current stock: <strong>{product?.currentQuantity}</strong>
        </DialogContentText>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          autoFocus
          label="Quantity"
          type="number"
          fullWidth
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          inputProps={{ min: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color={type === 'add' ? 'success' : 'warning'}>
          {type === 'add' ? 'Add' : 'Remove'} Stock
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AdjustmentDialog;