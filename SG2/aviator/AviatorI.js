// THREEJS RELATED VARIABLES
var scene, renderer, camera;

// 3D Models
var sea, sky, plane, propeller, blade;

var controls;

window.onload = function init() {
    // set up the scene, the camera and the renderer
    createScene();

    // add the objects
    createPlane();
    createSea();
    createSky();
    createLights()
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
    camera.position.z = 200; //notice how far the camera is
    camera.position.y = 100;

    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

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
    var light = new THREE.HemisphereLight( 0xaaaaaa, 0x000000,  0.9);
    scene.add(light);

    // White directional light at half intensity shining from the top.
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(100, 80, 50)
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.castShadow = true;
    scene.add(directionalLight);
} 

function createSea() {

    // create the geometry (shape) of the cylinder: radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    // rotate the geometry on the x axis (alters the vertices coordinates, DOES NOT alter the mesh axis coordinates )
    geometry.rotateX(-Math.PI / 2);

    // create the material
    var material = new THREE.MeshPhongMaterial({
        color: 0x68c3c0, wireframe: false, transparent: true, opacity: 0.6, flatShading: true
    });

    // create the mesh: geometry + material
    sea = new THREE.Mesh(geometry, material);

    // push it a little bit at the bottom of the scene
    sea.position.y = -600;

    sea.receiveShadow = true
    console.log("Sea created")
    scene.add(sea);

}

function createSky() {
    // create an empty container
    sky = new THREE.Object3D();
    // push its center a bit towards the bottom of the screen (like the sea)
    sky.position.y = -600;


    //COMPLETE HERE
    for (let i = 0; i < 20; i++) {
        cloud = new THREE.Object3D();

        //ang = Math.random() * 361
        //ang = ang * Math.PI / 180
        ang = i * Math.PI / 10
        r = (Math.random() * 201) + 750
        cloud.position.set(r * Math.cos(ang), r * Math.sin(ang), (Math.random() * 401) - 800)
        //cloud.rotateZ(Math.PI/2 + ang)
        cloud.rotation.z = (Math.PI / 2 + ang)
        sky.add(cloud)

        theRand = (Math.random() * 4) + 3
        for (let j = 0; j < theRand; j++) {

            material = new THREE.MeshPhongMaterial({ color: 0xd8d0d1 })
            geometry = new THREE.CubeGeometry(20, 20, 20);
            cloud1 = new THREE.Mesh(geometry, material);
            cloud1.position.set(15 * j, Math.random() * 11, Math.random() * 11)
            cloud1.scale.set((Math.random() * 1.9) + 0.1, (Math.random() * 1.9) + 0.1, (Math.random() * 1.9) + 0.1)
            cloud1.rotateY((Math.random() * 361) * Math.PI / 180)
            cloud1.rotateZ((Math.random() * 361) * Math.PI / 180)

            cloud.add(cloud1);
        }
    }

    console.log("Sky created")
    scene.add(sky);
}

function createPlane() {
    // create an empty container
    plane = new THREE.Object3D();

    // scale it down
    plane.scale.set(0.25, 0.25, 0.25);
    // push it up
    plane.position.y = 100;


    //COMPLETE HERE
    var geometry = new THREE.BoxGeometry(60, 50, 50);
    var material = new THREE.MeshPhongMaterial({ color: 0xf25346 });
    var cockpit = new THREE.Mesh(geometry, material);
    cockpit.position.set(0, 0, 0)
    plane.add(cockpit);

    var geometry = new THREE.BoxGeometry(20, 50, 50);
    var material = new THREE.MeshPhongMaterial({ color: 0xd8d0d1 });
    var engine = new THREE.Mesh(geometry, material);
    engine.position.set(40, 0, 0)
    plane.add(engine);

    var geometry = new THREE.BoxGeometry(15, 20, 5);
    var material = new THREE.MeshPhongMaterial({ color: 0xf25346 });
    var tail = new THREE.Mesh(geometry, material);
    tail.position.set(-35, 25, 0)
    plane.add(tail);

    var geometry = new THREE.BoxGeometry(40, 8, 150);
    var material = new THREE.MeshPhongMaterial({ color: 0xf25346 });
    var wing = new THREE.Mesh(geometry, material);
    wing.position.set(0, 0, 0)
    plane.add(wing);

    var geometry = new THREE.BoxGeometry(20, 20, 10);
    var material = new THREE.MeshPhongMaterial({ color: 0x59332e });
    var propeller = new THREE.Mesh(geometry, material);
    propeller.position.set(50, 0, 0)
    plane.add(propeller);

    var geometry = new THREE.BoxGeometry(1, 100, 20);
    var material = new THREE.MeshPhongMaterial({ color: 0x23190f });
    blade1 = new THREE.Mesh(geometry, material);
    blade1.position.set(8, 0, 0)
    propeller.add(blade1);

    var geometry = new THREE.BoxGeometry(1, 100, 20);
    var material = new THREE.MeshPhongMaterial({ color: 0x23190f });
    blade2 = new THREE.Mesh(geometry, material);
    blade2.position.set(8, 0, 0)
    propeller.add(blade2);

    plane.receiveShadow = true
    plane.castShadow = true
    console.log("Plane created")
    scene.add(plane);
}


function animate() {
    //ANIMATE THE PROPELLER

    // rotate the background (use AxesHelper to verify which axis is the rotation one)
    sky.rotation.z += 0.01;
    sea.rotation.z += 0.005;
    blade1.rotation.x += 0.1;
    blade2.rotation.x += 0.2;

    
    
    // render
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    
}



