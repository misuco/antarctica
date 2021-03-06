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
  res.send("loops/" + req.query.id +".wav");
});

app.get('/rate', function(req, res) {
  console.log("got rating " + req.query.rating + " for " + req.query.trackId);
  var ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress  
  proc.execSync('echo $(date +%Y-%m-%d-%H-%M-%S) '+ip+' >> '+config.app.web_path+'/'+req.query.trackId+'-r-'+req.query.rating);
  res.send("Thanks for your rating for "+req.query.trackId);
});

app.get('/files', function(req, res) {
  console.log("got files request for spot " + req.query.spotId);
  var files = proc.execSync('ls -1 '+config.app.web_path+'/loops/*'+req.query.spotId+'*.wav | xargs -n 1 basename');
  res.send(files);
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
