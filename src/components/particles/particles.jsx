import { useCallback, useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { loadAll } from "@/tsparticles/all"; // if you are going to use `loadAll`, install the "@tsparticles/all" package too.
// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.

const Particlesjsx = () => {

    const [ init, setInit ] = useState(false);

    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
            // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
            // starting from v2 you can add only the features you need reducing the bundle size
            //await loadAll(engine);
            //await loadFull(engine);
            await loadSlim(engine);
            //await loadBasic(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        console.log(container);
    };


 
    return (
        <>
        { init && <Particles
            id="tsparticles"
            className="absolute top-0 left-0 w-full h-full"
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
                        // onClick: {
                        //     enable: true,
                        //     mode: "push",
                        // },
                        onHover: {
                            mode: ['grab', 'bubble'],
                            enable: true
                        },
                        resize: true,
                    },
                    modes: {
                        // push: {
                        //     quantity: 4,
                        // },
                        // repulse: {
                        //     distance: 200,
                        //     duration: 0.4,
                        // },
                        grab: {
                            distance: 200
                          },
                          bubble: {
                              size: 10
                          }
                    },
                },
                particles: {
                    color: {
                        value: "#ffffff",
                    },
                    links: {
                        color: "#ffffff",
                        distance: 150,
                        enable: true,
                        opacity: 0.5,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce",
                        },
                        random: false,
                        speed: 1,
                        straight: false,
                        vibrate: false,
                        warp: false,
                        // gravity: {
                        //     enable: true,
                        //     acceleration: 9.81,

                        // }
                        
                        
                    },
                    
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 150,
                    },
                    // zIndex: {
                    //     value: -10
                    // },
                    // twinkles: {
                    //     enable: true,
                    //     frequency: 0.05,
                    //     opacity: 0.5,
                    // },
                    // wobble:{
                    //     distance: 30,
                    //     enable: true,
                    //     speed: 1,
                    // },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 1, max: 5 },
                    },
                },
                detectRetina: false,
            }}
        />
}
</>
);
};

export default Particlesjsx