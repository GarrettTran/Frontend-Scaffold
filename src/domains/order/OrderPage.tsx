import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderTable } from './OrderTable';
import { useOrderTable } from './useOrderTable';

export default function OrderPage() {
  const {
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
  } = useOrderTable();

  return (
    <div className="min-h-screen bg-[#F3F4F6] md:p-8 p-0 font-sans">
      {/* Main Card Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-5xl font-bold text-gray-900">Order Management</h1>
          <Button
            onClick={refetchOrders}
            variant="outline"
            className="text-black"
          >
            Refresh
          </Button>
        </div>

        {/* Top Controls: Count and Page Size */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span className="md:text-base text-xs">{totalItems} Orders found</span>

            <div className="flex items-center gap-2">
              <span className="md:block hidden text-gray-500">Show:</span>
              <Select value={pageSize.toString()} onValueChange={(val) => handlePageSizeChange(Number(val))}>
                <SelectTrigger className="h-8 w-[100px] border rounded text-black">
                  <SelectValue placeholder="10" />
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

        {/* Orders Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={refetchOrders} className="text-black">
              Retry
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No Orders found.
          </div>
        ) : (
          <OrderTable orders={orders} />
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

            {/* Page Numbers */}
            <div className="flex items-center gap-1 sm:gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (typeof window !== 'undefined' && window.innerWidth < 640) {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  }
                  return true;
                })
                .map((page, index, array) => {
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
    </div>
  );
}
