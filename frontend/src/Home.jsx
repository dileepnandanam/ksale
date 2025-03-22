import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import Api from "./Api";

const Home = () => {
  const search = async (key) => {
    const results = await Api.searchUsers({}, key)
    setUsers(results.data || [])
  }

  const [users, setUsers] = useState([]);

  return(
    <div style={{ fontSize: "22px", width: "100%", backgroundImage: "radial-gradient(#dcebdc, #cfcfeb, #e4bed7)", backgroundSize: "200%", height: "100vh" }}>
      <div style={{ width: "100%", display: "block", padding: "20px 0px", borderBottom: "1px solid blue" }}>
        <div style={{ display: "block", width: "90%", margin: "auto" }}>
          <div style={{ verticalAlign: "bottom", height: "52px", display: "inline-block", width: "25%", borderRadius: "8px 0px 0px 8px", border: "1px solid #d0cfeb", borderRight: "none", padding: "8px 10px", background: "white" }}>Search</div>
          <input onChange={(e) => search(e.target.value)} style={{ verticalAlign: "bottom", height: "42px", display: "inline-block", width: "65%", borderRadius: "0px 8px 8px 0px", border: "1px solid #d0cfeb", outline: "none", padding: "4px 8px", fontSize: "22px" }} />
        </div>
      </div>
      <Link to="/join">
        <div className="clickable" style={{ margin: "12px 12px", float: "right", borderRadius: "12px", background: "green", color: "white", padding: "4px 8px" }}>
          Join to get Work +
        </div>
        <div style={{ clear: "both" }} />
      </Link>

      <div style={{ display: "block", width: "100%", padding: "12px" }}>
        {
          users.map((user) => (
            <div style={{ display: "block", width: "100%", borderRadius: "8px", border: "1px solid black", marginBottom: "12px", padding: "8px" }}>
              <div style={{ float: "left", position: "relative", display: "inline-block", width: "80px", height: "80px", padding: "12px" }}>
                <div style={{ padding: "6px 0px 0px 20px", fontSize: "28px", height: "100%", width: "100%", borderRadius: "50%", background: "black", color: "white" }}>
                  {user.name[0].toUpperCase()}
                </div>
              </div>
              <div style={{ display: "inline-block", width: "70%", float: "left" }}>
                <div style={{ display: "block", width: "100%" }}>
                  {user.name}
                </div>
                <div style={{ display: "block", width: "100%" }}>
                  {(user.tags || "").split(", ").map((tag) => (
                    <div style={{ fontSize: "15px", display: "inline-block", float: "left", padding: "3px 8px", margin: "3px 8px 0px 0px", border: "1px solid black", background: "white", borderRadius: "4px" }}>
                      {tag}
                    </div>
                  ))}
                  <div style={{ clear: "both" }} />
                </div>
                <div style={{ display: "block", width: "100%" }}>
                  {user.country_code} {user.phone}
                </div>
              </div>
              <a href={"tel:" + user.phone} style={{ fontSize: "30px", textDecoration: "none", display: "inline-block", width: "50px", height: "50px", padding: "6px 0px 0px 18px", background: "white", float: "right", border: "1px solid black", borderRadius: "8px" }}>
                📞
              </a>
              <div style={{ clear: "both" }} />
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Home;