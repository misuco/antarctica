const https = require('https')
const fs = require('fs')
const express = require('express')
var proc = require('child_process');

const app = express()
const port = process.env.PORT || 3000

app.use(express.static('static'));
app.use(express.json()) // for parsing application/json

app.get('/newclip', function(req, res) {
  console.log("got newclip " + req.query.id);
  proc.execSync('/home/c1/MISUCO/build-antarctica-Desktop_Qt_5_15_2_GCC_64bit-Debug/antarctica -t '+req.query.tempo+' -p ' + req.query.pitch + ' -b '+req.query.clipId+' -l '+req.query.loopLength+' -r '+req.query.repeat+' -n '+req.query.basenote+' -s '+req.query.scale+' -a '+req.query.arrange+' -o /home/c1/MISUCO/antarctica-web/static/loops/'+req.query.id);
  res.send("loops/" + req.query.id +".wav");
});


app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
