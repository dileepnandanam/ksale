import React, { useEffect, useState } from "react";
import AdminApi from "./AdminApi";
import JobTagManage from "./JobTagManage";
import "./Tagmanager.css";

const JobManage = () => {
  const [jobs, setJobs] = useState([])
  const [jobsView, setJobsView] = useState([])

  useEffect(() => {
    const get = async () => {
      const result = await AdminApi.getJobs()
      setJobs(result)
    }
    get()
  }, [])

  return(
    <div>
      <h2 style={{ width: "100%", padding: "12px", border: "1px solid grey", marginBottom: "8px" }}>
        Ksale Jobs List ({jobs.length})
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
      {val.length > 0 && <button style={{ marginRight: "12px", display: "inline-block" }} onClick={save} >Save</button>}
      <button style={{ marginRight: "12px", display: "inline-block" }} onClick={() => setManaging(!managing)} >manage tags</button>
      {managing && <JobTagManage job={job} />}
    </div>
  )
}

const NewJob = ({ setJobs }) => {
  const [val, setVal] = useState("")
  const save = async () => {
    const result = await AdminApi.createJob({}, {name: val.toLowerCase()})
    setVal("")
    setJobs((prev) => [result.data, ...prev])
  }

  const [existing, setExisting] = useState([])

  const fetchExisting = async (value) => {
    if ((value || "").length < 2) {
      setExisting([])
      return
    }

    const results = await AdminApi.searchJobs({}, value)
    if (results)
      setExisting(results)
    else
      setExisting([])
  }

  useEffect(() => {
    fetchExisting(val)
  }, [val])
  return(
    <div style={{ width: "100%", padding: "12px", border: "1px solid grey", marginBottom: "8px" }}>
      <div style={{ marginRight: "12px", display: "inline-block" }}>new job name</div>
      <input style={{ marginRight: "12px", display: "inline-block" }} onChange={(e) => setVal(e.target.value)} value={val} />
      {val.length > 0 && <button style={{ marginRight: "12px", display: "inline-block" }} onClick={save} >create</button>}
      {existing.length > 0 && 
        <>
          <h4>Similar jobs added</h4>
          {
            existing.map((e, idx) => (
              <div key={idx} style={{ display: "block" }}>
                {e.tag} ({e.name})
              </div>
            ))
          }
        </>
      }
    </div>
  )
}

export default JobManage;