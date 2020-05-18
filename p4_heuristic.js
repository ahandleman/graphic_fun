
function pad(num){ return ('0000' + num).substr(-4); }
$( document ).ready(function() {
	$(".tree_leaf").each(function(index, element) {
		var worker_int = parseInt($(element).parents(".tf-tree").data("worker"),2);
		var leaf_int = parseInt($(element).text(), 2);
		var partition_string = pad((worker_int ^ leaf_int).toString(2));
		console.log(partition_string);
		var html_string = '<ul><li><span class="tf-nc partition ' + partition_string + '" data-partition="' + partition_string + '"> ' + partition_string + ' </span></li></ul>';
		$(element).parent().append(html_string);
	});
	$(".partition").on("click", function(event){
		if ($(event.currentTarget).parent().parent().siblings('span').css("background-color") == "rgb(255, 0, 0)") {
			return;
		}
		if ($(event.currentTarget).css("background-color") == "rgb(255, 0, 0)") {
			var current_node = $(event.currentTarget).parent().parent().siblings('span');
			while ($(current_node).css("background-color") != "rgb(255, 0, 0)" && $(current_node).css("background-color") != "rgb(255, 255, 0)")
			{
				$(current_node).parent().find(".tree_node, .tree_leaf").css("background-color", "rgb(255, 0, 0)");
				if ($(current_node).hasClass("xxxx")) {
					break;
				}
				var current_node = $(current_node).parent().parent().siblings('span');
			}
			return;
		}
		var partition = $(event.currentTarget).data("partition");
		$(".partition."+partition).css("background-color", "rgb(255, 0, 0)");
		$(event.currentTarget).css("background-color", "rgb(0, 255, 0)");
		var current_node = $(event.currentTarget).parent().parent().siblings('span');
		while ($(current_node).css("background-color") != "rgb(255, 0, 0)" && $(current_node).css("background-color") != "rgb(255, 255, 0)")
		{
			$(current_node).css("background-color", "rgb(255, 255, 0)");
			if ($(current_node).hasClass("xxxx")) {
				break;
			}
			var current_node = $(current_node).parent().parent().siblings('span');
		}
	});
	$(".worker_header").on("click", function(event) {
		$("."+$(event.currentTarget).data("wn")).toggle();
	})
});
