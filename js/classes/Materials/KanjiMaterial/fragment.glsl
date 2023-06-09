uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uAlpha;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
    // float depth =  vPosition.z + 0.5;
    // vec3 color =  mix(uColor1, uColor2, depth);
    // gl_FragColor = vec4(color, depth);

    float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
    float strength = 0.05 / distanceToCenter - 0.1;

    vec3 color = mix(uColor1, uColor2, strength);
    vec4 finalColor = vec4(color, strength * uAlpha);

    gl_FragColor = finalColor;
}