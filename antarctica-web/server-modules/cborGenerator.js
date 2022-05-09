const fs = require('fs')
const cbor = require('cbor');

var options;

module.exports = {
  processRequest: function(req, spec) {
    var response = "";
    try {
      var filename = spec['uuid'] + "." + spec['revision'] + ".cbor";
      
      var cborMap = new Map(); 
      
      console.log( "cbor export spec " + JSON.stringify( spec ) );

      for (const [key, value] of Object.entries(spec)) {
         console.log(`- ${key}: ${value}`);
         cborMap.set( key , value );
      }

      var data=cbor.encode(cborMap);
      fs.writeFileSync('static/cbor/' + filename, data);

      response = data;
    } catch (err) {
      console.log("json generation error " + err + " " + JSON.stringify(err));
      response = err;
    }
    return response;
  }
}
