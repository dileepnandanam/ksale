import axios from "axios"
const url = (path) => {
  return `${import.meta.env.VITE_API_URL}/api/${path}`
}

class Api {
  static async createUser(creds, params) {
    const results = await axios.post(url("users"), params)
    return results.data
  }

  static async searchUsers(creds, params) {
    const results = await axios.get(url("users"), {
      params: {
        key: params
      }
    })
    return results.data
  }
}

export default Api;