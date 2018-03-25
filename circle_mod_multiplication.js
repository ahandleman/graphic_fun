var circ_size = 100;
var multiplier = 2;
var radius = 350;
var x_offset = 400;
var y_offset = 400;
var curr_time = 0;
var full_time = 200;
var running = false;
var rate = 20;
function x_from_number(number) {
  var degree = (number / circ_size)*2*Math.PI;
  return x_offset + (Math.sin(degree) * radius);
};

function y_from_number(number) {
  var degree = (number/circ_size)*2*Math.PI;
  return y_offset + (Math.cos(degree) * radius);
};

function setup() {
  // Sets the screen to be 720 pixels wide and 400 pixels high
  createCanvas(800, 800);
  noLoop();

}

function draw() {
  // Set the background to black and turn off the fill color
  background(0);
  stroke("green");
  ellipse(x_offset,y_offset,radius*2,radius*2);
  stroke("black");
  for(var i = 0; i < circ_size; i = i+1) {
    line(x_from_number(i), y_from_number(i), x_from_number(multiplier*i), y_from_number(multiplier*i));
  }

}

function reset(event) {
  curr_time = 0;
  running = true;
  tick();
  running = false;
}

function button(event) {
  full_time = document.getElementById("rate").value*document.getElementById("time").value;
  running = !running;
  rate = document.getElementById("rate").value;
}

function update_time(event) {
  var temp = curr_time/full_time;
  full_time = document.getElementById("rate").value*document.getElementById("time").value;
  rate = document.getElementById("rate").value;
}

function tick() {
  if(running) {
    circ_size = document.getElementById("circ_size_start").value*((full_time-curr_time)/full_time) + document.getElementById("circ_size_end").value*(curr_time/full_time);
    multiplier = document.getElementById("multiplier_start").value*((full_time-curr_time)/full_time) + document.getElementById("multiplier_end").value*(curr_time/full_time);
    document.getElementById("circ_size_curr").value = circ_size;
    document.getElementById("multiplier_curr").value = multiplier;
    curr_time++;
    if (curr_time >= full_time) {
      curr_time = full_time;
      running = false;
    }
    redraw();
  }
  setTimeout(tick, 1000/rate);
}

tick();


