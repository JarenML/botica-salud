// src/components/supplier/SupplierList.jsx
import React, { useEffect, useState } from 'react';
import {
    FaPhone, FaEnvelope, FaMapMarkedAlt,
    FaIdCard, FaEdit, FaTrash, FaSearch,
    FaPlus, FaTimes, FaTruck, FaSpinner, FaInfoCircle
} from 'react-icons/fa';
import supplierService from '../../services/supplier.service';
import { useToast } from '../../context/ToastContext';

const getErrorMessage = (error, fallback) => error?.response?.data?.message || fallback;

const fieldClass =
    'w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-primary focus:bg-white/7 focus:ring-1 focus:ring-brand-primary';

const formatFechaHora = (iso) =>
    iso ? new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const emptyForm = { nombre: '', telefono: '', email: '', direccion: '', ruc: '' };

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [supplierToDelete, setSupplierToDelete] = useState(null);
    const [supplierInfo, setSupplierInfo] = useState(null);
    const toast = useToast();

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            setIsLoading(true);
            const data = await supplierService.listSuppliers();
            setSuppliers(data);
        } catch (error) {
            toast.error(getErrorMessage(error, 'Error al cargar los proveedores.'));
        } finally {
            setIsLoading(false);
        }
    };

    const filteredSuppliers = suppliers.filter((supplier) =>
        supplier.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.telefono.includes(searchTerm) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.ruc.includes(searchTerm)
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSupplier) {
                await supplierService.updateSupplier(editingSupplier.id_proveedor, formData);
                toast.success('Proveedor actualizado correctamente.');
            } else {
                await supplierService.createSupplier(formData);
                toast.success('Proveedor creado correctamente.');
            }
            closeModal();
            await fetchSuppliers();
        } catch (error) {
            toast.error(getErrorMessage(error, 'Error al guardar el proveedor.'));
        }
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            nombre: supplier.nombre,
            telefono: supplier.telefono,
            email: supplier.email,
            direccion: supplier.direccion || '',
            ruc: supplier.ruc,
        });
        setShowModal(true);
    };

    const confirmarEliminacion = async () => {
        try {
            await supplierService.deleteSupplier(supplierToDelete.id_proveedor);
            setSuppliers((prev) => prev.filter((s) => s.id_proveedor !== supplierToDelete.id_proveedor));
            toast.success('Proveedor eliminado correctamente.');
        } catch (error) {
            toast.error(getErrorMessage(error, 'Error al eliminar el proveedor.'));
        } finally {
            setSupplierToDelete(null);
        }
    };

    const openModal = () => {
        setEditingSupplier(null);
        setFormData(emptyForm);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSupplier(null);
        setFormData(emptyForm);
    };

    return (
        <div className="min-h-screen bg-brand-ink">
            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-semibold text-white">
                            <FaTruck className="text-brand-secondary" /> Proveedores
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">Administra los proveedores de la farmacia.</p>
                    </div>
                    <button
                        onClick={openModal}
                        className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
                    >
                        <FaPlus /> Nuevo proveedor
                    </button>
                </div>

                <div className="mb-8 flex flex-wrap items-center gap-4">
                    <div className="relative min-w-[220px] max-w-md flex-1">
                        <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar proveedores..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`${fieldClass} pl-10`}
                        />
                    </div>
                    <span className="text-sm text-slate-400">
                        {filteredSuppliers.length} {filteredSuppliers.length === 1 ? 'proveedor' : 'proveedores'}
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex items-center gap-2 py-16 text-sm text-slate-400">
                        <FaSpinner className="animate-spin" /> Cargando proveedores...
                    </div>
                ) : filteredSuppliers.length === 0 ? (
                    <div className="py-16 text-center">
                        {searchTerm ? (
                            <>
                                <h3 className="text-base font-semibold text-white">No se encontraron resultados</h3>
                                <p className="mt-1.5 text-sm text-slate-400">No hay proveedores que coincidan con "{searchTerm}"</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-base font-semibold text-white">No hay proveedores registrados</h3>
                                <p className="mt-1.5 text-sm text-slate-400">Crea tu primer proveedor usando el botón "Nuevo proveedor"</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-white/10">
                        <table className="w-full min-w-[720px] table-fixed text-left text-sm">
                            <thead>
                                <tr className="bg-white/5 text-xs font-medium uppercase tracking-wide text-slate-400">
                                    <th className="w-[32%] px-4 py-3">Proveedor</th>
                                    <th className="w-[30%] px-4 py-3">Contacto</th>
                                    <th className="w-[18%] px-4 py-3">RUC</th>
                                    <th className="w-[20%] px-2 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSuppliers.map((supplier) => (
                                    <tr key={supplier.id_proveedor} className="border-t border-white/5 text-slate-200 transition hover:bg-white/5">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-sm font-bold text-brand-secondary">
                                                    {supplier.nombre.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-white">{supplier.nombre}</p>
                                                    {supplier.direccion && (
                                                        <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-400">
                                                            <FaMapMarkedAlt className="shrink-0 text-[10px]" /> {supplier.direccion}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="flex items-center gap-1.5 truncate text-slate-300">
                                                <FaPhone className="shrink-0 text-[10px] text-brand-secondary" /> {supplier.telefono}
                                            </p>
                                            <p className="mt-1 flex items-center gap-1.5 truncate text-slate-400">
                                                <FaEnvelope className="shrink-0 text-[10px] text-brand-secondary" /> {supplier.email}
                                            </p>
                                        </td>
                                        <td className="truncate px-4 py-3 text-slate-300">
                                            <span className="flex items-center gap-1.5">
                                                <FaIdCard className="shrink-0 text-[10px] text-brand-secondary" /> {supplier.ruc}
                                            </span>
                                        </td>
                                        <td className="px-2 py-3">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setSupplierInfo(supplier)}
                                                    aria-label="Ver información del proveedor"
                                                    title="Ver info"
                                                    className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-brand-primary/40 hover:text-brand-secondary"
                                                >
                                                    <FaInfoCircle className="text-xs" />
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(supplier)}
                                                    aria-label="Editar proveedor"
                                                    title="Editar"
                                                    className="shrink-0 rounded-lg border border-white/10 bg-white/5 p-2 text-slate-300 transition hover:border-brand-primary/40 hover:text-brand-secondary"
                                                >
                                                    <FaEdit className="text-xs" />
                                                </button>
                                                <button
                                                    onClick={() => setSupplierToDelete(supplier)}
                                                    aria-label="Eliminar proveedor"
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

            {showModal && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-lg font-semibold text-white">
                                {editingSupplier ? 'Editar proveedor' : 'Nuevo proveedor'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="shrink-0 text-slate-500 transition hover:text-white"
                            >
                                <FaTimes className="text-sm" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <input
                                    name="nombre"
                                    placeholder="Nombre del proveedor"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                    className={fieldClass}
                                />
                                <input
                                    name="telefono"
                                    placeholder="Teléfono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    required
                                    className={fieldClass}
                                />
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className={fieldClass}
                                />
                                <input
                                    name="ruc"
                                    placeholder="RUC"
                                    value={formData.ruc}
                                    onChange={handleChange}
                                    required
                                    className={fieldClass}
                                />
                                <input
                                    name="direccion"
                                    placeholder="Dirección (opcional)"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    className={`${fieldClass} sm:col-span-2`}
                                />
                            </div>

                            <div className="mt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
                                >
                                    {editingSupplier ? 'Guardar cambios' : 'Registrar proveedor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {supplierToDelete && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        <h3 className="text-base font-semibold text-white">¿Eliminar "{supplierToDelete.nombre}"?</h3>
                        <p className="mt-1.5 text-sm text-slate-400">Esta acción no se puede deshacer.</p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setSupplierToDelete(null)}
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

            {supplierInfo && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-sm font-bold text-brand-secondary">
                                    {supplierInfo.nombre.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-lg font-semibold text-white">{supplierInfo.nombre}</h3>
                            </div>
                            <button
                                onClick={() => setSupplierInfo(null)}
                                className="shrink-0 text-slate-500 transition hover:text-white"
                            >
                                <FaTimes className="text-sm" />
                            </button>
                        </div>

                        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                            <div>
                                <dt className="text-xs text-slate-500">RUC</dt>
                                <dd className="text-slate-200">{supplierInfo.ruc || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-500">Registrado</dt>
                                <dd className="text-slate-200">{formatFechaHora(supplierInfo.fecha_creacion)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-500">Teléfono</dt>
                                <dd className="text-slate-200">{supplierInfo.telefono || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-500">Email</dt>
                                <dd className="truncate text-slate-200" title={supplierInfo.email}>{supplierInfo.email || '—'}</dd>
                            </div>
                        </dl>

                        <div className="mt-4">
                            <p className="text-xs text-slate-500">Dirección</p>
                            <p className="mt-1 text-sm text-slate-300">{supplierInfo.direccion || 'Sin dirección registrada.'}</p>
                        </div>

                        <div className="mt-5 flex justify-end">
                            <button
                                onClick={() => setSupplierInfo(null)}
                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierList;
