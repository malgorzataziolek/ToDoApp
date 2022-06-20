const express = require('express');

const path = require('path');
const socket = require('socket.io');

const app = express();
let tasks = [];

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
	res.status(404).send('<h1>404 not found...</h1>');
});

const server = app.listen(process.env.PORT || 8000, () => {
	console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', socket => {
	console.log('New client! New id: ' + socket.id);
	socket.emit('updateData', tasks);

	socket.on('addTask', task => {
		console.log(`New task is added!`);
		tasks.push(task);
		socket.broadcast.emit('addTask', task);
	});

	socket.on('removeTask', id => {
		console.log(`Task is removed!`);
		const index = tasks.indexOf(tasks.find(task => task.id === id));
		tasks.splice(index, 1);
		socket.broadcast.emit('removeTask', id);
	});
});
