var router=(()=>{var R=Object.defineProperty;var tt=Object.getOwnPropertyDescriptor;var et=Object.getOwnPropertyNames;var rt=Object.prototype.hasOwnProperty;var ot=(t,e)=>{for(var r in e)R(t,r,{get:e[r],enumerable:!0})},lt=(t,e,r,o)=>{if(e&&typeof e=="object"||typeof e=="function")for(let l of et(e))!rt.call(t,l)&&l!==r&&R(t,l,{get:()=>e[l],enumerable:!(o=tt(e,l))||o.enumerable});return t};var at=t=>lt(R({},"__esModule",{value:!0}),t);var ct={};ot(ct,{all:()=>X,bind:()=>F,cache:()=>j,fetch:()=>x,get:()=>V,hash:()=>J,post:()=>W,push:()=>q,redirect:()=>K,reload:()=>p,replace:()=>I,subscribe:()=>B,update:()=>_});var c=location.origin==="file://",A="body",S=!1,d=!1,J=()=>{c=!0},F=t=>{A=t},_=()=>{S=!0},j=()=>{d=!0};var s,z=()=>{s=document.querySelector(A)};var g=[],B=t=>(g.push(t),()=>{let e=g.indexOf(t);e>-1&&g.splice(e,1)}),O=t=>{for(let e=g.length-1;e>-1;e--)g[e](t)};var C={},K=t=>({tag:C,location:t}),L=(t,e)=>e&&e.tag===C?e:{tag:C,body:e,url:t.url};var U=[],y=[],Q=[{path:"/404",fetch:t=>L(t,`<pre>Unable to ${t.method} ${t.url.pathname}</pre>`)},{path:"/500",fetch:t=>(console.error(t.error),L(t,`<pre>${t.error.stack}</pre>`))}],$=t=>(e,r)=>{let o=new RegExp("^"+e.replace(/[/.-]/g,"\\$&").replace(/\:([^/]+)/g,"(?<$1>[^/]+)").replace(/\*(.+)/g,"(?<$1>.*)")+"$"),l={path:e,match:i=>{if(t.includes(i.method)){let a=o.exec(i.url.pathname);if(a)return a.groups??{}}},fetch:async(i,a,n)=>L(i,await Promise.resolve(r(i,a,n)))};r.length===3?U.push(l):y.push(l)},V=$(["GET"]),W=$(["POST"]),X=$(["GET","POST"]);var k=t=>t.origin===location.origin,D=t=>t.target===""||t.target==="_self",H=t=>c?"#"+t.pathname+t.search:t,M=t=>[...y,...Q].find(e=>e.path===t).fetch,E=t=>t.hasAttribute("replace")?"REPLACE":"PUSH",T=(t,e)=>t&&t.method===e.method&&t.url===e.url,G=t=>{s.innerHTML=t;let e=s.querySelector("[autofocus]");e&&e.focus()};var Y=async t=>{let e=r=>U.reduce((o,l)=>{let i=l.match(t);return i?a=>l.fetch(a,i,o):o},r);try{for(let r of y){let o=r.match(t);if(o)return await e(r.fetch)({...t,params:o})}return await e(M("/404"))(t)}catch(r){return await e(M("/500"))({...t,error:r})}};var b=t=>new URL(t,c?new URL(location.hash.substring(1),location.origin):new URL(location.href));var Z={},w=(t,e)=>t&&t.tag===Z?t:(t=b(t),{tag:Z,method:"GET",url:t,params:{},query:t.searchParams,...e});var x=async(t,e)=>{let r=w(t,e),o=await Y(r);return o.location?x(new URL(o.location,r.url)):o};var m=null,P=null,N=()=>{m!==null&&(m=null,P!==null?clearTimeout(P):(s.classList.remove("loading"),O({type:"loaded"})))},u,h=async(t,e)=>{let r=w(t,e),o={method:r.method,url:r.url.toString()};if(T(m,o))return;m||(P=setTimeout(()=>{P=null,s.classList.add("loading"),O({type:"loading"})},500)),m=o,d&&!u&&(u=JSON.parse(localStorage.getItem("caches")||"{}"));let l=H(r.url),i=d&&r.method!=="POST"&&!r.restored&&l in u;if(i){let a=u[l];G(a.body),r.state==="REPLACE"?history.replaceState(a.body,"",a.url):history.pushState(a.body,"",a.url),document.body.scrollTo(0,0)}try{let a=await x(r),n=String(a.body),f=H(a.url);T(m,o)&&(G(n),i?history.replaceState(n,"",f):l!==f?r.state==="REPLACE"?(history.replaceState(null,"",l),history.replaceState(n,"",f)):(history.pushState(null,"",l),history.replaceState(n,"",f)):r.state==="REPLACE"?history.replaceState(n,"",f):history.pushState(n,"",f),r.restored||document.body.scrollTo(0,0)),d&&r.method!=="POST"&&(u[l]={body:n,url:f},localStorage.setItem("caches",JSON.stringify(u)))}finally{T(m,o)&&N()}},q=h,I=(t,e)=>{h(t,{state:"REPLACE",...e})},p=t=>{I("",t)};var it=t=>{t.state!==null&&(s.innerHTML=t.state,N(),S&&p({restored:!0}))},st=()=>{c&&history.state===null&&p()},nt=t=>{if(t.target.nodeName==="A"&&D(t.target)){let e=t.target.getAttribute("href");if(e!==null){let r=b(e);k(r)&&(t.preventDefault(),h(r,{state:E(t.target)}))}}},ft=t=>{if(D(t.target)){let e=b(t.target.getAttribute("action")||"");if(k(e)){t.preventDefault();let r=new FormData(t.target,t.submitter);if(t.target.method==="get"){for(let[o,l]of r)e.searchParams.set(o,l);h(e,{state:E(t.target)})}else h(e,{state:E(t.target),method:"POST",body:r})}}},v=()=>{z(),S&&history.state!==null?(s.innerHTML=history.state,p({restored:!0})):p(),addEventListener("popstate",it),addEventListener("hashchange",st),addEventListener("click",nt),addEventListener("submit",ft)};addEventListener("DOMContentLoaded",v);return at(ct);})();
//# sourceMappingURL=router.js.map
