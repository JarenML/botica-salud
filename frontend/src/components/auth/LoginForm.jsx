// src/components/auth/LoginForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/auth.css';
import loginBg from '../../assets/login-bg.jpg';
import { FaUser, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

const LoginForm = () => {
    const [data, setData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/usuarios/login', data);
            localStorage.setItem('token', res.data.token);
            navigate('/home');
        } catch {
            setError('Credenciales inválidas');
        }
    };

    return (
        <>
            <div className="page-background" style={{ backgroundImage: `url(${loginBg})` }} />
            <div className="register-page">
                <div className="form-container">
                    <form onSubmit={handleSubmit} className="auth-form">
                        <h1 className="app-title">NOVA SALUD</h1>
                        <h2>Iniciar Sesión</h2>
                        
                        <div className="input-with-icon">
                            <FaUser className="input-icon"/>
                            <input name="username" placeholder="Usuario" 
                                value={data.username} onChange={handleChange} required />
                        </div>
                        
                        <div className="input-with-icon">
                            <FaLock className="input-icon"/>
                            <input name="password" type={showPassword ? "text" : "password"} 
                                placeholder="Contraseña" value={data.password} 
                                onChange={handleChange} required />
                            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEye/> : <FaEyeSlash/>}
                            </span>
                        </div>
                        
                        <button type="submit">Entrar</button>
                        {error && <p className="error">{error}</p>}
                        <p className="redirect">¿No tienes cuenta? <a href="/registro">Regístrate</a></p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default LoginForm;