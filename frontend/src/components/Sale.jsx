// src/components/Sale.jsx
import React, { useEffect, useState } from 'react';
import { FaChartLine, FaSearch, FaTrash, FaSpinner, FaExchangeAlt, FaFilter, FaInfoCircle, FaTimes } from 'react-icons/fa';
import saleService from '../services/sale.service';
import Select from './ui/Select';
import { useToast } from '../context/ToastContext';

const getErrorMessage = (error, fallback) => error?.response?.data?.message || fallback;

const ESTADOS = ['pendiente', 'pagado', 'anulado'];

const capitalizar = (texto) => texto ? texto.charAt(0).toUpperCase() + texto.slice(1) : texto;

const formatFecha = (iso) =>
    iso ? new Date(iso).toLocaleDateString('es-PE') : '—';

const formatFechaHora = (iso) =>
    iso ? new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const formatMetodoPago = (metodo) =>
    metodo ? metodo.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '—';

const badgeClass = (estado) => ({
    pagado: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    pendiente: 'border-amber-500/20 bg-amber-500/10 text-amber-400',
    anulado: 'border-red-500/20 bg-red-500/10 text-red-400',
}[estado] || 'border-white/10 bg-white/5 text-slate-300');

const filtroOptions = [
    { value: 'todas', label: 'Todas' },
    ...ESTADOS.map((e) => ({ value: e, label: capitalizar(e) })),
];

const Sale = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todas');
    const [busqueda, setBusqueda] = useState('');
    const [ventaAEliminar, setVentaAEliminar] = useState(null);
    const [ventaCambiandoEstado, setVentaCambiandoEstado] = useState(null);
    const [ventaDetalleId, setVentaDetalleId] = useState(null);
    const [ventaDetalle, setVentaDetalle] = useState(null);
    const [cargandoDetalle, setCargandoDetalle] = useState(false);
    const toast = useToast();

    const fetchVentas = async () => {
        setLoading(true);
        try {
            const data = await saleService.listSales();
            setVentas(data);
        } catch (error) {
            toast.error(getErrorMessage(error, 'Error al cargar las ventas.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVentas();
    }, []);

    const ventasFiltradas = ventas.filter((venta) =>
        (filtro === 'todas' || venta.estado === filtro) &&
        (venta.codigo_venta || '').toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleCambiarEstado = async (venta, nuevoEstado) => {
        setVentaCambiandoEstado(null);
        if (nuevoEstado === venta.estado) return;
        try {
            await saleService.changeStateService(venta.id_venta, nuevoEstado);
            setVentas((prev) =>
                prev.map((v) => (v.id_venta === venta.id_venta ? { ...v, estado: nuevoEstado } : v))
            );
            toast.success('Estado de la venta actualizado.');
        } catch (error) {
            toast.error(getErrorMessage(error, 'Error al actualizar el estado.'));
        }
    };

    const handleVerDetalle = async (venta) => {
        setVentaDetalleId(venta.id_venta);
        setCargandoDetalle(true);
        try {
            const data = await saleService.getSaleById(venta.id_venta);
            setVentaDetalle(data);
        } catch (error) {
            toast.error(getErrorMessage(error, 'Error al cargar el detalle de la venta.'));
            setVentaDetalleId(null);
        } finally {
            setCargandoDetalle(false);
        }
    };

    const cerrarDetalle = () => {
        setVentaDetalleId(null);
        setVentaDetalle(null);
    };

    const confirmarEliminacion = async () => {
        try {
            await saleService.deleteSale(ventaAEliminar.id_venta);
            setVentas((prev) => prev.filter((v) => v.id_venta !== ventaAEliminar.id_venta));
            toast.success('Venta eliminada correctamente.');
        } catch (error) {
            toast.error(getErrorMessage(error, 'Error al eliminar la venta.'));
        } finally {
            setVentaAEliminar(null);
        }
    };

    return (
        <div className="min-h-screen bg-brand-ink">
            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
                <div className="mb-8">
                    <h1 className="flex items-center gap-3 text-2xl font-semibold text-white">
                        <FaChartLine className="text-brand-secondary" /> Ventas
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">Historial y gestión de registros de venta.</p>
                </div>

                <div className="mb-8 flex flex-wrap items-center gap-4">
                    <div className="relative min-w-[220px] max-w-md flex-1">
                        <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar por código de venta..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-10 pr-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-primary focus:bg-white/7 focus:ring-1 focus:ring-brand-primary"
                        />
                    </div>

                    <Select
                        icon={FaFilter}
                        value={filtro}
                        onChange={setFiltro}
                        options={filtroOptions}
                        className="w-44"
                    />

                    <span className="text-sm text-slate-400">
                        {ventasFiltradas.length} {ventasFiltradas.length === 1 ? 'venta' : 'ventas'}
                    </span>
                </div>

                {loading ? (
                    <div className="flex items-center gap-2 py-16 text-sm text-slate-400">
                        <FaSpinner className="animate-spin" /> Cargando ventas...
                    </div>
                ) : ventasFiltradas.length === 0 ? (
                    <div className="py-16 text-center">
                        {busqueda || filtro !== 'todas' ? (
                            <>
                                <h3 className="text-base font-semibold text-white">No se encontraron resultados</h3>
                                <p className="mt-1.5 text-sm text-slate-400">Ajusta la búsqueda o el filtro seleccionado.</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-base font-semibold text-white">No hay ventas registradas</h3>
                                <p className="mt-1.5 text-sm text-slate-400">Las ventas que registres aparecerán aquí.</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full min-w-[760px] table-fixed text-left text-sm">
                            <thead>
                                <tr className="bg-white/5 text-xs font-medium uppercase tracking-wide text-slate-400">
                                    <th className="w-1/6 px-4 py-3">Código</th>
                                    <th className="w-1/6 px-4 py-3">Fecha</th>
                                    <th className="w-1/6 px-4 py-3">Cliente</th>
                                    <th className="w-1/6 px-4 py-3">Total</th>
                                    <th className="w-1/6 px-4 py-3">Estado</th>
                                    <th className="w-1/6 px-2 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventasFiltradas.map((venta) => (
                                    <tr key={venta.id_venta} className="border-t border-white/5 text-slate-200 transition hover:bg-white/5">
                                        <td className="truncate px-4 py-3 font-medium text-white" title={venta.codigo_venta}>{venta.codigo_venta || '—'}</td>
                                        <td className="truncate px-4 py-3 text-slate-400">{formatFecha(venta.fecha_creacion)}</td>
                                        <td className="truncate px-4 py-3" title={venta.cliente_nombre}>{venta.cliente_nombre || '—'}</td>
                                        <td className="truncate px-4 py-3 font-semibold text-brand-secondary">S/ {Number(venta.total).toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(venta.estado)}`}>
                                                {capitalizar(venta.estado)}
                                            </span>
                                        </td>
                                        <td className="px-2 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleVerDetalle(venta)}
                                                    aria-label="Ver detalles de la venta"
                                                    title="Ver detalles"
                                                    className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-brand-primary/40 hover:text-brand-secondary"
                                                >
                                                    <FaInfoCircle className="text-xs" />
                                                </button>
                                                <button
                                                    onClick={() => setVentaCambiandoEstado(venta)}
                                                    aria-label="Cambiar estado"
                                                    title="Cambiar estado"
                                                    className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-brand-primary/40 hover:text-brand-secondary"
                                                >
                                                    <FaExchangeAlt className="text-xs" />
                                                </button>
                                                <button
                                                    onClick={() => setVentaAEliminar(venta)}
                                                    aria-label="Eliminar venta"
                                                    title="Eliminar"
                                                    className="shrink-0 rounded-lg border border-red-500/20 bg-red-500/5 p-2 text-red-400 transition hover:bg-red-500/10"
                                                >
                                                    <FaTrash className="text-xs" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            {ventaAEliminar && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        <h3 className="text-base font-semibold text-white">
                            ¿Eliminar la venta "{ventaAEliminar.codigo_venta}"?
                        </h3>
                        <p className="mt-1.5 text-sm text-slate-400">Esta acción no se puede deshacer.</p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setVentaAEliminar(null)}
                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarEliminacion}
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500/90"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {ventaCambiandoEstado && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        <h3 className="text-base font-semibold text-white">
                            Cambiar estado de "{ventaCambiandoEstado.codigo_venta}"
                        </h3>
                        <p className="mt-1.5 text-sm text-slate-400">Selecciona el nuevo estado de la venta.</p>
                        <div className="mt-5 space-y-2">
                            {ESTADOS.map((estado) => {
                                const esActual = estado === ventaCambiandoEstado.estado;
                                return (
                                    <button
                                        key={estado}
                                        onClick={() => handleCambiarEstado(ventaCambiandoEstado, estado)}
                                        className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                                            esActual
                                                ? 'border-brand-primary/50 bg-brand-primary/10 text-white'
                                                : 'border-white/10 bg-white/5 text-slate-300 hover:border-white/20 hover:text-white'
                                        }`}
                                    >
                                        <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(estado)}`}>
                                            {capitalizar(estado)}
                                        </span>
                                        {esActual && <span className="text-xs text-slate-400">Actual</span>}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-5 flex justify-end">
                            <button
                                onClick={() => setVentaCambiandoEstado(null)}
                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {ventaDetalleId && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        {cargandoDetalle || !ventaDetalle ? (
                            <div className="flex items-center gap-2 py-10 text-sm text-slate-400">
                                <FaSpinner className="animate-spin" /> Cargando detalle...
                            </div>
                        ) : (
                            <>
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{ventaDetalle.codigo_venta || `Venta #${ventaDetalle.id_venta}`}</h3>
                                        <p className="mt-1 text-xs text-slate-500">{formatFechaHora(ventaDetalle.fecha_creacion)}</p>
                                    </div>
                                    <button
                                        onClick={cerrarDetalle}
                                        className="shrink-0 text-slate-500 transition hover:text-white"
                                    >
                                        <FaTimes className="text-sm" />
                                    </button>
                                </div>

                                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                    <div>
                                        <dt className="text-xs text-slate-500">Cliente</dt>
                                        <dd className="text-slate-200">{ventaDetalle.cliente_nombre || '—'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500">Cajero</dt>
                                        <dd className="text-slate-200">{ventaDetalle.usuario_nombre || '—'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500">Método de pago</dt>
                                        <dd className="text-slate-200">{formatMetodoPago(ventaDetalle.metodo_pago)}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs text-slate-500">Estado</dt>
                                        <dd>
                                            <span className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(ventaDetalle.estado)}`}>
                                                {capitalizar(ventaDetalle.estado)}
                                            </span>
                                        </dd>
                                    </div>
                                </dl>

                                {ventaDetalle.observaciones && (
                                    <div className="mt-4">
                                        <p className="text-xs text-slate-500">Observaciones</p>
                                        <p className="mt-1 text-sm text-slate-300">{ventaDetalle.observaciones}</p>
                                    </div>
                                )}

                                <p className="mt-5 mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Productos</p>
                                <div className="overflow-x-auto rounded-lg border border-white/10">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="bg-white/5 text-xs font-medium uppercase tracking-wide text-slate-400">
                                                <th className="px-3 py-2">Producto</th>
                                                <th className="px-3 py-2">Cant.</th>
                                                <th className="px-3 py-2">P. Unit.</th>
                                                <th className="px-3 py-2">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(ventaDetalle.detalle_venta || []).map((item) => (
                                                <tr key={item.id_detalle} className="border-t border-white/5 text-slate-200">
                                                    <td className="px-3 py-2">{item.producto_nombre || `#${item.producto_id}`}</td>
                                                    <td className="px-3 py-2">{item.cantidad}</td>
                                                    <td className="px-3 py-2">S/ {Number(item.precio_unitario).toFixed(2)}</td>
                                                    <td className="px-3 py-2">S/ {Number(item.subtotal).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-4 ml-auto w-full max-w-[200px] space-y-1.5 text-sm">
                                    <div className="flex justify-between text-slate-400">
                                        <span>IGV (18%)</span>
                                        <span>S/ {Number(ventaDetalle.igv).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-base font-semibold text-white">
                                        <span>Total</span>
                                        <span className="text-brand-secondary">S/ {Number(ventaDetalle.total).toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-5 flex justify-end">
                                    <button
                                        onClick={cerrarDetalle}
                                        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sale;
