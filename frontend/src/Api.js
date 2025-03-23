import axios from "axios"
const url = (path) => {
  return `${import.meta.env.VITE_API_URL}/api/${path}`
}

class Api {
  static async createUser(creds, params) {
    const results = await axios.post(url("users"), params)
    return results.data
  }

  static async activateUser(id, params) {
    const results = await axios.put(url("users/" + id + "/activate"), params)
    return results.data
  }

  static async searchUsers(creds, key, lat, lng) {
    const results = await axios.get(url("users"), {
      params: {
        key: key,
        lat: lat,
        lng: lng,
      }
    })
    return results.data
  }

  static async otpUser(phone, code) {
    const results = await axios.put(url("users/getotp"), {
      phone: phone,
      country_code: code,
    })
    return results.data
  }

  static async loginUser(id, otp) {
    const results = await axios.put(url(`users/login`), {
      id: id,
      otp: otp
    })
    return results.data
  }

  static async locateUser(id, coords) {
    const results = await axios.put(url(`users/locate`), {
      id: id,
      ...coords
    })
    return results.data
  }
}

export default Api;