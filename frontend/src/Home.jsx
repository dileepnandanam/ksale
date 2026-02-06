import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, Navigate } from "react-router";
import Api from "./Api";
import phone from "./assets/phone.png";
import { UserContext } from "./App";
import LocateButton from "./LocateButton";
import { debounce } from "lodash";
import "./assets/styles/base.css";
import bg from "./assets/bg.jpg"
import bg2 from "./assets/bg2.jpeg"
import { btnStyle, textRegular, textWhite } from "./tailcss";

const Home = (props) => {
  return(
    <div style={{ fontSize: "22px", width: "100%", minHeight: "100vh" }} className="inline text-black">
      <div className="main bg-blue-100 h-full" style={{ backgroundImage: `url(${bg2})`, backgroundSize: "cover" }}>
        <div className="w-full h-full" style={{ backgroundImage: "linear-gradient(180deg, black, transparent)", backdropFilter: "blur(2px)", filter: "none" }}>
          <Main {...props} />
        </div>
      </div>
      <div class="ad bg-green-100 h-full" style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}>
        <Ad {...props} />
      </div>
    </div>
  )
}

const Ad = (props) => {
  return("")
}

const Main = ({ located, setLocated }) => {
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
    <div class="max-w-md mx-auto w-full px-4">
      <div class="max-w-md mx-auto w-full">
        <input
          placeholder="Search workers" value={key} onChange={(e) => { setKey(e.target.value); search(e.target.value)}}
          type="search"
          placeholder="Search workers"
          style={{ fontSize: "20px" }}
          className="w-full rounded-lg text-2xl px-8 py-6 mt-6 outline-none focus:outline-none"
        />
      </div>
      {
        located == false && <div className="max-w-md mx-auto">
          <div className={textWhite}>
            We need current location to search nearby workers
          </div>
          <LocateButton className={`clickable ${btnStyle}`} setLocating={setLocating} onError={(message) => setLocError(message || "Could not locate. Allow access to location.")} onOk={() => setLocated(true)}>
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
            <div className="block relative block w-full rounded-8 mb-2 p-2 text-black" style={{ background: "#fff7aeb8" }} >
              <div style={{ float: "left", position: "relative", display: "inline-block", width: "70px", height: "70px", padding: "10px" }}>
                <div style={{ padding: "3px 0px 0px 16px", fontWeight: "bold", fontSize: "28px", height: "100%", width: "100%", borderRadius: "50%", background: "#000", color: "white" }}>
                  {user.name[0].toUpperCase()}
                </div>
              </div>
              <div style={{ display: "inline-block", width: "70%", float: "left" }}>
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
              <a href={"tel:" + user.phone} style={{ position: "absolute", right: "0", top: "10px", fontSize: "30px", textDecoration: "none", display: "inline-block", width: "80px", height: "80px", padding: "14px 0px 14px 18px", float: "right" }}>
                <img src={phone} style={{ width: "60%" }} />
              </a>
              <div style={{ clear: "both" }} />
            </div>
          ))
        }
      </div>
      <div class="max-w-md mx-auto">
        {
          (user && user.Current()?.ID) && <>
            <div
              onClick={() => {
                user.Unset();
                user.setOnetimeMessage({ text: "Log out successfull.", type: "success", timeout: 3000 })
              }}
              className={`clickable ${btnStyle}`}
            >
              Log Out
            </div>
            <Link to="profile" style={{ textDecoration: "none" }}>
              <div className={btnStyle}>
                Account
              </div>
            </Link>
          </> || <>
            <Link to="/join" style={{ textDecoration: "none" }}>
              <div className={btnStyle} >
                Join to get Work +
              </div>
              <div style={{ clear: "both" }} />
            </Link>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <div className={btnStyle} >
                Login
              </div>
              <div style={{ clear: "both" }} />
            </Link>
          </>
        }
      </div>
    </div>
  )
}

export default Home;