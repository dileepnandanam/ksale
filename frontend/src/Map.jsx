import React, { useState, useEffect } from "react";
import keralaMap from "./assets/maps/palakkad.png";


const Map = (props) => {
  const [lat, setLat] = useState()
  const [lng, setLng] = useState()

  useEffect(() => {
    setLat(Number(localStorage.latitude))
    setLng(Number(localStorage.longitude))
  }, [])

  return(
    <MapView center={{ lat: lat, lng: lng }} targets={props.targets} />
  )
}

const maps = [
  {
    name: "palakkad",
    origin: {
      lat: 11.2761, lng: 75.7596
    },
    end: {
      lat: 10.6672, lng: 76.9412
    }
  }
]

export default Map;

const MapView = ({
  center, targets
}) => {

  const [items, setItems] = useState([])

  useEffect(() => {
    setItems([{
      identity: "current_user",
      lat: center.lat,
      lng: center.lng,
    }])
  }, [center])

  return(
    <Render items={[...items, ...targets]} />
  )
}



const Render = ({ items }) => {
  const map = maps[0]
  const [scale, setScale] = useState(1)
  const [renderScale, setRenderScale] = useState(1)
  const [originalWidth, setOriginalWidth] = useState(10)
  const [crossDistance, setCrossDistance] = useState(0.5)

  const markerCoords = (item) => {
    const y = (map.origin.lat - item.lat) * scale * renderScale;
    const x = (item.lng - map.origin.lng) * scale * renderScale;
    return({
      top: `${y}px`, left: `${x}px`
    })
  }

  return(
    <div className="w-full" style={{ overflow: "auto", maxWidth: "100%", position: "relative", height: "300px" }}>
      <div style={{ position: "absolute", width: "800px" }}>
        <div className="w-full" style={{ position: "relative" }}>
          {
            items.map((i) => (
              <div id={i.identity} style={{ ...markerCoords(i), height: "12px", width: "12px", borderRadius: "50%", background: (i.identity == "current_user" ? "#e2ce30" : "white"), border: (i.identity == "current_user" ? "2px solid" : "white"), position: "absolute" }} />
            ))
          }
          <img src={keralaMap} id="map" className="w-full"
            onLoad={() => {
              const originalWidth = document.getElementById("map").naturalWidth;
              const screenWidth = document.getElementById("map").clientWidth;
              const crossDistance = map.end.lng - map.origin.lng;
              setScale(originalWidth / crossDistance);
              setRenderScale(screenWidth / originalWidth);
              setTimeout(() => document.getElementById("current_user").scrollIntoView(), 1000)
            }}
          />
        </div>
      </div>
    </div>
  )
}