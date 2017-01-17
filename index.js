// Shows the use of ELEMENT_ARRAY_BUFFER with each side of cube with single color. Each face shares a vertex but not the color value.
// arrows key set the rotation angle for the model matrix

var cameraPosX = 0.0, cameraPosY = 0.0, cameraPosZ = 0.0;
var objectsPosX = 0.0, objectsPosY = 0.0, objectsPosZ = -1.0;
var fovy = 20, aspect = 1.0, near = 0.5, far = 100.0;
var upVector = [0.0, 1.0, 0.0];

var MyGUI = function() {
	this.cameraPosX = cameraPosX;
	this.cameraPosY = cameraPosY;
	this.cameraPosZ = cameraPosZ;
	this.objectsPosX = objectsPosX;
	this.objectsPosY = objectsPosY;
	this.objectsPosZ = objectsPosZ;
	this.near = near;
	this.far = far;
	this.fovy = fovy;
	this.aspect = aspect;
};

var timePrev = Date.now();

function main() {
  	var canvas = document.getElementById('webgl');
	var gl = getWebGLContext(canvas);
	if (!gl){
		console.log('Failed to find context');
	}
	
	var program = initShaders( gl, "vertex-shader", "fragment-shader" );
	gl.useProgram (program);
	gl.program = program;
	
	var numberOfIndices = initVertices(program, gl);
	
	gl.enable(gl.DEPTH_TEST);
	var vMatrix = mat4.create();
	var pMatrix = mat4.create();
	// no neeed to create mvMatrix as it is already created in modelViewMatrixStack.js
	
	var viewVol = [glMatrix.toRadian(fovy), aspect, near, far];
	mat4.perspective(pMatrix, viewVol[0], viewVol[1], viewVol[2], viewVol[3]);
	initProjection(gl, pMatrix);

	var rotAngles = [0.0, 0.0, 0.0];
	var time, elapsed, speed = 3.0;

	var mMatrix = mat4.create();
	var vMatrix = mat4.create();
	var pMatrix = mat4.create();
	var directionMatrix = mat4.create();
	var directionAngleX = 0.0;				// radians
	var directionAngleY = 0.0;				// radians
	var loc = vec3.fromValues(0.0, 0.0, 0.0);
	var dirV = vec3.create();
	vec3.set(dirV, 0.0, 0.0, -1.0);
	var charCode;
	window.onkeydown = function(evt) {
       charCode = evt.keyCode;
	console.log(evt.keyCode);
        
        if (charCode === 38 || charCode === 87) {			//camera moves up
			//posZ = posZ -= 0.01;
			mat4.identity(directionMatrix);
			directionAngleX -= 0.1;
			mat4.rotateY(directionMatrix, directionMatrix, directionAngleY)
			mat4.rotateX(directionMatrix, directionMatrix, directionAngleX)
			vec3.transformMat4(dirV, [0.0, 0.0, -1.0], directionMatrix);
			//posX = posX + 0.01;
			render(gl, numberOfIndices, vMatrix, rotAngles, mMatrix, loc, dirV, directionAngleX);
        }
		else if(charCode == 40 || charCode === 83){			//camera moves down
			//posZ = posZ += 0.01;
			mat4.identity(directionMatrix);
			directionAngleX += 0.10;
			mat4.rotateY(directionMatrix, directionMatrix, directionAngleY)
			mat4.rotateX(directionMatrix, directionMatrix, directionAngleX)
			vec3.transformMat4(dirV, [0.0, 0.0, -1.0], directionMatrix);
			//posX = posX + 0.01;
			render(gl, numberOfIndices, vMatrix, rotAngles, mMatrix, loc, dirV, directionAngleX);
		}
		else if(charCode == 39 || charCode === 68){			//camera moves right
			mat4.identity(directionMatrix);
			directionAngleY -= 0.09;
			mat4.rotateY(directionMatrix, directionMatrix, directionAngleY)
			mat4.rotateX(directionMatrix, directionMatrix, directionAngleX)
			vec3.transformMat4(dirV, [0.0, 0.0, -1.0], directionMatrix);

			//posX = posX + 0.01;
			render(gl, numberOfIndices, vMatrix, rotAngles, mMatrix, loc, dirV, directionAngleX);
		}
		else if(charCode == 37 || charCode === 65){			//camera moves left
			mat4.identity(directionMatrix);
			directionAngleY += 0.09;
			mat4.rotateY(directionMatrix, directionMatrix, directionAngleY)
			mat4.rotateX(directionMatrix, directionMatrix, directionAngleX)
			vec3.transformMat4(dirV, [0.0, 0.0, -1.0], directionMatrix);

			//posX = posX - 0.01;
			render(gl, numberOfIndices, vMatrix, rotAngles, mMatrix, loc, dirV, directionAngleX);
		}
		else if(charCode == 81){		
			rotAngles[2] += 0.1;
			render(gl, numberOfIndices, vMatrix, rotAngles, mMatrix, loc, dirV, directionAngleX);
		}
		else if(charCode == 69){	
			rotAngles[2] -= 0.1;
			render(gl, numberOfIndices, vMatrix, rotAngles, mMatrix, loc, dirV, directionAngleX);
		}
    };
	

	render(gl, numberOfIndices, vMatrix, rotAngles, mMatrix, loc, dirV);

}

function animate(currentangle, time, elapsed, speed){
	time = Date.now();
	elapsed = time - timePrev;
	return (currentangle + (elapsed / 1000) * speed);
}


function keyDownFunc(ev, gl, vMatrix, rotAngles, numberOfIndices){
	console.log(ev.keyCode);
	if(ev.keyCode == 39) { // The right arrow key was pressed. So change the rotation about y axis i.e. rotAngles[1]
		//rotAngles[2] += 0.1;
		objectsPosX+=0.5;
		mat4.identity(vMatrix);
		mat4.lookAt(vMatrix, [cameraPosX, cameraPosY, cameraPosZ], [objectsPosX, objectsPosY, objectsPosZ], [0.0, 1.0, 0.0]);
		render(gl, numberOfIndices, vMatrix, rotAngles);
	} else if (ev.keyCode == 37) { // The left arrow key was pressed
		//rotAngles[2] -= 0.1;
		objectsPosX-=0.5;
		mat4.identity(vMatrix);
		mat4.lookAt(vMatrix, [cameraPosX, cameraPosY, cameraPosZ], [objectsPosX, objectsPosY, objectsPosZ], [0.0, 1.0, 0.0]);
		render(gl, numberOfIndices, vMatrix, rotAngles);
	} else if (ev.keyCode == 38) { 		//The up arrow key was pressed. So change the rotation about x axis
		rotAngles[0] += 0.1;
		render(gl, numberOfIndices, vMatrix, rotAngles);
	} else if (ev.keyCode == 40) {
		rotAngles[0] -= 0.1;
		render(gl, numberOfIndices, vMatrix, rotAngles);
	}
}

function initProjection(gl, pMatrix){
	var u_pMatrix = gl.getUniformLocation(gl.program, 'u_pMatrix');
	if (!u_pMatrix) { 
    	console.log('Failed to get the storage locations of proj');
    	return;
  	}
	gl.uniformMatrix4fv(u_pMatrix, false, flatten(pMatrix));
}

function initMVMatrix(gl, mvMatrix, vMatrix){
	var tempM = mat4.create();
	// The order of mv is important. Toggle the commenting of following lines and that of lookAT call to see.
	mat4.multiply(tempM, vMatrix, mvMatrix);
	//mat4.multiply(mvMatrix, mvMatrix, vMatrix);
	var u_mvMatrix = gl.getUniformLocation(gl.program, 'u_mvMatrix');
	gl.uniformMatrix4fv(u_mvMatrix, false, flatten(tempM));	

}

function render (gl, numberOfIndices, vMatrix, rotAngles, mMatrix, loc, dirV, directionAngleX){
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.identity(mMatrix);
	mat4.identity(vMatrix);
	


	console.log(dirV[1]%Math.PI)
	console.log(dirV[2]%Math.PI)
	

	if(3*Math.PI/2 < Math.abs((directionAngleX)%(Math.PI*2)) || Math.abs((directionAngleX)%(Math.PI*2)) < Math.PI/2)
    	mat4.lookAt(vMatrix, loc, dirV, [0.0, 1.0, 0.0]);
  	else
    	mat4.lookAt(vMatrix, loc, dirV, [0.0, -1.0, 0.0]);

	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, -5.5]);
	mat4.rotateX(mvMatrix, mvMatrix, rotAngles[0]);
	mat4.rotateY(mvMatrix, mvMatrix, rotAngles[1]);
	mat4.rotateZ(mvMatrix, mvMatrix, rotAngles[2]);
	mat4.scale(mvMatrix, mvMatrix, [0.25, 0.25, 0.25]);
	
	initMVMatrix(gl, mvMatrix,  vMatrix);
	gl.drawElements(gl.TRIANGLES, numberOfIndices, gl.UNSIGNED_BYTE, 0);	


	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, mvMatrix, [0.0, 0.0, 5.5]);
	mat4.rotateX(mvMatrix, mvMatrix, rotAngles[0]);
	mat4.rotateY(mvMatrix, mvMatrix, rotAngles[1]);
	mat4.rotateZ(mvMatrix, mvMatrix, rotAngles[2]);
	mat4.scale(mvMatrix, mvMatrix, [0.25, 0.25, 0.25]);
	
	initMVMatrix(gl, mvMatrix,  vMatrix);
	gl.drawElements(gl.TRIANGLES, numberOfIndices, gl.UNSIGNED_BYTE, 0);	

	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, mvMatrix, [5.5, 0.0, 0.0]);
	mat4.rotateX(mvMatrix, mvMatrix, rotAngles[0]);
	mat4.rotateY(mvMatrix, mvMatrix, rotAngles[1]);
	mat4.rotateZ(mvMatrix, mvMatrix, rotAngles[2]);
	mat4.scale(mvMatrix, mvMatrix, [0.25, 0.25, 0.25]);
	
	initMVMatrix(gl, mvMatrix,  vMatrix);
	gl.drawElements(gl.TRIANGLES, numberOfIndices, gl.UNSIGNED_BYTE, 0);	

	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, mvMatrix, [-5.5, 0.0, 0.0]);
	mat4.rotateX(mvMatrix, mvMatrix, rotAngles[0]);
	mat4.rotateY(mvMatrix, mvMatrix, rotAngles[1]);
	mat4.rotateZ(mvMatrix, mvMatrix, rotAngles[2]);
	mat4.scale(mvMatrix, mvMatrix, [0.25, 0.25, 0.25]);
	
	initMVMatrix(gl, mvMatrix,  vMatrix);
	gl.drawElements(gl.TRIANGLES, numberOfIndices, gl.UNSIGNED_BYTE, 0);	


}

function initVertices(program, gl){
  // Create a cube
  //    v6----- v5
  //   /|      /|
  //  v1------v0|
  //  | |     | |
  //  | |v7---|-|v4
  //  |/      |/
  //  v2------v3
  var vertices = [ // Vertex coordinates
				 1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
			     1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
			     1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
			    -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
			    -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
			     1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
				 ];
	vertices = flatten(vertices);
	var noOfDim = 3;
	var numberOfIndices = vertices.length;

	var colors = [ // Colors
					0.4, 0.4, 1.0, 1.0,  	0.4, 0.4, 1.0, 1.0,  	0.4, 0.4, 1.0, 1.0,  	0.4, 0.4, 1.0, 1.0,  // v0-v1-v2-v3 front(blue)
				    0.4, 1.0, 0.4, 1.0,  	0.4, 1.0, 0.4, 1.0,  	0.4, 1.0, 0.4, 1.0,  	0.4, 1.0, 0.4, 1.0,  // v0-v3-v4-v5 right(green)
				    1.0, 0.4, 0.4, 1.0,  	1.0, 0.4, 0.4, 1.0,  	1.0, 0.4, 0.4, 1.0,  	1.0, 0.4, 0.4, 1.0,  // v0-v5-v6-v1 up(red)
				    1.0, 1.0, 0.4, 1.0,	 	1.0, 1.0, 0.4, 1.0,  	1.0, 1.0, 0.4, 1.0,  	1.0, 1.0, 0.4, 1.0,  // v1-v6-v7-v2 left
				    1.0, 1.0, 1.0, 1.0,  	1.0, 1.0, 1.0, 1.0,  	1.0, 1.0, 1.0, 1.0,  	1.0, 1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
				    0.4, 1.0, 1.0, 1.0,  	0.4, 1.0, 1.0, 1.0,  	0.4, 1.0, 1.0, 1.0,  	0.4, 1.0, 1.0, 1.0,   // v4-v7-v6-v5 back
				];
	colors = flatten(colors);
	var colorItemSize = 4;

	var ELEMENT_SIZE = vertices.BYTES_PER_ELEMENT;  // array ( vertices) must be flatten or should be "FLOAT32ARAAY before call."
	
	var indices = new Uint8Array ([ // flatten is a utility function that converts to Float32Array only. So it will not work here. Uint8 handle 256 indices at max. for more use Uint16Array
									 0, 1, 2,   0, 2, 3,    // front
								     4, 5, 6,   4, 6, 7,    // right
								     8, 9,10,   8,10,11,    // up
								    12,13,14,  12,14,15,    // left
								    16,17,18,  16,18,19,    // down
								    20,21,22,  20,22,23,     // back
								]);
	var numberOfIndices = indices.length;

	// Setting up vertices and colors in inteleaved buffer
	var indexBuffer = gl.createBuffer();

	if (!initArrayBuffer(gl, vertices, noOfDim, gl.FLOAT, 'a_Position'))
    	return -1;   

  	if (!initArrayBuffer(gl, colors, colorItemSize, gl.FLOAT, 'a_Color'))
    	return -1;

	if (!indexBuffer){ console.log('Failed to create the index object ');	return -1;}
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
	
	return numberOfIndices;
}

function initArrayBuffer(gl, data, itemsPerElement, type, attribute){
	var buffer = gl.createBuffer();
	if (!buffer) {	console.log('Failed to create the buffer object');	return false;	}

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

	var a_attribute = gl.getAttribLocation(gl.program, attribute);
	if (a_attribute < 0) { console.log ("Failed to Get the attributte"); return;	}

	gl.vertexAttribPointer(a_attribute, itemsPerElement, type, false, 0, 0);
	gl.enableVertexAttribArray(a_attribute);

	return true;
}