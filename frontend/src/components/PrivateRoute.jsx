// src/components/PrivateRoute.jsx
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const rol = usuario?.rol || 'invitado';

    if (rol === 'invitado') {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PrivateRoute;
