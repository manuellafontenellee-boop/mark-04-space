'use strict';
const fs=require('node:fs'),path=require('node:path');
const dir=path.join(__dirname,'dist');let html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
html=html.replace(/<link rel="stylesheet" href="([a-z-]+\.css)">/g,(_,file)=>'<style>'+fs.readFileSync(path.join(dir,file),'utf8')+'</style>');
html=html.replace(/<script src="([a-z-]+\.js)"><\/script>/g,(_,file)=>'<script>'+fs.readFileSync(path.join(dir,file),'utf8')+'</script>');
const target=process.argv[2]?path.resolve(process.argv[2]):path.join(__dirname,'MARCO-04-SPACE.html');
fs.writeFileSync(target,html,'utf8');console.log(target);
