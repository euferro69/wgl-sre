This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# WebGL SRE (Small Rendering Engine)

This is the documentation to a WebGL Small Rendering Engine created by Breno de Arruda Ferro

The purpose of this engine is to teach and help other people that also want to learn graphics programming to see the pain points that a learner go through when coding an engine from scratch.

Yes, refactoring your architecture to allow **better communication and modularity** between your `Camera`, `StaticMesh`, and `ShaderProgram` is a great idea. This approach will make your rendering pipeline more scalable and maintainable, especially as you add more features like lighting, multiple meshes, or additional camera modes.

Here's a suggested architecture:

---

### **Refactored Architecture**

The goal is to create an abstraction layer that allows reusable components and facilitates interaction between the **camera**, **meshes**, and **shaders**.

### **Key Concepts:**

1. **Object Class**:
    
    A base class that contains shared logic for objects in the scene (e.g., transformation matrices, shader references).
    
2. **StaticMesh**:
    
    Handles geometry (vertices, attributes) and draws the mesh.
    
3. **ShaderProgram**:
    
    A reusable program wrapper that compiles shaders, stores uniform/attribute locations, and provides methods to set uniforms (like projection matrices).
    
4. **Camera**:
    
    The camera will maintain its own matrices but will send them to a `ShaderProgram` when needed.
    
5. **Scene or Renderer Class** (Optional):
    
    Manages the camera, lights, meshes, and their interactions.
    

---

### **Refactored Class Relationships**

### 1. **Object3D Base Class**

All drawable objects (like `StaticMesh`) and the `Camera` can inherit from this class.

```jsx
javascript
CopyEdit
class Object3D {
  constructor() {
    this.position = [0, 0, 0];
    this.rotation = [0, 0, 0];
    this.scale = [1, 1, 1];
    this.modelMatrix = mat4.create();
  }

  // Update the model matrix based on position, rotation, and scale
  updateModelMatrix() {
    mat4.identity(this.modelMatrix);
    mat4.translate(this.modelMatrix, this.modelMatrix, this.position);
    mat4.rotateX(this.modelMatrix, this.modelMatrix, this.rotation[0]);
    mat4.rotateY(this.modelMatrix, this.modelMatrix, this.rotation[1]);
    mat4.rotateZ(this.modelMatrix, this.modelMatrix, this.rotation[2]);
    mat4.scale(this.modelMatrix, this.modelMatrix, this.scale);
  }
}

```

---

### 2. **ShaderProgram Class**

This wraps shader compilation and provides methods for setting uniforms.

```jsx
javascript
CopyEdit
class ShaderProgram {
  constructor(gl, vertexShaderSource, fragmentShaderSource) {
    this.gl = gl;
    this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);
    this.uniformLocations = {};
  }

  // Compile and link shaders
  createProgram(vsSource, fsSource) {
    const vs = this.compileShader(vsSource, this.gl.VERTEX_SHADER);
    const fs = this.compileShader(fsSource, this.gl.FRAGMENT_SHADER);

    const program = this.gl.createProgram();
    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error("Program link error: ", this.gl.getProgramInfoLog(program));
      return null;
    }
    return program;
  }

  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(
        "Shader compile error: ",
        this.gl.getShaderInfoLog(shader)
      );
      return null;
    }
    return shader;
  }

  // Use the program
  use() {
    this.gl.useProgram(this.program);
  }

  // Cache and set uniform locations
  setUniform(name, type, value) {
    if (!(name in this.uniformLocations)) {
      this.uniformLocations[name] = this.gl.getUniformLocation(
        this.program,
        name
      );
    }
    const location = this.uniformLocations[name];

    if (type === "mat4") {
      this.gl.uniformMatrix4fv(location, false, value);
    } else if (type === "vec3") {
      this.gl.uniform3fv(location, value);
    } else if (type === "float") {
      this.gl.uniform1f(location, value);
    }
  }
}

```

---

### 3. **StaticMesh Class**

The `StaticMesh` only handles geometry and attributes. It references the `ShaderProgram` for rendering.

```jsx
javascript
CopyEdit
class StaticMesh extends Object3D {
  constructor(gl, vertices, attributes, shaderProgram) {
    super();
    this.gl = gl;
    this.vertices = vertices;
    this.attributes = attributes;
    this.shaderProgram = shaderProgram;

    // Create vertex buffer
    this.buffer = this.createBuffer(vertices);
  }

  createBuffer(vertices) {
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    );
    return buffer;
  }

  draw(camera) {
    this.shaderProgram.use();

    // Pass matrices to the shader
    this.shaderProgram.setUniform("u_projectionMatrix", "mat4", camera.getProjectionMatrix());
    this.shaderProgram.setUniform("u_viewMatrix", "mat4", camera.getViewMatrix());
    this.shaderProgram.setUniform("u_modelMatrix", "mat4", this.modelMatrix);

    // Bind vertex buffer and set attributes
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.attributes.forEach(({ name, size, type, normalized, stride, offset }) => {
      const location = this.gl.getAttribLocation(this.shaderProgram.program, name);
      this.gl.vertexAttribPointer(location, size, type, normalized, stride, offset);
      this.gl.enableVertexAttribArray(location);
    });

    // Draw the object
    this.gl.drawArrays(this.gl.TRIANGLES, 0, this.vertices.length / 6);
  }
}

```

---

### 4. **Camera Class**

The camera manages the projection and view matrices.

```jsx
javascript
CopyEdit
class Camera extends Object3D {
  constructor() {
    super();
    this.mode = "perspective";
    this.aspect = 16 / 9;
    this.fov = 45;
    this.near = 0.1;
    this.far = 100;

    this.projectionMatrix = mat4.create();
    this.viewMatrix = mat4.create();
    this.updateProjectionMatrix();
    this.updateViewMatrix();
  }

  setMode(mode) {
    this.mode = mode;
    this.updateProjectionMatrix();
  }

  updateProjectionMatrix() {
    if (this.mode === "perspective") {
      mat4.perspective(
        this.projectionMatrix,
        (this.fov * Math.PI) / 180,
        this.aspect,
        this.near,
        this.far
      );
    } else if (this.mode === "orthographic") {
      mat4.ortho(
        this.projectionMatrix,
        -10,
        10,
        -10,
        10,
        this.near,
        this.far
      );
    }
  }

  updateViewMatrix() {
    mat4.lookAt(this.viewMatrix, this.position, this.target, [0, 1, 0]);
  }

  getProjectionMatrix() {
    return this.projectionMatrix;
  }

  getViewMatrix() {
    return this.viewMatrix;
  }
}

```

---

### **How It All Ties Together**

```jsx
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
  mesh.draw(camera); // Mesh uses camera's matrices
  requestAnimationFrame(render);
}

render();

```

---

This refactored architecture creates a clear separation of concerns:

- **ShaderProgram**: Manages shaders and uniforms.
- **StaticMesh**: Handles geometry.
- **Camera**: Manages view and projection matrices.
- **Object3D**: Provides common transformation logic.

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

# Generalizes StaticMesh Class

Here’s the updated version of the class named `StaticMesh`, designed to handle **2D and 3D geometries** with flexible vertex data and attributes.

---

### **`StaticMesh` Class**

```jsx
export class StaticMesh {
  constructor(
    gl,
    vertexShaderSource,
    fragmentShaderSource,
    vertices,
    attributes,
    drawingOptions = { mode: this.gl.TRIANGLES, count: 3 },
    worldLocation = [0.0, 0.0, 0.0]
  ) {
    // GL
    this.gl = gl;
    this.program = this.createProgram(vertexShaderSource, fragmentShaderSource);

    // Attributes
    this.vertices = vertices;
    this.buffer = this.createBuffer(vertices);
    this.attributes = attributes;
    this.setupAttributes(this.attributes);

    // Drawing Options
    this.drawingOptions = drawingOptions;

    // Location
    this.worldLocation = worldLocation; // World location [x, y, z]
  }

  createProgram(vsSource, fsSource) {
    const vs = this.compileShader(vsSource, this.gl.VERTEX_SHADER);
    const fs = this.compileShader(fsSource, this.gl.FRAGMENT_SHADER);

    if (!vs || !fs) {
      console.error("Shaders failed to compile.");
      return null;
    }

    const program = this.gl.createProgram();
    this.gl.attachShader(program, vs);
    this.gl.attachShader(program, fs);
    this.gl.linkProgram(program);

    if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
      console.error(
        "Program link error: " + this.gl.getProgramInfoLog(program)
      );
      return null;
    }

    return program;
  }

  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    // Check if shader compiled successfully
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(
        "Shader compile error: " + this.gl.getShaderInfoLog(shader)
      );
      this.gl.deleteShader(shader); // Clean up in case of error
      return null; // Return null if compile fails
    }

    return shader;
  }

  createBuffer(vertices) {
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(vertices),
      this.gl.STATIC_DRAW
    );
    return buffer;
  }

  setupAttributes(attributes) {
    this.gl.useProgram(this.program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);

    attributes.forEach(({ name, size, type, normalized, stride, offset }) => {
      const location = this.gl.getAttribLocation(this.program, name);
      if (location === -1) {
        console.warn(`Attribute "${name}" not found in shader program.`);
        return;
      }
      this.gl.vertexAttribPointer(
        location,
        size,
        type,
        normalized,
        stride,
        offset
      );
      this.gl.enableVertexAttribArray(location);
    });

    const uLocation = this.gl.getUniformLocation(this.program, "u_location");
    if (uLocation === null) {
      console.warn('Uniform "u_location" not found in shader program.');
    }

    // Set the uniform value (world position of the object)
    this.gl.uniform3fv(uLocation, new Float32Array(this.worldLocation));
  }

  update() {}

  draw() {
    this.setupAttributes(this.attributes);

    // Draw the object
    this.gl.drawArrays(this.drawingOptions.mode, 0, this.drawingOptions.count);
  }
}

```

---

### **How It Works**

1. **Generalized Vertex Data**:
    - You pass an array of vertices with any format (e.g., positions, colors, normals, texture coordinates).
2. **Dynamic Attributes**:
    - The `attributes` parameter allows you to define how the vertex data should be interpreted (e.g., which parts are positions, colors, etc.).
3. **Reusable for 2D and 3D**:
    - Use the same class for both 2D (e.g., triangles, quads) and 3D (e.g., cubes, spheres).

---

### **Example: Drawing a Triangle**

### Vertex Shader (`vertexShaderSource`)

```glsl
attribute vec3 a_position;
attribute vec3 a_color;

varying vec3 v_color;

void main() {
  gl_Position = vec4(a_position, 1.0);
  v_color = a_color;
}
```

### Fragment Shader (`fragmentShaderSource`)

```glsl
precision mediump float;

varying vec3 v_color;

void main() {
  gl_FragColor = vec4(v_color, 1.0);
}
```

### JavaScript Code

```jsx
const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl');

// Vertex and Fragment Shaders
const vertexShaderSource = `...`;  // Insert the vertex shader here
const fragmentShaderSource = `...`;  // Insert the fragment shader here

// Vertex Data (Position + Color)
const vertices = [
  0.5,  0.5, 0.0,   1.0, 0.0, 0.0, // Top-right (Red)
  0.5, -0.5, 0.0,   0.0, 1.0, 0.0, // Bottom-right (Green)
 -0.5, -0.5, 0.0,   0.0, 0.0, 1.0  // Bottom-left (Blue)
];

// Attribute Definitions
const attributes = [
  { name: 'a_position', size: 3, type: gl.FLOAT, normalized: false, stride: 6 * Float32Array.BYTES_PER_ELEMENT, offset: 0 },
  { name: 'a_color',    size: 3, type: gl.FLOAT, normalized: false, stride: 6 * Float32Array.BYTES_PER_ELEMENT, offset: 3 * Float32Array.BYTES_PER_ELEMENT }
];

// Create and Draw the StaticMesh
const triangle = new StaticMesh(gl, vertexShaderSource, fragmentShaderSource, vertices, attributes);
triangle.draw(gl.TRIANGLES, 3);

```

---

### **Benefits of `StaticMesh`**

- **Reusable for Any Geometry**:
    - Define the vertex format once and reuse the class for triangles, quads, cubes, or custom 3D models.
- **Flexible Attributes**:
    - Supports custom layouts, such as position-only, position + color, position + texture coordinates, etc.
- **Dynamic Rendering**:
    - Easily change the draw mode (e.g., `TRIANGLES`, `LINES`, `POINTS`) by passing a different `mode` to `draw()`.

---

This `StaticMesh` class is now a robust and reusable foundation for rendering 2D/3D geometries in WebGL!

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
    
    ```jsx
    const vertices = [
      // X, Y, Z, R, G, B
       0.5,  0.5, 0.0,   1.0, 0.0, 0.0,  // Top-right (Red)
       0.5, -0.5, 0.0,   0.0, 1.0, 0.0,  // Bottom-right (Green)
      -0.5, -0.5, 0.0,   0.0, 0.0, 1.0   // Bottom-left (Blue)
    ];
    ```
    
5. **Create and Bind a Buffer**
    - Upload the vertex data to a GPU buffer:
    
    ```jsx
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    ```
    
6. **Set Up Attributes**
    - Define how to interpret the vertex data (e.g., positions and colors):
    
    ```jsx
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(positionLocation);
    
    const colorLocation = gl.getAttribLocation(program, 'a_color');
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(colorLocation);
    ```
    
7. **Use the Program**
    - Set the shader program as active:
    
    ```jsx
    gl.useProgram(program);
    ```
    
8. **Render the Geometry**
    - Draw the vertices using `gl.drawArrays`:
    
    ```jsx
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

### **Class Integration**

The `StaticMesh` class provided earlier encapsulates all these steps for reusability. By following this flow, you can adapt it for any geometry, making it flexible for 2D or 3D rendering.

# Does each object have to have its own shader?

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

4o

# Render Loop
![image](https://github.com/user-attachments/assets/d16e60c3-29b5-44fd-858e-8812db808386)
