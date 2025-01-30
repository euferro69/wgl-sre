precision mediump float;  // Set default float precision]

varying vec3 v_position;    // Varying world position from the vertex shader
varying vec4 v_color;       // Varying color from the vertex shader
varying vec3 v_normal;      // Varying transformed normal from the vertex shader
varying vec3 v_cameraForward;

// Flat
void main() {
    vec3 intensity = max((v_normal.xyz * v_cameraForward), vec3(0, 0, 0));
    gl_FragColor = v_color * vec4(intensity, 1);
}