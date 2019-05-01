/*
* robot_arm.js
* This program shows how to composite modeling transformations
* to draw translated and rotated hierarchical models.
*
* Adapted for OpenGL 3.2 Core Profile by Alex Clarke, 2012, with
* libraries provided with Interactive Computer Graphics 6th Ed. 
* by Dr. Edward Angel and Dave Shreiner
*
* Adapted from the above for WebGL by Alex Clarke, 2016, with
* libraries provided with Interactive Computer Graphics 7th Ed.
* by Dr. Edward Angel and Dave Shreiner
*/


//----------------------------------------------------------------------------
// Variable Setup 
//----------------------------------------------------------------------------

// This variable will store the WebGL rendering context
var gl;

//Define points for
var cubeVerts = [
    [0.5, 0.5, 0.5, 1],     //0
    [0.5, 0.5, -0.5, 1],    //1
    [0.5, -0.5, 0.5, 1],    //2
    [0.5, -0.5, -0.5, 1],   //3
    [-0.5, 0.5, 0.5, 1],    //4
    [-0.5, 0.5, -0.5, 1],   //5
    [-0.5, -0.5, 0.5, 1],   //6
    [-0.5, -0.5, -0.5, 1],  //7
];

//Look up patterns from cubeVerts for different primitive types
var cubeLookups = [
    //Solid Cube - use TRIANGLES, starts at 0, 36 vertices
    0, 4, 6, //front
    0, 6, 2,
    1, 0, 2, //right
    1, 2, 3,
    5, 1, 3, //back
    5, 3, 7,
    4, 5, 7, //left
    4, 7, 6,
    4, 0, 1, //top
    4, 1, 5,
    6, 7, 3, //bottom
    6, 3, 2,
]; //(6 faces)(2 triangles/face)(3 vertices/triangle)

//load points into points array - runs once as page loads.
var points = [];
for (var i = 0; i < cubeLookups.length; i++) {
    points.push(cubeVerts[cubeLookups[i]]);
}
//console.log(points)

var red = [1.0, 0.0, 0.0, 1.0];
var green = [0.0, 1.0, 0.0, 1.0];
var blue = [0.0, 0.0, 1.0, 1.0];
var lightred = [1.0, 0.5, 0.5, 1.0];
var lightgreen = [0.5, 1.0, 0.5, 1.0];
var lightblue = [0.5, 0.5, 1.0, 1.0];
var white = [1.0, 1.0, 1.0, 1.0];

//Set up colors array
var colors = [
    //Colors for Solid Cube
    lightblue, lightblue, lightblue, lightblue, lightblue, lightblue,
    lightgreen, lightgreen, lightgreen, lightgreen, lightgreen, lightgreen,
    lightred, lightred, lightred, lightred, lightred, lightred,
    blue, blue, blue, blue, blue, blue,
    red, red, red, red, red, red,
    green, green, green, green, green, green,
];

//Variables for Transformation Matrices
var mv = new mat4();
var p = new mat4();
var mvLoc, projLoc;


//Model state variables
var shoulder = 0, elbow = 0; 
var rot = 0;

//----------------------------------------------------------------------------
// Initialization Event Function
//----------------------------------------------------------------------------

window.onload = function init() {
    // Set up a WebGL Rendering Context in an HTML5 Canvas
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    //  Configure WebGL
    //  eg. - set a clear color
    //      - turn on depth testing
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Set up data to draw
    // Load the data into GPU data buffers and
    // Associate shader attributes with corresponding data buffers
    //***Vertices***
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    
    program.vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(program.vPosition, 4, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(program.vPosition);

    //***Colors***
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);
    program.vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(program.vColor, 4, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enableVertexAttribArray(program.vColor);

    // Get addresses of shader uniforms
    projLoc = gl.getUniformLocation(program, "projection");    //projection
    mvLoc = gl.getUniformLocation(program, "modelview");     //modelview

    //Set initial view
    var eye = vec3(0.0, 0.0, 10.0); //position of the camera specified in world coordinates
    var at = vec3(0.0, 0.0, 0.0);   //indicates the target of the camera (where we want to look)
    var up = vec3(0.0, 1.0, 0.0);   //defines which direction is up
    mv = lookAt(eye,at,up);


    //Animate - draw continuously
    render();
};



//----------------------------------------------------------------------------
// Animation and Rendering Event Functions
//----------------------------------------------------------------------------
//updates and displays the model based on elapsed frames
//sets up another animation event as soon as possible
function render() {
    requestAnimFrame(render);

    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    //Set up projection matrix
    var ratio = gl.viewportWidth/gl.viewportHeight;
    var pAngle = parseInt(document.getElementById("pAngle").value);
    var zNear = parseFloat(document.getElementById("zNear").value);
    var zFar = parseInt(document.getElementById("zFar").value);

    //console.log(pAngle, zNear, zFar)
    p = perspective(pAngle, ratio, zNear, zFar);
    gl.uniformMatrix4fv(projLoc, gl.FALSE, flatten(p));


    var type = gl.LINE_LOOP; //HINT for exercise 3
    var start = 0; 
    var num = 36; 

    var matStack = [];

    //Save view transform
    matStack.push(mv); //save transformation (1st - initial view)

    /*************************
     * SHOULDER
     *************************/
    //Rotation (X axis) Shoulder Joint
    mv = mult(mv, rotate(rot, [1, 0, 0]));
    //Shoulder Joint
    mv = mult(mv, rotate(shoulder, [0, 0, 1])); //rotate shoulder
    //Position Upper Arm Cube
    mv = mult(mv, translate(1.0, 0.0, 0.0));    //rotation around center on (-1,0,0)
   

    matStack.push(mv); //save transformation 

    //Scale and Draw Upper Arm
    mv = mult(mv, scalem(2.0, 0.5, 1.0)); // 1º colocar ANTES DAS ROTAÇÕES
    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
    gl.drawArrays(type, start, num);


    //ELBOW

    mv = matStack.pop()

    mv = mult(mv, translate(1.0, 0.0, 0.0))
    mv = mult(mv, rotate(elbow, ([0,0,1])))
    mv = mult(mv, translate(1.0, 0.0, 0.0))
    mv = mult(mv, scalem(2.0, 0.5, 1.0)); // 1º colocar ANTES DAS ROTAÇÕES
    
    gl.uniformMatrix4fv(mvLoc, gl.FALSE, flatten(mv));
    gl.drawArrays(type, start, num);
    //Restore mv to initial state
    mv = matStack.pop(); //retrieve transformation (1st - initial view)


}



//----------------------------------------------------------------------------
// Keyboard Event Functions
//----------------------------------------------------------------------------
document.onkeydown = function handleKeyDown(event) {
    //Detect shift key
    var shift = event.shiftKey;

    //Get unshifted key character
    var key = String.fromCharCode(event.keyCode);

    //Shoulder Updates
    if (!shift && key == "R") {
        rot++;
    }
    if (shift && key == "R") {
        rot--;
    }

    if (!shift && key == "S") {
        if (shoulder < 90) 
            shoulder++;
        else 
            shoulder = 90;
    }
    if (shift && key == "S") {
        if (shoulder > -90)
            shoulder--;
        else
            shoulder = -90;
    }

    if (!shift && key == "E") {
        if (elbow < 145) 
            elbow++;
        else 
            elbow = 145;
    }
    if (shift && key == "E") {
        if (elbow > 0)
            elbow--;
        else
            elbow = 0;
    }
}
