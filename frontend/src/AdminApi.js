import axios from "axios"
const url = (path) => {
  return `${import.meta.env.VITE_API_URL}/api/${path}`
}

class AdminApi {
  static async getJobs(creds, params) {
    const results = await axios.get(url("jobs"))
    return results
  }

  static async updateJob(creds, id, params) {
    const results = await axios.put(url(`jobs/${id}`), params)
    return results
  }

  static async createJob(creds, params) {
    const results = await axios.post(url(`jobs`), params)
    return results.data
  }

  static async getJobTags(creds, job_id, params) {
    const results = await axios.get(url(`jobs/${job_id}/job_tags`))
    return results
  }

  static async updateJobTag(creds, id, params) {
    const results = await axios.put(url(`job_tags/${id}`), params)
    return results
  }

  static async createJobTag(creds, params) {
    const results = await axios.post(url(`job_tags`), params)
    return results.data
  }
}

export default AdminApi;