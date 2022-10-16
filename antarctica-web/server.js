const https = require('https')
const fs = require('fs')
const express = require('express')
const config = require('./config')

var proc = require('child_process');

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('static'));
app.use(express.json()) // for parsing application/json

app.get('/newclip', function(req, res) {
  console.log("got newclip " + req.query.id);
  proc.execSync(config.app.bin_path + ' -t '+req.query.tempo+' -p ' + req.query.pitch + ' -b '+req.query.clipId+' -l '+req.query.loopLength+' -r '+req.query.repeat+' -n '+req.query.basenote+' -s '+req.query.scale+' -a '+req.query.arrange+' -o '+config.app.web_path+'/loops/'+req.query.id);
  res.send("loops/" + req.query.id);
});

app.get('/rate', function(req, res) {
  console.log("got rating " + req.query.rating + " for " + req.query.trackId);
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress  
  proc.execSync('echo $(date +%Y-%m-%d-%H-%M-%S) '+ip+' >> '+config.app.web_path+'/loops/'+req.query.trackId+'-r-'+req.query.rating);
  res.send("Thanks for your rating for "+req.query.trackId);
});

app.get('/files', function(req, res) {
  console.log("got files request for spot " + req.query.spotId);

  var response ="";
  var files = fs.readdirSync(config.app.web_path+'/loops/').filter(fn => fn.includes( req.query.spotId )).filter(fn => fn.endsWith('-loop.mp3'));
  files.forEach(file => { response += file.replace('-loop.mp3','') + "\n" });
  console.log(response);
  res.send(response);
});


app.get('/rating', function(req, res) {
  console.log("got rating request ");

  var response = "<span>\nrating 3</span><br/>\n";
  
  
  var files = fs.readdirSync(config.app.web_path+'/loops/').filter(fn => fn.endsWith('-r-3'));
  files.forEach(file => { 
	  const p = file.split("_");
	  const sector = p[0]+"_"+p[1];
	  const spotId = p[2];
	  response += "<span onclick=\"requestFilesFromList('"+sector+"','"+spotId+"')\">" + file + "</span><br/>\n" }
  );
  
  response += "\n\n<span>rating 2</span><br/>\n";

  var files = fs.readdirSync(config.app.web_path+'/loops/').filter(fn => fn.endsWith('-r-2'));
  files.forEach(file => { 
	  const p = file.split("_");
	  const sector = p[0]+"_"+p[1];
	  const spotId = p[2];
	  response += "<span onclick=\"requestFilesFromList('"+sector+"','"+spotId+"')\">" + file + "</span><br/>\n" }
  );
  
  response += "\n\n<span>rating 1</span><br/>\n";

  var files = fs.readdirSync(config.app.web_path+'/loops/').filter(fn => fn.endsWith('-r-1'));
  files.forEach(file => { 
	  const p = file.split("_");
	  const sector = p[0]+"_"+p[1];
	  const spotId = p[2];
	  response += "<span onclick=\"requestFilesFromList('"+sector+"','"+spotId+"')\">" + file + "</span><br/>\n" }
  );
  
  response += "\n\n<span>all tracks</span><br/>\n";

  var files = fs.readdirSync(config.app.web_path+'/loops/');
  files.forEach(file => { 
	  const p = file.split("_");
	  const sector = p[0]+"_"+p[1];
	  const spotId = p[2];
	  response += "<span onclick=\"requestFilesFromList('"+sector+"','"+spotId+"')\">" + file + "</span><br/>\n" }
  );

  res.send(response);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
