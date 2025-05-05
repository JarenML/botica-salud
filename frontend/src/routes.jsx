// src/routes.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/Home/HomePage';

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} /> 
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;

