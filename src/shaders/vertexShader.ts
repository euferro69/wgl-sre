export const vertexShaderSource = `
    // Vertex Data
    attribute vec3 a_position;                  // Vertex position
    attribute vec4 a_color;                     // Vertex color

    varying vec4 v_color;                       // Interpolated color input to fs

    void main() {
        gl_Position = vec4(a_position, 1.0);
        v_color = a_color;                      // Pass color to fs
    }
    `;
