const fs = require('fs')

var options;

module.exports = {
  processRequest: function(req, spec) {
    var response = "";
    try {
      var filename = spec['uuid'] + "." + spec['revision'] + ".json";

      fs.writeFileSync('static/json/' + filename, JSON.stringify(spec));

      response = data;
    } catch (err) {
      console.log("json generation error " + err + " " + JSON.stringify(err));
      response = err;
    }
    return response;
  }
}
