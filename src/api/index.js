import axios from 'axios'

const baseDomain = 'https://sp0tify.herokuapp.com', method = 'POST'


export const getToken = () => {
  return window.sessionStorage.getItem("auth")
}

export const deleteToken = () => {
  window.sessionStorage.removeItem("auth")
}

export const createAccount = async (userName) => {
  return await axios({
    url: `${baseDomain}/post/createaccount`,
    method,
    data: { userName },
    headers: { Authorization: `Bearer ${ getToken() }` }
  })
}

export const runSearch = async (query) => {
  return await axios({
    url: `${baseDomain}/post/runsearch`,
    method,
    data: { query }
  })
}

export const getArtist = async (name) => {
  return await axios({
    url: `${baseDomain}/post/getartist`,
    method,
    data: { name }
  })
}

export const getPlaylist = async (name) => {
  return await axios({
    url: `${baseDomain}/post/getplaylist`,
    method,
    data: { name }
  })
}

export const addTrackToPlaylist = async (name, _id) => {
  return await axios({
    url: `${baseDomain}/post/addtracktoplaylist`,
    method,
    data: { name, _id },
    headers: { Authorization: `Bearer ${ getToken() }` }
  })
}

export const rearrangeTracks = async (name, src, dest) => {
  return await axios({
    url: `${baseDomain}/post/rearrangeplaylist`,
    method,
    data: { name, sp: [src, dest] }
  })
}

export const createPlaylist = async (name, base64, userName) => {
  return await axios({
    url: `${baseDomain}/post/createplaylist`,
    method,
    data: { name, base64, userName },
    headers: { Authorization: `Bearer ${ getToken() }` }
  })
}

export const getMyPlaylists = async (userName) => {
  return await axios({
    url: `${baseDomain}/post/getmyplaylists`,
    method,
    data: { userName },
    headers: { Authorization: `Bearer ${ getToken() }` }
  })
}

export const deleteTrackFromPlaylist = async (name, _id) => {
  return await axios({
    url: `${baseDomain}/post/deletetrackfromplaylist`,
    method,
    data: { name, _id },
    headers: { Authorization: `Bearer ${ getToken() }` }
  })
}

export const addPlaylist = async (userName, name) => {
  return await axios({
    url: `${baseDomain}/post/addplaylist`,
    method,
    data: { userName, name },
    headers: { Authorization: `Bearer ${ getToken() }` }
  })
}

export const removePlaylist = async (userName, name) => {
  return await axios({
    url: `${baseDomain}/post/removeplaylist`,
    method,
    data: { userName, name },
    headers: { Authorization: `Bearer ${ getToken() }` }
  })
}
