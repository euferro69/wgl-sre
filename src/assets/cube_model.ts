export const cubeVertexData_colored = new Float32Array([
  // Front face (red, green, blue, yellow)
  -1.0, -1.0,  1.0,  1.0, 0.0, 0.0,  0.0, 0.0, 1.0,  // Bottom-left, red, normal (0, 0, 1)
   1.0, -1.0,  1.0,  0.0, 1.0, 0.0,  0.0, 0.0, 1.0,  // Bottom-right, green, normal (0, 0, 1)
   1.0,  1.0,  1.0,  0.0, 0.0, 1.0,  0.0, 0.0, 1.0,  // Top-right, blue, normal (0, 0, 1)
  -1.0,  1.0,  1.0,  1.0, 1.0, 0.0,  0.0, 0.0, 1.0,  // Top-left, yellow, normal (0, 0, 1)

  // Back face (magenta, cyan, orange, purple)
  -1.0, -1.0, -1.0,  1.0, 0.0, 1.0,  0.0, 0.0, -1.0,  // Bottom-left, magenta, normal (0, 0, -1)
   1.0, -1.0, -1.0,  0.0, 1.0, 1.0,  0.0, 0.0, -1.0,  // Bottom-right, cyan, normal (0, 0, -1)
   1.0,  1.0, -1.0,  1.0, 0.5, 0.0,  0.0, 0.0, -1.0,  // Top-right, orange, normal (0, 0, -1)
  -1.0,  1.0, -1.0,  0.6, 0.2, 0.8,  0.0, 0.0, -1.0,  // Top-left, purple, normal (0, 0, -1)

  // Top face (red, green, blue, yellow)
  -1.0,  1.0, -1.0,  1.0, 0.0, 0.0,  0.0, 1.0, 0.0,  // Bottom-left, red, normal (0, 1, 0)
   1.0,  1.0, -1.0,  0.0, 1.0, 0.0,  0.0, 1.0, 0.0,  // Bottom-right, green, normal (0, 1, 0)
   1.0,  1.0,  1.0,  0.0, 0.0, 1.0,  0.0, 1.0, 0.0,  // Top-right, blue, normal (0, 1, 0)
  -1.0,  1.0,  1.0,  1.0, 1.0, 0.0,  0.0, 1.0, 0.0,  // Top-left, yellow, normal (0, 1, 0)

  // Bottom face (magenta, cyan, orange, purple)
  -1.0, -1.0, -1.0,  1.0, 0.0, 1.0,  0.0, -1.0, 0.0,  // Bottom-left, magenta, normal (0, -1, 0)
   1.0, -1.0, -1.0,  0.0, 1.0, 1.0,  0.0, -1.0, 0.0,  // Bottom-right, cyan, normal (0, -1, 0)
   1.0, -1.0,  1.0,  1.0, 0.5, 0.0,  0.0, -1.0, 0.0,  // Top-right, orange, normal (0, -1, 0)
  -1.0, -1.0,  1.0,  0.6, 0.2, 0.8,  0.0, -1.0, 0.0,  // Top-left, purple, normal (0, -1, 0)

  // Right face (cyan, orange, purple, red)
   1.0, -1.0, -1.0,  0.0, 1.0, 1.0,  1.0, 0.0, 0.0,  // Bottom-left, cyan, normal (1, 0, 0)
   1.0,  1.0, -1.0,  1.0, 0.5, 0.0,  1.0, 0.0, 0.0,  // Top-left, orange, normal (1, 0, 0)
   1.0,  1.0,  1.0,  0.6, 0.2, 0.8,  1.0, 0.0, 0.0,  // Top-right, purple, normal (1, 0, 0)
   1.0, -1.0,  1.0,  1.0, 0.0, 0.0,  1.0, 0.0, 0.0,  // Bottom-right, red, normal (1, 0, 0)

  // Left face (green, yellow, blue, magenta)
  -1.0, -1.0, -1.0,  0.0, 1.0, 0.0,  -1.0, 0.0, 0.0,  // Bottom-left, green, normal (-1, 0, 0)
  -1.0,  1.0, -1.0,  1.0, 1.0, 0.0,  -1.0, 0.0, 0.0,  // Top-left, yellow, normal (-1, 0, 0)
  -1.0,  1.0,  1.0,  0.0, 0.0, 1.0,  -1.0, 0.0, 0.0,  // Top-right, blue, normal (-1, 0, 0)
  -1.0, -1.0,  1.0,  1.0, 0.0, 1.0,  -1.0, 0.0, 0.0,  // Bottom-right, magenta, normal (-1, 0, 0)
]);

export const cubeVertexData_white = new Float32Array([
  // Front face (red, green, blue, yellow)
  -1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  0.0, 0.0, 1.0,  // Bottom-left, red, normal (0, 0, 1)
   1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  0.0, 0.0, 1.0,  // Bottom-right, green, normal (0, 0, 1)
   1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  0.0, 0.0, 1.0,  // Top-right, blue, normal (0, 0, 1)
  -1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  0.0, 0.0, 1.0,  // Top-left, yellow, normal (0, 0, 1)

  // Back face (magenta, cyan, orange, purple)
  -1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  0.0, 0.0, -1.0,  // Bottom-left, magenta, normal (0, 0, -1)
   1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  0.0, 0.0, -1.0,  // Bottom-right, cyan, normal (0, 0, -1)
   1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  0.0, 0.0, -1.0,  // Top-right, orange, normal (0, 0, -1)
  -1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  0.0, 0.0, -1.0,  // Top-left, purple, normal (0, 0, -1)

  // Top face (red, green, blue, yellow)
  -1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  0.0, 1.0, 0.0,  // Bottom-left, red, normal (0, 1, 0)
   1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  0.0, 1.0, 0.0,  // Bottom-right, green, normal (0, 1, 0)
   1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  0.0, 1.0, 0.0,  // Top-right, blue, normal (0, 1, 0)
  -1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  0.0, 1.0, 0.0,  // Top-left, yellow, normal (0, 1, 0)

  // Bottom face (magenta, cyan, orange, purple)
  -1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  0.0, -1.0, 0.0,  // Bottom-left, magenta, normal (0, -1, 0)
   1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  0.0, -1.0, 0.0,  // Bottom-right, cyan, normal (0, -1, 0)
   1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  0.0, -1.0, 0.0,  // Top-right, orange, normal (0, -1, 0)
  -1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  0.0, -1.0, 0.0,  // Top-left, purple, normal (0, -1, 0)

  // Right face (cyan, orange, purple, red)
   1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  1.0, 0.0, 0.0,  // Bottom-left, cyan, normal (1, 0, 0)
   1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  1.0, 0.0, 0.0,  // Top-left, orange, normal (1, 0, 0)
   1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  1.0, 0.0, 0.0,  // Top-right, purple, normal (1, 0, 0)
   1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  1.0, 0.0, 0.0,  // Bottom-right, red, normal (1, 0, 0)

  // Left face (green, yellow, blue, magenta)
  -1.0, -1.0, -1.0,  1.0, 1.0, 1.0,  -1.0, 0.0, 0.0,  // Bottom-left, green, normal (-1, 0, 0)
  -1.0,  1.0, -1.0,  1.0, 1.0, 1.0,  -1.0, 0.0, 0.0,  // Top-left, yellow, normal (-1, 0, 0)
  -1.0,  1.0,  1.0,  1.0, 1.0, 1.0,  -1.0, 0.0, 0.0,  // Top-right, blue, normal (-1, 0, 0)
  -1.0, -1.0,  1.0,  1.0, 1.0, 1.0,  -1.0, 0.0, 0.0,  // Bottom-right, magenta, normal (-1, 0, 0)
]);

export const cubeVertexData_blue = new Float32Array([
  // **Top Face** (2 triangles)
  // First triangle
  -1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  0.0, 1.0, 0.0,  // Bottom-left, normal
   1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  0.0, 1.0, 0.0,  // Bottom-right, normal
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 1.0, 0.0,  // Top-right, normal

  // Second triangle
  -1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 1.0, 0.0,  // Top-left, normal
  -1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  0.0, 1.0, 0.0,  // Bottom-left, normal
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 1.0, 0.0,  // Top-right, normal

  // **Front Face** (Side Face 1) (2 triangles)
  // First triangle
  -1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 0.0, 1.0,  // Bottom-left, normal
   1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 0.0, 1.0,  // Bottom-right, normal
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 0.0, 1.0,  // Top-right, normal

  // Second triangle
  -1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 0.0, 1.0,  // Top-left, normal
  -1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 0.0, 1.0,  // Bottom-left, normal
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 0.0, 1.0,  // Top-right, normal

  // **Back Face** (Side Face 2) (2 triangles)
  // First triangle
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0,  // Bottom-left, normal
   1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0,  // Bottom-right, normal
   1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0,  // Top-right, normal

  // Second triangle
  -1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0,  // Top-left, normal
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0,  // Bottom-left, normal
   1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0,  // Top-right, normal

  // **Right Face** (Side Face 3) (2 triangles)
  // First triangle
   1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  1.0, 0.0, 0.0,  // Bottom-left, normal
   1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  1.0, 0.0, 0.0,  // Top-left, normal
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  1.0, 0.0, 0.0,  // Top-right, normal

  // Second triangle
   1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  1.0, 0.0, 0.0,  // Bottom-right, normal
   1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  1.0, 0.0, 0.0,  // Bottom-left, normal
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  1.0, 0.0, 0.0,  // Top-right, normal

  // **Left Face** (Side Face 4) (2 triangles)
  // First triangle
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  -1.0, 0.0, 0.0, // Bottom-left, normal
  -1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  -1.0, 0.0, 0.0, // Top-left, normal
  -1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  -1.0, 0.0, 0.0, // Top-right, normal

  // Second triangle
  -1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  -1.0, 0.0, 0.0, // Bottom-right, normal
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  -1.0, 0.0, 0.0, // Bottom-left, normal
  -1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  -1.0, 0.0, 0.0, // Top-right, normal

  // **Bottom Face** (2 triangles)
  // First triangle
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0, // Bottom-left, normal
   1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0, // Bottom-right, normal
   1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0, // Top-right, normal

  // Second triangle
  -1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0, // Bottom-left, normal
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0, // Bottom-left, normal
   1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0, // Top-right, normal
]);

export const cubeVertexData_white_without_normals = new Float32Array([
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



