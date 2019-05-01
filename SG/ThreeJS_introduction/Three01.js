var cube;
var renderer, scene, camera;

// once everything is loaded, we run our Three.js stuff
window.onload = function init() {
    /*********************
     * SCENE 
     * *******************/
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();


    /*********************
     * CAMERA 
     * *******************/
    // create a camera, which defines where we're looking at
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
    camera.position.z = 5;

    /*********************
     * RENDERER 
     * *******************/
    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // configure renderer clear color
    renderer.setClearColor("#000000");

    // add the output of the renderer to an HTML element (this case, the body)
    document.body.appendChild(renderer.domElement);

    /*****************************
     * MESH = GEOMETRY + MATERIAL 
     * ***************************/
    // create an object 3D - a cube
    var geometry = new THREE.BoxGeometry(2, 2, 2);
    var material = new THREE.MeshNormalMaterial();
    cube = new THREE.Mesh(geometry, material);

    // add the cube to the scene
    scene.add(cube);

    /*****************************
     * ANIMATE 
     * ***************************/
    // call the animate function
    animate();
}


function animate() {
    // rotate the cube around its axes
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // animate using requestAnimationFrame
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


