/**
 * WebGL Basis — type definitions
 */

export type PrimitiveType =
  | 'POINTS' | 'LINES' | 'LINE_LOOP' | 'LINE_STRIP'
  | 'TRIANGLES' | 'TRIANGLE_STRIP' | 'TRIANGLE_FAN';

/** Wireframe mode: drag vertex, deform face, scale face.
 *  Faces / Triangles mode: extrude face. */
export type InteractionMode = 'dragVertex' | 'deformFace' | 'scaleFace' | 'extrudeFace';

/** wireframe = edges + selectable points; points = only vertices (pick demo);
 *  faces = solid; triangles = 12 colored tris */
export type ViewMode = 'wireframe' | 'points' | 'faces' | 'triangles';

export type ProjectionType = 'perspective' | 'orthogonal';

export type Vec3 = number[] | Float32Array;
export type Mat4 = number[] | Float32Array;

export interface ShapeData {
  vertices: number[];
  colors: number[];
  pickColors: number[];
  indices: number[];
  indexCount: number;
  primitiveType: GLenum;
}

export interface BufferInfo {
  position: WebGLBuffer | null;
  color: WebGLBuffer | null;
  pickColor: WebGLBuffer | null;
  indices: WebGLBuffer | null;
}

export interface ShaderInfo {
  GLSLprogram: WebGLProgram;
  attribLocations: {
    vertexPosition: GLint;
    vertexColor: GLint;
    vertexPickColor: GLint;
  };
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation | null;
    modelViewMatrix: WebGLUniformLocation | null;
    uOffscreen: WebGLUniformLocation | null;
    diffuseColor: WebGLUniformLocation | null;
    uWireframe: WebGLUniformLocation | null;
  };
}

export interface UIState {
  projection: Mat4;
  modelview: Mat4;
  eye: Vec3;
  center: Vec3;
  angleX: number;
  angleY: number;
  zoomZ: number;
  interactionMode: InteractionMode;
  viewMode: ViewMode;
  projectionType: ProjectionType;
  zoom: number;
  // Vertex interaction
  selectedVertexIndex: number | null;
  hoveredVertexIndex: number | null;
  isDraggingVertex: boolean;
  cubeVertices: number[];
}
