const config = require("./config.json");
var builder = require('botbuilder');
var restify = require('restify');

const { id, pass } = config;

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Cria a conexão com o chat de grupo
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId || id,
    appPassword: process.env.MicrosoftAppPassword || pass
});

// verifica as msg dos usuarios 
server.post('/api/messages', connector.listen());

// Criação do bot
var bot = new builder.UniversalBot(connector);

//Leitura dos comandos do bot

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

// Verifica os comandos iniciados com o prefixo "!""
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