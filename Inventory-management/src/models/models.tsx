export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  currentQuantity: number;
  concurrencyGuid: string;  // Now required - GUID as string
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