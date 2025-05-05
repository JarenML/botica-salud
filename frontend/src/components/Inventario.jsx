import React, { useEffect, useState } from 'react';
import '../styles/inventario.css';
import Header from './Header';
import { obtenerProductos } from '../services/product.service';

const Inventario = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarProductos = async () => {
            try {
                const res = await obtenerProductos();
                setProducts(res.data); 
            } catch (error) {
                console.error('Error al cargar productos:', error);
            } finally {
                setLoading(false);
            }
        };

        cargarProductos();
    }, []);

    return (
        <div className="inventory-page">
            <Header></Header>
            <main className="inventory-content">
                <div className="inventory-header">
                    <h2>Inventario</h2>
                    <button className="add-button">+ Agregar Producto</button>
                </div>

                <div className="inventory-filters">
                    <input type="text" placeholder="Buscar producto..." />
                    <select>
                        <option value="todos">Todos</option>
                        <option value="categoria_a">Categoría A</option>
                        <option value="categoria_b">Categoría B</option>
                    </select>
                </div>

                {loading ? (
                    <p>Cargando productos...</p>
                ) : (
                    <div className="product-grid">
                        {products.map((product) => (
                            <div key={product.id} className="product-card">
                                <img src={`/images/${product.imagen}`} alt={product.nombre} />
                                <h3>{product.nombre}</h3>
                                <p>Stock: {product.stock_actual} unidades</p>
                                <p className="price">S/ {Number(product.precio_venta).toFixed(2)}</p>
                                <div className="card-actions">
                                    <button className="edit-button">✏️ Editar</button>
                                    <button className="delete-button">🗑 Eliminar</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Inventario;
