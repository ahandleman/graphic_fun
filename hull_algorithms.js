var running = false;
var rate = 3;
var delay = 1000/rate;
var num_points = 25;
var points = [];
var curr_time = 0;
var max_time = 0;
var algorithm = 1;

function assert(message, bool) {
	if (!bool) {
		console.log(message);
		var breaker = 0;
		console.log(breaker[0].breaking);
	}
}

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
			yellow_lines: [],  //yellow are also around for the time they're marked
			blue_lines: [],  //blue are toggled
			purple_lines: [], //purple are also toggled
			black_lines: [], //black are always on after time
			highlight_toggle: []
		};
		for(var j = 0; j < num_points; j++) {
			points[i].red_lines[j] = [];
			points[i].yellow_lines[j] = [];
			points[i].blue_lines[j] = [];
			points[i].purple_lines[j] = [];
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

function clean_purple(plist, time_track) {
	for(var i = 0; i < plist.length; i++) {
		for(var j = 0; j < num_points; j++) {
			if(points[plist[i]].purple_lines[j].length%2 == 1) {
				points[plist[i]].purple_lines[j].push(time_track);
			}
		}
	}
}

function convert_blue_purple(plist, time_track) {
	for(var i = 0; i < plist.length; i++) {
		for(var j = 0; j < num_points; j++) {
			if(points[plist[i]].blue_lines[j].length%2 == 1) {
				points[plist[i]].blue_lines[j].push(time_track);
				points[plist[i]].purple_lines[j].push(time_track);
			}
		}
	}
}

function convert_blue_black(time_track) {
	for(var i = 0; i < num_points; i++) {
		for(var j = 0; j < num_points; j++) {
			if(points[i].blue_lines[j].length%2 == 1) {
				points[i].blue_lines[j].push(time_track);
				points[i].black_lines[j].push(time_track);
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

function add_yellow_line(point1, point2, time) {
	points[point1].yellow_lines[point2].push(time);
	points[point2].yellow_lines[point1].push(time);
}

function toggle_blue_line(point1, point2, time) {
	points[point1].blue_lines[point2].push(time);
	points[point2].blue_lines[point1].push(time);
}

function toggle_purple_line(point1, point2, time) {
	points[point1].purple_lines[point2].push(time);
	points[point2].purple_lines[point1].push(time);
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

function is_purple_line(p1, p2) {
	for(var i = 0; (i < (points[p1].purple_lines[p2].length - 1)) && points[p1].purple_lines[p2][i] <= curr_time; i++) {
		if(points[p1].purple_lines[p2][++i] > curr_time) {
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

function is_yellow_line(p1, p2) {
	for(var i = 0; (i < (points[p1].yellow_lines[p2].length)) && points[p1].yellow_lines[p2][i] <= curr_time; i++) {
		if(points[p1].yellow_lines[p2][i] == curr_time) {
			return true;
		}
	}
	return false;
}

function draw() {
	// Set the background to light grey and turn off the fill color
	clear();
	for(var i = 0; i < num_points; i++) {
		for(var j = i+1; j < num_points; j++) {
			if(is_black_line(i,j)) {
				stroke("black");
				draw_line(i,j);
			}
			if(is_purple_line(i, j)) {
				stroke("purple");
				draw_line(i,j);
			}
			if(is_blue_line(i,j)) {
				stroke("blue");
				draw_line(i,j);
			}
			if(is_red_line(i,j)) {
				stroke("red");
				draw_line(i,j);
			}
			if(is_yellow_line(i,j)) {
				stroke("yellow");
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

		gift_wrap(false);
		break;
		case 1:
		graham_alg();
		break;
		case 2:
		quick_hull();
		break;
	}
	curr_time = 0;
}

function gift_wrap_helper(p, silent) {

	//find rightmost point
	var time_track = 0;
	var leftmost = 0;
	if(!silent) {toggle_highlight(0, time_track++);}
	for(var i = 1; i < p.length; i++) {
		if(!silent) {toggle_highlight(p[i], time_track++);}
		if(points[p[leftmost]].x < points[p[i]].x) {
			if(!silent) {toggle_highlight(p[i], time_track++);}
		} else {
			if(!silent) {toggle_highlight(p[leftmost], time_track++);}
			leftmost = i;
		}
	}
	if(!silent) {toggle_highlight(p[leftmost], time_track++);}
	var current = leftmost;
	var sol = [p[leftmost]];
	do {
		var testing = 0;
		if (current == 0) {
			testing = 1;
		}
		if(!silent) {toggle_blue_line(p[current], p[testing], time_track);}
		for(var i = 0; i < p.length; i++) {
			if(i == current || i == testing) {
				continue;
			}
			if(!silent) {add_red_line(p[current], p[i], time_track++);}

			if(orient(p[current], p[testing], p[i]) < 0) {
				if(!silent) {toggle_blue_line(p[current], p[testing], time_track);}
				testing = i;
				if(!silent) {toggle_blue_line(p[current], p[testing], time_track++);}
			}
		}
		if(!silent) {toggle_blue_line(p[current], p[testing], time_track);}
		if(!silent) {add_black_line(p[current], p[testing], time_track++);}
		sol.push(p[testing]);
		current = testing;
	} while (current != leftmost);
	if(!silent) {max_time = time_track+1;}
	if(!silent) {clean_highlight_blue();}
	return sol;
}

function gift_wrap(silent) {
	var plist = [];
	for(var i = 0; i < num_points; i++) {
		plist.push(i);
	}
	return gift_wrap_helper(plist, silent);

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

function points_to_angle(i1, i2, i3) {
	p1 = points[i1];
	p2 = points[i2];
	p3 = points[i3];
	var p1p3 = Math.sqrt(Math.pow(p3.x-p1.x,2)+Math.pow(p3.y-p1.y,2));
	var p2p3 = Math.sqrt(Math.pow(p3.x-p2.x,2)+Math.pow(p3.y-p2.y,2));
	var p1p2 = Math.sqrt(Math.pow(p2.x-p1.x,2)+Math.pow(p2.y-p1.y,2));
	return Math.acos((p2p3*p2p3+p1p3*p1p3-p1p2*p1p2)/(2*p2p3*p1p3));
}

tick();
