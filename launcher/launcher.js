var open = require('open');

document.getElementById('serverAddr').innerHTML = serverAddr();

function openLocalhost() {
	open(serverAddr());
}

function serverAddr() {
	return 'http://localhost:' + port
}