import React from 'react'

export default class ListItem extends React.PureComponent {
  render() {
    let camper = this.props.data[this.props.index]
    return (
      <div
        key={camper.id}
        style={this.props.style}
        className={this.props.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
      >
        {camper.name}
        {camper.sac.sort().map(summer => (
          <span className="badge-summer" key={`${camper.id}-${summer}`}>
            {summer}
          </span>
        ))}
        <span
          style={{
            cursor: 'pointer',
            color: 'rgb(17, 191, 49)',
          }}
          onClick={_ => console.log('foobar')}
        >
          E
        </span>
        <span
          style={{
            cursor: 'pointer',
            color: 'rgb(245, 18, 18)',
          }}
          onClick={_ => console.log('foobar')}
        >
          D
        </span>
        {/*<span className={`rank-badge ${camper.rank.toLowerCase()}`}>
          {camper.rank}
        </span>*/}
      </div>
    )
  }
}
