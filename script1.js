import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';
import { FresnelShader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/shaders/FresnelShader.js';

// variables for event listeners
const beginBtn = document.querySelector('#btn-begin');
const overlay = document.querySelector('#overlay');
const threeJsWindow = document.querySelector('#three-js-container');
const popupWindow = document.querySelector('.popup-window');
const closeBtn = document.querySelector('#btn-close');

var spheres = [];
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


// three.js functions
const main  = () => {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set( 0, 0, 0 );

    const scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xCB4335);
    // scene.fog = new THREE.FogExp2( 0xCB4335, 0.0001 );
    

    const controls = new OrbitControls( camera, canvas );
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 100;
    controls.maxDistance = 500;

    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
    }
    {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(1, -2, -4);
        scene.add(light);
    }
    {
        const color = 0xFFFFFF;
        const intensity = 0.5;
        const light = new THREE.AmbientLight(color, intensity);
        scene.add(light);
    }

    var geometry = new THREE.SphereBufferGeometry( 100, 32, 16 );

    var material = new THREE.MeshPhongMaterial( {
        color: 0xCB4335, shininess: 3
    } );

    var Orbgeometry = new THREE.BoxBufferGeometry(100, 100, 100);
    var CentralOrb = new THREE.Mesh( Orbgeometry, new THREE.MeshBasicMaterial( 0x000000 ) );
    scene.add(CentralOrb);
    CentralOrb.position.set(100, 100, -100);
    camera.lookAt(100, 100, -100);

    for ( var i = 0; i < 500; i ++ ) {

        var mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

        scene.add( mesh );

        spheres.push( mesh );

    }


    

    const resizeRendererToDisplaySize = (renderer) => {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
        renderer.setSize(width, height, false);
        renderer.setPixelRatio( window.devicePixelRatio );
        }
        return needResize;
    }


    const render = (time) => {    
        
        var timer = 0.0001 * Date.now();        

        if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        }

        for ( var i = 0, il = spheres.length; i < il; i ++ ) {

            var sphere = spheres[ i ];

            sphere.position.x = 5000 * Math.cos( timer + i );
            sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

        }

        requestAnimationFrame(render); 
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.render(scene, camera);
        controls.update();

        
    }

    requestAnimationFrame(render);
}

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX ) * 10;
    mouseY = ( event.clientY - windowHalfY ) * 10;

}


// event listeners
beginBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    threeJsWindow.style.display = 'block';
    main();
});

closeBtn.addEventListener('click', () => {
    popupWindow.classList.add('hide');
    setTimeout(() => {
        popupWindow.style.display = 'none';
    }, 1000);
})