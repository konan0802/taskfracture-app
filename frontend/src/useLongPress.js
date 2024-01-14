// useLongPress.js
import { useState, useEffect } from "react";

function useLongPress(onLongPress, ms = 500) {
  const [startLongPress, setStartLongPress] = useState(false);

  useEffect(() => {
    let timerId;
    if (startLongPress) {
      timerId = setTimeout(onLongPress, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [startLongPress, onLongPress, ms]);

  const start = (event) => {
    event.preventDefault();
    setStartLongPress(true);
  };

  const stop = () => {
    setStartLongPress(false);
  };

  return {
    onTouchStart: start,
    onTouchEnd: stop,
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
  };
}

export default useLongPress;
