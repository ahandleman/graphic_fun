var y_size = 2000;
var x_size = 2000;

function setup() {
	createCanvas(x_size, y_size);
	noLoop();
	draw();
}

function is_prime(num) {
    for(var i = 2, s = Math.sqrt(num); i <= s; i++)
        if(num % i === 0) return false; 
    return num !== 1;
}

function draw() {
	var x = x_size/2;
	var y = y_size/2;
	var sidelength = 1;
	var i = 1;
	while(x < x_size && y < y_size && x > 0 && y > 0) {
		for(var j = 0; j  < sidelength; j++) {
			x++;
			i++;
			if (is_prime(i)) {
				point(x, y);
			}
		}		
		for(var j = 0; j  < sidelength; j++) {
			y++;
			i++;
			if (is_prime(i)) {
				point(x, y);
			}
		}
		sidelength++;
		for(var j = 0; j  < sidelength; j++) {
			x--;
			i++;
			if (is_prime(i)) {
				point(x, y);
			}
		}		
		for(var j = 0; j  < sidelength; j++) {
			y--;
			i++;
			if (is_prime(i)) {
				point(x, y);
			}
		}
		sidelength++;
	}
}



