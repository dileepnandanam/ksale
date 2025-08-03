import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, Navigate } from "react-router";
import Api from "./Api";
import phone from "./assets/phone.png";
import { UserContext } from "./App";
import LocateButton from "./LocateButton";
import { debounce } from "lodash";

const Home = ({ located, setLocated }) => {
  const user = useContext(UserContext);

  const [locError, setLocError] = useState("");
  const [locating, setLocating] = useState(false);

  const search = useCallback(debounce(async (key) => {

    if (!key) {
      setUsers(defaults)
      return
    }

    const lat = localStorage.getItem("latitude")
    const lng = localStorage.getItem("longitude")

    if (lat && lng) {
      const results = await Api.searchUsers({}, key, lat, lng);
      setUsers(results.data || []);
    } else {
      setUsers(defaults);
    }
  }, 500), [])

  const defaults = []
  const defaultss = [{
    name: "Police",
    phone: 100,
    tags: "emergency"
  }, {
    name: "Fire Force",
    phone: 101,
    tags: "emergency"
  }, {
    name: "Ambulance",
    phone: 108,
    tags: "emergency"
  }]
  const [users, setUsers] = useState(defaults);
  const [askLoc, setAskLoc] = useState(!localStorage.getItem("latitude"))
  const [key, setKey] = useState("");

  return(
    <div style={{ fontSize: "22px", width: "100%", backgroundSize: "200%", minHeight: "100vh" }}>
      <div style={{ width: "100%", display: "block", padding: "20px 0px", background: "rgb(95 36 19)", boxShadow: "4px 5px 6px #260a05" }}>
        <div style={{ display: "inline-block", width: "75%", paddingLeft: "20px" }}>
          <input placeholder="Search workers" value={key} onChange={(e) => { setKey(e.target.value); search(e.target.value)}} style={{ borderRadius: "6px", verticalAlign: "bottom", height: "42px", display: "block", margin: "auto", width: "90%", border: "1px solid #d0cfeb", outline: "none", padding: "4px 8px", fontSize: "22px" }} />
        </div>
        <div style={{ display: "inline-block", width: "23%", padding: "10px", fontSize: "30px", fontWeight: "bold" }}>
          Ksale
        </div>
      </div>

      {
        located == false && <div style={{ display: "block", borderRadius: "8px", padding: "12px", background: "#501b22", margin: "12px" }}>
          <div style={{ width: "100%", textAlign: "center", marginBottom: "12px" }}>
            We need current location to search nearby workers
          </div>
          <LocateButton className="btn" setLocating={setLocating} onError={(message) => setLocError(message || "Could not locate. Allow access to location.")} onOk={() => setLocated(true)}>
            {
              locating && "Locating" || (localStorage.getItem("latitude") ? "Update Location" : "Locate Me")
            }
          </LocateButton>
          {
            locError && <div style={{ width: "100%", display: "block", textAlign: "center", color: "red", padding: "12px" }}>{locError}</div>
          }
        </div>
      }

      <div style={{ display: "block", width: "100%", padding: "12px" }}>
        {
          users.map((user) => (
            <div style={{ position: "relative", display: "block", width: "100%", borderRadius: "8px", marginBottom: "12px", padding: "8px", background: "#62362a", boxShadow: "4px 5px 6px #260a05" }}>
              <div style={{ float: "left", position: "relative", display: "inline-block", width: "70px", height: "70px", padding: "10px" }}>
                <div style={{ padding: "3px 0px 0px 16px", fontWeight: "bold", fontSize: "28px", height: "100%", width: "100%", borderRadius: "50%", background: "#000", color: "white" }}>
                  {user.name[0].toUpperCase()}
                </div>
              </div>
              <div style={{ display: "inline-block", width: "70%", float: "left", color: "white" }}>
                <div style={{ display: "block", width: "100%" }}>
                  {user.name}
                </div>
                <div style={{ display: "block", width: "100%" }}>
                  {(user.tags || "").split(", ").map((tag) => (
                    <div
                      onClick={async () => {
                        if (tag != "emergency") {
                          setKey(tag);
                          await search(tag);
                        }
                      }}
                      style={{ fontSize: "18px", display: "inline-block", float: "left", paddingRight: "8px", margin: "3px 8px 0px 0px", borderRadius: "4px" }}
                    >
                      {tag}
                    </div>
                  ))}
                  <div style={{ clear: "both" }} />
                </div>
              </div>
              <a href={"tel:" + user.phone} style={{ position: "absolute", right: "0", top: "6px", fontSize: "30px", textDecoration: "none", display: "inline-block", width: "50px", height: "50px", padding: "14px 0px 14px 18px", float: "right" }}>
                <img src={phone} style={{ width: "60%" }} />
              </a>
              <div style={{ clear: "both" }} />
            </div>
          ))
        }
      </div>
      {
        (user && user.Current()?.ID) && <>
          <div
            onClick={() => {
              user.Unset();
              user.setOnetimeMessage({ text: "Log out successfull.", type: "success", timeout: 3000 })
            }}
            className="btn"
          >
            Log Out
          </div>
          <Link to="profile" className="btn" >
            Account
          </Link>
        </> || <>
          <Link to="/join" style={{ textDecoration: "none" }}>
            <div className="btn" >
              Join to get Work +
            </div>
            <div style={{ clear: "both" }} />
          </Link>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <div className="btn" >
              Login
            </div>
            <div style={{ clear: "both" }} />
          </Link>
        </>
      }
    </div>
  )
}

export default Home;