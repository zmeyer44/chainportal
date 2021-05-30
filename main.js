import "./style.css";

import * as THREE from "three";
import smoke from "./smoke.png";
import space from "./space.jpg";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
let cloudParticles = [];
let smokeParticles = [];
let Blocks = [];
let Stars = [];
let sceneLight = new THREE.DirectionalLight(0xffffff, 0.5);
sceneLight.position.set(0, 0, 1);
scene.add(sceneLight);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  10000
);

camera.position.z = 1400;
camera.rotation.y = 0.006;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.render(scene, camera);
particleSetup();

function particleSetup() {
  let loader = new THREE.TextureLoader();

  loader.load(smoke, function (texture) {
    let portalGeo = new THREE.PlaneBufferGeometry(350, 350);
    let portalMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
    });
    let smokeGeo = new THREE.PlaneBufferGeometry(1000, 1000);
    let smokeMaterial = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
    });

    for (let p = 880; p > 250; p--) {
      let particle = new THREE.Mesh(portalGeo, portalMaterial);
      particle.position.set(
        0.5 * p * Math.cos((4 * p * Math.PI) / 180),
        0.6 * p * Math.sin((4 * p * Math.PI) / 180),
        0.1 * p
      );
      particle.rotation.z = Math.random() * 360;
      cloudParticles.push(particle);
      scene.add(particle);
    }
    //for smoke
    for (let p = 0; p < 40; p++) {
      let particle = new THREE.Mesh(smokeGeo, smokeMaterial);
      particle.position.set(
        Math.random() * 1000 - 500,
        Math.random() * 400 - 200,
        25
      );
      particle.rotation.z = Math.random() * 360;
      particle.material.opacity = 0.3;
      smokeParticles.push(particle);
      scene.add(particle);
    }
  });
}

// Define the lights for the scene
var light = new THREE.PointLight(0xff00ff);
light.position.set(0, 0, 100);
scene.add(light);

const pointLight = new THREE.DirectionalLight(0xffffff, 0.25);
pointLight.position.set(2000, 50, 3000, 2);
// const pointLightHelper = new THREE.DirectionalLightHelper(pointLight, 100);
const blueLight = new THREE.PointLight(0x062d89, 30, 425, 1.7);
blueLight.position.set(0, 0, 250);

const orangeLight = new THREE.PointLight(0xcc6600, 1, 500, 1.7);
orangeLight.position.set(0, 0, 150);

const ambientLight = new THREE.AmbientLight(0xffffff, "0.25");
scene.add(pointLight, blueLight, orangeLight, ambientLight);
// scene.add(pointLightHelper);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function addBlock() {
  let size = 25 + Math.random() * 50;
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshStandardMaterial({ color: 0x101929 });
  material.metalness = 0.7;
  material.roughness = 0.2;

  const block = new THREE.Mesh(geometry, material);

  const [x, y] = Array(2)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(600));

  block.position.set(x, y);
  block.position.z = -100;
  block.rotation.y = 0.4;
  Blocks.push(block);
  scene.add(block);
}
function addStar() {
  const geometry = new THREE.SphereGeometry(5, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(2000));

  star.position.set(x, y, z);
  Stars.push(star);

  scene.add(star);
}

//Array(200).fill().forEach(addStar);

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;

const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  //X coor
  if (i % 3 == 0) {
    posArray[i] = THREE.MathUtils.randFloatSpread(3000);
  }
  //Y coor
  if (i % 3 == 1) {
    posArray[i] = THREE.MathUtils.randFloatSpread(3000);
  }
  //Z coor
  if (i % 3 == 2) {
    posArray[i] = THREE.MathUtils.randFloatSpread(3000);
  }
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(posArray, 3)
);

const particlesMesh = new THREE.Points(
  particlesGeometry,
  new THREE.PointsMaterial({ size: 0.05 })
);
scene.add(particlesMesh);

const spaceTexture = new THREE.TextureLoader().load(space);
scene.background = spaceTexture;

document.addEventListener("mousemove", animateParticles);

let mouseX = 0;
let mouseY = 0;

function animateParticles(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
}

// var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

// function onMouseOver(event) {
//   event.preventDefault();
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = (event.clientY / window.innerHeight) * 2 + 1;

//   raycaster.setFromCamera(mouse, camera);

//   var intersects = raycaster.intersectObjects(scene.children, true);

//   for (let i = 0; i < intersects.length; i++) {
//     console.log(intersects[i].object);
//     intersects[i].object.position.y += 100;
//   }
// }

// Follows the mouse event
function onMouseMove(event) {
  // Update the mouse variable
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Make the sphere follow the mouse
  var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  vector.unproject(camera);
  var dir = vector.sub(camera.position).normalize();
  var distance = -camera.position.z / dir.z;
  var pos = camera.position.clone().add(dir.multiplyScalar(distance));
  //mouseMesh.position.copy(pos);

  light.position.copy(new THREE.Vector3(pos.x, pos.y, pos.z + 500));
}

function animate() {
  cloudParticles.forEach((p) => {
    p.rotation.z -= 0.03;
  });
  smokeParticles.forEach((p) => {
    p.rotation.z -= 0.01;
  });
  if (Math.random() > 0.9) {
    blueLight.power = 350 + Math.random() * 500;
  }
  if (Math.random() > 0.75) {
    addBlock();
  }

  Blocks.forEach((p) => {
    p.position.z += 30;
    p.position.x += 14;
  });

  addStar();

  Stars.forEach((p) => {
    p.position.z += 5;
    p.position.x += 5;
  });

  particlesMesh.rotation.y += -mouseX * 0.00001;
  particlesMesh.rotation.x += -mouseY * 0.00001;

  // controls.update();

  requestAnimationFrame(animate);

  camera.position.z = 2000;
  camera.position.x = 600;

  renderer.render(scene, camera);
}
// When the mouse moves, call the given function
document.addEventListener("mousemove", onMouseMove, false);
window.addEventListener("resize", onWindowResize, false);
animate();
