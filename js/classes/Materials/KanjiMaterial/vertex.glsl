uniform float uTime;
uniform float uScale;
uniform float uFrequency;

attribute vec3 aRandom;

varying vec3 vPosition;

void main() {
    vec3 pos = position;

    pos.x += sin(uTime * aRandom.x) * uFrequency;
    pos.y += cos(uTime * aRandom.y) * uFrequency;
    pos.z += cos(uTime * aRandom.z) * uFrequency;

    // Transition 
    pos.x *= uScale + (sin(pos.y * 4.0 + uTime) * (1.0 - uScale));
    pos.y *= uScale + (sin(pos.z * 4.0 + uTime) * (1.0 - uScale)); 
    pos.z *= uScale + (sin(pos.x * 4.0 + uTime) * (1.0 - uScale));

    pos *= uScale;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = 125.0 / -mvPosition.z;

    vPosition = pos;
}