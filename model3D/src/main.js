import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';


const canvas = document.querySelector('#c');
/** Cube Patern **/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load Textures
const CubetextureLoader_one = new THREE.TextureLoader();
const colorTexture = CubetextureLoader_one.load('src/assets/textures/metal_1_Texture/Metal054B_1K-JPG_Color.jpg');
const normalTexture = CubetextureLoader_one.load('src/assets/textures/metal_1_Texture/Metal054B_1K-JPG_NormalDX.jpg');
const roughnessTexture = CubetextureLoader_one.load('src/assets/textures/metal_1_Texture/Metal054B_1K-JPG_Roughness.jpg');
const metalnessTexture = CubetextureLoader_one.load('src/assets/textures/metal_1_Texture/Metal054B_1K-JPG_Metalness.jpg');

const cubeTextureMaterial_one = new THREE.MeshStandardMaterial({
    map: colorTexture,
    normalMap: normalTexture,
    roughness: roughnessTexture,
    metalnessMap: metalnessTexture
});

// Create the cube geometry and material with textures
const geometry = new THREE.BoxGeometry(1, 1, 1);
const cube = new THREE.Mesh(geometry, cubeTextureMaterial_one);
scene.add(cube);

// Add Edges to the Cube
const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff }); // Corrected hex code
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

/** Add background lines **/
const lines = [];
const lineGroupMaterial = new THREE.LineBasicMaterial({
    color: 0x00ff00,
    emissive: 0x00ff00,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending
});

const lineSpacing = 0.5;
const numLines = 5;
const totalWidth = 6;
const fadeDistance = 4;

for (let i = 0; i < numLines; i++) {
    const normalizedPosition = i / (numLines - 1);
    const xOffset = totalWidth * (0.5 - Math.abs(normalizedPosition - 0.5));
    const points = [];
    points.push(new THREE.Vector3(-xOffset, -1.2 + i * lineSpacing, -20));
    points.push(new THREE.Vector3(xOffset, -1.2 + i * lineSpacing, -20));
    const lineGroupGeometry = new THREE.BufferGeometry().setFromPoints(points);
    const lineGroup = new THREE.Line(lineGroupGeometry, lineGroupMaterial);
    scene.add(lineGroup);
    lines.push(lineGroup);
}

// Adding Lights to The scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Initial camera position
camera.position.z = 3;

function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    for (const line of lines) {
        line.position.z += 0.2;
        const distanceToCube = Math.abs(line.position.z - cube.position.z);
        if (distanceToCube < fadeDistance) {
            line.material.opacity = 1 - (distanceToCube / fadeDistance);
        } else {
            line.material.opacity = 1;
        }
        if (line.position.z > 5) {
            line.position.z = -20;
        }
    }

    renderer.render(scene, camera);
    label2D.render(scene, camera);
}

renderer.setAnimationLoop(animate);