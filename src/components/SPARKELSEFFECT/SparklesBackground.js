// src/components/SparklesBackground.jsx
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback } from "react";

function SparklesBackground() {
  const particlesInit = useCallback(async (main) => {
    await loadSlim(main);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        particles: {
          number: { value: 0 },
          color: { value: ["#ffffff", "#00d1ff", "#ff6bff"] },
          shape: { type: "circle" },
          opacity: {
            value: 1,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0,
              sync: false,
            },
          },
          size: {
            value: 5,
            random: { enable: true, minimumValue: 1 },
            animation: {
              enable: true,
              speed: 5,
              minimumValue: 1,
              sync: false,
            },
          },
          move: {
            enable: true,
            speed: 2,
            direction: "none",
            outModes: { default: "destroy" },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "trail",
            },
            resize: true,
          },
          modes: {
            trail: {
              delay: 0.005,
              pauseOnStop: false,
              quantity: 5,
              particles: {
                color: { value: ["#ffffff", "#00d1ff", "#ff6bff"] },
                size: {
                  value: 5,
                  animation: {
                    enable: true,
                    speed: 6,
                    minimumValue: 1,
                    sync: false,
                  },
                },
              },
            },
          },
        },
        detectRetina: true,
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}

export default SparklesBackground;
