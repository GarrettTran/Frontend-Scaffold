import { apiGet } from '@/utils/https.utils';
import type { OrderPage, GetOrdersResponse } from './types';
import { API_ENDPOINTS } from '@/shared/api.config';

function buildQueryString(pageNumber?: number, pageSize?: number): string {
  const params = new URLSearchParams();

  if (pageNumber !== undefined) {
    params.append('pageNumber', pageNumber.toString());
  }

  if (pageSize !== undefined) {
    params.append('pageSize', pageSize.toString());
  }

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

export async function getOrdersApi(
  options?: { pageNumber?: number; pageSize?: number }
): Promise<GetOrdersResponse> {
  try {
    const queryString = buildQueryString(options?.pageNumber, options?.pageSize);
    const response = await apiGet<{ data: OrderPage }>(
      `${API_ENDPOINTS.order.getAll}${queryString}`
    );

    return {
      success: true,
      message: 'Orders fetched!',
      data: response.data,
    };
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(`Failed: ${err.message}`);
    }
    throw new Error('Failed to fetch Orders');
  }
}
