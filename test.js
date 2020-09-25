import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
import { FresnelShader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/shaders/FresnelShader.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';

// variables for event listeners
const beginBtn = document.querySelector('#btn-begin');
const overlay = document.querySelector('#overlay');
const threeJsWindow = document.querySelector('#three-js-container');
const popupWindow = document.querySelector('.popup-window');
const closeBtn = document.querySelector('#btn-close');

let spheres = [];
// var mouseX = 0, mouseY = 0;
// var windowHalfX = window.innerWidth / 2;
// var windowHalfY = window.innerHeight / 2;

// document.addEventListener( 'mousemove', onDocumentMouseMove, false );

// three.js functions
const main  = () => {

    const origin = 1000;

    const canvas = document.querySelector('#c');
    const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.target = new THREE.Vector3( 0, 0, 0 );
    camera.position.set( 0, 0, origin );

    //

    

    var path = "assets/Park2/";
    var format = '.jpg';
    var urls = [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
    ];

    var textureCube = new THREE.CubeTextureLoader().load( urls );

    const scene = new THREE.Scene();
    scene.background = textureCube;
    scene.fog = new THREE.FogExp2( 0xab2b2c , 0.00001 );

    var geometry = new THREE.SphereBufferGeometry( 100, 32, 16 );

    var shader = FresnelShader;
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
    } );

    




    // big environment sphere
    var sphereGeo = new THREE.SphereBufferGeometry( 500, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    sphereGeo.scale( - 100, 100, 100 );

    var texture = new THREE.TextureLoader().load( 'assets/sunset_red.jpeg' );
    var envMaterail = new THREE.MeshBasicMaterial( { map: texture, transparent: true, opacity: 0.8} );

    const womb = new THREE.Mesh( sphereGeo, envMaterail );

    scene.add( womb );

   
    for ( var i = 0; i < 500; i ++ ) {

        var mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

        womb.add( mesh );

        spheres.push( mesh );

    }

    const videoBubble = new THREE.Mesh( geometry, material );
    mesh.position.set(0, 0, 0);
    womb.add(videoBubble);


    //

    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );


    

    const resizeRendererToDisplaySize = (renderer) => {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
        renderer.setSize(width, height, false);
        }
        return needResize;
    }


    const render = () => {

        var timer = 0.00003 * Date.now();

        womb.rotation.y = timer*2;

        

        for ( var i = 0, il = spheres.length; i < il; i ++ ) {

            var sphere = spheres[ i ];

            sphere.position.x = 5000 * Math.cos( timer + i );
            sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );

        }
        
        if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        }
       

        requestAnimationFrame(render);
        renderer.setPixelRatio( window.devicePixelRatio ); 
        renderer.render(scene, camera);

        
    }

    renderer.render( scene, camera );
    requestAnimationFrame(render);
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

// function onDocumentMouseMove( event ) {

//     mouseX = ( event.clientX - windowHalfX ) * 10;
//     mouseY = ( event.clientY - windowHalfY ) * 10;

// }