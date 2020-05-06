//client side js
const socketUrl ="/"
const socket = io(socketUrl)
// const socket = io('http://localhost:3007')
// const socket = io('https://chat-wth-it.herokuapp.com/:3007')
const messageContainer  = document.getElementById('message-container')
const messageForm = document.getElementById('send-container')
const messageInput = document.getElementById('message-input')
const nickForm = document.getElementById('setNick')
const nickError = document.getElementById('nickError')
const nickBox = document.getElementById('nickname')
const users = document.getElementById('users')


document.getElementById('nickWrap').style.display = 'block'
document.getElementById('content-wrap').style.display = 'none'
// const name=prompt('What is your name') //creates a prompt
// appendMessage('You joined')
// socket.emit('new-user', name)

nickForm.addEventListener('submit', e=>{
    e.preventDefault()
    socket.emit('new-user', nickBox.value, (data)=>{
        if(data){
            document.getElementById('nickWrap').style.display = 'none'
            document.getElementById('content-wrap').style.display = 'block '
            appendMessage('<center><span class="general">'+'You joined'+'</span><center>')
        }else{
            nickError.innerHTML= 'That username is already taken! Try again.'
        }
    })
})

socket.on('usernames',(data)=>{
    var html =''
    for(i=0;i<data.length; i++){
        html += data[i] + '<br>'
    }
    users.innerHTML = html
})


socket.on('chat-message', data =>{
    // console.log(data)
    appendMessage('<span class="public received">' + data.nick + ' : ' + data.message + '</span><br/><br>') 
})

socket.on('user-connected', name =>{
    appendMessage( '<center><span class="general" style="color:green">' + name + ' connected'+ '</span></center>')
})

socket.on('user-disconnected', name =>{
    appendMessage('<center><span class="general" style="color:red">'+name + ' left'+ '</span><center>')
})

messageForm.addEventListener('submit', e =>{
    e.preventDefault()
    const message = messageInput.value
    appendMessage('<span class="mytext sent">'+'You : ' + message+ '</span><br/><br>')
    //to send information from client to server
    // socket.emit('send-chat-message', {to:message, message:message})
    socket.emit('send-chat-message', message , function(data){
        appendMessage(`<span class="error">` + data + `</span>`)
    })

    
    messageInput.value = '' //to empty the input when message is sent
})

socket.on('private-message',(data)=>{
    appendMessage('<span class="private">' + data.nick + ' : ' + data.message + '</span><br/><br>') 
})

function appendMessage(message){
    const messageElement= document.createElement('div')
    messageElement.innerHTML = message
    messageContainer.append(messageElement)
}

//code to show istyping
messageInput.addEventListener('keypress',()=>{
    socket.emit('typing',{user:'Someone', message:' is typing...'})
})

socket.on('notifyTyping', data => {
    typing.innerText = data.user + " " + data.message;
    console.log(data.user + data.message)
    })

//stop typing
messageInput.addEventListener('keyup', () => {
    socket.emit('stopTyping', "")
})
socket.on("notifyStopTyping", () => {
    typing.innerText = ""
})