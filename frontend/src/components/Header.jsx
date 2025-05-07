import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; 
import { useNavigate } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
    const [usuario, setUsuario] = useState({ nombre: 'Invitado', rol: 'sin rol' });
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Usuario', rol: 'farmaceutico' };
        setUsuario(usuarioLogueado);
    }, []);

    const toggleMenu = () => setShowMenu(!showMenu);

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/');
    };

    return (
        <header className="home-header">
            <div className="header-left">
                <h1>Botica Nova Salud</h1>
            </div>
            <nav className="header-nav">
                <ul>
                    <li><a href="/home">Inicio</a></li>
                    <li><a href="/inventario">Inventario</a></li>
                    <li><a href="/categorias">Categorías</a></li>
                    <li><a href="/ventas">Ventas</a></li>
                    <li><a href="/proveedores">Proveedores</a></li>
                    <li><a href="/clientes">Clientes</a></li>
                    <li><a href="/registro_venta">Registrar Venta</a></li>
                </ul>
            </nav>
            <div className="header-right">
                <div className="user-display" onClick={toggleMenu}>
                    <FaUserCircle className="user-icon" />
                    <div className="user-info">
                        <span className="user-name">{usuario.nombre}</span>
                        <span className="user-role">{usuario.rol}</span>
                    </div>
                    {showMenu && (
                        <div className="user-menu">
                            <button onClick={handleLogout}>Cerrar sesión</button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
