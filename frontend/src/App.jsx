import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/Home/HomePage';
import InventarioPage from './pages/Inventario/InventarioPage';
import CategoryPage from './pages/Category/CategoryPage';
import SupplierPage from './pages/Supplier/SupplierPage';
import ClientPage from './pages/Client/ClientPage';
import RegisterSalePage from './pages/Sale/RegisterSale';
import SalePage from './pages/Sale/SalePage';

function App() {
    const location = useLocation();
    const hideHeaderRoutes = ['/', '/registro'];
    const showHeader = !hideHeaderRoutes.includes(location.pathname);
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const rol = usuario?.rol || 'invitado';

    return (
        <>
            {showHeader && <Header />}
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
                
                <Route path="/home" element={
                    <PrivateRoute><HomePage /></PrivateRoute>
                } />
                <Route path="/inventario" element={
                    <PrivateRoute>
                        {rol === 'admin' ? <InventarioPage /> : <HomePage />}
                    </PrivateRoute>
                } />
                <Route path="/categorias" element={
                    <PrivateRoute>
                        {rol === 'admin' ? <CategoryPage /> : <HomePage />}
                    </PrivateRoute>
                } />
                <Route path="/proveedores" element={
                    <PrivateRoute>
                        {rol === 'admin' ? <SupplierPage /> : <HomePage />}
                    </PrivateRoute>
                } />
                <Route path="/clientes" element={
                    <PrivateRoute>
                        {rol === 'farmaceutico' || rol === 'admin' ? <ClientPage /> : <HomePage />}
                    </PrivateRoute>
                } />
                <Route path="/registro_venta" element={
                    <PrivateRoute>
                        {rol === 'farmaceutico' || rol === 'admin' ? <RegisterSalePage /> : <HomePage />}
                    </PrivateRoute>
                } />
                <Route path="/ventas" element={
                    <PrivateRoute>
                        {rol === 'admin' || rol === 'cajero' ? <SalePage /> : <HomePage />}
                    </PrivateRoute>
                } />
            </Routes>
        </>
    );
}


function AppWrapper() {
    return (
        <BrowserRouter>
            <App />
        </BrowserRouter>
    );
}

export default AppWrapper;
