/* Mission-level models. Toy values are not specifications of Galileo or DSN. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory;else factory(root.Engine)})(globalThis,function(E){
 'use strict';
 if(E.flightVersion===3)return E;E.flightVersion=3;
 const oldInitial=E.initial,oldTotals=E.totals,oldErrors=E.errors,oldEvaluate=E.evaluate;
 E.catalog.orbit.push({id:'cruise',name:'Transferência interplanetária',cost:3,mass:0,desc:'Trajetória heliocêntrica no Sistema Solar interior. Exige lançador médio; energia especificada já na distância de operação. Custo de navegação simplificado; a entrega fica no lançador.'});
 E.initial=()=>({...oldInitial(),orbit:'cruise',launcher:'medium'});
 E.totals=s=>{const x=oldTotals(s);return {...x,load:s.orbit==='cruise'?(s.launcher==='medium'?450:0):x.load,reserve:160-x.cost}};
 E.errors=s=>{const a=oldErrors(s),x=E.totals(s);if(s.mission===0&&s.orbit!=='cruise')a.push('DEEP_TRAJECTORY');if(s.mission!==0&&s.orbit==='cruise')a.push('EARTH_TRAJECTORY');if(s.orbit==='cruise'&&s.launcher!=='medium')a.push('TRANSFER_LAUNCHER');if(s.orbit==='cruise'&&x.mass>x.load)a.push('TRANSFER_MASS');return a};
 E.primary=s=>['atmos','radar','thermal'][s.mission];
 E.flightModel=s=>{
  const x=E.totals(s),f=s.flight||{},a=f.actions||{},secondary=s.instruments.filter(id=>id!==E.primary(s));
  const shed=a.power?secondary:[],freed=shed.reduce((v,id)=>v+E.chosen('instrument',id).power,0);
  const instrumentPower=x.power-15-freed,computer=a.compression?6:0,transmitter=20;
  const spare=Math.max(0,x.supply-15-instrumentPower-computer),powerRatio=Math.min(1,spare/transmitter);
  const nominal=x.capacity,damaged=nominal*.1,compression=a.compression?3:1,ground=a.ground?3:1,boost=a.power?1.8:1;
  const link=damaged*ground*boost*powerRatio;
  return {nominal,damaged,link,effective:link*compression,compression,ground,powerRatio,freed,shed,consumption:15+instrumentPower+computer+transmitter,supply:x.supply,demand:x.data,quality:a.compression?.9:1,sampling:a.power&&shed.length?.9:1,cost:x.cost+(a.ground?20:0),reserve:160-x.cost-(a.ground?20:0)};
 };
 E.startFlight=(s,now=Date.now())=>{if(E.errors(s).length)throw Error('INVALID');s.eventChoice=null;s.flight={startedAt:now,crisisAt:now+8000,deadline:now+68000,lastAt:now+8000,recovered:0,phase:'cruise',actions:{power:false,compression:false,ground:false},log:[],closed:false};return s.flight};
 E.tickFlight=(s,now=Date.now())=>{const f=s.flight;if(!f||f.closed)return f;const at=Math.min(now,f.deadline);if(at>=f.crisisAt){f.phase='crisis';if(at>f.lastAt){const model=E.flightModel(s);f.recovered=Math.min(E.totals(s).data,f.recovered+model.effective*(at-f.lastAt)/60000);f.lastAt=at}}if(now>=f.deadline){f.phase='complete';f.closed=true;f.endedAt=f.deadline}return f};
 E.commandFlight=(s,action,now=Date.now())=>{E.tickFlight(s,now);const f=s.flight;if(!f||f.phase!=='crisis'||f.closed||!['power','compression','ground'].includes(action)||f.actions[action])throw Error('INVALID');if(action==='ground'&&E.flightModel(s).reserve<20)throw Error('RESERVE');if(action==='power'&&!s.instruments.some(id=>id!==E.primary(s)))throw Error('NO_SECONDARY');if(action==='compression'&&E.flightModel(s).consumption+6>E.totals(s).supply)throw Error('POWER');f.actions[action]=true;f.log.push({action,elapsed:Math.round((now-f.crisisAt)/1000)});return f};
 E.closeFlight=(s,now=Date.now())=>{E.tickFlight(s,now);const f=s.flight;if(!f||f.phase==='cruise')throw Error('INVALID');if(!f.closed){f.closed=true;f.phase='complete';f.endedAt=Math.min(now,f.deadline)}return f};
 E.evaluate=s=>{if(!s.flight)return oldEvaluate(s);const x=E.totals(s),m=E.flightModel(s),f=s.flight,has=id=>s.instruments.includes(id);let value=s.mission===0?(has('atmos')?45:0)+(has('thermal')?20:0)+(has('solar')?20:0)+(has('optical')?15:0):s.mission===1?(has('radar')?75:0)+(has('optical')?10:0)+(s.orbit==='sun'?15:7):(has('thermal')?65:0)+(has('optical')?25:0)+(s.orbit==='sun'?10:5);const fraction=x.data?Math.min(1,f.recovered/x.data):0,revisit=s.orbit==='leo'?.82:1,technical=E.errors(s).length?0:100,science=Math.round(value*fraction*m.quality*m.sampling*revisit),efficiency=Math.round(Math.max(0,100-m.cost/160*25));return {science,technical,efficiency,score:Math.round(science*.7+technical*.2+efficiency*.1),delivered:Math.round(fraction*100),value,quality:m.quality,sampling:m.sampling,revisit,recoveredGB:f.recovered,generatedGB:x.data,spent:m.cost,reserve:m.reserve,evidence:[]}};
 return E;
});
