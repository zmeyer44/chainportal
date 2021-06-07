import "./style.css";

import * as THREE from "three";

import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

let camera, controls, scene, renderer, effect;

let sphere, plane, eth;

const start = Date.now();

init();
animate();

function init() {
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.y = 200;
  camera.position.z = 750;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0, 0, 0);

  const pointLight1 = new THREE.PointLight(0xffffff);
  pointLight1.position.set(500, 500, 500);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 0.25);
  pointLight2.position.set(-500, -500, -500);
  scene.add(pointLight2);

  sphere = new THREE.Mesh(
    new THREE.SphereGeometry(200, 20, 10),
    new THREE.MeshPhongMaterial({ flatShading: true })
  );
  //   scene.add(sphere);

  // instantiate a loader
  const loader = new OBJLoader();

  // load a resource
  loader.load(
    // resource URL
    "./Ethereum.obj",
    // called when resource is loaded
    function (object) {
      eth = object;
      scene.add(eth);
    },
    // called when loading is in progresses
    function (xhr) {
      console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    // called when loading has errors
    function (error) {
      console.log("An error happened");
    }
  );

  // Plane

  plane = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400),
    new THREE.MeshBasicMaterial({ color: 0xe0e0e0 })
  );
  plane.position.y = -200;
  plane.rotation.x = -Math.PI / 2;
  //   scene.add(plane);

  renderer = new THREE.WebGLRenderer();

  //   renderer = new THREE.WebGLRenderer({
  //     canvas: document.querySelector("#bg"),
  //   });
  renderer.setSize(window.innerWidth, window.innerHeight);

  effect = new AsciiEffect(renderer, " .:-+*=%@#", { invert: true });
  effect.setSize(window.innerWidth, window.innerHeight);
  effect.domElement.style.color = "white";
  effect.domElement.style.backgroundColor = "black";

  // Special case: append effect.domElement, instead of renderer.domElement.
  // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

  document.body.appendChild(effect.domElement);

  controls = new TrackballControls(camera, effect.domElement);

  //

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  effect.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  const timer = Date.now() - start;

  eth.position.y = Math.abs(Math.sin(timer * 0.002)) * 130 - 100;
  eth.rotation.y = Math.sin(timer * 0.001) * 0.5;
  //   eth.rotation.x = Math.sin(timer * 0.001) * 0.5;
  eth.rotation.z = Math.sin(timer * 0.003) * 0.07;

  controls.update();

  effect.render(scene, camera);
}
