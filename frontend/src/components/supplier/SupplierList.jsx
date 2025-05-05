// src/components/supplier/SupplierList.jsx
import React, { useEffect, useState } from 'react';
import {
    FaUser, FaPhone, FaEnvelope, FaMapMarkedAlt,
    FaIdCard, FaEdit, FaTrashAlt, FaSearch,
    FaPlus, FaSave, FaTimes, FaTruck
} from 'react-icons/fa';
import supplierService from '../../services/supplier.service';
import '../../styles/supplier.css';

const SupplierList = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState([]);
    const [formData, setFormData] = useState({
        nombre: '',
        telefono: '',
        email: '',
        direccion: '',
        ruc: ''
    });
    const [editingSupplier, setEditingSupplier] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    useEffect(() => {
        const filtered = suppliers.filter(supplier =>
            supplier.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.telefono.includes(searchTerm) ||
            supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.ruc.includes(searchTerm)
        );
        setFilteredSuppliers(filtered);
    }, [searchTerm, suppliers]);

    const fetchSuppliers = async () => {
        try {
            setIsLoading(true);
            const data = await supplierService.listSuppliers();
            setSuppliers(data);
            setFilteredSuppliers(data);
            setError('');
        } catch (err) {
            setError('Error al cargar los proveedores');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingSupplier) {
                await supplierService.updateSupplier(editingSupplier.id_proveedor, formData);
            } else {
                await supplierService.createSupplier(formData);
            }
            closeModal();
            await fetchSuppliers();
        } catch (err) {
            setError('Error al guardar el proveedor');
        }
    };

    const handleEdit = (supplier) => {
        setEditingSupplier(supplier);
        setFormData({
            nombre: supplier.nombre,
            telefono: supplier.telefono,
            email: supplier.email,
            direccion: supplier.direccion,
            ruc: supplier.ruc,
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este proveedor?')) return;
        try {
            await supplierService.deleteSupplier(id);
            await fetchSuppliers();
        } catch (err) {
            setError('Error al eliminar el proveedor');
        }
    };

    const openModal = () => {
        setEditingSupplier(null);
        setFormData({ nombre: '', telefono: '', email: '', direccion: '', ruc: '' });
        setError('');
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSupplier(null);
        setFormData({ nombre: '', telefono: '', email: '', direccion: '', ruc: '' });
    };

    return (
        <div className="prov-main-container">
            <div className="prov-header">
                <div className="prov-header-title">
                    <FaTruck className="prov-header-icon" />
                    <h1>Gestión de Proveedores</h1>
                </div>

                <div className="prov-header-actions">
                    <div className="prov-search-container">
                        <div className="prov-search-box">
                            <FaSearch className="prov-search-icon" />
                            <input
                                type="text"
                                placeholder="Buscar proveedores..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="prov-search-input"
                            />
                        </div>
                    </div>

                    <button onClick={openModal} className="prov-btn-primary">
                        <FaPlus /> Nuevo Proveedor
                    </button>
                </div>
            </div>

            <div className="prov-list-container">
                <div className="prov-list-header">
                    <div className="prov-total-suppliers">
                        {filteredSuppliers.length} {filteredSuppliers.length === 1 ? 'proveedor' : 'proveedores'} encontrados
                    </div>
                </div>

                {isLoading ? (
                    <div className="prov-loading-spinner">
                        <div className="prov-spinner"></div>
                        <p>Cargando proveedores...</p>
                    </div>
                ) : (
                    <>
                        {filteredSuppliers.length === 0 ? (
                            <div className="prov-empty-state">
                                {searchTerm ? (
                                    <>
                                        <h3>No se encontraron resultados</h3>
                                        <p>No hay proveedores que coincidan con "{searchTerm}"</p>
                                    </>
                                ) : (
                                    <>
                                        <h3>No hay proveedores registrados</h3>
                                        <p>Haz clic en "Nuevo Proveedor" para agregar uno</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="prov-table-wrapper">
                                <table className="prov-table">
                                    <thead>
                                        <tr>
                                            <th>Proveedor</th>
                                            <th>Contacto</th>
                                            <th>RUC</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredSuppliers.map((supplier) => (
                                            <tr key={supplier.id_proveedor} className="prov-row">
                                                <td>
                                                    <div className="prov-info">
                                                        <div className="prov-avatar">
                                                            {supplier.nombre.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h3>{supplier.nombre}</h3>
                                                            {supplier.direccion && (
                                                                <p className="prov-address">
                                                                    <FaMapMarkedAlt /> {supplier.direccion}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="prov-contact-info">
                                                        <p><FaPhone /> {supplier.telefono}</p>
                                                        <p><FaEnvelope /> {supplier.email}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="prov-document-info">
                                                        <p><FaIdCard /> {supplier.ruc}</p>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="prov-actions">
                                                        <button
                                                            onClick={() => handleEdit(supplier)}
                                                            className="prov-btn-edit"
                                                            title="Editar"
                                                        >
                                                            <FaEdit /> Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(supplier.id_proveedor)}
                                                            className="prov-btn-delete"
                                                            title="Eliminar"
                                                        >
                                                            <FaTrashAlt /> Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Modal para formulario */}
            {showModal && (
                <div className="prov-modal-overlay">
                    <div className="prov-modal-content">
                        <div className="prov-modal-header">
                            <h2>{editingSupplier ? 'Editar Proveedor' : 'Nuevo Proveedor'}</h2>
                            <button onClick={closeModal} className="prov-modal-close">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="prov-form">
                            <div className="prov-form-grid">
                                <div className="prov-form-group">
                                    <label><FaUser /> Nombre</label>
                                    <input
                                        name="nombre"
                                        placeholder="Nombre del proveedor"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        required
                                        className="prov-form-input"
                                    />
                                </div>

                                <div className="prov-form-group">
                                    <label><FaPhone /> Teléfono</label>
                                    <input
                                        name="telefono"
                                        placeholder="Número de teléfono"
                                        value={formData.telefono}
                                        onChange={handleChange}
                                        required
                                        className="prov-form-input"
                                    />
                                </div>

                                <div className="prov-form-group">
                                    <label><FaEnvelope /> Email</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="Correo electrónico"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="prov-form-input"
                                    />
                                </div>

                                <div className="prov-form-group">
                                    <label><FaMapMarkedAlt /> Dirección</label>
                                    <input
                                        name="direccion"
                                        placeholder="Dirección completa"
                                        value={formData.direccion}
                                        onChange={handleChange}
                                        className="prov-form-input"
                                    />
                                </div>

                                <div className="prov-form-group">
                                    <label><FaIdCard /> RUC</label>
                                    <input
                                        name="ruc"
                                        placeholder="Número de RUC"
                                        value={formData.ruc}
                                        onChange={handleChange}
                                        required
                                        className="prov-form-input"
                                    />
                                </div>
                            </div>

                            {error && <div className="prov-error-message">{error}</div>}

                            <div className="prov-modal-actions">
                                <button type="button" onClick={closeModal} className="prov-btn-cancel">
                                    <FaTimes /> Cancelar
                                </button>
                                <button type="submit" className="prov-btn-primary">
                                    <FaSave /> {editingSupplier ? 'Guardar cambios' : 'Registrar proveedor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierList;