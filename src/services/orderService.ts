import { apiPost } from '@/utils/https.utils';
import { API_ENDPOINTS } from '@/shared/api.config';

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  customerName: string;
  items: OrderItem[];
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    customerName: string;
    items: OrderItem[];
    createdAt: string;
  };
}

export async function createOrderAPI(order: CreateOrderRequest): Promise<CreateOrderResponse> {
  try {
    const response = await apiPost<{ data: CreateOrderResponse['data'] }>(
      API_ENDPOINTS.order.create,
      order
    );
    
    return {
      success: true,
      message: 'Order created successfully',
      data: response.data,
    };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes('400')) {
        throw new Error('400: Invalid order data');
      } else if (err.message.includes('401')) {
        throw new Error('401: Unauthorized');
      } else if (err.message.includes('500')) {
        throw new Error('500: Server error');
      }
      throw new Error(`Failed to create order: ${err.message}`);
    }
    throw new Error('Failed to create order');
  }
}
