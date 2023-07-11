var socket = io.connect(window.location.host);

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector("#message_history")
//var audio = new Audio('ting.mp3');
const append = (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight;
    if(position =='left'){ 
       // audio.play();
    }
}

const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);


 // If a new user joins, receive his/her name from the server
 socket.on('user-joined', name =>{
    console.log(name)
     append(`${name} joined the chat`, 'right')
 })
 // If server sends a message, receive it
 socket.on('receive', data =>{
     append(`${data.name}: ${data.message}`, 'left')
 })
 // If a user leaves the chat, append the info to the container
 socket.on('left', name =>{
     append(`${name} left the chat`, 'right')
 })
 // If the form gets submitted, send server the message
 form.addEventListener('submit', (e) => {
     e.preventDefault();
     const message = messageInput.value;
     append(`You: ${message}`, 'right');
     socket.emit('send', message);
     messageInput.value = ''
 })