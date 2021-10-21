const express = require("express");
const { v4: uuidv4 } = require('uuid');


const cors = require("cors")
const { createServer } = require("http");
const { Server } = require("socket.io");
const { createAdapter } = require("@socket.io/redis-adapter");
const { createClient } = require("redis");

const mariadb = require('mariadb');
const fs = require("fs");
const pool = mariadb.createPool({
    host: 'mariadb',
    port: 3306,
    database: 'todos',
    user: 'root',
    password: 'Mfc2h7BLNz*%!o5C',
    connectionLimit: 5,
    multipleStatements: true
});

let corsOptions = {
    origin: '*',
}

const app = express();
app.use(cors(corsOptions))

const httpServer = createServer(app);

//Configure redis connection to allow for communication between multiple backends
const pubClient = createClient({ host: "redis", port: 6379 });
const subClient = pubClient.duplicate();

const io = new Server(httpServer, { cors: corsOptions });
io.adapter(createAdapter(pubClient, subClient));




let todoList = [];

const dbSeeder = fs.readFileSync('./todos.sql', {
    encoding: "utf-8"
}).toString();

pool.getConnection().then(conn => {
    conn.query(`SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'todos'`)
        .then(rows => {
            delete rows['meta']
            if (rows.length <= 0) {
                conn.query(dbSeeder)
                    .then(res => {
                        console.log(res)
                        retrieveDB()
                    })
                    .catch(err => {
                        console.log(err)
                        retrieveDB()
                    })
            }
        })
})

//Query database to restore
async function retrieveDB() {
    pool.getConnection().then(conn => {
        conn.query("SELECT * FROM todos")
            .then(rows => {
                delete rows['meta']
                todoList = rows
                console.log(todoList)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                if (conn) conn.release();
            })
    });
}

retrieveDB()

function insertTodo(uuid, todoText, todoComplete) {
    pool.getConnection().then(conn => {
        conn.query('INSERT INTO todos (uuid, todoText, todoComplete) VALUES (?, ?, ?)', [uuid, todoText, todoComplete])
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                conn.release()
                retrieveDB()
            })
    })
}

function updateTodo(uuid, todoComplete) {
    pool.getConnection().then(conn => {
        conn.query('UPDATE todos SET todoComplete = ? WHERE uuid = ?',[todoComplete, uuid] )
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                conn.release()
                retrieveDB()
            })
    })
}

io.on("connection", (socket) => {
    console.log(socket.id)
    socket.emit('connected', {
        todoList: todoList
    })
    socket.on('addTodo', (args) => {
        console.log('todo added')
        let todo = {
            uuid: uuidv4(),
            ...args
        }
        console.log(todo)
        todoList.push(todo)
        io.emit('addTodo', todo)
        insertTodo(todo.uuid, todo.todoText, todo.todoComplete)
        retrieveDB()
    })
    socket.on('updateTodo', (args => {
        todoList.forEach(todo => {
            if (args.uuid === todo.uuid) {
                todo.todoComplete = args.todoComplete
            }
        })
        io.emit('updateTodos', {
            todoList: todoList
        })
        retrieveDB()
        updateTodo(args.uuid, args.todoComplete)
    }))
});



httpServer.listen(3000);