// Ruta: /src/pages/Home/HomePage.jsx
import React, { useEffect, useState } from 'react';
import { FaCashRegister, FaBoxes, FaUsers, FaChartBar, FaClipboardList, FaWarehouse } from 'react-icons/fa';
import '../../styles/home.css';

const HomePage = () => {
    const [usuario, setUsuario] = useState({ nombre: '', rol: '' });

    useEffect(() => {
        const usuarioLogueado = JSON.parse(localStorage.getItem('usuario')) || { nombre: 'Usuario', rol: 'farmaceutico' };
        setUsuario(usuarioLogueado);
    }, []);

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="header-left">
                    <h1>Botica Nova Salud</h1>
                </div>
                <nav className="header-nav">
                    <ul>
                        <li><a href="/home">Inicio</a></li>
                        <li><a href="/Categorías">Categorías</a></li>
                        <li><a href="/Productos">Productos</a></li>
                        <li><a href="/Proveedores">Proveedores</a></li>
                        <li><a href="/Clientes">Clientes</a></li>
                        <li><a href="/Ventas">Ventas</a></li>
                    </ul>
                </nav>
                <div className="header-right">
                    <p>{usuario.nombre} ({usuario.rol})</p>
                </div>
            </header>

            <main className="home-content">
                <div className="cards-container">
                    <div className="card">
                        <FaCashRegister className="card-icon" />
                        <h3>Nueva Venta</h3>
                        <p>Registrar nueva transacción</p>
                    </div>
                    <div className="card">
                        <FaBoxes className="card-icon" />
                        <h3>Gestión de Inventario</h3>
                        <p>Administrar productos</p>
                    </div>
                    <div className="card">
                        <FaUsers className="card-icon" />
                        <h3>Registro de Clientes</h3>
                        <p>Gestionar clientes</p>
                    </div>
                    <div className="card">
                        <FaChartBar className="card-icon" />
                        <h3>Reportes Diarios</h3>
                        <p>Ver reporte</p>
                    </div>
                    <div className="card">
                        <FaClipboardList className="card-icon" />
                        <h3>Ventas del Día</h3>
                        <p>Total de ventas: <strong>25</strong></p>
                    </div>
                    <div className="card">
                        <FaWarehouse className="card-icon" />
                        <h3>Total de Productos</h3>
                        <p>Cantidad: <strong>120</strong></p>
                    </div>
                </div>

                <section className="additional-info">
                    <div className="info-box">
                        <h4>Productos Bajos en Stock</h4>
                        <ul>
                            <li>Paracetamol - Stock: 3</li>
                            <li>Ibuprofeno - Stock: 2</li>
                            <li>Amoxicilina - Stock: 1</li>
                        </ul>
                    </div>
                    <div className="info-box">
                        <h4>Ventas Recientes</h4>
                        <ul>
                            <li>Venta #12345 - Total: $50</li>
                            <li>Venta #12346 - Total: $75</li>
                            <li>Venta #12347 - Total: $20</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;