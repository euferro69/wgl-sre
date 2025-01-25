precision mediump float;  // Set default float precision]

struct DirectionalLight {
    vec3 direction;   
    vec3 color;
    float intensity;
};
struct AmbientLight {
    vec3 color;
    float intensity;
};
struct PointLight {
    vec3 position;
    float attenuationFactor;
    vec3 color;
    float intensity;
};
struct SpotLight {
    vec3 position;
    vec3 direction;
    float cutoffAngle;
    float outerCutoffAngle;
    vec3 color;
    float intensity;
};

// Maximum number of lights
#define MAX_LIGHTS 10

// Lights
uniform DirectionalLight u_directionalLight;
uniform AmbientLight u_ambientLight;
uniform PointLight u_pointLights[MAX_LIGHTS];
uniform SpotLight u_spotLights[MAX_LIGHTS];
uniform int u_lightCount; // Actual number of lights

varying vec3 v_position;     // Varying color from the vertex shader
varying vec4 v_color;     // Varying color from the vertex shader
varying vec3 v_normal;     // Varying color from the vertex shader

void main() {
    gl_FragColor = v_color; // Use the interpolated color for the fragment
}