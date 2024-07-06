const socket = io()
console.log(socket)

socket.on('state', (state) => {
  console.log(state)
  if (state.players.length === 0) {
    reset()
  }

  if (socket.id === state.players[0].id) {
  document.querySelector('body').style.background = `linear-gradient(360deg, red, black)`
  } else {
  document.querySelector('body').style.background = `linear-gradient(360deg, blue, black)`
  }

  if (state.countdown === 30 || state.countdown === 0) {
    console.log("disable prompt")
    document.querySelector('#input-prompt').disabled = true
    document.querySelector('#input-prompt').style.cursor = 'not-allowed'
    document.querySelector('#input-prompt').value = ''
  } else {
    document.querySelector('#input-prompt').disabled = false
    document.querySelector('#input-prompt').style.cursor = 'text'
  }

})

function reset () {
  window.location.reload()
}

document.querySelector('#input-name').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    const name = document.querySelector('#input-name').value.trim()
    if (!name) return
    socket.emit('name', name)
    document.querySelector('#input-name').style.display = 'none'
    document.querySelector('#title').innerText = `prompt [${name}] battle`
    document.querySelector('#input-prompt').style.display = 'block'
    document.querySelector('#input-prompt').select()
  }
})

document.querySelector('#input-prompt').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') event.preventDefault()
})

document.querySelector('#input-prompt').addEventListener('keyup', (event) => {
  const prompt = document.querySelector('#input-prompt').value
  socket.emit('type', prompt)
  console.log(prompt)
})
