import React, { useEffect, useState } from "react";
import AdminApi from "./AdminApi";

const JobTagManage = ({ job }) => {
  const [tags, setJobTags] = useState([])

  useEffect(() => {
    const get = async () => {
      const result = await AdminApi.getJobTags({}, job.id)
      setJobTags(result)
    }
    get()
  }, [])

  return(
    <div style={{display: "block"}}>
      <h3 style={{ width: "100%", padding: "12px", margin: "8px", display: "block" }}>
        Job Tags
      </h3>
      <NewJobTag setJobTags={setJobTags} job={job} />
      {
        tags.map((tag, i) => (
          <JobTag key={`tag-${tag.id}`} tag={tag} />
        ))
      }
    </div>
  )
}

const JobTag = ({ tag }) => {
  const [val, setVal] = useState(tag.tag)
  const save = async () => {
    const result = await AdminApi.updateJobTag({}, tag.id, {tag: val})
  }
  return(
    <div style={{ width: "100%", padding: "12px", margin: "8px", display: "block" }}>
      <div style={{ marginRight: "12px", display: "inline-block" }}>tag name</div>
      <input style={{ marginRight: "12px", display: "inline-block" }} onChange={(e) => setVal(e.target.value)} value={val} />
      {val.length > 0 && <button style={{ marginRight: "12px", display: "inline-block" }} onClick={save} >Save</button>}
    </div>
  )
}

const NewJobTag = ({ setJobTags, job }) => {
  const [val, setVal] = useState("")
  const save = async () => {
    const result = await AdminApi.createJobTag({}, {job_id: job.id, tag: val.toLowerCase()})
    setVal("")
    setJobTags((prev) => [result.data, ...prev])
  }
  return(
    <div style={{ width: "100%", padding: "12px", margin: "8px", display: "block" }}>
      <div style={{ marginRight: "12px", display: "inline-block" }}>new tag name</div>
      <input style={{ marginRight: "12px", display: "inline-block" }} onChange={(e) => setVal(e.target.value)} value={val} />
      {val.length > 0 && <button style={{ marginRight: "12px", display: "inline-block" }} onClick={save} >create</button>}
    </div>
  )
}

export default JobTagManage;