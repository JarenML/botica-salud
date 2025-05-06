import React, { useEffect, useState } from 'react';
import '../styles/sale.css';

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [filtro, setFiltro] = useState('Todas');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const ejemplo = [
            { codigo: "#VNT-001", fecha: "15/03/2024", cliente: "María González", total: 156.50, estado: "Pagada" },
            { codigo: "#VNT-002", fecha: "15/03/2024", cliente: "Juan Pérez", total: 89.30, estado: "Pendiente" },
            { codigo: "#VNT-003", fecha: "15/03/2024", cliente: "Ana Martínez", total: 234.80, estado: "Anulado" },
            { codigo: "#VNT-004", fecha: "15/03/2024", cliente: "Carlos Ruiz", total: 167.20, estado: "Pagada" },
            { codigo: "#VNT-005", fecha: "15/03/2024", cliente: "Laura Torres", total: 92.60, estado: "Pendiente" },
        ];
        setVentas(ejemplo);
    }, []);

    const ventasFiltradas = ventas.filter((venta) =>
        (filtro === 'Todas' || venta.estado === filtro) &&
        venta.codigo.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="ventas-wrapper">
            <h1>Lista de Ventas</h1>
            <p className="subtitulo">Gestión de registros de ventas</p>

            <div className="ventas-controles">
                <input
                    type="text"
                    placeholder="🔍 Buscar por código de venta..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <div className="ventas-filtros">
                    {['Todas', 'Pendiente', 'Pagada', 'Anulado'].map((estado) => (
                        <button
                            key={estado}
                            className={filtro === estado ? 'activo' : ''}
                            onClick={() => setFiltro(estado)}
                        >
                            {estado}
                        </button>
                    ))}
                </div>
            </div>

            <table className="ventas-tabla">
                <thead>
                    <tr>
                        <th>Código de Venta</th>
                        <th>Fecha</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ventasFiltradas.map((venta, i) => (
                        <tr key={i}>
                            <td>{venta.codigo}</td>
                            <td>{venta.fecha}</td>
                            <td>{venta.cliente}</td>
                            <td>${venta.total.toFixed(2)}</td>
                            <td>
                                <span className={`badge ${venta.estado.toLowerCase()}`}>
                                    {venta.estado}
                                </span>
                            </td>
                            <td>⋮</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="ventas-paginacion">
                <label>
                    Mostrar <select><option>10</option></select> por página
                </label>
                <div>
                    <button>{'<'}</button>
                    <span>Página 1 de 10</span>
                    <button>{'>'}</button>
                </div>
            </div>
        </div>
    );
};

export default Ventas;
