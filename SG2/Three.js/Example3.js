var renderer, scene, camera;

var cube, spherePivot, sphere, cone, cubePivot;

var movement = -1; //static objects

function init() {
    var canvas = document.getElementById("webglcanvas");

    /*********************
     * RENDERER 
     * *******************/
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.width, canvas.height);
    // configure renderer clear color
    renderer.setClearColor("#000000");

    /*********************
     * SCENE 
     * *******************/
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();

    /*********************
     * CAMERA 
     * *******************/
    // create a camera, which defines where we're looking at
    camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 1, 4000);
    camera.position.set(2, 2, 15);
    scene.add(camera);


    /*************************
     * AXES HELPER
     *************************/
    // show SCENE axes
    var axes = new THREE.AxesHelper(10);
    scene.add(axes);


    /*****************************
     * CUBE 
     * ***************************/
    // Create the cube mesh (with axis)
    var material = new THREE.MeshNormalMaterial({ wireframe: false });
    var geometry = new THREE.CubeGeometry(2, 2, 2, 10, 10, 10);
    cube = new THREE.Mesh(geometry, material);
    // Tilt the mesh toward the viewer
    cube.rotation.x = Math.PI / 5;
    cube.rotation.y = Math.PI / 5;

    // Add the cube mesh TO THE SCENE
    scene.add(cube);

    // Create a group for the sphere and cone objects
    spherePivot = new THREE.Object3D;
    cubePivot = new THREE.Object3D;
    // Add it TO THE CUBE
    
    cubePivot.add(spherePivot)
    cubePivot.add(cube)
    scene.add(cubePivot)

    // Move the sphere diagonally FROM THE CUBE
    spherePivot.position.set(3, 3, 0);

    var axes = new THREE.AxesHelper(3);
    spherePivot.add(axes);

    // Create the sphere mesh (with axis)
    geometry = new THREE.SphereGeometry(1, 20, 20);
    sphere = new THREE.Mesh(geometry, material);
    

    // Add the sphere mesh TO THE SPHERE GROUP
    spherePivot.add(sphere);

    geometry = new THREE.ConeGeometry( 0.5, 0.5, 20);
    cone = new THREE.Mesh(geometry, material);
    cone.position.set(3,3,0)

    spherePivot.add(cone)

    // Add key handling
    document.onkeydown = handleKeyDown;

    // Run the run loop
    animate();
}

function handleKeyDown(event) {
    var char = String.fromCharCode(event.keyCode);
    switch (char) {
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
            movement = parseInt(char);
            break;
        default:
            movement = -1;
            break;
    }
}

function animate() {
    switch (movement) {
        case 1:
            // Rotate cube group its Y axis
            cube.rotation.y += 0.02;
            break;
        case 2:
            // Rotate the sphere about its Y axis
            sphere.rotation.y += 0.02;
            break;
        case 3:
            // Rotate the sphere pivot about its Y axis 
            spherePivot.rotation.y += 0.02;
            break;
        case 4:
            //Rotate the cube pivot about its Y axis
            cubePivot.rotation.y += 0.02;
            break;
        case 5:
            //Rotate the cone about its X axis
            cone.rotation.x += 0.02;
            break;
        default:
            // Reset 
            cube.rotation.y = 0;
            sphere.rotation.y = 0;
            spherePivot.y = 0;
            break;

    }
    
    // animate using requestAnimationFrame
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}