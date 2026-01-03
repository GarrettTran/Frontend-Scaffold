import type { Order } from './types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface OrderTableProps {
  orders: Order[];
}

export function OrderTable({ orders }: OrderTableProps) {
  const formatCreatedDate = (createdAt?: string): string => {
    if (!createdAt) return 'N/A';
    const date = new Date(createdAt);
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No orders found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Customer Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-mono text-sm">{order.id}</TableCell>
            <TableCell>{order.customerName}</TableCell>
            <TableCell>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusBadgeColor(order.status)}`}>
                {order.status}
              </span>
            </TableCell>
            <TableCell className="font-medium">${order.totalPrice.toFixed(2)}</TableCell>
            <TableCell>{formatCreatedDate(order.createdAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
