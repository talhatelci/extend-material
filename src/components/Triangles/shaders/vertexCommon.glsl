uniform float uTime;

attribute float aRandom;
attribute vec3 aCentroid;

mat2 rotate2d(float angle) {
  return mat2(
    cos(angle), -sin(angle),
    sin(angle), cos(angle)
  );
}