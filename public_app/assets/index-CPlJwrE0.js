(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function n(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(i){if(i.ep)return;i.ep=!0;const o=n(i);fetch(i.href,o)}})();const ue="modulepreload",pe=function(t,e){return new URL(t,e).href},Z={},ge=function(e,n,r){let i=Promise.resolve();if(n&&n.length>0){let v=function(u){return Promise.all(u.map(l=>Promise.resolve(l).then(a=>({status:"fulfilled",value:a}),a=>({status:"rejected",reason:a}))))};const s=document.getElementsByTagName("link"),d=document.querySelector("meta[property=csp-nonce]"),c=d?.nonce||d?.getAttribute("nonce");i=v(n.map(u=>{if(u=pe(u,r),u in Z)return;Z[u]=!0;const l=u.endsWith(".css"),a=l?'[rel="stylesheet"]':"";if(r)for(let f=s.length-1;f>=0;f--){const x=s[f];if(x.href===u&&(!l||x.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${a}`))return;const m=document.createElement("link");if(m.rel=l?"stylesheet":ue,l||(m.as="script"),m.crossOrigin="",m.href=u,c&&m.setAttribute("nonce",c),document.head.appendChild(m),l)return new Promise((f,x)=>{m.addEventListener("load",f),m.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${u}`)))})}))}function o(s){const d=new Event("vite:preloadError",{cancelable:!0});if(d.payload=s,window.dispatchEvent(d),!d.defaultPrevented)throw s}return i.then(s=>{for(const d of s||[])d.status==="rejected"&&o(d.reason);return e().catch(o)})};var O;(function(t){t.Unimplemented="UNIMPLEMENTED",t.Unavailable="UNAVAILABLE"})(O||(O={}));class J extends Error{constructor(e,n,r){super(e),this.message=e,this.code=n,this.data=r}}const fe=t=>{var e,n;return t?.androidBridge?"android":!((n=(e=t?.webkit)===null||e===void 0?void 0:e.messageHandlers)===null||n===void 0)&&n.bridge?"ios":"web"},me=t=>{const e=t.CapacitorCustomPlatform||null,n=t.Capacitor||{},r=n.Plugins=n.Plugins||{},i=()=>e!==null?e.name:fe(t),o=()=>i()!=="web",s=l=>{const a=v.get(l);return!!(a?.platforms.has(i())||d(l))},d=l=>{var a;return(a=n.PluginHeaders)===null||a===void 0?void 0:a.find(m=>m.name===l)},c=l=>t.console.error(l),v=new Map,u=(l,a={})=>{const m=v.get(l);if(m)return console.warn(`Capacitor plugin "${l}" already registered. Cannot register plugins twice.`),m.proxy;const f=i(),x=d(l);let k;const de=async()=>(!k&&f in a?k=typeof a[f]=="function"?k=await a[f]():k=a[f]:e!==null&&!k&&"web"in a&&(k=typeof a.web=="function"?k=await a.web():k=a.web),k),le=(b,w)=>{var C,P;if(x){const L=x?.methods.find($=>w===$.name);if(L)return L.rtype==="promise"?$=>n.nativePromise(l,w.toString(),$):($,D)=>n.nativeCallback(l,w.toString(),$,D);if(b)return(C=b[w])===null||C===void 0?void 0:C.bind(b)}else{if(b)return(P=b[w])===null||P===void 0?void 0:P.bind(b);throw new J(`"${l}" plugin is not implemented on ${f}`,O.Unimplemented)}},N=b=>{let w;const C=(...P)=>{const L=de().then($=>{const D=le($,b);if(D){const B=D(...P);return w=B?.remove,B}else throw new J(`"${l}.${b}()" is not implemented on ${f}`,O.Unimplemented)});return b==="addListener"&&(L.remove=async()=>w()),L};return C.toString=()=>`${b.toString()}() { [capacitor code] }`,Object.defineProperty(C,"name",{value:b,writable:!1,configurable:!1}),C},Y=N("addListener"),X=N("removeListener"),ce=(b,w)=>{const C=Y({eventName:b},w),P=async()=>{const $=await C;X({eventName:b,callbackId:$},w)},L=new Promise($=>C.then(()=>$({remove:P})));return L.remove=async()=>{console.warn("Using addListener() without 'await' is deprecated."),await P()},L},W=new Proxy({},{get(b,w){switch(w){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return x?ce:Y;case"removeListener":return X;default:return N(w)}}});return r[l]=W,v.set(l,{name:l,proxy:W,platforms:new Set([...Object.keys(a),...x?[f]:[]])}),W};return n.convertFileSrc||(n.convertFileSrc=l=>l),n.getPlatform=i,n.handleError=c,n.isNativePlatform=o,n.isPluginAvailable=s,n.registerPlugin=u,n.Exception=J,n.DEBUG=!!n.DEBUG,n.isLoggingEnabled=!!n.isLoggingEnabled,n},be=t=>t.Capacitor=me(t),G=be(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),F=G.registerPlugin;class V{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(e,n){let r=!1;this.listeners[e]||(this.listeners[e]=[],r=!0),this.listeners[e].push(n);const o=this.windowListeners[e];o&&!o.registered&&this.addWindowListener(o),r&&this.sendRetainedArgumentsForEvent(e);const s=async()=>this.removeListener(e,n);return Promise.resolve({remove:s})}async removeAllListeners(){this.listeners={};for(const e in this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}}notifyListeners(e,n,r){const i=this.listeners[e];if(!i){if(r){let o=this.retainedEventArguments[e];o||(o=[]),o.push(n),this.retainedEventArguments[e]=o}return}i.forEach(o=>o(n))}hasListeners(e){var n;return!!(!((n=this.listeners[e])===null||n===void 0)&&n.length)}registerWindowListener(e,n){this.windowListeners[n]={registered:!1,windowEventName:e,pluginEventName:n,handler:r=>{this.notifyListeners(n,r)}}}unimplemented(e="not implemented"){return new G.Exception(e,O.Unimplemented)}unavailable(e="not available"){return new G.Exception(e,O.Unavailable)}async removeListener(e,n){const r=this.listeners[e];if(!r)return;const i=r.indexOf(n);this.listeners[e].splice(i,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){const n=this.retainedEventArguments[e];n&&(delete this.retainedEventArguments[e],n.forEach(r=>{this.notifyListeners(e,r)}))}}const ee=t=>encodeURIComponent(t).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),te=t=>t.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class he extends V{async getCookies(){const e=document.cookie,n={};return e.split(";").forEach(r=>{if(r.length<=0)return;let[i,o]=r.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");i=te(i).trim(),o=te(o).trim(),n[i]=o}),n}async setCookie(e){try{const n=ee(e.key),r=ee(e.value),i=e.expires?`; expires=${e.expires.replace("expires=","")}`:"",o=(e.path||"/").replace("path=",""),s=e.url!=null&&e.url.length>0?`domain=${e.url}`:"";document.cookie=`${n}=${r||""}${i}; path=${o}; ${s};`}catch(n){return Promise.reject(n)}}async deleteCookie(e){try{document.cookie=`${e.key}=; Max-Age=0`}catch(n){return Promise.reject(n)}}async clearCookies(){try{const e=document.cookie.split(";")||[];for(const n of e)document.cookie=n.replace(/^ +/,"").replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}}async clearAllCookies(){try{await this.clearCookies()}catch(e){return Promise.reject(e)}}}F("CapacitorCookies",{web:()=>new he});const ye=async t=>new Promise((e,n)=>{const r=new FileReader;r.onload=()=>{const i=r.result;e(i.indexOf(",")>=0?i.split(",")[1]:i)},r.onerror=i=>n(i),r.readAsDataURL(t)}),ve=(t={})=>{const e=Object.keys(t);return Object.keys(t).map(i=>i.toLocaleLowerCase()).reduce((i,o,s)=>(i[o]=t[e[s]],i),{})},we=(t,e=!0)=>t?Object.entries(t).reduce((r,i)=>{const[o,s]=i;let d,c;return Array.isArray(s)?(c="",s.forEach(v=>{d=e?encodeURIComponent(v):v,c+=`${o}=${d}&`}),c.slice(0,-1)):(d=e?encodeURIComponent(s):s,c=`${o}=${d}`),`${r}&${c}`},"").substr(1):null,xe=(t,e={})=>{const n=Object.assign({method:t.method||"GET",headers:t.headers},e),i=ve(t.headers)["content-type"]||"";if(typeof t.data=="string")n.body=t.data;else if(i.includes("application/x-www-form-urlencoded")){const o=new URLSearchParams;for(const[s,d]of Object.entries(t.data||{}))o.set(s,d);n.body=o.toString()}else if(i.includes("multipart/form-data")||t.data instanceof FormData){const o=new FormData;if(t.data instanceof FormData)t.data.forEach((d,c)=>{o.append(c,d)});else for(const d of Object.keys(t.data))o.append(d,t.data[d]);n.body=o;const s=new Headers(n.headers);s.delete("content-type"),n.headers=s}else(i.includes("application/json")||typeof t.data=="object")&&(n.body=JSON.stringify(t.data));return n};class $e extends V{async request(e){const n=xe(e,e.webFetchExtra),r=we(e.params,e.shouldEncodeUrlParams),i=r?`${e.url}?${r}`:e.url,o=await fetch(i,n),s=o.headers.get("content-type")||"";let{responseType:d="text"}=o.ok?e:{};s.includes("application/json")&&(d="json");let c,v;switch(d){case"arraybuffer":case"blob":v=await o.blob(),c=await ye(v);break;case"json":c=await o.json();break;default:c=await o.text()}const u={};return o.headers.forEach((l,a)=>{u[a]=l}),{data:c,headers:u,status:o.status,url:o.url}}async get(e){return this.request(Object.assign(Object.assign({},e),{method:"GET"}))}async post(e){return this.request(Object.assign(Object.assign({},e),{method:"POST"}))}async put(e){return this.request(Object.assign(Object.assign({},e),{method:"PUT"}))}async patch(e){return this.request(Object.assign(Object.assign({},e),{method:"PATCH"}))}async delete(e){return this.request(Object.assign(Object.assign({},e),{method:"DELETE"}))}}F("CapacitorHttp",{web:()=>new $e});var ne;(function(t){t.Dark="DARK",t.Light="LIGHT",t.Default="DEFAULT"})(ne||(ne={}));var ie;(function(t){t.StatusBar="StatusBar",t.NavigationBar="NavigationBar"})(ie||(ie={}));class Ce extends V{async setStyle(){this.unavailable("not available for web")}async setAnimation(){this.unavailable("not available for web")}async show(){this.unavailable("not available for web")}async hide(){this.unavailable("not available for web")}}F("SystemBars",{web:()=>new Ce});const oe=F("App",{web:()=>ge(()=>import("./web-Dt_q8AxG.js"),[],import.meta.url).then(t=>new t.AppWeb)}),T=document.querySelector("#app"),Q="https://digioc.unifyedu.org",Ee="./unify_config.json";let E=Q,ke=[{id:"physics",name:"HSST Physics",icon:"⚡",category:"Kerala PSC",status:"Published",syllabus:"Comprehensive syllabus covering Classical Mechanics, Quantum Mechanics, Electromagnetism, Thermodynamics & Nuclear Physics."},{id:"chemistry",name:"HSST Chemistry",icon:"🧪",category:"Kerala PSC",status:"Published",syllabus:"Detailed study of Organic Chemistry, Chemical Bonding, Physical Chemistry, and Spectroscopy."},{id:"maths",name:"HSST Maths",icon:"📐",category:"Kerala PSC",status:"Published",syllabus:"Advanced Calculus, Multivariable Integration, Linear Algebra, and Real Analysis."},{id:"jee_phys",name:"JEE Physics",icon:"🛰️",category:"JEE/NEET",status:"Published",syllabus:"IIT-JEE Mechanics, Electrostatics, Magnetism, Optics and Modern Physics."},{id:"neet_bio",name:"NEET Biology",icon:"🧬",category:"JEE/NEET",status:"Published",syllabus:"Human Physiology, Genetics, Molecular Biology, Cell Structure and Ecology."},{id:"csir_phys",name:"CSIR NET Quantum Physics",icon:"🔬",category:"CSIR & UGC NET",status:"Published",syllabus:"Advanced Quantum Field Theory, Operator Algebra and Mathematical Physics."}],Pe=[{id:"vid_1",courseId:"physics",moduleTitle:"Classical Mechanics & Relativity",syllabus:"Lagrangian dynamics, special relativity, and rigid body motion.",video:"https://www.youtube.com/watch?v=aircAruvnKk"},{id:"vid_2",courseId:"physics",moduleTitle:"Quantum Mechanics & Wave Functions",syllabus:"Schrodinger equation, wave-particle duality, and quantum states.",video:"https://www.youtube.com/watch?v=IHZwWFHWa-w"},{id:"vid_3",courseId:"physics",moduleTitle:"Electromagnetism & Maxwell Equations",syllabus:"Electrostatics, induction, and Maxwell field equations.",video:"https://www.youtube.com/watch?v=wjZofJX0v4M"},{id:"vid_4",courseId:"physics",moduleTitle:"Thermodynamics & Statistical Physics",syllabus:"Laws of thermodynamics, partition functions, and entropy.",video:"https://www.youtube.com/watch?v=eMlx5fFNoYc"},{id:"vid_5",courseId:"physics",moduleTitle:"Nuclear & Particle Physics",syllabus:"Nuclear structure, radioactive decay, and elementary particles.",video:"https://www.youtube.com/watch?v=9-Jl0dxWQs8"},{id:"vid_6",courseId:"chemistry",moduleTitle:"Organic Reaction Mechanisms",syllabus:"Nucleophilic substitutions and stereochemistry.",video:"https://www.youtube.com/watch?v=aircAruvnKk"},{id:"vid_7",courseId:"maths",moduleTitle:"Calculus & Linear Transformations",syllabus:"Multivariable calculus and vector spaces.",video:"https://www.youtube.com/watch?v=wjZofJX0v4M"},{id:"vid_8",courseId:"jee_phys",moduleTitle:"IIT-JEE Mechanics Masterclass",syllabus:"Rotational dynamics and gravitation.",video:"https://www.youtube.com/watch?v=eMlx5fFNoYc"},{id:"vid_9",courseId:"neet_bio",moduleTitle:"Genetics & Human Physiology",syllabus:"Mendelian genetics and cell biology.",video:"https://www.youtube.com/watch?v=9-Jl0dxWQs8"}],g={courses:ke,content:Pe,exams:[],leaderboard:[]},p="home",S="Kerala PSC",y=null,h=0,H=[],R=[],I=0,z=null,K=localStorage.getItem("unify_currentUser")||"";function U(){return K}function re(t){K=t,localStorage.setItem("unify_currentUser",t)}function Le(t){if(!K){window.renderProfile();return}t()}oe.addListener("backButton",()=>{p!=="home"?renderHome():oe.exitApp()});async function Se(){try{const t=await fetch(Ee,{cache:"no-store"});if(!t.ok)throw new Error(`Config HTTP ${t.status}`);let n=((await t.json()).apiUrl||"").trim();n&&(n=n.replace(/\/+$/,""),/^https?:\/\//i.test(n)||(n="https://"+n),E=n,console.log("Dynamically routed to:",E))}catch{console.log("Could not reach dynamic config, using default server URL:",Q),E=Q}}async function se(){await Se();try{const t=await fetch(`${E}/data`,{cache:"no-store"});if(!t.ok)throw new Error(`Server returned HTTP ${t.status}`);const e=await t.json();e&&(e.courses&&e.courses.length>0&&(g.courses=e.courses),e.content&&e.content.length>0&&(g.content=e.content),g.exams=e.exams||[],g.leaderboard=e.leaderboard||[])}catch(t){console.warn("Could not load server state, using defaults:",t)}finally{p==="home"?renderHome():p==="learn"?renderLearn():p==="exams"?renderExamSelection():p==="leaderboard"&&renderLeaderboard()}}function j(){return`
    <div class="bottom-nav">
      <div class="nav-item ${p==="home"?"active":""}" onclick="window.renderHome()">
        <i class="fas fa-home"></i>
        <span>Home</span>
      </div>
      <div class="nav-item ${p==="learn"?"active":""}" onclick="window.renderLearn()">
        <i class="fas fa-book-open"></i>
        <span>Learn</span>
      </div>
      <div class="nav-item ${p==="exams"?"active":""}" onclick="window.renderExamSelection()">
        <i class="fas fa-edit"></i>
        <span>Exams</span>
      </div>
      <div class="nav-item ${p==="leaderboard"?"active":""}" onclick="window.renderLeaderboard()">
        <i class="fas fa-chart-line"></i>
        <span>Progress</span>
      </div>
      <div class="nav-item ${p==="profile"?"active":""}" onclick="window.renderProfile()">
        <i class="fas fa-user"></i>
        <span>Profile</span>
      </div>
    </div>
  `}function ae(t){if(!t)return"";const e=t.match(/(?:v=|\/embed\/|\/watch\?v=|\.be\/)([^&?#/]+)/);return e?e[1]:""}function q(){try{return JSON.parse(localStorage.getItem("unify_watched_videos")||"[]")}catch{return[]}}window.toggleWatchedVideo=t=>{let e=q();e.includes(t)?e=e.filter(n=>n!==t):e.push(t),localStorage.setItem("unify_watched_videos",JSON.stringify(e)),p==="learn"?window.renderLearn():p==="profile"?window.renderProfile():p==="course_details"&&M?window.openCourseDetails(M):p==="course_contents"&&M&&window.openCourseContents(M)};let A=null,_=0;function Te(){A&&(clearInterval(A),A=null),_=0,A=setInterval(()=>{const t=document.getElementById("homeBannerTrack"),e=document.querySelectorAll(".banner-dot");if(!t){clearInterval(A),A=null;return}_=(_+1)%4,t.style.transform=`translateX(-${_*25}%)`,e.forEach((n,r)=>{r===_?n.classList.add("active"):n.classList.remove("active")})},4e3)}let M=null;window.openCourseDetails=t=>{M=t,p="course_details";const e=g.courses.find(s=>s.id===t||s.name.toLowerCase()===t.toLowerCase())||{id:t,name:t.replace(/_/g," ").toUpperCase(),category:S,icon:"📚",syllabus:"Comprehensive study module covering core concepts, theory, and symbolic problem solving."},n=(g.content||[]).filter(s=>s.courseId===e.id||s.courseId===e.name),r=q(),i=n.filter(s=>r.includes(s.id||s.moduleTitle)).length,o=n.length>0?(i/n.length*100).toFixed(0):0;T.innerHTML=`
    <header style="display:flex; align-items:center; justify-content:space-between;">
      <button class="btn btn-secondary" style="font-size:11px; padding:4px 10px;" onclick="window.renderHome()">
        ← Back
      </button>
      <span class="app-name" style="font-size:1.1rem;">${e.name}</span>
      <div></div>
    </header>
    
    <div class="page fade-in" style="padding: 1rem; padding-bottom: 100px;">
      
      <!-- Course Hero Card -->
      <div style="background: linear-gradient(135deg, rgba(37,99,235,0.35), rgba(15,23,42,0.9)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop'); background-size: cover; border: 1px solid var(--glass-border); border-radius: 16px; padding: 24px 20px; text-align: center; margin-bottom: 20px; box-shadow: 0 8px 24px rgba(0,0,0,0.4);">
        <div style="font-size: 48px; margin-bottom: 8px; text-shadow: 0 4px 8px rgba(0,0,0,0.6);">${e.icon||"📚"}</div>
        <h2 style="font-size: 1.4rem; color: #fff; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.8);">${e.name}</h2>
        <span class="filter-chip active" style="font-size: 11px; padding: 3px 8px; margin-top: 6px; display: inline-block;">${e.category}</span>
        
        <!-- Progress Bar Indicator -->
        <div style="margin-top: 15px; text-align: left; background: rgba(0,0,0,0.4); padding: 10px 14px; border-radius: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: #ddd; margin-bottom: 4px;">
            <span>Lecture Completion</span>
            <span style="font-weight:700; color:#34d399;">${o}%</span>
          </div>
          <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.15); border-radius: 4px; overflow: hidden;">
            <div style="width: ${o}%; height: 100%; background: linear-gradient(90deg, #10b981, #34d399); transition: width 0.4s;"></div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div style="margin-top: 20px; display: flex; flex-direction: column; gap: 10px;">
          <button class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px; font-size: 0.95rem; font-weight: 700; background: linear-gradient(135deg, #10b981, #059669);" onclick="window.openCourseContents('${e.id}')">
            🎥 Proceed to Video Lectures & Contents (${n.length})
          </button>
          
          <button class="btn btn-secondary" style="width: 100%; justify-content: center; padding: 10px; font-size: 0.9rem; font-weight: 600; background: rgba(255,255,255,0.1);" onclick="window.takeExamForCourse('${e.category}')">
            📝 Take Exam for this Course
          </button>
        </div>
      </div>

      <!-- Syllabus Overview & Study Plan -->
      <h3 style="font-size: 1.05rem; color: #fff; font-weight: 700; margin-bottom: 12px;">🗺️ Course Syllabus & Study Plan</h3>
      <div class="card" style="background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
        <div style="font-size: 0.9rem; color: #ddd; line-height: 1.6;">
          ${e.syllabus||"Detailed syllabus, module breakdown, and study guidance prepared by expert faculty."}
        </div>
      </div>

    </div>
    ${j()}
  `};window.openCourseContents=t=>{M=t,p="course_contents";const e=g.courses.find(i=>i.id===t||i.name.toLowerCase()===t.toLowerCase())||{id:t,name:t.replace(/_/g," ").toUpperCase()},n=(g.content||[]).filter(i=>i.courseId===e.id||i.courseId===e.name),r=q();T.innerHTML=`
    <header style="display:flex; align-items:center; justify-content:space-between;">
      <button class="btn btn-secondary" style="font-size:11px; padding:4px 10px;" onclick="window.openCourseDetails('${e.id}')">
        ← Course Details
      </button>
      <span class="app-name" style="font-size:1.1rem;">${e.name} Lectures</span>
      <div></div>
    </header>
    
    <div class="page fade-in" style="padding: 1rem; padding-bottom: 100px;">
      <div style="margin-bottom: 15px; display: flex; align-items: center; justify-content: space-between;">
        <h2 style="font-size: 1.1rem; color: #fff; font-weight: 700;">🎥 Video Lectures & Content Gallery</h2>
        <span style="font-size: 0.8rem; color: var(--text-dim);">${n.length} Lectures</span>
      </div>

      ${n.length>0?`
        <!-- 4-Column Video Thumbnail Grid Table -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          ${n.map((i,o)=>{const s=r.includes(i.id||i.moduleTitle),d=ae(i.video),c=d?`https://img.youtube.com/vi/${d}/hqdefault.jpg`:"";return`
              <div style="background: rgba(0,0,0,0.4); border-radius: 8px; overflow: hidden; border: 1px solid ${s?"#10b981":"var(--glass-border)"}; display: flex; flex-direction: column; cursor: pointer; position: relative;" onclick="window.playVideoModal('${i.video}', '${i.moduleTitle}')">
                
                <div style="position: relative; aspect-ratio: 16/9; background: #111;">
                  ${c?`
                    <img src="${c}" style="width: 100%; height: 100%; object-fit: cover;" />
                  `:`
                    <div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 20px; color: #555;">▶</div>
                  `}
                  <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.2); display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-play-circle" style="font-size: 22px; color: #fff; text-shadow: 0 2px 4px rgba(0,0,0,0.8);"></i>
                  </div>
                  ${s?`
                    <div style="position: absolute; top: 4px; right: 4px; background: #10b981; color: white; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: bold;">✓</div>
                  `:""}
                </div>

                <div style="padding: 6px 4px; font-size: 9px; color: #eee; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center;">
                  L${o+1}: ${i.moduleTitle||"Lecture"}
                </div>

                <button style="background: none; border: none; font-size: 9px; color: ${s?"#34d399":"#888"}; padding-bottom: 4px; cursor: pointer;" onclick="event.stopPropagation(); window.toggleWatchedVideo('${i.id||i.moduleTitle}')">
                  ${s?"✓ Watched":"+ Mark"}
                </button>
              </div>
            `}).join("")}
        </div>
      `:`
        <div style="padding: 2rem; text-align: center; color: var(--text-dim); background: var(--card-bg); border-radius: 12px;">
          No video content uploaded for this course yet.
        </div>
      `}

    </div>
    ${j()}
  `};window.playVideoModal=(t,e)=>{const n=ae(t);if(!n)return alert(`Playing lecture: ${e}`);const r=`
    <div id="videoModal" style="position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 16px;">
      <div style="width: 100%; max-width: 600px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h4 style="color: #fff; font-size: 1rem; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${e}</h4>
        <button onclick="document.getElementById('videoModal').remove()" style="background: #ef4444; color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-weight: bold; cursor: pointer;">✕ Close</button>
      </div>
      <div style="width: 100%; max-width: 600px; aspect-ratio: 16/9; background: #000; border-radius: 12px; overflow: hidden;">
        <iframe src="https://www.youtube.com/embed/${n}?autoplay=1" style="width: 100%; height: 100%; border: none;" allow="autoplay; encrypted-media" allowfullscreen></iframe>
      </div>
    </div>
  `;document.body.insertAdjacentHTML("beforeend",r)};window.takeExamForCourse=t=>{S=t,window.renderExamSelection()};window.renderHome=()=>{p="home";const t=["Kerala PSC","JEE/NEET","IIT JAM","CSIR & UGC NET","GATE","CUET"];let e=g.courses.filter(n=>(n.category||"").toLowerCase().includes(S.toLowerCase())||S.toLowerCase().includes((n.category||"").toLowerCase()));e.length===0&&(e=g.courses),T.innerHTML=`
    <div class="page fade-in" style="padding-bottom: 100px;">
      
      <!-- Auto Sliding Banner Carousel (4:2 Ratio) -->
      <div class="banner-carousel-container">
        <div class="banner-logo-overlay">
          <img src="./logo.jpg" alt="Unify Logo" />
        </div>

        <div id="homeBannerTrack" class="banner-track">
          <div class="banner-slide" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop');">
            <div class="banner-content">
              <div class="banner-quote">“Success is not final, failure is not fatal: It is the courage to continue that counts.”</div>
              <div class="banner-sub">🌱 Deep Calmness & Mindful Study</div>
            </div>
          </div>

          <div class="banner-slide" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop');">
            <div class="banner-content">
              <div class="banner-quote">Unify Edu App — Master Physics & Symbolic Sciences with Instant Test Series</div>
              <div class="banner-sub">🚀 Interactive Learning Platform</div>
            </div>
          </div>

          <div class="banner-slide" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop');">
            <div class="banner-content">
              <div class="banner-quote">“The secret of getting ahead is getting started. Master one concept at a time.”</div>
              <div class="banner-sub">✨ Daily Focus & Inner Peace</div>
            </div>
          </div>

          <div class="banner-slide" style="background-image: linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop');">
            <div class="banner-content">
              <div class="banner-quote">Unify Edu Test Series — CSIR NET, Kerala PSC & Competitive Exam Live Analytics</div>
              <div class="banner-sub">📊 Real-Time Student Leaderboard</div>
            </div>
          </div>
        </div>

        <div class="banner-dots">
          <div class="banner-dot active"></div>
          <div class="banner-dot"></div>
          <div class="banner-dot"></div>
          <div class="banner-dot"></div>
        </div>
      </div>

      <!-- Mood & Focus Bar -->
      <div class="mood-bar">
        <div>
          <div class="mood-title">🧘 Learning Mood Booster</div>
          <div class="mood-text">Relax, breathe deeply, and focus on one topic.</div>
        </div>
        <button class="btn btn-secondary" style="font-size:11px; padding:6px 10px;" onclick="alert('Focus Mode Active! Take 25 minutes of peaceful study time.')">
          ⏱️ Focus
        </button>
      </div>

      <div class="category-filter" style="margin-top:0; padding: 0 1rem; border-bottom: 1px solid var(--glass-border); padding-bottom: 10px;">
        ${t.map(n=>`
          <div class="filter-chip ${S===n?"active":""}" 
               onclick="window.selectCategory('${n}')" style="font-size:11px; padding:4px 10px;">
            ${n}
          </div>
        `).join("")}
      </div>

      <!-- Home Page Course Grid -->
      <div class="course-grid" style="padding: 1rem;">
        ${e.length>0?e.map(n=>`
          <div class="course-card" onclick="window.openCourseDetails('${n.id}')">
            <i>${n.icon||"📚"}</i>
            <h3>${n.name}</h3>
          </div>
        `).join(""):'<p style="padding: 2rem; color: var(--text-dim); font-size: 12px;">No subjects added for this category yet.</p>'}
      </div>
    </div>
    ${j()}
  `,Te()};window.renderLearn=()=>{p="learn";const t=g.courses||[],e=g.content||[],n=q(),r=['linear-gradient(135deg, rgba(37,99,235,0.45), rgba(15,23,42,0.9)), url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop")','linear-gradient(135deg, rgba(16,185,129,0.45), rgba(15,23,42,0.9)), url("https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop")','linear-gradient(135deg, rgba(168,85,247,0.45), rgba(15,23,42,0.9)), url("https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&auto=format&fit=crop")','linear-gradient(135deg, rgba(245,158,11,0.45), rgba(15,23,42,0.9)), url("https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop")'];T.innerHTML=`
    <header><span class="app-name">Learn & Course Modules</span></header>
    <div class="page fade-in" style="padding: 1rem; padding-bottom: 100px;">
      
      <div style="margin-bottom: 15px;">
        <h2 style="font-size: 1.2rem; font-weight: 700; color: #fff;">📚 All Courses Directory</h2>
        <p style="font-size: 0.8rem; color: var(--text-dim);">Select a course tile to view syllabus, study plan, and video lectures.</p>
      </div>

      <!-- 3-Column Array of Course Tiles -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
        ${t.map((i,o)=>{const s=e.filter(u=>u.courseId===i.id||u.courseId===i.name),d=s.filter(u=>n.includes(u.id||u.moduleTitle)).length,c=s.length>0?(d/s.length*100).toFixed(0):0;return`
            <div style="background: ${r[o%r.length]}; background-size: cover; background-position: center; border: 1px solid var(--glass-border); border-radius: 12px; padding: 12px 10px; display: flex; flex-direction: column; justify-content: space-between; min-height: 120px; cursor: pointer; position: relative; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" onclick="window.openCourseDetails('${i.id}')">
              
              <div>
                <div style="font-size: 24px; text-shadow: 0 2px 4px rgba(0,0,0,0.6);">${i.icon||"📚"}</div>
                <h3 style="font-size: 0.85rem; color: #fff; font-weight: 700; margin: 4px 0 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); line-height: 1.2;">${i.name}</h3>
                <span style="font-size: 9px; color: rgba(255,255,255,0.9); background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 4px; display: inline-block;">${i.category}</span>
              </div>

              <!-- Progress Indicator Bar -->
              <div style="margin-top: 10px;">
                <div style="display: flex; justify-content: space-between; font-size: 8px; color: #ddd; margin-bottom: 2px;">
                  <span>Progress</span>
                  <span style="font-weight:700; color:#34d399;">${c}%</span>
                </div>
                <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.2); border-radius: 2px; overflow: hidden;">
                  <div style="width: ${c}%; height: 100%; background: linear-gradient(90deg, #10b981, #34d399);"></div>
                </div>
              </div>

            </div>
          `}).join("")}
      </div>

    </div>
    ${j()}
  `};window.renderProfile=async()=>{p="profile";const t=!!U(),e=g.leaderboard.filter(a=>a.name===U()),n=e.length,r=e.length>0?Math.min(...e.map(a=>a.rank||999)):"-",i=g.courses.length,o=g.content||[],s=q(),d=o.length||1,v=(o.filter(a=>s.includes(a.id||a.moduleTitle)).length/d*100).toFixed(0),u=g.courses.filter(a=>{const m=o.filter(f=>f.courseId===a.id||f.courseId===a.name);return m.length===0?!1:m.every(f=>s.includes(f.id||f.moduleTitle))}).length;let l=[];try{l=(await(await fetch(`${E}/podcasts`)).json()).podcasts||[]}catch{}T.innerHTML=`
    <header><span class="app-name">Student Profile & Social Hub</span></header>
    <div class="page fade-in" style="padding: 1rem; padding-bottom: 100px;">
      
      <!-- Student Card -->
      <div style="background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 20px;">
        <div style="width: 70px; height: 70px; background: var(--accent); border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 32px;">👤</div>
        <h2 style="font-size: 1.3rem; color: #fff; font-weight: 700;">${t?U():"Guest Student"}</h2>
        <p style="color: var(--text-dim); font-size: 0.85rem;">${t?"Verified Student Account":"Not Logged In"}</p>
        
        ${t?`
          <button class="btn btn-danger" style="margin-top: 12px; font-size: 12px; padding: 6px 12px;" onclick="window.logout()">Logout</button>
        `:`
          <form onsubmit="event.preventDefault(); window.loginAsStudent(document.getElementById('manualNameInput').value);" style="margin-top: 15px; display: flex; flex-direction: column; gap: 8px;">
            <input id="manualNameInput" type="text" placeholder="Enter your name" style="padding: 10px; border-radius: 8px; border: 1px solid #444; background: #1e1e22; color: #fff; text-align: center;" required />
            <button type="submit" class="btn btn-success" style="justify-content: center;">Log In as Student</button>
          </form>
        `}
      </div>

      <!-- Learning Analytics -->
      <h3 style="font-size: 1.05rem; color: #fff; font-weight: 700; margin-bottom: 12px;">📊 Learning Progress & Analytics</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;">
        <div style="background: rgba(16,185,129,0.15); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; padding: 14px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 800; color: #34d399;">${v}%</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Lectures Finished</div>
        </div>

        <div style="background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); border-radius: 12px; padding: 14px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 800; color: #60a5fa;">${u} / ${i}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Courses Completed</div>
        </div>

        <div style="background: rgba(37,99,235,0.15); border: 1px solid rgba(37,99,235,0.3); border-radius: 12px; padding: 14px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 800; color: #60a5fa;">${n}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Tests Completed</div>
        </div>

        <div style="background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 14px; text-align: center;">
          <div style="font-size: 1.5rem; font-weight: 800; color: #fbbf24;">#${r}</div>
          <div style="font-size: 0.75rem; color: var(--text-dim);">Highest Rank</div>
        </div>
      </div>

      <!-- Social Connect Hub -->
      <h3 style="font-size: 1.05rem; color: #fff; font-weight: 700; margin-bottom: 12px;">🤝 Connect & Discord Social Hub</h3>
      <div style="background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <div style="display: flex; gap: 8px; margin-bottom: 12px;">
          <input type="text" id="socialSearchInput" class="input-field" placeholder="Search friends, schools, institutes..." style="padding:8px 12px; font-size:0.85rem;" />
          <button class="btn btn-primary" onclick="window.searchConnect()"><i class="fas fa-search"></i> Search</button>
        </div>
        <div id="socialSearchResults" style="font-size: 0.85rem; color: var(--text-dim);">Search for fellow learners or institutes above.</div>
        
        <div style="margin-top: 15px; border-top: 1px solid var(--glass-border); padding-top: 12px;">
          <button class="btn" style="background: #5865f2; color: white; width: 100%; justify-content: center; padding: 10px;" onclick="window.discordLogin()">
            <i class="fab fa-discord"></i> Connect Discord Voice & Video Study Room
          </button>
        </div>
      </div>

      <!-- Student Podcast Studio -->
      <h3 style="font-size: 1.05rem; color: #fff; font-weight: 700; margin-bottom: 12px;">🎙️ Student Podcast Studio</h3>
      <div style="background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
        <form onsubmit="event.preventDefault(); window.publishStudentPodcast();">
          <div style="margin-bottom: 8px;">
            <input type="text" id="podTitleInput" class="input-field" placeholder="Podcast Episode Title" required style="padding:8px; font-size:0.85rem;" />
          </div>
          <div style="margin-bottom: 8px;">
            <input type="text" id="podUrlInput" class="input-field" placeholder="Audio Stream URL (e.g. MP3 link)" required style="padding:8px; font-size:0.85rem;" />
          </div>
          <button type="submit" class="btn btn-success" style="width: 100%; justify-content: center; padding: 8px;">
            <i class="fas fa-broadcast-tower"></i> Launch Podcast Episode
          </button>
        </form>

        <div style="margin-top: 16px;">
          <div style="font-size: 0.85rem; font-weight: 700; color: #fff; margin-bottom: 8px;">Community Audio Podcasts</div>
          ${l.length>0?l.map(a=>`
            <div style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 8px; margin-bottom: 8px;">
              <div style="font-weight: 700; color: #fff; font-size: 0.9rem;">${a.title}</div>
              <div style="font-size: 0.75rem; color: var(--text-dim);">By ${a.author}</div>
              ${a.audioUrl?`
                <audio controls src="${a.audioUrl}" style="width: 100%; height: 32px; margin-top: 6px;"></audio>
              `:""}
            </div>
          `).join(""):'<p style="font-size: 0.8rem; color: var(--text-dim);">No podcast episodes published yet.</p>'}
        </div>
      </div>

    </div>
    ${j()}
  `};window.loginAsStudent=async t=>{const e=(t||"").trim();if(!e)return;re(e);const n=e.toLowerCase().replace(/[^a-z0-9]/g,"_");try{await fetch(`${E}/userdata/${n}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,loginTime:new Date().toISOString()})})}catch(r){console.warn("Saved student profile locally:",r)}window.renderProfile()};window.searchConnect=async()=>{const t=document.getElementById("socialSearchInput"),e=document.getElementById("socialSearchResults");if(!t||!e)return;const n=t.value.trim();e.innerHTML="Searching...";try{const i=await(await fetch(`${E}/users/search?q=${encodeURIComponent(n)}`)).json();let o="";i.institutes&&i.institutes.length>0&&(o+='<div style="font-weight:700; color:#fff; margin-bottom:4px;">Institutes & Schools:</div>',o+=i.institutes.map(s=>`
        <div style="background:rgba(0,0,0,0.3); padding:8px; border-radius:6px; margin-bottom:6px;">
          <strong>${s.name}</strong> (${s.type}) - ${s.location}<br>
          <span style="font-size:11px; color:#aaa;">${s.members} Members</span>
        </div>
      `).join("")),i.users&&i.users.length>0&&(o+='<div style="font-weight:700; color:#fff; margin-top:8px; margin-bottom:4px;">Learners:</div>',o+=i.users.map(s=>`
        <div style="background:rgba(0,0,0,0.3); padding:8px; border-radius:6px; margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
          <div><strong>${s.name}</strong></div>
          <button class="btn btn-secondary" style="font-size:10px; padding:4px 8px;" onclick="alert('Message sent to ${s.name}!')">Chat</button>
        </div>
      `).join("")),o||(o="No matching friends, schools, or institutes found."),e.innerHTML=o}catch{e.innerHTML="Error fetching search results."}};window.publishStudentPodcast=async()=>{const t=document.getElementById("podTitleInput").value.trim(),e=document.getElementById("podUrlInput").value.trim();if(!(!t||!e))try{(await(await fetch(`${E}/podcasts`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({title:t,author:U()||"Student Podcaster",externalUrl:e})})).json()).success?(alert("Podcast Published Successfully!"),window.renderProfile()):alert("Failed to publish podcast.")}catch{alert("Network error publishing podcast.")}};window.logout=()=>{re(""),localStorage.removeItem("unify_discordId"),window.renderProfile()};window.discordLogin=async()=>{try{const t=await fetch(`${E}/auth/discord/login`),e=await t.json().catch(()=>({}));if(!t.ok)throw new Error(e.error||"Discord OAuth credentials not configured on backend.");if(!e.authorizationUrl)throw new Error("Please set clientId and clientSecret in discord_config.json on your server.");window.Capacitor&&window.Capacitor.isNativePlatform()?window.open(e.authorizationUrl,"_system"):window.location.href=e.authorizationUrl}catch(t){console.error("Discord login error:",t),alert(`Discord Login Notice:
${t.message}`)}};window.selectCategory=t=>{S=t,p==="exams"?window.renderExamSelection():renderHome()};window.renderLeaderboard=()=>{p="leaderboard";const t=g.leaderboard.filter(n=>n.name===U()),e={};t.forEach(n=>{const r=g.exams.find(o=>o.id===n.examId),i=r?r.category:"General";e[i]||(e[i]=[]),e[i].push({...n,examTitle:r?r.title:"Exam"})}),T.innerHTML=`
    <header><span class="app-name">Learning Analytics</span></header>
    <div class="page fade-in" style="padding: 1rem; padding-bottom: 100px;">
      <h2 style="font-size: 1.1rem; color: #fff; font-weight: 700; margin-bottom: 15px;">📊 Performance History</h2>

      ${Object.keys(e).length>0?Object.keys(e).map(n=>`
        <div class="card" style="background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
          <div style="font-size: 1rem; font-weight: 700; color: #fff; margin-bottom: 10px;">${n}</div>
          ${e[n].map((r,i)=>`
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.85rem;">
              <span>${r.examTitle} (Attempt ${i+1})</span>
              <span style="font-weight: 700; color: #34d399;">${r.score.toFixed(1)} / ${r.total}</span>
            </div>
          `).join("")}
        </div>
      `).join(""):`
        <div style="padding: 2rem; text-align: center; color: var(--text-dim); background: var(--card-bg); border-radius: 12px;">
          No exam attempts recorded yet. Take an exam from the Exams tab!
        </div>
      `}
    </div>
    ${j()}
  `};window.renderExamSelection=()=>{p="exams";const t=["Kerala PSC","JEE/NEET","IIT JAM","CSIR & UGC NET","GATE","CUET"];let e=g.exams.filter(n=>n.category===S);e.length===0&&(e=g.exams),T.innerHTML=`
    <header><span class="app-name">Exams & Test Series</span></header>
    <div class="page fade-in" style="padding: 1rem; padding-bottom: 100px;">
      
      <div class="category-filter" style="margin-bottom: 15px;">
        ${t.map(n=>`
          <div class="filter-chip ${S===n?"active":""}" 
               onclick="window.selectCategory('${n}')" style="font-size:11px; padding:4px 10px;">
            ${n}
          </div>
        `).join("")}
      </div>

      <h3 style="font-size: 1.05rem; color: #fff; font-weight: 700; margin-bottom: 12px;">Available Exams</h3>
      ${e.length>0?e.map(n=>`
        <div class="card" style="background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="font-size: 1rem; color: #fff; margin-bottom: 4px;">${n.title}</h4>
            <span style="font-size: 0.75rem; color: var(--text-dim);">${n.questions?n.questions.length:0} Questions • ${n.category}</span>
          </div>
          <button class="btn btn-primary" style="font-size: 11px; padding: 6px 12px;" onclick="window.startExam('${n.id}')">
            Start Exam 🚀
          </button>
        </div>
      `).join(""):`
        <div style="padding: 2rem; text-align: center; color: var(--text-dim); background: var(--card-bg); border-radius: 12px;">
          No exams deployed for this category yet.
        </div>
      `}

    </div>
    ${j()}
  `};window.triggerExamFromHome=t=>{window.openCourseDetails(t)};window.startExam=t=>{Le(()=>{if(y=g.exams.find(e=>e.id===t),!y||!y.questions||y.questions.length===0)return alert("This exam has no questions.");h=0,H=new Array(y.questions.length).fill(null),R=new Array(y.questions.length).fill(!1),I=y.questions.length*90,p="test_interface",z&&clearInterval(z),z=setInterval(()=>{if(I--,I<=0)clearInterval(z),window.submitExam();else{const e=document.getElementById("examTimer");if(e){const n=Math.floor(I/60),r=I%60;e.innerText=`${n}:${r<10?"0":""}${r}`}}},1e3),window.renderQuestion()})};window.renderQuestion=()=>{const t=y.questions[h],e=y.questions.length,n=Math.floor(I/60),r=I%60;T.innerHTML=`
    <header style="display:flex; justify-content:space-between; align-items:center;">
      <span class="app-name" style="font-size:0.95rem;">${y.title}</span>
      <span id="examTimer" style="font-family:monospace; font-weight:bold; color:#f59e0b;">${n}:${r<10?"0":""}${r}</span>
    </header>
    
    <div class="page fade-in" style="padding: 1rem; padding-bottom: 100px;">
      <div style="display:flex; justify-content:space-between; margin-bottom: 10px; font-size: 0.85rem; color: var(--text-dim);">
        <span>Question ${h+1} of ${e}</span>
        <button style="background:none; border:none; color: ${R[h]?"#f59e0b":"#888"}; cursor:pointer;" onclick="window.toggleReview()">
          ${R[h]?"★ Marked":"☆ Mark Review"}
        </button>
      </div>

      <div class="card" style="background: var(--card-bg); border: 1px solid var(--glass-border); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
        <div style="font-size: 0.95rem; color: #fff; line-height: 1.5; margin-bottom: 15px;">
          ${t.q}
        </div>

        <div style="display:flex; flex-direction:column; gap: 8px;">
          ${t.options.map((i,o)=>`
            <div style="padding: 12px; border-radius: 8px; border: 1px solid ${H[h]===o?"var(--accent)":"rgba(255,255,255,0.1)"}; background: ${H[h]===o?"rgba(37,99,235,0.2)":"rgba(0,0,0,0.2)"}; color: #fff; font-size: 0.9rem; cursor: pointer;" onclick="window.selectAnswer(${o})">
              <strong style="margin-right: 8px;">${String.fromCharCode(65+o)}.</strong> ${i}
            </div>
          `).join("")}
        </div>
      </div>

      <div style="display:flex; justify-content:space-between;">
        <button class="btn btn-secondary" ${h===0?"disabled":""} onclick="window.prevQuestion()">Previous</button>
        ${h===e-1?`
          <button class="btn btn-success" onclick="window.submitExam()">Submit Exam</button>
        `:`
          <button class="btn btn-primary" onclick="window.nextQuestion()">Next</button>
        `}
      </div>
    </div>
  `,window.MathJax&&window.MathJax.typesetPromise&&window.MathJax.typesetPromise()};window.selectAnswer=t=>{H[h]=t,window.renderQuestion()};window.toggleReview=()=>{R[h]=!R[h],window.renderQuestion()};window.nextQuestion=()=>{h<y.questions.length-1&&(h++,window.renderQuestion())};window.prevQuestion=()=>{h>0&&(h--,window.renderQuestion())};window.submitExam=async()=>{z&&clearInterval(z);let t=0;y.questions.forEach((e,n)=>{H[n]===e.correct&&t++});try{await fetch(`${E}/activity/finish`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({student:U()||"Anonymous",examTitle:y.title,examId:y.id,score:t,total:y.questions.length})})}catch{}alert(`Exam Submitted!
Your Score: ${t} / ${y.questions.length}`),await se(),window.renderLeaderboard()};se();export{V as W};
