var y_size = 1000;
var x_size = 1000;
var step_size = 2;
var curr_depth = 1;
var darkness = 255;
var target_depth = Math.pow(step_size, 10);
var running = false;
var rate = 20;

function setup() {
createCanvas(x_size, y_size);
noLoop();
}

function iterateEquation(real, imaginary)
{
	var Zr = 0;
	var Zi = 0;
	var Tr = 0;
	var Ti = 0;
	var n  = 0;

	for ( ; n<curr_depth && (Tr+Ti)<=4; ++n ) {
		Zi = 2 * Zr * Zi + real;
		Zr = Tr - Ti + imaginary;
		Tr = Zr * Zr;
		Ti = Zi * Zi;
	}

	return n;
}

function draw() {
stroke(darkness);
for(var i = 0; i < y_size; i++) {
	for(var j = 0; j < x_size; j++) {
		if (iterateEquation((4*j/x_size) - 2, (4*i/y_size) - 2) == curr_depth) {
			point(i,j);
		};
	}
}
}

function reset(event) {
	running = false;	
	background(255);
}

function button(event) {
	reset(0);
	curr_depth = 1;
	running = true;
	target_depth = Math.pow(step_size, document.getElementById("Depth").value);
}

function tick() {
	if(running && curr_depth < target_depth) {
		darkness = 255 - ((Math.log(curr_depth)/Math.log(target_depth))*255);
		document.getElementById("curr_depth").value = curr_depth;
		redraw();
		curr_depth *= step_size;
	}
	setTimeout(tick, 2000);
}

tick();


