import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Importation des pages restantes
import Home from './pages/home';
import Login from './pages/login';
import Courses from './pages/cours';
import Taches from './pages/taches';
import ProtectedRoute from './components/ProtectedRoute'; // Middleware de sécurité

function App() {
  // Fonction pour supprimer la session et rediriger vers la connexion
  const logout = () => {
    localStorage.removeItem('userConnected');
    window.location.href = '/login';
  };

  return (
    <Router>
      {/* Barre de navigation simplifiée (sans Planning) */}
      <nav style={styles.nav}>
        <div style={styles.navLinks}>
          <Link to="/" style={styles.link}>🏠 Accueil</Link>
          <Link to="/taches" style={styles.link}>📝 Mes Tâches</Link>
          <Link to="/cours" style={styles.link}>🎓 Mes Matières</Link>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>Déconnexion</button>
      </nav>

      {/* Configuration des routes de l'application */}
      <Routes>
        {/* Page publique */}
        <Route path="/login" element={<Login />} />
        
        {/* Pages protégées : accessibles uniquement si l'utilisateur est connecté */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/taches" element={<ProtectedRoute><Taches /></ProtectedRoute>} />
        <Route path="/cours" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

// Styles de la navigation
const styles = {
  nav: { 
    padding: '15px 30px', 
    background: '#2c3e50', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  navLinks: { display: 'flex', gap: '25px' },
  link: { 
    color: 'white', 
    textDecoration: 'none', 
    fontWeight: '500',
    fontSize: '16px' 
  },
  logoutBtn: { 
    background: '#e74c3c', 
    color: 'white', 
    border: 'none', 
    padding: '8px 15px', 
    borderRadius: '5px', 
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default App;