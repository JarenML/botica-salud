import React, { useEffect, useState, useCallback } from 'react';
import '../styles/inventario.css';
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
    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoEditandoId, setProductoEditandoId] = useState(null);
    const [loading, setLoading] = useState(true);

    const cargarDatos = useCallback(async () => {
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
    }, [filtroNombre, filtroCategoria]);
    
    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]); 

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

    const handleEditar = (producto) => {
        const productoFormateado = {
            ...producto,
            fecha_vencimiento: producto.fecha_vencimiento?.split('T')[0] || ''
        };
        setNuevoProducto(productoFormateado);
        setModalVisible(true);
        setModoEdicion(true);
        setProductoEditandoId(producto.id_producto);
    };
    
    const handleGuardar = async () => {
        try {
            const formData = new FormData();
            for (let key in nuevoProducto) {
                if (key !== 'imagen') {
                    formData.append(key, nuevoProducto[key]);
                }
            }
            if (nuevoProducto.imagen) {
                formData.append('imagen', nuevoProducto.imagen);
            }
    
            if (modoEdicion && productoEditandoId) {
                await productService.updateProduct(productoEditandoId, formData);
            } else {
                await productService.createProduct(formData);
            }
    
            setModalVisible(false);
            setModoEdicion(false);
            setProductoEditandoId(null);
            setNuevoProducto({ /* resetea todos los campos */ });
            await cargarDatos();
        } catch (error) {
            console.error("Error al guardar:", error);
        }
    };

    const handleEliminar = async (id_producto) => {
        console.log(id_producto);
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
        
        try {
            await productService.deleteProduct(id_producto);
            setProducts((prev) => prev.filter((prod) => prod.id_producto !== id_producto));
            console.log(`Producto ${id_producto} eliminado.`);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    };
    return (
        <div className="inventory-page-unique">
            <main className="inventory-content-unique">
                {modalVisible && (
                <div className="modal-overlay-unique">
                    <div className="modal-unique">
                        <h2>{modoEdicion ? 'Editar producto' : 'Registrar nuevo producto'}</h2>
                        <div className="modal-form-unique">
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
                        <div className="modal-actions-unique">
                        <button className="save-button-unique" onClick={handleGuardar}>{modoEdicion ? 'Actualizar' : 'Guardar'}</button>
                            <button className="cancel-button-unique" onClick={() => setModalVisible(false)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}
                <div className="inventory-header-unique">
                    <h2>Inventario</h2>
                    <button className="add-button-unique" onClick={() => setModalVisible(true)}>+ Agregar Producto</button>
                </div>

                <div className="inventory-filters-unique">
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
                    <div className="product-grid-unique">
                        {products.map((product) => {
                            return (
                                <div key={product.id_producto} className="product-card-unique">
                                    <img src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/images/${product.imagen}`} alt={product.nombre} />
                                    <h3>{product.nombre}</h3>
                                    <p>Stock: {product.stock_actual} unidades</p>
                                    <p className="price">S/ {Number(product.precio_venta).toFixed(2)}</p>
                                    <div className="card-actions-unique">
                                        <button className="edit-button-unique" onClick={() => handleEditar(product)}>✏️ Editar</button>
                                        <button className="delete-button-unique" onClick={() => handleEliminar(product.id_producto)}>🗑 Eliminar</button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Inventario;