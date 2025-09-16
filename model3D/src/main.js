import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';

/** Cube Patern **/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create the cube geometry and materials
const geometry = new THREE.BoxGeometry(1, 1, 1);
const cubeFaceMaterials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Right side
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Left side
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // Top side
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // Bottom side
    new THREE.MeshBasicMaterial({ color: 0xff00ff }), // Front side
    new THREE.MeshBasicMaterial({ color: 0x00ffff })  // Back side
];
const cube = new THREE.Mesh(geometry, cubeFaceMaterials);
scene.add(cube);

// Add Edges to the Cube
const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const cubeEdges = new THREE.LineSegments(edges, lineMaterial);
cube.add(cubeEdges);

/** Text Patern **/
const label2D = new CSS2DRenderer();
label2D.setSize(window.innerWidth, window.innerHeight);
label2D.domElement.style.position = 'absolute';
label2D.domElement.style.top = '0px';
document.body.appendChild(label2D.domElement);

const textContent = ["Right", "Left", "Top", "Bottom", "Front", "Back"];
const facePositions = [
    new THREE.Vector3(0.5, 0, 0),
    new THREE.Vector3(-0.5, 0, 0),
    new THREE.Vector3(0, 0.5, 0),
    new THREE.Vector3(0, -0.5, 0),
    new THREE.Vector3(0, 0, 0.5),
    new THREE.Vector3(0, 0, -0.5)
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

/** Add a thick semi-circle **/
const path = new THREE.CurvePath();
const arc = new THREE.ArcCurve(0, 0, 2, Math.PI, 0, false);
path.add(arc);
const tubeGeometry = new THREE.TubeGeometry(path, 64, 0.05, 8, false);
const thickLineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const thickLine = new THREE.Mesh(tubeGeometry, thickLineMaterial);
thickLine.position.z = -2; // Move the thick line forward
scene.add(thickLine);

/** Add background lines **/
const lineGroupMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa });
const lineSpacing = 0.5;
for (let i = 0; i < 5; i++) {
    const points = [];
    points.push(new THREE.Vector3(-6, -1.2 + i * lineSpacing, -3)); // Adjust Z to be behind the cube
    points.push(new THREE.Vector3(6, -1.2 + i * lineSpacing, -3)); // Adjust Z to be behind the cube
    const lineGroupGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineGroup = new THREE.Line(lineGroupGeometry, lineGroupMaterial);
    scene.add(lineGroup);
}

// Initial camera position
camera.position.z = 5;

function animate() {
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
    renderer.render(scene, camera);
    label2D.render(scene, camera);
}

renderer.setAnimationLoop(animate);