require('../server')
let users = []

io.on("connection", function (socket) {
    console.log("new connection made");

    socket.on('get-users', function () {
        socket.emit('all-users', users);
    });

    socket.on('join', function (data) {
        console.log(data);
        console.log(users);
        socket.nickname = data.nickname;
        users[socket.nickname] = socket;

        var userObj = {
            nickname: data.nickname,
            socketid: socket.id
        }
        users.push(userObj);
        io.emit('all-users', users);

    });
    socket.on('typing', (data)=>{
        socket.broadcast.emit('tying', {nickname: socket.nickname})
    })

    socket.on('send-message', function (data) {
        //socket.broadcast.emit('message-received', data);
        io.emit('message-received', data);
    });

    socket.on('disconnect', function () {
        users = users.filter(function (item) {
            return item.nickname !== socket.nickname;
        });
        io.emit('all-users', users);
})