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
  // Front face (blue)
  -1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 0.0, 1.0,
   1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 0.0, 1.0,
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 0.0, 1.0,
  -1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 0.0, 1.0,
 
  // Back face (blue)
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  0.0, 0.0, -1.0,
   1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  0.0, 0.0, -1.0,
   1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  0.0, 0.0, -1.0,
  -1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  0.0, 0.0, -1.0,
 
  // Top face (blue)
  -1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  0.0, 1.0, 0.0,
   1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  0.0, 1.0, 0.0,
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 1.0, 0.0,
  -1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  0.0, 1.0, 0.0,
 
  // Bottom face (blue)
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0,
   1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0,
   1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0,
  -1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  0.0, -1.0, 0.0,
 
  // Right face (blue)
   1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  1.0, 0.0, 0.0,
   1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  1.0, 0.0, 0.0,
   1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  1.0, 0.0, 0.0,
   1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  1.0, 0.0, 0.0,
 
  // Left face (blue)
  -1.0, -1.0, -1.0,  0.0, 0.5, 1.0,  -1.0, 0.0, 0.0,
  -1.0,  1.0, -1.0,  0.0, 0.5, 1.0,  -1.0, 0.0, 0.0,
  -1.0,  1.0,  1.0,  0.0, 0.5, 1.0,  -1.0, 0.0, 0.0,
  -1.0, -1.0,  1.0,  0.0, 0.5, 1.0,  -1.0, 0.0, 0.0,
 ]);

export const cubeVertexCount = cubeVertexData_white.length / 9;
export const cubeIndices = new Uint16Array([
  // Front face
  0, 1, 2,
  0, 2, 3,

  // Back face
  4, 5, 6,
  4, 6, 7,

  // Top face
  8, 9, 10,
  8, 10, 11,

  // Bottom face
  12, 13, 14,
  12, 14, 15,

  // Right face
  16, 17, 18,
  16, 18, 19,

  // Left face
  20, 21, 22,
  20, 22, 23
]);

