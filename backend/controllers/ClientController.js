const ClientService = require('../services/ClientService');

class ClientController {

    async crearCliente(req, res) {
        try {
            const nuevoCliente = await ClientService.crearCliente(req.body);
            res.status(201).json(nuevoCliente);
        } catch (error) {
            res.status(400).json({ message: `Error al crear el cliente: ${error.message}` });
        }
    }

    async listarClientes(req, res) {
        try {
            const clientes = await ClientService.listarClientes();
            res.status(200).json(clientes);
        } catch (error) {
            res.status(500).json({ message: `Error al listar los clientes: ${error.message}` });
        }
    }

    async obtenerClientePorId(req, res) {
        try {
            const cliente = await ClientService.obtenerClientePorId(req.params.id);
            if (!cliente) {
                return res.status(404).json({ message: 'Cliente no encontrado' });
            }
            res.status(200).json(cliente);
        } catch (error) {
            res.status(400).json({ message: `Error al obtener el cliente: ${error.message}` });
        }
    }

    async actualizarCliente(req, res) {
        try {
            const clienteActualizado = await ClientService.actualizarCliente(req.params.id, req.body);
            res.status(200).json(clienteActualizado);
        } catch (error) {
            res.status(400).json({ message: `Error al actualizar el cliente: ${error.message}` });
        }
    }

    async eliminarCliente(req, res) {
        try {
            const clienteEliminado = await ClientService.eliminarCliente(req.params.id);
            res.status(200).json({
                message: 'Cliente eliminado correctamente',
                cliente: clienteEliminado
            });
        } catch (error) {
            res.status(400).json({ message: `Error al eliminar el cliente: ${error.message}` });
        }
    }
}

module.exports = new ClientController();