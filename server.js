var  express = require('express'),
app = express(),
server = require('http').createServer(app),
io = require('socket.io').listen(server);

usernames = [];

server.listen(process.env.PORT || 5000);
console.log('Server Running..');

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/index.html');
})

//connect to our socket
io.sockets.on('connection', (socket) => {
    console.log('socket connected');

    socket.on('new user', (data,callback) => {
        if(usernames.indexOf(data) != -1){
            callback(false);
        }else{
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUsernames();
        }
    })

    function updateUsernames(){
        io.sockets.emit('usernames',usernames);
    };

    //send message
    socket.on('send message', (data) => {
        io.sockets.emit('new message',{msg : data, user:socket.username});
    })

    //disconnect
    socket.on('disconnect', (data) => {
        if(!socket.username){
            return;
        }

        usernames.splice(usernames.indexOf(socket.username),1);
        updateUsernames();
    })
});