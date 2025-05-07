export const permissions = {
    admin: {
        productos: 'crud',
        categorias: 'crud',
        ventas: 'crud',
        registrar_venta: 'crud',
        clientes: 'crud',
        proveedores: 'crud',
    },
    farmaceutico: {
        productos: 'read',
        categorias: 'read',
        ventas: 'read',
        registrar_venta: 'crud',
        clientes: 'crud',
        proveedores: 'read',
    },
    cajero: {
        productos: 'read',
        categorias: 'read',
        ventas: 'crud',
        registrar_venta: 'read',
        clientes: 'read',
        proveedores: 'read',
    },
};

export const canDo = (rol, modulo, accion) => {
    const permiso = permissions[rol]?.[modulo];
    if (!permiso) return false;
    if (permiso === 'crud') return true;
    return permiso === accion;
};