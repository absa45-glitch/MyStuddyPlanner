import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';

const AuthContext = createContext();

function AuthProvider({ children }) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const stored = localStorage.getItem('mystudy_user');
		if (stored) setUser(JSON.parse(stored));
	}, []);

	const login = (username) => {
		const u = { name: username };
		setUser(u);
		localStorage.setItem('mystudy_user', JSON.stringify(u));
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('mystudy_user');
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

function ProtectedRoute({ children }) {
	const { user } = useContext(AuthContext);
	if (!user) return <Navigate to="/login" replace />;
	return children;
}

function Nav() {
	const { user, logout } = useContext(AuthContext);
	return (
		<nav style={{ padding: 10, borderBottom: '1px solid #ddd' }}>
			<Link to="/" style={{ marginRight: 10 }}>Dashboard</Link>
			<Link to="/tasks" style={{ marginRight: 10 }}>Tâches</Link>
			<Link to="/courses" style={{ marginRight: 10 }}>Matières</Link>
			{user ? (
				<span style={{ float: 'right' }}>
					{user.name} <button onClick={logout}>Déconnexion</button>
				</span>
			) : (
				<Link to="/login" style={{ marginLeft: 10 }}>Connexion</Link>
			)}
		</nav>
	);
}

function Login() {
	const [name, setName] = useState('');
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();

	const submit = (e) => {
		e.preventDefault();
		if (!name.trim()) return;
		login(name.trim());
		navigate('/');
	};

	return (
		<div style={{ padding: 20 }}>
			<h2>Connexion (simulation)</h2>
			<form onSubmit={submit}>
				<input placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} />
				<button type="submit" style={{ marginLeft: 8 }}>Se connecter</button>
			</form>
		</div>
	);
}

function Dashboard() {
	const [counts, setCounts] = useState({ tasks: 0, courses: 0 });

	useEffect(() => {
		async function load() {
			try {
				const t = await fetch('http://localhost:5000/api/tasks').then(r => r.json());
				const c = await fetch('http://localhost:5000/api/courses').then(r => r.json());
				setCounts({ tasks: t.length, courses: c.length });
			} catch (e) {
				// backend peut être éteint lors du développement
			}
		}
		load();
	}, []);

	return (
		<div style={{ padding: 20 }}>
			<h2>Tableau de bord</h2>
			<p>Nombre de tâches : {counts.tasks}</p>
			<p>Nombre de matières : {counts.courses}</p>
		</div>
	);
}

function Tasks() {
	const [tasks, setTasks] = useState([]);
	const [courses, setCourses] = useState([]);
	const [newTask, setNewTask] = useState({ titre: '', matiere: '', deadline: '', priorite: 'Moyenne', status: 'En cours' });
	const [filters, setFilters] = useState({ matiere: 'Toutes', status: 'Tous', priorite: 'Toutes' });
	const [editTask, setEditTask] = useState(null);

	const load = () => {
		fetch('http://localhost:5000/api/tasks')
			.then(r => r.json())
			.then(setTasks)
			.catch(() => setTasks([]));
		fetch('http://localhost:5000/api/courses')
			.then(r => r.json())
			.then(setCourses)
			.catch(() => setCourses([]));
	};

	useEffect(() => { load(); }, []);

	const handleAdd = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch('http://localhost:5000/api/tasks', {
				method: 'POST', headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newTask)
			});
			const created = await res.json();
			setTasks(prev => [created, ...prev]);
			setNewTask({ titre: '', matiere: '', deadline: '', priorite: 'Moyenne', status: 'En cours' });
		} catch (e) { console.error(e); }
	};

	const handleDelete = async (id) => {
		if (!confirm('Supprimer cette tâche ?')) return;
		await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
		setTasks(prev => prev.filter(t => t.id !== id));
	};

	const toggleStatus = async (task) => {
		const updated = { ...task, status: task.status === 'Terminé' ? 'En cours' : 'Terminé' };
		await fetch(`http://localhost:5000/api/tasks/${task.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
		setTasks(prev => prev.map(p => p.id === task.id ? updated : p));
	};

	const startEdit = (task) => setEditTask({ ...task });
	const cancelEdit = () => setEditTask(null);

	const saveEdit = async (e) => {
		e.preventDefault();
		try {
			const res = await fetch(`http://localhost:5000/api/tasks/${editTask.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editTask) });
			const updated = await res.json();
			setTasks(prev => prev.map(p => p.id === updated.id ? updated : p));
			setEditTask(null);
		} catch (e) { console.error(e); }
	};

	const filtered = tasks.filter(t => {
		if (filters.matiere !== 'Toutes' && t.matiere !== filters.matiere) return false;
		if (filters.status !== 'Tous' && t.status !== filters.status) return false;
		if (filters.priorite !== 'Toutes' && t.priorite !== filters.priorite) return false;
		return true;
	});

	return (
		<div style={{ padding: 20 }}>
			<h2>Gestion des tâches</h2>

			<form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
				<input placeholder="Titre" value={newTask.titre} onChange={e => setNewTask({ ...newTask, titre: e.target.value })} required />
				<select value={newTask.matiere} onChange={e => setNewTask({ ...newTask, matiere: e.target.value })} required style={{ marginLeft: 8 }}>
					<option value="">Choisir matière</option>
					{courses.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
				</select>
				<input type="date" value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} style={{ marginLeft: 8 }} />
				<select value={newTask.priorite} onChange={e => setNewTask({ ...newTask, priorite: e.target.value })} style={{ marginLeft: 8 }}>
					<option>Haute</option>
					<option>Moyenne</option>
					<option>Basse</option>
				</select>
				<button type="submit" style={{ marginLeft: 8 }}>Ajouter</button>
			</form>

			<div style={{ marginBottom: 12 }}>
				<label>Filtrer par matière: </label>
				<select value={filters.matiere} onChange={e => setFilters({ ...filters, matiere: e.target.value })} style={{ marginLeft: 8 }}>
					<option>Toutes</option>
					{courses.map(c => <option key={c.id}>{c.nom}</option>)}
				</select>
				<label style={{ marginLeft: 12 }}>État: </label>
				<select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} style={{ marginLeft: 8 }}>
					<option>Tous</option>
					<option>En cours</option>
					<option>Terminé</option>
				</select>
				<label style={{ marginLeft: 12 }}>Priorité: </label>
				<select value={filters.priorite} onChange={e => setFilters({ ...filters, priorite: e.target.value })} style={{ marginLeft: 8 }}>
					<option>Toutes</option>
					<option>Haute</option>
					<option>Moyenne</option>
					<option>Basse</option>
				</select>
				<button onClick={load} style={{ marginLeft: 12 }}>Rafraîchir</button>
			</div>

			{editTask ? (
				<form onSubmit={saveEdit} style={{ marginBottom: 16, border: '1px solid #ddd', padding: 8 }}>
					<h4>Éditer la tâche</h4>
					<input value={editTask.titre} onChange={e => setEditTask({ ...editTask, titre: e.target.value })} required />
					<select value={editTask.matiere} onChange={e => setEditTask({ ...editTask, matiere: e.target.value })} style={{ marginLeft: 8 }}>
						{courses.map(c => <option key={c.id} value={c.nom}>{c.nom}</option>)}
					</select>
					<input type="date" value={editTask.deadline || ''} onChange={e => setEditTask({ ...editTask, deadline: e.target.value })} style={{ marginLeft: 8 }} />
					<select value={editTask.priorite} onChange={e => setEditTask({ ...editTask, priorite: e.target.value })} style={{ marginLeft: 8 }}>
						<option>Haute</option>
						<option>Moyenne</option>
						<option>Basse</option>
					</select>
					<select value={editTask.status} onChange={e => setEditTask({ ...editTask, status: e.target.value })} style={{ marginLeft: 8 }}>
						<option>En cours</option>
						<option>Terminé</option>
					</select>
					<button type="submit" style={{ marginLeft: 8 }}>Enregistrer</button>
					<button type="button" onClick={cancelEdit} style={{ marginLeft: 8 }}>Annuler</button>
				</form>
			) : null}

			{filtered.length === 0 ? <p>Aucune tâche trouvée.</p> : (
				<ul>
					{filtered.map(t => (
						<li key={t.id} style={{ marginBottom: 8 }}>
							<strong>{t.titre}</strong> — {t.matiere} — {t.deadline} — {t.priorite} — {t.status}
							<button onClick={() => toggleStatus(t)} style={{ marginLeft: 8 }}>{t.status === 'Terminé' ? 'Marquer en cours' : 'Marquer terminé'}</button>
							<button onClick={() => startEdit(t)} style={{ marginLeft: 8 }}>Éditer</button>
							<button onClick={() => handleDelete(t.id)} style={{ marginLeft: 8 }}>Supprimer</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

function Courses() {
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		fetch('http://localhost:5000/api/courses')
			.then(r => r.json())
			.then(setCourses)
			.catch(() => setCourses([]));
	}, []);

	return (
		<div style={{ padding: 20 }}>
			<h2>Matières</h2>
			<ul>
				{courses.map(c => (
					<li key={c.id}>{c.nom} — {c.prof}</li>
				))}
			</ul>
		</div>
	);
}

function NotFound() {
	return <div style={{ padding: 20 }}><h2>Page non trouvée</h2></div>;
}

export default function App() {
	return (
		<BrowserRouter>
			<AuthProvider>
				<Nav />
				<Routes>
					<Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
					<Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
					<Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
					<Route path="/login" element={<Login />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	);
}

