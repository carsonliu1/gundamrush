const canvas = document.querySelector('canvas')
const scoreEle = document.querySelector('#scoreEle')
const startGameEle = document.querySelector('#startGameBtn')
const startModel = document.querySelector('#model')
const endGameScore = document.querySelector('#endGameScore')
const points = document.querySelector('#points')
const cornerScore = document.querySelector('#cornerScore')
const context = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight


class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0
    }
    this.rotation = 0
    this.opacity = 1

    const image = new Image()
    image.src = './img/plane.png'
    image.onload = () => {
      this.image = image
      this.height = image.height * 0.30
      this.width = image.width * 0.25
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 40
      }
    }

  }

  draw() {
    if(this.image) {
      context.save()
      context.globalAlpha = this.opacity
      context.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
      context.rotate(this.rotation)
      context.translate(-(player.position.x + player.width / 2), -(player.position.y + player.height / 2))
      context.drawImage(this.image, this.position.x, this.position.y, this.height, this.width)
      context.restore()
    }
  }

  update() {
    if(this.image) {
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }
}

class Enemy {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0
    }

    const image = new Image()
    image.src = './img/enemy.png'
    image.onload = () => {
      this.image = image
      this.height = image.height * 0.9
      this.width = image.width * 0.9
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  draw() {
    if(this.image) {
      context.drawImage(this.image, this.position.x, this.position.y, this.height, this.width)
    }
  }

  update({ velocity }) {
    if(this.image) {
      this.draw()
      this.position.x += velocity.x
      this.position.y += velocity.y
    }
  }

  shoot(enemyProjectiles) {
    let speed
    if(Math.random() > 0.5) {
      speed =  Math.floor(Math.random() * 3)
    } else {
      speed = -(Math.floor(Math.random() * 3))
    }
    let ySpeed = Math.floor(Math.random() * 4) + 2
    if(timer > 10000) {
      ySpeed = Math.floor(Math.random() * 4) + 3
    } else if(timer > 25000) {
      ySpeed = Math.floor(Math.random() * 4) + 5
    }
    enemyProjectiles.push(new EnemyProjectile({
      position: {
        x: this.position.x + this.width / 2,
        y: this.position.y + this.height
      },
       velocity: {
        x: speed,
        y: ySpeed
       }
    }))
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0
    }

    this.velocity = {
      x: 3,
      y: 0
    }

    this.enemies = []
    const cols = Math.floor(Math.random() * 5 + 5)
    const rows = Math.floor(Math.random() * 2 + 2)
    this.width = cols * 50
    for(let x = 0; x < cols; x++) {
      for(let y = 0; y < rows; y++) {
        this.enemies.push(new Enemy({
          position: {
            x: x * 50,
            y: y * 50
          }
        }))
      }
    }
  }

  update() {
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    this.velocity.y = 0
    if(this.position.x + this.width >= canvas.width || this.position.x <= 0 ) {
      this.velocity.x = -this.velocity.x
      this.velocity.y = 30
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 4
    const image = new Image()
    image.src = './img/projectile.png'
    image.onload = () => {
      this.image = image
      this.height = image.height
      this.width = image.width
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }




  draw() {
    if(this.image) {
      context.drawImage(this.image, this.position.x, this.position.y, this.height, this.width)
    }
  }

  update() {
    if(this.image) {
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }
}

class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position
    this.velocity = velocity
    this.radius = radius
    this.color = color
    this.opacity = 1
    this.fades = fades
  }

  draw() {
    context.save()
    context.globalAlpha = this.opacity
    context.beginPath()
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    context.fillStyle = this.color
    context.fill()
    context.closePath()
    context.restore()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
    if(this.fades) this.opacity -= 0.01
  }
}

class EnemyProjectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.width = 3
    this.height = 10
    const image = new Image()
    image.src = './img/projectile2.png'
    image.onload = () => {
      this.image = image
      this.height = image.height * 0.8
      this.width = image.width * 1.2
      this.position = {
        x: position.x,
        y: position.y
      }
    }
  }

  draw() {
    if(this.image) {
      context.drawImage(this.image, this.position.x, this.position.y, this.height, this.width)
    }
  }

  update() {
    if(this.image) {
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }
}

let player = new Player()
let projectiles = []
let grids = []
let enemyProjectiles = []
let particles = []

const init = () => {
  player = new Player()
  projectiles = []
  grids = []
  enemyProjectiles = []
  game.over = false
  game.active = true
  keys.a.pressed = false
  keys.d.pressed = false
  keys.w.pressed = false
  keys.s.pressed = false
  score = 0
  timer = 0
  frames = 0
  scoreEle.innerHTML = score
  endGameScore.innerHTML = score
}

player.draw()
let keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  s: {
    pressed: false
  },
  space: {
    pressed: false
  }
}

let frames = 0
let score = 0
let timer = 0
let randomInterval = Math.floor(Math.random() * 500) + 500
let game = {
  over: false,
  active: true
}


for(let x = 0; x < 100; x++) {
  particles.push(new Particle({
    position: {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    },
    velocity: {
      x: 5,
      y: 7
    },
    radius: 1.5,
    color: 'black'
  }))
}

const createParticles = ({ object, color, fades }) => {
  for(let x = 0; x < 15; x++) {
    particles.push(new Particle({
      position: {
        x: object.position.x + object.width / 2,
        y: object.position.y + object.height / 2
      },
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      },
      radius: Math.random() * 1.5,
      color: color || 'orange',
      fades
    }))
  }
}

const death = new Audio('./bgm/death.mp3')
const bgm = new Audio('./bgm/megaman.mp3')
const audio = new Audio('./bgm/shootsound.mp3')


let animationId
const animate = () => {
  if(!game.active) {
    bgm.pause()
    startGameEle.innerHTML = 'Game Over! Restart'
    startModel.style.visibility = 'visible'
    points.style.visibility = 'visible'
    endGameScore.style.visibility = 'visible'
    endGameScore.innerHTML = score
    return
  }
  if(score >= 100000) {
    bgm.pause()
    game.active = false
    game.over = true
    startGameEle.innerHTML = 'You win!'
    startModel.style.visibility = 'visible'
    points.style.visibility = 'visible'
    endGameScore.style.visibility = 'visible'
    endGameScore.innerHTML = score
    return
  }
  animationId = requestAnimationFrame(animate)
  const background = new Image()
  background.src = 'https://i.gifer.com/1ErA.gif'
  background.onload = () => {
    context.drawImage(background, 0, 0, canvas.width, canvas.height)
  }
  player.update()

  particles.forEach((particle, idx) => {
    if(particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width
      particle.position.y = -particle.radius
    }
    if(particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(idx, 1)
      }, 0)
    } else {
      particle.update()
    }
  })

  enemyProjectiles.forEach((enemyProjectile, idx) => {
    if(enemyProjectile.position.y + enemyProjectile.height === canvas.height - 15) {
      setTimeout(() => {
        enemyProjectiles.splice(idx, 1)
      }, 0)
    } else {
      enemyProjectile.update()
    }

    if(enemyProjectile.position.y + enemyProjectile.height >= player.position.y &&
       enemyProjectile.position.x + enemyProjectile.width >= player.position.x &&
       enemyProjectile.position.x <= player.position.x + player.width * 0.5 &&
       enemyProjectile.position.y <= player.position.y + player.height) {
        setTimeout(() => {
          enemyProjectiles.splice(idx, 1)
          player.opacity = 0
          game.over = true
        }, 0)
        setTimeout(() => {
          game.active = false
        }, 1000)
        createParticles({
          object: player,
          color: 'yellow',
          fades: true
        })
        death.volume = 0.1
        death.play()
      }
    })

  projectiles.forEach((ele, idx) => {
    if(ele.position.y + ele.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(idx, 1)
      }, 0)
    } else {
      ele.update()
    }
  })

  grids.forEach((grid, gridIdx) => {
    grid.update()
    let num = 35
    if(timer > 10000) {
      num = 30
    } else if(timer > 25000) {
      num = 27
    }
    if(frames % num === 0 && grid.enemies.length > 0) {
      grid.enemies[Math.floor(Math.random() * grid.enemies.length)].shoot(enemyProjectiles)
    }
    grid.enemies.forEach((enemy, idx) => {
      enemy.update({ velocity: grid.velocity })
      if(enemy.position) {
        if(enemy.position.y + enemy.height >= player.position.y &&
          enemy.position.x + enemy.width >= player.position.x &&
          enemy.position.x <= player.position.x + player.width * 0.5 &&
          enemy.position.y <= player.position.y + player.height) {
          player.opacity = 0
          game.over = true
          setTimeout(() => {
            game.active = false
          }, 100)
          createParticles({
            object: player,
            color: 'yellow',
            fades: true
          })
          death.volume = 0.1
          death.play()
        }
      }
      projectiles.forEach((projectile, idx2) => {
        if(
          projectile.position.y - projectile.radius <= enemy.position.y + enemy.height &&
          projectile.position.x + projectile.radius >= enemy.position.x &&
          projectile.position.x - projectile.radius <= enemy.position.x + enemy.width &&
          projectile.position.y + projectile.radius >= enemy.position.y) {
          setTimeout(() => {
            const enemyFound = grid.enemies.find(enemy2 => {
              return enemy2 === enemy
            })
            const projectileFound = projectiles.find(projectile2 => projectile2 === projectile)
            if(enemyFound && projectileFound) {
              score += 100
              scoreEle.innerHTML = score
              createParticles({
                object: enemy,
                fades: true
              })
              grid.enemies.splice(idx, 1)
              projectiles.splice(idx2, 1)

              if(grid.enemies.length > 0) {
                const firstEnemy = grid.enemies[0]
                const lastEnemy = grid.enemies[grid.enemies.length - 1]
                grid.width = lastEnemy.position.x - firstEnemy.position.x + lastEnemy.width
                grid.position.x = firstEnemy.position.x
              } else {
                grids.splice(gridIdx, 1)
              }
            }
          }, 0)
        }
      })
    })
  })

  if(keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -6
    player.rotation = - .15
  } else if(keys.d.pressed && player.position.x + player.width <= canvas.width) {
    player.velocity.x = 6
    player.rotation = .15
  } else {
    player.velocity.x = 0
    player.rotation = 0
  }

  if(keys.w.pressed && player.position.y >= 50) {
    player.velocity.y = -6
  } else if(keys.s.pressed && player.position.y <= canvas.height - 75) {
    player.velocity.y = 6
  } else {
    player.velocity.y = 0
  }

  if(frames % randomInterval === 0) {
    grids.push(new Grid())
    let amt = 150
    if(timer > 10000) {
      amt = 110
    } else if(timer > 20000) {
      amt = 99
    }
    randomInterval = Math.floor(Math.random() * 500) + amt
    frames = 0
  }

  frames++
  timer++
}

addEventListener('keydown', ({ key }) => {
  if(game.over) return
  switch(key) {
    case 'a':
      keys.a.pressed = true
      break
    case 'd':
      keys.d.pressed = true
      break
    case 'w':
      keys.w.pressed = true
      break
    case 's':
      keys.s.pressed = true
      break
    case 'ArrowLeft':
      keys.a.pressed = true
      break
    case 'ArrowRight':
      keys.d.pressed = true
      break
    case 'ArrowUp':
      keys.w.pressed = true
      break
    case 'ArrowDown':
      keys.s.pressed = true
      break
  }
})

addEventListener('keyup', ({ key }) => {``
  if(game.over) return
  switch(key) {
    case 'a':
      keys.a.pressed = false
      break
    case 'd':
      keys.d.pressed = false
      break
    case 'w':
      keys.w.pressed = false
      break
    case 's':
      keys.s.pressed = false
      break
    case 'ArrowLeft':
      keys.a.pressed = false
      break
    case 'ArrowRight':
      keys.d.pressed = false
      break
    case 'ArrowUp':
      keys.w.pressed = false
      break
    case 'ArrowDown':
      keys.s.pressed = false
      break
  }
})

addEventListener('keydown', (e) => {
  if(game.over) return
  // if(e.repeat) return
  audio.pause()
  switch(e.key) {
    case ' ':
      audio.volume = 0.04
      audio.play()
      projectiles.push(new Projectile({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y
        },
        velocity: {
          x: 0,
          y: -7
        }
      }))
      break
  }
})

startGameEle.addEventListener('click', () => {
  bgm.loop = true
  bgm.volume = 0.13
  bgm.play()
  init()
  animate()
  startModel.style.visibility = 'hidden'
  cornerScore.style.visibility = 'visible'
  points.style.visibility = 'hidden'
  endGameScore.style.visibility = 'hidden'
})
cornerScore.style.visibility = 'hidden'
points.style.visibility = 'hidden'
endGameScore.style.visibility = 'hidden'
