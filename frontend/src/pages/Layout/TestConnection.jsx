// src/pages/Layout/TestConnection.jsx
import { useEffect, useState } from 'react';
import api from '../../services/api'; 

const TestConnection = () => {
    const [message, setMessage] = useState('Verificando conexión...');

    useEffect(() => {
        api.get('/clientes')
            .then(() => setMessage('Conexión exitosa con el backend'))
            .catch(() => setMessage('Error al conectar con el backend'));
    }, []);

    return (
        <div>
            <h2>Test de Conexión</h2>
            <p>{message}</p>
        </div>
    );
};

export default TestConnection;
