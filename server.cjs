'use strict';
const http=require('node:http'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const E=require('./dist/flight.js')(require('./dist/engine.js'));
function createGameServer({clock=Date.now}={}){
 const rooms=new Map(),rates=new Map(),ttl=6*60*60*1000;
 const server=http.createServer(async(req,res)=>{
  const send=(status,data)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(JSON.stringify(data))};
  const fail=(status,code)=>{const e=new Error(code);e.status=status;throw e};
  try{
   const url=new URL(req.url,'http://localhost');
   if(!url.pathname.startsWith('/api/')){
    if(req.method!=='GET'&&req.method!=='HEAD')return send(405,{error:'INVALID'});
    const root=path.resolve(__dirname,'dist'),filename=path.resolve(root,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
    if(!filename.startsWith(root+path.sep))return send(404,{error:'NOT_FOUND'});
    let content;try{content=await fs.promises.readFile(filename)}catch{return send(404,{error:'NOT_FOUND'})}
    res.writeHead(200,{'Content-Type':({'html':'text/html; charset=utf-8','js':'text/javascript; charset=utf-8','css':'text/css; charset=utf-8'})[filename.split('.').pop()]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-ancestors 'self'",'Referrer-Policy':'no-referrer'});return res.end(req.method==='HEAD'?'':content);
   }
   if(req.method==='GET'&&url.pathname==='/api/health')return send(200,{service:'marco04',version:2});
   const origin=req.headers.origin;
   if(origin){let oh;try{oh=new URL(origin).host}catch{fail(403,'AUTH')}if(oh!==req.headers.host&&origin!==process.env.PUBLIC_ORIGIN)fail(403,'AUTH')}
   const ip=req.socket.remoteAddress||'unknown',now=clock();let rate=rates.get(ip);if(!rate||now-rate.time>60000){rate={time:now,count:0};rates.set(ip,rate)}if(++rate.count>600)fail(429,'RATE');
   let body={};if(req.method==='POST'){if(!req.headers['content-type']?.startsWith('application/json'))fail(415,'INVALID');let raw='';for await(const chunk of req){raw+=chunk;if(Buffer.byteLength(raw)>8192)fail(413,'INVALID')}try{body=JSON.parse(raw)}catch{fail(400,'INVALID')}}
   const cleanName=x=>{if(typeof x!=='string')fail(400,'NAME');const n=x.trim();if(!n||n.length>24||/[\x00-\x1f]/.test(n))fail(400,'NAME');return n};
   const player=(name,host,index)=>({id:String(index),name,host,color:index,job:null,impostor:false,ready:false,token:crypto.randomBytes(24).toString('hex')});
   if(req.method==='POST'&&url.pathname==='/api/rooms'){
    if(rooms.size>=200)fail(429,'RATE');const id=crypto.randomBytes(6).toString('hex'),p=player(cleanName(body.name),true,0);
    rooms.set(id,{id,players:[p],stage:2,phase:'lobby',state:E.initial(),launched:false,version:1,chat:[],expires:now+ttl});return send(201,{id,token:p.token,host:true});
   }
   const match=url.pathname.match(/^\/api\/rooms\/([a-f0-9]{12})(?:\/(join|action))?$/);if(!match)fail(404,'NOT_FOUND');
   const r=rooms.get(match[1]);if(!r||r.expires<now){rooms.delete(match[1]);fail(404,'NOT_FOUND')}
   if(req.method==='POST'&&match[2]==='join'){
    if(r.phase!=='lobby'||r.players.length>=4)fail(409,'FULL');const name=cleanName(body.name);if(r.players.some(p=>p.name.toLowerCase()===name.toLowerCase()))fail(400,'NAME');const p=player(name,false,r.players.length);r.players.push(p);r.version++;return send(201,{id:r.id,token:p.token,host:false});
   }
   const token=(req.headers.authorization||'').replace(/^Bearer /,''),p=r.players.find(p=>p.token===token);if(!p)fail(401,'AUTH');
   if(r.stage===4&&r.state.flight){const phase=r.state.flight.phase;E.tickFlight(r.state,clock());if(phase!==r.state.flight.phase)r.version++;if(r.state.flight.closed){r.stage=5;r.version++}}
   if(req.method==='GET'&&!match[2]){
    const publicPlayer=q=>({id:q.id,name:q.name,host:q.host,color:q.color,job:q.job,ready:q.ready,...(r.stage===5?{impostor:q.impostor}:{})});
    return send(200,{id:r.id,version:r.version,stage:r.stage,phase:r.phase,state:r.state,launched:r.launched,isHost:p.host,players:r.players.map(publicPlayer),me:{...publicPlayer(p),impostor:p.impostor},chat:r.chat});
   }
   if(req.method!=='POST'||match[2]!=='action')fail(405,'INVALID');
   const type=body.type;
   if(type==='chat'){
    if(typeof body.text!=='string'||!body.text.trim()||body.text.length>240)fail(400,'INVALID');r.chat.push({name:p.name,text:body.text.trim()});r.chat=r.chat.slice(-40);
   }else if(type==='ready'){
    if(r.phase!=='roles'||r.stage!==2)fail(409,'INVALID');p.ready=true;
   }else{
    if(!p.host)fail(403,'HOST');
    if(type==='deal'){
     if(r.phase!=='lobby'||r.players.length!==4)fail(409,'READY');const crew=E.crew(r.players.map(x=>x.name));r.players.forEach((x,i)=>{x.job=crew[i].job;x.impostor=crew[i].impostor;x.ready=false});r.phase='roles';
    }else if(type==='advance'){
     if(body.to===3&&r.stage===2){if(r.phase!=='roles'||!r.players.every(x=>x.ready))fail(409,'READY');r.phase='playing';r.stage=3}
     else if(body.to===4&&r.stage===3){r.stage=4;r.launched=false}
     else if(body.to===3&&r.stage===4&&!r.launched)r.stage=3;
     else fail(409,'INVALID');
    }else if(type==='change'){
     const {key,value}=body;if(![3,4].includes(r.stage)||r.launched)fail(409,'INVALID');
     if(key==='mission'||key==='hyp'){if(!Number.isInteger(value)||value<0||value>2||r.stage!==3)fail(400,'INVALID');r.state[key]=value;if(key==='mission'){r.state.orbit=value===0?'cruise':'leo';if(value===0)r.state.launcher='medium';r.state.flight=null}}
     else if(key==='accused'){if(!Number.isInteger(value)||(value!==-1&&!r.players.some(q=>Number(q.id)===value&&q.job!==0)))fail(400,'INVALID');r.state.accused=value}
     else {if(r.stage!==4||!Object.hasOwn(E.catalog,key)||!E.catalog[key].some(o=>o.id===value))fail(400,'INVALID');if(key==='instrument')r.state.instruments=r.state.instruments.includes(value)?r.state.instruments.filter(id=>id!==value):[...r.state.instruments,value];else r.state[key]=value}
    }else if(type==='launch'){
     if(r.stage!==4||r.launched||E.errors(r.state).length)fail(409,'INVALID');r.launched=true;E.startFlight(r.state,clock());
    }else if(type==='emergency'){
     if(r.stage!==4||!r.launched)fail(409,'INVALID');try{E.commandFlight(r.state,body.action,clock())}catch(e){fail(409,['RESERVE','POWER','NO_SECONDARY'].includes(e.message)?e.message:'INVALID')}
    }else if(type==='finish'){
     if(r.stage!==4||!r.launched||body.choice!=='close')fail(409,'INVALID');try{E.closeFlight(r.state,clock())}catch{fail(409,'INVALID')}r.stage=5;
    }else if(type==='retry'){
     if(r.stage!==5)fail(409,'INVALID');r.state.eventChoice=null;r.state.flight=null;r.stage=4;r.launched=false;
    }else fail(400,'INVALID');
   }
   r.version++;send(200,{ok:true});
  }catch(e){if(!res.headersSent)send(e.status||500,{error:e.status?e.message:'INVALID'});else res.end()}
 });
 const cleanup=setInterval(()=>{const now=clock();for(const [id,r]of rooms)if(r.expires<now)rooms.delete(id);for(const [ip,r]of rates)if(now-r.time>120000)rates.delete(ip)},60000);cleanup.unref();server.on('close',()=>clearInterval(cleanup));return server;
}
if(require.main===module){const port=Number(process.env.PORT)||8765;createGameServer().listen(port,'0.0.0.0',()=>{console.log('MARCO 04 SPACE: http://localhost:'+port);console.log('LAN: use http://YOUR-COMPUTER-IP:'+port+' on other devices. Internet play requires public HTTPS hosting.');console.log('Rooms are held in memory for 6 hours. Restarting clears all rooms.');})}
module.exports={createGameServer};
