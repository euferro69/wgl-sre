// Flat shading
precision mediump float;  // Set default float precision

varying vec3 v_position;    // Varying world position from the vertex shader
varying vec4 v_color;       // Varying color from the vertex shader
varying vec3 v_normal;      // Varying transformed normal from the vertex shader
varying vec3 v_cameraForward;

// Flat
void main() {
    // Fixed light direction
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));

    // Ambient light
    vec3 ambientLightColor = vec3(1.0, 1.0, 1.0);
    float ambientLightIntensity = 0.5;

    float intensity = max(dot(v_normal, lightDir), 0.0);
    gl_FragColor = vec4(v_color.rgb * intensity, v_color.a); // Preserve alpha in color
}