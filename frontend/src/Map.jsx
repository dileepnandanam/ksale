import React, { useState, useEffect, useRef } from "react";
import keralaMap from "./assets/maps/k1.png";


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
    name: "kerala",
    origin: {
      lat: 12.794153, lng: 74.8630383
    },
    end: {
      lat: 9.510743, lng: 77.4096031
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
      name: "Me",
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
  const boxRef = useRef(null);
  const mapRef = useRef(null);
  
  const state = useRef({
    centerX: 0, centerY: 0,
    currentX: 0, currentY: 0,
    initialX: 0, initialY: 0,
    initialDist: 0,
    scale: 1, lastScale: 1,
    isDragging: false
  });

  const mapTotalX = (maps[0].end.lng - maps[0].origin.lng)

  const markerCoords = (item) => {
    const mapImageX = document.getElementById("map").clientWidth
    const y = (map.origin.lat - item.lat) * (mapImageX/mapTotalX);
    const x = (item.lng - map.origin.lng) * (mapImageX/mapTotalX);
    return({
      top: `${y}px`, left: `${x}px`
    })
  }

  const [mapLoaded, setMapLoaded] = useState();

  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    setMarkers(items.map((m) => ({
      ...m,
      ...markerCoords(m),
    })))
  }, [items, mapLoaded])

  const getDist = (t) => Math.hypot(t[1].pageX - t[0].pageX, t[1].pageY - t[0].pageY);
  const midpoint = (t) => [(t[1].pageX + t[0].pageX)/2, (t[1].pageY + t[0].pageY)/2]
  const dist = (t) => [(t[1].pageX - t[0].pageX), (t[1].pageY - t[0].pageY)]

  const handleStart = (e) => {
    if (e.touches.length === 1) {
      state.current.isDragging = true;
      state.current.initialX = e.touches[0].pageX - state.current.currentX;
      state.current.initialY = e.touches[0].pageY - state.current.currentY;
    } else if (e.touches.length === 2) {
      [state.current.centerX, state.current.centerY] = midpoint(e.touches)
      state.current.isDragging = false;
      state.current.initialDist = getDist(e.touches);
    }
  };

  const handleMove = (e) => {
    if (e.cancelable) e.preventDefault();

    if (e.touches.length === 1 && state.current.isDragging) {
      state.current.currentX = e.touches[0].pageX - state.current.initialX;
      state.current.currentY = e.touches[0].pageY - state.current.initialY;
      mapRef.current.style.transform = `translate3d(${state.current.currentX}px, ${state.current.currentY}px, 0) scale(${state.current.scale})`;
    } else if (e.touches.length === 2) {
      const t = e.touches
      const dist = Math.hypot(t[0].pageX - t[1].pageX, t[0].pageY - t[1].pageY);
      const midX = (t[0].pageX + t[1].pageX) / 2;
      const midY = (t[0].pageY + t[1].pageY) / 2;
      if (state.current.initialDist === 0) {
        state.current.initialDist = dist;
        state.current.lastScale = state.current.scale;
        return;
      }
      const newScale = Math.max(0.5, Math.min(state.current.lastScale * (dist / state.current.initialDist), 5));
      const ratio = newScale / state.current.scale;
      state.current.currentX = midX - (midX - state.current.currentX) * ratio;
      state.current.currentY = midY - (midY - state.current.currentY) * ratio;
      
      state.current.scale = newScale;
      mapRef.current.style.transform = `translate3d(${state.current.currentX}px, ${state.current.currentY}px, 0) scale(${state.current.scale})`;
    }
  };

  const handleEnd = () => {
    state.current.isDragging = false;
    state.current.lastScale = state.current.scale;
  };

  useEffect(() => {
    const el = mapRef.current
    if (el) {
      el.addEventListener('touchstart', handleStart, { passive: false });
      el.addEventListener('touchmove', handleMove, { passive: false });
      el.addEventListener('touchend', handleEnd);
    }

    return () => {
      if (el) {
        el.removeEventListener('touchstart', handleStart);
        el.removeEventListener('touchmove', handleMove);
        el.removeEventListener('touchend', handleEnd);
      }
    };
  }, []);

  return(
    <div className="w-full" style={{ overflow: "hidden", maxWidth: "100%", position: "relative", height: "500px", background: "white" }}>
      <div style={{ position: "absolute", willChange: 'transform', transformOrigin: `${0} ${0}` }} ref={mapRef}>
        <div className="w-full" style={{ position: "relative" }}>
          <img src={keralaMap} id="map"
            style={{
              zindex: 700,
              touchAction: 'none',
              willChange: 'transform',
              maxWidth: "5000px",
            }}
            onLoad={() => {
              setMapLoaded(true)
            }}
          />
          {
            markers.map((i, idx) => (
              <div key={idx} id={i.identity} style={{ zindex: `99${i}`, padding: "4px 6px", top: i.top, left: i.left, borderRadius: "8px", background: (i.identity == "current_user" ? "#e2ce30" : "white"), border: (i.identity == "current_user" ? "2px solid" : "white"), position: "absolute" }} >
                {i.name}
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}