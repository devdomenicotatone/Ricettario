const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/logo-intro-DWh29O1b.css","assets/pagina-Bx8tTPAz.js","assets/pagina-Dn7Q-bkn.css"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&o(r)}).observe(document,{childList:!0,subtree:!0});function i(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(a){if(a.ep)return;a.ep=!0;const n=i(a);fetch(a.href,n)}})();const Ee="modulepreload",Ce=function(e){return"/Ricettario/"+e},G={},q=function(t,i,o){let a=Promise.resolve();if(i&&i.length>0){let r=function(c){return Promise.all(c.map(p=>Promise.resolve(p).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),d=s?.nonce||s?.getAttribute("nonce");a=r(i.map(c=>{if(c=Ce(c),c in G)return;G[c]=!0;const p=c.endsWith(".css"),h=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${h}`))return;const _=document.createElement("link");if(_.rel=p?"stylesheet":Ee,p||(_.as="script"),_.crossOrigin="",_.href=c,d&&_.setAttribute("nonce",d),document.head.appendChild(_),p)return new Promise((b,x)=>{_.addEventListener("load",b),_.addEventListener("error",()=>x(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(r){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=r,window.dispatchEvent(s),!s.defaultPrevented)throw r}return a.then(r=>{for(const s of r||[])s.status==="rejected"&&n(s.reason);return t().catch(n)})};function ee(e){const t=document.getElementById("annuncio-pagina");!t||!e||(t.textContent="",setTimeout(()=>{t.textContent=e},100))}const B={pane:{name:"Pane",dir:"pane",emoji:"baguette-bread",unicode:"🥖",title:"Pane Artigianale",desc:"Ricette di pane ad alta idratazione — ciabatta, filone, baguette e pane speciale."},pizza:{name:"Pizza",dir:"pizza",emoji:"pizza",unicode:"🍕",title:"Pizza Artigianale",desc:"Pizze con lievitazione lunga — napoletana, in teglia, canotto e pinsa romana."},primi:{name:"Primi",dir:"primi",emoji:"tomato",unicode:"🥣",title:"Primi Piatti",desc:"Primi piatti della tradizione — gnocchi, polenta, zuppe e piatti unici caldi."},lievitati:{name:"Lievitati",dir:"lievitati",emoji:"croissant",unicode:"🥐",title:"Lievitati Dolci e Salati",desc:"Brioche, cornetti, panettone, burger buns e rosticceria."},focaccia:{name:"Focaccia",dir:"focaccia",emoji:"flatbread",unicode:"🫓",title:"Focaccia Artigianale",desc:"Focacce ad alta idratazione — genovese, barese, pugliese e varianti creative."},dolci:{name:"Dolci",dir:"dolci",emoji:"shortcake",unicode:"🍪",title:"Dolci e Pasticceria",desc:"Dolci tradizionali, frolle, biscotti e pasticceria artigianale."},conserve:{name:"Conserve",dir:"conserve",emoji:"canned-food",unicode:"🫙",title:"Conserve e Preparazioni",desc:"Conserve fatte in casa — dadi vegetali, salse, sottoli e preparazioni base."},condimenti:{name:"Condimenti",dir:"condimenti",emoji:"herb",unicode:"🌿",title:"Condimenti",desc:"Salse, pesti e condimenti artigianali per ogni piatto."},secondi_piatti:{name:"Secondi Piatti",dir:"secondi-piatti",emoji:"fork-and-knife",unicode:"🍲",title:"Secondi Piatti",desc:"Esplora ricette complete e saporite per i tuoi secondi piatti: carne, pesce, legumi e verdure."}},ke=["primi","pane","pizza","lievitati","dolci","focaccia","conserve","condimenti","secondi_piatti"],te=Object.fromEntries(Object.values(B).map(e=>[e.dir,e])),ie=Object.fromEntries(Object.values(B).map(e=>[e.name,e.emoji]));Object.values(B).map(e=>e.name);const Le={"shopping-cart":"shopping-cart","balance-scale":"balance-scale",peanuts:"peanuts",gear:"gear","sheaf-of-rice":"flatbread",fire:"fire","light-bulb":"light-bulb","open-book":"open-book",prohibited:"prohibited",warning:"warning",droplet:"droplet",thermometer:"thermometer",stopwatch:"stopwatch",wrench:"wrench","baguette-bread":"baguette-bread",pizza:"pizza",spaghetti:"spaghetti",croissant:"croissant",cookie:"cookie",flatbread:"flatbread",shortcake:"shortcake","canned-food":"canned-food",herb:"herb","fork-and-knife":"fork-and-knife",star:"star",house:"house","high-voltage":"high-voltage",bullseye:"bullseye",package:"package",tomato:"tomato"};function w(e,t,i=20,o=""){const a=Le[t]||t,n=`fluent-emoji${o?" "+o:""}`;return`<img src="${e}images/emoji/${a}.png" width="${i}" height="${i}" alt="" class="${n}" loading="lazy">`}function Se(e,t,i=20){const o=ie[t];return o?w(e,o,i):""}function l(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const g=l;function O(e,{base:t,titolo:i="Pagina non trovata",dettaglio:o="",uscite:a}={}){document.title=`${i} — Ricettario Lab`;const[n,...r]=a?.length?a:[{href:t,testo:"Torna alla home"},{href:`${t}#ricette`,testo:"Vedi tutte le ricette"}],s=(d,c="")=>`<a href="${l(d.href)}" data-link${c?` class="${c}"`:""}>${l(d.testo)}</a>`;e.innerHTML=`
    <div class="container" style="padding: 120px 0; text-align: center;">
      <h1>${w(t,"prohibited",28)} ${l(i)}</h1>
      ${o?`<p style="color: var(--color-text-muted);">${l(o)}</p>`:""}
      <p>${s(n,"btn-back")}</p>
      ${r.length?`<p>${r.map(d=>s(d)).join(" · ")}</p>`:""}
    </div>`}const f="/Ricettario/";let oe={};function Ae(e){oe=e}function ae(e){let t=e.replace(f,"").replace(/^\/+|\/+$/g,"");if(!t||t==="index.html")return{type:"home",params:{}};const i=t.match(/^ricette\/([^/]+)\/([^/]+?)(?:\.html)?$/);if(i)return{type:"recipe",params:{category:i[1],slug:i[2]}};const o=t.match(/^ricette\/([^/]+)\/?$/);if(o)return{type:"category",params:{category:o[1]}};const a=t.match(/^cottura(?:\/([^/]+?))?(?:\.html)?$/);return a?{type:"cottura",params:{config:a[1]||null}}:{type:"nonTrovata",params:{percorso:e}}}let V=!0;function U(){const e=document.getElementById("contenuto"),t=e?.querySelector("h1")||e;t&&(t.hasAttribute("tabindex")||t.setAttribute("tabindex","-1"),t.focus({preventScroll:!0}));const i=document.title.replace(/\s*[—-]\s*(Il )?Ricettario( Lab)?\s*$/i,"").trim();ee(i?`${i}, pagina caricata`:"Pagina caricata")}async function j(e,t=!0){const i=new URL(e,window.location.origin);t&&history.pushState(null,"",i.pathname+i.search);const o=ae(i.pathname),a=document.getElementById("app");if(!a)return;window.scrollTo(0,0);const n=V;if(V=!1,"startViewTransition"in document){const r=document.startViewTransition(async()=>{await W(o,a,n)});n||r.updateCallbackDone.then(U).catch(()=>{})}else await W(o,a,n),n||U()}async function W(e,t,i=!1){const o=oe[e.type];o?await o(t,e.params,{primoCaricamento:i}):O(t,{base:f}),M()}function M(){const e=document.querySelectorAll(".reveal:not(.visible)");if(e.length===0)return;const t=new IntersectionObserver(i=>{i.forEach(o=>{o.isIntersecting&&(o.target.classList.add("visible"),t.unobserve(o.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});e.forEach(i=>t.observe(i))}function ze(){const e=sessionStorage.getItem("spa-redirect");e&&(sessionStorage.removeItem("spa-redirect"),history.replaceState(null,"",e)),document.addEventListener("click",t=>{const i=t.target.closest("a[href]");if(!i)return;const o=i.getAttribute("href"),a=i.getAttribute("data-nav-section");if(a){if(ae(window.location.pathname).type!=="home"){t.preventDefault(),j(f).then(()=>{setTimeout(()=>{const s=document.getElementById(a);s&&s.scrollIntoView({behavior:"smooth"})},100)});return}return}if(!o||o.startsWith("http")||o.startsWith("#")||o.startsWith("mailto:")||o.startsWith("tel:")||i.target==="_blank")return;t.preventDefault();const n=new URL(o,window.location.href);j(n.href)}),window.addEventListener("popstate",()=>{j(window.location.href,!1)}),j(window.location.href,!1)}const re="ricettario_fatte";function H(){try{const e=localStorage.getItem(re);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function Me(e){localStorage.setItem(re,JSON.stringify([...e]))}function Te(e){return H().has(e)}function Ie(e){const t=H(),i=!t.has(e);return i?t.add(e):t.delete(e),Me(t),i}function T(){const e=H();if(e.size===0)return;document.querySelectorAll(".recipe-card--compact, .category-card").forEach(i=>{const o=i.getAttribute("href")||"",a=new URL(o,location.origin).pathname.split("/").filter(Boolean).pop();if(a&&e.has(a)&&!i.querySelector(".made-badge")){const n=document.createElement("span");n.className="made-badge",n.textContent="✓",n.title="Ricetta già fatta!";const r=i.querySelector(".recipe-card--compact__image-wrapper, .category-card__image-wrapper");r&&r.appendChild(n)}})}function Pe(e){const t=document.getElementById("made-toggle");if(!t)return;const i=o=>{t.classList.toggle("made-toggle--active",o),t.setAttribute("aria-pressed",String(o)),t.innerHTML=o?'<span class="made-toggle__icon" aria-hidden="true">✓</span> <span class="made-toggle__label">Fatta!</span>':'<span class="made-toggle__icon" aria-hidden="true">○</span> <span class="made-toggle__label">Segna come fatta</span>',t.title=o?"Clicca per rimuovere":"Segna questa ricetta come fatta"};i(Te(e)),t.addEventListener("click",o=>{o.preventDefault();const a=Ie(e);i(a),t.classList.add("made-toggle--pop"),setTimeout(()=>t.classList.remove("made-toggle--pop"),400)})}const je={"arrow-up-right":'<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"grid-3x3":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',list:'<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>',microscope:'<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',moon:'<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',search:'<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'},ne="http://www.w3.org/2000/svg",Re={xmlns:ne,width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"};function Be(e=document){for(const t of e.querySelectorAll("[data-lucide]")){const i=t.getAttribute("data-lucide"),o=je[i];if(!o){console.warn(`[icons] icona "${i}" non disponibile: aggiungila a js/icons.js`);continue}const a=document.createElementNS(ne,"svg");for(const[n,r]of Object.entries(Re))a.setAttribute(n,r);for(const n of t.attributes)n.name!=="data-lucide"&&a.setAttribute(n.name,n.value);a.setAttribute("class",`lucide lucide-${i}${t.className?" "+t.className:""}`),a.innerHTML=o,t.replaceWith(a)}}function F(e,t=20,i=""){return w(f,e,t,i)}const Oe=ie;function S(){Be()}const De=/\{([a-zA-Z_][a-zA-Z0-9_]*):(\d+(?:\.\d+)?)(!)?\}/,se=()=>new RegExp(De.source,"g");function N(e){return e===0?"0":e>=10?`${Math.round(e)}`:e>=1?`${Math.round(e*10)/10}`:`${Math.round(e*100)/100}`}function Fe(e){return String(e||"").replace(se(),(t,i,o,a)=>{const n=parseFloat(o);return`<span class="dose-inline" data-base="${n}" data-token-id="${i}"${a?' data-fixed="true"':""}>${N(n)}</span>`})}function qe(e){return String(e||"").replace(se(),(t,i,o)=>N(parseFloat(o)))}const He=["immagine esistente","caricata manualmente","provenienza non documentata"],Ne=["pexels","unsplash","pixabay","wikimedia","openverse","flickr"],X={"pexels license":"https://www.pexels.com/license/","unsplash license":"https://unsplash.com/license","pixabay license":"https://pixabay.com/service/license-summary/"};function Ge(e){const t=String(e??"").trim().toLowerCase();if(!t)return null;if(X[t])return X[t];const i=t.replace(/^cc\s+/,"");if(/^cc0\b/.test(i)||i==="zero")return"https://creativecommons.org/publicdomain/zero/1.0/";if(/^(public domain|pdm|dominio pubblico)\b/.test(i))return"https://creativecommons.org/publicdomain/mark/1.0/";const o=i.match(/^(by(?:-nc)?(?:-sa|-nd)?)\s+(\d\.\d)$/);return o?`https://creativecommons.org/licenses/${o[1]}/${o[2]}/`:null}function Ve(e){const t=String(e??"").trim();if(!/^https:\/\//i.test(t))return null;const i=t.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/[a-z-]+\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)/i);if(i)return`https://commons.wikimedia.org/wiki/File:${i[1]}`;const o=t.match(/^https:\/\/images\.pexels\.com\/photos\/(\d+)\//i);return o?`https://www.pexels.com/photo/${o[1]}/`:/^https:\/\/(commons\.wikimedia\.org\/wiki\/|www\.pexels\.com\/photo\/|unsplash\.com\/photos\/|pixabay\.com\/[a-z-]+\/|openverse\.org\/image\/|www\.flickr\.com\/photos\/)/i.test(t)?t:null}function Ue(e,t){const i=String(e??"").trim();if(!i)return null;const o=i.replace(/^📷\s*/,"").replace(/^Foto:\s*/i,"").trim();if(!o||He.includes(o.toLowerCase()))return null;const a=o.split(/\s+[—–]\s+/),n=a[0].trim();if(!n)return null;let r=null,s=null;if(a.length>1){const d=a.slice(1).join(" — ").trim(),c=d.match(/^(.*?)\s+via\s+(.+)$/i);c?(r=c[1].trim()||null,s=c[2].trim()):Ne.includes(d.toLowerCase())?s=d:r=d||null}return{autore:n,licenza:r,fonte:s,urlLicenza:Ge(r),urlFonte:Ve(t)}}function We(e,t){const i=Ue(e,t);if(!i)return"";const o=(r,s,d)=>s?`<a href="${l(s)}" target="_blank" rel="${d}">${l(r)}</a>`:l(r),a=!!(i.licenza&&!i.urlLicenza&&i.urlFonte);let n=`Foto: ${l(i.autore)}`;return i.licenza&&(n+=a?` — ${o(i.licenza,i.urlFonte,"noopener nofollow")}`:` — ${o(i.licenza,i.urlLicenza,"license noopener nofollow")}`),i.fonte?n+=` via ${o(i.fonte,a?null:i.urlFonte,"noopener nofollow")}`:i.urlFonte&&!a&&(n+=` — ${o("fonte",i.urlFonte,"noopener nofollow")}`),n}const Xe=["n/a","na","nessuna","nessuno","none","null","0","-","—"];function E(e){if(e==null)return!1;const t=String(e).trim();return t!==""&&!Xe.includes(t.toLowerCase())}const Ye={"images/ricette/condimenti/babaganoush-crema-melanzane":[1200,896],"images/ricette/condimenti/bagna-cauda":[1800,1350],"images/ricette/condimenti/besciamella":[1200,896],"images/ricette/condimenti/burro-composto-acciughe-tartufo":[1200,896],"images/ricette/condimenti/burro-maitre-d-hotel":[1200,896],"images/ricette/condimenti/caesar-dressing":[1200,896],"images/ricette/condimenti/chimichurri":[1200,896],"images/ricette/condimenti/coulis-salsa-pomodoro-fresco":[1800,1200],"images/ricette/condimenti/crema-al-parmigiano":[1200,896],"images/ricette/condimenti/crema-di-peperoni":[1600,1066],"images/ricette/condimenti/dressing-miele-senape":[1200,896],"images/ricette/condimenti/fumetto-di-crostacei":[1800,1200],"images/ricette/condimenti/guacamole":[1800,1200],"images/ricette/condimenti/maionese":[1800,1200],"images/ricette/condimenti/marinatura-menta-aceto-verdure-grigliate":[1280,896],"images/ricette/condimenti/olio-aglio-nero-ossidiana":[1200,896],"images/ricette/condimenti/olio-al-basilico-verde-smeraldo":[1280,896],"images/ricette/condimenti/olio-carota-zenzero-arancio-fluo":[1200,896],"images/ricette/condimenti/olio-cavolo-viola-elettrico":[1200,896],"images/ricette/condimenti/olio-curcuma-zafferano-giallo-oro":[1200,896],"images/ricette/condimenti/olio-extravergine-aromatizzato-verde-dorato":[1200,896],"images/ricette/condimenti/olio-peperone-crusco-rosso-rubino":[1200,896],"images/ricette/condimenti/pesto-alla-genovese-tradizionale":[1800,1200],"images/ricette/condimenti/pesto-alla-siciliana":[1800,1200],"images/ricette/condimenti/pesto-di-barbabietola":[1733,1300],"images/ricette/condimenti/pesto-di-fave-maro":[1314,1300],"images/ricette/condimenti/pesto-di-pistacchi-artigianale":[1800,1200],"images/ricette/condimenti/pesto-di-zucchine":[1800,1200],"images/ricette/condimenti/pesto-pomodori-secchi-mandorle-basilico":[1800,1119],"images/ricette/condimenti/pesto-rucola-artigianale":[1335,1300],"images/ricette/condimenti/pure-di-patate":[1200,896],"images/ricette/condimenti/salmoriglio-siciliano-tradizionale":[1800,1200],"images/ricette/condimenti/salsa-alle-noci":[1800,1200],"images/ricette/condimenti/salsa-allo-yogurt":[1800,1200],"images/ricette/condimenti/salsa-allo-yogurt-ed-erba-cipollina":[1800,1192],"images/ricette/condimenti/salsa-bbq-artigianale":[1800,965],"images/ricette/condimenti/salsa-bernese":[1200,896],"images/ricette/condimenti/salsa-cocktail-rosa-artigianale":[1200,896],"images/ricette/condimenti/salsa-teriyaki-originale":[1200,896],"images/ricette/condimenti/salsa-verde-tradizionale":[1800,1201],"images/ricette/condimenti/vinaigrette-classica-e-citronette":[1733,1300],"images/ricette/conserve/burro-chiarificato":[1200,896],"images/ricette/conserve/dado-vegetale-fatto-in-casa":[1200,896],"images/ricette/conserve/dado-vegetale-granulare":[1200,896],"images/ricette/conserve/pomodorini-confit-sottolio":[1800,1195],"images/ricette/dolci/cantuccini-di-prato":[1800,1239],"images/ricette/dolci/cartocci-alla-crema-siciliani":[1800,1200],"images/ricette/dolci/migliaccio-napoletano":[1800,1200],"images/ricette/focaccia/calzone-cipolla-barese-pugliese":[1200,896],"images/ricette/focaccia/focaccia-barese":[1800,1350],"images/ricette/focaccia/focaccia-di-recco-igp":[1800,1350],"images/ricette/focaccia/focaccia-genovese-classica":[1880,1253],"images/ricette/focaccia/focaccia-genovese-fugassa":[1200,896],"images/ricette/lievitati/burger-buns-con-biga":[1800,1200],"images/ricette/lievitati/cornetti-sfogliati-classici":[1800,1200],"images/ricette/lievitati/impasto-rosticceria-siciliana":[1200,896],"images/ricette/lievitati/panettone-fatto-in-casa-caputo":[1800,1202],"images/ricette/lievitati/panettone-pere-cioccolato":[1880,1251],"images/ricette/lievitati/pasta-brioche-artigianale":[1800,1200],"images/ricette/lievitati/pasta-brioche-classica":[1800,1064],"images/ricette/lievitati/pasta-madre-solida-creazione-rinfresco":[1800,1202],"images/ricette/pane/baguette-francese-tradizionale":[1733,1300],"images/ricette/pane/ciabatta-con-poolish":[1800,1200],"images/ricette/pane/pane-ai-cereali-semi":[1200,896],"images/ricette/pane/pane-alle-noci-con-poolish":[1200,896],"images/ricette/pane/pane-di-altamura-dop":[1200,896],"images/ricette/pane/pane-integrale-con-biga":[1800,1182],"images/ricette/pane/pane-pugliese-con-biga":[1500,1e3],"images/ricette/pane/treccia-di-pane-olio":[1800,1200],"images/ricette/pizza/pinsa-romana":[1500,1125],"images/ricette/pizza/pizza-contemporanea-canotto":[1880,1253],"images/ricette/pizza/pizza-in-teglia-romana":[1700,1300],"images/ricette/pizza/pizza-in-teglia-romana-alta-idratazione":[1800,1013],"images/ricette/pizza/pizza-margherita-verace-disciplinare-avpn":[1800,1200],"images/ricette/pizza/pizza-marinara-napoletana-verace":[1800,1202],"images/ricette/pizza/pizza-napoletana-biga-criscito":[1880,1253],"images/ricette/pizza/pizza-napoletana-verace-stg":[1800,1013],"images/ricette/pizza/pizza-romana-stesa-al-matterello":[1800,1202],"images/ricette/primi/gnocchi-di-patate":[1800,1196],"images/ricette/primi/polenta-concia-valdostana":[1200,896],"images/ricette/secondi-piatti/brisket-stile-toscano":[1800,1201],"images/ricette/secondi-piatti/mayak-gyeran-uova-marinate-coreane":[1200,896],"images/ricette/secondi-piatti/pulled-pork-bbq":[1280,853],"images/ricette/secondi-piatti/spare-ribs-salsa-bbq":[1280,853]};function ce(e){const t=e.replace(/\.(jpg|jpeg|png|webp)$/i,"");return{avif:`${t}.avif`,webp:`${t}.webp`}}const Y=640;function le(e){const t=e.indexOf("images/");if(t===-1)return null;const i=e.slice(t).replace(/\.(jpg|jpeg|png|webp)$/i,"");return Ye[i]||null}function L(e,t){return`${e.replace(/\.(avif|webp)$/i,`-${Y}.$1`)} ${Y}w, ${e} ${t}w`}function de(e,t,i="",o="lazy",a="100vw"){if(!e)return"";const{avif:n,webp:r}=ce(e),s=i?` class="${g(i)}"`:"",d=o?` loading="${g(o)}"`:"",c=le(e);if(!c)return`<picture>
  <source srcset="${g(n)}" type="image/avif">
  <source srcset="${g(r)}" type="image/webp">
  <img src="${g(r)}" alt="${g(t)}"${s}${d}>
</picture>`;const[p,h]=c,_=` sizes="${g(a)}"`;return`<picture>
  <source srcset="${g(L(n,p))}"${_} type="image/avif">
  <source srcset="${g(L(r,p))}"${_} type="image/webp">
  <img src="${g(r)}" srcset="${g(L(r,p))}"${_} width="${p}" height="${h}" alt="${g(t)}"${s}${d}>
</picture>`}function Qe(e,t){if(!e)return"";const{avif:i,webp:o}=ce(e),a=le(e);if(!a)return`<picture class="recipe-hero__picture">
  <source srcset="${g(i)}" type="image/avif">
  <source srcset="${g(o)}" type="image/webp">
  <img src="${g(o)}" alt="${g(t)}" class="recipe-hero__img">
</picture>`;const[n,r]=a,s=' sizes="100vw"';return`<picture class="recipe-hero__picture">
  <source srcset="${g(L(i,n))}"${s} type="image/avif">
  <source srcset="${g(L(o,n))}"${s} type="image/webp">
  <img src="${g(o)}" srcset="${g(L(o,n))}"${s} width="${n}" height="${r}" alt="${g(t)}" class="recipe-hero__img">
</picture>`}function Ze(e){return e.replace(/class="([^"]*)"/g,(t,i)=>`class="${i.split(/\s+/).filter(a=>a&&a!=="reveal"&&!/^reveal-delay-\d$/.test(a)).join(" ")}"`)}function Je(e,{base:t,categoryDir:i,interattivo:o=!0}){const a={base:t,interattivo:o,emoji:(c,p)=>w(t,c,p),testoStep:c=>o?Fe(l(c)):l(qe(c))},n=Se(t,e.category,22),r=e.image?`${t}${String(e.image).replace(/^\//,"")}`:`${t}images/ricette/${i}/${e.slug}.webp`,s=We(e.imageAttribution,e._originalImageUrl),d=`
    <!-- ═══════════ RECIPE HERO ═══════════ -->
    ${s?'<figure class="recipe-foto">':""}
    <div class="recipe-hero" data-ricetta="${g(i)}/${g(e.slug)}">
      ${Qe(r,e.title)}
      <div class="container">
        <nav class="breadcrumb reveal">
          <a href="${t}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${t}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${g(t)}ricette/${g(i)}/" data-link>${l(e.category)}</a>
          <span class="breadcrumb__separator">›</span>
          <span>${l(e.title)}</span>
        </nav>

        <div class="recipe-hero__content">
          <div class="recipe-hero__tags reveal">
            <span class="tag tag--category">${n} ${l(e.category)}</span>
          </div>
          <h1 class="recipe-hero__title reveal reveal-delay-1">${l(e.title)}</h1>
          <p class="recipe-hero__subtitle reveal reveal-delay-2">${l(e.subtitle||e.description)}</p>
        </div>
      </div>
    </div>
    ${s?`<figcaption class="recipe-foto__credito"><div class="container">${s}</div></figcaption></figure>`:""}

    <!-- ═══════════ TECH BADGES ═══════════ -->
    <div class="container" style="padding-top: 40px;">
      <div class="tech-badges reveal">
        ${E(e.hydration)?`<div class="tech-badge">${a.emoji("droplet",18)} Idratazione: <span class="tech-badge__value">&nbsp;${l(e.hydration)}%</span></div>`:""}
        ${E(e.targetTemp)?`<div class="tech-badge">${a.emoji("thermometer",18)} Target Temp: <span class="tech-badge__value">&nbsp;${l(e.targetTemp)}</span></div>`:""}
        ${E(e.fermentation)?`<div class="tech-badge">${a.emoji("stopwatch",18)} Lievitazione: <span class="tech-badge__value">&nbsp;${l(e.fermentation)}</span></div>`:""}
        ${o?'<button class="made-toggle" id="made-toggle" type="button" aria-pressed="false"></button>':""}
      </div>
    </div>

    <!-- ═══════════ RECIPE CONTENT ═══════════ -->
    <section class="recipe-content" id="recipe-content">
      <div class="container">
        <div class="recipe-layout">

          <!-- COLONNA SX: Ingredienti -->
          <div>
            ${tt(e,a)}
            ${e.suspensions?.length?it(e,a):""}
          </div>

          <!-- COLONNA DX: Procedimento -->
          <div>
            ${ot(e,a)}
            ${at(e,a)}
          </div>

        </div>

        ${rt(e,a)}
        ${nt(e,a)}
        ${st(e,a)}
        ${ct(e,a)}
        ${lt(e,a)}
        ${dt(e,a)}
        ${pt(e,a)}
      </div>
    </section>
  `;return o?d:Ze(d)}function Q(e){return`<tr${e.excludeFromTotal?' data-exclude-total="true"':""}>
    <th scope="row">${l(e.name)} ${e.note?`<span class="ingredient-note">${l(e.note)}</span>`:""}</th>
    <td class="ingredient-qty">${e.grams!=null?`${l(e.grams)}g`:""}</td>
  </tr>`}function Ke(e){const i=(e.ingredientGroups?.length?e.ingredientGroups.flatMap(o=>o.items||[]):e.ingredients||[]).filter(o=>o&&!o.excludeFromTotal&&typeof o.grams=="number").reduce((o,a)=>o+a.grams,0);return i<=0?"":i>=1e3?`~${(i/1e3).toFixed(1)}kg`:`${Math.round(i)}g`}function et(e){return E(e.hydration)?"Peso Totale Impasto":"Peso Totale"}function tt(e,t){const i=e.ingredientGroups?.length>0,o=e.ingredients?.length>0;if(!i&&!o)return"";let a;i?a=e.ingredientGroups.map(r=>{if(!r.items?.length)return"";const s=`<tr class="ingredient-section-header"><th colspan="2" scope="colgroup">${l(r.group||"Ingredienti")}</th></tr>`,d=r.items.map(Q).join("");return s+d}).join(""):a=e.ingredients.map(Q).join("");const n=t.interattivo?`
      <div class="dose-calculator" id="dose-calculator">
        <div class="dose-calculator__label">
          <span class="dose-calculator__label-icon">${t.emoji("balance-scale",18)}</span> Dosi
        </div>
        <div class="dose-calculator__controls">
          <button class="dose-calculator__btn" id="dose-decrease" aria-label="Diminuisci dosi">−</button>
          <div class="dose-calculator__display" id="dose-badge">×1</div>
          <button class="dose-calculator__btn" id="dose-increase" aria-label="Aumenta dosi">+</button>
        </div>
      </div>`:"";return`
    <div class="recipe-panel reveal">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("shopping-cart",24)}</span> Ingredienti Base
      </h2>
      ${n}
      <table class="ingredients-table" id="ingredients-table" aria-label="Ingredienti e quantità">
        ${a}
        <tr class="ingredient-total-row" id="ingredient-total-row">
          <th scope="row">${et(e)}</th>
          <td class="ingredient-qty" id="ingredient-total-qty">${t.interattivo?"":Ke(e)}</td>
        </tr>
      </table>
    </div>`}function it(e,t){const i=e.suspensions.map(o=>`
    <tr>
      <th scope="row">${l(o.name)} ${o.note?`<span class="ingredient-note">${l(o.note)}</span>`:""}</th>
      <td class="ingredient-qty">${o.grams!=null?`${l(o.grams)}g`:""}</td>
    </tr>
  `).join("");return`
    <div class="recipe-panel reveal" style="margin-top: 24px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("peanuts",24)}</span> Ingredienti Aggiuntivi / Sospensioni
      </h2>
      <table class="ingredients-table" id="suspensions-table" aria-label="Ingredienti aggiuntivi e quantità">${i}</table>
    </div>`}function ot(e,t){const i=e.steps;return i?.length?`
    <div class="recipe-panel reveal reveal-delay-1" id="steps-panel">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("gear",24)}</span> Procedimento
      </h2>
      <ol class="steps-list">
        ${i.map(o=>`<li class="step-item">
            <strong>${l(o.title)}</strong>
            <p>${t.testoStep(o.text)}</p>
          </li>`).join("")}
      </ol>
    </div>`:""}function at(e,t){const i=e.stepsCondiment;return i?.length?`
    <div class="recipe-panel reveal reveal-delay-2" id="steps-condimento" style="margin-top: 32px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("tomato",24)}</span> Preparazione Condimento
      </h2>
      <ol class="steps-list">
        ${i.map(o=>`<li class="step-item">
            <strong>${l(o.title)}</strong>
            <p>${t.testoStep(o.text)}</p>
          </li>`).join("")}
      </ol>
    </div>`:""}function rt(e,t){if(!e.sensoryProfile||!e.sensoryProfile.axes||e.sensoryProfile.axes.length===0)return"";const i=e.sensoryProfile.axes.reduce((r,s)=>s.value>r.value?s:r,e.sensoryProfile.axes[0]),o=e.sensoryProfile.summary?`
    <div class="sensory-note">
      <h3 class="sensory-note__title">Note di Degustazione</h3>
      <p class="sensory-note__text">"${l(e.sensoryProfile.summary)}"</p>
    </div>
  `:"";let a="";if(e.nutrition&&e.nutrition.macros){const r=Number(e.nutrition.macros.carbs)||0,s=Number(e.nutrition.macros.protein)||0,d=Number(e.nutrition.macros.fat)||0,c=r+s+d,p=c>0?r/c*100:0,h=c>0?s/c*100:0,_=c>0?d/c*100:0,b=`
        <div class="nutrition-content">
          <div class="nutrition-kcal">
              <span class="nutrition-kcal__value">${l(e.nutrition.kcal_per_100g)}</span>
              <span class="nutrition-kcal__unit">Kcal</span>
          </div>

          <div class="nutrition-bar">
            <div class="nutrition-bar__segment nutrition-bar__segment--carbs" style="width: ${p}%;" title="Carboidrati"></div>
            <div class="nutrition-bar__segment nutrition-bar__segment--prot" style="width: ${h}%;" title="Proteine"></div>
            <div class="nutrition-bar__segment nutrition-bar__segment--fat" style="width: ${_}%;" title="Grassi"></div>
          </div>

          <div class="nutrition-legend">
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--carbs"></div>
              <span>Carboidrati <strong>${r}g</strong></span>
            </div>
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--prot"></div>
              <span>Proteine <strong>${s}g</strong></span>
            </div>
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--fat"></div>
              <span>Grassi <strong>${d}g</strong></span>
            </div>
          </div>

          <p class="nutrition-disclaimer">
            <em>Disclaimer: Valori medi per 100 g di prodotto finito, stimati sugli ingredienti della ricetta. Considerano il calo peso da evaporazione. I valori effettivi possono variare in base ai marchi commerciali usati.</em>
          </p>
        </div>`;a=t.interattivo?`
      <details class="nutrition-toggle">
        <summary class="nutrition-toggle__btn">
          <i data-lucide="microscope" class="nutrition-toggle__icon"></i> Analisi Nutrizionale
        </summary>
${b}
      </details>
      `:`
      <h3 class="sensory-note__title">Analisi Nutrizionale</h3>
${b}`}const n=e.sensoryProfile.axes.map(r=>`<tr><th scope="row">${l(r.label)}</th><td>${l(r.value)} su 10</td></tr>`).join("");return t.interattivo?`
    <div class="recipe-panel sensory-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <button type="button" class="sensory-panel__header" id="sensory-header"
                aria-expanded="false" aria-controls="sensory-chart-container">
          <span><span class="recipe-panel__title-icon">${t.emoji("star",24)}</span> Dati Tecnici & Sensoriali</span>
          <i data-lucide="chevron-down" class="sensory-chevron" aria-hidden="true"></i>
        </button>
      </h2>
      <div class="sensory-chart-container" id="sensory-chart-container" style="display:none;">

        <div class="sensory-dominant">
          <span class="sensory-dominant__badge">
            👑 Tratto Dominante: ${l(i.label)} (${l(i.value)}/10)
          </span>
        </div>

        <div class="sensory-canvas-wrap">
          <canvas id="sensoryChart" aria-hidden="true"></canvas>
          <table class="solo-lettore" aria-label="Profilo sensoriale, in scala da 1 a 10">
            <tbody>${n}</tbody>
          </table>
        </div>

        ${o}
        ${a}

      </div>
    </div>
  `:`
    <div class="recipe-panel sensory-panel recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span><span class="recipe-panel__title-icon">${t.emoji("star",24)}</span> Dati Tecnici & Sensoriali</span>
      </h2>
      <div class="sensory-dominant">
        <span class="sensory-dominant__badge">
          👑 Tratto Dominante: ${l(i.label)} (${l(i.value)}/10)
        </span>
      </div>
      <table class="ingredients-table" aria-label="Profilo sensoriale, in scala da 1 a 10">
        <tbody>${n}</tbody>
      </table>
      ${o}
      ${a}
    </div>`}function nt(e,t){return e.flourTable?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("flatbread",24)}</span> Consigli Farine & Marchi
      </h2>
      <table class="flour-table">
        <thead><tr><th>Tipo Farina</th><th>Forza (W)</th><th>Marchi Consigliati</th></tr></thead>
        <tbody>
          ${e.flourTable.map(i=>`
            <tr>
              <td>${l(i.type)}</td>
              <td class="flour-table__w">${l(i.w||"-")}</td>
              <td>${l(i.brands||"")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="pro-tip-box">
        <p><strong>${t.emoji("light-bulb",18)} PRO TIP:</strong> La forza (W) è il parametro chiave. Se non trovi i marchi suggeriti, cerca qualsiasi farina con il valore W indicato.</p>
      </div>
    </div>`:""}function st(e,t){return e.alert?`
    <div class="alert alert--danger reveal recipe-panel--spaced">
      <span class="alert__icon">${t.emoji("prohibited",28)}</span>
      <div class="alert__content">
        <strong>ALERT PROFESSIONALE</strong>
        <p>${t.emoji("warning",18)} ${l(e.alert)}</p>
      </div>
    </div>`:""}function ct(e,t){if(!e.baking)return"";const i=e.baking;return`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("fire",24)}</span> Cottura
      </h2>
      <div class="tech-badges">
        ${i.temperature?`<div class="tech-badge">${t.emoji("thermometer",18)} Temperatura: <span class="tech-badge__value">&nbsp;${l(i.temperature)}</span></div>`:""}
        ${i.time?`<div class="tech-badge">${t.emoji("stopwatch",18)} Tempo: <span class="tech-badge__value">&nbsp;${l(i.time)}</span></div>`:""}
      </div>
      ${i.tips?.length?`<ul class="tip-list">
        ${i.tips.map(o=>`<li class="tip-item">${t.emoji("light-bulb",16)} ${l(o)}</li>`).join("")}
      </ul>`:""}
    </div>`}function lt(e,t){return e.proTips?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("light-bulb",24)}</span> Pro Tips
      </h2>
      <ul class="tip-list">
        ${e.proTips.map(i=>`<li class="tip-item">${t.emoji("light-bulb",16)} ${l(i)}</li>`).join("")}
      </ul>
    </div>`:""}function dt(e,t){return e.storage?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("package",24)}</span> Conservazione
      </h2>
      <ul class="tip-list">
        ${e.storage.map(i=>`<li class="tip-item">${t.emoji("package",16)} ${l(i)}</li>`).join("")}
      </ul>
    </div>`:""}function pt(e,t){return e.glossary?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("open-book",24)}</span> Glossario
      </h2>
      <dl class="glossary-list">
        ${e.glossary.map(i=>`
          <dt class="glossary-term">${l(i.term)}</dt>
          <dd class="glossary-def">${l(i.definition)}</dd>
        `).join("")}
      </dl>
    </div>`:""}async function gt(e,{category:t,slug:i},{primoCaricamento:o=!1}={}){const a=o&&e.querySelector(".recipe-hero[data-ricetta]")?.getAttribute("data-ricetta")===`${t}/${i}`;a||(e.innerHTML=`
      <div class="recipe-loading">
        <div class="recipe-loading__spinner"></div>
        <p>Caricamento ricetta...</p>
      </div>`);const n=window.location.pathname;let r=!1;try{const s=`${f}ricette/${t}/${i}.json`,d=await fetch(s);if(r=d.status===404,!d.ok)throw new Error(`HTTP ${d.status} su ${s}`);const c=await d.json();if(window.location.pathname!==n)return;document.title=`${c.title} — Ricettario Lab`;const p=document.querySelector('meta[name="description"]');p&&p.setAttribute("content",c.description||""),e.innerHTML=Je(c,{base:f,categoryDir:t,interattivo:!0}),ut(c),Pe(c.slug),ht(c),S()}catch(s){if(console.error(`Ricetta ${t}/${i} non caricata:`,s),window.location.pathname!==n)return;if(a){document.getElementById("recipe-content")?.insertAdjacentHTML("beforebegin",`
        <div class="container">
          <div class="alert alert--danger" role="alert">
            <span class="alert__icon">${F("warning",28)}</span>
            <div class="alert__content">
              <strong>La versione interattiva non si è caricata</strong>
              <p>La ricetta è completa e leggibile, ma il calcolatore dosi e il pulsante «Fatta» non sono attivi. Controlla la connessione e ricarica la pagina per riprovare.</p>
            </div>
          </div>
        </div>`);return}const d=te[t];O(e,{base:f,titolo:r?"Ricetta non trovata":"Ricetta non caricata",dettaglio:r?`Non c'è nessuna ricetta all'indirizzo «${t}/${i}». Può essere un refuso, o una ricetta che è stata spostata.`:"Il caricamento non è riuscito. Controlla la connessione e riprova.",uscite:d&&[{href:`${f}ricette/${t}/`,testo:`Vedi le ricette di ${d.name}`},{href:f,testo:"Torna alla home"}]})}}function ut(e){const t=document.getElementById("dose-badge"),i=document.getElementById("dose-decrease"),o=document.getElementById("dose-increase");if(!t||!i||!o)return;const a=.25,n=.25;let r=1;const s=[],d=e.ingredientGroups?.length?e.ingredientGroups.flatMap(m=>m.items||[]):e.ingredients||[],c=["ingredients-table","suspensions-table"],p=[d,e.suspensions||[]];c.forEach((m,y)=>{const $=document.getElementById(m);if(!$)return;const v=$.querySelectorAll("tr:not(.ingredient-section-header)"),z=p[y];let C=0;for(const I of z){if(I.grams==null)continue;if(C>=v.length)break;const P=v[C]?.querySelector(".ingredient-qty");P&&s.push({baseGrams:I.grams,cell:P}),C++}});const h=m=>m===0?"0g":m>=10?`${Math.round(m)}g`:m>=1?`${Math.round(m*10)/10}g`:`${Math.round(m*100)/100}g`,_=m=>{if(Number.isInteger(m))return`×${m}`;const y=Math.round(m*10)/10;return Math.abs(m-y)<.001?`×${y.toFixed(1)}`:`×${m.toFixed(2)}`},b=()=>ee(`Dosi ${_(r).replace(".",",")}`),x=()=>{t.textContent=_(r),t.classList.toggle("dose-calculator__display--modified",r!==1);const m=r<=n;m&&document.activeElement===i&&(o.disabled?(t.setAttribute("tabindex","-1"),t.focus()):o.focus()),i.disabled=m,s.forEach(({baseGrams:y,cell:$})=>{const v=$.getAttribute("data-base"),z=v!==null?parseFloat(v):y;$.textContent=h(z*r),$.getAnimations().forEach(C=>C.cancel()),$.classList.remove("dose-updated"),requestAnimationFrame(()=>$.classList.add("dose-updated"))}),document.querySelectorAll(".dose-inline:not([data-fixed])").forEach(y=>{const $=parseFloat(y.getAttribute("data-base"));isNaN($)||(y.textContent=N($*r),y.getAnimations().forEach(v=>v.cancel()),y.classList.remove("dose-updated"),requestAnimationFrame(()=>y.classList.add("dose-updated")))}),mt()};i.addEventListener("click",()=>{const m=Math.round((r-a)*100)/100;m>=n&&(r=m,x(),b())}),o.addEventListener("click",()=>{r=Math.round((r+a)*100)/100,x(),b()}),x()}function mt(){const e=document.getElementById("ingredient-total-qty");if(!e)return;let t=0;const i=document.getElementById("ingredients-table");if(!i)return;i.querySelectorAll("tr:not(.ingredient-section-header):not(.ingredient-total-row):not([data-exclude-total]) .ingredient-qty").forEach(a=>{const n=a.textContent.trim(),r=parseFloat(n);isNaN(r)||(t+=r)});const o=t>=1e3?`~${(t/1e3).toFixed(1)}kg`:`${Math.round(t)}g`;e.textContent=o,e.classList.remove("dose-updated"),e.offsetWidth,e.classList.add("dose-updated")}let D=null;function ht(e){const t=document.getElementById("sensory-header");if(!t)return;const i=document.getElementById("sensory-chart-container");if(!i)return;const o=()=>t.querySelector(".sensory-chevron"),a=e.sensoryProfile?.axes;if(!a?.length)return;const n={labels:a.map(s=>s.label),values:a.map(s=>s.value)};let r=null;t.addEventListener("click",async()=>{const s=i.style.display==="none"||!i.style.display;if(t.setAttribute("aria-expanded",String(s)),s){if(i.style.display="block",o()?.style.setProperty("transform","rotate(180deg)"),!D)try{const{Chart:v,RadarController:z,RadialLinearScale:C,PointElement:I,LineElement:P,Filler:he,Tooltip:fe}=await q(async()=>{const{Chart:_e,RadarController:ve,RadialLinearScale:be,PointElement:ye,LineElement:$e,Filler:we,Tooltip:xe}=await import("./chart-Cns13J0s.js");return{Chart:_e,RadarController:ve,RadialLinearScale:be,PointElement:ye,LineElement:$e,Filler:we,Tooltip:xe}},[]);v.register(z,C,I,P,he,fe),D=v}catch(v){console.error("Errore caricamento Chart.js:",v);return}r&&(r.destroy(),r=null);const d=document.getElementById("sensoryChart")?.getContext("2d");if(!d)return;const{labels:c,values:p}=n,h=window.innerWidth<600,_=c.map(v=>h&&v.includes(" ")?v.split(" "):v),b=document.documentElement.getAttribute("data-theme")==="dark",x=b?"rgba(212, 165, 116, 0.8)":"rgba(184, 129, 58, 0.8)",m=b?"rgba(212, 165, 116, 0.2)":"rgba(184, 129, 58, 0.2)",y=b?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.1)",$=b?"#94a3b8":"#64748b";r=new D(d,{type:"radar",data:{labels:_,datasets:[{label:"Valore",data:p,backgroundColor:m,borderColor:x,pointBackgroundColor:x,pointBorderColor:"#fff",pointHoverBackgroundColor:"#fff",pointHoverBorderColor:x,borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!0,layout:{padding:h?10:20},scales:{r:{min:0,max:10,angleLines:{color:y},grid:{color:y},pointLabels:{color:$,font:{family:"Inter",size:h?10:12,weight:"500"}},ticks:{display:!1,stepSize:2}}},plugins:{legend:{display:!1},tooltip:{backgroundColor:b?"#1e293b":"#fff",titleColor:b?"#f8fafc":"#0f172a",bodyColor:b?"#cbd5e1":"#475569",borderColor:b?"#334155":"#e2e8f0",borderWidth:1,padding:10,displayColors:!1,callbacks:{label:v=>v.formattedValue+" / 10"}}}}})}else i.style.display="none",o()?.style.setProperty("transform","rotate(0deg)")})}function ft(){return`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="-14 -16 52 80" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="gi1b" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stop-color="#F5DDB0" />
          <stop offset="30%" stop-color="#D4A560" />
          <stop offset="65%" stop-color="#B8813A" />
          <stop offset="100%" stop-color="#8B5E2A" />
        </linearGradient>
        <linearGradient id="gi3b" x1="0.2" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="#FFF8E8" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#E8C89E" stop-opacity="0" />
        </linearGradient>
        <linearGradient id="gi2b" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stop-color="#B8935C" />
          <stop offset="50%" stop-color="#8B6B3C" />
          <stop offset="100%" stop-color="#5C3D18" />
        </linearGradient>
        <filter id="gisb" x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0.2" dy="0.4" stdDeviation="0.35" flood-color="#5C3310" flood-opacity="0.25"/>
        </filter>
      </defs>

      <!-- ═══════════════════════════════════════════════════
           COMPOSIZIONE ASIMMETRICA NATURALE
           Ordine di rendering (back → front):
           1. Stelo 3 (piccolo, SX, sfondo)
           2. Stelo 2 (medio, centro, piano medio)
           3. Stelo 1 (grande, DX, primo piano — protagonista)
           4. Chicchi sparsi nel vento
           ═══════════════════════════════════════════════════ -->

      <!-- ══════════════════════════════════════
           STELO 3 — Piccolo, SX, curva a sinistra
           Altezza: ~40% | Opacity: 0.65
           3 coppie chicchi, stelo sottile
           ══════════════════════════════════════ -->
      <g opacity="0.65">
        <path class="logo-intro__stelo"
          d="M3 56 C1 50, -2 45, -4 41
             C-5.5 38, -6.5 35, -7.5 32
             C-8 30, -8.5 28, -9 26"
          stroke="url(#gi2b)" stroke-width="0.9" stroke-linecap="round" fill="none" />
        <path class="logo-intro__ramo"
          d="M2.5 53 C0 52, -2.5 52, -4.5 53"
          stroke="#7A5A30" stroke-width="0.55" stroke-linecap="round" fill="none" />

        <!-- Coppia 1 (basso) -->
        <ellipse class="logo-intro__chicco" cx="-1.5" cy="44.5" rx="2.2" ry="1.3" transform="rotate(-42 -1.5 44.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco" cx="2" cy="43.5" rx="2.0" ry="1.2" transform="rotate(25 2 43.5)" fill="url(#gi1b)" />
        <!-- Coppia 2 -->
        <ellipse class="logo-intro__chicco" cx="-4" cy="39.5" rx="1.9" ry="1.15" transform="rotate(-38 -4 39.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco" cx="-0.5" cy="38.5" rx="1.7" ry="1.05" transform="rotate(22 -0.5 38.5)" fill="url(#gi1b)" />
        <!-- Coppia 3 -->
        <ellipse class="logo-intro__chicco" cx="-6" cy="34.5" rx="1.6" ry="1.0" transform="rotate(-35 -6 34.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco" cx="-3" cy="33.5" rx="1.4" ry="0.9" transform="rotate(18 -3 33.5)" fill="url(#gi1b)" />
        <!-- Apice -->
        <ellipse class="logo-intro__chicco" cx="-7.5" cy="29.5" rx="1.2" ry="0.85" transform="rotate(-28 -7.5 29.5)" fill="url(#gi1b)" />

        <!-- Ariste corte verso SX-alto -->
        <path class="logo-intro__arista" d="M-8.5 27 C-9.5 24, -10 21, -10.5 18" stroke="#A8774A" stroke-width="0.3" stroke-linecap="round" fill="none" />
        <path class="logo-intro__arista" d="M-8 28 C-6.5 25, -5.5 22, -5 19" stroke="#A8774A" stroke-width="0.3" stroke-linecap="round" fill="none" />
      </g>

      <!-- ══════════════════════════════════════
           STELO 2 — Medio, centro-SX, quasi verticale
           Altezza: ~65% | Opacity: 0.82
           5 coppie chicchi, stelo medio
           ══════════════════════════════════════ -->
      <g opacity="0.82">
        <path class="logo-intro__stelo"
          d="M4.5 56 C4 50, 3.5 44, 3 38
             C2.5 32, 2 26, 1.8 20
             C1.6 17, 1.5 14, 1.5 11"
          stroke="url(#gi2b)" stroke-width="1.2" stroke-linecap="round" fill="none" />
        <path class="logo-intro__ramo"
          d="M4 52 C2 50.5, -0.5 50.5, -3 51.5"
          stroke="#7A5A30" stroke-width="0.7" stroke-linecap="round" fill="none" />
        <path class="logo-intro__ramo"
          d="M4.5 49 C6 48, 8 48, 9.5 48.5"
          stroke="#7A5A30" stroke-width="0.6" stroke-linecap="round" fill="none" />

        <!-- Coppia 1 (basso) -->
        <g filter="url(#gisb)">
          <ellipse class="logo-intro__chicco" cx="0.5" cy="40.5" rx="2.8" ry="1.55" transform="rotate(-35 0.5 40.5)" fill="url(#gi1b)" />
          <ellipse class="logo-intro__chicco" cx="5.8" cy="39.5" rx="2.5" ry="1.5" transform="rotate(24 5.8 39.5)" fill="url(#gi1b)" />
        </g>
        <!-- Coppia 2 -->
        <g filter="url(#gisb)">
          <ellipse class="logo-intro__chicco" cx="0" cy="35" rx="2.5" ry="1.4" transform="rotate(-30 0 35)" fill="url(#gi1b)" />
          <ellipse class="logo-intro__chicco" cx="5" cy="34" rx="2.3" ry="1.35" transform="rotate(20 5 34)" fill="url(#gi1b)" />
        </g>
        <!-- Coppia 3 -->
        <g filter="url(#gisb)">
          <ellipse class="logo-intro__chicco" cx="-0.3" cy="29.5" rx="2.2" ry="1.3" transform="rotate(-26 -0.3 29.5)" fill="url(#gi1b)" />
          <ellipse class="logo-intro__chicco" cx="4.3" cy="28.5" rx="2.1" ry="1.2" transform="rotate(16 4.3 28.5)" fill="url(#gi1b)" />
        </g>
        <!-- Coppia 4 -->
        <g filter="url(#gisb)">
          <ellipse class="logo-intro__chicco" cx="-0.5" cy="24" rx="1.8" ry="1.1" transform="rotate(-20 -0.5 24)" fill="url(#gi1b)" />
          <ellipse class="logo-intro__chicco" cx="3.8" cy="23" rx="1.9" ry="1.05" transform="rotate(12 3.8 23)" fill="url(#gi1b)" />
        </g>
        <!-- Coppia 5 -->
        <g filter="url(#gisb)">
          <ellipse class="logo-intro__chicco" cx="-0.3" cy="19" rx="1.5" ry="0.95" transform="rotate(-14 -0.3 19)" fill="url(#gi1b)" />
          <ellipse class="logo-intro__chicco" cx="3.3" cy="18" rx="1.6" ry="0.9" transform="rotate(8 3.3 18)" fill="url(#gi1b)" />
        </g>
        <!-- Apice -->
        <g filter="url(#gisb)">
          <ellipse class="logo-intro__chicco logo-intro__chicco--top" cx="1.5" cy="14" rx="1.2" ry="0.9" transform="rotate(-4 1.5 14)" fill="url(#gi1b)" />
        </g>

        <!-- Ariste medie verso l'alto -->
        <path class="logo-intro__arista" d="M1.5 12 C1 9, 0 5, -1 2" stroke="#B8875A" stroke-width="0.45" stroke-linecap="round" fill="none" />
        <path class="logo-intro__arista" d="M2 13 C3 10, 4.5 7, 5.5 4" stroke="#B8875A" stroke-width="0.45" stroke-linecap="round" fill="none" />
        <path class="logo-intro__arista" d="M-0.2 18 C-1.5 15, -2.5 12, -3.5 9" stroke="#9A6D40" stroke-width="0.35" stroke-linecap="round" fill="none" opacity="0.55" />
      </g>

      <!-- ══════════════════════════════════════════════════
           STELO 1 — Principale/Protagonista, DX, arco pronunciato
           Altezza: 100% | Opacity: 1.0 (primo piano)
           7 coppie chicchi con highlight, stelo pieno
           ══════════════════════════════════════════════════ -->

      <!-- Stelo — arco da basso-SX ad alto-DX -->
      <path class="logo-intro__stelo"
        d="M6 57 C6 52, 6.5 46, 7 40
           C7.5 34, 8.5 28, 11 22
           C13.5 16, 16 10, 20 4
           C22 0, 23.5 -3, 25 -7"
        stroke="url(#gi2b)" stroke-width="1.5" stroke-linecap="round" fill="none" />
      <!-- Foglia basale SX -->
      <path class="logo-intro__ramo logo-intro__ramo--1"
        d="M6.2 49 C4.5 47.5, 1 47, -2.5 48 C-4 48.5, -5 49.5, -5.5 50"
        stroke="#7A5A30" stroke-width="0.85" stroke-linecap="round" fill="none" />
      <!-- Foglia basale DX -->
      <path class="logo-intro__ramo logo-intro__ramo--2"
        d="M6.8 46 C8.5 44.5, 11 44, 13.5 44.8"
        stroke="#7A5A30" stroke-width="0.8" stroke-linecap="round" fill="none" />

      <!-- 7 coppie chicchi con highlight (premium) -->
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l1" cx="4.5" cy="38.5" rx="3.5" ry="1.9" transform="rotate(-40 4.5 38.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l1h" cx="3.9" cy="37.7" rx="2.0" ry="0.95" transform="rotate(-40 3.9 37.7)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r1" cx="9.8" cy="37" rx="3.3" ry="2.0" transform="rotate(30 9.8 37)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r1h" cx="10.2" cy="36.2" rx="1.9" ry="1.0" transform="rotate(30 10.2 36.2)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l2" cx="5.2" cy="33" rx="3.0" ry="1.8" transform="rotate(-36 5.2 33)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l2h" cx="4.7" cy="32.3" rx="1.7" ry="0.85" transform="rotate(-36 4.7 32.3)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r2" cx="10.8" cy="31.5" rx="3.3" ry="1.85" transform="rotate(25 10.8 31.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r2h" cx="11.2" cy="30.8" rx="1.9" ry="0.9" transform="rotate(25 11.2 30.8)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l3" cx="6.5" cy="27.8" rx="3.1" ry="1.75" transform="rotate(-32 6.5 27.8)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l3h" cx="6.0" cy="27.1" rx="1.8" ry="0.8" transform="rotate(-32 6.0 27.1)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r3" cx="13.0" cy="26.2" rx="3.5" ry="1.9" transform="rotate(35 13.0 26.2)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r3h" cx="13.5" cy="25.4" rx="2.0" ry="0.9" transform="rotate(35 13.5 25.4)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l1" cx="8.5" cy="23" rx="2.8" ry="1.6" transform="rotate(-25 8.5 23)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l1h" cx="8.0" cy="22.4" rx="1.6" ry="0.78" transform="rotate(-25 8.0 22.4)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r1" cx="14.5" cy="21.5" rx="2.9" ry="1.7" transform="rotate(30 14.5 21.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r1h" cx="14.9" cy="20.8" rx="1.6" ry="0.82" transform="rotate(30 14.9 20.8)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l2" cx="10.5" cy="18.2" rx="2.6" ry="1.5" transform="rotate(-18 10.5 18.2)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l2h" cx="10.1" cy="17.6" rx="1.4" ry="0.72" transform="rotate(-18 10.1 17.6)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r2" cx="15.8" cy="16.5" rx="2.8" ry="1.5" transform="rotate(38 15.8 16.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r2h" cx="16.2" cy="15.8" rx="1.5" ry="0.7" transform="rotate(38 16.2 15.8)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l3" cx="13.0" cy="13.5" rx="2.3" ry="1.35" transform="rotate(-10 13.0 13.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l3h" cx="12.6" cy="13.0" rx="1.2" ry="0.6" transform="rotate(-10 12.6 13.0)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r3" cx="17.5" cy="11.5" rx="2.5" ry="1.3" transform="rotate(42 17.5 11.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r3h" cx="17.9" cy="10.8" rx="1.3" ry="0.62" transform="rotate(42 17.9 10.8)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--l1" cx="16.0" cy="8.5" rx="1.9" ry="1.15" transform="rotate(-2 16.0 8.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--l1h" cx="15.6" cy="8.0" rx="1.0" ry="0.52" transform="rotate(-2 15.6 8.0)" fill="url(#gi3b)" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--r1" cx="20.0" cy="6.5" rx="2.1" ry="1.1" transform="rotate(48 20.0 6.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--r1h" cx="20.5" cy="5.8" rx="1.1" ry="0.5" transform="rotate(48 20.5 5.8)" fill="url(#gi3b)" />
      </g>
      <!-- Chicco apice -->
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--top" cx="21.5" cy="2.5" rx="1.7" ry="1.4" transform="rotate(25 21.5 2.5)" fill="url(#gi1b)" />
        <ellipse class="logo-intro__chicco logo-intro__chicco--toph" cx="22.0" cy="1.9" rx="0.95" ry="0.65" transform="rotate(25 22.0 1.9)" fill="url(#gi3b)" />
      </g>

      <!-- Ariste protagonista — verso alto-DX -->
      <path class="logo-intro__arista logo-intro__arista--1" d="M22 1.5 C23 -1, 24.5 -4, 25 -8" stroke="#B8875A" stroke-width="0.65" stroke-linecap="round" fill="none" />
      <path class="logo-intro__arista logo-intro__arista--2" d="M22.5 2.5 C24.5 1, 27 -1, 29 -3" stroke="#B8875A" stroke-width="0.65" stroke-linecap="round" fill="none" />
      <path class="logo-intro__arista logo-intro__arista--1" d="M18 5 C19.5 2, 21 -1, 22 -4" stroke="#A8774A" stroke-width="0.5" stroke-linecap="round" fill="none" />
      <path class="logo-intro__arista logo-intro__arista--2" d="M20.5 4.5 C22.5 3, 25 1, 27 -1" stroke="#A8774A" stroke-width="0.5" stroke-linecap="round" fill="none" />
      <path class="logo-intro__arista logo-intro__arista--3" d="M15.5 10.5 C17 7.5, 18.5 4, 19.5 1" stroke="#9A6D40" stroke-width="0.4" stroke-linecap="round" fill="none" opacity="0.65" />
      <path class="logo-intro__arista logo-intro__arista--4" d="M18 9 C20 7, 22.5 4.5, 24 2" stroke="#9A6D40" stroke-width="0.4" stroke-linecap="round" fill="none" opacity="0.6" />

      <!-- ══════════════════════════════════════
           CHICCHI SPARSI — volano nel vento
           3 chicchi staccati, decrescente opacità
           Effetto "brezza" dalla punta dello stelo
           ══════════════════════════════════════ -->
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--sparso"
          cx="28" cy="0" rx="1.3" ry="0.85" transform="rotate(35 28 0)" fill="url(#gi1b)" opacity="0.6" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--sparso"
          cx="32" cy="7" rx="1.0" ry="0.6" transform="rotate(52 32 7)" fill="url(#gi1b)" opacity="0.42" />
      </g>
      <g filter="url(#gisb)">
        <ellipse class="logo-intro__chicco logo-intro__chicco--sparso"
          cx="26" cy="-7" rx="0.8" ry="0.5" transform="rotate(15 26 -7)" fill="url(#gi1b)" opacity="0.3" />
      </g>

    </svg>`}function _t(){return`
    <div class="logo-intro" id="logo-intro" aria-hidden="true" role="presentation">
      <!-- Phase 0: Ambient glow -->
      <div class="logo-intro__glow"></div>

      <!-- Concentric ring halos -->
      <div class="logo-intro__ring"></div>
      <div class="logo-intro__ring logo-intro__ring--outer"></div>

      <!-- Phase 8: Particle burst (12 particles) -->
      <div class="logo-intro__particles">
        ${Array.from({length:12},()=>'<div class="logo-intro__particle"></div>').join("")}
      </div>

      <!-- Phase 1-6: Logo SVG (Spiga Botanica V2B) -->
      <div class="logo-intro__logo logo-intro__logo--tall" id="logo-intro-logo">
        ${ft()}
      </div>

      <!-- Phase 7: Title text -->
      <div class="logo-intro__text">Il Ricettario</div>

      <!-- Phase 7b: Subtitle -->
      <div class="logo-intro__subtitle">Laboratorio Artigianale</div>
    </div>
  `}function vt(){if(sessionStorage.getItem("intro-shown"))return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){sessionStorage.setItem("intro-shown","1");return}q(()=>Promise.resolve({}),__vite__mapDeps([0]));const e=()=>{document.body.insertAdjacentHTML("afterbegin",_t()),bt(),sessionStorage.setItem("intro-shown","1")};document.body?e():document.addEventListener("DOMContentLoaded",e,{once:!0})}function bt(){const e=document.getElementById("logo-intro"),t=document.getElementById("logo-intro-logo");if(!e)return;document.documentElement.style.overflow="hidden";const i=setTimeout(()=>{t&&t.classList.add("glowing")},1700);e.addEventListener("animationend",o=>{o.animationName==="introOverlayOut"&&(document.documentElement.style.overflow="",e.classList.add("logo-intro--done"),requestAnimationFrame(()=>e.remove()),clearTimeout(i))}),setTimeout(()=>{document.getElementById("logo-intro")&&(document.documentElement.style.overflow="",e.remove())},5e3)}function pe(e,{base:t}){const i=`${t}ricette/${e.categoryDir}/${e.slug}/`,o=e.image?de(`${t}${e.image}`,"","category-card__image","lazy","(min-width: 640px) 368px, calc(100vw - 32px)"):"";return`
      <a href="${g(i)}" class="category-card" data-link
         data-title="${g((e.title||"").toLowerCase())}"
         data-hydration="${parseInt(e.hydration)||0}">
        <div class="category-card__image-wrapper">
          ${o}
          <div class="category-card__meta">
            ${E(e.hydration)?`<span class="category-card__tag">${w(t,"droplet",14)} ${l(e.hydration)}</span>`:""}
            ${E(e.time)?`<span class="category-card__tag">${w(t,"stopwatch",14)} ${l(e.time)}</span>`:""}
          </div>
        </div>
        <div class="category-card__body">
          <h2 class="category-card__title">${l(e.title)}</h2>
          ${e.description?`<p class="category-card__desc">${l(e.description)}</p>`:""}
        </div>
      </a>`}function yt(e){return Array.from({length:e},()=>`
    <div class="category-card category-card--skeleton">
      <div class="category-card__image-wrapper"></div>
      <div class="category-card__body">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
      </div>
    </div>`).join("")}function $t(e){const t=e.title;return{titoloBreve:t,titolo:`${t} — Ricettario Lab`,descrizione:e.desc}}function wt(e,t,{base:i,interattivo:o=!0,viewMode:a="grid"}){const r="⏳ Caricamento...",s=o?`
        <div class="category-toolbar" id="category-toolbar">
          <div class="category-toolbar__search">
            <span class="category-toolbar__search-icon"><i data-lucide="search" style="width:16px;height:16px"></i></span>
            <input type="text" class="category-toolbar__search-input" id="category-search"
              placeholder="Cerca tra le ricette di ${g(e.name.toLowerCase())}...">
          </div>
          <div class="category-toolbar__results" id="results-counter"></div>
          <div class="category-toolbar__sort">
            <button class="category-toolbar__sort-btn active" data-sort="az">A-Z</button>
            <button class="category-toolbar__sort-btn" data-sort="hydration">${w(i,"droplet",14)} Idratazione</button>
          </div>
          <div class="category-toolbar__views">
            <button class="view-toggle-btn ${a==="grid"?"active":""}" data-view="grid" aria-label="Vista griglia">
              <i data-lucide="grid-3x3" style="width:16px;height:16px"></i>
            </button>
            <button class="view-toggle-btn ${a==="list"?"active":""}" data-view="list" aria-label="Vista lista">
              <i data-lucide="list" style="width:16px;height:16px"></i>
            </button>
          </div>
        </div>`:"",d=o?yt(6):t.map(c=>pe(c,{base:i})).join("");return`
    <section class="category-hero" id="category-hero">
      <div class="category-hero__content">
        <h1 class="category-hero__title">${l(e.title)}</h1>
        <p class="category-hero__subtitle">${l(e.desc)}</p>
        <div class="category-hero__count" id="recipe-count">${r}</div>
      </div>
    </section>

    <!-- Qui ci vuole una "section", non un "main": il landmark principale è
         quello del guscio, che avvolge #app e sopravvive ai cambi di rotta.
         Uno annidato dentro l'altro è markup non valido. -->
    <section class="section">
      <div class="container">
        <nav class="breadcrumb">
          <a href="${i}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${i}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <span class="breadcrumb__current">${l(e.name)}</span>
        </nav>
        ${s}
        <div class="category-grid ${a==="list"?"category-grid--list":""}" id="category-grid">
          ${d}
        </div>

        ${o?'<div id="load-more-container"></div>':""}
      </div>
    </section>
  `}function xt(e,{base:t}){const i=`${t}ricette/${e.categoryDir}/${e.slug}/`,o=e.image?de(`${t}${e.image}`,"","recipe-card--compact__image","lazy","(min-width: 1200px) 290px, (min-width: 480px) 260px, 200px"):"";return`
          <a href="${g(i)}" class="recipe-card--compact" data-link data-title="${g((e.title||"").toLowerCase())}" data-category="${g(e.category)}">
            <div class="recipe-card--compact__image-wrapper">
              ${o}
            </div>
            <div class="recipe-card--compact__body">
              <h4 class="recipe-card--compact__title">${l(e.title)}</h4>
              <div class="recipe-card--compact__meta">
                ${E(e.hydration)?`<span class="recipe-card--compact__tag">${w(t,"droplet",16)} ${l(e.hydration)}</span>`:""}
                ${E(e.time)?`<span>${w(t,"stopwatch",16)} ${l(e.time)}</span>`:""}
              </div>
            </div>
          </a>`}function Et(e,t,i,o,{base:a}){return`
    <div class="category-row__header">
      <h3 class="category-row__title">
        ${w(a,t,32)} ${l(e)}
        <span class="category-row__count">${o.length} ricett${o.length===1?"a":"e"}</span>
      </h3>
      <a href="${g(`${a}ricette/${i}/`)}" class="category-row__link" data-link>Vedi tutte</a>
    </div>
    <div class="category-row__carousel-wrapper">
      <div class="category-row__carousel">
        ${o.map(n=>xt(n,{base:a})).join("")}
      </div>
    </div>
  `}const ge="?v=265c58b6";vt();document.addEventListener("DOMContentLoaded",()=>{Ct(),kt(),Lt();const e=document.getElementById("current-year");e&&(e.textContent=new Date().getFullYear()),S(),At(),Ae({home:Mt,recipe:gt,category:It,cottura:async(t,i)=>{const{renderCottura:o}=await q(async()=>{const{renderCottura:a}=await import("./pagina-Bx8tTPAz.js");return{renderCottura:a}},__vite__mapDeps([1,2]));return o(t,i)},nonTrovata:(t,{percorso:i}={})=>O(t,{base:f,dettaglio:i?`L'indirizzo «${i}» non corrisponde a nessuna pagina di questo sito.`:""})}),ze()});function Ct(){const e=document.getElementById("navbar");if(!e)return;const t=()=>e.classList.toggle("scrolled",window.scrollY>50);window.addEventListener("scroll",t,{passive:!0}),t()}function kt(){const e=document.getElementById("theme-toggle");e&&(e.addEventListener("click",()=>{const i=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";e.classList.add("theme-toggle--switching"),setTimeout(()=>e.classList.remove("theme-toggle--switching"),400),document.documentElement.setAttribute("data-theme",i),window.applicaColoreBarra?.(i),localStorage.setItem("theme",i)}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",t=>{if(!localStorage.getItem("theme")){const i=t.matches?"dark":"light";document.documentElement.setAttribute("data-theme",i),window.applicaColoreBarra?.(i)}}))}function Lt(){const e=document.getElementById("hamburger"),t=document.getElementById("nav-links");!e||!t||(e.addEventListener("click",()=>{e.classList.toggle("open"),t.classList.toggle("open")}),t.querySelectorAll("a").forEach(i=>{i.addEventListener("click",()=>{e.classList.remove("open"),t.classList.remove("open")})}),document.addEventListener("click",i=>{!e.contains(i.target)&&!t.contains(i.target)&&(e.classList.remove("open"),t.classList.remove("open"))}))}let k=null;function St(e){const t=new URL(f,window.location.origin),i=o=>!o||/^([a-z]+:|\/\/|\/|#)/i.test(o)?o:new URL(o,t).pathname;e.querySelectorAll("[src], [href], [srcset]").forEach(o=>{["src","href"].forEach(n=>{const r=o.getAttribute(n);r&&o.setAttribute(n,i(r))});const a=o.getAttribute("srcset");a&&o.setAttribute("srcset",a.split(",").map(n=>{const[r,...s]=n.trim().split(/\s+/);return[i(r),...s].join(" ")}).join(", "))})}function ue(e,t,i){const o=e.cloneNode(!0);return St(o),{html:o.innerHTML,title:t,description:i}}function At(){const e=document.getElementById("app");e?.querySelector("#ricette")&&(k=ue(e,document.title,document.querySelector('meta[name="description"]')?.getAttribute("content")||""))}async function zt(){if(k)return k;const e=await fetch(f),t=new DOMParser().parseFromString(await e.text(),"text/html"),i=t.getElementById("app");if(!i)throw new Error("index.html non contiene #app");return k=ue(i,t.title,t.querySelector('meta[name="description"]')?.getAttribute("content")||""),k}async function Mt(e){if(!e.querySelector("#ricette"))try{const i=await zt();e.innerHTML=i.html}catch(i){console.error("Impossibile ricostruire la homepage:",i),window.location.assign(f);return}const t=k;if(t){document.title=t.title;const i=document.querySelector('meta[name="description"]');i&&i.setAttribute("content",t.description)}S(),jt(),M()}const A=12,Tt=te;let u={allRecipes:[],filteredRecipes:[],displayedCount:A,viewMode:"grid",sortType:"az",searchQuery:"",categoryDir:""};async function It(e,{category:t}){const i=Tt[t];if(!i){O(e,{base:f,titolo:"Categoria non trovata",dettaglio:`La categoria «${t}» non esiste (o non esiste più).`});return}const o=$t(i);document.title=o.titolo;const a=document.querySelector('meta[name="description"]');a&&a.setAttribute("content",o.descrizione),u={allRecipes:[],filteredRecipes:[],displayedCount:A,viewMode:localStorage.getItem("catViewMode")||"grid",sortType:"az",searchQuery:"",categoryDir:t},e.innerHTML=wt(i,null,{base:f,interattivo:!0,viewMode:u.viewMode}),S();try{const r=await(await fetch(`${f}recipes.json${ge}`)).json();u.allRecipes=r.recipes.filter(c=>c.categoryDir===t||c.category===i.name),u.allRecipes.sort((c,p)=>(c.title||"").localeCompare(p.title||"","it")),u.filteredRecipes=[...u.allRecipes];const s=u.allRecipes.find(c=>c.image);if(s){const c=document.getElementById("category-hero");c&&(c.style.backgroundImage=`url('${f}${s.image}')`)}const d=document.getElementById("recipe-count");d&&(d.innerHTML=`${F("bullseye",16)} ${u.allRecipes.length} ricett${u.allRecipes.length===1?"a":"e"}`),R(),Pt(e),M(),T()}catch(n){console.error("Errore caricamento categoria:",n);const r=document.getElementById("category-grid");r&&(r.innerHTML=`<div class="category-empty"><div class="category-empty__icon">${F("prohibited",32)}</div><p>Errore nel caricamento delle ricette.</p></div>`)}}function Pt(e){const t=document.getElementById("category-search");let i;t&&t.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(()=>{u.searchQuery=t.value.toLowerCase().trim(),u.displayedCount=A,Z(),R()},150)});const o=e.querySelectorAll(".category-toolbar__sort-btn");o.forEach(n=>{n.addEventListener("click",()=>{o.forEach(r=>r.classList.remove("active")),n.classList.add("active"),u.sortType=n.dataset.sort,u.displayedCount=A,Z(),R()})});const a=e.querySelectorAll(".view-toggle-btn");a.forEach(n=>{n.addEventListener("click",()=>{a.forEach(s=>s.classList.remove("active")),n.classList.add("active"),u.viewMode=n.dataset.view,localStorage.setItem("catViewMode",u.viewMode);const r=document.getElementById("category-grid");r&&r.classList.toggle("category-grid--list",u.viewMode==="list")})})}function Z(){let e=[...u.allRecipes];u.searchQuery&&(e=e.filter(t=>{const i=(t.title||"").toLowerCase(),o=(t.description||"").toLowerCase();return i.includes(u.searchQuery)||o.includes(u.searchQuery)})),u.sortType==="az"?e.sort((t,i)=>(t.title||"").localeCompare(i.title||"","it")):u.sortType==="hydration"&&e.sort((t,i)=>(parseInt(i.hydration)||0)-(parseInt(t.hydration)||0)),u.filteredRecipes=e}function R(){const e=document.getElementById("category-grid"),t=document.getElementById("load-more-container");if(!e)return;const{filteredRecipes:i,displayedCount:o}=u,a=i.slice(0,o),n=i.length,r=document.getElementById("results-counter");if(r&&(u.searchQuery?r.innerHTML=`<strong>${n}</strong> risultat${n===1?"o":"i"}`:r.innerHTML=`<strong>${Math.min(o,n)}</strong> di <strong>${n}</strong>`),n===0){e.innerHTML=`
      <div class="category-empty" style="grid-column: 1 / -1">
        <div class="category-empty__icon"><i data-lucide="search" style="width:32px;height:32px"></i></div>
        <p>Nessuna ricetta trovata</p>
      </div>`,t&&(t.innerHTML=""),S();return}if(e.innerHTML=a.map(s=>pe(s,{base:f})).join(""),t)if(o<n){const s=n-o,d=Math.round(o/n*100);t.innerHTML=`
        <div class="load-more-wrapper">
          <button class="load-more-btn" id="load-more-btn">
            <span>Carica altre ${Math.min(s,A)} ricette</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="load-more-progress">${o} di ${n} ricette</div>
          <div class="load-more-bar"><div class="load-more-bar__fill" style="width: ${d}%"></div></div>
        </div>`,document.getElementById("load-more-btn")?.addEventListener("click",()=>{u.displayedCount+=A,R(),setTimeout(()=>{const p=e.querySelectorAll(".category-card")[o];p&&p.scrollIntoView({behavior:"smooth",block:"center"})},100),T()})}else t.innerHTML="";S(),T()}function J(e,t,i,o,a){const n=document.createElement("div");n.className="category-row reveal",n.dataset.category=t,n.innerHTML=Et(t,i,o,a,{base:f}),e.appendChild(n),me(n)}function me(e){if(e.dataset.attivo)return;e.dataset.attivo="1";const t=e.querySelector(".category-row__carousel"),i=e.querySelector(".category-row__carousel-wrapper");if(!t||!i)return;const o=(d,c,p)=>{const h=document.createElement("button");return h.className=`carousel-arrow ${d}`,h.setAttribute("aria-label",c),h.textContent=p,h},a=o("carousel-arrow--prev","Precedente","‹"),n=o("carousel-arrow--next","Successivo","›");i.insertBefore(a,t),i.appendChild(n);const r=276,s=()=>{const{scrollLeft:d,scrollWidth:c,clientWidth:p}=t;i.classList.toggle("has-scroll-left",d>10),i.classList.toggle("has-scroll-right",d<c-p-10),a.disabled=d<=10,n.disabled=d>=c-p-10};t.addEventListener("scroll",s,{passive:!0}),s(),new ResizeObserver(s).observe(t),a.addEventListener("click",()=>t.scrollBy({left:-r*3,behavior:"smooth"})),n.addEventListener("click",()=>t.scrollBy({left:r*3,behavior:"smooth"}))}function jt(){const e=document.getElementById("recipe-carousels");if(!e)return;const t=e.querySelectorAll(".category-row");if(t.length){t.forEach(me),M(),K(),T();return}const i=ke.map(o=>{const a=B[o];return{key:a.name,emoji:a.emoji,dir:a.dir}});fetch(`${f}recipes.json${ge}`).then(o=>o.json()).then(o=>{e.innerHTML="";const a={};o.recipes.forEach(r=>{a[r.category]||(a[r.category]=[]),a[r.category].push(r)}),i.forEach(r=>{const s=a[r.key];!s||s.length===0||J(e,r.key,r.emoji,r.dir,s)});const n=new Set(i.map(r=>r.key));Object.keys(a).forEach(r=>{if(n.has(r))return;const s=a[r];if(!s||s.length===0)return;const d=r.toLowerCase(),c=Oe[r]||"fork-and-knife";J(e,r,c,d,s)}),M(),K(),T()}).catch(o=>{console.error("Errore caricamento recipes.json:",o),e.innerHTML='<p style="text-align:center; color: var(--color-text-muted);">Errore nel caricamento delle ricette.</p>'})}function K(){const e=document.getElementById("search-input");e&&(e.addEventListener("input",()=>{const t=e.value.toLowerCase().trim(),i=document.querySelectorAll(".recipe-card--compact"),o=document.querySelectorAll(".category-row");i.forEach(a=>{const n=a.dataset.title||a.textContent.toLowerCase();a.classList.toggle("hidden",!!(t&&!n.includes(t)))}),o.forEach(a=>{const n=a.querySelectorAll(".recipe-card--compact:not(.hidden)");a.classList.toggle("hidden",n.length===0)})}),document.addEventListener("keydown",t=>{t.key==="/"&&document.activeElement!==e&&(t.preventDefault(),e.focus(),e.scrollIntoView({behavior:"smooth",block:"center"})),t.key==="Escape"&&document.activeElement===e&&(e.value="",e.dispatchEvent(new Event("input")),e.blur())}))}export{f as B,ee as a,l as e,O as m,j as n};
