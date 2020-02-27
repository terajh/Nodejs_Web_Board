
// $(()=>{
  const socket = io('');
  var roomId=1;
  var myId=$('#nickname').val();
  console.log(myId);

  $('#roomSelect').on('click','div', ()=>{
    if(roomId!=$(this).data('id')){
      roomId=$(this).data('id');
    }

    $(this).parents().children().removeClass("active");
    $(this).addClass("active");

    $('#chatHeader').html(`${$(this).html()}`);
    socket.emit('join room', {
      roomId:roomId,
      name:$('#nickname').val()
    });
  });
  
  $('#chatForm').submit(()=>{
      var option = {
          msg:$('#message').val(),
          name:$('#nickname').val()
      };
      socket.emit('chat message',option);
      $('#message').val('');
      return false;
  });
  socket.on('chat message',(option)=>{
    $('.myMsg').append($('<span class="name">').text(option.name+' : '));
    $('.myMsg').append($('<span class="msg">').text(option.msg));
    $('.myMsg').append($('<br>'));
    $('#chatLog').scroll()[0].scrollTop=$('#chatLog').scroll()[0].scrollHeight;
  });

  socket.on('update user', function (userlist) {
      let html = "";
      for(var key in userlist){
          if (userlist[key] === myId) {
              html += `<div class="memberEl">${userlist[key]} (me)</div>`
          } else {
              html += `<div class="memberEl">${userlist[key]}</div>`
          }
      }
      $('#memberSelect').html(html);
      socket.emit('joined room','terajoo');
  });

  socket.on('lefted room', function (data) {
      $('#chatLog').append(`<div class="notice"><strong>${data}</strong> lefted the room</div>`)
  });
  socket.on('joined room', function (data) {
      $('#chatLog').append(`<div class="notice"><strong>${data}</strong> joined the room</div>`)
  });
// });