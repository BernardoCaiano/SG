var controls;
var renderer;
var camera;
var scene;
var material;

var parameters = {
    shoulderRotX: 0,
    shoulderRotZ: 0,
    elbowRotZ: 0
};

var shoulder;
var elbow;


// once everything is loaded, we run our Three.js stuff
window.onload = function init() {

    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();

    // create a camera, which defines where we're looking at
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    // position and point the camera to the center of the scene
    camera.position.z = 10;
    camera.lookAt(scene.position); //point the camera to the center of the scene (default)

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () { renderer.render(scene, camera); });

    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // configure renderer clear color
    renderer.setClearColor("#000000");

    // add the output of the renderer to an HTML element (this case, the body)
    document.body.appendChild(renderer.domElement);

    // same material for ALL meshes
    material = new THREE.MeshNormalMaterial({ wireframe: false });

    // create SHOULDER object 
    shoulder = new THREE.Object3D();
    // create shoulder 3D cube
    var upperArmGeometry = new THREE.BoxGeometry(2, 0.5, 1);
    var upperArm = new THREE.Mesh(upperArmGeometry, material);
    upperArm.position.x = 1;
    // add shoulder to the arm
    shoulder.add(upperArm);
    shoulder.position.x = -1;

    // var axes1 = new THREE.AxesHelper(3);
    // shoulder.add(axes1);
    // var axes2 = new THREE.AxesHelper(1);
    // upperArm.add(axes2);


    // create ELBOW object
    elbow = new THREE.Object3D();
    var lowerArmGeometry = new THREE.BoxGeometry(2, 0.5, 1);
    var lowerArm = new THREE.Mesh(lowerArmGeometry, material);
    lowerArm.position.x = 1;
    // add shoulder to the arm
    elbow.add(lowerArm);
    elbow.position.x = 2;

    // var axes3 = new THREE.AxesHelper(3);
    // elbow.add(axes3);
    // var axes4 = new THREE.AxesHelper(1);
    // lowerArm.add(axes4);

    shoulder.add(elbow)
    scene.add(shoulder);

    //ADD AXIS TO THE SCENE
    // var axes = new THREE.AxesHelper(3);
    // scene.add(axes);

 
    // Run the run loop
    animate();
}




function animate() {
    shoulder.rotation.x = THREE.Math.degToRad(parameters.shoulderRotX);
    shoulder.rotation.z = THREE.Math.degToRad(parameters.shoulderRotZ);
    elbow.rotation.z = THREE.Math.degToRad(parameters.elbowRotZ); 
    // animate using requestAnimationFrame
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}



//----------------------------------------------------------------------------
// Keyboard Event Functions
//----------------------------------------------------------------------------
document.onkeydown = function handleKeyDown(event) {
    //Detect shift key
    var shift = event.shiftKey;

    //Get unshifted key character
    var key = String.fromCharCode(event.keyCode);

    if (key == "T") {
        material.wireframe = !material.wireframe;
    }

    //Shoulder Updates
    if (!shift && key == "R") {
        parameters.shoulderRotX++;
    }
    if (shift && key == "R") {
        parameters.shoulderRotX--;
    }

    if (!shift && key == "S") {
        if (parameters.shoulderRotZ < 90)
            parameters.shoulderRotZ++;
        else
            parameters.shoulderRotZ = 90;
    }
    if (shift && key == "S") {
        if (parameters.shoulderRotZ > -90)
            parameters.shoulderRotZ--;
        else
            parameters.shoulderRotZ = -90;
    }

    //Elbow Updates
    if (!shift && key == "E") {
        if (parameters.elbowRotZ < 145)
            parameters.elbowRotZ++;
        else
            parameters.elbowRotZ = 145;
    }
    if (shift && key == "E") {
        if (parameters.elbowRotZ > 0)
            parameters.elbowRotZ--;
        else
            parameters.elbowRotZ = 0;
    }
}








