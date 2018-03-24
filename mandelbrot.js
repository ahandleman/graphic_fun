var step_size = 2;
var curr_depth = 0;
var darkness = 255;
var target_depth = 100*step_size;
var running = false;
var rate = 20;

function setup() {
// Sets the screen to be 720 pixels wide and 400 pixels high
createCanvas(2000, 2000);
noLoop();
background(255,255,255);
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

	return [n, Tr, Ti];
}

function draw() {
// Set the background to light grey and turn off the fill color
stroke(darkness);
for(var i = 0; i < 2000; i++) {
	for(var j = 0; j < 2000; j++) {
		if (iterateEquation((j/500) - 2, (i/500) - 2)[0] == curr_depth) {
			point(i,j);
		};
	}
}
}

function reset(event) {
	curr_depth = 0;
	running = true;
	tick();
	running = false;
}

function button(event) {
	running = !running;
	console.log("running: " + running);
}

function tick() {
	darkness = 255 - ((curr_depth/target_depth)*255);
	if(running && curr_depth < target_depth) {
		curr_depth += step_size;
		redraw();
	}
	setTimeout(tick, 100);
}

tick();


