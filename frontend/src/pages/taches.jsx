import React, { useState, useEffect } from 'react';

function Taches() {
  const [tasks, setTasks] = useState([]);
  const [matières, setMatières] = useState([]);
  
  // États Formulaire
  const [newTitle, setNewTitle] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newPrio, setNewPrio] = useState("Moyenne");

  // État Filtre
  const [filtreMatiere, setFiltreMatiere] = useState("Toutes");

  const API_TASKS = "http://localhost:5000/api/tasks";
  const API_COURSES = "http://localhost:5000/api/courses";

  useEffect(() => {
    // Charger Tâches
    fetch(API_TASKS).then(res => res.json()).then(data => setTasks(data));
    // Charger Matières pour le menu déroulant
    fetch(API_COURSES).then(res => res.json()).then(data => {
      setMatières(data);
      if(data.length > 0) setSelectedMatiere(data[0].nom);
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDate || !selectedMatiere) return alert("Complétez tous les champs !");

    const taskObj = { 
      titre: newTitle, 
      matiere: selectedMatiere, 
      deadline: newDate, 
      priorite: newPrio,
      status: "En cours" 
    };

    const response = await fetch(API_TASKS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskObj)
    });
    
    const saved = await response.json();
    setTasks([...tasks, saved]);
    setNewTitle(""); setNewDate("");
  };

  const deleteTask = async (id) => {
    await fetch(`${API_TASKS}/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(t => t.id !== id));
  };

  const tasksFiltrées = tasks.filter(t => 
    filtreMatiere === "Toutes" ? true : t.matiere === filtreMatiere
  );

  return (
    <div style={styles.container}>
      <h2>📝 Gestion des Devoirs & TP</h2>

      {/* FORMULAIRE D'AJOUT */}
      <form onSubmit={handleSave} style={styles.form}>
        <input placeholder="Titre du devoir" value={newTitle} onChange={(e)=>setNewTitle(e.target.value)} style={styles.input}/>
        
        <select value={selectedMatiere} onChange={(e)=>setSelectedMatiere(e.target.value)} style={styles.input}>
          <option value="">-- Choisir Matière --</option>
          {matières.map(m => <option key={m.id} value={m.nom}>{m.nom}</option>)}
        </select>

        <input type="date" value={newDate} onChange={(e)=>setNewDate(e.target.value)} style={styles.input}/>
        
        <select value={newPrio} onChange={(e)=>setNewPrio(e.target.value)} style={styles.input}>
          <option value="Basse">Basse</option>
          <option value="Moyenne">Moyenne</option>
          <option value="Haute">Haute 🔥</option>
        </select>

        <button type="submit" style={styles.addBtn}>Ajouter</button>
      </form>

      {/* FILTRE PAR MATIERE */}
      <div style={styles.filterBar}>
        <strong>🔍 Filtrer par matière : </strong>
        <select value={filtreMatiere} onChange={(e)=>setFiltreMatiere(e.target.value)} style={styles.selectFilter}>
          <option value="Toutes">Toutes les matières</option>
          {matières.map(m => <option key={m.id} value={m.nom}>{m.nom}</option>)}
        </select>
      </div>

      {/* LISTE DES TACHES */}
      <div style={styles.list}>
        {tasksFiltrées.length === 0 ? <p>Aucune tâche à afficher.</p> : 
          tasksFiltrées.map(t => (
            <div key={t.id} style={styles.item}>
              <div style={{flex: 1}}>
                <span style={styles.tag}>{t.matiere}</span>
                <strong style={{fontSize: '18px'}}> {t.titre}</strong>
                <span style={{color: t.priorite === 'Haute' ? 'red' : '#666', marginLeft: '10px'}}>
                   [{t.priorite}]
                </span>
                <br/><small>📅 Deadline : {t.deadline}</small>
              </div>
              <button onClick={() => deleteTask(t.id)} style={styles.delBtn}>Supprimer</button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

const styles = {
  container: { padding: '20px', maxWidth: '850px', margin: '0 auto', fontFamily: 'Arial' },
  form: { display: 'flex', gap: '10px', marginBottom: '20px', background: '#f1f3f5', padding: '20px', borderRadius: '8px', flexWrap: 'wrap' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', flex: '1 1 150px' },
  addBtn: { background: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' },
  filterBar: { marginBottom: '20px', padding: '15px', background: '#e9ecef', borderRadius: '8px' },
  selectFilter: { padding: '8px', borderRadius: '4px', marginLeft: '10px' },
  item: { display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #eee', background: '#fff', alignItems: 'center', marginBottom: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  tag: { background: '#007bff', color: '#fff', padding: '3px 10px', borderRadius: '15px', fontSize: '12px', fontWeight: 'bold' },
  delBtn: { background: '#dc3545', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }
};

export default Taches;