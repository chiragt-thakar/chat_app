var fs = require('fs');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(process.env.PORT || 7080);

// server.on("request", (req, res) => {
//     if (req.url === "/") {
//       fs.readFile(__dirname + "/index.html", (err, data) => {
//         if (err) {
//           res.writeHead(500);
//           res.end("Error loading index.html");
//         } else {
//           res.writeHead(200, { "Content-Type": "text/html" });
//           res.end(data);
//         }
//       });
//     }
//   });
const users = {};

app.get('/',function(request,response){

  response.writeHead(200,{"Content-Type":"text/html"});

  response.write(fs.readFileSync("./public/index.html"));

  response.end();

})
//Routing To Public Folder For Any Static Context
app.use(express.static(__dirname + '/public'));
console.log("Server Running At:localhost:");



 io.on('connection', socket =>{
     // If any new user joins, let other users connected to the server know!
     socket.on('new-user-joined', name =>{ 
         users[socket.id] = name;
         console.log(name);
         socket.broadcast.emit('user-joined', name);
     });

     // If someone sends a message, broadcast it to other people
     socket.on('send', message =>{
         socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
     })
     // If someone leaves the chat, let others know 
     socket.on('disconnect', message =>{
         socket.broadcast.emit('left', users[socket.id]);
         delete users[socket.id];
     }); 
    //  server.listen(3000, () => {
    //     console.log("Listening on *:3000");
    //   });

 })