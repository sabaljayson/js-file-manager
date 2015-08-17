var open = require('open');
var app = require('../app.js');

var $ = require('../bower_components/jquery/dist/jquery.min.js');

$(function() {
	$('#serverStatus').html('File manager server is running!');
	$('#serverAddr').html(serverAddr());
});

function openLocalhost() {
	open(serverAddr());
}

function serverAddr() {
	return 'http://localhost:' + app.get('port');
}