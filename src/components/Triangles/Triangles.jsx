import { Canvas } from "@react-three/fiber";
import Settings from "./Settings.jsx";
import Scene from "./Scene.jsx";

const Triangles = () => {
  return (
    <div className="triangles">
      <Canvas
        camera={{
          position: [0, 0, 8],
        }}
        shadows
      >
        <Settings />
        <Scene />
      </Canvas>
    </div>
  );
};

export default Triangles;
