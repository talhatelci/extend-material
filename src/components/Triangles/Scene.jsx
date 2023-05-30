import { useMemo, useRef } from "react";
import {
  BufferAttribute,
  IcosahedronGeometry,
  RGBADepthPacking,
  Vector3,
} from "three";
import { useFrame } from "@react-three/fiber";
import vertexCommonGlsl from "./shaders/vertexCommon.glsl?raw";
import beginVertexGlsl from "./shaders/beginVertex.glsl?raw";

const Scene = () => {
  // Geometry
  const icosahedronGeometry = useMemo(() => {
    let geometry = new IcosahedronGeometry(2, 4);

    let random = new Float32Array(geometry.attributes.position.count);
    let centroid = new Float32Array(geometry.attributes.position.count * 3);

    for (let i = 0; i < geometry.attributes.position.count; i += 3) {
      let displace = Math.random();

      random[i] = displace;
      random[i + 1] = displace;
      random[i + 2] = displace;

      let attribute = geometry.attributes.position;

      let p1 = new Vector3(attribute.getX(i), attribute.getY(i), attribute.getZ(i));
      let p2 = new Vector3(attribute.getX(i + 1), attribute.getY(i + 1), attribute.getZ(i + 1));
      let p3 = new Vector3(attribute.getX(i + 2), attribute.getY(i + 2), attribute.getZ(i + 2));
      let c = p1
        .add(p2)
        .add(p3)
        .multiplyScalar(1 / 3);

      centroid[i * 3] = c.x;
      centroid[i * 3 + 1] = c.y;
      centroid[i * 3 + 2] = c.z;

      centroid[(i + 1) * 3] = c.x;
      centroid[(i + 1) * 3 + 1] = c.y;
      centroid[(i + 1) * 3 + 2] = c.z;

      centroid[(i + 2) * 3] = c.x;
      centroid[(i + 2) * 3 + 1] = c.y;
      centroid[(i + 2) * 3 + 2] = c.z;
    }

    geometry.setAttribute("aRandom", new BufferAttribute(random, 1));
    geometry.setAttribute("aCentroid", new BufferAttribute(centroid, 3));

    return geometry;
  }, []);

  const uniforms = useRef({
    uTime: { value: 0 },
  });

  useFrame((state, delta) => {
    uniforms.current.uTime.value += delta;
  });

  // Updating the materials
  const injectPartial = (shader, shaderType, partialName, code) => {
    let include = `#include <${partialName}>`;
    let type = shaderType + "Shader";
    shader[type] = shader[type].replace(include, include + "\n" + code);
  };

  const updateObjectMaterial = (shader) => {
    // Uniforms
    shader.uniforms.uTime = uniforms.current.uTime;

    // Vertex Shader
    injectPartial(shader, "vertex", "common", vertexCommonGlsl);
    injectPartial(shader, "vertex", "begin_vertex", beginVertexGlsl);

    // Fragment Shader
    // ... 
  };

  const updateDepthMaterial = (shader) => {
    shader.uniforms.uTime = uniforms.current.uTime;
    injectPartial(shader, "vertex", "common", vertexCommonGlsl);
    injectPartial(shader, "vertex", "begin_vertex", beginVertexGlsl);
  };

  return (
    <>
      {/* Object */}
      <mesh geometry={icosahedronGeometry} position-y={1} castShadow>
        <meshPhysicalMaterial
          color={0xdd1c1a}
          flatShading
          onBeforeCompile={updateObjectMaterial}
          ior={4.5}
          transmission={1}
          roughness={0.4}
          thickness={0.4}
        />

        <meshDepthMaterial
          depthPacking={RGBADepthPacking}
          attach="customDepthMaterial"
          onBeforeCompile={updateDepthMaterial}
        />
      </mesh>

      {/* Floor */}
      <mesh position-y={-2.2} receiveShadow>
        <boxGeometry args={[9, 0.3, 9]} />
        <meshStandardMaterial color={0x876b7e} />
      </mesh>

      {/* Lights */}
      <directionalLight
        castShadow
        shadow-mapSize={[2048, 2048]}
        intensity={0.1}
        position={[0.5, 6, -1]}
      />
    </>
  );
};

export default Scene;
