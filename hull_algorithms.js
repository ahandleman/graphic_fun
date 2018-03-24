var running = false;
var rate = 3;
var delay = 1000/rate;
var num_points = 25;
var points = [];
var curr_time = 0;
var max_time = 0;
var algorithm = 1;

function set_speed() {
	rate = document.getElementById("rate").value;
	delay = 1000/rate;
}

//yes, I'm using insertion sort because it's easier to code.  Sue me.
function sort_points() {
	for(var i = 1; i < num_points; i++) {
		for (var j = i; j > 0; j--) {
			if (points[j].x < points[j-1].x) {
				var temp = points[j];
				points[j] = points[j-1];
				points[j-1] = temp;
			}
		}
	}
}

function generate_points(number) {
	num_points = number;
	for(var i = 0; i < num_points; i++) {
		points[i] = {
			x: Math.random(), 
			y: Math.random(), 
			red_lines: [],  //red are around for the time they're marked
			blue_lines: [],  //blue are toggled
			black_lines: [], //black are always on after time
			highlight_toggle: []
		};
		for(var j = 0; j < num_points; j++) {
			points[i].red_lines[j] = [];
			points[i].blue_lines[j] = [];
			points[i].black_lines[j] = [];
		}
	}
}

function orient(a, b, c) {
	return ((points[b].x*points[c].y + points[a].x*points[b].y + points[a].y*points[c].x) - (points[a].y*points[b].x + points[b].y*points[c].x + points[a].x*points[c].y));
}

function clean_highlight_blue() {
	for(var i = 0; i < num_points; i++) {
		if(points[i].highlight_toggle.length%2 == 1) {
			points[i].highlight_toggle.push(max_time);
		}
		for(var j = 0; j < num_points; j++) {
			if(points[i].blue_lines[j].length%2 == 1) {
				points[i].blue_lines[j].push(max_time);
			}
		}
	}
}

function toggle_highlight(point1, time) {
	points[point1].highlight_toggle.push(time);
}

function add_red_line(point1, point2, time) {
	points[point1].red_lines[point2].push(time);
	points[point2].red_lines[point1].push(time);
}

function toggle_blue_line(point1, point2, time) {
	points[point1].blue_lines[point2].push(time);
	points[point2].blue_lines[point1].push(time);
}

function add_black_line(point1, point2, time) {
	points[point1].black_lines[point2].push(time);
	points[point2].black_lines[point1].push(time);
}

function setup() {
	// Sets the screen to be 800 pixels wide and 800 pixels high
	createCanvas(800, 800);
	num_points = document.getElementById("num_points").value;
	generate_points(num_points);
	noLoop();
	background(255,255,255);
}

function draw_line(p1, p2) {
	line(25 + (750*points[p1].x), 25 + (750*points[p1].y), 25 + (750*points[p2].x), 25 + (750*points[p2].y));
}

function is_highlighted(p1) {
	for(var i = 0; (i < (points[p1].highlight_toggle.length - 1)) && points[p1].highlight_toggle[i] <= curr_time; i++) {
		if(points[p1].highlight_toggle[++i] > curr_time) {
			return true;
		}
	}
	return false;
}

function is_red_line(p1, p2) {
	for(var i = 0; (i < (points[p1].red_lines[p2].length)) && points[p1].red_lines[p2][i] <= curr_time; i++) {
		if(points[p1].red_lines[p2][i] == curr_time) {
			return true;
		}
	}
	return false;
}

function is_blue_line(p1, p2) {
	for(var i = 0; (i < (points[p1].blue_lines[p2].length - 1)) && points[p1].blue_lines[p2][i] <= curr_time; i++) {
		if(points[p1].blue_lines[p2][++i] > curr_time) {
			return true;
		}
	}
	return false;
}

function is_black_line(p1, p2) {
	if((points[p1].black_lines[p2].length > 0) && points[p1].black_lines[p2][0] <= curr_time) {
		return true;
	} else {
		return false;
	}
}

function draw() {
	// Set the background to light grey and turn off the fill color
	clear();
	for(var i = 0; i < num_points; i++) {
		for(var j = i+1; j < num_points; j++) {
			if(is_red_line(i,j)) {
				stroke("red");
				draw_line(i,j);
			}
			if(is_blue_line(i,j)) {
				stroke("blue");
				draw_line(i,j);
			}
			if(is_black_line(i,j)) {
				stroke("black");
				draw_line(i,j);
			}
		}
	}
	stroke("green");
	for(var i = 0; i < num_points; i++) {
		if (is_highlighted(i)) {
			stroke("red");
			ellipse(25 + (750*points[i].x), 25 + (750*points[i].y), 10, 10);
			stroke("green");
		}
		ellipse(25 + (750*points[i].x), 25 + (750*points[i].y), 4, 4);
	}
}

function reset(event) {
	set_speed();
	running = false;
	num_points = document.getElementById("num_points").value;
	generate_points(num_points);
	redraw();
}

function tick() {
	if(running && curr_time <= max_time) {
		redraw();
		curr_time++;
	}
	setTimeout(tick, delay);
}

function button(event) {
	running = !running;
	switch(algorithm){
		case 0:
		gift_wrap();
		break;
		case 1:
		graham_alg();
		break;
		case 2:
		merge_hull();
		break;
	}
	curr_time = 0;
}

function gift_wrap() {
	//find rightmost point
	var time_track = 0;
	var rightmost = 0;
	toggle_highlight(0, time_track++);
	for(var i = 1; i < num_points; i++) {
		toggle_highlight(i, time_track++);
		if(points[rightmost].x > points[i].x) {
			toggle_highlight(i, time_track++);
		} else {
			toggle_highlight(rightmost, time_track++);
			rightmost = i;
		}
	}
	toggle_highlight(rightmost, time_track++);
	var current = rightmost;
	do {
		var testing = 0;
		if (current == 0) {
			testing = 1;
		}
		toggle_blue_line(current, testing, time_track);
		for(var i = 0; i < num_points; i++) {
			if(i == current || i == testing) {
				continue;
			}
			add_red_line(current, i, time_track++);

			if(orient(current, testing, i) < 0) {
				toggle_blue_line(current, testing, time_track);
				testing = i;
				toggle_blue_line(current, testing, time_track++);
			}
		}
		toggle_blue_line(current, testing, time_track);
		add_black_line(current, testing, time_track++);
		current = testing;
	} while (current != rightmost);
	max_time = time_track+1;
	clean_highlight_blue();
}

function graham_alg() {
	sort_points();
	
	var time_track = 0;
	var current = 0;
	var stack = [];

	//first do the top
	for(var i = 1; i < num_points; i++) {
		add_red_line(current, i, time_track++);
		while(stack.length > 0 && orient(stack[stack.length-1], current, i) < 0) {
			toggle_blue_line(stack[stack.length-1], current, time_track);
			current = stack.pop();
			add_red_line(current, i, time_track++);
		}
		toggle_blue_line(current, i, time_track++);
		stack.push(current);
		current = i;
	}
	while(stack.length > 0) {
		var temp = current;
		current = stack.pop();
		toggle_blue_line(temp, current, time_track);
		add_black_line(temp, current, time_track);
	}
	time_track++;

	//then the bottom
	for(var i = 1; i < num_points; i++) {
		add_red_line(current, i, time_track++);
		while(stack.length > 0 && orient(stack[stack.length-1], current, i) > 0) {
			toggle_blue_line(stack[stack.length-1], current, time_track);
			current = stack.pop();
			add_red_line(current, i, time_track++);
		}
		toggle_blue_line(current, i, time_track++);
		stack.push(current);
		current = i;
	}
	while(stack.length > 0) {
		var temp = current;
		current = stack.pop();
		toggle_blue_line(temp, current, time_track);
		add_black_line(temp, current, time_track);
	}
	time_track++;
	max_time = time_track+1;
	clean_highlight_blue();
}

tick();
