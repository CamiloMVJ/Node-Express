const http = require('http')
const express = require('express')
const app = express()
const morgan = require('morgan')
// const { stringify } = require('querystring')
const cors = require('cors')

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', function (req) { return JSON.stringify(req.body) })

app.use(morgan(':method :body :url :date[clf] :total-time[3] ms'))

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
//GETS
app.get('/info', (request, response) => {
  const fecha = new Date()
  response.send(
    `<p>Se tiene informacion de ${persons.length} personas</p>
    <p>${fecha.toString()}</p>`
  )
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.send(`
      <p><strong>Nombre:</strong> ${person.name}</p>
      <p><strong>Numero:</strong> ${person.number}</p>
      `)
  }
  else {
    response.status(404).end()
  }
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  if (note) {
    response.json(note)
  }
  else {
    response.status(404).end()
  }
})

//DELETE
app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== id)
  response.status(204).end()
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})
//POST
const generateId = (list) => {
  maxId = list.length > 0 ? Math.max(...list.map(n => n.id)) : 0
  return String(maxId + 1)
}
app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {
    return response.status(400).json(
      {
        error: 'content missing'
      }
    )
  }
  const note = {
    content: body.content,
    important: Boolean(body.important) || false,
    id: generateId(notes)
  }
  notes = notes.concat(note)
  response.json(note)
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Contenido faltante'
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'El nombre ya esta registrado'
    })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(persons)
  }
  persons = persons.concat(person)
  response.json(person)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
