const express=require('express')
const app= express()
const server=require('http').Server(app)
const io= module.exports.io =require('socket.io')(server)
const path=require('path')

const port = process.env.PORT || 3070



const publicDirectoryPath=path.join(__dirname)

app.set('view engine', 'html')

app.use(express.static(publicDirectoryPath))

const users = {}

// nicknames=[]

//every time user loads website this function is called
io.sockets.on('connection', socket =>{
    // socket.emit('chat-message', 'Helloworld')
    socket.on('new-user', (data,callback)=>{
        if(data in users){
            callback(false)
        }else{
            callback(true)
            socket.broadcast.emit( 'user-connected', data)
            socket.nickname = data
            users[socket.nickname] = socket // using nickname as key and saving socket in there
            // nicknames.push(socket.nickname)
            io.sockets.emit('usernames', Object.keys(users))
        }
    })

    function updateNickNames(){
        io.sockets.emit('usernames', nicknames)
    }

    // socket.on('new-user', name =>{
    //     users[socket.id] = name
    //     socket.broadcast.emit( 'user-connected', name)
    //     console.log(users)
    // })

    // socket.on('send-chat-message', message =>{
    //     console.log(message)
    //     socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]})//msg is sent to all the other persons except the sender
    // })

    socket.on('send-chat-message', (message , callback) =>{
        var msg=message.trim()
        if(msg.substr(0,3) === '/w '){
            msg = msg.substr(3) //msg is 3 onwards
            var ind= msg.indexOf(' ')
            if(ind !== -1){
                var name = msg.substr(0, ind)
                console.log(name)
                var msg = msg.substr(ind+1)
                console.log(msg)
                if(name in users){
                    users[name].emit('private-message', {message: message, nick: socket.nickname})
                    console.log('whisper')
                }else{
                    callback('Error! Enter a valid user')
                }
                
            }else{
                callback('Error! Please enter a message to be sent')
                // msg = 'You have been just pinged!'
            }
            
        }else{
            socket.broadcast.emit('chat-message', {message: message, nick: socket.nickname})   //msg is sent to all the other persons except the sender
        }
        // socket.join('b')
        // io.to(b).emit('chat-message', {message: message, name: users[socket.id]})

    //    socket.to(users[message]).emit('chat-message', {message: message, name: users[socket.id]})//msg is sent to all the other persons except the sender
    })

    socket.on('disconnect', (data)=>{
        if(!socket.nickname) return
        delete users[socket.nickname]
        // nicknames.splice(nicknames.indexOf(socket.nickname), 1)
        io.sockets.emit('usernames', Object.keys(users))
        // socket.broadcast.emit('user-disconnected', users[socket.id])
        // delete users[socket.id]
    })
})



app.get('/', (req,res)=>{
    res.render('index')
})

server.listen(port, ()=>{
    console.log('Server is up on the port' + port)
})