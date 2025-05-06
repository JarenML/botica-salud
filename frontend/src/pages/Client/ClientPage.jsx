// src/pages/Client/ClientPage.jsx

import React from 'react';
import ClientList from '../../components/client/ClientList'; // Importa el componente de clientes

const ClientPage = () => {
    return (
        <div>
            <ClientList /> {/* Componente principal */}
        </div>
    );
};

export default ClientPage;