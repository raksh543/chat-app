const io=require('socket.io')(3007)
const express=require('express')

const port = process.env.PORT || 3070

// const app= express()

// app.set('view engine', 'hbs')

const users = {}

//every time user loads website this function is called
io.on('connection', socket =>{
    // socket.emit('chat-message', 'Helloworld')

    socket.on('new-user', name =>{
        users[socket.id] = name
        socket.broadcast.emit( 'user-connected', name)
    })

    socket.on('send-chat-message', message =>{
        console.log(message)
        socket.broadcast.emit('chat-message', {message: message, name: users[socket.id]})//msg is sent to all the other persons except the sender
    })

    socket.on('disconnect', ()=>{
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})



// app.get('/', (req,res)=>{
//     res.render('index')
// })

// app.listen(port, ()=>{
//     console.log('Server is up on the port' + port)
// })