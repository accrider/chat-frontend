window.onload = function() {
 
    var messages = [];
    var socket = io.connect('http://dev.adamcrider.com:3700');
    var field = document.getElementById("field");
    var sendButton = document.getElementById("send");
    var content = document.getElementById("content");
    var name = document.getElementById("name");
    socket.on('init', function(data) {
        var msg = JSON.parse(data);
	console.log(msg);
	for (i in msg) {
		messages.push(msg[i]);
	}
	appendMsg(content,messages);
    
    }); 
    socket.on('message', function (data) {
	var msg = JSON.parse(data);
	console.log(msg);
        if(msg.message) {
            messages.push(msg);
            var html = '';
            for(var i=0; i<messages.length; i++) {
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
            }
            content.innerHTML = html;
        } else {
            console.log("There is a problem:", data);
        }
    });
 
    sendButton.onclick = function() {
	var test = getParameter("name");
	if (test) {
		socket.emit('send', JSON.stringify({message:field.value, username:test}));
	}
	field.value = "";
    };
    field.onkeypress = function(e) {
	var test = getParameter("name");
	if (e.keyCode === 13 && test) {
	    socket.emit('send', JSON.stringify({message:field.value, username:test}));
            field.value = "";
	}
    }
 
}
function appendMsg(content,messages) {
	var html = '';
	for (i in messages) {
		console.log(messages[i]);
                html += '<b>' + (messages[i].username ? messages[i].username : 'Server') + ': </b>';
                html += messages[i].message + '<br />';
	}
	content.innerHTML = html;
}
function getParameter(theParameter) { 
  var params = window.location.search.substr(1).split('&');
 
  for (var i = 0; i < params.length; i++) {
    var p=params[i].split('=');
	if (p[0] == theParameter) {
	  return decodeURIComponent(p[1]);
	}
  }
  return false;
}
