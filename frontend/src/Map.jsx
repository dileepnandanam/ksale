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
    name: "palakkad",
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
  const [scale, setScale] = useState(1)
  const [renderScale, setRenderScale] = useState(1)
  const [originalWidth, setOriginalWidth] = useState("100%")
  const [crossDistance, setCrossDistance] = useState(0.5)
  const [screenWidth, setScreenWidth] = useState(1000)

  const markerCoords = (item) => {
    const y = (map.origin.lat - item.lat) * scale * renderScale;
    const x = (item.lng - map.origin.lng) * scale * renderScale;
    return({
      top: `${y}px`, left: `${x}px`
    })
  }

  const [markers, setMarkers] = useState([]);
  useEffect(() => {
    setMarkers(items.map((m) => ({
      ...m,
      ...markerCoords(m),
    })))
  }, [renderScale, scale])


  const boxRef = useRef(null);
  
  const state = useRef({
    currentX: 0, currentY: 0,
    initialX: 0, initialY: 0,
    initialDist: 0,
    scale: 1, lastScale: 1,
    isDragging: false
  });

  const getDist = (t) => Math.hypot(t[1].pageX - t[0].pageX, t[1].pageY - t[0].pageY);

  const handleStart = (e) => {
    if (e.touches.length === 1) {
      state.current.isDragging = true;
      state.current.initialX = e.touches[0].pageX - state.current.currentX;
      state.current.initialY = e.touches[0].pageY - state.current.currentY;
    } else if (e.touches.length === 2) {
      state.current.isDragging = false;
      state.current.initialDist = getDist(e.touches);
    }
  };

  const handleMove = (e) => {
    if (e.cancelable) e.preventDefault();

    if (e.touches.length === 1 && state.current.isDragging) {
      state.current.currentX = e.touches[0].pageX - state.current.initialX;
      state.current.currentY = e.touches[0].pageY - state.current.initialY;
    } else if (e.touches.length === 2) {
      const dist = getDist(e.touches);
      state.current.scale = Math.max(0.5, Math.min(state.current.lastScale * (dist / state.current.initialDist), 5));
    }

    boxRef.current.style.transform = `translate3d(${state.current.currentX}px, ${state.current.currentY}px, 0) scale(${state.current.scale})`;
  };

  const handleEnd = () => {
    state.current.isDragging = false;
    state.current.lastScale = state.current.scale;
  };

  useEffect(() => {
    const el = boxRef.current
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

  const caliberate = (originalWidth, screenWidth) => {
    const crossDistance = map.end.lng - map.origin.lng;
    setOriginalWidth(originalWidth);
    setCrossDistance(crossDistance);
    setScale(originalWidth / crossDistance);
    setRenderScale(screenWidth / originalWidth);
  }

  return(
    <div className="w-full" style={{ overflow: "hidden", maxWidth: "100%", position: "relative", height: "500px", background: "white" }}>
      <div style={{ position: "absolute", width: "1000px" }} ref={boxRef}>
        <div className="w-full" style={{ position: "relative" }}>
          <img src={keralaMap} id="map"
            style={{
              zindex: 700,
              touchAction: 'none',
              willChange: 'transform',
              maxWidth: "5000px",
              width: originalWidth && renderScale ? `${originalWidth * renderScale}px` : "100%"
            }}
            onLoad={() => {
              const originalWidth = document.getElementById("map").naturalWidth;
              const screenWidth = document.getElementById("map").clientWidth;
              caliberate(originalWidth, screenWidth);
            }}
          />
          {
            markers.map((i) => (
              <div id={i.identity} style={{ zindex: `99${i}`, padding: "4px 6px", top: i.top, left: i.left, borderRadius: "8px", background: (i.identity == "current_user" ? "#e2ce30" : "white"), border: (i.identity == "current_user" ? "2px solid" : "white"), position: "absolute" }} >
                {i.name}
              </div>
            ))
          }
        </div>
      </div>
      <div style={{ float: "right", position: "absolute", bottom: "0px", right: "0px" }}>
        <div style={{ padding: "6px 16px", borderRadius: "6px", margin: "6px", background: "blue", color: "white", fontWeight: "bold" }}
          onClick={() => {
            setScreenWidth((p) => p + 50)
            caliberate(originalWidth, screenWidth + 50)
          }}
        >
          +
        </div>
        <div style={{ padding: "6px 16px", borderRadius: "6px", margin: "6px", background: "blue", color: "white", fontWeight: "bold" }}
          onClick={() => {
            setScreenWidth((p) => p - 50)
            caliberate(originalWidth, screenWidth - 50)
          }}
        >
          -
        </div>
      </div>
    </div>
  )
}