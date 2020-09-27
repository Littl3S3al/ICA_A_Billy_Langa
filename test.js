import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
import { FresnelShader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/shaders/FresnelShader.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';

// variables for event listeners
const beginBtn = document.querySelector('#btn-begin');
const overlay = document.querySelector('#overlay');
const threeJsWindow = document.querySelector('#three-js-container');
const popupWindow = document.querySelector('.popup-window');
const closeBtn = document.querySelector('#btn-close');
const videoPlaceholder = popupWindow.querySelector('.video');

let spheres = [];

let newCycle = true;
let playwomb = true;
let iterations = 0;

// three.js functions
const main  = () => {

    console.log('begin');
    const origin = 1000;
    const markerz = 260;
    const markerxy = 800;
    const timeBet = 500;

    const canvas = document.querySelector('#c');
    const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.target = new THREE.Vector3( 0, 0, 0 );
    camera.position.set( 0, 0, origin );

    //

    

    // reflective surface for the bubles
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
    
    // variables for the bubbles
    var geometry = new THREE.SphereBufferGeometry( 100, 32, 16 );

    var shader = FresnelShader;
    var uniforms = THREE.UniformsUtils.clone( shader.uniforms );

    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
    } );

    

    // big environment sphere (womb)
    var sphereGeo = new THREE.SphereBufferGeometry( 500, 60, 40 );
    // invert the geometry on the x-axis so that all of the faces point inward
    sphereGeo.scale( - 100, 100, 100 );

    var texture = new THREE.TextureLoader().load( 'assets/sunset_red.jpeg' );
    var envMaterail = new THREE.MeshBasicMaterial( { map: texture, transparent: true, opacity: 0.8} );

    const womb = new THREE.Mesh( sphereGeo, envMaterail );

    scene.add( womb );


    // adding the randomised bubles
    for ( var i = 0; i < 500; i ++ ) {

        var mesh = new THREE.Mesh( geometry, material );

        mesh.position.x = Math.random() * 10000 - 5000;
        mesh.position.y = Math.random() * 10000 - 5000;
        mesh.position.z = Math.random() * 10000 - 5000;

        mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

        womb.add( mesh );

        spheres.push( mesh );

    }


    // the main event bubble
    var Biggeometry = new THREE.SphereBufferGeometry( 200, 50, 50 );
    const videoBubble = new THREE.Mesh( Biggeometry, material );
    videoBubble.position.set(markerxy, markerxy/2, 0);
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

        if (newCycle){
            camera.position.set( 0, 0, origin );
            newCycle = false;
        }


        // rotate womb
        womb.rotation.y = timer*3;

        if(playwomb && camera.position.z > markerz){
            camera.position.z -= ((origin-markerz)/timeBet);
        }
        if (playwomb && camera.position.y < markerxy/2){
            camera.position.y += (markerxy/2/timeBet);
        }
        if(playwomb && videoBubble.position.x > 0){
            videoBubble.position.x -= (markerxy/timeBet);
        }
        if(playwomb && camera.position.y >= markerxy/2 && camera.position.z <= markerz){
            setTimeout(() => {
                playwomb = false;
                playVideo();
            }, 2000);
        }  

        // move bubles randomly
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
       
        renderer.render(scene, camera);
        renderer.setPixelRatio( window.devicePixelRatio ); 
        requestAnimationFrame(render);

        
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
    iterations ++;
    main();
    playwomb = true;
    newCycle = true;
    setTimeout(() => {
        popupWindow.style.display = 'none';
    }, 1000);
})



function playVideo() {
    popupWindow.style.display = 'flex';
    popupWindow.style.opacity = 1;
    videoPlaceholder.innerHTML = ` <iframe src="https://player.vimeo.com/video/59065393?autoplay=1&title=0&byline=0&portrait=0" style="width:100%;height:100%;" frameborder="0" allow="fullscreen"></iframe><script src="https://player.vimeo.com/api/player.js"></script>`
}