
var visitedPoints = new Map();
var nextPointFields;

var getClosestUnvisited = function(id,nth) {
	// array for 10 closest points
	var closestDistance = [10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0,10.0];
	var closestId = [0,0,0,0,0,0,0,0,0,0];
	pointLoadedMap.forEach(point => {
		var fields = point.fields;
		if(fields!=undefined) {
			var distance = Math.sqrt( (selectedSpot.position.x - fields[2]) ** 2 + (selectedSpot.position.z - fields[3]) ** 2 );

			if(id!=fields[5] && visitedPoints.has(fields[5])==false) {
				for(var i=0;i<closestDistance.length;i++) {
					if(distance<closestDistance[i] ) {
						if(i>0) {
							closestDistance[i-1]=closestDistance[i];
							closestId[i-1]=closestId[i];
						}
						closestDistance[i]=distance;
						closestId[i]=fields[5];
						if(i==nth) {
							nextPointFields=fields;
						}
					}
				}
			}
		}
	});

	visitedPoints.set(closestId[nth],1);

	for(var i=0;i<10;i++) {
		console.log( "closest " + i + " closest id: " + closestId[i] + " distance: " + closestDistance[i] );
	}
	console.log( "for " + id + " closest id: " + closestId[nth] + " distance: " + closestDistance[nth] );
	console.log( "total visited points " + visitedPoints.size );
}
