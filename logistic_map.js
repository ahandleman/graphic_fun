var y_size = 10000;
var x_size = 10000;
var initial_iters = 500;
var tracked_iters = 500;
var seed = 0.4;

function setup() {
createCanvas(x_size, y_size);
noLoop();
}

function iterateEquation(xcrd)
{
	x = 4*xcrd/x_size;
	stroke(0);
	var n = seed;
	for (var i = 0; i<initial_iters; ++i ) {
		n = x*n*(1-n);
	}
	y_list = [];
	for (var i = 0; i<tracked_iters; ++i ) {
		y_list.push(n);
		n = x*n*(1-n);
	}
	y_list.sort();
	var i = 0;
	for (var y = 0; y < y_size && i < y_list.length; ++y) {
		if (y_list[i] < (y+1)/y_size) point(xcrd, y_size - y);
		while (i < y_list.length && y_list[i] < (y+1)/y_size) i++;
	}
	return false;
}

function draw() {
	stroke(0);
	for(var i = 0; i < x_size; i++) {
		iterateEquation(i);
	}
}

function reset(event) {
	background(255);
	initial_iters = document.getElementById("initial_iters").value;
	tracked_iters = document.getElementById("tracked_iters").value;	
	redraw();
}


