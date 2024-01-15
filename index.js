const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', req => {
    return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = data.length > 0
        ? Math.max(...data.map(n => n.id))
        : 0
    return maxId + 1
}

app.get('/info', (request, response) => {
    response.send(`<h1>Phonebook has info for ${data.length} people</h1><p>${new Date().toUTCString()}</p>`)
})

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = data.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }

})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    data = data.filter(p => p.id !== id)
    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body
    
    if(!body.name || !body.number) {
        return res.status(400).json({
            error: 'content missing include a name and number'
        })
    }

    if (data.find(p => p.name === body.name)) {
        return res.status(400).json({
            error: 'name already exists in phonebook'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    data = data.concat(person)
    res.json(person)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})