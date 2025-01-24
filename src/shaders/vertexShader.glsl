// Vertex Data
attribute vec3 a_position;                  // Vertex position
attribute vec4 a_color;                     // Vertex color
attribute vec3 a_normal;                    // Vertex normal

// Camera Matrices
uniform mat4 u_modelMatrix;                 // World pos, scalling
uniform mat4 u_viewMatrix;                  // View matrix
uniform mat4 u_projectionMatrix;            // Projection matrix

varying vec3 v_position;  // Pass position to fragment shader
varying vec4 v_color;     // Interpolated color input to fs
varying vec3 v_normal;    // Pass normal to fragment shader

void main() {
    // Apply the view and projection matrices to the vertex position
    gl_Position = u_projectionMatrix * u_viewMatrix * vec4(a_position, 1.0);

    // Pass the color to the fragment shader
    v_color = a_color;
}

