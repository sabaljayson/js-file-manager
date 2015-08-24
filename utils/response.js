module.exports = function(res) {
	if (arguments.length !== 1) throw 'Invalid arguments';

	return {
		success: function(value) {
			if (arguments.length > 1) throw 'Invalid arguments';
			if (arguments.length === 0) value = 'done';

			return res.send(value);
		},

		fail: function(err) {
			if (err) console.log(err);
			return res.send('error');
		}
	}
};