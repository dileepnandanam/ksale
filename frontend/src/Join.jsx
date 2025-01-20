import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import AdminApi from "./AdminApi";

const Join = () => {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [selectedJob, setSelectedJob] = useState()
  const [jobs, setJobs] = useState([])
  const [jobKey, setJobKey] = useState("")

  const getJobs = async (jobKey) => {
    if (!jobKey) {
      setJobs([])
      return
    }

    const results = await AdminApi.promptJobs({}, jobKey)
    if (results)
      setJobs(results)
    else
      setJobs([])
  }

  return(
    <div style={{ width: "100%", backgroundImage: "radial-gradient(#dcebdc, #cfcfeb, #e4bed7)", backgroundSize: "200%", height: "100vh" }}>
      <div style={{ width: "100%", display: "block", padding: "20px 0px", borderBottom: "1px solid blue" }}>
        <div style={{ textAlign: "center", fontSize: "20px", display: "block", width: "80%", margin: "auto" }}>
          Welcome, Fill your work details
        </div>
      </div>

      <div style={{ width: "100%", display: "block" }}>
        <Input
          setVal={setName}
          val={name}
          label="Name"
          labelWidth="35%"
          inputWidth="60%"
        />
        <Input
          setVal={setPhone}
          val={phone}
          label="Phone"
          labelWidth="35%"
          inputWidth="60%"
        />
        <Input
          val={jobKey}
          setVal={(val) => {
            setJobKey(val)
            getJobs(val)
          }}
          label="Job"
          labelWidth="35%"
          inputWidth="60%"
        />

        <div style={{ width: "100%", display: "block" }}>
          {
            jobs.filter((j) => true).map((job) => (
              <div
                className="clickable"
                onClick={() => {
                  if (selectedJob?.id == job.id) {
                    setSelectedJob()
                  } else {
                    setSelectedJob(job)
                  }
                }}
                style={{ display: "block", textAlign: "center", margin: "8px auto", width: "90%", borderRadius: "4px", padding: "8px 18px", background: (job.id == selectedJob?.id ? "blue" : "green"), color: "white" }}>
                {job.name} ({job.tags})
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Join;

const Input = (props) => {
  return(
    <div style={{ display: "inline-block", width: "100%", margin: "4px 0px" }}>
      {
        props.labelWidth &&
        <div style={{ display: "inline-block", width: props.labelWidth, padding: "8px", verticalAlign: "bottom" }}>
          {props.label}
        </div>
      }
      <div style={{ display: "inline-block", width: props.inputWidth }}>
        <input
          style={{ width: "90%" }}
          className="general"
          onChange={(e) => {
            if (props.onChange) {
              props.onChange(e)
            }
            if (props.setVal) {
              props.setVal(e.target.value)
            }
          }}
          value={props.val}
        />
      </div>
    </div>
  )
}