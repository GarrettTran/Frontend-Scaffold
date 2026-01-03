import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from './types';
import { AddProductDialog } from './add-product-dialog/AddProductDialog';
import { ConfirmDialog } from './ConfirmDialog';
import { ProductTable } from './product-table/ProductTable';
import { useProductTable } from './product-table/useProductTable';
import { useAddProduct } from './add-product-dialog/useAddProduct';
import { deleteProductApi } from './ProductService';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ProductPage() {
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    type: 'delete' | 'update' | null;
    product: Product | null;
  }>({ open: false, type: null, product: null });

  const { handleSave } = useAddProduct();

  const {
    products: paginatedProducts,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startItem,
    endItem,
    isLoading,
    error,
    handlePageChange,
    handlePageSizeChange,
    refetchProducts,
  } = useProductTable();

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProductApi(id);
      toast.success('Product deleted successfully');
      refetchProducts();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete Product');
    }
  };

  const handleEditProduct = (product: Product) => {
    setConfirmDialog({ open: true, type: 'update', product });
  };

  const handleDeleteClick = (product: Product) => {
    setConfirmDialog({ open: true, type: 'delete', product });
  };

  const handleConfirmAction = async () => {
    if (!confirmDialog.product) return;

    if (confirmDialog.type === 'delete') {
      await handleDeleteProduct(confirmDialog.product.id);
    } else if (confirmDialog.type === 'update') {
      setEditingProduct(confirmDialog.product);
      setIsAddProductDialogOpen(true);
    }

    setConfirmDialog({ open: false, type: null, product: null });
  };

  const handleCancelAction = () => {
    setConfirmDialog({ open: false, type: null, product: null });
  };

  const handleSaveProduct = async (productData: Omit<Product, 'id'>, id?: string) => {
    const result = await handleSave(productData, id);
    if (result) {
      // Success - dialog closes automatically in useAddProduct
      setIsAddProductDialogOpen(false);
      setEditingProduct(null);
      refetchProducts();
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] md:p-8 p-0 font-sans">
      {/* Main Card Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900">Product Management</h1>
          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsAddProductDialogOpen(true);
            }}
            className="text-black"
          >
            <Plus className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Add New Product</span>
          </Button>
        </div>

        {/* Top Controls: Count and Page Size */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="md:text-base text-xs">{totalItems} Products found</span>

            <div className="flex items-center gap-2">
              <span className="md:block hidden text-gray-500">Show:</span>
              <Select value={pageSize.toString()} onValueChange={(val) => handlePageSizeChange(Number(val))}>
                <SelectTrigger className="h-8 w-[100px] !bg-blue-600 border-none rounded text-black">
                  <SelectValue className='text-black' placeholder="5" />
                </SelectTrigger>
                <SelectContent className='text-black'>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
              <span className="md:block hidden text-gray-500">per page</span>
            </div>
          </div>
        </div>

        {/* Product Posts Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refetchProducts} className="text-black">
              Retry
            </Button>
          </div>
        ) : paginatedProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No Products found.
          </div>
        ) : (
          <ProductTable
            products={paginatedProducts}
            onEdit={handleEditProduct}
            onDelete={(id) => {
              const product = paginatedProducts.find(p => p.id === id);
              if (product) handleDeleteClick(product);
            }}
          />
        )}

        {/* Bottom Pagination Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-4 border-t border-gray-100 mt-4 gap-4">
          <div className="text-sm text-gray-500 text-center sm:text-left">
            Showing {startItem} to {endItem} of {totalItems} results
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Button
              variant="outline"
              className="h-9 px-3 sm:px-4 text-xs sm:text-sm text-gray-500 border-gray-300"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <span className="sm:hidden">&lt;</span>
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {/* Page Numbers - Show limited on mobile */}
            <div className="flex items-center gap-1 sm:gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // On mobile, show current, first, last, and adjacent pages
                  if (window.innerWidth < 640) {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  }
                  return true;
                })
                .map((page, index, array) => {
                  // Add ellipsis for skipped pages
                  const prevPage = array[index - 1];
                  const showEllipsis = prevPage && page - prevPage > 1;

                  return (
                    <div key={page} className="flex items-center gap-1 sm:gap-2">
                      {showEllipsis && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <Button
                        className={`h-8 w-8 sm:h-9 sm:w-9 p-0 text-xs sm:text-sm ${currentPage === page
                          ? "bg-[#0F62FE] hover:bg-blue-700 text-white"
                          : "bg-transparent text-gray-700 hover:bg-gray-100"
                          }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    </div>
                  );
                })}
            </div>

            <Button
              variant="outline"
              className="h-9 px-3 sm:px-4 text-xs sm:text-sm text-gray-700 border-gray-300 hover:bg-gray-50"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <span className="sm:hidden">&gt;</span>
              <span className="hidden sm:inline">Next</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Add/Edit Product Dialog */}
      <AddProductDialog
        open={isAddProductDialogOpen}
        onOpenChange={(open) => {
          setIsAddProductDialogOpen(open);
          if (!open) setEditingProduct(null);
        }}
        product={editingProduct}
        onSave={handleSaveProduct}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.type === 'delete' ? 'Delete Product' : 'Update Product'}
        message={
          confirmDialog.type === 'delete'
            ? 'Are you sure you want to delete this product? This action cannot be undone.'
            : 'Are you sure you want to update this product?'
        }
        productId={confirmDialog.product?.id}
        productName={confirmDialog.product?.name}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        confirmText={confirmDialog.type === 'delete' ? 'Delete' : 'Update'}
        confirmClassName={
          confirmDialog.type === 'delete'
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }
      />
    </div>
  );
}

