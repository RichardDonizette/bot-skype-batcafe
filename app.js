const config = require("./config.json");
var restify = require('restify');
var builder = require('botbuilder');

const { prefix } = config;

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Create a Bot
var bot = new builder.UniversalBot(connector);

//Leitura dos comandos do bot

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

// Handler for any command starting with a !
function onCommand(session) {
    var msg = session.message.text;
    console.log('matched command', msg)

    var match = msg.match(/!(\w+)(.*)/);
    var command = match[1],
        args = match[2] || '';

    try {
        var module = require('./comandos/' + command + '.js');
        module(session, args.trim().split(/\s+/));
    } catch (e) {
        console.log(e);
        session.send('Esse comando não existe!')
    }
}

// Detect a `!` prefixed message which acts as command trigger.
intents.matches(/!\w+/i, onCommand);