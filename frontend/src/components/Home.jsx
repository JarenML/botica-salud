//src/components/Home.jsx
import { FaCashRegister, FaBoxes, FaUsers, FaChartBar, FaClipboardList, FaWarehouse } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page">
            <main className="home-content">
                <div className="cards-container">
                    <div className="card" onClick={() => navigate('/registro_venta')}>
                        <FaCashRegister className="card-icon" />
                        <h3>Nueva Venta</h3>
                        <p>Registrar nueva transacción</p>
                    </div>
                    <div className="card" onClick={() => navigate('/inventario')}>
                        <FaBoxes className="card-icon" />
                        <h3>Gestión de Inventario</h3>
                        <p>Administrar productos</p>
                    </div>
                    <div className="card" onClick={() => navigate('/clientes')}>
                        <FaUsers className="card-icon" />
                        <h3>Registro de Clientes</h3>
                        <p>Gestionar clientes</p>
                    </div>
                    <div className="card" onClick={() => navigate('/categorias')}>
                        <FaChartBar className="card-icon" />
                        <h3>Categorias</h3>
                        <p>Ver todas las Categoria</p>
                    </div>
                    <div className="card" onClick={() => navigate('/ventas')}>
                        <FaClipboardList className="card-icon" />
                        <h3>Ventas</h3>
                        <p>Información de Ventas</p>
                    </div>
                    <div className="card" onClick={() => navigate('/proveedores')}>
                        <FaWarehouse className="card-icon" />
                        <h3>Proveedores</h3>
                        <p>Lista de proveedores</p>
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