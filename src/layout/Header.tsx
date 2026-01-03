import { useAuthStore } from "@/stores/authStore"
import { useCartStore } from "@/stores/cartStore"
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const {
        isAuthenticated,
        user,
        signOut
    } = useAuthStore();
    
    const { toggleCart, getTotalItems } = useCartStore();
    const totalItems = getTotalItems();

    const handleLogout = () => {
        signOut();
        navigate('/auth');
    };

    const isActive = (path: string) => location.pathname === path;
    
    return (
        <header className="bg-white border-b border-gray-200 px-4 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Left - Logo & Navigation */}
                <div className="flex items-center gap-6">
                    <h1 className="text-xl font-bold text-gray-900">Store</h1>
                    
                    {/* Navigation Links */}
                    {isAuthenticated && (
                        <nav className="flex gap-4">
                            <button
                                onClick={() => navigate('/product-page')}
                                className={`text-sm font-medium transition-colors ${
                                    isActive('/product-page')
                                        ? 'text-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Products
                            </button>
                            <button
                                onClick={() => navigate('/order-page')}
                                className={`text-sm font-medium transition-colors ${
                                    isActive('/order-page')
                                        ? 'text-blue-600'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Orders
                            </button>
                        </nav>
                    )}
                </div>

                {/* Right - User Info & Actions */}
                <div className="flex items-center gap-4">
                    {user && (
                        <div className="hidden md:block text-sm text-right">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.address}</p>
                        </div>
                    )}

                    {/* Cart Button */}
                    <button
                        onClick={toggleCart}
                        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ShoppingCart className="h-6 w-6 text-gray-700" />
                        {totalItems > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                {totalItems}
                            </span>
                        )}
                    </button>

                    {/* Logout Button */}
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="text-red-600 hover:bg-red-50 border-red-200"
                    >
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    )
}