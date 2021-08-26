

if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose'); 
const session = require('express-session');
const passport = require('passport');
const localStrategy = require('passport-local');
const { isLoggedIn } = require('./middleware');
const flash = require('connect-flash');
const User = require('./models/user');
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server); 
const Chat = require('./models/chats');

//connecting to the database using "mongoose.connect" method which returns a promise
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => console.log("Database connected"))
.catch((err) => console.log(err));


//configuration: setting up the template engine and path for 'views' folder:
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'/views'));

//serving static files via middleware:
app.use(express.static(path.join(__dirname,'public')));

// enabling parser for req.body (form data)
app.use(express.urlencoded({ extended: true }))
// enable parser for req.body ( jason parser)
app.use(express.json());

// -----------------------------------------------------------------

// Routes

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const chatRoutes = require('./routes/chatRoutes');
const apiRoutes = require('./routes/apiRoutes'); // news api


//APIs

const postApiRoutes = require('./routes/api/posts');


// -------------------------------------------------------------------

// setting up sessions for authentication
app.use(session({
    secret: 'weneedsecrretfortwitter',
    resave: false,
    saveUninitialized: true
  }))

//initializing flash
app.use(flash());

//initializing the passport inorder to use it  
app.use(passport.initialize());
//configuring passport to be able to use sessions
app.use(passport.session());
//configuring passport to use local strategy approach
passport.use(new localStrategy(User.authenticate()));
//taking users in and out of sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
  });



app.get('/', isLoggedIn, (req, res) => {

        res.render('home');
    
})


//using routes
app.use(authRoutes);
app.use(profileRoutes);
app.use(chatRoutes);
app.use(apiRoutes); //? news-api
//using APIs
app.use(postApiRoutes);


// sending a get request 
// app.get('/', function (req, res) {
//     res.send('Welcome to the home page! ');
// })

//? ----------<<  Sockets.Io Part >>----------------------------

io.on('connection', (socket)=> {
    console.log("Connection established!");

    socket.on('send-msg', async (data) => {
        // console.log(data);

        // socket.emit('received-msg', {msg: data.msg});
        io.emit('received-msg', {
            msg: data.msg,
            username: data.username,
            createdAt: new Date()
        });

        await Chat.create({content: data.msg, user: data.username});
    })

    
})





// listening to requests at port 3000
server.listen(process.env.PORT || 3000, function () {
    console.log("app started successfully at port 3000");
})

