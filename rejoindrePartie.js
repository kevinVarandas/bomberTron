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
        $('#joinrooms').append('<div><a href="#" onclick="switchParty(\'' + allParty[i][0] + '\')">' + allParty[i][0] + '</a></div>');
        //$('#joinrooms').append('<div><a href="#" onclick="switchParty(0)">' + allParty[i][0] + '</a></div>');
    }
    /*$.each(allParty, function(key, value) {
         //$('#joinrooms').append('<div><a href="#" onclick="switchRoom(\'' + allParty[i] + '\')">' + value[key] + '</a></div>');
        $('#joinrooms').append('<div><a href="#" onclick="alert(0);">' + value[key] + '</a></div>');
    });*/
}


function switchParty(party){
    var i;
    alert(party);
    for(i=0;i<allParty.length;i++){
        if(party === allParty[i][0]){
            socket.emit('switchJoin', allParty[i]);
        }
    }
    boolJoin = false;

}
