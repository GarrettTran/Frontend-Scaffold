import { useState } from 'react';
import { toast } from 'react-toastify';
import type { Product, CreateProductReq, EditProductReq } from '../types';
import { createProductAPI, updateProductAPI } from '../ProductService';

export function useAddProduct() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Open dialog for creating new product
  const openCreateDialog = () => {
    setSelectedProduct(null);
    setIsDialogOpen(true);
  };

  // Open dialog for editing existing product
  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  // Close dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
    setError(null);
  };

  // Create new product
  const createProduct = async (productData: Omit<Product, 'id'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const productReq: CreateProductReq = {
        name: productData.name,
        price: productData.price,
        description: productData.description,
        stock: productData.stock.toString(),
      };

      const response = await createProductAPI(productReq);

      if (response.success && response.data) {
        toast.success(response.message || 'Product created successfully!');
        closeDialog();
        return response.data;
      } else {
        const errorMessage = response.message || 'Failed to create product';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      }
    } catch (err) {
      let errorMessage = 'An error occurred while creating product';
      
      if (err instanceof Error) {
        if (err.message.includes('400')) {
          errorMessage = 'Invalid product data. Please check your information.';
        } else if (err.message.includes('401')) {
          errorMessage = 'Unauthorized. Please sign in again.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Create product error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update existing product
  const updateProduct = async (id: string, productData: Omit<Product, 'id'>) => {
    setIsLoading(true);
    setError(null);

    try {
      const productReq: EditProductReq = {
        name: productData.name,
        price: productData.price,
        description: productData.description,
        stock: productData.stock.toString(),
      };

      const response = await updateProductAPI(id, productReq);

      if (response.success && response.data) {
        toast.success(response.message || 'Product updated successfully!');
        closeDialog();
        return response.data;
      } else {
        const errorMessage = response.message || 'Failed to update product';
        setError(errorMessage);
        toast.error(errorMessage);
        return null;
      }
    } catch (err) {
      let errorMessage = 'An error occurred while updating product';
      
      if (err instanceof Error) {
        if (err.message.includes('404')) {
          errorMessage = 'Product not found.';
        } else if (err.message.includes('400')) {
          errorMessage = 'Invalid product data. Please check your information.';
        } else if (err.message.includes('401')) {
          errorMessage = 'Unauthorized. Please sign in again.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Update product error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save (create or update based on whether id is provided)
  const handleSave = async (productData: Omit<Product, 'id'>, id?: string) => {
    if (id) {
      return await updateProduct(id, productData);
    } else {
      return await createProduct(productData);
    }
  };

  return {
    // Dialog state
    isDialogOpen,
    selectedProduct,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    
    // Operations
    createProduct,
    updateProduct,
    handleSave,
    
    // Status
    isLoading,
    error
  };
}
