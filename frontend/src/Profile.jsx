import { useContext, useState, useEffect } from "react";
import { Input } from "./Join";
import { Link, Navigate } from "react-router";
import AdminApi from "./AdminApi";
import Api from "./Api";
import lodash from "lodash";
import { UserContext } from "./App";
import { Nav } from "./Join";
import { useNavigate } from "react-router";

const Profile = () => {
  const user = useContext(UserContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [jobKey, setJobKey] = useState("");
  const [updated, setUpdated] = useState(false);
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

  const getUser = async () => {
    const result = (await Api.getUserProfile(user.Current().ID)).data
    setName(result.name)
    setPhone(result.phone)
    setCode(result.code)
    setSelectedJobs((result.jobs || []))
  }

  const updateAcc = async () => {
    try {
      const results = await Api.updateUser({}, {
        name: name,
        country_code: "+91",
        phone: Number(phone),
        job_ids: selectedJobs.map((j) => j.id),
      }, user.Current().ID)
      if (results.success) {
        setUpdated(true)
        setErrors()
      } else {
        setErrors(results.message)
      }
    } catch(e) {}
  }

  let navigate = useNavigate()

  useEffect(() => { getUser() }, [])
  useEffect(() => {

    if (updated) {
      user.setOnetimeMessage({ text: "Account Updated.", type: "success", timeout: 3000 })
      navigate("/")
    }
  }, [updated])

  return(
    <div style={{ fontSize: "22px", width: "100%", backgroundSize: "200%", height: "100vh" }}>
      <div style={{ width: "100%", display: "block", background: "rgb(95 36 19)", boxShadow: "4px 5px 6px #260a05" }}>
        <Nav />
      </div>
      <div style={{ width: "100%", display: "block", padding: "20px 0px", borderBottom: "1px solid blue", padding: "12px" }}>
        <div style={{ textAlign: "center", fontSize: "25px", display: "block", width: "80%", margin: "auto" }}>
          Edit your work details
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

      <div style={{ width: "100%", display: (canGetOtp ? "none" : "block"), padding: "12px" }}>
        <Input
          disabled={true}
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

        <div style={{ width: "100%", display: "block", marginTop: "20px" }}>
          {
            (lodash.uniqBy([...selectedJobs, ...jobs], (j) => j.id)).filter((j) => true).map((job) => (
              <div
                className="clickable"
                onClick={() => {
                  if (!selectedJobs.find(selected => selected.id == job.id)) {
                    setSelectedJobs((jobs) => [job, ...jobs])
                  } else {
                    setSelectedJobs((jobs) => jobs.filter((j) => j.id != job.id))
                  }
                }}
                style={{ borderBottom: "1px solid black", display: "block", textAlign: "center", margin: "0px auto", width: "90%", borderRadius: "0px", padding: "4px 18px", background: (selectedJobs.find(selected => selected.id == job.id) ? "blue" : "green"), color: "white" }}>
                {job.name} ({job.tags})
              </div>
            ))
          }
        </div>
        {
          name && selectedJobs.length > 0 &&
          <div style={{ boxSizing: "border-box", margin: "12px 12px", display: "block" }}>
            <div
              onClick={updateAcc}
              className="btn"
            >
              Update
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Profile;
