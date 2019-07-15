import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Board';
import boards from './boards.json'

// Split into levels so I can inject a placeholder for the level dividers
let levels = [[],[],[],[],[],[],[],[],[],[]]
// Add one level divider per level
levels.forEach(level => {
  level.push(false)
})
// Sort boards by level
boards.forEach(d => {
  levels[d.level].push(d)
})

// Collapse array
let data = [].concat.apply([], levels)
let columns = 29


let idToPos = {}

// Assign position within matrix
for (let i = 0; i < data.length; i++) {
  if (data[i]) {
    let column = i % columns
    let row = Math.floor(i / columns)
    data[i].pos = i
    data[i].column = column
    data[i].row = row
    data[i].winCells = getWinCells(data[i].cells)
    idToPos[data[i].id] = i
  }
}

function groupArray(a) {
  const ret = [];
  if (!a.length) return ret;
  let ixf = 0;
  for (let ixc = 1; ixc < a.length; ixc += 1) {
    if (a[ixc] !== a[ixc-1] + 1) {
      ret.push(a.slice(ixf, ixc));
      ixf = ixc;  
    }
  }
  ret.push(a.slice(ixf, a.length));
  return ret;
}

function getColumn(x) {
  if (x < 26) {
    return String.fromCharCode(97 + x)
  } else {
    return "a" + String.fromCharCode(97 + (x) - 26)
  }
}

function getWinCells(cells) {
    let winCells = []
    let winLines = [
      [0,1,2], // Row 1
      [3,4,5], // Row 2
      [6,7,8], // Row 3
      [0,3,6], // Column 1
      [1,4,7], // Column 2
      [2,5,8], // Column 3
      [0,4,8], // Top left to bottom right
      [6,4,2]  // Bottom left to top right
    ]

    for (let line = 0; line < winLines.length; line++) {
      let rule = winLines[line]
      if  (cells[rule[0]] === cells[rule[1]]
        && cells[rule[0]] === cells[rule[2]]
        && cells[rule[0]] !== "E") {
        winCells.push(...winLines[line])
      }
    }

    // Dedupe wincells
    let unique = [...new Set(winCells)]
    return unique
}


function getCoordinates(index, cols) {
  let column = index % cols
  let row = Math.floor(index / cols) + 1
  return `${getColumn(column)}${row}`
}

for (let i = 0; i < data.length; i++) {
  if (data[i]) {
    let parents = []
    data[i].parents.forEach(parent => {
      parents.push(idToPos[parent])
    })
    parents = parents.sort((a, b) => a - b)
    parents = groupArray(parents)

    let parentString = ""
    parents.forEach(parentGroup => {
      let group = parentGroup
      group = group.sort((a, b) => a - b)
      if (group.length === 1) {
        parentString += getCoordinates(group[0], columns)
        parentString += ", "
      } else if (group.length === 2) {
        parentString += getCoordinates(group[0], columns)
        parentString += ", "
        parentString += getCoordinates(group[1], columns)
        parentString += ", "
      } else if (group.length >= 3) {
        parentString += getCoordinates(group[0], columns)
        parentString += "-"
        parentString += getCoordinates(group[group.length -1], columns)
        parentString += ", "
      }
    })
    parentString = parentString.slice(0, -2)

    let children = []
    data[i].children.forEach(child => {
      children.push(idToPos[child])
    })
    children = children.sort((a, b) => a - b)
    children = groupArray(children)

    let childString = ""
    children.forEach(childGroup => {
      let group = childGroup
      group = group.sort((a, b) => a - b)
      if (group.length === 1) {
        childString += getCoordinates(group[0], columns)
        childString += ", "
      } else if (group.length === 2) {
        childString += getCoordinates(group[0], columns)
        childString += ", "
        childString += getCoordinates(group[1], columns)
        childString += ", "
      } else if (group.length >= 3) {
        childString += getCoordinates(group[0], columns)
        childString += "-"
        childString += getCoordinates(group[group.length -1], columns)
        childString += ", "
      }
    })

    childString = childString.slice(0, -2)

    let path = `${parentString} • ${childString}`
    path = path.toUpperCase()
    data[i].path = path
  }
}

class Poster extends React.Component {
  render() {
    var elements=[]
    for (let i = 0; i < data.length; i++) {
      let board = data[i]
        if (board) {
          elements.push(
            <Board
              x={board.column * 60}
              y={board.row * 75}
              key={board.id}
              cells={board.cells}
              symmetries={board.symmetries}
              result={board.result}
              path={board.path}
              wincells={board.winCells} />
          )
        }
    }

    return (<g>{elements}</g>)
  }
}

ReactDOM.render(<Poster/>, document.getElementById('root'));