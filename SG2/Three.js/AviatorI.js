// THREEJS RELATED VARIABLES
var scene, renderer, camera;

// 3D Models
var sea, sky, plane, propeller;

var controls;

window.onload = function init() {
    // set up the scene, the camera and the renderer
    createScene();
 
    // add the objects
    createPlane();
    createSea();
    createSky();

    // start a loop that will update the objects' positions 
    // and render the scene on each frame
    animate();
}

//INIT THREE JS, SCREEN, SCENE AND CAMERA
function createScene() {
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();
    var axes = new THREE.AxesHelper(600);
    scene.add(axes)
   
    // create a camera, which defines where we're looking at
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);

    // position the camera
    camera.position.x = 0;
    camera.position.z = 2000; //notice how far the camera is
    camera.position.y = 100;

    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // configure renderer clear color
    renderer.setClearColor("#e4e0ba"); 

    // add the output of the renderer to the DIV with id "world"
    document.getElementById('world').appendChild(renderer.domElement);

    // listen to the screen: if the user resizes it we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
}

function handleWindowResize() {
    // update height and width of the renderer and the camera
    var HEIGHT = window.innerHeight;
    var WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

function createLights() {
 
}

function createSea() {

    // create the geometry (shape) of the cylinder: radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    // rotate the geometry on the x axis (alters the vertices coordinates, DOES NOT alter the mesh axis coordinates )
    geometry.rotateX(-Math.PI / 2);

    // create the material
    var material = new THREE.MeshBasicMaterial({ color: 0x68c3c0, wireframe: true });

    // create the mesh: geometry + material
    sea = new THREE.Mesh(geometry, material);

    // push it a little bit at the bottom of the scene
    sea.position.y = -600;

    console.log("Sea created")
    scene.add(sea);
}

function createSky() {
    // create an empty container
    sky = new THREE.Object3D();
    // push its center a bit towards the bottom of the screen (like the sea)
    sky.position.y = -600;


    //COMPLETE HERE


    console.log("Sky created")
    scene.add(sky);
}

function createPlane() {
    // create an empty container
    plane = new THREE.Object3D();

    // scale it down
    plane.scale.set(0.25,0.25,0.25);
    // push it up
    plane.position.y = 100;


    //COMPLETE HERE


    console.log("Plane created")
    scene.add(plane);
}


function animate() {
    //ANIMATE THE PROPELLER
    
    // rotate the background (use AxesHelper to verify which axis is the rotation one)
    sky.rotation.z += 0.01;
    sea.rotation.z += 0.005;

    // render
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}



