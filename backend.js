const express = require('express');
const bodyParser = require('body-parser');
const res = require('express/lib/response');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;
const path= require('path');

app.use(express.static('views'))
// Create a new SQLite database
const db = new sqlite3.Database(':memory:');

// Create tasks table in the database
db.serialize(() => {
  db.run('CREATE TABLE tasks (id INTEGER PRIMARY KEY, task TEXT, details TEXT, taskPriority TEXT)');
});

app.use(bodyParser.json());

// Create a new task
app.post('/tasks', (req, res) => {
  const { task, details, taskPriority } = req.body;

  db.run('INSERT INTO tasks (task, details, taskPriority) VALUES (?, ?, ?)', [task, details, taskPriority], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to create task' });
    } else {
      res.json({ message: 'Task created successfully', taskId: this.lastID });
    }
  });
});
app.get('/',(req, res)=> {
  res.sendFile(path.resolve(__dirname, 'views', 'frontend.html'));
});
// Get all tasks
app.get('/tasks', (req, res) => {
  db.all('SELECT * FROM tasks', (err, rows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to get tasks' });
    } else {
      res.json(rows);
    }
  });
});

// Get a specific task by ID
app.get('/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM tasks WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to get task' });
    } else if (!row) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.json(row);
    }
  });
});

// Update a specific task by ID
app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { task, details, taskPriority } = req.body;

  db.run('UPDATE tasks SET task = ?, details = ?, taskPriority = ? WHERE id = ?', [task, details, taskPriority, id], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to update task' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.json({ message: 'Task updated successfully' });
    }
  });
});

// Delete a specific task by ID
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to delete task' });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Task not found' });
    } else {
      res.json({ message: 'Task deleted successfully' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
