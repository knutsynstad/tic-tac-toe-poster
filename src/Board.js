import React from 'react'

class Circle extends React.Component {
  render() {
    return <use xlinkHref="#circle" x={this.props.x}  y={this.props.y} /> 
  }
}

class Cross extends React.Component {
  render() {
    return <use xlinkHref="#cross" x={this.props.x}  y={this.props.y} />
  }
}

class Cell extends React.Component {
  render() {
    const symbol = this.props.symbol;
    if (symbol === "X") {
      return <Cross {...this.props} />;
    } else if (symbol === "O") {
        return <Circle {...this.props} />;
    } else {
      return null
    }
  }
}

class Background extends React.Component {
  render() {
    if (this.props.result === "draw") {
      return <rect width="45" height="45" stroke="none" fill={this.props.color} opacity="0.1" />;
    } else {
      return null
    }
  }
}


class WinHighlight extends React.Component {
  render() {
    let elements = []

    let pos = [
      [0,0],
      [15,0],
      [30,0],
      [0,15],
      [15,15],
      [30,15],
      [0,30],
      [15,30],
      [30,30]
    ]

    for (let i = 0; i < this.props.wincells.length; i++) {
      elements.push(<rect x={pos[this.props.wincells[i]][0]} y={pos[this.props.wincells[i]][1]} width="15" height="15" stroke="none" fill={this.props.color} opacity="0.1" />)
    }

    return (<g>{elements}</g>)
  }
}


class Board extends React.Component {

  getColor(symmetries) {
    if (symmetries.includes("rotational")
      && symmetries.includes("reflectional")) {
      return "#EC008B"
    } else if (symmetries.includes("rotational")) {
      return "#00ADEF"
    } else if (symmetries.includes("reflectional")) {
      return "#00A550"
    } else {
      return "#000000"
    }
  }


  render() {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 45 60" width="45" height="60" x={this.props.x} y={this.props.y}>
        <defs>
          <circle id="circle" cx="7.5" cy="7.5" r="2.5" stroke="inherit" strokeWidth="1" fill="none" />
          <g id="cross" stroke="inherit" strokeWidth="1" >
            <line x1="5" y1="5" x2="10" y2="10" />
            <line x1="5" y1="10" x2="10" y2="5" />
          </g>
        </defs>

        <g klass="cells" stroke={this.getColor(this.props.symmetries)}>
          {/* Row 1 */}
          <Cell symbol={this.props.cells[0]} x="0" y="0" />
          <Cell symbol={this.props.cells[1]} x="15" y="0" />
          <Cell symbol={this.props.cells[2]} x="30" y="0" />

          {/* Row 2 */}
          <Cell symbol={this.props.cells[3]} x="0" y="15" />
          <Cell symbol={this.props.cells[4]} x="15" y="15" />
          <Cell symbol={this.props.cells[5]} x="30" y="15" />

          {/* Row 3 */}
          <Cell symbol={this.props.cells[6]} x="0" y="30" />
          <Cell symbol={this.props.cells[7]} x="15" y="30" />
          <Cell symbol={this.props.cells[8]} x="30" y="30" />
        </g>

        {/* Board */}
        <g klass="board" stroke={this.getColor(this.props.symmetries)} strokeWidth="1" opacity="0.2">
          <line x1="15" y1="0" x2="15" y2="45" />
          <line x1="30" y1="0" x2="30" y2="45" />
          <line x1="0" y1="15" x2="45" y2="15" />
          <line x1="0" y1="30" x2="45" y2="30" />
        </g>

        {/* Background for draws */}
        <Background {...this.props} color={this.getColor(this.props.symmetries)} />

        {/* Cell backgrounds for wins */}
        <WinHighlight {...this.props} color={this.getColor(this.props.symmetries)} />

        {/* Label */}
        <text
          fontFamily="helvetica"
          fontSize="7.5"
          x="0"
          y="55"
          width="45"
          height="30">{this.props.path}</text> 

      </svg>
    )
  }
}

export default Board
