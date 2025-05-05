// src/routes.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;

