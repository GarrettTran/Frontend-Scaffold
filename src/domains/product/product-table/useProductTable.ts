import { useState, useEffect, useMemo } from "react";
import type { Product } from "../types";
import { getProductApi } from "../ProductService";

interface UseProductTableProps {
  searchQuery?: string;
}

export function useProductTable({ searchQuery = "" }: UseProductTableProps = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Reset to first page whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getProductApi({
          pageNo: currentPage,
          pageSz: pageSize,
        });

        const pageData = response.data;
        setProducts(pageData?.content || []);
        setTotalPages(pageData?.totalPages ?? 0);
        setTotalItems(pageData?.totalElements ?? 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setProducts([]);
        setTotalPages(0);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, currentPage, pageSize]);

  // Calculate display range
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalItems === 0
    ? 0
    : Math.min(startItem + products.length - 1, totalItems);

  // Filter products by search query (client-side filtering for simple use)
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  // Selection handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(filteredProducts.map((product) => product.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const next = new Set(selectedIds);
    if (checked) {
      next.add(id);
    } else {
      next.delete(id);
    }
    setSelectedIds(next);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setSelectedIds(new Set()); // Clear selection when changing page
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
    setSelectedIds(new Set()); // Clear selection when changing page size
  };

  // Refetch products (useful after create/update/delete)
  const refetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProductApi({
        pageNo: currentPage,
        pageSz: pageSize,
      });

      const pageData = response.data;
      setProducts(pageData?.content || []);
      setTotalPages(pageData?.totalPages ?? 0);
      setTotalItems(pageData?.totalElements ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    products: filteredProducts,
    allProducts: products,
    selectedIds,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startItem,
    endItem,
    isLoading,
    error,
    handleSelectAll,
    handleSelectOne,
    handlePageChange,
    handlePageSizeChange,
    refetchProducts,
  };
}
