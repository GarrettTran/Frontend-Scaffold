import { apiGet, apiDelete, apiPatch, apiPost, apiPut } from '@/utils/https.utils';
import type { Product, CreateProductReq, EditProductReq } from './types';
import ProductPage from './ProductPage';
import { API_ENDPOINTS } from '@/shared/api.config';

export interface ProductPage {
    content: Product[];
    totalElements: number;
    totalPages: number;
    number: number; // zero-based page index from backend
    size: number;
    numberOfElements: number;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
}

export interface GetProductRes {
    success: boolean;
    message: string;
    data?: ProductPage;
}

export interface AddProductResponse {
    success: boolean;
    message: string;
    data?: Product;
}

export interface PruductPage {
    content: Product[];
    totalElements: number;
    totalPages: number;
    number: number; // zero-based page index from backend
    size: number;
    numberOfElements: number;
    first?: boolean;
    last?: boolean;
    empty?: boolean;
}

function buildQueryString(pageNo?: number, pageSz?: number): string {
    const params = new URLSearchParams();

    if (pageNo !== undefined) {
        params.append('pageNo', pageNo.toString());
    }

    if (pageSz !== undefined) {
        params.append('pageSz', pageSz.toString());
    }

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
}

export async function getProductApi(
    options?: { pageNo?: number; pageSz: number }

): Promise<GetProductRes> {
    try {
        const queryString = buildQueryString(options?.pageNo, options?.pageSz);
        const response = await apiGet<{ data: ProductPage }>(`${API_ENDPOINTS.product.getAll}${queryString}`)

        return {
            success: true,
            message: "Products fetched!",
            data: response.data
        };
    } catch (err) {
        if (err instanceof Error) {
            throw new Error(`Failed: ${err.message}`);
        } throw new Error(`Failed to fetch Products `)
    }
}

export async function createProductAPI(product: CreateProductReq): Promise<AddProductResponse> {
    try {
        const response = await apiPost<{ data: Product }>(API_ENDPOINTS.product.create, product);
        return {
            success: true,
            message: 'Product created successfully',
            data: response.data
        };
    } catch (err) {
        if (err instanceof Error) {
            if (err.message.includes('400')) {
                throw new Error('400: Invalid job post data');
            } else if (err.message.includes('401')) {
                throw new Error('401: Unauthorized');
            } else if (err.message.includes('500')) {
                throw new Error('500: Server error');
            }
            throw new Error(`Failed to create job post: ${err.message}`);
        }
        throw new Error('Failed to create job post');
    }
}

// Update an existing job post
export async function updateProductAPI(id: string, product: EditProductReq): Promise<AddProductResponse> {
  try {
    const response = await apiPatch<{ data: Product }>(API_ENDPOINTS.product.update(id), product);
    return {
      success: true,
      message: 'Product updated successfully',
      data: response.data
    };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes('404')) {
        throw new Error('404: Job post not found');
      } else if (err.message.includes('400')) {
        throw new Error('400: Invalid job post data');
      } else if (err.message.includes('401')) {
        throw new Error('401: Unauthorized');
      } else if (err.message.includes('500')) {
        throw new Error('500: Server error');
      }
      throw new Error(`Failed to update product: ${err.message}`);
    }
    throw new Error('Failed to update Product');
  }
}

// Delete a job post
export async function deleteProductApi(id: string): Promise<AddProductResponse> {
  try {
    await apiDelete(API_ENDPOINTS.product.delete(id));
    return {
      success: true,
      message: 'Product deleted successfully'
    };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes('404')) {
        throw new Error('404: Job post not found');
      } else if (err.message.includes('401')) {
        throw new Error('401: Unauthorized');
      } else if (err.message.includes('500')) {
        throw new Error('500: Server error');
      }
      throw new Error(`Failed to delete Product: ${err.message}`);
    }
    throw new Error('Failed to delete Product');
  }
}