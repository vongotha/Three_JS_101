import * as THREE from "three";


export function createGrid(range, step) {
    const linesMaterial = new THREE.LineBasicMaterial({ 
        color: 0x000000,
        linewidth: 1.3,
        opacity: 0.2,
        transparent: true 
    });
    const points = [];

    // Lignes horizontales et verticales
    for (let i = -range; i <= range; i += step) {
        // Lignes horizontales
        points.push(new THREE.Vector3(-range, 0, i));
        points.push(new THREE.Vector3(range, 0, i));
        // Lignes verticales
        points.push(new THREE.Vector3(i, 0, -range));
        points.push(new THREE.Vector3(i, 0, range));
    }

    const geometryLines = new THREE.BufferGeometry().setFromPoints(points);
    const lineSegments = new THREE.LineSegments(geometryLines, linesMaterial);
    
    // (Optionnel: recréez et retournez les points d'intersection aussi si vous voulez qu'ils s'adaptent)
    
    return lineSegments;
}

export function createCircleTexture(color) {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    
    // Dessiner le cercle
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();

    return new THREE.CanvasTexture(canvas);
}