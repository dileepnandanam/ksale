import React from "react";
import { Link } from "react-router";

const Home = () => {
  return(
    <div style={{ width: "100%", backgroundImage: "radial-gradient(#dcebdc, #cfcfeb, #e4bed7)", backgroundSize: "200%", height: "100vh" }}>
      <div style={{ width: "100%", display: "block", padding: "20px 0px", borderBottom: "1px solid blue" }}>
        <div style={{ display: "block", width: "80%", margin: "auto" }}>
          <div style={{ verticalAlign: "bottom", height: "42px", display: "inline-block", width: "25%", borderRadius: "8px 0px 0px 8px", border: "1px solid #d0cfeb", borderRight: "none", padding: "8px 10px", background: "white" }}>Search</div>
          <input style={{ verticalAlign: "bottom", height: "32px", display: "inline-block", width: "65%", borderRadius: "0px 8px 8px 0px", border: "1px solid #d0cfeb", outline: "none", padding: "4px 8px", fontSize: "15px" }} />
        </div>
      </div>
      <Link to="/join">
        <div className="clickable" style={{ margin: "12px 12px", float: "right", borderRadius: "12px", background: "green", color: "white", padding: "4px 8px" }}>
          Join to get Work +
        </div>
      </Link>
    </div>
  )
}

export default Home;