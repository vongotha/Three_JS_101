import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
/** Cube Patern **/
// Creating a scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement);


// Creating the cube
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );


// Add a color to each Faces of The cube

const cubeFaceMaterials = [
  new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Red (Right)
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Green (Left)
  new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Blue (Top)
  new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Yellow (Bottom)
  new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Magenta (Front)
  new THREE.MeshBasicMaterial({ color: 0x00ffff }), // Cyan (Back)
];

const geometryFaces = new THREE.BoxGeometry(1,1,1)
const cubeFaces = new THREE.Mesh(geometryFaces, cubeFaceMaterials)
scene.add( cube );
//scene.add( cubeFaces );
camera.position.z = 5;
renderer.setAnimationLoop( animate );

// Add Edges to the Cube

const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const cubeEdges = new THREE.LineSegments(edges, lineMaterial);
cube.add(cubeEdges);

/** Text Patern **/

// Instantate the css2Drenderer
const label2D = new CSS2DRenderer();
label2D.setSize(window.innerWidth, window.innerHeight)
label2D.domElement.style.position = 'absolute';
label2D.domElement.style.top = '0px';
document.body.appendChild(label2D.domElement)

// Create a Text label for each face of the cube

const textContent = ["Right", "Left", "Top", "Bottom", "Front", "Back"];
const facePositions = [
    new THREE.Vector3(0.5, 0, 0), // Right face
    new THREE.Vector3(-0.5, 0, 0), // Left face
    new THREE.Vector3(0, 0.5, 0), // Top face
    new THREE.Vector3(0, -0.5, 0), // Bottom face
    new THREE.Vector3(0, 0, 0.5), // Front face
    new THREE.Vector3(0, 0, -0.5) // Back face
];

for (let i = 0; i < 6; i++) {
    const div = document.createElement('div');
    div.className = 'label';
    div.textContent = textContent[i];
    div.style.backgroundColor = 'rgba(41, 34, 34, 0.57)';
    div.style.color = 'white';
    div.style.padding = '5px';
    div.style.borderRadius = '3px';

    const label = new CSS2DObject(div);
    label.position.copy(facePositions[i]);
    cube.add(label);
}


// Loop Animate function
function animate() {
  // Cube Rotation
  cube.rotation.x += .01;
  cube.rotation.y += .01;

  // rendering !
  renderer.render( scene, camera );
  label2D.render(scene, camera)
}