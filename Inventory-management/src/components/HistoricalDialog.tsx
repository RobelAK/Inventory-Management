import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import api from '../services/api';
import type { Product } from '../models/models';

dayjs.extend(utc);

interface HistoricalDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

const HistoricalDialog: React.FC<HistoricalDialogProps> = ({ open, onClose, product }) => {
  const [selectedDateTime, setSelectedDateTime] = useState<Dayjs | null>(dayjs().utc());
  const [historicalStock, setHistoricalStock] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { 
    setError(null);
  }, [open]);
  const handleQuery = async () => {
    if (!product || !selectedDateTime) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get(
        `/api/HistoricalStock/${product.id}?asOf=${selectedDateTime.toISOString()}`
      );
      setHistoricalStock(response.data);
    } catch (err) {
      setError('Failed to retrieve historical stock.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Historical Stock - {product?.name}</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Select Date and Time (UTC)"
            value={selectedDateTime}
            onChange={(newValue) => setSelectedDateTime(newValue)}
            slotProps={{ textField: { fullWidth: true, sx: { mt: 2 } } }}
          />
        </LocalizationProvider>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button variant="contained" onClick={handleQuery} disabled={loading || !selectedDateTime}>
            Query Stock Level
          </Button>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
            <CircularProgress />
          </Box>
        )}

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

        {historicalStock !== null && !loading && !error && (
          <Box sx={{ mt: 3, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h5" align="center">
              Stock Level at {selectedDateTime?.format('YYYY-MM-DD HH:mm:ss')} UTC
            </Typography>
            <Typography variant="h3" align="center" color="primary" sx={{ mt: 2 }}>
              {historicalStock}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoricalDialog;