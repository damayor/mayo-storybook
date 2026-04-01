/**
 * WebGL Basis - Type definitions
 * Modern TypeScript interfaces for the WebGL sketchup application
 */

export type PrimitiveType = 'POINTS' | 'LINES' | 'LINE_LOOP' | 'LINE_STRIP' | 'TRIANGLES' | 'TRIANGLE_STRIP' | 'TRIANGLE_FAN';

export type InteractionMode = 'selectClic' | '2ndClic' | '3rdClic';

export type ViewMode = 'edges' | 'faces';

export type ProjectionType = 'perspective' | 'orthogonal';

export type Vec3 = number[] | Float32Array;
export type Mat4 = number[] | Float32Array;

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

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
}

export interface PickerState {
  pickedVertex: number;
  pickPos: Vector3;
  renderedToPick: boolean;
}
