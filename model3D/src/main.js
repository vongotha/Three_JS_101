import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

/** Cube Patern **/
// Creating a scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the cube geometry
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Create the materials for each face
const cubeFaceMaterials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Right side
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Left side
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Top side
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Bottom side
    new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Front side
    new THREE.MeshBasicMaterial({ color: 0x00ffff })  // Back side
];

// Create the single cube object with all materials
const cube = new THREE.Mesh(geometry, cubeFaceMaterials);
scene.add(cube); // Add only this single cube to the scene

// Add Edges to the Cube
const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const cubeEdges = new THREE.LineSegments(edges, lineMaterial);
cube.add(cubeEdges); // Add edges to the correct cube

/** Text Patern **/
const label2D = new CSS2DRenderer();
label2D.setSize(window.innerWidth, window.innerHeight);
label2D.domElement.style.position = 'absolute';
label2D.domElement.style.top = '0px';
document.body.appendChild(label2D.domElement);

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
    cube.add(label); // Add labels to the correct cube
}

/**  Add line to the scene **/

  // Add a blue LineBasicMaterial Line

  const circleLineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } )

  // Add some geometry with vertices

  const points = []
  points.push( new THREE.Vector3(-1, 0, 0) );
  points.push( new THREE.Vector3(0, 1, 0) );
  points.push( new THREE.Vector3(1, 0, 0) );

  const circleLinegeometry = new THREE.BufferGeometry().setFromPoints(points)

  // creating a line

  const circleLine = new THREE.Line(circleLinegeometry, circleLineMaterial)
  //scene.add(circleLine);

// /** Create a tubed semi Circle  */

  const path = new THREE.CurvePath();

  // Create an arc
  const arc = new THREE.ArcCurve(0,0,2,Math.PI,0,false);
  path.add(arc)

  const tubeGeometry =new THREE.TubeGeometry(path, 64,0.05,8,false);
  // Create a new Mesh for the thick Line
  const thickLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const thickLine = new THREE.Mesh(tubeGeometry, thickLineMaterial)

  scene.add(thickLine)
/** Add a group of line behind the cube**/

  const lineGroupMaterial = new THREE.MeshBasicMaterial({color: 0xaaaaaa});
  const lineSpacing = 0.5;

// Initial camera position
camera.position.z = 10;

// Loop Animation function
function animate() {
    // Cube Rotation
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;

    // Rendering!
    renderer.render(scene, camera);
    label2D.render(scene, camera);
}

// Start the animation loop
renderer.setAnimationLoop(animate);