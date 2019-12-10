const express = require("express")
const commentRouter = require("./comments")
const db = require("../data/db")

const router = express.Router()

router.use("/:id/comments", commentRouter)

router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: "The posts information could not be retrieved."
      })
    })
})

router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post.length !== 0) {
        res.status(200).json(post)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.post("/", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }

  db.insert({ ...req.body })
    .then(({ id }) => {
      return db.findById(id)
    })
    .then((post) => {
      res.status(201).json(post)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "There was an error while saving the post to the database" })
    })
})

router.put("/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
  }
  db.findById(req.params.id)
    .then(([post]) => {
      if (post) {
        return db.update(req.params.id, req.body)
      } else {
        return res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
      .then(count => {
        if (count === 1) {
          return db.findById(req.params.id)
        } else {
          res.status(500).json({ error: "The post information could not be modified." })
        }
      })
        .then((post) => {
          res.status(200).json(post)
        })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The post information could not be modified." })
    })
})

router.delete("/:id", (req, res) => {
  db.remove(req.params.id)
    .then(count => {
      if (count > 0) {
        res.status(200).json({ message: "The post has been nuked" })
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The post could not be removed" })
    })
})

module.exports = router