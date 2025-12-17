export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  currentQuantity: number;
  rowVersion: string; // byte[] comes as base64 string from EF
}

export interface StockTransaction {
  id: number;
  productId: number;
  dateTime: string;
  type: 'Add' | 'Remove';
  quantityChanged: number;
  newTotal: number;
}

export interface AdjustmentRequest {
  quantity: number;
}