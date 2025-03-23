import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router";
import Api from "./Api";
import phone from "./assets/phone.png";
import { UserContext } from "./App";
import LocateButton from "./LocateButton";

const Home = () => {
  const user = useContext(UserContext);
  const search = async (key) => {
    const lat = localStorage.getItem("latitude")
    const lng = localStorage.getItem("longitude")

    if (lat && lng) {
      const results = await Api.searchUsers({}, key, lat, lng)
      setUsers(results.data || [])
    }
  }

  const [users, setUsers] = useState([{
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
  }]);

  return(
    <div style={{ fontSize: "22px", width: "100%", backgroundImage: "radial-gradient(#dcebdc, #cfcfeb, #e4bed7)", backgroundSize: "200%", minHeight: "100vh" }}>
      <div style={{ width: "100%", display: "block", padding: "20px 0px", background: "white" }}>
        <div style={{ display: "block", width: "90%", margin: "auto" }}>
          <LocateButton style={{ verticalAlign: "bottom", height: "52px", display: "inline-block", width: "25%", borderRadius: "8px 0px 0px 8px", border: "1px solid #d0cfeb", borderRight: "none", padding: "8px 10px", background: "white" }} display="Locate" />
          <input onChange={(e) => search(e.target.value)} style={{ verticalAlign: "bottom", height: "42px", display: "inline-block", width: "65%", borderRadius: "0px 8px 8px 0px", border: "1px solid #d0cfeb", outline: "none", padding: "4px 8px", fontSize: "22px" }} />
        </div>
      </div>

      <div style={{ display: "block", width: "100%", padding: "12px" }}>
        {
          users.map((user) => (
            <div style={{ position: "relative", display: "block", width: "100%", borderRadius: "8px", marginBottom: "12px", padding: "8px", backgroundImage: "linear-gradient(#fafafa, #e8eaf5, #fbfbfb)" }}>
              <div style={{ float: "left", position: "relative", display: "inline-block", width: "70px", height: "70px", padding: "10px" }}>
                <div style={{ padding: "3px 0px 0px 16px", fontSize: "28px", height: "100%", width: "100%", borderRadius: "50%", background: "#7d74b6", color: "white" }}>
                  {user.name[0].toUpperCase()}
                </div>
              </div>
              <div style={{ display: "inline-block", width: "70%", float: "left" }}>
                <div style={{ display: "block", width: "100%" }}>
                  {user.name}
                </div>
                <div style={{ display: "block", width: "100%" }}>
                  {(user.tags || "").split(", ").map((tag) => (
                    <div style={{ fontSize: "18px", display: "inline-block", float: "left", padding: "3px 8px", margin: "3px 8px 0px 0px", border: "1px solid #cfcfe9", background: "white", borderRadius: "4px" }}>
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
      <Link to="/join" style={{ textDecoration: "none" }}>
        <div className="clickable" style={{ textDecoration: "none", margin: "12px 12px", display: "block", background: "green", color: "white", padding: "4px 8px" }}>
          Join to get Work +
        </div>
        <div style={{ clear: "both" }} />
      </Link>
      <Link to="/login" style={{ textDecoration: "none" }}>
        <div className="clickable" style={{ textDecoration: "none", margin: "12px 12px", display: "block", background: "green", color: "white", padding: "4px 8px" }}>
          Login
        </div>
        <div style={{ clear: "both" }} />
      </Link>
    </div>
  )
}

export default Home;