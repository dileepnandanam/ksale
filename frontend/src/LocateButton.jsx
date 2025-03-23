import React, { useContext } from "react"
import Api from "./Api";
import { UserContext } from "./App";

const LocateButton = (props) => {

  const user = useContext(UserContext);
  const locate = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      if (user.Current()?.ID)
        Api.locateUser(user.Current().ID, {
          lat: Number(pos.coords.latitude), lng: Number(pos.coords.longitude)
        })
      localStorage.setItem("latitude", pos.coords.latitude)
      localStorage.setItem("longitude", pos.coords.longitude)
      props.onOk()
    })
  }

  return(
    <div style={props.style} onClick={locate} className={props.className}>
      {props.display}
    </div>
  )
}

export default LocateButton;