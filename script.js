import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';
import { Water } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/objects/Water.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/GLTFLoader.js';

// variables for event listeners
const beginBtn = document.querySelector('#btn-begin');
const overlay = document.querySelector('#overlay');
const threeJsWindow = document.querySelector('#three-js-container');
const popupWindow = document.querySelector('.popup-window');
const closeBtn = document.querySelector('#btn-close');

var lastTime = ( new Date() ).getTime();

// three.js functions
const main  = () => {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});

    const fov = 100;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set( 0, 0, 10 );


    const scene = new THREE.Scene();

    const controls = new OrbitControls( camera, canvas );



    {
        const skyColor = 0xF48FB1 ;  // light blue
        const groundColor = 0x81D4FA;  // brownish orange
        const intensity = 0.5;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        light.position.set(0, 0, 0);
        scene.add(light);
      }

      {
        const color = 0xFFFFFF;
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        scene.add(light);
      }



    //   add bowl
    // const radius =  50;
    // const tubeRadius = 20;
    // const radialSegments = 8;
    // const tubularSegments = 24;
    // const geometry = new THREE.TorusBufferGeometry(radius, tubeRadius, radialSegments, tubularSegments);
    // const makeInstance = (geometry, color, x, y, z, rotation) => {
    //     const material = new THREE.MeshPhongMaterial({color});

    //     const shape = new THREE.Mesh(geometry, material);
    //     scene.add(shape);

    //     shape.position.set(x, y, z);
    //     shape.rotation.x = rotation;

    //     return shape;
    // }

    // const torus = makeInstance(geometry, 0xFFFFFF, 0 ,0, 0, Math.PI/180 * 90);
    
    {
        const gltfLoader = new GLTFLoader();
        gltfLoader.load('assets/bowl.gltf', (gltf) => {
          const root = gltf.scene;
        //   const material = new THREE.LineBasicMaterial({color: 0xff0000});
        //   gltf.scene.material = material;
          scene.add(root);
          const material = new THREE.MeshPhongMaterial({color: 0xA93226 });;
          root.children[2].material = material;
    
          // compute the box that contains all the stuff
          // from root and below
          const box = new THREE.Box3().setFromObject(root);
        });
      }
      
        // water

        const radius = 7;
        const segments = 100;
        var waterGeometry = new THREE.CircleBufferGeometry(radius, segments)

        var water = new Water(
            waterGeometry,
            {
                textureWidth: 1,
                textureHeight: 1,
                waterNormals: new THREE.TextureLoader().load( 'waternormals.jpg', function ( texture ) {

                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

                } ),
                alpha: 1.0,
                waterColor: 0x5DADE2,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
        );

        water.rotation.x = - Math.PI / 2;

        scene.add( water );

    

    

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



        

        if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        }

        requestAnimationFrame(render); 
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.render(scene, camera);
        controls.update();
        water.material.uniforms[ 'time' ].value += 1.0 / 500.0;

        
    }

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