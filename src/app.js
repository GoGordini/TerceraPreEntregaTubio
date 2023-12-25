import express from "express";
import handlebars from "express-handlebars";
import {__dirname} from "./utils.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from './routes/products.router.js';
import cartsRouter from "./routes/carts.router.js";
import { Server } from "socket.io";
import mongoose from "mongoose";
import ChatManager from "./dao/dbManager/chat.db.js";
const chatManager= new ChatManager();
import ProductManager from "./dao/dbManager/products.db.js";
import sessionsRouter from './routes/sessions.router.js';
import MongoStore from 'connect-mongo';
import session from 'express-session';
const productManager= new ProductManager();
import {initializePassport} from "./config/passport.config.js"
import passport from "passport";
import configs from "./config.js";
import SessionsRouter from './routes/sessions.test.router.js';
import TestsRouter from './routes/tests.router.js';
import cookieParser from "cookie-parser";

const testsRouter = new TestsRouter();
const sessionTestsRouter = new SessionsRouter();

const app = express ();

try{
    await mongoose.connect(configs.mongoUrl);
   // await mongoose.connect("mongodb+srv://eleonoratubio:jT0Z0SKpSILu6qvz@cluster0.4gfsjbp.mongodb.net/clase21?retryWrites=true&w=majority");
    console.log("Connected to DB");
}
catch(error){console.log(error.message)};

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.engine("handlebars",handlebars.engine()); //qué motor de plantillas uso//
app.use(cookieParser());

app.set('views', `${__dirname}/views`); //donde están las vistas, con path abs//
app.set("view engine", "handlebars"); 
app.use(express.static(`${__dirname}/public`));    

app.use(session({ //esto debe ir antes de setear las rutas
    store: MongoStore.create({
        client: mongoose.connection.getClient(), //reutilizo la conexión a mongoose de arriba.
        ttl: 3600
    }),
    secret: 'Coder5575Secret',
    resave: true, //nos sirve para poder refrescar o actualizar la sesión luego de un de inactivadad. En true no da problemas cuando aún no inicié sesión.
    saveUninitialized: true, //nos sirve para desactivar el almacenamiento de la session si el usuario aún no se ha identificado o aún no a iniciado sesión
    // cookie: {
    //     maxAge: 30000
    // }
}));

//Passport config
initializePassport();
app.use(passport.initialize());
app.use(passport.session());


app.use("/", viewsRouter);
app.use('/api/tests', testsRouter.getRouter());
app.use('/api/sessiontests', sessionTestsRouter.getRouter());
app.use("/api/products",productsRouter);
app.use("/api/carts",cartsRouter);
app.use('/api/sessions', sessionsRouter);
app.use((req, res) => {
    res.status(404).send('Error 404: Page Not Found');
  });

  //middleware global para trabajar los errores de joi. Si viene de joi tiene un flag isJoi.
  app.use((err, req, res, next) => {
    if(err && err.error && err.error.isJoi) {
        res.status(422).json({
            type: err.type,
            message: err.error.toString()
        })
    } else {
        next(err);
    }
})

const server= app.listen(8080, ()=>console.log("Server running"));
//const socketServer = new Server(server);
const io = new Server(server);
app.set("socketio",io);

//const messages = [];

io.on("connection",async(socket) =>{
    const messages = await chatManager.getAll();
    console.log("Nuevo cliente conectado");
//lee el evento authenticated; el frontend es index.js. Leemos la data (lo que envío desde index.js)
    socket.on("authenticated",data=>{
    socket.emit("messageLogs",messages); //Enviamos todos los mensajes hasta el momento, únicamnete a quien se acaba de conectar.
    socket.broadcast.emit("newUserConnected",data);
});
//lee el evento message
    socket.on("message",async(data)=>{
    //messages.push(data);
    await chatManager.save(data);
    const newMessage = await chatManager.getAll();
    io.emit("messageLogs",newMessage) //envío a todos lo que hay almacenado.
})

})