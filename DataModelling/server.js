// In the start of any project make sure that you always design the schema of your project.
// You need to decide that what are the fields to be inserted in the relations (tables) and you also need to decide their type as well.

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})