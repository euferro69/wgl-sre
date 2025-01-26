precision mediump float;  // Set default float precision]

uniform int u_shadingMode;

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

varying vec3 v_position;    // Varying color from the vertex shader
varying vec4 v_color;       // Varying color from the vertex shader
varying vec4 v_normal;      // Varying color from the vertex shader

void main() {
    // Unlit
    if (u_shadingMode == 0) {
        gl_FragColor = v_color;
    }
    // Wireframe
    else if (u_shadingMode == 1) {
        gl_FragColor = v_color * 0.01;
    } 
    // Flat
    else if (u_shadingMode == 2) {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    }
    // BlinnPhong
    else if (u_shadingMode == 3) {
        gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0);
    }
    // PBR
    else if (u_shadingMode == 4) { // 
        gl_FragColor = vec4(0.5, 1.0, 0.0, 1.0);
    }
    // Raytracing
    else if (u_shadingMode == 5) {
        gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); // Placeholder for Wireframe rendering
    }
    // Raymarching
    else if (u_shadingMode == 6) {
        gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0); // Placeholder for Points rendering
    } 
    // Pathtracing
    else if (u_shadingMode == 7) {
        gl_FragColor = vec4(1.0, 0.5, 0.0, 1.0); // Placeholder for Toon shading
    }
    // Toon
    else if (u_shadingMode == 8) {
        gl_FragColor = vec4(0.5, 0.5, 0.5, 1.0); // Placeholder for Raytracing
    }
    else { // Default behavior: fallback if no valid render mode is provided
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
}