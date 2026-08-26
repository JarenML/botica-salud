// src/components/Home.jsx
import {
    FaExclamationTriangle, FaMoneyBillWave, FaUserFriends, FaBoxOpen, FaCheckCircle
} from 'react-icons/fa';
import { useEffect, useState } from 'react';
import clientService from '../services/client.service';
import productService from '../services/product.service';
import saleService from '../services/sale.service';

const Home = () => {
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

                // las ventas se cuentan por fecha de pago, no de creacion
                const hoy = new Date().toISOString().split('T')[0];
                const ventasDeHoyPagadas = sales.filter(
                    (venta) =>
                        venta.estado.toLowerCase() === 'pagado' &&
                        venta.fecha_pago &&
                        new Date(venta.fecha_pago).toISOString().split('T')[0] === hoy
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
        <div className="min-h-screen bg-brand-ink">
            <main className="mx-auto max-w-7xl px-6 pt-6 pb-10 lg:px-10">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-white">Resumen</h1>
                    <p className="mt-1 text-sm text-slate-400">Estado general de la farmacia hoy.</p>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                                <FaExclamationTriangle />
                            </span>
                            <div>
                                <p className="text-xs font-medium text-slate-400">Stock Bajo</p>
                                <p className="text-xl font-semibold text-white">{stockBajo.length}</p>
                            </div>
                        </div>

                        {stockBajo.length > 0 ? (
                            <ul className="mt-4 max-h-32 space-y-1.5 overflow-y-auto pr-1 text-sm">
                                {stockBajo.map((producto) => (
                                    <li key={producto.codigo} className="flex justify-between gap-2 text-slate-300">
                                        <span className="truncate">{producto.nombre}</span>
                                        <span className="shrink-0 text-red-400">{producto.stock_actual} u.</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-4 flex items-center gap-1.5 text-sm text-slate-400">
                                <FaCheckCircle className="text-emerald-400" /> Todo en buen stock
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                                <FaMoneyBillWave />
                            </span>
                            <div>
                                <p className="text-xs font-medium text-slate-400">Ventas Hoy</p>
                                <p className="text-xl font-semibold text-white">${ventasHoy.total.toFixed(2)}</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-400">{ventasHoy.cantidad} venta{ventasHoy.cantidad === 1 ? '' : 's'} pagada{ventasHoy.cantidad === 1 ? '' : 's'}</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                                <FaUserFriends />
                            </span>
                            <div>
                                <p className="text-xs font-medium text-slate-400">Total Clientes</p>
                                <p className="text-xl font-semibold text-white">{totalClientes}</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-400">Registrados en el sistema</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20">
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                                <FaBoxOpen />
                            </span>
                            <div>
                                <p className="text-xs font-medium text-slate-400">Total Productos</p>
                                <p className="text-xl font-semibold text-white">{totalProductos}</p>
                            </div>
                        </div>
                        <p className="mt-4 text-sm text-slate-400">En inventario</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
