const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = './data.json';

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// API Taches
app.get('/api/tasks', (req, res) => res.json(readData().tasks));
app.post('/api/tasks', (req, res) => {
    const data = readData();
    const newTask = { id: Date.now(), ...req.body };
    data.tasks.push(newTask);
    writeData(data);
    res.json(newTask);
});
app.delete('/api/tasks/:id', (req, res) => {
    const data = readData();
    data.tasks = data.tasks.filter(t => t.id !== parseInt(req.params.id));
    writeData(data);
    res.json({ success: true });
});

// API Cours (Matières)
app.get('/api/courses', (req, res) => res.json(readData().courses));
app.post('/api/courses', (req, res) => {
    const data = readData();
    const newCourse = { id: Date.now(), ...req.body };
    data.courses.push(newCourse);
    writeData(data);
    res.json(newCourse);
});

app.listen(5000, () => console.log("Backend OK sur port 5000"));