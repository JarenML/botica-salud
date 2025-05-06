import React, { useEffect, useState } from 'react';
import '../styles/inventario.css';
import Header from './Header';
import productService from '../services/product.service';
import categoryService from '../services/category.service';

const Inventario = () => {
    const [products, setProducts] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [nuevoProducto, setNuevoProducto] = useState({
        codigo: '',
        nombre: '',
        imagen: '',
        descripcion: '',
        precio_venta: '',
        precio_compra: '',
        categoria_id: '',
        proveedor_id: '',
        fecha_vencimiento: '',
        stock_actual: '',
        stock_minimo: '',
        ubicacion: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true);
            try {
                const filtros = {};
                if (filtroNombre) filtros.nombre = filtroNombre;
                if (filtroCategoria && filtroCategoria !== 'todos') filtros.categoria_id = filtroCategoria;
    
                const [resProductos, resCategorias] = await Promise.all([
                    productService.listProducts(filtros),
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

    const handleChangeModal = (e) => {
        const { name, value } = e.target;
        setNuevoProducto(prev => ({ ...prev, [name]: value }));
    };

    const handleImagenUpload = (e) => {
        const file = e.target.files[0];
        console.log(`FILE: ${file}`);
        if (!file) return;
    
        const nombre = nuevoProducto.nombre.trim().toLowerCase().replace(/\s+/g, '_');
        const extension = file.name.split('.').pop();
        const nombreFinal = `${nombre}.${extension}`;
    
        const renamedFile = new File([file], nombreFinal, { type: file.type });
        console.log(`HandleImageUpload: ${renamedFile}`);
        console.log(`HandleImageUpload: ${renamedFile.name}`);
        setNuevoProducto(prev => ({
            ...prev,
            imagen: renamedFile
        }));

    };
    
    const handleGuardar = async () => {
        try {
            const formData = new FormData();
            // Agregar campos de texto
            for (let key in nuevoProducto) {
                console.log(key, nuevoProducto[key])
                if (key !== 'imagen') {
                formData.append(key, nuevoProducto[key]);
                }
            }
        
            // Agregar el archivo de imagen
            if (nuevoProducto.imagen) {
                formData.append('imagen', nuevoProducto.imagen);
            }
            await productService.createProduct(formData); 
    
            console.log("Producto guardado:", nuevoProducto);
            setModalVisible(false);
            setFiltroNombre(''); 
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    return (
        
        <div className="inventory-page">
            <main className="inventory-content">
                {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Registrar nuevo producto</h2>
                        <div className="modal-form">
                            <input name="codigo" placeholder="Código" value={nuevoProducto.codigo} onChange={handleChangeModal} />
                            <input name="nombre" placeholder="Nombre" value={nuevoProducto.nombre} onChange={handleChangeModal} />
                            <input name="imagen" type="file" accept="image/*" onChange={(e) => handleImagenUpload(e)} />
                            <input name="descripcion" placeholder="Descripción" value={nuevoProducto.descripcion} onChange={handleChangeModal} />
                            <input type="number" name="precio_venta" placeholder="Precio de venta" value={nuevoProducto.precio_venta} onChange={handleChangeModal} />
                            <input type="number" name="precio_compra" placeholder="Precio de compra" value={nuevoProducto.precio_compra} onChange={handleChangeModal} />
                            <select name="categoria_id" value={nuevoProducto.categoria_id} onChange={handleChangeModal}>
                                <option value="">Seleccionar categoría</option>
                                {categorias.map(cat => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                                ))}
                            </select>
                            <input name="proveedor_id" placeholder="ID proveedor" value={nuevoProducto.proveedor_id} onChange={handleChangeModal} />
                            <input type="date" name="fecha_vencimiento" value={nuevoProducto.fecha_vencimiento} onChange={handleChangeModal} />
                            <input type="number" name="stock_actual" placeholder="Stock actual" value={nuevoProducto.stock_actual} onChange={handleChangeModal} />
                            <input type="number" name="stock_minimo" placeholder="Stock mínimo" value={nuevoProducto.stock_minimo} onChange={handleChangeModal} />
                            <input name="ubicacion" placeholder="Ubicación" value={nuevoProducto.ubicacion} onChange={handleChangeModal} />
                        </div>
                        <div className="modal-actions">
                            <button className="save-button" onClick={handleGuardar}>Guardar</button>
                            <button className="cancel-button" onClick={() => setModalVisible(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
                <div className="inventory-header">
                    <h2>Inventario</h2>
                    <button className="add-button" onClick={() => setModalVisible(true)}>+ Agregar Producto</button>
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
                            
                            <div key={product.id_producto} className="product-card">
                                <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/images/${product.imagen}`} alt={product.nombre} />
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