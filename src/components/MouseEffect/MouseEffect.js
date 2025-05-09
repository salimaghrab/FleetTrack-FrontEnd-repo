import React, { useEffect, useState } from "react";

const MouseEffect = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
      setClicked(true);
      setTimeout(() => setClicked(false), 500);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30" aria-hidden="true">
      {/* Main cursor */}
      <div
        className="absolute rounded-full transition-all duration-100 ease-out"
        style={{
          transform: `translate(${position.x - 12}px, ${position.y - 12}px)`,
          width: clicked ? "30px" : "24px",
          height: clicked ? "30px" : "24px",
          border: "2px solid #6366f1",
          backgroundColor: clicked ? "rgba(99, 102, 241, 0.2)" : "transparent",
          boxShadow: "0 0 15px rgba(99, 102, 241, 0.5)",
        }}
      />

      {/* Trailing dot */}
      <div
        className="absolute rounded-full bg-indigo-500"
        style={{
          transform: `translate(${position.x - 4}px, ${position.y - 4}px)`,
          width: "8px",
          height: "8px",
          opacity: 0.7,
          transition: "transform 0.1s linear",
        }}
      />
    </div>
  );
};

export default MouseEffect;
