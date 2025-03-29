import React, { useContext, useState } from "react"
import Api from "./Api";
import { UserContext } from "./App";

const LocateButton = (props) => {

  const user = useContext(UserContext);
  const locate = () => {
    props.setLocating(true)
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        if (user.Current()?.ID) {
          await Api.locateUser(user.Current().ID, {
            lat: Number(pos.coords.latitude), lng: Number(pos.coords.longitude)
          })
        }
        localStorage.setItem("latitude", pos.coords.latitude)
        localStorage.setItem("longitude", pos.coords.longitude)
        props.setLocating(false)
        props.onOk()
      } catch(e) {
        props.setLocating(false)
        props.onError("Something Went Wrong.")
      }
    }, () => {
      props.onError()
    })
  }

  return(
    <div style={{...props.style }} onClick={locate} className={props.className}>
      {props.children}
    </div>
  )
}

export default LocateButton;