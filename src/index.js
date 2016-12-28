import React from 'react'
import ReactDOM from 'react-dom'
import { Typeahead } from 'react-typeahead'
import * as Team from './TeamInfo'
import './index.css'

function splitArray(array, count) {
  let newArray = []
  for(let i = 0; i < Math.ceil(array.length / count); i++) {
    var j = i * count
    var p = array.slice(j, j + count)
    newArray.push(p)
  }
  return newArray
}

class SearchBox extends React.Component {
  optionSelected(option) {
    const selectedOption = option.split(' ')[0]
    if ( selectedOption[0] === '@' ) {
      this.props.addUserCard(selectedOption.substr(1))
    } else if ( selectedOption[0] === '#' ) {
      this.props.addChannelUsersCards(selectedOption.substr(1))
    }
    this.refs.typeahead.setState({
      entryValue: '', showResults: true, selectionIndex: 0
    })
  }

  componentDidMount() {
    this.refs.typeahead.focus()
  }

  render() {
    return (
      <Typeahead ref='typeahead'
        placeholder='add a specific user or add members of channel at once'
        options={Team.allUsersList.concat(Team.allChannelsList)}
        onOptionSelected={this.optionSelected.bind(this)}
        customClasses={{ hover: 'typeahead-active' }}
      />
    )
  }
}

class Card extends React.Component {
  onDelete() {
    this.props.delCard(this.props.userId)
  }

  render() {
    return (
      <div className='card'>
        <img className='usericon' alt={this.props.userName} src={this.props.userIcon} />
        <span className='username'>{this.props.userName}</span>
        <span className='realname'>{this.props.realName}</span>
        <img className='teamicon' alt={Team.name} src={this.props.teamIcon} />
        <button onClick={this.onDelete.bind(this)}>x</button>
      </div>
    )
  }
}

class CardList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { users: [] }
  }

  componentDidMount() {
    document.title = `${Team.name} slack cards`
  }

  addUserByPropertyValue(array, property, value) {
    const users = this.removeElementByPropertyValue(array, property, value)
    Team.allUsers.forEach((user) => {
      if (user[property] === value) {
        users.unshift(user)
      }
    })
    return users
  }

  removeElementByPropertyValue(array, property, value) {
    return array.filter((element) => {
      return element[property] !== value
    })
  }

  addUserCard(userName) {
    this.setState({ users: this.addUserByPropertyValue(this.state.users, 'name', userName) })
  }

  addChannelUsersCards(channelName) {
    let newUsers = this.state.users
    Team.allChannels.forEach((channel) => {
      if (channel.name === channelName) {
        channel.members.forEach((userId) => {
          newUsers = this.addUserByPropertyValue(newUsers, 'id', userId)
        })
      }
    })
    this.setState({ users: newUsers })
  }

  delCard(userId) {
    this.setState({ users: this.removeElementByPropertyValue(this.state.users, 'id', userId) })
  }

  render() {
    let usersArray = splitArray(this.state.users, 10)
    let cards = usersArray.map( (users) => {
      let usersSet = users.map( (user) => {
        return (
          <Card
            userName={user.name} realName={user.real_name}
            userIcon={user.icon} userId={user.id}
            key={user.id} teamIcon={Team.icon} delCard={this.delCard.bind(this)}
          />
        )
      })
      return ( <section className='print_page' key={users[0].id} >{usersSet}</section> )
    })
    return (
      <div>
        <SearchBox addUserCard={this.addUserCard.bind(this)} addChannelUsersCards={this.addChannelUsersCards.bind(this)} />
        {cards}
      </div>
    )
  }
}

ReactDOM.render(<CardList />, document.getElementById('root'))
