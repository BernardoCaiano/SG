// THREEJS RELATED VARIABLES
var scene, renderer, camera;

// 3D Models
var sea, sky, plane, propeller;

// Wave movement
var waves = [];

// Light movement
var curve; var pos = 0; var directionalLight;

window.onload = function init() {
    // set up the scene, the camera and the renderer
    createScene();

    // add the objects
    createPlane();
    createSea();
    createSky();

    // add the lights
    createLights();

    // listen to the mouse
    document.addEventListener('mousemove', handleMouseMove, false);

    // start a loop that will update the objects' positions 
    // and render the scene on each frame
    animate();
}

//INIT THREE JS, SCREEN, SCENE, CAMERA AND MOUSE EVENTS
function createScene() {
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();

    // var axes = new THREE.AxisHelper(100);
    // scene.add(axes)

    scene.fog = new THREE.Fog(0xf7d9aa, 100);

    // create a camera, which defines where we're looking at
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);

    // position the camera
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 100;

    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    // configure renderer clear color
    renderer.setClearColor("#e4e0ba");

    /*****************************
    * SHADOWS 
    ****************************/
    // enable shadow rendering
    renderer.shadowMap.enabled = true;

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
    // A hemisphere light is a gradient colored light 
    // Parameters: sky color, ground color, intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

    // A directional light shines from a specific direction. 
    // It acts like the sun, that means that all the rays produced are parallel.
    directionalLight = new THREE.DirectionalLight(0xffffff, .9);
    directionalLight.position.set(100, 80, 50);
    // allow shadow casting
    directionalLight.castShadow = true;
    // define the visible area of the projected shadow
    directionalLight.shadow.camera.left = -100;
    directionalLight.shadow.camera.right = 100;
    directionalLight.shadow.camera.top = 100;
    directionalLight.shadow.camera.bottom = -100;

    // make the hemisphere light FOLLOW THE PLANE object
    //directionalLight.target = plane;

    // to activate the lights, just add them to the scene
    scene.add(hemisphereLight);
    scene.add(directionalLight);

    // var helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(helper);
    // var helper2 = new THREE.DirectionalLightHelper(directionalLight, 5);
    // scene.add(helper2);

    curve = new THREE.EllipseCurve(
        0, 0,           // centerX centerY
        200, 200,       // xRadius, yRadius
        0, 2 * Math.PI, // startAngle, endAngle
        false           // clockwise
    );
}

function createSea() {
    // create the geometry (shape) of the cylinder: radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geometry = new THREE.CylinderGeometry(600, 600, 800, 40, 10);
    // rotate the geometry on the x axis (local transformation)
    geometry.rotateX(-Math.PI / 2);

    // create the material
    var material = new THREE.MeshPhongMaterial({
        color: 0x68c3c0,
        transparent: true,
        opacity: .6,
        flatShading: true
    });

    // create the mesh: geometry + material
    sea = new THREE.Mesh(geometry, material);

    // save initial vertices coordinates and settings for their circular motion
    // to simulate the WAVES (in the ANIMATION function - moveWaves())
    var verts = sea.geometry.vertices;
    for (var i = 0; i < verts.length; i++) {
        var v = verts[i];
        waves.push({
            x: v.x, y: v.y, z: v.z,             // initial vertices coordinates
            ang: Math.random() * Math.PI * 2,   // initial angle
            amp: 5 + Math.random() * 15,        // radius
            speed: 0.04 + Math.random() * 0.06  // angular velocity
        });
    };

    /*****************************
    * SHADOWS 
    ****************************/
    // allow the sea to receive shadows
    sea.receiveShadow = true;

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

    // create a cube geometry; this shape will be duplicated to create the cloud
    var geometry = new THREE.BoxGeometry(20, 20, 20);
    // create a material; a simple white material will do the trick
    var material = new THREE.MeshPhongMaterial({ color: 0xd8d0d1 });

    // choose a number of clouds to be scattered in the sky
    var nClouds = 20;

    // to distribute the clouds consistently, place them according to a uniform angle
    var stepAngle = Math.PI * 2 / nClouds;

    // create the clouds and add them to the sky mesh
    for (var i = 0; i < nClouds; i++) {
        // create an empty container that will hold the different parts (cubes) of the cloud
        var cloud = new THREE.Object3D();

        // duplicate the geometry a random number of times
        var nBlocs = 3 + Math.floor(Math.random() * 3);
        for (var j = 0; j < nBlocs; j++) {
            var m = new THREE.Mesh(geometry, material);

            // set the position and the rotation of each cube randomly
            m.position.x = j * 15;
            m.position.y = Math.random() * 10;
            m.position.z = Math.random() * 10;
            m.rotation.z = Math.random() * Math.PI * 2;
            m.rotation.y = Math.random() * Math.PI * 2;

            // set the size of the cube randomly
            var s = .1 + Math.random() * 1.9;
            m.scale.set(s, s, s);

            cloud.add(m);
        }

        // set the rotation and the position of each cloud
        var a = stepAngle * i; // final angle of the cloud
        var h = 750 + Math.random() * 200; // distance between the center of the axis and the cloud itself

        // Trigonometry: converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
        cloud.position.y = Math.sin(a) * h;
        cloud.position.x = Math.cos(a) * h;

        // for a better result, position the clouds at random depths inside of the scene
        cloud.position.z = -400 - Math.random() * 400;

        // rotate the cloud according to its position
        cloud.rotation.z = a + Math.PI / 2;

        // add the mesh of each cloud to the sky
        sky.add(cloud);
    }

    console.log("Sky created")
    scene.add(sky);
}

function createPlane() {
    plane = new THREE.Object3D();

    var materialRed = new THREE.MeshPhongMaterial({ color: 0xf25346 });
    var materialWhite = new THREE.MeshPhongMaterial({ color: 0xd8d0d1 });
    var materialBrown = new THREE.MeshPhongMaterial({ color: 0x59332e });
    var materialDarkBrown = new THREE.MeshPhongMaterial({ color: 0x23190f });

    // Create the cabin
    var geomCockpit = new THREE.BoxGeometry(60, 50, 50);
    var cockpit = new THREE.Mesh(geomCockpit, materialRed);
    // access a specific vertex of a shape through the vertices array, and then move its x, y and z property
    geomCockpit.vertices[4].y -= 5;
    geomCockpit.vertices[4].z += 10;
    geomCockpit.vertices[5].y -= 5;
    geomCockpit.vertices[5].z -= 10;
    geomCockpit.vertices[6].y += 15;
    geomCockpit.vertices[6].z += 10;
    geomCockpit.vertices[7].y += 15;
    geomCockpit.vertices[7].z -= 10;
    plane.add(cockpit);

    // Create the engine
    var geomEngine = new THREE.BoxGeometry(20, 50, 50);
    var engine = new THREE.Mesh(geomEngine, materialWhite);
    engine.position.x = 40;
    plane.add(engine);

    // Create the tail
    var geomTailPlane = new THREE.BoxGeometry(15, 20, 5);
    var tail = new THREE.Mesh(geomTailPlane, materialRed);
    tail.position.set(-35, 25, 0);
    plane.add(tail);

    // Create the wing
    var geomSideWing = new THREE.BoxGeometry(40, 8, 150);
    var sideWing = new THREE.Mesh(geomSideWing, materialRed);
    plane.add(sideWing);

    // propeller
    var geomPropeller = new THREE.BoxGeometry(20, 10, 10);
    // access a specific vertex of a shape through the vertices array, and then move its x, y and z property
    geomPropeller.vertices[4].y -= 5;
    geomPropeller.vertices[4].z += 5;
    geomPropeller.vertices[5].y -= 5;
    geomPropeller.vertices[5].z -= 5;
    geomPropeller.vertices[6].y += 5;
    geomPropeller.vertices[6].z += 5;
    geomPropeller.vertices[7].y += 5;
    geomPropeller.vertices[7].z -= 5;
    propeller = new THREE.Mesh(geomPropeller, materialBrown);

    // blades
    var geomBlade = new THREE.BoxGeometry(1, 100, 20);
    var blade = new THREE.Mesh(geomBlade, materialDarkBrown);
    blade.position.set(8, 0, 0);

    // SECOND propeller
    var blade2 = blade.clone();
    blade2.rotation.x = Math.PI / 2;
    blade2.castShadow = true;
    blade2.receiveShadow = true;

    propeller.add(blade);
    propeller.add(blade2);

    propeller.position.set(50, 0, 0);
    plane.add(propeller);

    plane.scale.set(0.25, 0.25, 0.25);
    plane.position.y = 100;

    console.log("Plane created")
    scene.add(plane);

    /*****************************
    * SHADOWS 
    ****************************/
    // Plane meshes must cast and receive shadows
    plane.traverse(function (child) {
        if (child instanceof THREE.Mesh ) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}


function animate() {
    // rotate de propeller
    propeller.rotation.x += 0.3;
    // rotate the background (use AxisHelper to verify which axis is the rotation one)
    sky.rotation.z += 0.01;
    sea.rotation.z += 0.005;

    // update light to simulate SUN movement
    if (pos <= 1) {
        directionalLight.position.x = curve.getPointAt(pos).x
        directionalLight.position.y = curve.getPointAt(pos).y
        pos += 0.001
    } else {
        pos = 0;
    }

    // update plane position
    updatePlane();

    // update wave movement of the sea
    moveWaves();

    // render
    renderer.render(scene, camera);

    requestAnimationFrame(animate);
}


// HANDLE MOUSE EVENTS
var mousePos = { x: 0, y: 0 };

function handleMouseMove(event) {
    var tx = -1 + (event.clientX / window.innerWidth) * 2;
    var ty = 1 - (event.clientY / window.innerHeight) * 2;
    mousePos = { x: tx, y: ty };
}

function updatePlane() {

    var targetX = mousePos.x * 100;
    var targetY = mousePos.y * 100;

    // // update the airplane's position
    // plane.position.x = targetX;
    // plane.position.y = targetY + 100;

    // update the airplane's position SMOOTHLY
    plane.position.y += (targetY - plane.position.y + 100) * 0.1;
    plane.rotation.z = (targetY - plane.position.y + 100) * 0.013;

}


function moveWaves() {
    var verts = sea.geometry.vertices;
    for (var i = 0; i < verts.length; i++) {
        var v = verts[i];       // get CURRENT vertices
        var vprops = waves[i];  // get INITIAL vertices and movement definitions
        v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
        v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;
        vprops.ang += vprops.speed; // update angle for next frame
    }
    // necessary to update this flag if the geometry has been previously rendered
    sea.geometry.verticesNeedUpdate = true;
}


