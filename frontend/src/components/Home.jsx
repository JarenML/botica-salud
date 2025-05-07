// src/components/Home.jsx
import {
    FaCashRegister, FaBoxes, FaUsers, FaChartBar, FaClipboardList, FaWarehouse,
    FaExclamationTriangle, FaMoneyBillWave, FaUserFriends, FaBoxOpen
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import clientService from '../services/client.service';
import productService from '../services/product.service';
import saleService from '../services/sale.service';
import '../styles/home.css';

const Home = () => {
    const navigate = useNavigate();
    const [totalClientes, setTotalClientes] = useState(0);
    const [totalProductos, setTotalProductos] = useState(0);
    const [ventasHoy, setVentasHoy] = useState({ total: 0, cantidad: 0 });
    const [stockBajo, setStockBajo] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clients, products, sales] = await Promise.all([
                    clientService.listClients(),
                    productService.listProducts(),
                    saleService.listSales(),
                ]);

                setTotalClientes(clients.length);

                setTotalProductos(products.data.length);

                // las ventas se registran solo los que estan pagados
                const hoy = new Date().toISOString().split('T')[0];
                const ventasDeHoyPagadas = sales.filter(
                    (venta) =>
                        new Date(venta.fecha_creacion).toISOString().split('T')[0] === hoy &&
                        venta.estado.toLowerCase() === 'pagado'
                );
                const totalVentasHoy = ventasDeHoyPagadas.reduce((acc, venta) => acc + parseFloat(venta.total), 0);
                setVentasHoy({ total: totalVentasHoy, cantidad: ventasDeHoyPagadas.length });

                // STOCK BAJO -- productos con stock_actual <= stock_minimo
                const productosConStockBajo = products.data.filter(
                    (producto) => producto.stock_actual <= producto.stock_minimo
                );
                setStockBajo(productosConStockBajo); 
            } catch (error) {
                console.error('Error al obtener datos para el Home:', error);
            }
        };
        fetchData();
    }, []);


    return (
        <div className="home-page">
            <main className="home-content">
                <section className="top-info-line">
                    <div className="info-box stock">
                        <h4><FaExclamationTriangle className="info-icon stock-icon" /> Stock Bajo</h4>
                        <ul>
                            {stockBajo.length > 0 ? (
                                stockBajo.map((producto) => (
                                    <li key={producto.codigo}>{producto.nombre}: {producto.stock_actual} unidades</li>
                                ))
                            ) : (
                                <li>Todos los productos están en buen stock</li>
                            )}
                        </ul>
                    </div>
                    <div className="info-box ventas">
                        <h4><FaMoneyBillWave className="info-icon ventas-icon" /> Ventas Hoy</h4>
                        <ul>
                            <li>Total: ${ventasHoy.total.toFixed(2)}</li>
                            <li>Cantidad: {ventasHoy.cantidad}</li>
                        </ul>
                    </div>
                    <div className="info-box clientes">
                        <h4><FaUserFriends className="info-icon clientes-icon" /> Total Clientes</h4>
                        <ul>
                            <li>Registrados: {totalClientes}</li>
                        </ul>
                    </div>
                    <div className="info-box inventario">
                        <h4><FaBoxOpen className="info-icon inventario-icon" /> Total Productos</h4>
                        <ul>
                            <li>Productos: {totalProductos}</li>
                        </ul>
                    </div>
                </section>

                {/* Grid de tarjetas principales */}
                <div className="cards-container">
                    <div className="card" onClick={() => navigate('/registro_venta')}>
                        <FaCashRegister className="card-icon venta-icon" />
                        <h3>Nueva Venta</h3>
                        <p>Registrar nueva transacción</p>
                    </div>
                    <div className="card" onClick={() => navigate('/inventario')}>
                        <FaBoxes className="card-icon inventario-icon" />
                        <h3>Gestión de Inventario</h3>
                        <p>Administrar productos</p>
                    </div>
                    <div className="card" onClick={() => navigate('/clientes')}>
                        <FaUsers className="card-icon clientes-icon" />
                        <h3>Registro de Clientes</h3>
                        <p>Gestionar clientes</p>
                    </div>
                    <div className="card" onClick={() => navigate('/categorias')}>
                        <FaChartBar className="card-icon categorias-icon" />
                        <h3>Categorias</h3>
                        <p>Ver todas las Categoria</p>
                    </div>
                    <div className="card" onClick={() => navigate('/ventas')}>
                        <FaClipboardList className="card-icon reportes-icon" />
                        <h3>Ventas</h3>
                        <p>Información de Ventas</p>
                    </div>
                    <div className="card" onClick={() => navigate('/proveedores')}>
                        <FaWarehouse className="card-icon proveedores-icon" />
                        <h3>Proveedores</h3>
                        <p>Lista de proveedores</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;