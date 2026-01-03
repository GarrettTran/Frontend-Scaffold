export interface Order {
  id: string;
  customerName: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  totalPrice: number;
  createdAt: string;
}

export interface OrderPage {
  content: Order[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  numberOfElements: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface GetOrdersResponse {
  success: boolean;
  message: string;
  data?: OrderPage;
}
