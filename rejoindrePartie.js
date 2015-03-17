var socket = io.connect();

var allParty = [];


socket.on('listGame', function(tab){
    allParty = tab;
});

function showJoin(){
    var i;
    var j;
    $('#joinrooms').empty();
    for(i = 0; i < allParty.length; i++){
        if(allParty[i][2] < allParty[i][1]) {
            $('#joinrooms').append('<div><a href="#" onclick="switchParty(\'' + allParty[i][0] + '\')">' + allParty[i][0] + '</a></div>');
        }
        //$('#joinrooms').append('<div><a href="#" onclick="switchParty(0)">' + allParty[i][0] + '</a></div>');
    }
    /*$.each(allParty, function(key, value) {
         //$('#joinrooms').append('<div><a href="#" onclick="switchRoom(\'' + allParty[i] + '\')">' + value[key] + '</a></div>');
        $('#joinrooms').append('<div><a href="#" onclick="alert(0);">' + value[key] + '</a></div>');
    });*/
}


function switchParty(party){
    var i;
    for(i=0;i<allParty.length;i++){
        if(party === allParty[i][0]){
            if((allParty[i][2] + 1) !== allParty[i][1]) {
                socket.emit('switchJoin', allParty[i], false);
                $('#nbPresentPlayer').text('(' + (allParty[i][2]+1) + '/' + allParty[i][1] + ')');
                waitPlayer = true;
            }
            else{
                socket.emit('switchJoin', allParty[i], true);
            }
        }
    }
    boolJoin = false;
}

function drawWait(){
    $('#waitingPlayer').empty();
    $('#waitingPlayer').append('<img src="http://img11.hostingpics.net/pics/394874loading.gif" />');
}

socket.on('updateWaitingGamePlayer', function(){
    waitPlayer = false;
});

socket.on('updatePresentPlayer', function(present, total){
    $('#nbPresentPlayer').text('(' + (present+1) + '/' + total + ')');
});
