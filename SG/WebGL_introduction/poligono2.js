//GLOBALS
var gl;
var N;
var R;
var xCenter, yCenter
var vertices = [];

var wireframe = false; var primitive;

var program1;
var program2;

window.onload = function init() {
	// Gets 3D Canvas context
	var canvas = document.getElementById('gl-canvas');

	// JavaScript utilities for common WebGL tasks (checks for success or failure)
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL not available"); }

	// // Necessita de tabindex no canvas
	// canvas.onkeydown = handleKeyDown;

	// Sets WebGL viewport (same size as Canvas element)
	gl.viewport(0, 0, canvas.width, canvas.height);
	// Sets background color
	gl.clearColor(0.9, 0.9, 0.8, 1.0);

	// Compiles both vertex and fragment shaders in GPU 
	program1 = initShaders(gl, "vertex-shader", "fragment-shader");
	program2 = initShaders(gl, "vertex-shader", "fragment-shader2");
	gl.useProgram(program1); //usa por defeito a 1ª configuração do fragment shader

	// Carrega dados para o GPU
	var bufferId = gl.createBuffer(); //buffer para as posições dos vértices
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

	// Creates buffer for geometric data
	var bufferId = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
	//gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	// Links shader variables to data buffers
	var vPosition = gl.getAttribLocation(program1, "vPosition"); //gets attribute shader variable
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	//draw a polygon using data provided by default from the web form
	drawPolygon();

	window.addEventListener('keydown', handleKeyDown);
};


function drawPolygon() {
	R = parseFloat(document.getElementById('raio').value);
	N = parseInt(document.getElementById('n').value);
	xCenter = parseFloat(document.getElementById('xCentro').value);
	yCenter = parseFloat(document.getElementById('yCentro').value);

	var alpha = 2 * Math.PI / N;
	vertices = [];
	for (i = 0; i < N; i++) {
		var x = xCenter + R * Math.cos(i * alpha);
		var y = yCenter + R * Math.sin(i * alpha);
		vertices.push(x);
		vertices.push(y);
	}

	// Uploads geometric data into GPU
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
	render();
}

function handleKeyDown(e) {
	console.log("Key pressed: " + e.keyCode + " wireframe=" + wireframe);
	switch (String.fromCharCode(e.keyCode)) {
		case "w":
		case "W":
			wireframe = !wireframe;
			render(); //redraw the scene
			break;
	}
}

function render() {
	//resets the color buffer, using the color specified in clearColor function
	gl.clear(gl.COLOR_BUFFER_BIT);

	//configures the graphical primitive 
	if (wireframe) {
		gl.useProgram(program2);
		primitive = gl.LINE_LOOP;
	}
	else {
		gl.useProgram(program1);
		primitive = gl.TRIANGLE_FAN;
	}
	// draws a polygon with N vertexes
	gl.drawArrays(primitive, 0, N);
}

