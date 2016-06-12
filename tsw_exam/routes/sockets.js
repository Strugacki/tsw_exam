module.exports( function(io){
    io.sockets.on('connection', function(socket){
    console.log('User connected to server');
    socket.emit('message','new connection');
    
    socket.on('reqH',function(data){
        Horse.find({},function(err,horses){
           socket.emit('horses',JSON.stringify(horses)); 
        });
    });
    socket.on('reqR',function(data){
        Account.find({role:'referee'},function(err,referees){
            socket.emit('referees',JSON.stringify(referees)); 
        });
    });
    
});
});