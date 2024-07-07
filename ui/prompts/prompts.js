let countdown = 60

const socket = io()
let stick = true

document.querySelectorAll('button').forEach((e) => {
  e.addEventListener('click', (event) => {
    socket.emit('do', e.id)
  })
})

document.addEventListener('keypress', (event) => {
  if (event.key === ' ') {
    stick = !stick
  }
})

window.addEventListener('mousemove', (event) => {
  if (!stick) return
  document.querySelector('#instruction').style.top = `${event.pageY}px`
  document.querySelector('#instruction').style.left = `${event.pageX}px`
})

socket.on('state', (state) => {
  document.querySelector('main').innerHTML = state.players
    .map((p) => {
      return `
      <div>
        ${p.results[state.round] ? `<img src="http://172.18.2.131:5000/${p.results[state.round]}"/>` : ''}
        <p class="name" data-name="${p.name}"><span>${p.name}</span> <span>${
        p.score ? Array(p.score).fill('⭐️').join('') : ''
      }</span></p>
        <p class="${p.results[state.round] ? 'single-prompt' : 'prompt'}">${p.prompts[state.round] ? p.prompts[state.round] : ''}</p>
      </div>
  `
    })
    .join('')

    state.players.forEach((p) => {
      if (p.results[state.round]) {
        document.querySelector('.loader').style.display = 'none'
      } else if (state.countdown === 0) {
        document.querySelector('.loader').style.display = 'block'
      }
    })

  document.querySelector('#instruction').innerHTML = state.instruction.startsWith('http')
    ? `<img src="${state.instruction}"/>`
    : `<p>${state.instruction}</p>`

  document.querySelector('#countdown').innerHTML =
    state.countdown === 0 || state.countdown === countdown ? '' : state.countdown

  document.querySelector('#title').innerHTML =
    state.round === -1 ? `prompt [] battle` : `prompt [${state.round}] battle`

  document.querySelectorAll('.name').forEach((e) => {
    e.addEventListener('click', (event) => {

      // Left and Right
      let index = Array.from(e.parentElement.parentElement.children).indexOf(e.parentElement);
      if (index === 0) {
        celebrate_left()
      } else {
        celebrate_right()
      }

      socket.emit('score', e.dataset.name)
    })
  })
})
