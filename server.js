// We need to use the express framework: have a real web servler that knows how to send mime types etc.
var express=require('express');

// Init globals variables for each module required
var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// launch the http server on given port
server.listen(8080);

// Indicate where static files are located. Without this, no external js file, no css...  
app.use(express.static(__dirname + '/'));    

// routing with express, mapping for default page
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat
var rooms = ['Acceuil'];
var party = [];

var nbActuelJoueur = [];
var spectateur = [];

io.sockets.on('connection', function (socket) {
	
	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = 'Acceuil';
        socket.completename = username + ' [' + socket.room + ']';
		// add the client's username to the global list
		usernames[socket.completename] = socket.completename;
		// send client to room 1
		socket.join('Acceuil');
		// echo to client they've connected
		socket.emit('updatechat', 'SERVER', 'Bienvenue');
		// echo to room 1 that a person has connected to their room
		socket.broadcast.to('Acceuil').emit('updatechat', 'SERVER', username + ' has connected to this room');
		socket.emit('updaterooms', rooms, 'Acceuil');
        io.sockets.in(socket.room).emit('updateListPlayer', usernames);
	});
	
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat', socket.username, data);
	});
	
	socket.on('switchRoom', function(newroom){
		socket.leave(socket.room);
		socket.join(newroom);
		socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
		// sent message to OLD room
		socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has joined the ' + newroom);
		// update socket session room title
		socket.room = newroom;
		socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
		socket.emit('updaterooms', rooms, newroom);
        delete usernames[socket.completename];
        socket.completename = socket.username + ' [' + socket.room + ']';
        usernames[socket.completename] = socket.completename;
        io.sockets.emit('updateListPlayer', usernames);
	});

	

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.completename];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
        io.sockets.emit('updateListPlayer', usernames);
	});

    // Character move update
    socket.on('LinkSheet', function(w, h){
        socket.broadcast.to(socket.room).emit('LinkUpdate', w, h);
    });
    socket.on('LinkMove', function(m, move){
        socket.broadcast.to(socket.room).emit('LinkMoveUpdate', m, move);
    });
    socket.on('SonicSheet', function(w, h){
        socket.broadcast.to(socket.room).emit('SonicUpdate', w, h);
    });
    socket.on('SonicMove', function(m, move){
        socket.broadcast.to(socket.room).emit('SonicMoveUpdate', m, move);
    });
    socket.on('MarioSheet', function(w, h){
        socket.broadcast.to(socket.room).emit('MarioUpdate', w, h);
    });
    socket.on('MarioMove', function(m, move){
        socket.broadcast.to(socket.room).emit('MarioMoveUpdate', m, move);
    });
    socket.on('PikaSheet', function(w, h){
        socket.broadcast.to(socket.room).emit('PikaUpdate', w, h);
    });
    socket.on('PikaMove', function(m, move){
        socket.broadcast.to(socket.room).emit('PikaMoveUpdate', m, move);
    });

    /*socket.on('playerStyle', function(){
        if(nbActuelJoueur < 4){
            nbActuelJoueur += 1;
            socket.emit('createJoueur', nbActuelJoueur);
        }else{
            spectateur += 1;
        }

    });*/

    socket.on('updateNbrJoueur', function(n){
        var i;
        socket.broadcast.to(socket.room).emit('updateNbJoueur', n);
    });

    socket.on('updateTabBomb', function(bombes){
        socket.broadcast.to(socket.room).emit('updateBombsTab', bombes);
    });

    /*socket.on('updateWaitingGame', function(){
        io.sockets.in(socket.room).emit('updateWaitingGamePlayer');
    });*/

    socket.on('createRoom', function(nbPlayer){
        var nb = rooms.length;
        rooms.push('Room ' + nb);
        socket.broadcast.emit('newRoom', rooms);
        socket.emit('changeRoom', 'Room ' + nb);
        party.push(['Room ' + nb, nbPlayer, 1]);
        nbActuelJoueur.push(1);
        spectateur.push(0);
        io.sockets.emit('listGame', party);
        socket.emit('createJoueur', 1);

    });

    socket.on('switchJoin', function(partyRoom, boolwait){
        var i;
        socket.leave(socket.room);
        socket.join(partyRoom[0]);
        socket.emit('updatechat', 'SERVER', 'you have connected to '+ partyRoom[0]);
        // sent message to OLD room
        socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has joined the ' + partyRoom[0]);
        // update socket session room title
        socket.room = partyRoom[0];
        socket.broadcast.to(partyRoom[0]).emit('updatechat', 'SERVER', socket.username+' has joined this room');
        socket.emit('updaterooms', rooms, partyRoom[0]);
        delete usernames[socket.completename];
        socket.completename = socket.username + ' [' + socket.room + ']';
        usernames[socket.completename] = socket.completename;
        io.sockets.emit('updateListPlayer', usernames);
        if(boolwait){
            io.sockets.in(socket.room).emit('updateWaitingGamePlayer');
        }
        for(i = 0; i < party.length; i++){
            if(party[i][0] === partyRoom[0]){
                if(nbActuelJoueur[i] < partyRoom[1]){
                    nbActuelJoueur[i] += 1;
                    party[i][2]+=1;
                    socket.emit('createJoueur', nbActuelJoueur[i]);
                }
                else{
                    spectateur[i] += 1;
                }
            }
        }
    });

    socket.on('recupParty', function(){
        socket.emit('listGame', party);
    });

});
