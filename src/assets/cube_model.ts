export const cubeVertexData_colored = new Float32Array([
  // Front face (red, green, blue, yellow)
  -1.0, -1.0,  1.0,  1.0, 0.0, 0.0, // Bottom-left, red
   1.0, -1.0,  1.0,  0.0, 1.0, 0.0, // Bottom-right, green
   1.0,  1.0,  1.0,  0.0, 0.0, 1.0, // Top-right, blue
  -1.0,  1.0,  1.0,  1.0, 1.0, 0.0, // Top-left, yellow

  // Back face (magenta, cyan, orange, purple)
  -1.0, -1.0, -1.0,  1.0, 0.0, 1.0, // Bottom-left, magenta
   1.0, -1.0, -1.0,  0.0, 1.0, 1.0, // Bottom-right, cyan
   1.0,  1.0, -1.0,  1.0, 0.5, 0.0, // Top-right, orange
  -1.0,  1.0, -1.0,  0.6, 0.2, 0.8, // Top-left, purple

  // Top face (red, green, blue, yellow)
  -1.0,  1.0, -1.0,  1.0, 0.0, 0.0, // Bottom-left, red
   1.0,  1.0, -1.0,  0.0, 1.0, 0.0, // Bottom-right, green
   1.0,  1.0,  1.0,  0.0, 0.0, 1.0, // Top-right, blue
  -1.0,  1.0,  1.0,  1.0, 1.0, 0.0, // Top-left, yellow

  // Bottom face (magenta, cyan, orange, purple)
  -1.0, -1.0, -1.0,  1.0, 0.0, 1.0, // Bottom-left, magenta
   1.0, -1.0, -1.0,  0.0, 1.0, 1.0, // Bottom-right, cyan
   1.0, -1.0,  1.0,  1.0, 0.5, 0.0, // Top-right, orange
  -1.0, -1.0,  1.0,  0.6, 0.2, 0.8, // Top-left, purple

  // Right face (cyan, orange, purple, red)
   1.0, -1.0, -1.0,  0.0, 1.0, 1.0, // Bottom-left, cyan
   1.0,  1.0, -1.0,  1.0, 0.5, 0.0, // Top-left, orange
   1.0,  1.0,  1.0,  0.6, 0.2, 0.8, // Top-right, purple
   1.0, -1.0,  1.0,  1.0, 0.0, 0.0, // Bottom-right, red

  // Left face (green, yellow, blue, magenta)
  -1.0, -1.0, -1.0,  0.0, 1.0, 0.0, // Bottom-left, green
  -1.0,  1.0, -1.0,  1.0, 1.0, 0.0, // Top-left, yellow
  -1.0,  1.0,  1.0,  0.0, 0.0, 1.0, // Top-right, blue
  -1.0, -1.0,  1.0,  1.0, 0.0, 1.0, // Bottom-right, magenta
]);

export const cubeVertexData_white = new Float32Array([
  // **Top Face** (2 triangles)
  // First triangle
  -1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-left
   1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-right
   1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  // Top-right

  // Second triangle
  -1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  // Top-left
  -1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-left
   1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  // Top-right

  // **Front Face** (Side Face 1) (2 triangles)
  // First triangle
  -1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  // Bottom-left
   1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  // Bottom-right
   1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  // Top-right

  // Second triangle
  -1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  // Top-left
  -1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  // Bottom-left
   1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  // Top-right

  // **Back Face** (Side Face 2) (2 triangles)
  // First triangle
  -1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-left
   1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-right
   1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  // Top-right

  // Second triangle
  -1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  // Top-left
  -1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-left
   1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  // Top-right

  // **Right Face** (Side Face 3) (2 triangles)
  // First triangle
   1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-left
   1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  // Top-left
   1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  // Top-right

  // Second triangle
   1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  // Bottom-right
   1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-left
   1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  // Top-right

  // **Left Face** (Side Face 4) (2 triangles)
  // First triangle
  -1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-left
  -1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  // Top-left
  -1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  // Top-right

  // Second triangle
  -1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  // Bottom-right
  -1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-left
  -1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  // Top-right

  // **Bottom Face** (2 triangles)
  // First triangle
  -1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-left
   1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-right
   1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  // Top-right

  // Second triangle
  -1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  // Bottom-left
  -1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  // Bottom-left
   1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  // Top-right
]);

export const cubeVertexData_blue = new Float32Array([
  // **Top Face** (2 triangles)
  // First triangle
  -1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-left
   1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-right
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  // Top-right

  // Second triangle
  -1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  // Top-left
  -1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-left
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  // Top-right

  // **Front Face** (Side Face 1) (2 triangles)
  // First triangle
  -1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  // Bottom-left
   1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  // Bottom-right
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  // Top-right

  // Second triangle
  -1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  // Top-left
  -1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  // Bottom-left
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  // Top-right

  // **Back Face** (Side Face 2) (2 triangles)
  // First triangle
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-left
   1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-right
   1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  // Top-right

  // Second triangle
  -1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  // Top-left
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-left
   1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  // Top-right

  // **Right Face** (Side Face 3) (2 triangles)
  // First triangle
   1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-left
   1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  // Top-left
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  // Top-right

  // Second triangle
   1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  // Bottom-right
   1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-left
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  // Top-right

  // **Left Face** (Side Face 4) (2 triangles)
  // First triangle
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-left
  -1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  // Top-left
  -1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  // Top-right

  // Second triangle
  -1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  // Bottom-right
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-left
  -1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  // Top-right

  // **Bottom Face** (2 triangles)
  // First triangle
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-left
   1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-right
   1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  // Top-right

  // Second triangle
  -1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  // Bottom-left
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  // Bottom-left
   1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  // Top-right
]);



