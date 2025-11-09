import * as THREE from "three";
import { createGrid, createCircleTexture, animateColor } from "./src/functions.js";

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
  alpha: true // Make the canvas transparent
});
  // Set Background Color

  const milkyColor = new THREE.Color(0xF0F0F0); 
  renderer.setClearColor(0x000000, 0); // Transparent background);
  renderer.setSize( containerWidth, containerHeight );
  container.appendChild( renderer.domElement );

// Create the Grid
let range = 10;
let lineSegments = createGrid(range, 1.3);
scene.add(lineSegments);


// Generate the position of the points

const pointStep = 1.3;
const pointRange = 10;
const vertices = [];

for (let x = -pointRange; x <= pointRange; x += pointStep) {
  for (let z = -pointRange; z <= pointRange; z += pointStep) {
    
    vertices.push(x, 0, z);
  }
}
const pointGeometry = new THREE.BufferGeometry();
pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

// Make Points Material and Points Object on:hover animation

const pointCount = vertices.length / 3;
const colors = [];
const baseColor = new THREE.Color('#808080');

for (let i = 0; i < pointCount; i++) {
  colors.push(baseColor.r, baseColor.g, baseColor.b);
}

pointGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// Create the Points

const circleTexture = createCircleTexture('#808080');

const pointsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 15,
  sizeAttenuation: true,
  alphaTest: 0.5,
  vertexColors: true,
  map: circleTexture,
})

const interSectionPoints = new THREE.Points(pointGeometry, pointsMaterial);
scene.add(interSectionPoints);

// Position the Camera
camera.position.set(0, 10, 0);
camera.lookAt(0, 0, 0);

// ANIMATION AVEC GSAP    

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

const highlightColor = new THREE.Color(0xFF8000);
const initialColor = new THREE.Color(0x808080); // À initialiser une seule fois
let currentIntersectedIndex = -1;

raycaster.params.Points.threshold = 0.3;

window.addEventListener('mousemove', (event) => {
  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
});

function animate() {
  requestAnimationFrame( animate );

  raycaster.setFromCamera( pointer, camera );

  const intersects = raycaster.intersectObject( interSectionPoints );
  const colors = pointGeometry.attributes.color;


  if (intersects.length > 0) {
    const index = intersects[0].index;

    // alert('Point ciblé, index : ' + index);

    if (index !== currentIntersectedIndex) {
      // Logique animation GSAP ici
      if (currentIntersectedIndex !== -1) {
        animateColor(colors, currentIntersectedIndex, initialColor);
      }


      animateColor(colors, index, highlightColor);

      currentIntersectedIndex = index;
    }
  } else {

    if (currentIntersectedIndex !== -1) {
      animateColor(colors, currentIntersectedIndex, initialColor);
      currentIntersectedIndex = -1;
    }
  }
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