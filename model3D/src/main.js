import * as THREE from 'three';
import { CSS2DObject, CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { Const } from 'three/tsl';


const canvas = document.querySelector('#c');
/** Cube Patern **/
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: canvas});
renderer.setPixelRatio(window.devicePixelRatio); // Match Renderer Size to Canvas Display Size
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

/* resizeRendererToDisplaySize */

function resizeRendererToDisplaySize (renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width = Math.floor(canvas.clientWidth * pixelRatio);
    const height = Math.floor(canvas.clientHeight * pixelRatio);
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}


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
label2D.domElement.style.pointerEvents = 'none'; //Unable OrbitControls behaviour
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

// Adding Lights to The scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

// Add An Orbit Control for our Scene

const controls = new OrbitControls(camera, renderer.domElement);

// Initial camera position & Update the controls
camera.position.z = 3;


function animate() {

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        
        // Also update the CSS2DRenderer size
        label2D.setSize(canvas.clientWidth, canvas.clientHeight); 
    }

    cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;

    controls.update();
    renderer.render(scene, camera);
    label2D.render(scene, camera);
}

renderer.setAnimationLoop(animate);

function onWindowREsize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    label2D.setSize(window.innerWidth, window.innerHeight);
}

// Add the debounce function before your event listener
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

window.addEventListener('resize', debounce(onWindowREsize, 250), false);