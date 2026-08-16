import React, { useEffect, useState } from 'react';
import {
    FaUserCircle, FaCapsules, FaHome, FaBoxes, FaTags,
    FaChartLine, FaTruck, FaUsers, FaCashRegister, FaSignOutAlt
} from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import '../styles/header.css';

const NAV_ITEMS = [
    { to: '/home', label: 'Inicio', icon: FaHome },
    { to: '/inventario', label: 'Inventario', icon: FaBoxes },
    { to: '/categorias', label: 'Categorías', icon: FaTags },
    { to: '/ventas', label: 'Ventas', icon: FaChartLine },
    { to: '/proveedores', label: 'Proveedores', icon: FaTruck },
    { to: '/clientes', label: 'Clientes', icon: FaUsers },
    { to: '/registro_venta', label: 'Registrar Venta', icon: FaCashRegister },
];

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
                <span className="brand-mark"><FaCapsules /></span>
                <h1>Botica Nova Salud</h1>
            </div>
            <nav className="header-nav">
                <ul>
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.to}>
                                <NavLink
                                    to={item.to}
                                    title={item.label}
                                    className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                                >
                                    <Icon className="nav-icon" />
                                    <span>{item.label}</span>
                                </NavLink>
                            </li>
                        );
                    })}
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
                            <button onClick={handleLogout}>
                                <FaSignOutAlt /> Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
