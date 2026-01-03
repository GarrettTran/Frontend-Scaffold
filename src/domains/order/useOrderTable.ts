import { useState, useEffect } from 'react';
import type { Order } from './types';
import { getOrdersApi } from './OrderService';

export function useOrderTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getOrdersApi({
          pageNumber: currentPage,
          pageSize,
        });

        const pageData = response.data;
        setOrders(pageData?.content || []);
        setTotalPages(pageData?.totalPages ?? 0);
        setTotalItems(pageData?.totalElements ?? 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
        setOrders([]);
        setTotalPages(0);
        setTotalItems(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage, pageSize]);

  // Calculate display range
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = totalItems === 0
    ? 0
    : Math.min(startItem + orders.length - 1, totalItems);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Refetch orders
  const refetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getOrdersApi({
        pageNumber: currentPage,
        pageSize,
      });

      const pageData = response.data;
      setOrders(pageData?.content || []);
      setTotalPages(pageData?.totalPages ?? 0);
      setTotalItems(pageData?.totalElements ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orders,
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
    refetchOrders,
  };
}
