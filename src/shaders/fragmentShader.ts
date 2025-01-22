export const fragmentShaderSource = `
    precision mediump float;  // Set default float precision
    
    varying vec4 v_color;     // Varying color from the vertex shader

    void main() {
        gl_FragColor = v_color; // Use the interpolated color for the fragment
    }
    `;
