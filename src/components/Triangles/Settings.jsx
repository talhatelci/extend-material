import { Perf } from "r3f-perf";
import { OrbitControls, Environment } from "@react-three/drei";
import px from "../../assets/envmap/px.png";
import nx from "../../assets/envmap/nx.png";
import py from "../../assets/envmap/py.png";
import ny from "../../assets/envmap/ny.png";
import pz from "../../assets/envmap/pz.png";
import nz from "../../assets/envmap/nz.png";

const Settings = () => {
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls />

      <Environment files={[px, nx, py, ny, pz, nz]} background blur={0.5} />
    </>
  );
};

export default Settings;
