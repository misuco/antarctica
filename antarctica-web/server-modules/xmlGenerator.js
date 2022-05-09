const fs = require('fs')

var options;

module.exports = {
  processRequest: function(req, spec, template, prefix) {
    var response = "";
    try {
      var data = fs.readFileSync(template, 'utf8');
      var filename = spec['uuid'] + "." + spec['revision'] + ".xml";

      console.log("processRequest " + JSON.stringify(spec));

      Object.keys(spec).forEach(
        function(key) {
          console.log("examining record " + key);
          var placeholder = "#" + key + "#";
          data = data.replace(placeholder, spec[key]);
        }
      )

      fs.writeFileSync('static/xml/' + prefix + filename, data);
      response = data;
    } catch (err) {
      console.log("xml generation error " + err + " " + JSON.stringify(err));
      response = err;
    }
    return response;
  }
}
