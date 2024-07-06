const express = require('express')
const { createServer } = require('node:http')
const { join } = require('node:path')
const { Server } = require('socket.io')
const instructions = require('./instructions.json')
const fetch = require('node-fetch')

const app = express()
const server = createServer(app)
const io = new Server(server)

const state = {
  round: -1, 
  countdown: 30,
  players: [],
  instruction: ''
}

app.use('/', express.static(join(__dirname, 'prompt')))
app.use('/s', express.static(join(__dirname, 'prompts')))

async function get(prompt) {
  console.log(`prompting ${prompt}...`)
  try {
    const response = await fetch(`http://172.18.2.131:5000/prompt/${prompt}`)
    const json = await response.json()
    console.log(prompt, json.url)
    return json.url
  } catch (error) {
    console.log('error while prompting', error)
    return false
  }
}

async function prompt() {
  await Promise.all(state.players.map(async (p) => {
    const result = await get(p.prompts[state.round])
    p.results.push(result)
  }))
  io.emit('state', state)
}

function battle() {
  state.round = state.round + 1
  state.countdown = 30
  state.instruction = instructions[Math.floor(Math.random() * instructions.length)]

  const iv = setInterval(() => {
    if (state.countdown === 0) {
      clearInterval(iv)
      prompt()
    } else {
      state.countdown = state.countdown - 1
    }
    io.emit('state', state)
  }, 1000)
}

function reset() {
  state.round = -1
  state.countdown = 30
  state.players = []
  state.instruction = ''
}

io.on('connection', (socket) => {
  console.log(socket.id, 'connects')
  if (state.players.length > 0) socket.emit('state', state)

  socket.on('name', (value) => {
    console.log(`${value} (${socket.id}) joins`)
    state.players.push({
      id: socket.id,
      name: value,
      prompts: [],
      results: [],
      score: 0
    })
    io.emit('state', state)
  })

  socket.on('do', (value) => {
    console.log('do', value)
    if (value === 'reset') {
      reset()
    } else if (value === 'start') {
      if ((state.countdown !== 0 && state.countdown !== 30) || state.players.length !== 2) return
      battle()
    }
    io.emit('state', state)
  })

  socket.on('type', (value) => {
    if (state.round < 0) return
    const find = state.players.find((p) => p.id === socket.id)
    if (find) {
      const index = state.players.indexOf(find)
      state.players[index].prompts[state.round] = value
      /* console.log(`${state.players[index].name} types ${state.players[index].prompts}`) */
    }
    socket.broadcast.emit('state', state)
  })

  socket.on('score', (value) => {
    const find = state.players.find((p) => p.name === value)
    if (find) {
      const index = state.players.indexOf(find)
      state.players[index].score = state.players[index].score + 1
      console.log(`${state.players[index].name} scores`)
    }
    io.emit('state', state)
  })

  socket.on('disconnect', () => {
    const find = state.players.find((p) => p.id === socket.id)
    if (find) {
      const index = state.players.indexOf(find)
      state.players.splice(index, 1)
      console.log(`${find.name} (${socket.id}) leaves`)
    }
    socket.broadcast.emit('state', state)
  })
})

server.listen(3000, () => {
  console.log('prompting at http://localhost:3000')
})
