module.exports = {
  getRoute,
  searchRoutes
}

var g = require('./global.js')

function getRoute (fromId, toId) {
  return searchRoutes(fromId, [toId], [[{id: toId}]])
}

function searchRoutes (end, list, tree) {
  const step = tree.length - 1 // the number of steps away from the start
  tree.push([]) // Adds a new array for the roads the next step array
  for (let i = 0; i < tree[step].length; i++) { // for each road that is the current number of steps away
    let branch = tree[step][i]
    let nearbys = g.arrays.map[branch.id].nearbys // the spaces nearby the road
    if (nearbys.indexOf(end) !== -1) { // if one of these spaces is the end
      let route = [{id: end, prevId: branch.id}] // Creates a new array to store the route from start to finish
      for (let j = tree.length - 1; j > 0; j--) { // for each step already taken
        const nextBranch = tree[j - 1].find(x => x.id === route[route.length - 1].prevId) // find the next step..
        route.push(nextBranch) // ...and store that in the route
      }
      route = route.map(x => x.id)
      return route // Returns the full route as an array of ids
    } else { // If none of the nearby spaces were the final destination
      nearbys = nearbys.filter(x => {
        return !list.includes(x) && g.arrays.map[x].type === 'rd' // filter out all the spaces that are not roads
      })
      nearbys.forEach(id => { // for each space not filtered out
        list.push(id)
        tree[step + 1].push({id: id, prevId: branch.id}) // add it to the array for the next step in the tree
      })
    }
  }
  return searchRoutes(end, list, tree) // rerun the function until the route has been found
}


/* function drawRoute (fromId, toId) {
  const arr = getRoute(fromId, toId)
  arr.forEach(id => {
    let div = document.createElement('div')
    div.style.width = (g.tileDimension / 2) + 'px'
    div.style.height = (g.tileDimension / 2) + 'px'
    div.style.left = (g.arrays.map[id].xpos * g.tileDimension + g.border + g.tileDimension / 4) + 'px'
    div.style.top = (g.arrays.map[id].ypos * g.tileDimension + g.border + g.tileDimension / 4) + 'px'
    div.style['background-color'] = 'black'
    div.style.position = 'absolute'
    document.getElementById('main').appendChild(div)
  })
} */
