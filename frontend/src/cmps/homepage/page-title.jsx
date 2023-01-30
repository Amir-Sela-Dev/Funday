import React, { useRef, useEffect, useState, useCallback } from "react";
import mojs from "@mojs/core"; // Currently there is a bug importing from npm, using external cdn version instead for nowimport Button from "./Button";
/**
 * Usage:
 * import MojsExample from './MojsExample';
 *
 * <MojsExample duration={1000} />
 */

const MojsExample = ({ duration }) => {
  const animDom = useRef();
  const bouncyCircle = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Prevent multiple instansiations on hot reloads
    if (bouncyCircle.current) return;

    // Assign a Shape animation to a ref
    bouncyCircle.current = new mojs.Shape({
      parent: animDom.current,
      shape: "circle",
      fill: { "#FC46AD": "#F64040" },
      radius: { 50: 200 },
      duration: duration,
      isShowStart: true,
      easing: "elastic.inout",
      onStart() {
        setIsAnimating(true);
      },
      onComplete() {
        setIsAnimating(false);
      }
    });

    // Play the animation on start, and set the state to open
    bouncyCircle.current.play();
    setIsOpen(true);
  });

  // Update the animation values when the prop changes
  useEffect(() => {
    if (!bouncyCircle.current) return;
    bouncyCircle.current.tune({ duration: duration });
    isOpen
      ? bouncyCircle.current.replayBackward()
      : bouncyCircle.current.replay();
    setIsOpen(!isOpen);
  }, [duration]);

  const clickHandler = useCallback(() => {
    // If the circel is "open", play the animation backwards, else play it forwards
    isOpen ? bouncyCircle.current.playBackward() : bouncyCircle.current.play();
    setIsOpen(!isOpen);
  }, [isOpen]);

  return (
    <div ref={animDom} className="MojsExample">
      <div className="content">
        <h1>MoJS React Example</h1>
        <p>Using hooks</p>
        <button onClick={clickHandler}>
          {isAnimating && isOpen ? "Animating" : isOpen ? "Close" : "Open"}
        </button>
      </div>
    </div>
  );
};

export default MojsExample;
