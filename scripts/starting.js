module.exports = setupScripts

var g = require('./global.js')

const pathfinding = require('./pathfinding.js')
const movement = require('./movement.js')

function setupScripts () {
  // sets the frame rate - which also controls how fast everything travels
  window.frameRate(30)
  // determines how big the tiles can be for everything to fit on the screen
  g.tileDimension = settileDimension()
  // adds all the map divs to the page
  drawMap()
  // builds all the arrays
  getArrays()
  // adds some cars
  for (let i = 0; i < 20; i++) {
    createCar()
  }
}

function settileDimension () {
  const maxTileHeight = Math.floor((window.innerHeight - 2 * g.border) / g.mapHeight)
  const maxTileWidth = Math.floor((window.innerWidth - 2 * g.border) / g.mapWidth)
  return Math.min(maxTileHeight, maxTileWidth)
}

function forEachInStreetArray (func) {
  for (let i = 0; i < g.mapHeight; i++) {
    for (let j = 0; j < g.mapWidth; j++) {
      func(i * g.mapWidth + j, i, j)
    }
  }
}

function drawMap () {
  forEachInStreetArray((i, ypos, xpos) => {
    let div = document.createElement('div')
    div.style.width = g.tileDimension + 'px'
    div.style.height = g.tileDimension + 'px'
    div.style.left = (xpos * g.tileDimension + g.border) + 'px'
    div.style.top = (ypos * g.tileDimension + g.border) + 'px'
    div.style.position = 'absolute'
    div.classList.add(g.streetArray[i])
    div.classList.add('id' + i)
    div.classList.add('tile')
    document.getElementById('main').appendChild(div)
  })
}

function getArrays () {
  forEachInStreetArray((i, ypos, xpos) => {
    g.arrays.map.push({xpos: xpos, ypos: ypos, id: i, type: g.streetArray[i]})
    g.arrays[g.streetArray[i]].push(i)
  })
  g.arrays.map.forEach((cell, i) => {
    let nearbys = g.arrays.map.filter(x => {
      return x.xpos === cell.xpos && (x.ypos === cell.ypos + 1 || x.ypos === cell.ypos - 1) || x.ypos === cell.ypos && (x.xpos === cell.xpos + 1 || x.xpos === cell.xpos - 1)
    })
    g.arrays.map[i].nearbys = nearbys.map(x => x.id)
  })
}

function createCar (fromId) {
  let speed = 0.2
  let home = g.arrays.hm[Math.floor(Math.random() * g.arrays.hm.length)]
  let xpos = g.arrays.map[home].xpos + 0.5 - g.carWidth
  let ypos = g.arrays.map[home].ypos + 0.5 - g.carLength
  g.arrays.cars.push({moving: true, speed: speed, home: home, xpos: xpos, ypos: ypos})
  drawCar(xpos, ypos, g.arrays.cars.length - 1)
  movement.setRoute(g.arrays.cars.length - 1, home)
}

function drawCar (xpos, ypos, id) {
  let div = document.createElement('div')
  div.style.width = Math.floor(g.tileDimension * g.carWidth) + 'px'
  div.style.height = Math.floor(g.tileDimension * g.carLength) + 'px'
  div.style.left = (xpos * g.tileDimension + g.border) + 'px'
  div.style.top = (ypos * g.tileDimension + g.border) + 'px'
  div.style['background-color'] = 'black'
  div.style.position = 'absolute'
  div.classList.add('car')
  div.classList.add('car' + id)
  document.getElementById('main').appendChild(div)
}