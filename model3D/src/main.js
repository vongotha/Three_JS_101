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
scene.add( cube );

camera.position.z = 5;

function animate() {
  renderer.render( scene, camera );
  cube.rotation.x += .02;
  label2D.render(scene, camera)
}
renderer.setAnimationLoop( animate );

/** Text Patern **/

// Instantate the css2Drenderer
const label2D = new CSS2DRenderer();
label2D.setSize(window.innerWidth, window.innerHeight)
label2D.domElement.style.position = 'absolute';
label2D.domElement.style.top = '0px';
document.body.appendChild(label2D.domElement)

// Create the Text Element

const textElement = document.createElement('div')
textElement.className = "label" 
textElement.textContent = "Cube Master"

const textLabel = new CSS2DObject(textElement)
textLabel.position.set(1,1,0);
scene.add(textLabel)