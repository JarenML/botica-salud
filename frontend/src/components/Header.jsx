// Ruta: /src/pages/Home/HomePage.jsx
import React, { useEffect, useState } from 'react';
import '../styles/header.css'

const Header = () => {
    const [usuario, setUsuario] = useState({ nombre: '', rol: '' });
    
        useEffect(() => {
            const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Usuario', rol: 'farmaceutico' };
            setUsuario(usuarioLogueado);
        }, []);
    

    return (
        <header className="home-header">
                <div className="header-left">
                    <h1>Botica Nova Salud</h1>
                </div>
                <nav className="header-nav">
                    <ul>
                        <li><a href="/home">Inicio</a></li>
                        <li><a href="/inventario">Inventario</a></li>
                        <li><a href="/categoria">Categorias</a></li>
                        <li><a href="/ventas">Ventas</a></li>
                        <li><a href="/proveedores">Proveedores</a></li>
                        <li><a href="/clientes">Clientes</a></li>
                        <li><a href="/registro_venta">Registrar Venta</a></li>
                    </ul>
                </nav>
                <div className="header-right">
                    <p>{usuario.nombre} ({usuario.rol})</p>
                </div>
            </header>
    )
}

export default Header;