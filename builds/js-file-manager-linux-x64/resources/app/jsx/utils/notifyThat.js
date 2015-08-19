var notifyThat = {

	fileSaved: notifier('File saved!'),
	fileSaveFailed: fileName => notifyMessage(fileName + ' save error!')

};

if (! ('Notification' in window)) {
  for (var key in notifyThat) {
		notifyThat[key] = new Function;
	} 
}

module.exports = notifyThat;

function notifier(message) {
	return notifyMessage.bind(this, message);
}

function notifyMessage(message) {
	Notification.requestPermission();
	new Notification(message);
}