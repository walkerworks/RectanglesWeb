/*
Object to represent the different relationships rectangles can have.
Frozen so values cannot be changed.
*/
var Relationship = Object.freeze({
    Adjacent: 0,
    Intersecting: 1,
    Contained: 2,
    NoRelationship: 3
});

$(document).ready(function () {
    $("#generateNew").click(function () {
        ClearCanvas();
        GenerateNewRectangles();
    });
});

//Clears the current rectangle DIVs from the DOM (unbinds any events too)
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
    $('#StatusUpdate').text('');
    //Create new DIVs for DOM
    var $rectangleOne = $("<div id='rectangleOne'></div>");
    $rectangleOne.data('Color', 'Olive');
    $rectangleOne.data('Gender', 'girl');
    var $rectangleTwo = $("<div id='rectangleTwo'></div>");
    $rectangleTwo.data('Color', 'Scarlet');
    $rectangleTwo.data('Gender', 'man');

    //Determine random sizes and positions for RectangleOne DIV
    var heightPx = SnapToGridOfTen(Random(50, 250));
    var widthPx = SnapToGridOfTen(Random(50, 250));
    var maxXCoordinate = SnapToGridOfTen(500 - widthPx);
    var maxYCoordinate = SnapToGridOfTen(500 - heightPx);
    var xCoord = SnapToGridOfTen(Random(1, maxXCoordinate));
    var yCoord = SnapToGridOfTen(Random(1, maxYCoordinate));

    //Set the size & position properties of RectangleOne DIV
    $rectangleOne.css({ height: heightPx + "px", width: widthPx + "px", top: yCoord + "px", left: xCoord + "px" });

    //Determine random sizes and positions for RectangleTwo DIV
    heightPx = SnapToGridOfTen(Random(50, 250));
    widthPx = SnapToGridOfTen(Random(50, 250));
    maxXCoordinate = SnapToGridOfTen(500 - widthPx);
    maxYCoordinate = SnapToGridOfTen(500 - heightPx);
    xCoord = SnapToGridOfTen(Random(1, maxXCoordinate));
    yCoord = SnapToGridOfTen(Random(1, maxYCoordinate));

    //Set the size & position properties of RectangleTwo DIV
     $rectangleTwo.css({ height: heightPx + "px", width: widthPx + "px", top: yCoord + "px", left: xCoord + "px" });

    //Add new DIV's to the DOM
     $("#Canvas").append($rectangleOne, $rectangleTwo);

    //Hook up the JQuery-UI Draggable extensions & events
    $rectangleOne.draggable({
        containment: "parent",
        start: function (event, ui) { HookupMovementTracker(event.target) },
        stop: function (event, ui) { HandleDragStop(event.target); }
        });
    $rectangleTwo.draggable({
        containment: "parent",
        start: function (event, ui) { HookupMovementTracker(event.target) },
        stop: function (event, ui) { HandleDragStop(event.target); }
    });
}

//Handle the HandleDragStop event for a DIV
function HandleDragStop(rectangle) {
    $(document).unbind('mousemove');
    var position = $(rectangle).position();
    var leftAdjusted = SnapToGridOfTen(position.left);
    var topAdjusted = SnapToGridOfTen(position.top);
    $(rectangle).css({ top: topAdjusted + "px", left: leftAdjusted + "px" });
    $(rectangle).removeClass();

    var rectangleOneView = new RectangleView($('#rectangleOne'));
    var rectangleTwoView = new RectangleView($('#rectangleTwo'));

    var results = rectangleOneView.GetRelationship(rectangleTwoView);
    $('#StatusUpdate').text('');
    var inLove = false;
    switch(results.Relationship)
    {
        case Relationship.Adjacent:
            $('#StatusUpdate').text("Adjacent");
            $('#StatusUpdate').append("<br/> Rectangles are adjacent on the following coordinates (X,Y): " + results.Intersections.map(function (coord) { return '(' + coord.X + ',' + coord.Y + ') ' }));
            inLove = true;
            break;
        case Relationship.Intersecting:
            $('#StatusUpdate').text("Intersecting");
            $('#StatusUpdate').append("<br/> Rectangles are intersecting on the following coordinates (X,Y): " + results.Intersections.map(function (coord) { return '(' + coord.X + ',' + coord.Y + ') ' }));
            inLove = true;
            break;
        case Relationship.Contained:
            $('#StatusUpdate').text("Contained");
            $('#StatusUpdate').append("<br/>" + results.Message);
            inLove = true;
            break;
        case Relationship.NoRelationship:
        default:
            $('#StatusUpdate').text("No Relationship");
           // alert('NoRelationship');
            break;
    }
    $('#rectangleOne').removeClass();
    $('#rectangleTwo').removeClass();
    if(inLove)
    {
        $('#rectangleOne').addClass('girlLove');
        $('#rectangleTwo').addClass('manLove');
    }
}

function HookupMovementTracker(rectangle)
{
    $(document).on('mousemove', function (event) {
        //check to make sure there is data to compare against
        var data = $(rectangle).data('last_postition')
        if (typeof data !== typeof undefined && data !== false) {

            //get the change from last position to this position
            var deltaX = last_position.x - event.clientX,
                deltaY = last_position.y - event.clientY;
            $(rectangle).removeClass();
            //check which direction had the highest amplitude and then figure out direction by checking if the value is greater or less than zero
            if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX > 0) {
                $(rectangle).addClass($(rectangle).data('Gender') + 'Left');
            } else if (Math.abs(deltaX) > Math.abs(deltaY) && deltaX < 0) {
                $(rectangle).addClass($(rectangle).data('Gender') + 'Right');
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
                $(rectangle).addClass($(rectangle).data('Gender') + 'Up');
            } else if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY < 0) {
                $(rectangle).addClass($(rectangle).data('Gender') + 'Down');
            }
        }

        //set the new last position to the current for next time
        last_position = {
            x: event.clientX,
            y: event.clientY
        };
        $(rectangle).data('last_postition', last_position)
    });
}


/* Takes any value and rounds it up or down to the the nearest 10 to 
 ensure our points are always on the drawn grid lines */
function SnapToGridOfTen(value)
{
    if (value % 10 != 0)
    {
        var adjustment = 0;
        if (value % 10 >= 5)
            adjustment = 10 - (value % 10);
        else
            adjustment = (value % 10) * -1;
        value += adjustment;
    }
    return value;
}

//Generates a random number between two values
function Random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function RectangleView(rectangle) {
    this.Rectangle = rectangle;
    this.Position = rectangle.position();
    this.Name = rectangle.data('Color');

    var left = [];
    var right = [];
    var top = [];
    var bottom = [];
    var allPoints = [];

    //Breaks each line up into it's constituent points
    for (i = this.Position.top; i <= this.Position.top + $(rectangle).height() ; i++) {
        var point = { X: this.Position.left, Y: i };
        left.push(point);
        allPoints.push(point);
    }
    for (i = this.Position.top; i <= this.Position.top + $(rectangle).height() ; i++) {
        var point = { X: this.Position.left + $(rectangle).width(), Y: i };
        right.push(point);
        allPoints.push(point);
    }
    for (i = this.Position.left; i <= this.Position.left + $(rectangle).width() ; i++) {
        var point = { X: i, Y: this.Position.top };
        top.push(point);
        allPoints.push(point);

    }
    for (i = this.Position.left; i <= this.Position.left + $(rectangle).width() ; i++) {
        var point = { X: i, Y: this.Position.top + $(rectangle).height() };
        bottom.push(point);
        allPoints.push(point);
    }

    this.Left = left;
    this.Right = right;
    this.Top = top;
    this.Bottom = bottom;
    this.AllPoints = allPoints;


    /*
    * Determines if this RectangleView is adjacent to the given RectangleView on any side
    *
    * Param: otherRectangle
    *    The RectangleView to compare to the current
    * Returns:
    *    An object representing the relationship between the rectangles, any additional info
    *    and any shared Points
    * Note:
    * Adjacency: is defined as Points are shared between the rectangles, 
    * but there is no containment of any points within either rectangle.
    * 
    * Intersection: is defined as Points are shared between the rectangles, 
    * and there is some containment of any points within either rectangle.
    * 
    * Containment: is defined as NO Points are shared between the rectangles, 
    * and there is some containment of any points within either rectangle.
    */
    this.GetRelationship = function (otherRectangle) {
        var status = Relationship.NoRelationship;
        var msg = '';
        var intersectingPoints = _.intersectionObjects(this.AllPoints, otherRectangle.AllPoints);

        var anyContainedPoints = false;
        var shared;
        for(i = 0; i < this.AllPoints.length; i++)
        {
            shared = false;
            //A shared point is not considered *within* for the purposes of this application
            for (n = 0; n < intersectingPoints.length; n++)
            {
                if (intersectingPoints[n].X == this.AllPoints[i].X && intersectingPoints[n].Y == this.AllPoints[i].Y)
                {
                    shared = true;
                    break;
                }
            }
            if (!shared && otherRectangle.IsInside(this.AllPoints[i])) {
                anyContainedPoints = true;
                break;
            }
        }

        if(intersectingPoints.length > 0)
        {
            if (anyContainedPoints)
                status = Relationship.Intersecting;
            else
                status = Relationship.Adjacent;
            return {Relationship: status, Message: msg, Intersections: intersectingPoints};
        }

        var anyContainedPointsInverse = false;
        for (i = 0; i < otherRectangle.AllPoints.length; i++) {
            shared = false;
            //A shared point is not considered *within* for the purposes of this application
            for (n = 0; n < intersectingPoints.length; n++)
            {
                if (intersectingPoints[n].X == otherRectangle.AllPoints[i].X && intersectingPoints[n].Y == otherRectangle.AllPoints[i].Y)
                {
                    shared = true;
                    break;
                }
            }
            if (!shared && this.IsInside(otherRectangle.AllPoints[i])) {
                anyContainedPointsInverse = true;
                break;
            }
        }

        if(anyContainedPoints)
        {
            status = Relationship.Contained;
            msg = this.Name + ' is contained within ' + otherRectangle.Name;
        }
        if (anyContainedPointsInverse) {
            status = Relationship.Contained;
            msg = otherRectangle.Name + ' is contained within ' + this.Name;
        }
        return { Relationship: status, Message: msg, Intersections: intersectingPoints };
    };

    /*
    Determines if the given point lies within our RectangleView
    */
    this.IsInside = function (point) {
        //A shared point is not considered *within* for the purposes of this application
        var topX = this.Position.left;
        var topY = this.Position.top;
        var bottomX = this.Position.left + $(this.Rectangle).width();
        var bottomY = this.Position.top + $(this.Rectangle).height();
        return point.X >= topX && point.X <= bottomX && point.Y >= topY && point.Y <= bottomY;

    };
}

/*
Extending the _underscore.js _.intersection function to handle objects */
_.intersectionObjects = function (array) {
    var slice = Array.prototype.slice; // added this line as a utility
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function (item) {
        return _.every(rest, function (other) {
            //return _.indexOf(other, item) >= 0;
            return _.any(other, function (element) { return _.isEqual(element, item); });
        });
    });
};