import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

const Confetti = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container) => {
    console.log(container);
  };

  return (
    <>
      {init && (
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: "transparent",
              },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: "push",
                },
                onHover: {
                  enable: true,
                  mode: "repulse",
                },
                resize: {
                  enable: true,
                },
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 200,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: [
                  "#FF0000",
                  "#00FF00",
                  "#0000FF",
                  "#FFFF00",
                  "#FF00FF",
                  "#00FFFF",
                ],
              },
              links: {
                enable: false,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: false,
                speed: 10,
                straight: false,
                path: {
                  enable: true,
                  options: {
                    type: "circle",
                    radius: 0,
                  },
                },
              },
              number: {
                density: {
                  enable: true,
                  width: 800,
                },
                value: 200,
              },
              opacity: {
                value: 1,
              },
              shape: {
                type: ["circle", "square", "triangle", "polygon"],
              },
              size: {
                value: { min: 3, max: 7 },
              },
            },
            detectRetina: true,
            emitters: {
              direction: "none",
              life: {
                count: 0,
                duration: 0.1,
                delay: 0.1,
              },
              rate: {
                delay: 0.1,
                quantity: 200,
              },
              size: {
                width: 0,
                height: 0,
              },
              position: {
                x: 50,
                y: 50,
              },
            },
          }}
        />
      )}
    </>
  );
};

export default Confetti;
