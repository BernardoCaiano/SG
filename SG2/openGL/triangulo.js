var gl;

window.onload = function init()
{
	var canvas = document.getElementById('gl-canvas');
	gl=WebGLUtils.setupWebGL(canvas);

	if(!gl)	{alert("WebGL não está disponível"); }

	var vertices= new Float32Array([-1,-1,
									 0,1,
									 1,-1]);
	var cores= new Float32Array([1,0,0,1,
								 0,1,0,1,
								 0,0,1,1]);

	// Configurar o WebGL
	gl.viewport( 0, 0, canvas.width, canvas.height);
	gl.clearColor(0.8, 0.8, 0.8, 1.0);

	// Carregar os shaders e incializar os buffers de atributos
	var program = initShaders( gl, "vertex-shader", "fragment-shader");

	gl.useProgram(program);

	// Carregar dados para o GPU
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	// Associar variáveis do shader aos Buffers de dados
	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	var colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, cores, gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	render();
};

function render()
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
}