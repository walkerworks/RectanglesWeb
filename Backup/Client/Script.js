
$(document).ready(function () {
    $("#generateNew").click(function () {
        ClearCanvas();
        GenerateNewRectangles();
    });
});

function ClearCanvas()
{
    if($("#rectangleOne"))
        $("#rectangleOne").unbind();
    if($("#rectangleTwo"))
        $("#rectangleTwo").unbind();
    $("#Canvas").empty();
}

function GenerateNewRectangles()
{
    var $rectangleOne = $("<div id='rectangleOne'></div>");
    var $rectangleTwo = $("<div id='rectangleTwo'></div>");
    $("#Canvas").append($rectangleOne, $rectangleTwo);
    $rectangleOne.draggable({
        containment: "parent", 
        stop: function (e) { Analyze(e.target); }
        });
    $rectangleTwo.draggable({
        containment: "parent",
        stop: function (e) { Analyze(e.target); }
    });
}

function Analyze(rectangle)
{
    var position = $(rectangle).position();
    alert("left: " + position.left + ", top: " + position.top + "width: " + $(rectangle).width() + ", height: " + $(rectangle).height());
}
