import React, { useEffect, useState } from 'react';
import '../styles/inventario.css';
import Header from './Header';
import { obtenerProductos } from '../services/product.service';
import categoryService from '../services/category.service';

const Inventario = () => {
    const [products, setProducts] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const filtros = {};
                if (filtroNombre) filtros.nombre = filtroNombre;
                if (filtroCategoria && filtroCategoria !== 'todos') filtros.categoria_id = filtroCategoria;
    
                const [resProductos, resCategorias] = await Promise.all([
                    obtenerProductos(filtros),
                    categoryService.listCategories()
                ]);
                setProducts(resProductos.data);
                setCategorias(resCategorias);
            } catch (error) {
                console.error('Error al cargar datos:', error);
            } finally {
                setLoading(false);
            }
        };
    
        cargarDatos();
    }, [filtroNombre, filtroCategoria]);

    return (
        <div className="inventory-page">
            <main className="inventory-content">
                <div className="inventory-header">
                    <h2>Inventario</h2>
                    <button className="add-button">+ Agregar Producto</button>
                </div>

                <div className="inventory-filters">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={filtroNombre}
                        onChange={(e) => setFiltroNombre(e.target.value)}
                    />
                    <select
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                    >
                        <option value="todos">Todos</option>
                        {categorias.map((cat) => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                {cat.nombre}
                            </option>
                        ))}
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