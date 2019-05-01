//GLOBALS
var gl;
var N;
var R;
var xCenter, yCenter
var vertices = [];

window.onload = function init() {

	// Gets 3D Canvas context
	var canvas = document.getElementById('gl-canvas');

	// JavaScript utilities for common WebGL tasks (checks for success or failure)
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL not available"); }

	// Sets WebGL viewport (same size as Canvas element)
	gl.viewport(0, 0, canvas.width, canvas.height);
	// Sets background color
	gl.clearColor(0.9, 0.9, 0.8, 1.0);

	// Compiles both vertex and fragment shaders in GPU 
	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	

	// Creates buffer for geometric data
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	//gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); //bind LATTER, AFTER the definition if the array of geometric data

	// Links shader variables to data buffers
	var vPosition = gl.getAttribLocation(program, "vPosition"); //gets attribute shader variable
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);
	
	document.getElementById("btn").addEventListener("click", drawPolygon);

	//draw a polygon using data provided by default from the web form
	drawPolygon();
};

function drawPolygon() {
	R = parseFloat(document.getElementById('raio').value);
	N = parseInt(document.getElementById('n').value);
	xCenter = parseFloat(document.getElementById('xCentro').value);
	yCenter = parseFloat(document.getElementById('yCentro').value);

	var alpha = 2 * Math.PI / N;
	vertices = [];
	for (i = 0; i < N; i++) {
		var x = xCenter + R * Math.cos(i*alpha);
		var y = yCenter + R * Math.sin(i*alpha);
		vertices.push(x);
		vertices.push(y);
	}

	// Uploads geometric data into GPU
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	render();
}

function render() {
	//resets the color buffer, using the color specified in clearColor function
	gl.clear(gl.COLOR_BUFFER_BIT);
	// draws a filled polygon with N vertexes
	gl.drawArrays(gl.TRIANGLE_FAN, 0, N);
}





