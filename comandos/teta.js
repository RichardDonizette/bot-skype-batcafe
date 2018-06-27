module.exports = function (session) {
	var msg = teta[Math.floor(Math.random() * teta.length)];
	session.send(msg.message);
};

var teta = [
	{
		id: 1,
		message: 'Me ajude a te ajudar!'
	},
	{
		id: 2,
		message: 'Foi o Pimenta que fez!'
	}
]