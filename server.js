const express=require('express')
const app= express()
const server=require('http').Server(app)
const io= module.exports.io =require('socket.io')(server)
const path=require('path')

const port = process.env.PORT || 3070



const publicDirectoryPath=path.join(__dirname )


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
        var array=message.split('@')
        var n=array.length;
        // console.log(n)
        // console.log(array)

        var i=1;
        var names=[];
        var actualmsg=[];
        for(i;i<n;i++){
                if(array[i]!=null){
                    // console.log(array[i]+"***************")
                    var arr=array[i].split(' ')
                    names.push(arr[0]);
                    var m=arr.length;
                    for(j=1;j<m;j++){
                        actualmsg.push(arr[j])
                    }
                    
                    
            }
        }

        if(names.length>0){

        for(var j=0; j<names.length; j++){
            if(names[j] in users){

                //if you want to remove tags and send msg text only
                // users[names[j]].emit('private-message', {message: actualmsg.join(' '), nick: socket.nickname})

                //else
                users[names[j]].emit('private-message', {message: message, nick: socket.nickname})
            }else{
                callback( 'Error! <b>' + names[j] +'</b> is not a valid user')
            }
        }}else{
            socket.broadcast.emit('chat-message', {message: message, nick: socket.nickname})   //msg is sent to all the other persons except the sender
        }

        ////////////////////////////////////////////////////////////////////////////////////
        // if(array[0].substr(0,1) === '@'){
        //     msg = msg.substr(0) //msg is 3 onwards
        //     var ind= msg.indexOf('@'+1)
        //     console.log(ind)
        //     if(ind !== -1){
        //         var name = msg.substr(0, ind)
        //         console.log(name)
        //         var msg = msg.substr(ind+1)
        //         console.log(msg)
        //         if(name in users){
        //             users[name].emit('private-message', {message: message, nick: socket.nickname})
        //             console.log('whisper')
        //         }else{
        //             callback('Error! Enter a valid user')
        //         }
                
        //     }else{
        //         callback('Error! Please enter a message to be sent')
        //         // msg = 'You have been just pinged!'
        //     }
            
        // }else{
        //     socket.broadcast.emit('chat-message', {message: message, nick: socket.nickname})   //msg is sent to all the other persons except the sender
        // }
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