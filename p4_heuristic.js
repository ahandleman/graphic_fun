
function pad(num){ return ('0000' + num).substr(-4); }
$( document ).ready(function() {
	$(".tree_node").on("click", function(event){
		console.log("test");
		switch($(event.currentTarget).css("background-color")){
			case "rgb(255, 255, 0)": 
			$(event.currentTarget).css("background-color", "rgb(255,0,0)");
			break;
			case "rgb(255, 0, 0)": 
			$(event.currentTarget).css("background-color", "rgb(255, 255, 255)");
			break;
			case "rgb(255, 255, 255)":
			default:
			$(event.currentTarget).css("background-color", "rgb(255, 255, 0)");			
		};
	});
	$(".tree_leaf").each(function(index, element) {
		var worker_int = parseInt($(element).parents(".tf-tree").data("worker"),2);
		var leaf_int = parseInt($(element).text(), 2);
		var partition_string = pad((worker_int ^ leaf_int).toString(2));
		console.log(partition_string);
		var html_string = '<ul><li><span class="tf-nc partition ' + partition_string + '" data-partition="' + partition_string + '"> ' + partition_string + ' </span></li></ul>';
		$(element).parent().append(html_string);
	});
	$(".tree_leaf").on("click", function(event){
		console.log("test");
		switch($(event.currentTarget).css("background-color")){
			case "rgb(255, 0, 0)": 
			$(event.currentTarget).css("background-color", "rgb(0, 255, 0)");
			break;
			case "rgb(0, 255, 0)": 
			$(event.currentTarget).css("background-color", "rgb(255, 255, 255)");
			break;
			case "rgb(255, 255, 255)":
			default:
			$(event.currentTarget).css("background-color", "rgb(255, 0, 0)");			
		};
	});
	$(".partition").on("click", function(event){
		if ($(event.currentTarget).css("background-color") == "rgb(255, 0, 0)") {
			return;
		}
		var partition = $(event.currentTarget).data("partition");
		$(".partition."+partition).css("background-color", "rgb(255, 0, 0)");
		$(event.currentTarget).css("background-color", "rgb(0, 255, 0)");
	});
});
