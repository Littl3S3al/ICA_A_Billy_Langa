import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
import { FresnelShader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/shaders/FresnelShader.js';
import { Water } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/objects/Water.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';
import { Sky } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/objects/Sky.js';
// variables for event listeners
const beginBtn = document.querySelector('#btn-begin');
const overlay = document.querySelector('#overlay');
const threeJsWindow = document.querySelector('#three-js-container');
const popupWindow = document.querySelector('.popup-window');
const closeBtn = document.querySelector('#btn-close');
const videoPlaceholder = popupWindow.querySelector('.video');
const wombsound = document.querySelector('audio');
const vignett = document.querySelector('#vignett');
const transitionLayer = document.querySelector('#transition');

// loader
const loadingElem = document.querySelector('#loading');
const progressBarElem = loadingElem.querySelector('.progressbar');
let firstLoad = true;

// second phase
let firstphase = true;
let secondPhase = false;
let changeOver = false;
let secondPhaseZoom = false;
let secondPhaseZoomBegin = true;

let spheres = [];

let newCycle = true;
let readyToMove = true;
let playwomb = true;
let rotX = 0;
let iterations = 0;
const videos = [
    `<iframe src="https://player.vimeo.com/video/59065393?autoplay=1&title=0&byline=0&portrait=0" style="width:100%;height:100%;" frameborder="0" allow="autoplay, fullscreen"></iframe><script src="https://player.vimeo.com/api/player.js"></script>`,
    `<iframe src="https://player.vimeo.com/video/32782838?autoplay=1&title=0&byline=0&portrait=0" style="width:100%;height:100%;" frameborder="0" allow="autoplay, fullscreen"></iframe><script src="https://player.vimeo.com/api/player.js"></script>`, 
    `<iframe src="https://player.vimeo.com/video/59065393?autoplay=1&title=0&byline=0&portrait=0" style="width:100%;height:100%;" frameborder="0" allow="autoplay, fullscreen"></iframe><script src="https://player.vimeo.com/api/player.js"></script>`
];

let cameraTurn = false;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

let repositionBubble = false;



// three.js functions
const main  = () => {
    
    console.log('begin');
    const origin = 2000;
    const markerz = 260;
    const markerxy = 800;
    const timeBet = 1000;

    const canvas = document.querySelector('#c');
    const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 100000 );
    camera.target = new THREE.Vector3( 0, 0, 0 );
    camera.position.set( 0, 0, origin );

    //

    const loadManager = new THREE.LoadingManager();
    const cubeLoader = new THREE.CubeTextureLoader(loadManager);
    const textureLoader = new THREE.TextureLoader(loadManager);
    

    // reflective surface for the bubles
    var path = "assets/Park2/";
    var format = '.jpg';
    var urls = [
        path + 'posx' + format, path + 'negx' + format,
        path + 'posy' + format, path + 'negy' + format,
        path + 'posz' + format, path + 'negz' + format
    ];

    var textureCube = cubeLoader.load( urls );

    const scene = new THREE.Scene();
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

    var texture = textureLoader.load( 'assets/sunset_red.jpeg' );
    var envMaterail = new THREE.MeshBasicMaterial( { map: texture, transparent: true, opacity: 0.8} );

    const womb = new THREE.Mesh( sphereGeo, envMaterail );


    // the main event bubble
    var Biggeometry = new THREE.SphereBufferGeometry( 200, 50, 50 );
    const videoBubble = new THREE.Mesh( Biggeometry, material );
    videoBubble.position.set(markerxy, markerxy/2, 0);

    //loading textures/images

    loadManager.onLoad = () => {
        if(firstLoad){
            loadingElem.style.display = 'none';
            scene.background = textureCube; 
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

            womb.add(videoBubble);
            firstLoad = false;
        }
    };

    loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
        const progress = itemsLoaded / itemsTotal*100;
        progressBarElem.style.width = progress + '%';
      };




    // set renderer
    const renderer = new THREE.WebGLRenderer({canvas});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );


    

    // resize function
    function onWindowResize() {

        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
    
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize( window.innerWidth, window.innerHeight );
    
    }


    // animation
    const render = (time) => {

        if(firstphase){
            if(!firstLoad){
                var timer = 0.00003 * Date.now();
    
                if (newCycle){
                    setTimeout(()=> {
                        camera.position.set( 0, 0, origin );
                        readyToMove = true;
                    }, 1200)
                    newCycle = false;
                }
    
    
                // rotate womb
                womb.rotation.y = timer*3;
    
                // changing buble position when videos are still being played
                if(readyToMove && playwomb && camera.position.z > markerz){
                    camera.position.z -= ((origin-markerz)/timeBet);
                }
                if (readyToMove && playwomb && camera.position.y < markerxy/2){
                    camera.position.y += (markerxy/2/timeBet);
                }
                if(readyToMove && playwomb && videoBubble.position.x > 0){
                    videoBubble.position.x -= (markerxy/timeBet);
                }
                if(readyToMove && playwomb && camera.position.y >= markerxy/2 && camera.position.z <= markerz){
                    mutesound(false);
                    playwomb = false;
                    setTimeout(() => {
                        playVideo();
                    }, 2000);
                }  
    
    
                // turn camera for the end of the last bubble
                if(womb.rotation.x < 1 && cameraTurn){
                    readyToMove = true;
                    womb.rotation.x += rotX;
                    rotX += 0.00005 * (Math.PI/180);
                } 
                
                if( womb.rotation.x > 0.8){
                    transitionLayer.style.opacity = 1;
                    // mutesound(false);
                    if(changeOver){
                        setTimeout(() => {
                            secondPhase = true;
                            transitionLayer.style.opacity = 0;
                        }, 5000)
                        changeOver = false;
                    }                
                }
    
                // move bubles randomly
                for ( var i = 0, il = spheres.length; i < il; i ++ ) {
    
                    var sphere = spheres[ i ];
    
                    sphere.position.x = 5000 * Math.cos( timer + i );
                    sphere.position.y = 5000 * Math.sin( timer + i * 1.1 );
    
                }
            }
        }

        if(secondPhase){
            beginPhase2();
            secondPhase = false;
            firstphase = false;
        }

        
        window.addEventListener('resize', onWindowResize, false)
       
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
    wombsound.play();
    wombsound.volume = 1;
});

closeBtn.addEventListener('click', () => {
    popupWindow.classList.add('hide');
    wombsound.play();
    mutesound(true);
    closeBtn.classList.add('d-none');
    if(iterations < videos.length){
        playwomb = true;
        newCycle = true;
        readyToMove = false;
    } else {
        cameraTurn = true;
        changeOver = true;
        console.log('camera turn')
    }
    setTimeout(() => {
        popupWindow.style.display = 'none';
    }, 1000);
    videoPlaceholder.innerHTML = '';
})



function playVideo() {   
    popupWindow.style.display = 'flex';
    popupWindow.style.opacity = 1;
    videoPlaceholder.innerHTML = videos[iterations];
    iterations ++;
    setTimeout(() => {
        closeBtn.classList.remove('d-none');
    }, 5000)

}

function mutesound(positive){
    let interval;
    let difference;
    // check if volume to increase or decrease
    if(positive){
        interval = 0.1;
        difference = 0;
    } else {
        interval = -0.1;
        difference = 1;
    };
    
    // interval to increase/decreas volume
    const muting = setInterval(() => {
        difference = Math.round((difference + interval) * 10) / 10;
        if(positive && wombsound.volume < difference){
            wombsound.volume = difference;
        } else if (!positive && wombsound.volume > difference){
            wombsound.volume = difference;
        }
        if(wombsound.volume === 0){
            wombsound.pause();
            clearInterval(muting); 
        } else if(wombsound.volume === 1){
            clearInterval(muting);
        }
    }, 500);
}

const beginPhase2  = () => {
    console.log('new canvas');

    const oldCanvas = document.querySelector('#c');
    oldCanvas.style.display = 'none';
    vignett.style.display = 'none';
    transitionLayer.style.opacity = 0;


    const canvas = document.querySelector('#d');
    canvas.style.display = 'block';
    const renderer = new THREE.WebGLRenderer({canvas});

    const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( 30, 30, 100 );


    const scene = new THREE.Scene();
    // scene.background = new THREE.Color( 0xE67E22);
    scene.fog = new THREE.FogExp2( 0x622b1f   , 0.0005 );

    const controls = new OrbitControls( camera, canvas );
    controls.pan = false;
    controls.rotate = false;
    controls.zoom = false;


      {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 10, 4);
        scene.add(light);
      }


     

    //   add bowl  
    function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
        const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
        const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
        const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
        // compute a unit vector that points in the direction the camera is now
        // in the xz plane from the center of the box
        const direction = (new THREE.Vector3())
            .subVectors(camera.position, boxCenter)
            .multiply(new THREE.Vector3(1, 0, 1))
            .normalize();
    
        // move the camera to a position distance units way from the center
        // in whatever direction the camera was from the center already
        camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
    
        // pick some near and far values for the frustum that
        // will contain the box.
        camera.near = boxSize / 100;
        camera.far = boxSize * 100;
    
        camera.updateProjectionMatrix();
    
        // point the camera to look at the center of the box
        camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
        camera.position.set(boxCenter.x, boxCenter.y + 6, boxCenter.z)
      }
    {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('assets/bowl.gltf', (gltf) => {
            const root = gltf.scene;
            scene.add(root);
            const material = new THREE.MeshPhongMaterial({color: 0xA93226 });;
            root.children[2].material = material;
        
            // compute the box that contains all the stuff
            // from root and below
            const box = new THREE.Box3().setFromObject(root);

            const boxSize = box.getSize(new THREE.Vector3()).length();
            const boxCenter = box.getCenter(new THREE.Vector3());

            // set the camera to frame the box
            frameArea(boxSize * 0.5, boxSize, boxCenter, camera);

        });
    }
      
    const sun = new THREE.Vector3();
      
        // water

        const radius = 9.5;
        const segments = 100;
        var waterGeometry = new THREE.CircleBufferGeometry(radius, segments)

        var water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load( 'waternormals.jpg', function ( texture ) {

                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                } ),
                alpha: 1.0,
                waterColor: 0x001e0f,
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                distortionScale: 0.5,
                fog: scene.fog
            }
        );

        water.rotation.x = - Math.PI / 2;
        water.position.set(radius/2 + 2, 11, 0);

        scene.add( water );

        // Skybox

				var sky = new Sky();
				sky.scale.setScalar( 10000 );
				scene.add( sky );

				var uniforms = sky.material.uniforms;

				uniforms[ 'turbidity' ].value = 10;
				uniforms[ 'rayleigh' ].value = 2;
				uniforms[ 'mieCoefficient' ].value = 0.005;
				uniforms[ 'mieDirectionalG' ].value = 0.8;

				var parameters = {
					inclination: 0.49,
					azimuth: 0.0205
				};

				var pmremGenerator = new THREE.PMREMGenerator( renderer );

				function updateSun() {

					var theta = Math.PI * ( parameters.inclination - 0.5 );
					var phi = 2 * Math.PI * ( parameters.azimuth - 0.5 );

					sun.x = Math.cos( phi );
					sun.y = Math.sin( phi ) * Math.sin( theta );
					sun.z = Math.sin( phi ) * Math.cos( theta );

					sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
					water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

					scene.environment = pmremGenerator.fromScene( sky ).texture;

				}

				updateSun();


        var loader = new THREE.TextureLoader();
        var groundMesh;
        {
          var groundTexture = loader.load( 'assets/grasslight-big.jpg' );
          groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
          groundTexture.repeat.set( 70, 70 );
          groundTexture.anisotropy = 16;
          groundTexture.encoding = THREE.sRGBEncoding;
  
          var groundMaterial = new THREE.MeshLambertMaterial( { map: groundTexture } );
  
          groundMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 10000, 10000 ), groundMaterial );
          groundMesh.position.y = 0;
          groundMesh.rotation.x = - Math.PI / 2;
          groundMesh.receiveShadow = true;
          scene.add( groundMesh );
        }

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
    
        const render = (time) => {    
            
            time *= 0.00000005;
            

            if(camera.position.y < 100){
                camera.position.y += time*2;
                camera.position.x += time*4;
                camera.rotation.y += time/1.1;
                requestAnimationFrame(render); 
                renderer.render(scene, camera);
            }
            
    
            if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
            }
    
            renderer.setPixelRatio( window.devicePixelRatio );
            controls.update();
            
            water.material.uniforms[ 'time' ].value += 1.0 / 500.0;
    
            
        }
    
        setTimeout(() => {
            requestAnimationFrame(render);
        }, 3000);

}