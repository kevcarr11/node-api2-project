const express = require("express")
const db = require("../data/db")

const router = express.Router({
  mergeParams: true
})

router.get("/", (req, res) => {
  db.findPostComments(req.params.id)
    .then(data => {
      if (data) {
        res.json(data)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})

router.get("/:commentId", (req, res) => {
  db.findCommentById(req.params.commentId)
    .then(data => {
      if (data) {
        res.json(data)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "The comments information could not be retrieved." })
    })
})

router.post("/", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ errorMessage: "Please provide text for the comment." })
  }


  const payload = {
    text: req.body.text
  }

  db.insertComment(payload)
    .then(data => {
      if (data) {
        res.status(201).json(data)
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ error: "There was an error while saving the comment to the database" })
    })
})

module.exports = router