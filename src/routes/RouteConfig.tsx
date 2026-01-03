import  {Navigate, Route, Routes} from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Assuming all imported components are also converted to TSX (or are JS with d.ts files)
import ProtectedRoute from './ProtectedRoute';
// Lazy-loaded components (add more if needed)
const AuthPage = lazy(() => import('@/domains/auth/AuthPage'));
const ProductPage = lazy(() => import('@/domains/product/ProductPage'));
const OrderPage = lazy(() => import('@/domains/order/OrderPage'));
// const Page404 = lazy(() => import('@/domains/errors/Page404'));

// Define the component using React.FC (Function Component) for better type checking
const RouteConfig: React.FC = () => {
    return (
        // Suspense requires a fallback element while lazy components are loading
        <Suspense fallback={<div>Loading...</div>}>
            <Routes>
                {/* Public routes */}
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<Navigate to="/auth" replace />} />
                
                {/* Protected routes */}
                <Route element={<ProtectedRoute/>}>
                    <Route path="/product-page" element={<ProductPage />} />
                    <Route path="/order-page" element={<OrderPage />} />
                </Route>

                {/* Error Pages and Special Routes
                <Route path="*" element={<Navigate to="/404" />} />
                <Route path="/404" element={<Page404 />} /> */}
                {/* <Route path="/OAuth2/callback" element={<OAuth2CallbackHandling />} /> */}
            </Routes>
        </Suspense>
    );
}

export default RouteConfig;