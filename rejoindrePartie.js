var socket = io.connect();

var allParty = [];


socket.on('listGame', function(tab){
    allParty = tab;
});

function showJoin(){
    var i;
    $('#joinrooms').empty();
    for(i = 0; i < allParty.length; i++){
        $('#joinrooms').append('<div><a href="#" onclick="switchParty(' + allParty[i] + ')">' + allParty[i][0] + '</a></div>');
    }
}


function switchParty(party){
    window.alert("bob");
    socket.emit('switchJoin', party);
}
