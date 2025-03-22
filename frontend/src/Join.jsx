import React, { useState, useEffect } from "react";
import { Link, Navigate } from "react-router";
import AdminApi from "./AdminApi";
import Api from "./Api";
import lodash from "lodash";

const Join = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobKey, setJobKey] = useState("");
  const [created, setCreated] = useState(false);;

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

  const createAcc = async () => {
    try {
      const results = await Api.createUser({}, {
        name: name,
        country_code: "+91",
        phone: Number(phone),
        primary_job_id: selectedJobs[0].id,
        secondary_job_id: selectedJobs[1]?.id
      })
      if (results.success) {
        setCreated(true);
      } else {
        setErrors(result.errors)
      }
    } catch(e) {}
  }

  return(
    <div style={{ fontSize: "22px", width: "100%", backgroundImage: "radial-gradient(#dcebdc, #cfcfeb, #e4bed7)", backgroundSize: "200%", height: "100vh" }}>
      {
        created && <Navigate to="/" />
      }
      <div style={{ width: "100%", display: "block", padding: "20px 0px", borderBottom: "1px solid blue", padding: "12px" }}>
        <div style={{ textAlign: "center", fontSize: "25px", display: "block", width: "80%", margin: "auto" }}>
          Welcome, Fill your work details
        </div>
      </div>

      <div style={{ width: "100%", display: "block", padding: "12px" }}>
        <Input
          isvalid={phone?.length == 10 && phone?.toLowerCase() == phone?.toUpperCase()}
          setVal={setPhone}
          prefix="+91"
          val={phone}
          label="Phone"
          labelWidth="35%"
          prefixWidth="15%"
          inputWidth="45%"
        />
        <Input
          isvalid={name?.length > 3}
          setVal={setName}
          val={name}
          label="Name"
          labelWidth="35%"
          inputWidth="60%"
        />
        <Input
          isvalid={true}
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
            (lodash.uniqBy([...selectedJobs, ...jobs], (j) => j.id)).filter((j) => true).map((job) => (
              <div
                className="clickable"
                onClick={() => {
                  if (selectedJobs.length > 1) {
                    setSelectedJobs((jobs) => jobs.filter((j) => j.id != job.id))
                    return
                  }
                  if (!selectedJobs.find(selected => selected.id == job.id)) {
                    setSelectedJobs((jobs) => [job, ...jobs])
                  } else {
                    setSelectedJobs((jobs) => jobs.filter((j) => j.id != job.id))
                  }
                }}
                style={{ display: "block", textAlign: "center", margin: "8px auto", width: "90%", borderRadius: "4px", padding: "8px 18px", background: (selectedJobs.find(selected => selected.id == job.id) ? "blue" : "green"), color: "white" }}>
                {job.name} ({job.tags})
              </div>
            ))
          }
        </div>
        {
          name && phone && selectedJobs.length > 0 &&
          <div style={{ boxSizing: "border-box", margin: "12px 12px", display: "block" }}>
            <button
              onClick={createAcc}
              style={{ height: "50px", border: "none", fontSize: "23px", width: "100%", borderRadius: "12px", background: "green", color: "white", padding: "4px 8px" }}
            >
              Create Account
            </button>
          </div>
        }
      </div>
    </div>
  )
}

export default Join;

const Input = (props) => {
  return(
    <div style={{ display: "inline-block", width: "100%", margin: "4px 0px" }}>
      {
        props.label &&
        <div style={{ fontSize: "22px", display: "inline-block", width: props.labelWidth, padding: "8px", verticalAlign: "bottom" }}>
          {props.label}
        </div>
      }
      {
        props.prefix &&
        <div style={{ fontSize: "22px", display: "inline-block", width: props.prefixWidth, padding: "8px", verticalAlign: "bottom" }}>
          {props.prefix}
        </div>
      }
      <div style={{ display: "inline-block", width: props.inputWidth }}>
        <input
          style={{ border: (props.isvalid ? "1px solid black" : "2px solid red"), fontSize: "22px", width: "100%" }}
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