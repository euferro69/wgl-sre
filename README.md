# Blue Engine (WebGL)

This is the documentation to a WebGL small rendering engine called Blue Engine created by Breno de Arruda Ferro

The purpose of this engine is to teach and help other people that also want to learn graphics programming to see the pain points that a learner go through when coding an engine from scratch.

Yes, refactoring your architecture to allow **better communication and modularity** between your `Camera`, `StaticMesh`, and `ShaderProgram` is a great idea. This approach will make your rendering pipeline more scalable and maintainable, especially as you add more features like lighting, multiple meshes, or additional camera modes.

Here's a suggested architecture:

---

### **Refactored Architecture**

The goal is to create an abstraction layer that allows reusable components and facilitates interaction between the **camera**, **meshes**, and **shaders**.

### **Key Concepts:**
    
1. **StaticMesh**:
    
    Handles geometry (vertices, attributes) and draws the mesh.
    
2. **ShaderProgram**:
    
    A reusable program wrapper that compiles shaders, stores uniform/attribute locations, and provides methods to set uniforms (like projection matrices).
    
3. **Camera**:
    
    The camera will maintain its own matrices but will send them to a `ShaderProgram` when needed.
    
4. **Renderer**:
    
    Manages the world containing cameras, lights, meshes, and their interactions.
---

### **Refactored Class Relationships**

### 1. **ShaderProgram Class**

This wraps shader compilation and provides methods for setting uniforms.

```ts
export interface IShaderProgram {
  // Method to use the shader program in WebGL
  use(): void;

  // Methods used for shader compilation process
  createShader(type: GLenum, source: string): WebGLShader;
  createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader
  ): WebGLProgram;

  getAttributeLocation(name: string): number;
  getUniformLocation(name: string): WebGLUniformLocation;
  setUniformMatrix4fv(name: string, value: mat4): void;
  setUniform1f(name: string, value: number): void;
  setUniform3fv(name: string, value: vec3): void;
  setUniform4fv(name: string, value: vec4): void;

  delete(): void; // Method to clean up the shader program
}
```

---

### 2. **Renderer Class**

The `StaticMesh` only handles geometry and attributes. It references the `ShaderProgram` for rendering.

```ts
export interface IRenderer {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  inputManager: IInputManager;

  lastTime: number; // Last frame time for FPS calculation
  loadedWorld: IWorld | null; // Loaded world to draw

  start(): void; // Method to start the rendering loop
  resizeCanvas(): void; // Method to resize the canvas and adjust WebGL viewport
  loadWorld(newWorld: IWorld): void // Changes the world to render at runtime
  // Render Loop
  load(): void; // Method to load shaders and objects into WebGL
  update(): void; // Method to update logic (could be used for animation)
  draw(): void;
}
```

---

### 2. **StaticMesh Class**

The `StaticMesh` only handles geometry and attributes. It references the `ShaderProgram` for rendering.

```ts
export interface IStaticMesh {
    gl: WebGLRenderingContext,
    vertices: Float32Array,
    attributes: VertexAttributeDefinition[],
    count: number,
    shaderProgram: IShaderProgram,
    mode: GLenum;
    
    draw(): void;
    // Update the vertex data and recreate the buffer
    updateVertices(newVertices: Float32Array): void;
    setShaderProgram(shaderProgram: IShaderProgram): void; // Set a custom shader program for this mesh
    setMode(mode: GLenum): void; // Change the rendering mode (e.g., gl.TRIANGLES, gl.LINES)
    
    // Clean up WebGL resources
    delete(): void;
}
```

---

### 4. **Camera**

The camera manages the projection and view matrices.

```ts
export interface ICamera {
  // Matrices
  projectionMatrix: mat4;
  viewMatrix: mat4;
  // Parameters
  position: vec3;
  target: vec3;
  up: vec3;
  fov: number; // Field of View in degrees (for perspective mode)
  aspect: number; // Aspect ratio
  near: number; // Near clipping plane
  far: number; // Far clipping plane
  mode: "perspective" | "orthographic";

  // Methods for setting camera properties
  setMode(mode: "perspective" | "orthographic"): void;
  setAspect(aspect: number): void;
  setPosition(position: vec3): void;
  setTarget(target: vec3): void;
  setFov(fov: number): void; // (for perspective mode only)

  getProjectionMatrix(): mat4;
  getViewMatrix(): mat4;
  getViewProjectionMatrix(): mat4; // Get the combined view-projection matrix

  rotate(axis: vec3, angle: number): void;
  moveForward(amount: number): void;
  moveRight(amount: number): void;
  moveUp(amount: number): void;
  roll(angle: number): void;
  lookAt(target: vec3): void;

  autoAdjustAspect(canvas: HTMLCanvasElement): void;
  logCameraState(): void;
}
```

---

### **How It All Ties Together**

```ts
javascript
CopyEdit
const shaderProgram = new ShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
const camera = new Camera();
camera.setMode("perspective");
camera.setPosition(0, 5, 10);
camera.setTarget(0, 0, 0);

const mesh = new StaticMesh(gl, vertices, attributes, shaderProgram);

// Render loop
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mesh.draw(); // Mesh uses camera's matrices

  requestAnimationFrame(render);
}

render();

```

---

This refactored architecture creates a clear separation of concerns:

- **ShaderProgram**: Manages shaders and uniforms.
- **Renderer**: Manages the rendering loop and update object properties in the world.
- **StaticMesh**: Handles geometry.
- **Camera**: Manages view and projection matrices.

---

### **Directional Light**

To use your DirectionalLight class and add it to the world while calculating lighting in the shader, you need to break the task into several steps:

1. **Define your light class (DirectionLight):** You already have the DirectionalLight class that represents a directional light source. This will need to be used to create the actual light object in your world scene.

2. **Add the light to the world:** You need to store and manage the light in your scene/world object. A common approach would be to have a list of lights in your world object, including all types of lights (point lights, directional lights, spotlights, etc.).

3. **Pass the light data to the shader:** In your rendering pipeline, you need to pass the light properties (like direction, color, intensity) to the shader. This can be done by setting uniforms in your shader program.

4. **Calculate the lighting in the shader:** In your GLSL shader, you would use the passed light properties to calculate the lighting (using models like Phong, Blinn-Phong, Lambertian, etc.).

## Step-by-Step Implementation
### **1. Define DirectionalLight Class (already done)**
Your DirectionalLight class looks good. It encapsulates the light's direction, color, intensity, and the optional shadow-casting feature.

```ts
import { IDirectionalLight } from "@/interfaces/EngineInterfaces";
import { vec3 } from "gl-matrix";

export default class DirectionLight implements IDirectionalLight {
  direction: vec3 = vec3.fromValues(1.0, 0.0, 0.0);
  color: vec3 = [1.0, 1.0, 1.0]; // White light by default
  intensity: number = 1;
  castShadows?: boolean = true;

  constructor(color: vec3, direction: vec3, intensity: number) {
    this.color = color;
    this.intensity = intensity;
    this.direction = direction;
  }
}
```

---

### **2. Add Lights to the World**
You would typically have a World or Scene class that manages all the lights and objects. You could create an array to hold all lights (in this case, we’ll just use directional lights for simplicity).

Here’s a basic example of how the World or Scene class might look:

```ts
import DirectionLight from "@/lights/DirectionLight"; // Assuming your light class is in a 'lights' folder

class World {
  lights: DirectionLight[] = [];

  constructor() {
    // Example: Add a directional light
    this.addLight(new DirectionLight([1.0, 1.0, 1.0], [0.0, -1.0, 0.0], 1.0));
  }

  addLight(light: DirectionLight) {
    this.lights.push(light);
  }
}
```

### **3. Pass Light Data to the Shader**
To calculate the lighting in the shader, we need to pass the light data (color, intensity, direction) to the fragment shader. Here's how you can pass the data to your shader using WebGL.

**Vertex Shader:**
Your vertex shader typically only needs to pass the position and normals (for lighting calculations).

```glsl
#version 300 es
in vec3 a_position;   // Vertex position
in vec3 a_normal;     // Vertex normal
uniform mat4 u_model; // Model matrix
uniform mat4 u_view;  // View matrix
uniform mat4 u_projection; // Projection matrix

out vec3 v_normal;    // Pass normal to fragment shader
out vec3 v_position;  // Pass position to fragment shader

void main() {
    v_normal = normalize(mat3(u_model) * a_normal); // Transform the normal
    v_position = (u_model * vec4(a_position, 1.0)).xyz; // Get world position
    gl_Position = u_projection * u_view * vec4(v_position, 1.0); // Transform vertex position to clip space
}
```

**Fragment Shader:**
Now in your fragment shader, you'll compute the lighting based on the directional light. This typically involves computing a dot product between the light's direction and the normal at the fragment.

```glsl
#version 300 es
precision highp float;

in vec3 v_normal;      // Normal from vertex shader
in vec3 v_position;    // Position from vertex shader
uniform vec3 u_lightDirection; // Direction of the light (normalized)
uniform vec3 u_lightColor;     // Color of the light
uniform float u_lightIntensity; // Intensity of the light
out vec4 fragColor;

void main() {
    // Normalize the normal and light direction
    vec3 norm = normalize(v_normal);
    vec3 lightDir = normalize(u_lightDirection);

    // Compute diffuse lighting using Lambert's cosine law
    float diffuse = max(dot(norm, -lightDir), 0.0);

    // Calculate the final color
    vec3 finalColor = u_lightColor * u_lightIntensity * diffuse;

    // Output the color
    fragColor = vec4(finalColor, 1.0);
}
```

---

### **4. Set Shader Uniforms in WebGL**
In your WebGL code, you need to pass the light information (direction, color, and intensity) to the shader.

Here’s how you can set the uniforms for your directional light in JavaScript:

```ts
function setLightingUniforms(gl: WebGLRenderingContext, shaderProgram: WebGLProgram, light: DirectionLight) {
  const lightDirectionLocation = gl.getUniformLocation(shaderProgram, "u_lightDirection");
  const lightColorLocation = gl.getUniformLocation(shaderProgram, "u_lightColor");
  const lightIntensityLocation = gl.getUniformLocation(shaderProgram, "u_lightIntensity");

  // Set the directional light uniforms
  gl.uniform3fv(lightDirectionLocation, light.direction); // Direction (as a vec3)
  gl.uniform3fv(lightColorLocation, light.color); // Color (as a vec3)
  gl.uniform1f(lightIntensityLocation, light.intensity); // Intensity (as a float)
}
```

---

### **5. Rendering Loop**
In the main rendering loop, you'll set the light data to the shaders before drawing the objects:

```ts
function renderScene(gl: WebGLRenderingContext, shaderProgram: WebGLProgram, world: World) {
  // Set the lighting uniforms for each light in the world
  world.lights.forEach(light => {
    setLightingUniforms(gl, shaderProgram, light);
  });

  // Continue with drawing your scene objects...
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw your objects here
  // For example:
  // gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
}
```
---

### **Summary:**
**Step 1:** Define the DirectionalLight class that holds the light's color, intensity, direction, and optional shadow property.
**Step 2:** Create a World or Scene class that stores the lights and passes them to the shaders.
**Step 3:** Pass the light data to your vertex and fragment shaders through uniforms.
**Step 4:** Calculate the lighting in the fragment shader (e.g., using diffuse lighting).
**Step 5:** Set the light uniforms in WebGL before rendering the scene.

### Enhancements:
You can add more lighting types (e.g., point lights, spotlights) to your scene.
To improve performance, you can dynamically adjust which lights affect specific objects based on distance, frustum, etc.
You can extend the lighting calculations to include specular highlights, ambient light, and shadow mapping for more advanced effects.

# Graphics Programming

**Graphics programming** is the process of using code to create and manipulate images, animations, and visual effects. It involves controlling how objects are drawn on the screen, using techniques like 3D modeling, shading, lighting, and texturing, often by leveraging the GPU through APIs like OpenGL, DirectX, or Vulkan.

![image](https://github.com/user-attachments/assets/17a2d895-2837-41ea-85eb-a981814a6aeb)

## Graphics APIs

Here are the most commonly used **graphics APIs** in modern development:

---

### **1. OpenGL**

- **Platform**: Cross-platform (Windows, macOS, Linux, mobile).
- **Use Cases**: General-purpose graphics programming (games, simulations, CAD).
- **Pros**: Widely supported, mature, and well-documented.
- **Cons**: Older design; less efficient compared to modern APIs.

---

### **2. Vulkan**

- **Platform**: Cross-platform (Windows, Linux, Android, etc.).
- **Use Cases**: High-performance graphics and compute applications (games, VR, professional tools).
- **Pros**: Low overhead, explicit control, better multi-threading.
- **Cons**: Steeper learning curve compared to OpenGL.

---

### **3. DirectX (Direct3D)**

- **Platform**: Windows and Xbox.
- **Use Cases**: Game development on Windows and Xbox platforms.
- **Pros**: Optimized for Windows; tightly integrated with Microsoft ecosystems.
- **Cons**: Platform-specific (not cross-platform).

---

### **4. Metal**

- **Platform**: Apple devices (macOS, iOS).
- **Use Cases**: Graphics and compute tasks for Apple platforms.
- **Pros**: Optimized for Apple hardware, modern API design.
- **Cons**: Apple-only.

---

### **5. WebGL**

- **Platform**: Web browsers (cross-platform).
- **Use Cases**: Browser-based 2D and 3D graphics.
- **Pros**: No installation required; works directly in web browsers.
- **Cons**: Limited to what browsers support; relies on OpenGL ES.

---

### **6. OpenGL ES**

- **Platform**: Mobile devices, embedded systems.
- **Use Cases**: Mobile games, AR/VR on devices like Android, iOS.
- **Pros**: Lightweight and optimized for mobile hardware.
- **Cons**: Simplified feature set compared to desktop OpenGL.

---

### **7. Unreal Engine & Unity Graphics APIs**

Although not standalone APIs, both engines let you choose underlying APIs like:

- Vulkan
- DirectX
- OpenGL
- Metal

These are common in game and app development.

---

### Quick Summary:

- **Cross-platform**: Vulkan, OpenGL, WebGL.
- **Windows-focused**: DirectX.
- **Apple-focused**: Metal.
- **Mobile**: OpenGL ES, Vulkan.

# Graphics Pipeline

![image](https://github.com/user-attachments/assets/85d08803-66ff-4e30-a0da-85817a5ec4f3)

The **graphics pipeline** is the sequence of steps or stages that a computer's GPU follows to transform raw data (such as vertices and textures) into the final rendered image that you see on the screen. It is a key concept in computer graphics, enabling the rendering of 2D and 3D scenes efficiently.

Modern graphics pipelines are typically implemented in hardware (the GPU) and are highly parallelized, making them incredibly fast. Here's an overview of the stages of the graphics pipeline:

---

### **Stages of the Graphics Pipeline**

1. **Application Stage** (CPU)
    - This stage runs on the **CPU** and is not part of the GPU pipeline itself.
    - Responsibilities:
        - Sending geometry data (vertices, textures, etc.) to the GPU.
        - Handling user input (e.g., mouse, keyboard).
        - Setting up transformation matrices, camera views, and lighting parameters.
        - Dispatching rendering commands (e.g., `glDrawArrays()` in WebGL or `vkCmdDraw()` in Vulkan).
2. **Vertex Processing** (GPU)
    - **Purpose**: Processes each vertex of the geometry individually.
    - Tasks:
        - Applies transformations to vertices (e.g., translation, rotation, scaling).
        - Converts coordinates from **model space** (local object coordinates) to **clip space**.
        - Outputs data such as transformed vertex positions, normals, and texture coordinates.
    - In **programmable pipelines**, this is implemented in the **vertex shader**.
        
        **Example:**
        
        ```glsl
        attribute vec3 a_position;
        uniform mat4 u_modelViewProjectionMatrix;
        void main() {
            gl_Position = u_modelViewProjectionMatrix * vec4(a_position, 1.0);
        }
        ```
        
3. **Primitive Assembly**
    - **Purpose**: Groups vertices into primitives (e.g., points, lines, triangles) based on the specified drawing mode (e.g., `GL_TRIANGLES` or `GL_LINES`).
    - Outputs primitives to the next stage.
4. **Rasterization**
    - **Purpose**: Converts primitives (triangles, lines) into **fragments**, which represent potential pixels on the screen.
    - Determines which pixels (fragments) on the screen are covered by each primitive.
    - Performs **perspective division** to map clip space coordinates to screen space.
    - Outputs fragments for further processing.
5. **Fragment Processing** (GPU)
    - **Purpose**: Processes each fragment generated by rasterization to determine its final color.
    - In **programmable pipelines**, this is implemented in the **fragment shader**.
    - Tasks:
        - Applies lighting calculations (e.g., Phong shading, physically based rendering).
        - Samples textures (e.g., applying colors or patterns from an image).
        - Implements effects like fog, shadows, and reflections.
        - Outputs a color for each fragment.
    - Example of a fragment shader:
        
        ```glsl
        precision mediump float;
        uniform sampler2D u_texture;
        varying vec2 v_texCoord;
        void main() {
            gl_FragColor = texture2D(u_texture, v_texCoord);
        }
        ```
        
6. **Fragment Tests and Blending**
    - **Purpose**: Determines if the fragment should be drawn or discarded based on various tests.
    - Tests include:
        - **Depth Test**: Checks if a fragment is in front of or behind other geometry.
        - **Stencil Test**: Applies masking rules for more advanced effects.
        - **Alpha Test**: Determines transparency and decides whether to discard fragments.
    - **Blending**: Combines the fragment’s color with the existing color in the framebuffer to create effects like transparency.
7. **Framebuffer Output**
    - **Purpose**: Stores the final image that will be displayed on the screen.
    - After all fragments are processed and tests/blending are applied, the results are written to the **framebuffer**.
    - The framebuffer is then sent to the screen for display.

---

### **Fixed vs Programmable Pipeline**

- **Fixed Function Pipeline**:
    - Older GPUs (before OpenGL 2.0) used a fixed pipeline where developers couldn't customize shaders. Instead, they configured predefined states and settings for transformations, lighting, and texturing.
- **Programmable Pipeline**:
    - Modern GPUs (OpenGL 2.0+, WebGL, Vulkan, DirectX 10+) allow developers to write custom shaders for the vertex and fragment stages, enabling greater flexibility and control over rendering.

---

### **Graphics Pipeline in Modern APIs**

Modern APIs like **Vulkan**, **DirectX 12**, and **Metal** offer explicit control over the pipeline stages, allowing developers to optimize for performance and flexibility. Older APIs like OpenGL and WebGL still abstract some of the pipeline's complexity.

---

### **Key Concepts in the Graphics Pipeline**

- **Vertex Shading**: Transforms vertices and computes attributes like normals or texture coordinates.
- **Rasterization**: Converts shapes into pixels.
- **Fragment Shading**: Computes the final color of each pixel.
- **Depth Testing**: Ensures proper occlusion between objects.
- **Blending**: Handles transparency and compositing effects.

---

### **Analogy**

Think of the graphics pipeline as a factory assembly line:

1. **Raw materials** (vertex data) are sent to the factory (GPU).
2. Each station (pipeline stage) processes the material, adding details or preparing it for the next step.
3. The final product (image) is assembled and sent to the display.

By understanding and controlling the pipeline, developers can create complex visuals, from realistic 3D scenes to abstract artistic effects.

# OpenGL API
Here’s a breakdown of which WebGL configurations need to be set **once** (global state) versus those that need to be set **every frame** (per-frame state):

---

### **Configurations to Set Once**

These are global settings that typically remain constant throughout the rendering lifecycle:

1. **Enable Depth Test**\
   Set this once as part of your WebGL initialization:

   ```javascript
   gl.enable(gl.DEPTH_TEST);
   ```

   Depth testing ensures proper handling of depth, and you usually don’t need to disable it unless rendering specific passes like 2D overlays.

2. **Set the Depth Function**\
   Configure the depth testing function only once unless you need to change how the depth comparison works:

   ```javascript
   gl.depthFunc(gl.LESS); // Default: closer fragments overwrite farther ones
   ```

3. **Set the Depth Range**\
   The default range of 0.0 to 1.0 is fine for most applications. Only set this once unless you need custom clipping:

   ```javascript
   gl.depthRange(0.0, 1.0);
   ```

4. **Enable Polygon Offset (Optional)**\
   If you use polygon offset for specific cases like avoiding z-fighting, set it once and keep it enabled:

   ```javascript
   gl.enable(gl.POLYGON_OFFSET_FILL);
   gl.polygonOffset(1.0, 1.0); // Configure it only once unless you need adjustments
   ```

5. **Enable Blending (if using transparency)**\
   Enable blending globally if you have transparency in your scene:

   ```javascript
   gl.enable(gl.BLEND);
   gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // Standard alpha blending
   ```

6. **Configure the WebGL Context**\
   When creating the WebGL context, request the depth buffer once:

   ```javascript
   const gl = canvas.getContext("webgl", { depth: true });
   ```

---

### **Configurations to Set Every Frame**

These need to be reset or updated every frame as part of your rendering loop:

1. **Clear Buffers**\
   Clear the depth and color buffers at the start of every frame:

   ```javascript
   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
   ```

2. **Update Shader Uniforms**\
   Update uniforms (e.g., transformation matrices, light properties, etc.) every frame as they depend on the current frame's state:

   ```javascript
   const location = gl.getUniformLocation(shaderProgram, "u_modelMatrix");
   gl.uniformMatrix4fv(location, false, modelMatrix);
   ```

3. **Bind Buffers**\
   Bind vertex buffers and attributes for the geometry being rendered. This is done for each object or geometry:

   ```javascript
   gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
   gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
   gl.enableVertexAttribArray(positionLocation);
   ```

4. **Draw Calls**\
   Perform a draw call for each object in your scene:

   ```javascript
   gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
   ```

5. **Handle Dynamic Polygon Offset (if needed)**\
   If you dynamically adjust polygon offset (e.g., for specific objects), update it every frame:

   ```javascript
   gl.polygonOffset(dynamicFactor, dynamicUnits);
   ```

6. **Set Depth Mask for Transparency**\
   If rendering transparent objects after opaque objects, update the depth mask:

   ```javascript
   gl.depthMask(true); // For opaque objects
   gl.depthMask(false); // For transparent objects
   ```

---

### **Summary Table**

| **Configuration**                                    | **Set Once**             | **Set Every Frame** |   |
| ---------------------------------------------------- | ------------------------ | ------------------- | - |
| `gl.enable(gl.DEPTH_TEST)`                           | ✅                        |                     |   |
| `gl.depthFunc(gl.LESS)`                              | ✅                        |                     |   |
| `gl.depthRange(0.0, 1.0)`                            | ✅                        |                     |   |
| `gl.enable(gl.BLEND)`                                | ✅                        |                     |   |
| `gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)` | ✅                        |                     |   |
| \`gl.clear(gl.COLOR\_BUFFER\_BIT                     | gl.DEPTH\_BUFFER\_BIT)\` |                     | ✅ |
| Shader Uniform Updates                               |                          | ✅                   |   |
| Buffer Binding and Attribute Setup                   |                          | ✅                   |   |
| Draw Calls                                           |                          | ✅                   |   |
| Depth Mask Updates for Transparency                  |                          | ✅                   |   |

By separating global state from per-frame state, you can optimize performance and avoid redundant WebGL calls.

---

# GLSL

In GLSL (OpenGL Shading Language), there are various types and qualifiers used to define variables and their roles within the shader pipeline. Below is an explanation of the main **data types** and **qualifiers**, including `varying`.

---

### **1. GLSL Data Types**

### **Scalar Types**

- `float`: A single-precision floating-point number (e.g., `3.14`, `0.5`).
- `int`: A signed integer (e.g., `42`, `7`).
- `bool`: A boolean value (`true` or `false`).

### **Vector Types**

Vectors are one-dimensional arrays of numbers.

- `vec2`: A 2-component vector of floats (e.g., `(x, y)`).
- `vec3`: A 3-component vector of floats (e.g., `(x, y, z)` for color or position).
- `vec4`: A 4-component vector of floats (e.g., `(x, y, z, w)` for homogeneous coordinates).

For integers and booleans:

- `ivec2`, `ivec3`, `ivec4`: Vectors of integers.
- `bvec2`, `bvec3`, `bvec4`: Vectors of booleans.

### **Matrix Types**

- `mat2`: A 2x2 matrix of floats.
- `mat3`: A 3x3 matrix of floats.
- `mat4`: A 4x4 matrix of floats.
Matrices are useful for transformations (e.g., scaling, rotation, projection).

### **Sampler Types**

Samplers are used for accessing textures in shaders.

- `sampler2D`: For 2D textures.
- `samplerCube`: For cube map textures.
- `sampler3D`: For 3D textures.

---

### **2. GLSL Qualifiers**

Qualifiers specify the role and scope of variables in the shader pipeline.

### **a) Input/Output Qualifiers**

These determine how data is passed between stages of the rendering pipeline.

- **`attribute`**:
    - Used in **vertex shaders** only.
    - Represents per-vertex input data (e.g., positions, colors, normals).
    - **Deprecated in WebGL2/GLSL 3.30+** (replaced by `in`).
    
    ```glsl
    attribute vec3 a_position;
    ```
    
- **`varying`**:
    - Used to pass data from the **vertex shader** to the **fragment shader**.
    - The vertex shader calculates values for each vertex, and the GPU interpolates them across the fragments (pixels).
    - **Deprecated in WebGL2/GLSL 3.30+** (replaced by `out` in vertex shaders and `in` in fragment shaders).
    
    ```glsl
    varying vec4 v_color; // Interpolated color passed to the fragment shader
    ```
    
- **`in`**:
    - Used for inputs to shaders.
    - Replaces `attribute` in vertex shaders and `varying` in fragment shaders (GLSL 3.30+).
    
    ```glsl
    in vec3 a_position; // Input to vertex shader
    ```
    
- **`out`**:
    - Used for outputs from shaders.
    - Replaces `varying` in vertex shaders.
    
    ```glsl
    out vec4 v_color; // Output to fragment shader
    ```
    

### **b) Storage Qualifiers**

- **`const`**:
    - A compile-time constant.
    - Its value cannot change after initialization.
    
    ```glsl
    const float PI = 3.14159;
    ```
    
- **`uniform`**:
    - Global variables that remain constant for all vertices/fragments during a draw call.
    - Typically used for passing data from the CPU to the shader (e.g., transformation matrices, time, light properties).
    
    ```glsl
    uniform mat4 u_modelViewMatrix;
    ```
    
- **`buffer`** (GLSL 4.30+):
    - Used to define buffer objects for reading and writing data.
- **`shared`** (GLSL 4.60+):
    - For shared variables in compute shaders.

### **c) Precision Qualifiers**

Used to define the precision of floating-point calculations (mainly relevant in fragment shaders).

- `highp`: High precision.
- `mediump`: Medium precision.
- `lowp`: Low precision.

```glsl
precision mediump float; // Set default precision for floats
```

### **d) Parameter Qualifiers**

- **`in`**: Input to a function.
- **`out`**: Output from a function.
- **`inout`**: Used as both input and output for a function.

```glsl
void transform(in vec3 position, out vec3 result) {
  result = position * 2.0;
}
```

---

### **3. Interpolation Modifiers**

Modifiers define how `varying` variables are interpolated.

- **`flat`**: No interpolation; the value from the provoking vertex is used.
- **`smooth`**: Default; values are interpolated across fragments.
- **`noperspective`**: No perspective correction applied during interpolation.

---

### Example GLSL Code with `varying`

### Vertex Shader:

```glsl
attribute vec4 a_position;
attribute vec4 a_color;

varying vec4 v_color;

void main() {
  gl_Position = a_position; // Transform the vertex position
  v_color = a_color;        // Pass color to the fragment shader
}
```

### Fragment Shader:

```glsl
precision mediump float;

varying vec4 v_color;

void main() {
  gl_FragColor = v_color; // Use the interpolated color
}
```

---

### Summary

- **`varying`** is used to pass interpolated data (e.g., color, texture coordinates) from the vertex shader to the fragment shader.
- With newer versions of GLSL, `varying` is replaced by `out` in vertex shaders and `in` in fragment shaders.
- GLSL provides rich data types (`vec`, `mat`, `sampler`) and qualifiers (`uniform`, `attribute`, `in/out`) to control how data flows between shaders and the CPU.
  
### **How It Works**

1. **Generalized Vertex Data**:
    - You pass an array of vertices with any format (e.g., positions, colors, normals, texture coordinates).
2. **Dynamic Attributes**:
    - The `attributes` parameter allows you to define how the vertex data should be interpreted (e.g., which parts are positions, colors, etc.).
3. **Reusable for 2D and 3D**:
    - Use the same class for both 2D (e.g., triangles, quads) and 3D (e.g., cubes, spheres).

---


### Fragment Shader (`fragmentShaderSource`)

```glsl
precision mediump float;

varying vec3 v_color;

void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
```

# Define Geometry (OpenGL)

Here’s a **step-by-step flow** for how to set up and define a geometry in WebGL, written in a simple and intuitive way. I'll break it down into the components and sequence needed.

---

### **Step-by-Step Flow**

1. **Create a WebGL Context**
    - First, you need access to WebGL from an HTML canvas element:
    
    ```jsx
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');
    ```
    
2. **Write Shaders**
    - A WebGL program is made up of two shaders:
        - **Vertex Shader**: Processes vertex data (positions, colors, etc.).
        - **Fragment Shader**: Determines pixel colors.
    
    Example:
    
    ```glsl
    // Vertex Shader
    const vertexShaderSource = `
      attribute vec3 a_position;
      attribute vec3 a_color;
      
      varying vec3 v_color;
    
      void main() {
        gl_Position = vec4(a_position, 1.0);
        v_color = a_color;
      }
    `;
    
    // Fragment Shader
    const fragmentShaderSource = `
      precision mediump float;
      
      varying vec3 v_color;
    
      void main() {
        gl_FragColor = vec4(v_color, 1.0);
      }
    `;
    
    ```
    
3. **Create and Link a Program**
    - Compile both shaders and attach them to a program, which links them together:
    
    ```jsx
    const program = gl.createProgram();
    
    function compileShader(gl, source, type) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        return null;
      }
      return shader;
    }
    
    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
    }
    
    ```
    
4. **Define Vertex Data**
    - Prepare the raw geometry data (e.g., positions, colors):
    
    ```js
    const vertices = [
      // X, Y, Z, R, G, B
       0.5,  0.5, 0.0,   1.0, 0.0, 0.0,  // Top-right (Red)
       0.5, -0.5, 0.0,   0.0, 1.0, 0.0,  // Bottom-right (Green)
      -0.5, -0.5, 0.0,   0.0, 0.0, 1.0   // Bottom-left (Blue)
    ];
    ```
    
5. **Create and Bind a Buffer**
    - Upload the vertex data to a GPU buffer:
    
    ```js
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    ```
    
6. **Set Up Attributes**
    - Define how to interpret the vertex data (e.g., positions and colors):
    
    ```js
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(positionLocation);
    
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(colorLocation);
    ```
    
7. **Use the Program**
    - Set the shader program as active:
    
    ```js
    gl.useProgram(program);
    ```
    
8. **Render the Geometry**
    - Draw the vertices using `gl.drawArrays`:
    
    ```js
    gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black background
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    ```
---

### **Summary**

Here’s the simplified flow:

1. **Create a WebGL context** from the canvas.
2. **Write vertex and fragment shaders** to process and color the geometry.
3. **Create and link a program** that combines the shaders.
4. **Define vertex data** for positions, colors, or other attributes.
5. **Create a buffer** and upload the vertex data to the GPU.
6. **Set up attributes** to define how the GPU should interpret the vertex data.
7. **Activate the program**.
8. **Draw the geometry** using WebGL commands.

---

# Does Each Object Have to Have its Own Shader?

Not necessarily! While each object **can** have its own shader if needed, you can reuse the same shader across multiple objects if they share similar rendering requirements. Here’s a breakdown to help you decide:

---

### **When to Reuse Shaders**

- **Objects Share the Same Visual Style**:
    - If multiple objects use the same lighting model, textures, or coloring logic, they can share the same shaders.
    - Example: Two cubes with different positions but identical lighting and material properties can use the same vertex and fragment shaders.
- **Efficiency**:
    - Reusing shaders reduces the overhead of compiling, linking, and switching programs frequently, improving performance.
- **Uniforms**:
    - If objects only differ in properties like position, color, or textures, you can pass these differences as **uniforms** to the shared shader program.

---

### **When to Use Separate Shaders**

- **Objects Have Different Rendering Requirements**:
    - Example:
        - Object A uses a flat color shader.
        - Object B uses a texture-mapped shader.
        - Object C uses a shader with lighting calculations.
- **Custom Effects**:
    - If some objects require special effects (e.g., water reflections, particle effects, or post-processing), you need separate shaders for those objects.

---

### **How to Handle Multiple Objects Efficiently**

1. **Shared Shader Program**:
    - Compile the shader program once and reuse it for all compatible objects.
2. **Pass Unique Data via Uniforms**:
    - For each object, pass unique data (like position, scale, rotation, material, etc.) to the shader using **uniforms**.
    
    ```jsx
    gl.uniformMatrix4fv(modelMatrixUniformLocation, false, modelMatrix);
    gl.uniform3f(colorUniformLocation, 1.0, 0.5, 0.0); // Different color for each object
    ```
    
3. **Object-Specific Attributes**:
    - Even if objects share shaders, each object can have its own vertex data (stored in separate buffers).

---

### **Example: Reusing a Shader for Multiple Objects**

Let’s say you want to draw two triangles with different colors but the same vertex and fragment shaders.

### Vertex Shader

```glsl
attribute vec3 a_position;

uniform mat4 u_modelMatrix;

void main() {
  gl_Position = u_modelMatrix * vec4(a_position, 1.0);
}
```

### Fragment Shader

```glsl
precision mediump float;

uniform vec3 u_color;

void main() {
  gl_FragColor = vec4(u_color, 1.0);
}
```

### JavaScript

```jsx
// Reuse the shader program
const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

// Triangle 1
const triangle1 = new StaticMesh(gl, program, vertices1, attributes);
triangle1.setUniforms({
  u_modelMatrix: modelMatrix1,
  u_color: [1.0, 0.0, 0.0], // Red
});
triangle1.draw(gl.TRIANGLES, 3);

// Triangle 2
const triangle2 = new StaticMesh(gl, program, vertices2, attributes);
triangle2.setUniforms({
  u_modelMatrix: modelMatrix2,
  u_color: [0.0, 1.0, 0.0], // Green
});
triangle2.draw(gl.TRIANGLES, 3);
```

---

### **Key Takeaways**

- **Reuse shaders** whenever objects share the same rendering logic.
- Use **uniforms** and **attributes** to pass object-specific data (e.g., position, color, material).
- Use separate shaders when objects require fundamentally different visual effects.

This approach ensures performance while maintaining flexibility!

# Render Loop
![image](https://github.com/user-attachments/assets/d16e60c3-29b5-44fd-858e-8812db808386)
