const { chromium } = require('playwright');
(async()=>{
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  const p=await b.newPage({viewport:{width:390,height:844}});
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push('C:'+m.text())});
  await p.goto('file://'+require('path').resolve(__dirname,'../index.html')+''); await p.waitForTimeout(1500);
  const set=async(k,v)=>p.evaluate(([k,v])=>{const e=document.getElementById('in-'+k); e.value=v; e.dispatchEvent(new Event('input'))},[k,v]);
  const grab=async()=>p.evaluate(()=>({trs:document.getElementById('v-trs').textContent, risk:document.getElementById('b-risk').textContent, reveal:document.getElementById('reveal').innerText, people:document.getElementById('people').innerText, sum:[...document.querySelectorAll('#summary li')].map(l=>l.textContent), qs:[...document.querySelectorAll('#implic li')].map(l=>l.textContent), ce:document.getElementById('v-ce').textContent, tail:document.getElementById('v-tail')?.innerText}));
  const show=(tag,g)=>{ console.log('\n########', tag); console.log('rating',g.trs,'| bar:',g.risk,'| CE',g.ce); console.log('REVEAL:',g.reveal); console.log('PEOPLE:',g.people.replace(/\n/g,' / ')); g.sum.forEach(s=>console.log(' •',s)); g.qs.forEach(q=>console.log(' ?',q)); if(g.tail) console.log('TAIL:',g.tail); };
  const cases=[
    ['A. Skeptic: acemoglu preset, all very sure', async()=>{ await p.click('[data-preset=acemoglu]'); for(const k of ['exposure','amax','saving','t50','science']) await p.evaluate(k=>{document.getElementById('sure-'+k).click(); document.querySelector('#pick-'+k+' [data-v=very]').click();},k); }],
    ['B. Doomer: high risk, pExt 20, reach 10, displace 80', async()=>{ await p.click('[data-preset=transformative]'); await set('pCat',30); await set('pExt',20); await set('reach',10); await set('displace',80); await set('discount',100); }],
    ['C. Zero everything: exposure 5, amax 5, saving 0?, no risk', async()=>{ await p.click('[data-preset=acemoglu]'); await set('exposure',5); await set('amax',5); await set('saving',1); await set('pCat',0); await set('pMajor',0); await set('pExt',0); await set('displace',0); }],
    ['D. Optimist: reach 100, no displacement, gut 9.5', async()=>{ await p.click('[data-preset=electricity]'); await set('reach',100); await set('displace',0); await set('gut',9.5); }],
    ['E. Mid-range, link 100, catastrophe 10, aversion 5', async()=>{ await p.click('[data-preset=mainstream]'); await set('link',100); await set('pCat',10); await set('aversion',5); }],
    ['F. Mid-range, reach 0, discount 0', async()=>{ await p.click('[data-preset=mainstream]'); await set('reach',0); await set('discount',0); }],
  ];
  for(const [tag,fn] of cases){ await fn(); await p.waitForTimeout(1500); show(tag, await grab()); }
  // copy button text
  await p.click('[data-preset=mainstream]'); await p.waitForTimeout(1200);
  const copyTxt=await p.evaluate(()=>{ const bullets=[...document.querySelectorAll('#summary li')].map(li=>'• '+li.textContent).join('\n'); return bullets.length; });
  console.log('\ncopy length ok', copyTxt>100, '| errors:', errs);
  await b.close();
})();
