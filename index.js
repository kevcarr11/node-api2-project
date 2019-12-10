const express = require("express")
const postRouter = require("./routers/posts")


const server = express()

server.use(express.json())
server.use("/api/posts", postRouter)

server.listen(4000, () => {
  console.log("\n*** Server Running on http://localhost:4000 ***\n")
})