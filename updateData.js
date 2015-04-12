var socket = io.connect();

socket.on('updateWaitingGamePlayer', function(){
    document.getElementById("waintingPlayerDiv").style.visibility = "hidden";
    waitPlayer = false;
    socket.emit('createPlayer');
});

socket.on('updatePresentPlayer', function(present, total){
    $('#nbPresentPlayer').text('(' + (present+1) + '/' + total + ')');
});

socket.on('whatIsActualIndex', function(){
    socket.emit('sendIndex');
});

socket.on('thisIsTheActualIndex', function(nb){
    socket.emit('updateNbRoom', nb);
});

socket.on('updateDecoPlayer', function(present, total){
    $('#nbPresentPlayer').text('(' + present + '/' + total + ')');
});

socket.on('updateIdRoom', function(id){
    socket.emit('updateIdRoomPlayer', id);
});

socket.on('updateDecoIdPlayer', function(id){
    socket.emit('updateIdInRoom', id);
});

socket.on('updateBombsTab', function(bombes){
    //bombs = bombes;
    bombs = [];
    var i;
    for(i = 0; i < bombes.length; i++){
        bombs.push(new Bomb(bombes[i].x, bombes[i].y, bombes[i].type, bombes[i].puissance, bombes[i].duree, bombes.taille));
    }
});

socket.on('updateNbrJoueur', function(n){
    var i;
    socket.broadcast.to(socket.room).emit('updateNbJoueur', n);
    //socket.etatJoueur = 'Ingame';
});