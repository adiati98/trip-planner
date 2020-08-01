const express = require('express')
const mongo = require('mongodb').MongoClient
const url = 'mongodb://localhost:27017'

const app = express()
const port = process.env.PORT || 3000

// Connect to DB
let db, trips, expenses

mongo.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, client) => {
  if(err) {
    console.log(err)
    return
  }
  db = client.db('tripcost')
  trips = db.collection('trips')
  expenses = db.collection('expenses')
})

// Middleware
app.use(express.json())

// Endpoints
// Trips
app.post('/trip', (req, res) => {
  const name = req.body.name
  trips.insertOne({ name: name }, (err, result) => {
    if(err) {
      console.error(err)
      res.status(500).json({ err: err })
      return
    }
    console.log(result)
    res.status(200).json({ ok: true })
  })
})

app.get('/trips', (req, res) => {
  trips.find().toArray((err, items) => {
    if (err) {
      console.error(err)
      res.status(500).json({ err: err })
      return
    }
    res.status(200).json({ trips: items })
  })
})

// Expenses
app.post('/expense', (req, res) => {
  const {trip, date, amount, category, description} = req.body
  expenses.insertOne(
    {
      trip,
      date,
      amount,
      category,
      description
    },
    (err, result) => {
      if (err) {
        console.error(err)
        res.status(500).json({ err: err })
        return
      } 
      console.log(result)
      res.status(200).json({ ok: true })
    }
  )
})

app.get('/expenses', (req, res) => {
  expenses.find({trip: req.body.trip}).toArray((err, items) => {
    if(err) {
      console.error(err)
      res.status(500).json({ err: err })
      return
    }
    res.status(200).json({ trips: items})
  })
})

app.listen(port, () => console.log(`App listening on port ${port}!`))