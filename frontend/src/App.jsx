//src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header'; 
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

    return (
        <>
            {showHeader && <Header />} 
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/inventario" element={<InventarioPage />} />
                <Route path="/categorias" element={<CategoryPage />} />
                <Route path="/proveedores" element={<SupplierPage />} /> 
                <Route path="/clientes" element={<ClientPage />} />
                <Route path='/registro_venta' element={<RegisterSalePage/>}/>
                <Route path='/ventas' element={<SalePage/>}/>
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
