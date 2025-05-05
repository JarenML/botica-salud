// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/Home/HomePage';
import InventarioPage from './pages/Inventario/InventarioPage'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/registro" element={<RegisterPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/inventario" element={<InventarioPage />}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
