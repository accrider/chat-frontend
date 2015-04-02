var express = require("express");
var app = express();
var port = 3700;

var INIT_MESSAGES = 5;

var messages = new Array()

Array.prototype.inject = function(element) {

    if (this.length >= INIT_MESSAGES) {
        this.shift()
    }
    this.push(element)
}
 
//app.get("/", function(req, res){
//    res.send("It works!");
//});

app.set('views', __dirname + '/template');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});

app.use(express.static(__dirname + '/public'));
 
//app.listen(port);

var io = require('socket.io').listen(app.listen(port));


io.sockets.on('connection', function (socket) {
    socket.emit('message', JSON.stringify({ message: 'welcome to the chat' }));
    socket.emit("init", JSON.stringify(messages))
    socket.on('send', function (data) {

        var message = JSON.parse(data);

        messages.inject(message);

        io.sockets.emit('message', data);
    });
});

console.log("Listening on port " + port);

