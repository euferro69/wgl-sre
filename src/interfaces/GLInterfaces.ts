export interface VertexAttributeDefinition {
  name: string; // Attribute name (e.g., "a_position")
  size: number; // Number of components (e.g., 3 for vec3)
  type: GLenum; // WebGL type (e.g., gl.FLOAT)
  normalized: boolean; // Whether the data is normalized
  stride: number; // Offset between consecutive vertex attributes
  offset: number; // Byte offset for this attribute
}
