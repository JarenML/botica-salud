// src/components/client/ClientList.jsx
import React, { useEffect, useState } from 'react';
import {
    FaEdit, FaTrash, FaPlus, FaTimes, FaUser, FaSearch, FaIdCard,
    FaPhone, FaEnvelope, FaMapMarkerAlt, FaBirthdayCake, FaSpinner, FaInfoCircle
} from 'react-icons/fa';
import clientService from '../../services/client.service';
import { useToast } from '../../context/ToastContext';

const getErrorMessage = (error, fallback) => error?.response?.data?.message || fallback;

const fieldClass =
    'w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-primary focus:bg-white/7 focus:ring-1 focus:ring-brand-primary';

const errorFieldClass =
    'w-full rounded-lg border border-red-500/50 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-red-500 focus:bg-white/7 focus:ring-1 focus:ring-red-500';

const formatFecha = (iso) => (iso ? new Date(iso).toLocaleDateString('es-PE') : '—');

const formatFechaHora = (iso) =>
    iso ? new Date(iso).toLocaleString('es-PE', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const emptyForm = { dni: '', nombre: '', apellido: '', telefono: '', email: '', direccion: '', fecha_nacimiento: '' };

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [editingClient, setEditingClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [clientToDelete, setClientToDelete] = useState(null);
    const [clientInfo, setClientInfo] = useState(null);
    const toast = useToast();

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setIsLoading(true);
            const data = await clientService.listClients();
            setClients(data);
        } catch (error) {
            toast.error(getErrorMessage(error, 'Error al cargar los clientes.'));
        } finally {
            setIsLoading(false);
        }
    };

    const filteredClients = clients.filter((client) =>
        client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.dni.includes(searchTerm)
    );

    const validateForm = () => {
        const newErrors = {};

        if (!formData.dni.trim()) newErrors.dni = 'El DNI es requerido';
        else if (!/^\d{8}$/.test(formData.dni)) newErrors.dni = 'DNI debe tener 8 dígitos';
        else if (clients.some(c => c.dni === formData.dni && (!editingClient || c.id_cliente !== editingClient.id_cliente))) {
            newErrors.dni = 'DNI ya existente';
        }

        if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
        else if (formData.nombre.length > 50) newErrors.nombre = 'Máximo 50 caracteres';

        if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
        else if (formData.apellido.length > 50) newErrors.apellido = 'Máximo 50 caracteres';

        if (!formData.email.trim()) newErrors.email = 'El email es requerido';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email no válido';

        if (formData.telefono && !/^\d{9}$/.test(formData.telefono)) newErrors.telefono = 'Teléfono debe tener 9 dígitos';

        if (formData.fecha_nacimiento) {
            const birthDate = new Date(formData.fecha_nacimiento);
            const today = new Date();
            if (birthDate > today) newErrors.fecha_nacimiento = 'Fecha no puede ser futura';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (editingClient) {
                await clientService.updateClient(editingClient.id_cliente, formData);
                toast.success('Cliente actualizado correctamente.');
            } else {
                await clientService.createClient(formData);
                toast.success('Cliente creado correctamente.');
            }
            closeForm();
            await fetchClients();
        } catch (error) {
            toast.error(getErrorMessage(error, 'Error al guardar el cliente.'));
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData({
            dni: client.dni,
            nombre: client.nombre,
            apellido: client.apellido,
            telefono: client.telefono || '',
            email: client.email,
            direccion: client.direccion || '',
            fecha_nacimiento: client.fecha_nacimiento ? client.fecha_nacimiento.split('T')[0] : '',
        });
        setShowForm(true);
        setErrors({});
    };

    const confirmarEliminacion = async () => {
        try {
            await clientService.deleteClient(clientToDelete.id_cliente);
            setClients((prev) => prev.filter((c) => c.id_cliente !== clientToDelete.id_cliente));
            toast.success('Cliente eliminado correctamente.');
        } catch (error) {
            toast.error(getErrorMessage(error, 'Error al eliminar el cliente.'));
        } finally {
            setClientToDelete(null);
        }
    };

    const closeForm = () => {
        setEditingClient(null);
        setFormData(emptyForm);
        setShowForm(false);
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-brand-ink">
            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-3 text-2xl font-semibold text-white">
                            <FaUser className="text-brand-secondary" /> Clientes
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">Administra los clientes de la farmacia.</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
                    >
                        <FaPlus /> Nuevo cliente
                    </button>
                </div>

                <div className="mb-8 flex flex-wrap items-center gap-4">
                    <div className="relative min-w-[220px] max-w-md flex-1">
                        <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, apellido o DNI..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`${fieldClass} pl-10`}
                        />
                    </div>
                    <span className="text-sm text-slate-400">
                        {filteredClients.length} {filteredClients.length === 1 ? 'cliente' : 'clientes'}
                    </span>
                </div>

                {isLoading ? (
                    <div className="flex items-center gap-2 py-16 text-sm text-slate-400">
                        <FaSpinner className="animate-spin" /> Cargando clientes...
                    </div>
                ) : filteredClients.length === 0 ? (
                    <div className="py-16 text-center">
                        {searchTerm ? (
                            <>
                                <h3 className="text-base font-semibold text-white">No se encontraron resultados</h3>
                                <p className="mt-1.5 text-sm text-slate-400">No hay clientes que coincidan con "{searchTerm}"</p>
                            </>
                        ) : (
                            <>
                                <h3 className="text-base font-semibold text-white">No hay clientes registrados</h3>
                                <p className="mt-1.5 text-sm text-slate-400">Crea tu primer cliente usando el botón "Nuevo cliente"</p>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredClients.map((client) => (
                            <div
                                key={client.id_cliente}
                                className="rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-sm font-bold text-brand-secondary">
                                        {client.nombre.charAt(0).toUpperCase()}{client.apellido.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-sm font-semibold text-white">{client.nombre} {client.apellido}</h3>
                                        <p className="text-xs text-slate-400">DNI {client.dni}</p>
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1 text-xs text-slate-300">
                                    <p className="flex items-center gap-1.5 truncate"><FaEnvelope className="shrink-0 text-brand-secondary" /> {client.email}</p>
                                    {client.telefono && (
                                        <p className="flex items-center gap-1.5 truncate"><FaPhone className="shrink-0 text-brand-secondary" /> {client.telefono}</p>
                                    )}
                                    {client.direccion && (
                                        <p className="flex items-center gap-1.5 truncate"><FaMapMarkerAlt className="shrink-0 text-brand-secondary" /> {client.direccion}</p>
                                    )}
                                    {client.fecha_nacimiento && (
                                        <p className="flex items-center gap-1.5 truncate"><FaBirthdayCake className="shrink-0 text-brand-secondary" /> {formatFecha(client.fecha_nacimiento)}</p>
                                    )}
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(client)}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-brand-primary/40 hover:text-brand-secondary"
                                    >
                                        <FaEdit className="text-[10px]" /> Editar
                                    </button>
                                    <button
                                        onClick={() => setClientToDelete(client)}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                                    >
                                        <FaTrash className="text-[10px]" /> Eliminar
                                    </button>
                                </div>
                                <button
                                    onClick={() => setClientInfo(client)}
                                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-brand-primary/40 hover:text-brand-secondary"
                                >
                                    <FaInfoCircle className="text-[10px]" /> Ver info
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {showForm && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-lg font-semibold text-white">
                                {editingClient ? 'Editar cliente' : 'Nuevo cliente'}
                            </h2>
                            <button
                                onClick={closeForm}
                                className="shrink-0 text-slate-500 transition hover:text-white"
                            >
                                <FaTimes className="text-sm" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <div>
                                    <input
                                        name="dni"
                                        placeholder="DNI"
                                        value={formData.dni}
                                        onChange={handleChange}
                                        maxLength="8"
                                        className={errors.dni ? errorFieldClass : fieldClass}
                                    />
                                    {errors.dni && <p className="mt-1 text-xs text-red-400">{errors.dni}</p>}
                                </div>

                                <div>
                                    <input
                                        name="nombre"
                                        placeholder="Nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        maxLength="50"
                                        className={errors.nombre ? errorFieldClass : fieldClass}
                                    />
                                    {errors.nombre && <p className="mt-1 text-xs text-red-400">{errors.nombre}</p>}
                                </div>

                                <div>
                                    <input
                                        name="apellido"
                                        placeholder="Apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        maxLength="50"
                                        className={errors.apellido ? errorFieldClass : fieldClass}
                                    />
                                    {errors.apellido && <p className="mt-1 text-xs text-red-400">{errors.apellido}</p>}
                                </div>

                                <div>
                                    <input
                                        name="telefono"
                                        placeholder="Teléfono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        maxLength="9"
                                        className={errors.telefono ? errorFieldClass : fieldClass}
                                    />
                                    {errors.telefono && <p className="mt-1 text-xs text-red-400">{errors.telefono}</p>}
                                </div>

                                <div>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Correo electrónico"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={errors.email ? errorFieldClass : fieldClass}
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                                </div>

                                <input
                                    name="direccion"
                                    placeholder="Dirección (opcional)"
                                    value={formData.direccion}
                                    onChange={handleChange}
                                    className={fieldClass}
                                />

                                <div>
                                    <input
                                        name="fecha_nacimiento"
                                        type="date"
                                        value={formData.fecha_nacimiento}
                                        onChange={handleChange}
                                        className={errors.fecha_nacimiento ? errorFieldClass : fieldClass}
                                    />
                                    {errors.fecha_nacimiento && <p className="mt-1 text-xs text-red-400">{errors.fecha_nacimiento}</p>}
                                </div>
                            </div>

                            <div className="mt-2 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
                                >
                                    {editingClient ? 'Guardar cambios' : 'Crear cliente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {clientInfo && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary/15 text-sm font-bold text-brand-secondary">
                                    {clientInfo.nombre.charAt(0).toUpperCase()}{clientInfo.apellido.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="text-lg font-semibold text-white">{clientInfo.nombre} {clientInfo.apellido}</h3>
                            </div>
                            <button
                                onClick={() => setClientInfo(null)}
                                className="shrink-0 text-slate-500 transition hover:text-white"
                            >
                                <FaTimes className="text-sm" />
                            </button>
                        </div>

                        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                            <div>
                                <dt className="text-xs text-slate-500">DNI</dt>
                                <dd className="text-slate-200">{clientInfo.dni || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-500">Registrado</dt>
                                <dd className="text-slate-200">{formatFechaHora(clientInfo.fecha_creacion)}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-500">Teléfono</dt>
                                <dd className="text-slate-200">{clientInfo.telefono || '—'}</dd>
                            </div>
                            <div>
                                <dt className="text-xs text-slate-500">Fecha de nacimiento</dt>
                                <dd className="text-slate-200">{formatFecha(clientInfo.fecha_nacimiento)}</dd>
                            </div>
                            <div className="col-span-2">
                                <dt className="text-xs text-slate-500">Email</dt>
                                <dd className="truncate text-slate-200" title={clientInfo.email}>{clientInfo.email || '—'}</dd>
                            </div>
                        </dl>

                        <div className="mt-4">
                            <p className="text-xs text-slate-500">Dirección</p>
                            <p className="mt-1 text-sm text-slate-300">{clientInfo.direccion || 'Sin dirección registrada.'}</p>
                        </div>

                        <div className="mt-5 flex justify-end">
                            <button
                                onClick={() => setClientInfo(null)}
                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {clientToDelete && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        <h3 className="text-base font-semibold text-white">
                            ¿Eliminar a "{clientToDelete.nombre} {clientToDelete.apellido}"?
                        </h3>
                        <p className="mt-1.5 text-sm text-slate-400">Esta acción no se puede deshacer.</p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setClientToDelete(null)}
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
        </div>
    );
};

export default ClientList;
