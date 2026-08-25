// src/components/RegisterSale.jsx
import React, { useState, useEffect } from 'react';
import { FaCashRegister, FaSearch, FaPlus, FaTrash, FaSpinner, FaShoppingCart } from 'react-icons/fa';
import clientService from '../services/client.service';
import userService from '../services/user.service';
import productService from '../services/product.service';
import saleService from '../services/sale.service';
import Select from './ui/Select';
import { useToast } from '../context/ToastContext';

const IGV_TASA = 0.18;

const METODOS_PAGO = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta_credito', label: 'Tarjeta de Crédito' },
    { value: 'tarjeta_debito', label: 'Tarjeta de Débito' },
    { value: 'transferencia', label: 'Transferencia' },
    { value: 'otros', label: 'Otros' },
];

const getErrorMessage = (error, fallback) => error?.response?.data?.message || fallback;

const RegistrarVenta = () => {
    const [cliente, setCliente] = useState('');
    const [cajero, setCajero] = useState('');
    const [metodoPago, setMetodoPago] = useState('efectivo');
    const [carrito, setCarrito] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [clientesDisponibles, setClientesDisponibles] = useState([]);
    const [cajerosDisponibles, setCajerosDisponibles] = useState([]);
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [cantidadesTemp, setCantidadesTemp] = useState({});
    const [cargandoProductos, setCargandoProductos] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const toast = useToast();

    const agregarProducto = (producto, cantidad) => {
        if (!cantidad || cantidad < 1) return;

        if (cantidad > producto.stock_actual) {
            toast.error('Cantidad excede el stock disponible.');
            return;
        }

        const cantidadTotal = carrito.reduce((acc, item) => (
            item.codigo === producto.codigo ? acc + item.cantidad : acc
        ), 0);

        if (cantidadTotal + cantidad > producto.stock_actual) {
            toast.error('Cantidad excede el stock disponible.');
            return;
        }

        setCarrito((prev) => {
            const existente = prev.find((item) => item.codigo === producto.codigo);
            if (existente) {
                return prev.map((item) =>
                    item.codigo === producto.codigo ? { ...item, cantidad: item.cantidad + cantidad } : item
                );
            }
            return [...prev, { ...producto, cantidad, id_producto: producto.id_producto }];
        });
        setCantidadesTemp((prev) => ({ ...prev, [producto.codigo]: '' }));
    };

    const eliminarProducto = (codigo) => {
        setCarrito((prev) => prev.filter((item) => item.codigo !== codigo));
    };

    const fetchProductos = async () => {
        setCargandoProductos(true);
        try {
            const res = await productService.listProducts();
            setProductosDisponibles(res.data);
        } catch (error) {
            toast.error(getErrorMessage(error, 'Error al obtener productos.'));
        } finally {
            setCargandoProductos(false);
        }
    };

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await clientService.listClients();
                setClientesDisponibles(data);
            } catch (error) {
                toast.error(getErrorMessage(error, 'Error al obtener clientes.'));
            }
        };
        fetchClientes();
    }, []);

    useEffect(() => {
        const fetchCajeros = async () => {
            try {
                const data = await userService.listUsers();
                setCajerosDisponibles(data.filter((u) => u.rol === 'cajero'));
            } catch (error) {
                toast.error(getErrorMessage(error, 'Error al obtener cajeros.'));
            }
        };
        fetchCajeros();
    }, []);

    useEffect(() => {
        fetchProductos();
    }, []);

    const crearVenta = async () => {
        if (!cliente || !cajero || carrito.length === 0) {
            toast.error('Debes seleccionar cliente, cajero y al menos un producto.');
            return;
        }

        const venta = {
            codigo_venta: `VEN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            usuario_id: parseInt(cajero),
            cliente_id: parseInt(cliente),
            metodo_pago: metodoPago,
            estado: 'pendiente',
            observaciones: 'ninguna',
            items: carrito.map((item) => ({
                producto_id: item.id_producto,
                cantidad: item.cantidad,
            })),
        };

        setEnviando(true);
        try {
            await saleService.createSale(venta);
            toast.success('Venta registrada con éxito.');
            setCliente('');
            setCajero('');
            setMetodoPago('efectivo');
            setCarrito([]);
            setCantidadesTemp({});
            setBusqueda('');
            fetchProductos();
        } catch (error) {
            toast.error(getErrorMessage(error, 'Hubo un error al registrar la venta.'));
        } finally {
            setEnviando(false);
        }
    };

    const productosFiltrados = productosDisponibles.filter((producto) =>
        producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.codigo.toLowerCase().includes(busqueda.toLowerCase())
    );

    const total = carrito.reduce((acc, item) => acc + item.precio_venta * item.cantidad, 0);
    const igv = total - total / (1 + IGV_TASA);
    const subtotal = total - igv;

    const metodoPagoLabel = METODOS_PAGO.find((m) => m.value === metodoPago)?.label || '—';

    const clienteOptions = clientesDisponibles.map((c) => ({ value: String(c.id_cliente), label: c.nombre }));
    const cajeroOptions = cajerosDisponibles.map((c) => ({ value: String(c.id_usuario), label: `${c.nombre} ${c.apellidos}` }));

    const puedeCrearVenta = cliente && cajero && carrito.length > 0 && !enviando;

    return (
        <div className="min-h-screen bg-brand-ink">
            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-white">
                        <FaCashRegister className="text-brand-secondary" /> Registrar Venta
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">Arma el carrito y registra una nueva venta.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                    <div className="min-w-0">
                        <div className="mb-6 space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Select
                                    value={cliente}
                                    onChange={setCliente}
                                    options={clienteOptions}
                                    placeholder="Seleccionar cliente..."
                                />
                                <Select
                                    value={cajero}
                                    onChange={setCajero}
                                    options={cajeroOptions}
                                    placeholder="Seleccionar cajero..."
                                />
                            </div>

                            <div>
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Método de pago</p>
                                <div className="flex flex-wrap gap-2">
                                    {METODOS_PAGO.map((metodo) => (
                                        <button
                                            key={metodo.value}
                                            type="button"
                                            onClick={() => setMetodoPago(metodo.value)}
                                            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                                                metodoPago === metodo.value
                                                    ? 'border-brand-primary/50 bg-brand-primary/10 text-white'
                                                    : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white'
                                            }`}
                                        >
                                            {metodo.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative max-w-md">
                                <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Buscar producto por nombre o código..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-primary focus:bg-white/7 focus:ring-1 focus:ring-brand-primary"
                                />
                            </div>
                        </div>

                        {cargandoProductos ? (
                            <div className="flex items-center gap-2 py-16 text-sm text-slate-400">
                                <FaSpinner className="animate-spin" /> Cargando productos...
                            </div>
                        ) : productosFiltrados.length === 0 ? (
                            <div className="py-16 text-center">
                                <h3 className="text-base font-semibold text-white">No se encontraron productos</h3>
                                <p className="mt-1.5 text-sm text-slate-400">Ajusta la búsqueda para ver otros resultados.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-white/10">
                                <table className="w-full min-w-[640px] text-left text-sm">
                                    <thead>
                                        <tr className="bg-white/5 text-xs font-medium uppercase tracking-wide text-slate-400">
                                            <th className="px-4 py-3">Código</th>
                                            <th className="px-4 py-3">Producto</th>
                                            <th className="px-4 py-3">Stock</th>
                                            <th className="px-4 py-3">Precio</th>
                                            <th className="px-4 py-3">Cantidad</th>
                                            <th className="px-2 py-3">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productosFiltrados.map((producto) => (
                                            <tr key={producto.codigo} className="border-t border-white/5 text-slate-200 transition hover:bg-white/5">
                                                <td className="px-4 py-3 text-slate-400">{producto.codigo}</td>
                                                <td className="px-4 py-3 font-medium text-white">{producto.nombre}</td>
                                                <td className="px-4 py-3">{producto.stock_actual}</td>
                                                <td className="px-4 py-3 text-brand-secondary">S/ {Number(producto.precio_venta).toFixed(2)}</td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={cantidadesTemp[producto.codigo] || ''}
                                                        onChange={(e) => {
                                                            const valor = parseInt(e.target.value) || '';
                                                            setCantidadesTemp({ ...cantidadesTemp, [producto.codigo]: valor });
                                                        }}
                                                        className="w-20 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-white outline-none transition focus:border-brand-primary focus:bg-white/7 focus:ring-1 focus:ring-brand-primary"
                                                    />
                                                </td>
                                                <td className="px-2 py-3">
                                                    <button
                                                        onClick={() => agregarProducto(producto, cantidadesTemp[producto.codigo] || 0)}
                                                        disabled={!cantidadesTemp[producto.codigo]}
                                                        aria-label="Agregar al carrito"
                                                        title="Agregar al carrito"
                                                        className="shrink-0 rounded-lg border border-brand-primary/40 bg-brand-primary/10 p-2 text-brand-secondary transition hover:bg-brand-primary/20 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <FaPlus className="text-xs" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="lg:sticky lg:top-6 lg:self-start">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                            <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                                <FaShoppingCart className="text-brand-secondary" /> Carrito
                            </h2>

                            {carrito.length === 0 ? (
                                <p className="mt-4 text-sm text-slate-400">Aún no has agregado productos.</p>
                            ) : (
                                <ul className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
                                    {carrito.map((item) => (
                                        <li key={item.codigo} className="flex items-start justify-between gap-3 border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-white" title={item.nombre}>{item.nombre}</p>
                                                <p className="mt-0.5 text-xs text-slate-400">
                                                    {item.cantidad} x S/ {Number(item.precio_venta).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="flex shrink-0 items-center gap-2">
                                                <span className="text-sm font-medium text-brand-secondary">
                                                    S/ {(Number(item.precio_venta) * item.cantidad).toFixed(2)}
                                                </span>
                                                <button
                                                    onClick={() => eliminarProducto(item.codigo)}
                                                    aria-label="Quitar del carrito"
                                                    title="Quitar"
                                                    className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/5 p-1.5 text-red-400 transition hover:bg-red-500/10"
                                                >
                                                    <FaTrash className="text-xs" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <div className="mt-5 space-y-1.5 border-t border-white/10 pt-4 text-sm">
                                <div className="flex justify-between text-slate-400">
                                    <span>Método de pago</span>
                                    <span className="text-slate-200">{metodoPagoLabel}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>Subtotal</span>
                                    <span>S/ {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-400">
                                    <span>IGV (18%)</span>
                                    <span>S/ {igv.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base font-semibold text-white">
                                    <span>Total</span>
                                    <span className="text-brand-secondary">S/ {total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={crearVenta}
                                disabled={!puedeCrearVenta}
                                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {enviando ? <FaSpinner className="animate-spin" /> : <FaCashRegister />}
                                {enviando ? 'Registrando...' : 'Crear Venta'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default RegistrarVenta;
