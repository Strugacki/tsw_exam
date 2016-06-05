var URL_SERVER = "https://localhost:3000";
var socket = io.connect(URL_SERVER);

//socket.emit('reqH','getAllHorses');
//socket.emit('reqH','getAllReferees');
socket.on("referees",function(referees){
    console.log(referees);
});

socket.on("message",function(data){
    console.log(data); 
});

socket.on("horses",function(data){
    console.log(data);
});