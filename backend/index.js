const connectToMongo = require('./db.js');
const express = require('express')
const cors = require('cors')
const app = express();
const port = 5000;


connectToMongo();

app.use(cors())
app.use(express.json())

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// AVAILABLE ROUTES
app.use('/auth',require("./routes/auth.js"))
app.use('/notes',require("./routes/notes.js"))



app.listen(port, () => {
  console.log(`iNotebook Backend listening on  http://localhost:${port}`)
})