import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  // États pour gérer le formulaire
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // --- LOGIQUE D'AUTHENTIFICATION SIMULÉE (Point 2.6 du sujet) ---
    // Dans un vrai projet, on ferait un fetch vers le backend ici.
    // Pour ton rendu après-demain, on simule la réussite :
    
    if (email && password) {
      // 1. On stocke le jeton de connexion dans le navigateur
      localStorage.setItem('userConnected', 'true');
      
      // 2. On redirige vers l'accueil
      navigate('/');
      
      // 3. On force le rafraîchissement pour que la ProtectedRoute s'actualise
      window.location.reload();
    } else {
      setError("Veuillez remplir tous les champs.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isSignup ? "Création de compte" : "Connexion - MyStudyPlanner"}</h2>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <input 
            type="email" 
            placeholder="Email (ex: etudiant@l3.fr)" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required 
          />
          <input 
            type="password" 
            placeholder="Mot de passe" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required 
          />
          
          {error && <p style={{ color: 'red', fontSize: '13px' }}>{error}</p>}
          
          <button type="submit" style={styles.button}>
            {isSignup ? "S'inscrire" : "Se connecter"}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isSignup ? "Déjà un compte ?" : "Pas encore de compte ?"}
          <span 
            onClick={() => setIsSignup(!isSignup)} 
            style={styles.link}
          >
            {isSignup ? " Connectez-vous" : " Inscrivez-vous ici"}
          </span>
        </p>
      </div>
    </div>
  );
}

// --- PETIT DESIGN RAPIDE POUR TON RENDU ---
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '350px'
  },
  form: {
    display: 'flex',
    direction: 'column',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  toggleText: {
    marginTop: '20px',
    fontSize: '14px'
  },
  link: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontWeight: 'bold'
  }
};

export default Login;