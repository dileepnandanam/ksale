import React, { useEffect, useState } from "react";
import AdminApi from "./AdminApi";
import JobTagManage from "./JobTagManage";

const JobManage = () => {
  const [jobs, setJobs] = useState([])

  useEffect(() => {
    const get = async () => {
      const result = await AdminApi.getJobs()
      setJobs(result.data)
    }
    get()
  }, [])

  return(
    <div>
      <h2 style={{ width: "100%", padding: "12px", border: "1px solid grey", marginBottom: "8px" }}>
        Jobs
      </h2>
      <NewJob setJobs={setJobs} />
      {
        jobs.map((job, i) => (
          <Job key={`job-${job.id}`} job={job} />
        ))
      }
    </div>
  )
}

const Job = ({ job }) => {
  const [val, setVal] = useState(job.name)
  const [managing, setManaging] = useState(false)
  const save = async () => {
    const result = await AdminApi.updateJob({}, job.id, {name: val})
  }
  return(
    <div style={{ width: "100%", padding: "12px", border: "1px solid grey", marginBottom: "8px" }}>
      <div style={{ marginRight: "12px", display: "inline-block" }}>job name</div>
      <input style={{ marginRight: "12px", display: "inline-block" }} onChange={(e) => setVal(e.target.value)} value={val} />
      <button style={{ marginRight: "12px", display: "inline-block" }} onClick={save} >Save</button>
      <button style={{ marginRight: "12px", display: "inline-block" }} onClick={setManaging} >manage tags</button>
      {managing && <JobTagManage job={job} />}
    </div>
  )
}

const NewJob = ({ setJobs }) => {
  const [val, setVal] = useState("")
  const save = async () => {
    const result = await AdminApi.createJob({}, {name: val})
    setVal("")
    setJobs((prev) => [result.data, ...prev])
  }
  return(
    <div style={{ width: "100%", padding: "12px", border: "1px solid grey", marginBottom: "8px" }}>
      <div style={{ marginRight: "12px", display: "inline-block" }}>job name</div>
      <input style={{ marginRight: "12px", display: "inline-block" }} onChange={(e) => setVal(e.target.value)} value={val} />
      <button style={{ marginRight: "12px", display: "inline-block" }} onClick={save} >create</button>
    </div>
  )
}

export default JobManage;