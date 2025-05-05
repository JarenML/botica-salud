// Ruta: /src/pages/Home/HomePage.jsx
import { FaCashRegister, FaBoxes, FaUsers, FaChartBar, FaClipboardList, FaWarehouse } from 'react-icons/fa';
import '../styles/home.css';
import Header from './Header';

const Home = () => {

    return (
        <div className="home-page">
            <Header></Header>

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

export default Home;