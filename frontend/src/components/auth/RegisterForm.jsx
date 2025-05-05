// src/components/auth/RegisterForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../styles/auth.css';
import registerBg from '../../assets/register-bg.jpg';
import { FaUser, FaLock, FaEnvelope, FaIdCard, FaEye, FaEyeSlash, FaUserTie } from 'react-icons/fa';

const RegisterForm = () => {
    const [datos, setDatos] = useState({
        nombre: '', apellidos: '', email: '', username: '', password: '', rol: 'farmaceutico'
    });
    const [mensaje, setMensaje] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setDatos({ ...datos, [e.target.name]: e.target.value });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/usuarios/registro', datos);
            setMensaje('Usuario registrado exitosamente');
            setTimeout(() => navigate('/'), 2000);
        } catch {
            setMensaje('Error al registrar usuario');
        }
    };

    return (
        <>
            <div className="page-background" style={{ backgroundImage: `url(${registerBg})` }} />
            <div className="register-page">
                <div className="form-container">
                    <form onSubmit={handleSubmit} className="auth-form register-form">
                        <h1 className="app-title">NOVA SALUD</h1>
                        <h2>Registro</h2>
                        
                        <div className="input-with-icon">
                            <FaIdCard className="input-icon"/>
                            <input name="nombre" placeholder="Nombre" value={datos.nombre} onChange={handleChange} required />
                        </div>
                        
                        <div className="input-with-icon">
                            <FaIdCard className="input-icon"/>
                            <input name="apellidos" placeholder="Apellidos" value={datos.apellidos} onChange={handleChange} required />
                        </div>
                        
                        <div className="input-with-icon">
                            <FaEnvelope className="input-icon"/>
                            <input name="email" type="email" placeholder="Email" value={datos.email} onChange={handleChange} required />
                        </div>
                        
                        <div className="input-with-icon">
                            <FaUser className="input-icon"/>
                            <input name="username" placeholder="Usuario" value={datos.username} onChange={handleChange} required />
                        </div>
                        
                        <div className="input-with-icon">
                            <FaLock className="input-icon"/>
                            <input name="password" type={showPassword ? "text" : "password"} placeholder="Contraseña" value={datos.password} onChange={handleChange} required />
                            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <FaEye/> : <FaEyeSlash/>}
                            </span>
                        </div>
                        
                        <div className="input-with-icon">
                            <FaUserTie className="input-icon"/>
                            <select name="rol" value={datos.rol} onChange={handleChange} required>
                                <option value="farmaceutico">Farmacéutico</option>
                                <option value="admin">Administrador</option>
                                <option value="cajero">Cajero</option>
                            </select>
                        </div>
                        
                        <button type="submit">Registrarse</button>
                        
                        {mensaje && <p className={mensaje.includes('exitosamente') ? 'success' : 'error'}>{mensaje}</p>}
                    </form>
                </div>
            </div>
        </>
    );
};

export default RegisterForm;