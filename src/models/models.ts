// Cube ------------------------
export const cube_vertices = [
    // Front face
    -0.5, -0.5,  0.5,  1.0, 0.0, 0.0,  // Bottom-left (red)
     0.5, -0.5,  0.5,  0.0, 1.0, 0.0,  // Bottom-right (green)
     0.5,  0.5,  0.5,  0.0, 0.0, 1.0,  // Top-right (blue)
    -0.5,  0.5,  0.5,  1.0, 1.0, 0.0,  // Top-left (yellow)
  
    // Back face
    -0.5, -0.5, -0.5,  1.0, 0.0, 1.0,  // Bottom-left (purple)
     0.5, -0.5, -0.5,  0.0, 1.0, 1.0,  // Bottom-right (cyan)
     0.5,  0.5, -0.5,  1.0, 1.0, 1.0,  // Top-right (white)
    -0.5,  0.5, -0.5,  0.5, 0.5, 0.5,  // Top-left (gray)
  
    // Top face
    -0.5,  0.5, -0.5,  1.0, 0.0, 0.0,  // Bottom-left (red)
     0.5,  0.5, -0.5,  0.0, 1.0, 0.0,  // Bottom-right (green)
     0.5,  0.5,  0.5,  0.0, 0.0, 1.0,  // Top-right (blue)
    -0.5,  0.5,  0.5,  1.0, 1.0, 0.0,  // Top-left (yellow)
  
    // Bottom face
    -0.5, -0.5, -0.5,  1.0, 0.0, 1.0,  // Bottom-left (purple)
     0.5, -0.5, -0.5,  0.0, 1.0, 1.0,  // Bottom-right (cyan)
     0.5, -0.5,  0.5,  1.0, 1.0, 1.0,  // Top-right (white)
    -0.5, -0.5,  0.5,  0.5, 0.5, 0.5,  // Top-left (gray)
  
    // Right face
     0.5, -0.5, -0.5,  1.0, 0.0, 0.0,  // Bottom-left (red)
     0.5,  0.5, -0.5,  0.0, 1.0, 0.0,  // Top-left (green)
     0.5,  0.5,  0.5,  0.0, 0.0, 1.0,  // Top-right (blue)
     0.5, -0.5,  0.5,  1.0, 1.0, 0.0,  // Bottom-right (yellow)
  
    // Left face
    -0.5, -0.5, -0.5,  1.0, 0.0, 1.0,  // Bottom-left (purple)
    -0.5,  0.5, -0.5,  0.0, 1.0, 1.0,  // Top-left (cyan)
    -0.5,  0.5,  0.5,  1.0, 1.0, 1.0,  // Top-right (white)
    -0.5, -0.5,  0.5,  0.5, 0.5, 0.5,  // Bottom-right (gray)
  ];

  export const cube_indices = [
    0, 1, 2, 0, 2, 3,    // Front face
    4, 5, 6, 4, 6, 7,    // Back face
    8, 9, 10, 8, 10, 11, // Top face
    12, 13, 14, 12, 14, 15, // Bottom face
    16, 17, 18, 16, 18, 19, // Right face
    20, 21, 22, 20, 22, 23  // Left face
  ];
  