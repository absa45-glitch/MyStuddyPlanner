import React, { useState, useEffect } from 'react';

function Courses() {
  const [matières, setMatières] = useState([]);
  const [nom, setNom] = useState("");
  const [prof, setProf] = useState("");

  const API_URL = "http://localhost:5000/api/courses";

  // Charger les matières au montage du composant
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => setMatières(data))
      .catch(err => console.error("Erreur chargement matières:", err));
  }, []);

  const addCourse = async (e) => {
    e.preventDefault();
    if (!nom || !prof) return alert("Remplissez les champs !");

    const newCourse = { nom, prof };
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCourse)
    });

    if (response.ok) {
      const saved = await response.json();
      setMatières([...matières, saved]);
      setNom(""); setProf("");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🎓 Gestion des Matières</h2>
      <p>Créez vos matières ici pour les retrouver dans l'onglet Tâches.</p>
      
      <form onSubmit={addCourse} style={styles.form}>
        <input placeholder="Nom (ex: React)" value={nom} onChange={(e)=>setNom(e.target.value)} style={styles.input}/>
        <input placeholder="Professeur" value={prof} onChange={(e)=>setProf(e.target.value)} style={styles.input}/>
        <button type="submit" style={styles.btn}>Ajouter</button>
      </form>

      <div style={styles.grid}>
        {matières.map(m => (
          <div key={m.id} style={styles.card}>
            <h3 style={{margin: '0 0 10px 0', color: '#007bff'}}>{m.nom}</h3>
            <p style={{margin: 0}}>👨‍🏫 {m.prof}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'Arial' },
  form: { display: 'flex', gap: '10px', marginBottom: '30px', background: '#f8f9fa', padding: '15px', borderRadius: '8px' },
  input: { padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' },
  btn: { background: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' },
  card: { padding: '20px', border: '1px solid #ddd', borderRadius: '10px', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }
};

export default Courses;