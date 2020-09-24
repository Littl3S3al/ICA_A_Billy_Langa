import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/controls/OrbitControls.js';
import { Ocean } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/misc/Ocean.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/libs/dat.gui.module.js';


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

    const fov = 20;
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
        light.position.set(0, 100, 0);
        scene.add(light);
      }



    //   add bowl
    const points = [];
    for (let i = 0; i < 10; ++i) {
    points.push(new THREE.Vector2(Math.sin(i * 0.2) * 5 + 1, (i - 1) * 0.5));
    }
    const segments = 500;
    const phiStart = Math.PI * 0.66; 
    const phiLength = Math.PI * 2.00; 
    const geometry = new THREE.LatheBufferGeometry(points, segments, phiStart, phiLength);
    

    const makeInstance = (geometry, color) => {
        const material = new THREE.MeshStandardMaterial({color: color, flatShading: true, shininess: 10, side: THREE.DoubleSide,});

        const shape = new THREE.Mesh(geometry, material);
        scene.add(shape);

        shape.position.set (0, -0.5, 0);

        return shape;
    }

    makeInstance(geometry, 0xF8BBD0);

    
      

    let ocean = {
        ms_Ocean: null,
        updateOcean : function() {
            // water layer
            var gsize = 512;
            var res = 1024;
            var gres = res / 2;
            var origx = - gsize / 2;
            var origz = - gsize / 2;
            this.ms_Ocean = new Ocean( renderer, camera, scene,
                {
                    USE_HALF_FLOAT: false,
                    INITIAL_SIZE: 256.0,
                    INITIAL_WIND: [ 10.0, 10.0 ],
                    INITIAL_CHOPPINESS: 1.5,
                    CLEAR_COLOR: [ 1.0, 1.0, 1.0, 0.0 ],
                    GEOMETRY_ORIGIN: [ origx, origz ],
                    SUN_DIRECTION: [ - 1.0, 1.0, 1.0 ],
                    OCEAN_COLOR: new THREE.Vector3( 0.004, 0.016, 0.047 ),
                    SKY_COLOR: new THREE.Vector3( 3.2, 9.6, 12.8 ),
                    EXPOSURE: 0.35,
                    GEOMETRY_RESOLUTION: gres,
                    GEOMETRY_SIZE: gsize,
                    RESOLUTION: res
                } );

            this.ms_Ocean.materialOcean.uniforms[ "u_projectionMatrix" ] = { value: camera.projectionMatrix };
            this.ms_Ocean.materialOcean.uniforms[ "u_viewMatrix" ] = { value: camera.matrixWorldInverse };
            this.ms_Ocean.materialOcean.uniforms[ "u_cameraPosition" ] = { value: camera.position };
            scene.add( this.ms_Ocean.oceanMesh );
    
        },
        update: function() {
            var currentTime = new Date().getTime();
            this.ms_Ocean.deltaTime = ( currentTime - lastTime ) / 1000 || 0.0;
            lastTime = currentTime;
            this.ms_Ocean.render( this.ms_Ocean.deltaTime );
            this.ms_Ocean.overrideMaterial = this.ms_Ocean.materialOcean;

            if ( this.ms_Ocean.changed ) {

                this.ms_Ocean.materialOcean.uniforms[ "u_size" ].value = this.ms_Ocean.size;
                this.ms_Ocean.materialOcean.uniforms[ "u_sunDirection" ].value.set( this.ms_Ocean.sunDirectionX, this.ms_Ocean.sunDirectionY, this.ms_Ocean.sunDirectionZ );
                this.ms_Ocean.materialOcean.uniforms[ "u_exposure" ].value = this.ms_Ocean.exposure;
                this.ms_Ocean.changed = false;

            }

            this.ms_Ocean.materialOcean.uniforms[ "u_normalMap" ].value = this.ms_Ocean.normalMapFramebuffer.texture;
            this.ms_Ocean.materialOcean.uniforms[ "u_displacementMap" ].value = this.ms_Ocean.displacementMapFramebuffer.texture;
            this.ms_Ocean.materialOcean.uniforms[ "u_projectionMatrix" ].value = camera.projectionMatrix;
            this.ms_Ocean.materialOcean.uniforms[ "u_viewMatrix" ].value = camera.matrixWorldInverse;
            this.ms_Ocean.materialOcean.uniforms[ "u_cameraPosition" ].value = camera.position;
            this.ms_Ocean.materialOcean.depthTest = true;
        }
    }

    ocean.updateOcean();

        

    

    

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

        renderer.render(scene, camera);
        controls.update();
        ocean.update();

        
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