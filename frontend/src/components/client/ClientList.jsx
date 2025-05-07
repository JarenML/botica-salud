// src/components/client/ClientList.jsx
import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes, FaUser, FaSearch, FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBirthdayCake } from 'react-icons/fa';
import clientService from '../../services/client.service';
import '../../styles/client.css';

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [formData, setFormData] = useState({ 
        dni: '', nombre: '', apellido: '', telefono: '', 
        email: '', direccion: '', fecha_nacimiento: '' 
    });
    const [errors, setErrors] = useState({});
    const [editingClient, setEditingClient] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    useEffect(() => {
        const filtered = clients.filter(client => 
            client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.dni.includes(searchTerm)
        );
        setFilteredClients(filtered);
    }, [searchTerm, clients]);

    const fetchClients = async () => {
        try {
            setIsLoading(true);
            const data = await clientService.listClients();
            setClients(data);
            setFilteredClients(data);
            setErrors({});
        } catch (err) {
            setErrors({ fetch: 'Error al cargar los clientes' });
        } finally {
            setIsLoading(false);
        }
    };

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
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        try {
            if (editingClient) {
                await clientService.updateClient(editingClient.id_cliente, formData);
                setSuccessMessage('Cliente actualizado correctamente');
                setShowForm(false);
            } else {
                await clientService.createClient(formData);
                setSuccessMessage('Cliente creado correctamente');
                setShowForm(false);
            }
            
            setFormData({ dni: '', nombre: '', apellido: '', telefono: '', email: '', direccion: '', fecha_nacimiento: '' });
            setEditingClient(null);
            await fetchClients();
            
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setErrors({ submit: err.response?.data?.message || 'Error al guardar el cliente' });
        }
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setFormData({
            dni: client.dni,
            nombre: client.nombre,
            apellido: client.apellido,
            telefono: client.telefono,
            email: client.email,
            direccion: client.direccion,
            fecha_nacimiento: client.fecha_nacimiento ? client.fecha_nacimiento.split('T')[0] : '', 
        });
        setShowForm(true);
        setErrors({});
        setSuccessMessage('');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return;
        
        try {
            await clientService.deleteClient(id);
            setSuccessMessage('Cliente eliminado correctamente');
            await fetchClients();
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setErrors({ delete: 'Error al eliminar el cliente' });
        }
    };

    const cancelEdit = () => {
        setEditingClient(null);
        setFormData({ dni: '', nombre: '', apellido: '', telefono: '', email: '', direccion: '', fecha_nacimiento: '' });
        setShowForm(false);
        setErrors({});
    };

    return (
        <div className="client-container">
            <header className="client-header">
                <h1><FaUser /> Gestión de Clientes</h1>
                <div className="client-actions">
                    <div className="client-search">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button 
                        className={`client-add-btn ${showForm ? 'hidden' : ''}`}
                        onClick={() => setShowForm(true)}
                    >
                        <FaPlus /> Nuevo Cliente
                    </button>
                </div>
            </header>

            {showForm && (
                <div className="form-modal">
                    <div className="form-modal-content">
                        <form onSubmit={handleSubmit} className="client-form">
                            <h2>{editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
                            
                            <div className="form-grid">
                                <div className="form-group">
                                    <label><FaIdCard /> DNI *</label>
                                    <input
                                        name="dni"
                                        value={formData.dni}
                                        onChange={handleChange}
                                        className={errors.dni ? 'error' : ''}
                                        maxLength="8"
                                    />
                                    {errors.dni && <span className="error-message">{errors.dni}</span>}
                                </div>
                                
                                <div className="form-group">
                                    <label>Nombre *</label>
                                    <input
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        className={errors.nombre ? 'error' : ''}
                                        maxLength="50"
                                    />
                                    {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Apellido *</label>
                                    <input
                                        name="apellido"
                                        value={formData.apellido}
                                        onChange={handleChange}
                                        className={errors.apellido ? 'error' : ''}
                                        maxLength="50"
                                    />
                                    {errors.apellido && <span className="error-message">{errors.apellido}</span>}
                                </div>

                                <div className="form-group">
                                    <label><FaPhone /> Teléfono</label>
                                    <input
                                        name="telefono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        className={errors.telefono ? 'error' : ''}
                                        maxLength="9"
                                    />
                                    {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                                </div>

                                <div className="form-group">
                                    <label><FaEnvelope /> Email *</label>
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={errors.email ? 'error' : ''}
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label><FaMapMarkerAlt /> Dirección</label>
                                    <input
                                        name="direccion"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="form-group">
                                    <label><FaBirthdayCake /> Fecha Nacimiento</label>
                                    <input
                                        name="fecha_nacimiento"
                                        type="date"
                                        value={formData.fecha_nacimiento}
                                        onChange={handleChange}
                                        className={errors.fecha_nacimiento ? 'error' : ''}
                                    />
                                    {errors.fecha_nacimiento && <span className="error-message">{errors.fecha_nacimiento}</span>}
                                </div>
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="btn-primary">
                                    {editingClient ? <FaSave /> : <FaPlus />}
                                    {editingClient ? ' Guardar' : ' Crear Cliente'}
                                </button>
                                
                                <button type="button" onClick={cancelEdit} className="btn-cancel">
                                    <FaTimes /> Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {successMessage && <div className="alert-success">{successMessage}</div>}
            {errors.submit && <div className="alert-error">{errors.submit}</div>}

            <div className="client-content">
                {isLoading ? (
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Cargando clientes...</p>
                    </div>
                ) : (
                    <>
                        <div className="client-count">
                            Mostrando {filteredClients.length} {filteredClients.length === 1 ? 'cliente' : 'clientes'}
                        </div>

                        {filteredClients.length === 0 ? (
                            <div className="empty-state">
                                {searchTerm ? (
                                    <>
                                        <h3>No se encontraron resultados</h3>
                                        <p>No hay clientes que coincidan con "{searchTerm}"</p>
                                    </>
                                ) : (
                                    <>
                                        <h3>No hay clientes registrados</h3>
                                        <p>Presiona "Nuevo Cliente" para agregar uno</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="client-grid">
                                {filteredClients.map(client => (
                                    <div key={client.id_cliente} className="client-card">
                                        <div className="card-header">
                                            <div className="avatar">
                                                {client.nombre.charAt(0)}{client.apellido.charAt(0)}
                                            </div>
                                            <div>
                                                <h3>{client.nombre} {client.apellido}</h3>
                                                <p className="dni">{client.dni}</p>
                                            </div>
                                            <div className="card-actions">
                                                <button onClick={() => handleEdit(client)}>
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(client.id_cliente)}>
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="card-body">
                                            <p><FaEnvelope /> {client.email}</p>
                                            {client.telefono && <p><FaPhone /> {client.telefono}</p>}
                                            {client.direccion && <p><FaMapMarkerAlt /> {client.direccion}</p>}
                                            {client.fecha_nacimiento && (
                                                <p><FaBirthdayCake /> {new Date(client.fecha_nacimiento).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ClientList;