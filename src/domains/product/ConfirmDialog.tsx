import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  productId?: string;
  productName?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  confirmClassName?: string;
}

export function ConfirmDialog({
  open,
  title,
  message,
  productId,
  productName,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  confirmClassName = 'bg-red-600 hover:bg-red-700 text-white',
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        
        <p className="text-gray-600 mb-4">{message}</p>
        
        {productId && productName && (
          <div className="bg-gray-50 p-3 rounded mb-4 space-y-1">
            <p className="text-sm">
              <span className="font-medium">ID:</span> {productId}
            </p>
            <p className="text-sm">
              <span className="font-medium">Name:</span> {productName}
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="text-black"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className={confirmClassName}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
