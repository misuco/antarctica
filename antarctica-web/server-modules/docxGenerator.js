const fs = require('fs')
var archiver = require('archiver')


var options;
var output;
var docParts;

var skeleton;
var template;
var prefix;
var output;
var compress;

function initTemplate(filename) {
  //console.log("initTemplate from file " + filename)
  docParts = [];
  var data = fs.readFileSync(filename, 'utf8');
  var lines = data.split('\n');
  var fieldId = lines[0].split(';');

  for (var i = 1; i < lines.length; i++) {
    var line = lines[i];

    var fields = line.split(';');

    if (fields.length == fieldId.length) {
      var docPartEntry = {};
      for (var j = 0; j < fields.length; j++) {
        var fieldValue = fields[j].replace(/#/g, "spec.");
        docPartEntry[fieldId[j]] = fieldValue;
      }
      docParts.push(docPartEntry);
    }
  }
  //console.log("initTemplate got " + JSON.stringify(docParts));
}

function compressDocx(filename) {

  output = fs.createWriteStream(filename);

  var archive = archiver('zip', {
    gzip: true,
    zlib: {
      level: 9
    } // Sets the compression level.
  });

  archive.on('error', function(err) {
    console.log(JSON.stringify(err));
  });

  output.on('close', function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  });

  // This event is fired when the data source is drained no matter what was the data source.
  // It is not part of this library but rather from the NodeJS Stream API.
  // @see: https://nodejs.org/api/stream.html#stream_event_end
  output.on('end', function() {
    console.log('Data has been drained');
  });

  // good practice to catch warnings (ie stat failures and other non-blocking errors)
  archive.on('warning', function(err) {
    console.log("warning");
    if (err.code === 'ENOENT') {
      console.log(' - ENOENT');
    } else {
      // throw error
      throw err;
    }
  });

  // pipe archive data to the output file
  archive.pipe(output);

  // append files
  archive.directory(skeleton, false);
  return archive.finalize();

}

module.exports = {
  setSkeleton: function(s) {
    skeleton = s;
  },
  setTemplate: function(t) {
    template = t;
  },
  setPrefix: function(p) {
    prefix = p;
  },
  setCompress: function(c) {
    compress = c;
  },
  setOutput: function(o) {
    output = o;
  },
  processSpec: function(spec) {
    var response = "";
    try {
      //console.log("docx.processRequest from template " + template );//JSON.stringify(spec));

      initTemplate(template + "/parts.csv");

      var data = "";

      for (var i = 0; i < docParts.length; i++) {
        if (eval(docParts[i].Condition)) {
          data += fs.readFileSync(template + "/" + docParts[i].Filename, 'utf8');
        }
      }
    } catch (err) {
      console.log("docx template generation error " + err + " " + JSON.stringify(err));
      response = err;
    }

    try {
      var filename = "static/" + prefix + spec['uuid'] + "." + spec['revision'] + ".docx";

      Object.keys(spec).forEach(
        function(key) {
          var placeholder = "#" + key + "#";
          data = data.replace(placeholder, spec[key]);
        }
      )

      fs.writeFileSync(output, data);

      if(compress==true) {
        response = compressDocx(filename);
      } else {
        response = data;
      }

    } catch (err) {
      console.log("docx generation error " + err + " " + JSON.stringify(err));
      response = err;
    }
    return response;
  }
}
