import type { Product } from "../types";
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

/* VALIDATION CHEAT SHEET (react-hook-form):
   - required: { required: "Error message" }
   - min/max length: { minLength: { value: 3, message: "Min 3 chars" }, maxLength: { value: 100, message: "Max 100 chars" } }
   - min/max value: { min: { value: 0, message: "Must be positive" }, max: { value: 999, message: "Max 999" } }
   - pattern (regex): { pattern: { value: /^[A-Za-z]+$/, message: "Letters only" } }
   - email pattern: { pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" } }
   - URL pattern: { pattern: { value: /^https?:\/\/.+/, message: "Must start with http:// or https://" } }
   - custom validation: { validate: (value) => value > 0 || "Must be positive" }
   - multiple validations: { validate: { positive: (v) => v > 0 || "error", even: (v) => v % 2 === 0 || "Must be even" } }
   - validate with other field: use form.watch('fieldName') inside validate function
*/

interface AddProductDialogUiProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
    onSave: (ProductData: Omit<Product, 'id'>, id?: string) => void;
}

type ProductFormData = {
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl?: string;
};

export function AddProductDialog({
    open,
    onOpenChange,
    product,
    onSave,
}: AddProductDialogUiProps) {
    const form = useForm<ProductFormData>({
        defaultValues: {
            name: '',
            description: '',
            price: 0,
            stock: 0,
            imageUrl: '',
        }
    });

    // Update form when product changes (for editing)
    useEffect(() => {
        if (product) {
            form.reset({
                name: product.name,
                description: product.description,
                price: product.price,
                stock: product.stock,
            });
        } else {
            form.reset({
                name: '',
                description: '',
                price: 0,
                stock: 0,
            });
        }
    }, [product, form]);

    const handleSubmit = (data: ProductFormData) => {
        const productData: Omit<Product, 'id'> = {
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            // imageUrl: data.imageUrl || undefined,
            createdAt: product?.createdAt || new Date().toISOString(),
        };

        onSave(productData, product?.id);
        onOpenChange(false);
        form.reset();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            rules={{
                                required: "Product name is required",
                                minLength: { value: 3, message: "Name must be at least 3 characters" },
                                maxLength: { value: 100, message: "Name must not exceed 100 characters" }
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter product name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            rules={{
                                required: "Description is required",
                                minLength: { value: 10, message: "Description must be at least 10 characters" },
                                maxLength: { value: 500, message: "Description must not exceed 500 characters" }
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            rules={{
                                required: "Price is required",
                                min: { value: 0.01, message: "Price must be greater than 0" },
                                max: { value: 999999, message: "Price is too high" },
                                validate: (value) => !isNaN(value) || "Price must be a valid number"
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="stock"
                            rules={{
                                required: "Stock is required",
                                min: { value: 0, message: "Stock cannot be negative" },
                                max: { value: 999999, message: "Stock value is too high" },
                                validate: (value) => Number.isInteger(value) || "Stock must be a whole number"
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Stock</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            {...field}
                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            rules={{
                                pattern: {
                                    value: /^(https?:\/\/).*/,
                                    message: "URL must start with http:// or https://"
                                },
                                validate: (value) => {
                                    if (!value) return true; // optional field
                                    try {
                                        new URL(value);
                                        return true;
                                    } catch {
                                        return "Invalid URL format";
                                    }
                                }
                            }}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL (Optional)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/image.jpg" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex gap-2 justify-end pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">
                                {product ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}