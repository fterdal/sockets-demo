const express = require("express")
const morgan = require("morgan")
const socketIO = require("socket.io")

const app = express()
app.use(morgan("dev"))

app.use(express.urlencoded({ extended: true }))

// Here's where we store our website's users.
// What happens to any new users after the server restarts?
let users = [
  { name: "Linda", favColor: "blue" },
  { name: "Tina", favColor: "peachpuff" },
  { name: "Bobby", favColor: "green" },
  { name: "Louise", favColor: "red" },
  { name: "Gene", favColor: "pink" }
]

app.use(express.static("public"))

const PORT = 7070
const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})

const io = socketIO(server)
io.on("connection", socket => {
  console.log(socket.id, " has made a persistent connection to the server!")
  socket.emit("all-users", users)

  socket.on("new-user", user => {
    console.log("received a user", user)
    users.push(user)
    socket.broadcast.emit("new-user", user)
  })
})
