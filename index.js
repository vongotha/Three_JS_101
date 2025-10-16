import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import getStarfield from "./src/getStarfield.js";
import { drawThreeGeo } from "./src/threeGeoJSON.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
//scene.fog = new THREE.FogExp2(0x000000, 0.3);
const laitColor = 0xF0F0F0;
scene.fog = new THREE.FogExp2(laitColor, 0.05);
const camera = new THREE.PerspectiveCamera(75, w / h, 1, 100);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 3;
controls.maxDistance = 4.9;

const geometry = new THREE.SphereGeometry(2);
geometry.color = 0x000000;
const lineMat = new THREE.LineBasicMaterial({ 
  color: 0x444444,
  transparent: true,
  opacity: 0.15,
});
const edges = new THREE.EdgesGeometry(geometry, 1);
const line = new THREE.LineSegments(edges, lineMat);
scene.add(line);

scene.background = new THREE.Color(laitColor);

const softWhite = 0xEEEEEE;

const ambientLight = new THREE.AmbientLight(softWhite, 0.8);
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(softWhite, 0.3); 
directionalLight.position.set(5, 5, 5); // Position de la source
scene.add(directionalLight);

const stars = getStarfield({ numStars: 1000, fog: false });
scene.add(stars);

// check here for more datasets ...
// https://github.com/martynafford/natural-earth-geojson
// non-geojson datasets: https://www.naturalearthdata.com/downloads/
fetch('./geojson/ne_110m_coastline.json')
  .then(response => response.text())
  .then(text => {
    const data = JSON.parse(text);
    const countries = drawThreeGeo({
      json: data,
      radius: 2,
      materialOptions: {
        color: 0x6666AA,
        transparent: true,
        opacity: 0.5
      },
    });
    scene.add(countries);
  });

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

animate();

function handleWindowResize () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);