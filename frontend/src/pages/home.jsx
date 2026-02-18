import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  // Récupération du prénom (simulé pour la personnalisation)
  const userName = "Étudiant";
  
  // Date du jour pour le bandeau d'accueil
  const today = new Date().toLocaleDateString('fr-FR', { 
    weekday: 'long', day: 'numeric', month: 'long' 
  });

  return (
    <div style={styles.dashboard}>
      {/* SECTION HEADER : Message de bienvenue personnalisé */}
      <header style={styles.welcomeSection}>
        <div style={styles.welcomeText}>
          <h1 style={styles.h1}>Bonjour, {userName} 👋</h1>
          <p style={styles.subtitle}>Voici un résumé de votre progression pour ce {today}.</p>
        </div>
        <div style={styles.quickStats}>
          <div style={styles.statMiniCard}>
            <span style={styles.statNumber}>3</span>
            <span style={styles.statLabel}>Cours aujourd'hui</span>
          </div>
          <div style={styles.statMiniCard}>
            <span style={styles.statNumber}>5</span>
            <span style={styles.statLabel}>Tâches en attente</span>
          </div>
        </div>
      </header>

      {/* SECTION GRILLE : Navigation visuelle avec effets de survol */}
      <main style={styles.mainGrid}>
        
        {/* CARTE : GESTION DES TÂCHES */}
        <Link to="/taches" style={{...styles.navCard, borderTop: '5px solid #4CAF50'}}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>🎯</span>
            <h2 style={styles.cardTitle}>Focus Mode</h2>
          </div>
          <p style={styles.cardDesc}>Organisez vos rendus. Ajoutez, modifiez ou validez vos devoirs en un clic.</p>
          <span style={styles.cardAction}>Gérer mes tâches →</span>
        </Link>

        {/* CARTE : MES COURS */}
        <Link to="/cours" style={{...styles.navCard, borderTop: '5px solid #9C27B0'}}>
          <div style={styles.cardHeader}>
            <span style={styles.cardIcon}>📚</span>
            <h2 style={styles.cardTitle}>Bibliothèque</h2>
          </div>
          <p style={styles.cardDesc}>Accédez à la liste de vos matières et suivez vos professeurs référents.</p>
          <span style={styles.cardAction}>Consulter mes cours →</span>
        </Link>

      </main>

      {/* SECTION FOOTER / MOTIVATION */}
      <footer style={styles.footer}>
        <p>"Le succès est la somme de petits efforts répétés jour après jour."</p>
      </footer>
    </div>
  );
}

// --- DESIGN SYSTEM (Styles modernes) ---
const styles = {
  dashboard: {
    padding: '40px',
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    backgroundColor: '#F0F2F5', // Fond gris très clair type Facebook/LinkedIn
    minHeight: '90vh',
    color: '#1C1E21'
  },
  welcomeSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  welcomeText: {
    textAlign: 'left'
  },
  h1: { fontSize: '32px', margin: '0', color: '#050505' },
  subtitle: { fontSize: '16px', color: '#65676B', margin: '5px 0 0' },
  quickStats: { display: 'flex', gap: '15px' },
  statMiniCard: {
    backgroundColor: '#fff',
    padding: '15px 25px',
    borderRadius: '12px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  statNumber: { fontSize: '20px', fontWeight: 'bold', color: '#007BFF' },
  statLabel: { fontSize: '12px', color: '#65676B', textTransform: 'uppercase' },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '25px'
  },
  navCard: {
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '16px',
    textDecoration: 'none',
    color: 'inherit',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, boxShadow 0.2s',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  cardHeader: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  cardIcon: { fontSize: '30px' },
  cardTitle: { fontSize: '22px', margin: '0' },
  cardDesc: { fontSize: '14px', color: '#65676B', lineHeight: '1.5', marginBottom: '20px' },
  cardAction: { fontSize: '14px', fontWeight: 'bold', color: '#007BFF' },
  footer: { marginTop: '50px', textAlign: 'center', fontStyle: 'italic', color: '#8A8D91' }
};

export default Home;