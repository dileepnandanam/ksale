import React, { useState, useEffect, useContext } from "react";
import { Link, Navigate } from "react-router";
import AdminApi from "./AdminApi";
import Api from "./Api";
import lodash from "lodash";
import { UserContext } from "./App";
import { btnStyle, textRegular } from "./tailcss";

export const Nav = () => {
  return(
    <div className="bg-green-800" style={{ display: "block", padding: "6px" }}>
      <Link style={{ textDecoration: "none" }} to="/">
        <div style={{ float: "right", textDecoration: "none", padding: "8px", color: "white", fontSize: "30px", fontWeight: "bold" }}>
          Ksale
        </div>
      </Link>
      <div style={{ clear: "both" }} />
    </div>
  )
}

export const Login = () => {
  const user = useContext(UserContext);
  const [phone, setPhone] = useState("");
  const [canGetOtp, setCanGetOtp] = useState();
  const [otp, setOtp] = useState();
  const [loged, setLoged] = useState();
  const [errors, setErrors] = useState();

  const getotp = async () => {
    try {
      const results = await Api.otpUser(Number(phone), "+91")
      if (results.success) {
        setCanGetOtp(results.data);
        setErrors()
      } else {
        setErrors(results.message)
      }
    } catch(e) {}
  }

  const login = async () => {
    try {
      const results = await Api.loginUser(canGetOtp.ID ,Number(otp))
      if (results.success) {
        setLoged(true)
        setErrors()
        user.Set(results.data)
        user.setOnetimeMessage({ text: "Log in successfull.", type: "success", timeout: 3000 })
      } else {
        setErrors(results.message)
      }
    } catch(e) {}
  }

  return(
    <div style={{ fontSize: "22px", width: "100%", backgroundSize: "200%", height: "100vh" }}>
      <Nav />
      {
        loged && <Navigate to="/" />
      }
      <div style={{ width: "100%", display: "block", padding: "20px 0px", borderBottom: "1px solid blue", padding: "12px" }}>
        <div style={{ textAlign: "center", fontSize: "25px", display: "block", width: "80%", margin: "auto" }}>
          Welcome
        </div>
      </div>

      <div style={{ display: (errors ? "block" : "none"), width: "100%", padding: "12px", color: "red", background: "lightblue" }}>
        {
          errors && ({
            phone_not_found: "Phone number not registered!",
            invalid_otp: "Invalid OTP!"
          })[errors]
        }
      </div>

      <div style={{ width: "100%", display: (canGetOtp ? "none" : "block"), padding: "12px" }}>
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
        <div style={{ boxSizing: "border-box", margin: "12px 12px", display: "block" }}>
            <div
              onClick={getotp}
              className={`clickable ${btnStyle}`}
            >
              Get OTP
            </div>
          </div>
      </div>

      <div style={{ width: "100%", display: (canGetOtp ? "block" : "none"), padding: "12px" }}>
        <Input
          isvalid={otp?.length == 4}
          setVal={setOtp}
          val={otp}
          label="OTP"
          labelWidth="35%"
          inputWidth="60%"
        />
        <div style={{ boxSizing: "border-box", margin: "12px 12px", display: "block" }}>
            <div
              onClick={login}
              className={`clickable ${btnStyle}`}
            >
              Login
            </div>
          </div>
      </div>
    </div>
  )

}

const Join = () => {
  const user = useContext(UserContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobKey, setJobKey] = useState("");
  const [created, setCreated] = useState(false);
  const [canGetOtp, setCanGetOtp] = useState();
  const [otp, setOtp] = useState();
  const [errors, setErrors] = useState();

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
        job_ids: selectedJobs.map((j) => j.id),
      })
      if (results.success) {
        setCanGetOtp(results.data);
        setErrors()
        user.setOnetimeMessage({ text: "Sending OTP to your mobile number.", type: "success", timeout: 3000 })
      } else {
        setErrors(results.message)
      }
    } catch(e) {}
  }

  const activateAcc = async () => {
    try {
      const results = await Api.activateUser(canGetOtp.ID, {
        otp: Number(otp)
      })
      if (results.success) {
        setCreated(true);
        setErrors()
        user.Set(results.data)
        user.setOnetimeMessage({ text: "Account Created.", type: "success", timeout: 3000 })
      } else {
        setErrors(results.message)
      }
    } catch(e) {}
  }

  return(
    <div style={{ fontSize: "22px", width: "100%", backgroundSize: "200%", height: "100vh" }}>
      {
        created && <Navigate to="/" />
      }
      <Nav />
      <div style={{ width: "100%", display: "block", borderBottom: "1px solid blue", padding: "12px" }}>
        <div style={{ textAlign: "center", fontSize: "25px", display: "block", width: "80%", margin: "auto" }}>
          Welcome, Fill your work details
        </div>
      </div>

      <div style={{ display: (errors ? "block" : "none"), width: "100%", padding: "12px", color: "red", background: "lightblue" }}>
        {
          errors && ({
            already_exist: "Phone number already registered! Try login.",
            could_not_activate_user: "Invalid OTP!"
          })[errors]
        }
      </div>

      <div style={{ width: "100%", display: (canGetOtp ? "block" : "none"), padding: "12px" }}>
        <Input
          isvalid={otp?.length == 4}
          setVal={setOtp}
          val={otp}
          label="OTP"
          labelWidth="35%"
          inputWidth="60%"
        />
        <div style={{ boxSizing: "border-box", margin: "12px 12px", display: "block" }}>
            <button
              onClick={activateAcc}
              style={{ height: "50px", border: "none", fontSize: "23px", width: "100%", borderRadius: "12px", background: "green", color: "white", padding: "4px 8px" }}
            >
              Activate Account
            </button>
          </div>
      </div>

      <div style={{ width: "100%", display: (canGetOtp ? "none" : "block"), padding: "12px" }}>
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
          placeholder="Search your job"
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

        <div className="mt-4" style={{ width: "100%", display: "block" }}>
          {
            (lodash.uniqBy([...selectedJobs, ...jobs], (j) => j.id)).filter((j) => true).map((job) => (
              <div
                className={`clickable text-black rounded-lg py-2 ${selectedJobs.find(selected => selected.id == job.id) ? "bg-green-500" : "bg-green-100"}`}
                onClick={() => {
                  if (!selectedJobs.find(selected => selected.id == job.id)) {
                    setSelectedJobs((jobs) => [job, ...jobs])
                  } else {
                    setSelectedJobs((jobs) => jobs.filter((j) => j.id != job.id))
                  }
                }}
                style={{ display: "block", textAlign: "center", margin: "0px auto", width: "90%" }}>
                {job.name} ({job.tags})
              </div>
            ))
          }
        </div>
        {
          name && phone && selectedJobs.length > 0 &&
          <div style={{ boxSizing: "border-box", margin: "12px 12px", display: "block" }}>
            <div
              onClick={createAcc}
              className={`clickable ${btnStyle}`}
            >
              Create Account
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Join;

export const Input = (props) => {
  return(
    <div style={{ color: "black", display: "inline-block", width: "100%", margin: "4px 0px" }}>
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
          placeholder={props.placeholder}
          disabled={props.disabled ? "disabled" : ""}
          style={{ fontSize: "22px" }}
          className={`rounded-lg px-4 py-5 w-full outline-1 outline-black-100 ${props.isvalid ? "" : "outline-2 outline-red-500 focus:outline-2 focus:outline-red-500"}`}
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