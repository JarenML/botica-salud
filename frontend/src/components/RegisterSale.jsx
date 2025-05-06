// src/components/RegistrarVenta.jsx
import React, { useState, useEffect } from 'react';
import '../styles/register_sale.css';
import clientService from '../services/client.service';
import userService from '../services/user.service';
import productService from '../services/product.service';


const RegistrarVenta = () => {
    const [cliente, setCliente] = useState('');
    const [cajero, setCajero] = useState('');
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [carrito, setCarrito] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [clientesDisponibles, setClientesDisponibles] = useState([]);
    const [cajerosDisponibles, setCajerosDisponibles] = useState([]);
    const [productosDisponibles, setProductosDisponibles] = useState([]);

    const agregarProducto = (producto, cantidad) => {
        if (!cantidad || cantidad < 1) return;
        const existente = carrito.find(item => item.codigo === producto.codigo);
        if (existente) {
            existente.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad });
        }
        setCarrito([...carrito]);
    };

    const eliminarProducto = codigo => {
        setCarrito(carrito.filter(item => item.codigo !== codigo));
    };

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                const data = await clientService.listClients();
                setClientesDisponibles(data);
            } catch (error) {
                console.error('error al obtener clientes:', error);
            }
        };
    
        fetchClientes();
    }, []);

    useEffect(() => {
        const fetchCajeros = async () => {
            try {
                const data = await userService.listUsers();
                const soloCajeros = data.filter(user => user.rol === 'cajero');
                setCajerosDisponibles(soloCajeros);
            } catch (error) {
                console.error('error al obtener cajeros:', error);
            }
        };
    
        fetchCajeros();
    }, []);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const res = await productService.listProducts();
                setProductosDisponibles(res.data);
            } catch (error) {
                console.error('error al obtener productos:', error);
            }
        };
    
        fetchProductos();
    }, []);

    const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    return (
        <div className="registrar-venta-container">
            <h2>Registrar Venta</h2>

            <div className="form-venta">
            <select value={cliente} onChange={e => setCliente(e.target.value)}>
                <option value="">Seleccionar cliente...</option>
                {clientesDisponibles.map(c => (
                    <option key={c.id_cliente} value={c.id_cliente}>
                        {c.nombre}
                    </option>
                ))}
            </select>

            <select value={cajero} onChange={e => setCajero(e.target.value)}>
                <option value="">Seleccionar cajero...</option>
                {cajerosDisponibles.map(c => (
                    <option key={c.id_usuario} value={c.id_usuario}>
                        {c.nombre} {c.apellidos}
                    </option>
                ))}
            </select>

                
                <div className="metodo-pago">
                    {['Efectivo', 'Tarjeta de Crédito', 'Tarjeta de Débito', 'Transferencia', 'Otros'].map(metodo => (
                        <button
                            key={metodo}
                            className={metodoPago === metodo ? 'activo' : ''}
                            onClick={() => setMetodoPago(metodo)}
                        >
                            {metodo}
                        </button>
                    ))}
                </div>

                <input
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    className="buscador-productos"
                />

            </div>

            <table className="tabla-productos">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre del Producto</th>
                        <th>Stock</th>
                        <th>Precio Unit.</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                {productosDisponibles
                        .filter(producto =>
                            producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                            producto.codigo.toLowerCase().includes(busqueda.toLowerCase())
                        )
                        .map(producto => (
                            <tr key={producto.codigo}>
                            <td>{producto.codigo}</td>
                            <td>{producto.nombre}</td>
                            <td>{producto.stock_actual}</td>
                            <td>${Number(producto.precio_venta).toFixed(2)}</td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    onChange={e => producto.tempCantidad = parseInt(e.target.value)}
                                />
                            </td>
                            <td>$0.00</td>
                            <td>
                                <button onClick={() => agregarProducto(producto, producto.tempCantidad)}>+</button>
                            </td>
                        </tr>
                ))}
                </tbody>
            </table>

            <h3>Productos Seleccionados</h3>
            <table className="tabla-carrito">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Subtotal</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>
                    {carrito.map(item => (
                        <tr key={item.codigo}>
                            <td>{item.codigo}</td>
                            <td>{item.nombre}</td>
                            <td>{item.cantidad}</td>
                            <td>${item.precio.toFixed(2)}</td>
                            <td>${(item.precio * item.cantidad).toFixed(2)}</td>
                            <td>
                                <button onClick={() => eliminarProducto(item.codigo)}>🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="resumen-venta">
                <p>Subtotal: ${subtotal.toFixed(2)}</p>
                <p>IVA (16%): ${iva.toFixed(2)}</p>
                <h3>Total: ${total.toFixed(2)}</h3>
                <button className="crear-venta-btn">Crear Venta</button>
            </div>
        </div>
    );
};

export default RegistrarVenta;
