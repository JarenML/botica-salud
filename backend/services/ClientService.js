const ClientModel = require('../models/ClientModel');

class ClientService {

    async crearCliente(datos) {
        return await ClientModel.crearCliente(datos);
    }

    async listarClientes() {
        return await ClientModel.listarClientes();
    }

    async obtenerClientePorId(id) {
        const cliente = await ClientModel.obtenerClientePorId(id);
        if (!cliente) {
            throw new Error('Cliente no encontrado');
        }
        return cliente;
    }

    async actualizarCliente(id, datos) {
        const clienteExistente = await ClientModel.obtenerClientePorId(id);
        if (!clienteExistente) {
            throw new Error('Cliente no encontrado');
        }
        return await ClientModel.actualizarCliente(id, datos);
    }

    async eliminarCliente(id) {
        const clienteExistente = await ClientModel.obtenerClientePorId(id);
        if (!clienteExistente) {
            throw new Error('Cliente no encontrado');
        }
        return await ClientModel.eliminarCliente(id);
    }
}

module.exports = new ClientService();