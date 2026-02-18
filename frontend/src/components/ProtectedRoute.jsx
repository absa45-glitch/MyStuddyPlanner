import { Navigate } from 'react-router-dom';

// Ce composant enveloppe vos pages privées
const ProtectedRoute = ({ children }) => {
  // On vérifie si un utilisateur est enregistré dans le navigateur
  const isAuthenticated = localStorage.getItem('userConnected') === 'true';

  if (!isAuthenticated) {
    // Si pas connecté, hop ! Redirection vers la page de login
    return <Navigate to="/login" replace />;
  }

  return children; // Sinon, on affiche la page demandée
};

export default ProtectedRoute;