import React, { useEffect, useState } from 'react';
import '../styles/sale.css';
import saleService from '../services/sale.service'; 

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [filtro, setFiltro] = useState('Todas');
    const [busqueda, setBusqueda] = useState('');

    useEffect(() => {
        const fetchVentas = async () => {
            try {
                const data = await saleService.listSales();
                const formatoVentas = data.map((venta) => ({
                    id: venta.id_venta, // ← nuevo
                    codigo: venta.codigo_venta,
                    fecha: new Date(venta.fecha_creacion).toLocaleDateString('es-PE'),
                    cliente: venta.cliente_nombre,
                    total: parseFloat(venta.total),
                    estado: capitalizar(venta.estado),
                }));
                setVentas(formatoVentas);
            } catch (error) {
                console.error('Error al obtener las ventas:', error);
            }
        };
        fetchVentas();
    }, []);

    const capitalizar = (texto) =>
        texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();

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
                    {['Todas', 'Pendiente', 'Pagado', 'Anulado'].map((estado) => (
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
                            <td>
                                <select
                                    value={venta.estado}
                                    onChange={async (e) => {
                                        const nuevoEstado = e.target.value;
                                        try {
                                            await saleService.changeStateService(venta.id, nuevoEstado.toLowerCase());
                                            setVentas((prevVentas) =>
                                                prevVentas.map((v, index) =>
                                                    index === i ? { ...v, estado: capitalizar(nuevoEstado) } : v
                                                )
                                            );
                                        } catch (error) {
                                            console.error('Error al cambiar el estado:', error);
                                        }
                                    }}
                                >
                                    {['Pendiente', 'Pagado', 'Anulado'].map((estado) => (
                                        <option key={estado} value={estado}>
                                            {estado}
                                        </option>
                                    ))}
                                </select>
                            </td>
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
