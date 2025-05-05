import React from 'react';
import '../styles/inventario.css';
import Header from './Header';

const products = [
    { id: 1, name: 'Paracetamol 500mg', stock: 150, price: 0.5, image: 'paracetamol.jpg' },
    { id: 2, name: 'Ibuprofeno 400mg', stock: 200, price: 0.8, image: 'ibuprofeno.jpg' },
    { id: 3, name: 'Vitamina C 1000mg', stock: 75, price: 15.9, image: 'vitaminac.jpg' },
    { id: 4, name: 'Alcohol 70% 1L', stock: 45, price: 12.5, image: 'alcohol.jpg' },
    { id: 5, name: 'Omeprazol 20mg', stock: 180, price: 0.9, image: 'omeprazol.jpg' },
    { id: 6, name: 'Loratadina 10mg', stock: 120, price: 0.7, image: 'loratadina.jpg' },
    { id: 7, name: 'Vitamina D3 2000UI', stock: 90, price: 18.5, image: 'vitaminad3.jpg' },
    { id: 8, name: 'Agua Oxigenada 3% 500ml', stock: 60, price: 8.9, image: 'aguaoxigenada.jpg' },
];

const Inventario = () => {
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

                <div className="product-grid">
                    {products.map((product) => (
                        <div key={product.id} className="product-card">
                            <img src={`/images/${product.image}`} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>Stock: {product.stock} unidades</p>
                            <p className="price">S/ {product.price.toFixed(2)}</p>
                            <div className="card-actions">
                                <button className="edit-button">✏️ Editar</button>
                                <button className="delete-button">🗑 Eliminar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Inventario;
