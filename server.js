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
var nbRoom = 0;

var nbActuelJoueur = [];
var spectateur = [];

io.sockets.on('connection', function (socket) {

	// when the client emits 'adduser', this listens and executes
	socket.on('adduser', function(username){
        socket.etatJoueur = 'Acceuil';
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
        socket.tabPlayer=[];
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
        if((socket.etatJoueur === 'Waiting') && party[socket.idActuelRoom][2] === 1){
            var id = socket.idActuelRoom;
            party.splice(socket.idActuelRoom,1);
            nbActuelJoueur.splice(socket.idActuelRoom, 1);
            spectateur.splice(socket.idActuelRoom, 1);
            rooms.splice(socket.idActuelRoom + 1, 1);
            socket.broadcast.emit('updateIdRoom', id);
            io.sockets.emit('listGame', party);
            io.sockets.emit('newRoom', rooms);
        }
        if(socket.etatJoueur === 'Waiting' && party[socket.idActuelRoom][2] > 1){
            party[socket.idActuelRoom][2] -= 1;
            io.sockets.emit('listGame', party);
            socket.broadcast.to(party[socket.idActuelRoom][0]).emit('updateDecoPlayer', party[socket.idActuelRoom][2], party[socket.idActuelRoom][1]);
            socket.broadcast.to(party[socket.idActuelRoom][0]).emit('updateDecoIdPlayer', socket.idInRoom);
            nbActuelJoueur[socket.idActuelRoom] -= 1;
        }
        /*if(socket.etatJoueur === 'Ingame' && party[socket.idActuelRoom][2] > 1){
            party[socket.idActuelRoom][2] -= 1;
        }*/
		// remove the username from global usernames list
		delete usernames[socket.completename];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);

        io.sockets.emit('updateListPlayer', usernames);
	});


    socket.on('updateIdRoomPlayer', function(id){
        if(socket.idActuelRoom > id){
            socket.idActuelRoom -= 1;
        }
    });

    socket.on('updateIdInRoom', function(id){
        if(socket.idInRoom > id){
            socket.idInRoom -= 1;
        }
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





    socket.on('updateTabBomb', function(bombes){
        socket.broadcast.to(socket.room).emit('updateBombsTab', bombes);
    });

    socket.on('updateNbRoom', function(nb){
       nbRoom = nb;
    });


    socket.on('createRoom', function(nbPlayer){
        nbRoom += 1;
        rooms.push('Room ' + nbRoom);
        socket.broadcast.emit('newRoom', rooms);
        socket.emit('changeRoom', 'Room ' + nbRoom);
        party.push(['Room ' + nbRoom, nbPlayer, 1]);
        socket.idActuelRoom = party.length - 1;
        nbActuelJoueur.push(1);
        spectateur.push(0);
        socket.etatJoueur = 'Waiting';
        socket.idInRoom = 1;
        io.sockets.emit('listGame', party);
        //io.sockets.emit('test', party);

    });

    socket.on('createPlayer', function(){
        socket.emit('createJoueur', socket.idInRoom, socket.username);
        socket.etatJoueur = 'Ingame';
    });

    socket.on('switchJoin', function(partyRoom, boolwait){
        var i;
        socket.leave(socket.room);
        socket.join(partyRoom[0]);
        socket.nbBomb = 2;
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
        socket.etatJoueur = 'Waiting';
        for(i = 0; i < party.length; i++){
            if(party[i][0] === partyRoom[0]){
                if(nbActuelJoueur[i] < party[i][1]){
                    nbActuelJoueur[i] = nbActuelJoueur[i]+1;
                    party[i][2]+=1;
                    socket.idInRoom = party[i][2];
                    socket.idActuelRoom = i;
                }
                else{
                    spectateur[i] += 1;
                }
            }
        }
        if(boolwait){
            socket.tabPlayer.push(nbActuelJoueur[socket.idActuelRoom]);
            io.sockets.in(socket.room).emit('updateWaitingGamePlayer');

        }else{
            socket.tabPlayer.push(nbActuelJoueur[socket.idActuelRoom]);
            socket.broadcast.to(partyRoom[0]).emit('updatePresentPlayer', partyRoom[2], partyRoom[1]);
        }
    });

    socket.on('recupParty', function(){
        socket.emit('listGame', party);
    });

    socket.on('recupIndexRoom', function(){
        socket.broadcast.to(socket.room).emit('whatIsActuelIndex');
    });

    socket.on('sendIndex', function(){
       socket.broadcast.to(socket.room).emit('thisIsTheActualIndex', nbRoom);
    });

    socket.on('updateNbrJoueur', function(n){
        socket.broadcast.to(socket.room).emit('updateNbJoueur', n);
    });

    socket.on('updateCases', function(cases){
        io.sockets.in(socket.room).emit('updateCasesTab', cases);
    });

    socket.on('updatePlayerPrst', function(forme, tab){
        socket.broadcast.to(socket.room).emit('updatePlayersPrst', forme, tab);
        if(tab === 1){
            io.sockets.in(socket.room).emit('endGame');
        }
    });



    socket.on('finishGame', function(username){
        var id = socket.idActuelRoom;
        socket.etatJoueur = 'Acceuil';
        party.splice(socket.idActuelRoom, 1);
        nbActuelJoueur.splice(socket.idActuelRoom, 1);
        spectateur.splice(socket.idActuelRoom, 1);
        rooms.splice(socket.idActuelRoom + 1, 1);
        io.sockets.in(socket.room).emit('afficheWinner', username);
        io.sockets.emit('updateIdRoom', id);
        io.sockets.emit('newRoom', rooms);
        io.sockets.emit('listGame', party);
    });
});
