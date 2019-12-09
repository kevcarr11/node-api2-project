const express = require("express")
const db = require("../data/db")

const router = express.Router()

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
      if (post) {
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

  db.insert(req.body)
    .then(post => {
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

  db.update(req.params.id, req.body)
  .then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({ message: "The post with the specified ID does not exist." })
    }
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