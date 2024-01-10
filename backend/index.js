const express = require('express')
const dotenv = require('dotenv')
const dataBaseConnection = require('./db/connection')
const UserRoutes = require('./routes/userRoutes');
const ChatRoutes = require('./routes/chatRoutes');
const MessageRoutes = require('./routes/messageRoutes');
const fileUpload = require('express-fileupload');


const app = express();
dotenv.config();
// Calling Databse Connection Funtion
dataBaseConnection();


// For Accepting json Format
app.use(fileUpload());
app.use(express.json());
app.use('/public', express.static(__dirname + '/public'));

app.use(UserRoutes);
app.use(ChatRoutes);
app.use(MessageRoutes);





const PORT = process.env.PORT || 5000;






const server = app.listen( PORT, console.log(`Server is Running On Port ${PORT}`));

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

io.on("connection", (socket)=>{
    console.log("connected to socket.io");

    socket.on("setup", (userData)=> {
        socket.join(userData._id);
        socket.emit("connected");
    });

    
    socket.on("join chat", (room)=> {
        socket.join(room);
        console.log("User Join Room: " + room);
    });

    socket.on("typing", (room)=> socket.in(room).emit("typing"));
    socket.on("stop typing", (room)=> socket.in(room).emit("stop typing"));

    socket.on('new message', (newMessageRecived)=>{
        // NewMessageReceived is a message data object from the client side
        var chat = newMessageRecived.chat;
        if (!chat.users) return console.log("chat Users not define");

        chat.users.forEach(user => {
            if (user._id === newMessageRecived.sender._id) return;

            socket.in(user._id).emit("message recived", newMessageRecived)
        });
    })

    socket.off("setup", ()=>{
        console.log("User Disconected");
        socket.leave(userData._id)
    })
});