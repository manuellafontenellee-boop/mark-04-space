const {test}=require('node:test'),assert=require('node:assert/strict');
const E=require('../dist/flight.js')(require('../dist/engine.js'));const {createGameServer}=require('../server.cjs');
test('roles are random, unique, with exactly one non-commander impostor',()=>{for(let n=0;n<100;n++){const p=E.crew(['A','B','C','D']);assert.deepEqual(p.map(x=>x.job).sort(),[0,1,2,3]);assert.equal(p.filter(x=>x.impostor).length,1);assert.notEqual(p.find(x=>x.impostor).job,0)}});
test('preserves mission scoring and rejects incompatible spacecraft',()=>{for(let mission=1;mission<3;mission++){let s={...E.initial(),mission,instruments:mission===0?['atmos','thermal','solar']:mission===1?['radar']:['thermal','optical'],energy:'large',comms:'high',orbit:mission===0?'cruise':'sun',launcher:'medium',eventChoice:'wait'};assert.equal(E.errors(s).length,0);assert(E.evaluate(s).science>=65);s.launcher='light';assert(E.errors(s).length>0)}const bad={...E.initial(),mission:1,instruments:['optical'],eventChoice:'now'};assert(E.evaluate(bad).science<35)});
test('four independent clients share a room with private roles and authoritative controls',async t=>{
 let time=100000;const server=createGameServer({clock:()=>time});await new Promise(r=>server.listen(0,'127.0.0.1',r));t.after(()=>new Promise(r=>server.close(r)));const base='http://127.0.0.1:'+server.address().port+'/api/';
 async function api(path,body,token){const res=await fetch(base+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{})},...(body?{body:JSON.stringify(body)}:{})});return {status:res.status,data:await res.json()}}
 const host=(await api('rooms',{name:'A'})).data,path='rooms/'+host.id,clients=[host];
 assert.equal((await api(path+'/join',{name:'A'})).status,400);
 for(const name of ['B','C','D'])clients.push((await api(path+'/join',{name})).data);
 assert.equal((await api(path+'/join',{name:'E'})).status,409);assert.equal((await api(path)).status,401);
 const act=(i,type,fields={})=>api(path+'/action',{type,...fields},clients[i].token);
 assert.equal((await act(1,'deal')).status,403);assert.equal((await act(0,'deal')).status,200);
 const views=await Promise.all(clients.map(c=>api(path,null,c.token)));assert.equal(views.filter(x=>x.data.me.impostor).length,1);
 views.forEach(x=>{assert.equal(x.data.players.length,4);x.data.players.forEach(p=>{assert(!Object.hasOwn(p,'token'));assert(!Object.hasOwn(p,'impostor'))})});
 assert.equal((await act(0,'advance',{to:3})).status,409);
 for(let i=0;i<4;i++)assert.equal((await act(i,'ready')).status,200);
 assert.equal((await act(0,'advance',{to:3})).status,200);
 assert.equal((await act(1,'change',{key:'mission',value:1})).status,403);
 await act(0,'change',{key:'mission',value:1});await act(0,'advance',{to:4});
 assert.equal((await act(0,'launch')).status,409);
 for(const [key,value]of [['instrument','radar'],['energy','large'],['comms','high'],['orbit','sun'],['launcher','medium']])assert.equal((await act(0,'change',{key,value})).status,200);
 assert.equal((await act(0,'change',{key:'energy',value:'fake'})).status,400);
 await act(2,'chat',{text:'Radar through clouds!'});
 const snapshot=(await api(path,null,clients[3].token)).data;assert.equal(snapshot.state.instruments[0],'radar');assert.equal(snapshot.chat[0].text,'Radar through clouds!');
 assert.equal((await act(0,'launch')).status,200);assert.equal((await act(0,'change',{key:'energy',value:'basic'})).status,409);
 assert.equal((await act(0,'emergency',{action:'compression'})).status,409);
 time+=8001;
 assert.equal((await act(1,'emergency',{action:'ground'})).status,403);
 assert.equal((await act(0,'emergency',{action:'compression'})).status,200);
 assert.equal((await act(0,'emergency',{action:'ground'})).status,200);
 assert.equal((await act(0,'emergency',{action:'ground'})).status,409);
 time+=59000;
 assert.equal((await act(0,'finish',{choice:'close'})).status,200);
 const result=(await api(path,null,clients[2].token)).data;assert.equal(result.stage,5);assert(E.evaluate(result.state).science>=65);assert.equal(result.players.filter(x=>x.impostor).length,1);
 assert.equal((await act(0,'retry')).status,200);assert.equal((await api(path,null,host.token)).data.stage,4);
 const cross=await fetch(base+path+'/action',{method:'POST',headers:{'Content-Type':'application/json','Origin':'https://untrusted.example','Authorization':'Bearer '+host.token},body:JSON.stringify({type:'retry'})});assert.equal(cross.status,403);
});

