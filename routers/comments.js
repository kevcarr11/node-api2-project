const express = require("express")
const db = require("../data/db")

const router = express.Router({
  mergeParams: true
})

// router.get("/", (req, res) => {
//   db.findPostComments(req.params.id)
//     .then(data => {
//       if (data) {
//         res.json(data)
//       } else {
//         res.status(404).json({ message: "The post with the specified ID does not exist." })
//       }
//     })
//     .catch(err => {
//       console.log(err)
//       res.status(500).json({ error: "The comments information could not be retrieved." })
//     })
// })

router.get("/", (req, res) => {
  db.findPostComments(req.params.id)
    .then(comment => {
      if (comment.length !== 0) {
        res.status(201).json(comment)
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

  db.findById(req.params.id)
    .then(([post]) => {
      if (post) {
        return db.insertComment({ ...req.body, post_id: req.params.id })
      } else {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
      }
    })
    .then(({ id }) => {
      return db.findCommentById(id)
    })
    .then(([comment]) => {
      res.status(201).json(comment)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: "There was an error while saving the comment to the database" })
    })
  // const payload = {
  //   text: req.body.text,
  //   post_id: req.params.id 
  // }

  // db.insertComment(payload)
  //   .then(data => {
  //     if (data) {
  //       res.status(201).json(data)
  //     } else {
  //       res.status(404).json({ message: "The post with the specified ID does not exist." })
  //     }
  //   })
  //   .catch(err => {
  //     console.log(err)
  //     res.status(500).json({ error: "There was an error while saving the comment to the database" })
  //   })
})

module.exports = router