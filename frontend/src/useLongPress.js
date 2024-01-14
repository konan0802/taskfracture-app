// useLongPress.js
import { useState, useEffect } from "react";

function useLongPress(onLongPress, ms = 500) {
  const [startLongPress, setStartLongPress] = useState(false);
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    let timerId;
    if (startLongPress) {
      timerId = setTimeout(() => onLongPress(eventData), ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [startLongPress, onLongPress, ms, eventData]);

  const start = (event) => {
    // タッチイベントのデフォルト動作を防止
    if (event.type === "touchstart") {
      event.preventDefault();
    }

    setEventData({ clientX: event.clientX, clientY: event.clientY });
    setStartLongPress(true);
  };

  const stop = () => {
    setStartLongPress(false);
    setEventData(null);
  };

  return {
    onMouseDown: (event) => start(event),
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: (event) => start(event.touches[0]),
    onTouchEnd: stop,
  };
}

export default useLongPress;
