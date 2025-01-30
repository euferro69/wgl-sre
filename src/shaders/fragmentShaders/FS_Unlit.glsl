precision mediump float;  // Set default float precision]

varying vec3 v_position;   // Varying color from the vertex shader
varying vec4 v_color;           // Varying color from the vertex shader
varying vec4 v_normal;          // Varying color from the vertex shader
varying vec3 v_cameraForward;

// Unlit
void main() {
    gl_FragColor = v_color;
}