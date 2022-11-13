var csvLoaded = false;
var csvIndex = 1;
var lines;
var fieldId;

function processCsv(csv) {
	csv = csv.replace(/\r/g, '');
	lines = csv.split('\n');
	fieldId = lines[0].split(';');
	createSectorMap();
	filterCsv("Airport");
	filterCsv("Building");
}

function createSectorMap() {
	for(var i=1;i<lines.length;i++) {
		var line = lines[i];
		var fields = line.split('|');

		if(fields.length > 6) {

			var alpha = parseFloat(fields[6]);
			var hypotenuse = parseFloat(fields[5]) + 90;

			var pointX = Math.sin( Math.PI * alpha / 180 ) * hypotenuse * 1.8667;
			var pointY = Math.cos( Math.PI * alpha / 180 ) * hypotenuse * 1.8667;

			var sectorX = Math.floor(pointX/2);
			var sectorY = Math.floor(pointY/2);
			var sectorId = sectorX + "_" + sectorY;
			if(sectorCountMap.has(sectorId)) {
				var sectorCount = sectorCountMap.get(sectorId);
				sectorCount++;
				sectorCountMap.set(sectorId,sectorCount);
			} else {
				sectorCountMap.set(sectorId,1);
			}

			pointLoadedMap.set(fields[0],0);
		}
	}

	var sectorEntryCount = 0;
	for (const [key, value] of sectorCountMap) {
		//console.log(key + ' = ' + value)
		sectorEntryCount += value;
	}
	console.log("populated sectors " + sectorCountMap.size + " total entries " + sectorEntryCount );
	csvLoaded = true;
}

function filterCsv(filter) {
	//console.log("filterCsv "+filter);
	var addedRecords=0;

	for(var i=1;i<lines.length;i++) {
		var line = lines[i];
		var fields = line.split('|');

		if(fields.length > 6) {
			var point = {};

			point.name=fields[1];
			point.alpha = parseFloat(fields[6]);
			point.hypotenuse = parseFloat(fields[5]) + 90;

			point.pointX = Math.sin( Math.PI * point.alpha / 180 ) * point.hypotenuse * 1.8667;
			point.pointY = Math.cos( Math.PI * point.alpha / 180 ) * point.hypotenuse * 1.8667;

			point.sectorX = Math.floor(point.pointX/2);
			point.sectorY = Math.floor(point.pointY/2);
			point.sectorId = point.sectorX + "_" + point.sectorY;
			
			fields.unshift(point.alpha,point.hypotenuse,point.pointX,point.pointY,point.sectorId);

			if(pointLoadedMap.get(fields[5])==0) {
				if(filter.includes("_")) {
					if(point.sectorId==filter) {
						point.fields=fields;
						records.push(fields);
						pointLoadedMap.set(fields[5],point);
						addedRecords++;
						//console.log("added "+point.sectorId+"_"+fields[5]);
					}
				} else if(filter!="") {
					if(fields[7] == filter) {
						point.fields=fields;
						records.push(fields);
						pointLoadedMap.set(fields[5],point);
						addedRecords++;
						//console.log("added "+point.sectorId+"_"+fields[5]);
					}
				}
			}

			//console.log("scanning point " + i + " x " + point.pointX + " y "+ point.pointY + " x min " + xmin + " max " + xmax + " y min " + ymin + " max " + ymax );
		}
	}
	//console.log("filtered csv records " + lines.length + " x min " + xmin + " max " + xmax + " y min " + ymin + " max " + ymax );
	//console.log("added "+addedRecords);
}
