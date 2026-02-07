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

  const [currentPlaceholder, setPlaceholder] = useState("Search workers");

  useEffect(() => changePlaceholder(0), [])

  const placeholders = ["Search workers", "mechanic", "theng kayattam", "തെങ്ങുകയറ്റം", "tile works", "maramvet"]

  const changePlaceholder = (i) => {
    setPlaceholder(placeholders[i])
    setTimeout(() => changePlaceholder((i + 1) % placeholders.length), 1000)
  }

  return(
    <div class="max-w-md mx-auto w-full px-4">
      <div class="max-w-md mx-auto w-full">
        <input
          placeholder={currentPlaceholder}
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            search(e.target.value);
          }}
          type="search"
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

      <div style={{ display: "block", width: "100%", padding: "12px 0px" }}>
        {
          users.map((user) => (
            <UserContact user={user} />
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

const PhoneIco = (props) => {
  return(
    <svg width={props.width || "256px"} height={props.height || "256px"} viewBox="-2.4 -2.4 28.80 28.80" fill={props.fill || "none"} xmlns="http://www.w3.org/2000/svg" stroke={props.stroke || "#000000"} transform="rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.096"></g><g id="SVGRepo_iconCarrier"> <path d="M14.05 6C15.0268 6.19057 15.9244 6.66826 16.6281 7.37194C17.3318 8.07561 17.8095 8.97326 18 9.95M14.05 2C16.0793 2.22544 17.9716 3.13417 19.4163 4.57701C20.8609 6.01984 21.7721 7.91101 22 9.94M18.5 21C9.93959 21 3 14.0604 3 5.5C3 5.11378 3.01413 4.73086 3.04189 4.35173C3.07375 3.91662 3.08968 3.69907 3.2037 3.50103C3.29814 3.33701 3.4655 3.18146 3.63598 3.09925C3.84181 3 4.08188 3 4.56201 3H7.37932C7.78308 3 7.98496 3 8.15802 3.06645C8.31089 3.12515 8.44701 3.22049 8.55442 3.3441C8.67601 3.48403 8.745 3.67376 8.88299 4.05321L10.0491 7.26005C10.2096 7.70153 10.2899 7.92227 10.2763 8.1317C10.2643 8.31637 10.2012 8.49408 10.0942 8.64506C9.97286 8.81628 9.77145 8.93713 9.36863 9.17882L8 10C9.2019 12.6489 11.3501 14.7999 14 16L14.8212 14.6314C15.0629 14.2285 15.1837 14.0271 15.3549 13.9058C15.5059 13.7988 15.6836 13.7357 15.8683 13.7237C16.0777 13.7101 16.2985 13.7904 16.74 13.9509L19.9468 15.117C20.3262 15.255 20.516 15.324 20.6559 15.4456C20.7795 15.553 20.8749 15.6891 20.9335 15.842C21 16.015 21 16.2169 21 16.6207V19.438C21 19.9181 21 20.1582 20.9007 20.364C20.8185 20.5345 20.663 20.7019 20.499 20.7963C20.3009 20.9103 20.0834 20.9262 19.6483 20.9581C19.2691 20.9859 18.8862 21 18.5 21Z" stroke="#000000" stroke-width="1.152" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  )
}

const UserContact = ({ user }) => {
  return(
    <div className="block relative block w-full rounded-8 mb-2 text-black" style={{ display: "flex", background: "#fff7aeb8", paddingLeft: "0px" }} >
      <div className="float-left p-3 bg-blue-100" style={{ flex: "1", fontSize: "16px", borderRadius: "8px 0px 0px 8px" }}>
        <div className="block">
          {user.distance.toFixed(1)}
        </div>
        <div className="block">
          Km
        </div>
      </div>
      <div className="" style={{ display: "inline-block", width: "80%", float: "left", marginLeft: "12px" }}>
        <div style={{ display: "block", width: "90%", whiteeSpace: "normal", wordBreak: "break-all" }}>
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
      <a href={"tel:" + user.phone} style={{ position: "absolute", right: "0", top: "10px", fontSize: "30px", textDecoration: "none", display: "inline-block", width: "80px", height: "80px", padding: "6px 0px 14px 18px", float: "right" }}>
        <PhoneIco width={"40px"} height={"40px"} style={{ width: "100%" }} />
      </a>
      <div style={{ clear: "both" }} />
    </div>
  )
}

export default Home;