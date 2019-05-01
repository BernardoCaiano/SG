var cube;
var controls;
var renderer, scene, camera;

// once everything is loaded, we run our Three.js stuff
window.onload = function init() {

    scene = new THREE.Scene();

    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 100);
    camera.position.z = 5;
    camera.position.y = 1

    controls = new THREE.OrbitControls(camera);
    controls.addEventListener('change', function () { renderer.render(scene, camera); });


    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.setClearColor("#000000");

    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.PlaneGeometry(5, 5, 5);
    var material = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geometry, material);

    plane.rotation.x = (Math.PI / 2)

    scene.add(plane);

    function createHouse(width, height, length) {
        let w = width, h = height, l = length
        let houseGeometry = new THREE.Geometry()

        houseGeometry.vertices.push(new THREE.Vector3(0, 0, 0), //0
            new THREE.Vector3(w, 0, 0), //1
            new THREE.Vector3(w, h, 0), //2
            new THREE.Vector3(0, h, 0), //3
            new THREE.Vector3(w/2, h + h/2, 0), //4
            new THREE.Vector3(0, 0, l), //5
            new THREE.Vector3(w, 0, l), //6
            new THREE.Vector3(w, h, l), //7
            new THREE.Vector3(0, h, l), //8
            new THREE.Vector3(w/2, h + h/2, l)) //9

        houseGeometry.faces.push(new THREE.Face3(0,1,2),
            new THREE.Face3(0,2,3),
            new THREE.Face3(0,1,2),
            new THREE.Face3(0,1,2),
            new THREE.Face3(0,1,2),
            new THREE.Face3(0,1,2),
            new THREE.Face3(0,1,2),)
    }

    // var geometry = new THREE.BoxGeometry(1, 1, 1);
    // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // var cube = new THREE.Mesh(geometry, material);
    // plane.add(cube);

    animate();
}


function animate() {
    // rotate the cube around its axes
    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;

    // animate using requestAnimationFrame
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}


