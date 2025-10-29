import * as THREE from "three";
import { createGrid } from "./src/functions.js";
import { createCircleTexture } from "./src/functions.js";

// Take a container for the canva

const container = document.querySelector('.backgroundContainer');
// Mesurer la largeur et la hauteur du conteneur
const containerWidth = container.clientWidth;
const containerHeight = container.clientHeight;

// Three Init 

const scene = new THREE.Scene();

// THREE 2D Camera 

const scaleSize = 10;
const aspect2D = containerWidth / containerHeight;

const camera = new THREE.OrthographicCamera(
  scaleSize * aspect2D / -2,
  scaleSize * aspect2D / 2,
  scaleSize / 2,
  scaleSize / -2,
  1,
  1000
)
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
  // Set Background Color

  const milkyColor = new THREE.Color(0xF0F0F0); 
  renderer.setClearColor(milkyColor, 1);
  renderer.setSize( containerWidth, containerHeight );
  container.appendChild( renderer.domElement );

// Create the Grid
let range = 10;
let lineSegments = createGrid(range, 1.5);
scene.add(lineSegments);


// Generate the position of the points

const pointStep = 1.5;
const pointRange = 10;
const vertices = [];

for (let x = -pointRange; x <= pointRange; x += pointStep) {
  for (let z = -pointRange; z <= pointRange; z += pointStep) {
    
    vertices.push(x, 0, z);
  }
}
const pointGeometry = new THREE.BufferGeometry();
pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

// Create the Points

const circleTexture = createCircleTexture('#808080');

const pointsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 20,
  sizeAttenuation: true,
  alphaTest: 0.5,
  map: circleTexture,
})

const interSectionPoints = new THREE.Points(pointGeometry, pointsMaterial);
scene.add(interSectionPoints);

// Position the Camera
camera.position.set(0, 10, 0);
camera.lookAt(0, 0, 0);
function animate() {
  renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );

animate();

function handleWindowResize () {
  const newContainerWidth = container.clientWidth;
  const newContainerHeight = container.clientHeight;
  const newAspect = newContainerWidth / newContainerHeight;
  const frustumSize = 10;
  
  // 💡 Mise à jour de tous les paramètres de l'OrthographicCamera
  camera.left = frustumSize * newAspect / - 2;
  camera.right = frustumSize * newAspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = frustumSize / - 2;
  camera.updateProjectionMatrix();

  renderer.setSize(newContainerWidth, newContainerHeight);

  const newRange = (frustumSize * newAspect) / 2;

  if (newRange !== range) {
    range = newRange;
    scene.remove(lineSegments);
    lineSegments.geometry.dispose();
    lineSegments = createGrid(range, 1);
    scene.add(lineSegments);
  }
}
window.addEventListener('resize', handleWindowResize, false);