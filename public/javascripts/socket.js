// import "/mnt/c/Users/teraj/Desktop/dev/nodejs/board/node_moduels/socket.io/socket.io.js"
$(()=>{
    const socket = io('');
    console.log('socket server');
    $('#send').click(()=>{
        console.log('hihihihi##################################3');
        socket.emit('chat message',$('#message').val());
        $('#message').val('');
        return false;
    });
    socket.on('chat message',(msg)=>{
        $('.myMsg').append($('<li>').text(msg));
    });
    var clickfun = function(){
        console.log('hihihihi##################################3');
        socket.emit('chat message',$('#message').val());
        $('#message').val('');
        return false;
    };
});