import usersList from '../userslist.json'
import channelsList from '../channelslist.json'
import teamInfo from '../teaminfo.json'

export const allUsers = usersList.members.filter((user) => {
  // Remove deleted users and bot users
  return user.deleted === false && user.is_bot === false
}).map((user) => {
  return {
    name: user.name,
    real_name: user.real_name,
    icon: user.profile.image_1024 || user.profile.image_512 || user.profile.image_192,
    id: user.id
  }
})

export const allUsersList = allUsers.map((user) => {
  return `@${user.name}${ user.real_name ? ` (${user.real_name})` : '' }`
})

export const allChannels = channelsList.channels.filter((channel) => {
  // Remove channels without members
  return channel.num_members !== 0
}).map( (channel) => {
  return {
    name: channel.name,
    members: channel.members,
    purpose: channel.purpose.value,
    num_members: channel.num_members,
    id: channel.id
  }
})

export const allChannelsList = allChannels.map((channel) => {
  return `#${channel.name} (${channel.num_members}) ${ channel.purpose ? ` (${channel.purpose})` : '' }`
})

export const icon = teamInfo.team.icon.image_original || teamInfo.team.icon.image_230 || teamInfo.team.icon.image_132

export const name = teamInfo.team.name

export const domain = teamInfo.team.domain
