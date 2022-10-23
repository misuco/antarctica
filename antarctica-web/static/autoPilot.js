
var visitedPoints = new Map();
var nextPointFields;

var getClosestUnvisited = function(id) {
	var closestDistance = 10.0;
	var closestId = 0;
	pointLoadedMap.forEach(point => {
		var fields = point.fields;
		if(fields!=undefined) {
			var distance = Math.sqrt( (selectedSpot.position.x - fields[2]) ** 2 + (selectedSpot.position.z - fields[3]) ** 2 );
			
			if(distance<closestDistance && id!=fields[5] && visitedPoints.has(fields[5])==false ) {
				closestDistance=distance;
				closestId=fields[5];
				nextPointFields=fields;
			}
			
		}
	});	
	
	visitedPoints.set(closestId,1);
	
	console.log( "for " + id + " closest id: " + closestId + " distance: " + closestDistance );
	console.log( "total visited points " + visitedPoints.size );
}
