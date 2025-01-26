// Vertex Data
attribute vec3 a_position;                  // Vertex position
attribute vec4 a_color;                     // Vertex color
attribute vec3 a_normal;                    // Vertex normal

// Camera Matrices
uniform mat4 u_modelMatrix;                 // Translation, rotation and scalling
uniform mat4 u_viewMatrix;                  // View matrix
uniform mat4 u_projectionMatrix;            // Projection matrix
uniform vec3 u_camFront;                    // Direction tat the camera is looking

// Wireframe variables
uniform vec4 u_color;                       // New uniform for wireframe/point color
uniform float u_pointSize;                  // New uniform for point size

varying vec3 v_position;                    // Pass position to fragment shader
varying vec4 v_color;                       // Interpolated color input to fs
varying vec4 v_normal;                      // Pass normal to fragment shader

void main() {
    // Apply the view and projection matrices to the vertex position
    gl_Position = u_projectionMatrix * u_viewMatrix * u_modelMatrix * vec4(a_position, 1.0);

    gl_PointSize = u_pointSize > 0.0 ? u_pointSize : 0.0;
    
    // Varying variables to pass data to the fragment shader
    v_position = vec3(u_modelMatrix * vec4(a_position, 1.0));

    v_normal = u_modelMatrix * vec4(a_normal, 1.0); // Transform normals
    
    // Pass color
    v_color = u_color.a > 0.0 ? u_color : a_color;
}
                                 
