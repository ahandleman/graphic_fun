var x_size = 1600;
var y_size = 1600;
var radius = .48*Math.min(x_size, y_size);
var num_points = 3;
var num_hops = 10;
var dist_towards = 0.5;
var core_points = [];
var points = [];
var curr_time = 0;
var max_time = 2000;
var rate = 20;
var delay = 1000/rate;
var trials_per_tick = 50;
var running = false;
var shaded = false;
var colors = ["#e6194b", "#3cb44b", "#ffe119", "#0082c8", "#f58231", "#911eb4", "#46f0f0", "#f032e6", "#000000"];
function x_from_number(number) {
  var degree = (number / num_points)*2*Math.PI;
  return x_size/2 + (Math.sin(degree) * radius);
};

function y_from_number(number) {
  var degree = (number/num_points)*2*Math.PI;
  return y_size/2 - (Math.cos(degree) * radius);
};

function setup() {
  // Sets the screen to be 720 pixels wide and 400 pixels high
  pixelDensity(1);
  createCanvas(x_size, y_size);
  noLoop();

}

function draw() {
  // Set the background to black and turn off the fill color
  background(255);
  if (core_points.length == 0) {
    return;
  }
  stroke("red");
  for(var i = 0; i < num_points; i++) {
    ellipse(core_points[i].x, core_points[i].y, 3, 3);
  }
}

function tick() {
  if (!running) {
    setTimeout(tick, 1000/rate);
    return;
  }
  for(var i = 0; i < trials_per_tick; i++) {
    var x = x_size/2;
    var y = y_size/2;
    for(var j = 0; j < num_hops; j++) {
      if (shaded) {
        stroke(colors[j]);
        ellipse(x,y, 5, 5);
      }
      var rand = Math.floor(Math.random()*num_points);
      x = ((1-dist_towards)*x) + ((dist_towards)*core_points[rand].x);
      y = ((1-dist_towards)*y) + ((dist_towards)*core_points[rand].y);
    }
    stroke("black");
    point(x,y);
  }
  curr_time++;
  if (curr_time >= max_time) {
    running = false;
  }
  setTimeout(tick, 1000/rate);
}

function run(event) {
  num_points = document.getElementById("num_points").value;
  num_hops = document.getElementById("num_hops").value;
  dist_towards = document.getElementById("dist_towards").value;
  rate = document.getElementById("rate").value;
  max_time = document.getElementById("time").value*rate;
  trials_per_tick = document.getElementById("trials_per_tick").value;
  for(var i = 0; i < num_points; i++) {
    core_points[i] = {x: x_from_number(i), y: y_from_number(i)}
  }
  running = false;
  draw();
  curr_time = 0;
  shaded = false;
  running = true;
}

function shaded_legend() {
  textAlign(LEFT);
  stroke(colors[0]);
  fill(colors[0]);
  text("No Hop", 0, 25);
  for(var i = 1; i < num_hops; i++) {
    fill(colors[i]);
    stroke(colors[i]);
    text("Hop " + i, 0, 25 + 20*i);
  }
  fill("none");

}

function run_shaded(event) {
  num_points = document.getElementById("num_points").value;
  num_hops = Math.min(document.getElementById("num_hops").value, 8);
  dist_towards = document.getElementById("dist_towards").value;
  rate = document.getElementById("rate").value;
  max_time = document.getElementById("time").value*rate;
  trials_per_tick = document.getElementById("trials_per_tick").value;
  for(var i = 0; i < num_points; i++) {
    core_points[i] = {x: x_from_number(i), y: y_from_number(i)}
  }
  running = false;
  draw();
  shaded_legend();
  curr_time = 0;
  shaded = true;
  running = true;
}

function stop(event) {
  running = false
}

function trial(i) {
}

tick();