import {
  Scene,
  Color,
  PerspectiveCamera,
  BoxBufferGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Mesh,
  BoxGeometry,
  ShapeGeometry,
  Shape,
  CylinderGeometry,
  SphereGeometry,
  ExtrudeGeometry,
  WebGLRenderer,
  DirectionalLight,
  HemisphereLight,
  AmbientLight,
  TextureLoader,
  sRGBEncoding
} from "three";
import * as THREE from "three";
import CSG from "../three-csg.js";
import OrbitControls from "three-orbitcontrols";
import { getGPUTier } from "detect-gpu";

const gpu = getGPUTier();
console.log(gpu);

let container;
let camera;
let renderer;
let scene;
let mesh;
let controls;

function init() {
  container = document.querySelector("#scene-container");

  // Creating the scene
  scene = new Scene();
  scene.background = new Color("skyblue");

  createCamera();
  createLights();
  // createMeshes();
  createControls();
  createRenderer();
  test();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createCamera() {
  const fov = 35;
  const aspect = container.clientWidth / container.clientHeight;
  const near = 0.1;
  const far = 100;
  camera = new PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(-5, 2, 5);
}

function createLights() {
  const mainLight = new DirectionalLight(0xffffff, 5);
  mainLight.position.set(10, 10, 10);

  const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 5);
  scene.add(mainLight, hemisphereLight);
}

/*function createMeshes() {
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load("./src/uv_test_bw_1024.png");
  texture.encoding = sRGBEncoding;
  texture.anisotropy = 16;


  var length = 14,
    width = 2,
    deg = 10,
    thickness = 0.3;
  const rad = (deg * Math.PI) / 180;
  const offset = Math.min(Math.tan(rad) * width, length / 2);

  const shape = new Shape();
  shape.moveTo(0, 0);
  shape.lineTo(offset, width);
  shape.lineTo(length - offset, width);
  shape.lineTo(length, 0);
  shape.lineTo(0, 0);

  const extrudeSettings = {
    steps: 1,
    depth: thickness,
    bevelEnabled: false
  };

  const geometry = new ExtrudeGeometry(shape, extrudeSettings);
  const material = new MeshStandardMaterial({ color: 0xffaa00 });
  const mesh = new Mesh(geometry, material);
  scene.add(mesh);
  mesh.position.set(-length / 2, -1, 0);
}*/

function test() {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(2, 2, 2),
    new THREE.MeshNormalMaterial()
  );
  // make a sphere mesh
  const sphere = new THREE.Mesh(new THREE.SphereGeometry(1.2, 30, 30));

  box.position.set(0, 0, 0);
  sphere.position.set(0, 0, 0);
  // Make sure the .matrix of each mesh is current
  box.updateMatrix();
  sphere.updateMatrix();

  // perform operations on the meshes
  const subRes = CSG.union(box, sphere);

  // scene.add(subRes, unionRes, interRes);
}

function createRenderer() {
  renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}

function createControls() {
  controls = new OrbitControls(camera, container);
}

function update() {
  // mesh.rotation.x += 0.01;
  // mesh.rotation.y += 0.01;
  // mesh.rotation.z += 0.01;
}

function render() {
  renderer.render(scene, camera);
}

init();

function onWindowResize() {
  camera.aspect = container.clientWidth / container.clientHeight;

  // Update camera frustum
  camera.updateProjectionMatrix();

  renderer.setSize(container.clientWidth, container.clientHeight);
}
window.addEventListener("resize", onWindowResize, false);
