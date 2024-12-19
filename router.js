var router=(()=>{var R=Object.defineProperty;var q=Object.getOwnPropertyDescriptor;var tt=Object.getOwnPropertyNames;var et=Object.prototype.hasOwnProperty;var rt=(t,e)=>{for(var r in e)R(t,r,{get:e[r],enumerable:!0})},ot=(t,e,r,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let a of tt(e))!et.call(t,a)&&a!==r&&R(t,a,{get:()=>e[a],enumerable:!(o=q(e,a))||o.enumerable});return t};var at=t=>ot(R({},"__esModule",{value:!0}),t);var ft={};rt(ft,{all:()=>V,bind:()=>I,cache:()=>F,fetch:()=>x,get:()=>K,hash:()=>N,post:()=>Q,push:()=>Z,redirect:()=>z,reload:()=>u,replace:()=>M,subscribe:()=>j,update:()=>J});var c=location.origin==="file://",T="body",A=!1,d=!1,N=()=>{c=!0},I=t=>{T=t},J=()=>{A=!0},F=()=>{d=!0};var s,_=()=>{s=document.querySelector(T)};var g=[],j=t=>(g.push(t),()=>{let e=g.indexOf(t);e>-1&&g.splice(e,1)}),S=t=>{for(let e=g.length-1;e>-1;e--)g[e](t)};var O={},z=t=>({tag:O,location:t}),L=(t,e)=>e&&e.tag===O?e:{tag:O,body:e,url:t.url};var C=[],y=[],B=[{path:"/404",fetch:t=>L(t,`<pre>Unable to ${t.method} ${t.url.pathname}</pre>`)},{path:"/500",fetch:t=>(console.error(t.error),L(t,`<pre>${t.error.stack}</pre>`))}],U=t=>(e,r)=>{let o=new RegExp("^"+e.replace(/[/.-]/g,"\\$&").replace(/\:([^\\]+)/g,"(?<$1>[/.-]+)").replace(/\*(.+)/g,"(?<$1>.*)")+"$"),a={path:e,match:i=>{if(t.includes(i.method)){let l=o.exec(i.url.pathname);if(l)return l.groups??{}}},fetch:async(i,l,n)=>L(i,await Promise.resolve(r(i,l,n)))};r.length===3?C.push(a):y.push(a)},K=U(["GET"]),Q=U(["POST"]),V=U(["GET","POST"]);var $=t=>t.origin===location.origin,k=t=>t.target===""||t.target==="_self",D=t=>c?"#"+t.pathname+t.search:t,G=t=>[...y,...B].find(e=>e.path===t).fetch,E=t=>t.hasAttribute("replace")?"REPLACE":"PUSH",w=(t,e)=>t&&t.method===e.method&&t.url===e.url,H=t=>{s.innerHTML=t;let e=s.querySelector("[autofocus]");e&&e.focus()};var W=async t=>{let e=r=>C.reduce((o,a)=>{let i=a.match(t);return i?l=>a.fetch(l,i,o):o},r);try{for(let r of y){let o=r.match(t);if(o)return await e(r.fetch)({...t,params:o})}return await e(G("/404"))(t)}catch(r){return await e(G("/500"))({...t,error:r})}};var b=t=>new URL(t,c?new URL(location.hash.substring(1),location.origin):new URL(location.href));var X={},P=(t,e)=>t&&t.tag===X?t:(t=b(t),{tag:X,method:"GET",url:t,params:{},query:t.searchParams,...e});var x=async(t,e)=>{let r=P(t,e),o=await W(r);return o.location?x(new URL(o.location,r.url)):o};var f=null,Y=()=>{f!==null&&(f=null,s.classList.remove("loading"),S({type:"loaded"}))},m,h=async(t,e)=>{let r=P(t,e),o={method:r.method,url:r.url.toString()};if(w(f,o))return;f||(s.classList.add("loading"),S({type:"loading"})),f=o,d&&!m&&(m=JSON.parse(localStorage.getItem("caches")||"{}"));let a=D(r.url),i=d&&r.method!=="POST"&&!r.restored&&a in m;if(i){let l=m[a];H(l.body),r.state==="REPLACE"?history.replaceState(l.body,"",l.url):history.pushState(l.body,"",l.url)}try{let l=await x(r),n=String(l.body),p=D(l.url);w(f,o)&&(H(n),i?history.replaceState(n,"",p):a!==p?r.state==="REPLACE"?(history.replaceState(null,"",a),history.replaceState(n,"",p)):(history.pushState(null,"",a),history.replaceState(n,"",p)):r.state==="REPLACE"?history.replaceState(n,"",p):history.pushState(n,"",p)),d&&r.method!=="POST"&&(m[a]={body:n,url:p},localStorage.setItem("caches",JSON.stringify(m)))}finally{w(f,o)&&(f=null,s.classList.remove("loading"),S({type:"loaded"}))}},Z=h,M=(t,e)=>{h(t,{state:"REPLACE",...e})},u=t=>{M("",t)};var lt=t=>{t.state!==null&&(s.innerHTML=t.state,Y(),A&&u({restored:!0}))},it=()=>{c&&history.state===null&&u()},st=t=>{if(t.target.nodeName==="A"&&k(t.target)){let e=t.target.getAttribute("href");if(e!==null){let r=b(e);$(r)&&(t.preventDefault(),h(r,{state:E(t.target)}))}}},nt=t=>{if(k(t.target)){let e=b(t.target.getAttribute("action")||"");if($(e)){t.preventDefault();let r=new FormData(t.target,t.submitter);if(t.target.method==="get"){for(let[o,a]of r)e.searchParams.set(o,a);h(e,{state:E(t.target)})}else h(e,{state:E(t.target),method:"POST",body:r})}}},v=()=>{_(),u(),addEventListener("popstate",lt),addEventListener("hashchange",it),addEventListener("click",st),addEventListener("submit",nt)};addEventListener("DOMContentLoaded",v);return at(ft);})();
//# sourceMappingURL=router.js.map