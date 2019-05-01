var renderer, scene, camera;

var ambientLight, spotLight, directionalLight, pointLight;
var controls;
var toggleShadows = true;

// once everything is loaded, we run our Three.js stuff
window.onload = function init() {
    /*********************
     * SCENE 
     * *******************/
    // create an empty scene, that will hold all our elements such as objects, cameras and lights
    scene = new THREE.Scene();

    // var axes = new THREE.AxesHelper(500);
    // scene.add(axes)

    /*********************
     * CAMERA 
     * *******************/
    // create a camera, which defines where we're looking at
    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 4000);
    camera.position.set(-150, 400, 350);

    /*********************
     * RENDERER 
     * *******************/
    // create a render and set the size
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x66ccff, 1.0);
    // enable shadows
    renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    // add the output of the renderer to an HTML element (this case, the body)
    document.body.appendChild(renderer.domElement);

    /*********************
    * CONTROLS 
    * *******************/
    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () { renderer.render(scene, camera); });
    controls.target.set(-25, -50, 0);
    controls.update();


    /*****************************
     * MESHES
     * ***************************/
    var faceMaterial = new THREE.MeshStandardMaterial({ color: 0x0087E6 });

    var torus = new THREE.Mesh(new THREE.TorusBufferGeometry(50, 10, 16), faceMaterial);
    torus.position.set(0, 50, 250);
    torus.rotation.x = -90 * Math.PI / 180;
    torus.receiveShadow = true;
    torus.castShadow = true;
    scene.add(torus);

    var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0, 50, 100), faceMaterial);
    cylinder.position.set(150, 50, 0);
    cylinder.receiveShadow = true;
    cylinder.castShadow = true;
    scene.add(cylinder);

    var cube = new THREE.Mesh(new THREE.CubeGeometry(100, 100, 100), faceMaterial);
    cube.position.y = 50;
    cube.receiveShadow = true;
    cube.castShadow = true;
    scene.add(cube);

    var sphere = new THREE.Mesh(new THREE.SphereGeometry(50, 4, 4), faceMaterial);
    sphere.position.set(-150, 50, 0);
    sphere.receiveShadow = true;
    sphere.castShadow = true;
    scene.add(sphere);

    // Create a plane that receives shadows (but does not cast them)
    var planeGeometry = new THREE.PlaneBufferGeometry(10000, 10000, 32, 32);
    var planeMaterial = new THREE.MeshLambertMaterial({ color: 0xb69a77, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = "plane"
    plane.rotation.x = - Math.PI / 2;
    plane.position.y = -1;
    plane.receiveShadow = true;
    scene.add(plane);



    /*****************************
    * LIGHTS 
    ****************************/

    //ambient light
    ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    // pointlight
    pointLight = new THREE.PointLight(0xFFFFFF);
    pointLight.position.set(150, 300, 150);
    pointLight.castShadow = true;
    scene.add(pointLight);
    pointLight.visible = false;

    // var pointLightHelper = new THREE.PointLightHelper(pointLight, 100);
    // scene.add(pointLightHelper);

    // directionallight
    directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(100, 350, 250);
    directionalLight.shadow.camera.bottom = -500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.left = -500;
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.far = 1000;
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    directionalLight.visible = false;

    // var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 100);
    // scene.add(directionalLightHelper);

    // var directionalCamLightHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    // scene.add(directionalCamLightHelper);

    // spotlight
    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(100, 350, 250);
    spotLight.target = cylinder;
    spotLight.castShadow = true;
    spotLight.shadow.camera.far = 700;
    spotLight.shadow.mapSize.width = 512 * 3;
    spotLight.shadow.mapSize.height = 512 * 3;
    scene.add(spotLight);
    spotLight.visible = false;

    // var spotLightHelper = new THREE.SpotLightHelper(spotLight);
    // scene.add(spotLightHelper);

    // var spotCamLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
    // scene.add(spotCamLightHelper);

    // Add key handling
    document.onkeydown = handleKeyDown;

    /*****************************
     * RENDER 
     * ***************************/
    renderer.render(scene, camera);
}

function handleKeyDown(event) {
    var char = String.fromCharCode(event.keyCode);

    /*****************************
    * TOOGLE SHADOWS 
    ****************************/
    if (char == "S") {
        toggleShadows = !toggleShadows;

        scene.traverse(function (child) {
            if (child instanceof THREE.Mesh && child.name == "") {
                child.castShadow = toggleShadows;
            }
        });
    }

    /*****************************
    * CHANGE MATERIAL 
    ****************************/
    // BASIC
    else if (char == "B") {
        //Go through all children of the scene object and search for a Mesh
        scene.traverse(function (child) {
            if (child instanceof THREE.Mesh && child.name == "") {
                child.material = new THREE.MeshBasicMaterial({ color: 0x0087E6 });
            }
        });
    }
    // LAMBERT
    else if (char == "L") {
        scene.traverse(function (child) {
            if (child instanceof THREE.Mesh && child.name == "") {
                child.material = new THREE.MeshLambertMaterial({ color: 0x0087E6 });
            }
        });
    }
    //PHONG (SMOOTH SHADING)
    else if (char == "P") {
        scene.traverse(function (child) {
            if (child instanceof THREE.Mesh && child.name == "") {
                child.material = new THREE.MeshPhongMaterial(
                    { color: 0x0087E6, shininess: 100 });
            }
        });
    }
    //PHONG (FLAT SHADING)
    else if (char == "F") {
        scene.traverse(function (child) {
            if (child instanceof THREE.Mesh && child.name == "") {
                child.material = new THREE.MeshPhongMaterial(
                    { color: 0x0087E6, shininess: 100, flatShading: true });
            }
        });
    }

    /*****************************
    * CHANGE LIGHTS 
    ****************************/
    else if (char == "1") {
        ambientLight.visible = !ambientLight.visible;
    }
    else if (char == "2") {
        spotLight.visible = !spotLight.visible;
    }
    else if (char == "3") {
        directionalLight.visible = !directionalLight.visible;
    }
    else if (char == "4") {
        pointLight.visible = !pointLight.visible;
    }

    /*****************************
     * RENDER 
     * ***************************/
    renderer.render(scene, camera);
}


