// src/components/RegistrarVenta.jsx
import React, { useState, useEffect } from 'react';
import '../styles/register_sale.css';
import clientService from '../services/client.service';
import userService from '../services/user.service';
import productService from '../services/product.service';
import saleService from '../services/sale.service';

const RegistrarVenta = () => {
    const [cliente, setCliente] = useState('');
    const [cajero, setCajero] = useState('');
    const [metodoPago, setMetodoPago] = useState('Efectivo');
    const [carrito, setCarrito] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [clientesDisponibles, setClientesDisponibles] = useState([]);
    const [cajerosDisponibles, setCajerosDisponibles] = useState([]);
    const [productosDisponibles, setProductosDisponibles] = useState([]);
    const [cantidadesTemp, setCantidadesTemp] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const agregarProducto = (producto, cantidad) => {
        if (!cantidad || cantidad < 1 ) {
            return;
        }

        if ( cantidad > producto.stock_actual ) {
            setErrorMessage('Cantidad excede el stock disponible');
            return;
        }
    
        const cantidadTotal = carrito.reduce((acc, item) => {
            if (item.codigo === producto.codigo) {
                return acc + item.cantidad;
            }
            return acc;
        }, 0);
    
        if (cantidadTotal + cantidad > producto.stock_actual) {
            setErrorMessage('Cantidad excede el stock disponible');
            return;
        }
    
        const existente = carrito.find(item => item.codigo === producto.codigo);
        if (existente) {
            existente.cantidad += cantidad;
        } else {
            carrito.push({ ...producto, cantidad, id_producto: producto.id_producto });
        }
    
        setCarrito([...carrito]);
        setCantidadesTemp(prevState => ({ ...prevState, [producto.codigo]: '' }));
        setErrorMessage(''); 
    };

    const crearVenta = async () => {
        if (!cliente || !cajero || carrito.length === 0) {
            setErrorMessage('Debes seleccionar cliente, cajero y al menos un producto.');
            return;
        }
    
        const metodos = {
            'Efectivo': 'efectivo',
            'Tarjeta de Crédito': 'tarjeta_credito',
            'Tarjeta de Débito': 'tarjeta_debito',
            'Transferencia': 'transferencia',
            'Otros': 'otros',
        };
    
        const venta = {
            codigo_venta: `VEN-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
            usuario_id: parseInt(cajero),
            cliente_id: parseInt(cliente),
            total: Number(total.toFixed(2)),
            metodo_pago: metodos[metodoPago],
            estado: 'pendiente',
            observaciones: 'ninguna'
        };
    
        try {
            await saleService.createSale(venta);
    
            // Actualizar stock de cada producto vendido
            for (const item of carrito) {
                const nuevoStock = item.stock_actual - item.cantidad;
                await productService.updateStock(item.id_producto, nuevoStock);
            }
    
            alert('Venta registrada con éxito');
    
            // Reiniciar formulario
            setCliente('');
            setCajero('');
            setMetodoPago('Efectivo');
            setCarrito([]);
            setCantidadesTemp({});
            setBusqueda('');
            fetchProductos();
        } catch (error) {
            console.error('error al crear venta:', error);
            setErrorMessage('Hubo un error al registrar la venta.');
        }
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

    const fetchProductos = async () => {
        try {
            const res = await productService.listProducts();
            setProductosDisponibles(res.data);
        } catch (error) {
            console.error('error al obtener productos:', error);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const subtotal = carrito.reduce((acc, item) => acc + item.precio_venta * item.cantidad, 0);
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
                {errorMessage && <div className="error-message">{errorMessage}</div>}
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
                                value={cantidadesTemp[producto.codigo] || ''}
                                onChange={e => {
                                    const valor = parseInt(e.target.value) || '';
                                    setCantidadesTemp({ ...cantidadesTemp, [producto.codigo]: valor });
                                }}
                            />
                            </td>
                            <td>
                                ${((cantidadesTemp[producto.codigo] || 0) * producto.precio_venta).toFixed(2)}
                            </td>
                            <td>
                            <button onClick={() => agregarProducto(producto, cantidadesTemp[producto.codigo] || 0)}>+</button>
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
                            <td>${Number(item.precio_venta).toFixed(2)}</td>
                            <td>${(Number(item.precio_venta) * item.cantidad).toFixed(2)}</td>
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
                <button className="crear-venta-btn" onClick={crearVenta}>Crear Venta</button>
            </div>
        </div>
    );
};

export default RegistrarVenta;
