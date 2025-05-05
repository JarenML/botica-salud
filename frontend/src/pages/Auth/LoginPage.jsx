// src/pages/Auth/LoginPage.jsx
import LoginForm from '../../components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate(); 
    return <LoginForm onSuccess={() => navigate('/clientes')} />;
};

export default LoginPage;