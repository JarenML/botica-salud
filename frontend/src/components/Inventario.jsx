import React, { useEffect, useState, useCallback } from 'react';
import productService from '../services/product.service';
import categoryService from '../services/category.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import NovaSalud from '../assets/NovaLogo.png';
import Select from './ui/Select';
import { FaFilePdf, FaPlus, FaSearch, FaPen, FaTrash, FaSpinner, FaTag } from 'react-icons/fa';

const fieldClass =
    'w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-brand-primary focus:bg-white/7 focus:ring-1 focus:ring-brand-primary';

const Inventario = () => {
    const [products, setProducts] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('todos');
    const [modalVisible, setModalVisible] = useState(false);
    const [popupConfirmVisible, setPopupConfirmVisible] = useState(false);
    const [productoAEliminar, setProductoAEliminar] = useState(null);
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

        // validar si ya existe un producto con el mismo nombre
        const nombreRepetido = products.some(product => {
            const mismoNombre = product.nombre.trim().toLowerCase() === nuevoProducto.nombre.trim().toLowerCase();
            // si esta en modo edicion, permitira tener el mismo nombre
            const esElMismoProducto = modoEdicion && productoEditandoId === product.id_producto;
            return mismoNombre && !esElMismoProducto;
        });

        if (nombreRepetido) {
            alert("Ya existe un producto con ese nombre. Por favor, elige otro.");
            return;
        }

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
        setProductoAEliminar(id_producto);
        setPopupConfirmVisible(true);
    };

    const confirmarEliminacion = async () => {
        try {
            await productService.deleteProduct(productoAEliminar);
            setProducts(prev => prev.filter(prod => prod.id_producto !== productoAEliminar));
            console.log(`Producto ${productoAEliminar} eliminado`);
        } catch(error) {
            console.log(`Error al eliminar el producto ${error}`);
        } finally {
            setPopupConfirmVisible(false);
            setProductoAEliminar(null);
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        const currentDate = new Date().toLocaleDateString();

        const logo = NovaSalud;

        doc.addImage(logo, 'PNG', 1, -10, 70, 70);

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text('Inventario - Botica Nova Salud', 105, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Fecha: ${currentDate}`, 105, 25, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Total de productos: ${products.length}`, 105, 35, { align: 'center' });

        const tableColumn = [
            "Código",
            "Producto",
            "Descripción",
            "Precio Compra",
            "Precio Venta",
            "Stock Mínimo",
            "Stock Actual",
            "Ubicación",
            "Categoría"
        ];
        const tableRows = products.map(product => [
            product.codigo,
            product.nombre,
            product.descripcion,
            `S/ ${Number(product.precio_compra).toFixed(2)}`,
            `S/ ${Number(product.precio_venta).toFixed(2)}`,
            product.stock_minimo,
            product.stock_actual,
            product.ubicacion,
            categorias.find(cat => cat.id_categoria === product.categoria_id)?.nombre || 'Sin categoría'
        ]);

        autoTable(doc, {
            startY: 50,
            head: [tableColumn],
            body: tableRows,
            styles: { halign: 'center', valign: 'middle' },
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 11 }
        });

        doc.save('inventario_botica_nova_salud.pdf');
    };

    const categoriaOptions = [
        { value: 'todos', label: 'Todas las categorías' },
        ...categorias.map((cat) => ({ value: String(cat.id_categoria), label: cat.nombre })),
    ];

    return (
        <div className="min-h-screen bg-brand-ink">
            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Inventario</h1>
                        <p className="mt-1 text-sm text-slate-400">Administra los productos de la farmacia.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                        >
                            <FaFilePdf /> Exportar PDF
                        </button>
                        <button
                            onClick={() => setModalVisible(true)}
                            className="flex items-center gap-2 rounded-lg bg-brand-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
                        >
                            <FaPlus /> Agregar Producto
                        </button>
                    </div>
                </div>

                <div className="mb-8 flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[220px]">
                        <FaSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={filtroNombre}
                            onChange={(e) => setFiltroNombre(e.target.value)}
                            className={`${fieldClass} pl-10`}
                        />
                    </div>
                    <Select
                        icon={FaTag}
                        value={filtroCategoria}
                        onChange={setFiltroCategoria}
                        options={categoriaOptions}
                        className="w-56"
                    />
                </div>

                {loading ? (
                    <div className="flex items-center gap-2 py-16 text-sm text-slate-400">
                        <FaSpinner className="animate-spin" /> Cargando productos...
                    </div>
                ) : products.length === 0 ? (
                    <p className="py-16 text-center text-sm text-slate-400">No se encontraron productos.</p>
                ) : (
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {products.map((product) => (
                            <div
                                key={product.id_producto}
                                className="group rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/20"
                            >
                                <img
                                    src={`${import.meta.env.VITE_API_URL.replace('/api', '')}/images/${product.imagen}`}
                                    alt={product.nombre}
                                    className="mb-3 h-36 w-full rounded-lg object-cover"
                                />
                                <h3 className="truncate text-sm font-semibold text-white">{product.nombre}</h3>
                                <p className="mt-1 text-xs text-slate-400">Stock: {product.stock_actual} unidades</p>
                                <p className="mt-1 text-sm font-semibold text-brand-secondary">
                                    S/ {Number(product.precio_venta).toFixed(2)}
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => handleEditar(product)}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-brand-primary/40 hover:text-brand-secondary"
                                    >
                                        <FaPen className="text-[10px]" /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleEliminar(product.id_producto)}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                                    >
                                        <FaTrash className="text-[10px]" /> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {modalVisible && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-2xl rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        <h2 className="mb-5 text-lg font-semibold text-white">
                            {modoEdicion ? 'Editar producto' : 'Registrar nuevo producto'}
                        </h2>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <input name="codigo" placeholder="Código" value={nuevoProducto.codigo} onChange={handleChangeModal} className={fieldClass} />
                            <input name="nombre" placeholder="Nombre" value={nuevoProducto.nombre} onChange={handleChangeModal} className={fieldClass} />
                            <input
                                name="imagen" type="file" accept="image/*" onChange={handleImagenUpload}
                                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-3 text-sm text-slate-400 outline-none file:mr-3 file:rounded-md file:border-0 file:bg-brand-primary/15 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-brand-secondary hover:file:bg-brand-primary/25"
                            />
                            <input name="descripcion" placeholder="Descripción" value={nuevoProducto.descripcion} onChange={handleChangeModal} className={fieldClass} />
                            <input type="number" name="precio_venta" placeholder="Precio de venta" value={nuevoProducto.precio_venta} onChange={handleChangeModal} className={fieldClass} />
                            <input type="number" name="precio_compra" placeholder="Precio de compra" value={nuevoProducto.precio_compra} onChange={handleChangeModal} className={fieldClass} />
                            <Select
                                value={String(nuevoProducto.categoria_id || '')}
                                onChange={(v) => setNuevoProducto(prev => ({ ...prev, categoria_id: v }))}
                                placeholder="Seleccionar categoría"
                                options={categorias.map((cat) => ({ value: String(cat.id_categoria), label: cat.nombre }))}
                            />
                            <input name="proveedor_id" placeholder="ID proveedor" value={nuevoProducto.proveedor_id} onChange={handleChangeModal} className={fieldClass} />
                            <input type="date" name="fecha_vencimiento" value={nuevoProducto.fecha_vencimiento} onChange={handleChangeModal} className={fieldClass} />
                            <input type="number" name="stock_actual" placeholder="Stock actual" value={nuevoProducto.stock_actual} onChange={handleChangeModal} className={fieldClass} />
                            <input type="number" name="stock_minimo" placeholder="Stock mínimo" value={nuevoProducto.stock_minimo} onChange={handleChangeModal} className={fieldClass} />
                            <input name="ubicacion" placeholder="Ubicación" value={nuevoProducto.ubicacion} onChange={handleChangeModal} className={fieldClass} />
                        </div>
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setModalVisible(false)}
                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleGuardar}
                                className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90"
                            >
                                {modoEdicion ? 'Actualizar' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {popupConfirmVisible && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/70 p-4">
                    <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#121a2b] p-6 shadow-2xl">
                        <h3 className="text-base font-semibold text-white">¿Estás seguro de eliminar este producto?</h3>
                        <p className="mt-1.5 text-sm text-slate-400">Esta acción no se puede deshacer.</p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button
                                onClick={() => setPopupConfirmVisible(false)}
                                className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarEliminacion}
                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500/90"
                            >
                                Sí, eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventario;
