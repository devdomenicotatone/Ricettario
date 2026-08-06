const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/logo-intro-DWh29O1b.css","assets/pagina-DJIr5fMk.js","assets/pagina-Dn7Q-bkn.css","assets/pagina-BpGdkdqe.js","assets/pagina-Bg4G0WnK.css"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function i(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(a){if(a.ep)return;a.ep=!0;const r=i(a);fetch(a.href,r)}})();const ke="modulepreload",Le=function(e){return"/Ricettario/"+e},G={},R=function(t,i,o){let a=Promise.resolve();if(i&&i.length>0){let n=function(c){return Promise.all(c.map(u=>Promise.resolve(u).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),d=s?.nonce||s?.getAttribute("nonce");a=n(i.map(c=>{if(c=Le(c),c in G)return;G[c]=!0;const u=c.endsWith(".css"),h=u?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${h}`))return;const _=document.createElement("link");if(_.rel=u?"stylesheet":ke,u||(_.as="script"),_.crossOrigin="",_.href=c,d&&_.setAttribute("nonce",d),document.head.appendChild(_),u)return new Promise((k,v)=>{_.addEventListener("load",k),_.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${c}`)))})}))}function r(n){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=n,window.dispatchEvent(s),!s.defaultPrevented)throw n}return a.then(n=>{for(const s of n||[])s.status==="rejected"&&r(s.reason);return t().catch(r)})};function ee(e){const t=document.getElementById("annuncio-pagina");!t||!e||(t.textContent="",setTimeout(()=>{t.textContent=e},100))}const O={pane:{name:"Pane",dir:"pane",emoji:"baguette-bread",unicode:"🥖",title:"Pane Artigianale",desc:"Ricette di pane ad alta idratazione — ciabatta, filone, baguette e pane speciale."},pizza:{name:"Pizza",dir:"pizza",emoji:"pizza",unicode:"🍕",title:"Pizza Artigianale",desc:"Pizze con lievitazione lunga — napoletana, in teglia, canotto e pinsa romana."},primi:{name:"Primi",dir:"primi",emoji:"tomato",unicode:"🥣",title:"Primi Piatti",desc:"Primi piatti della tradizione — gnocchi, polenta, zuppe e piatti unici caldi."},lievitati:{name:"Lievitati",dir:"lievitati",emoji:"croissant",unicode:"🥐",title:"Lievitati Dolci e Salati",desc:"Brioche, cornetti, panettone, burger buns e rosticceria."},focaccia:{name:"Focaccia",dir:"focaccia",emoji:"flatbread",unicode:"🫓",title:"Focaccia Artigianale",desc:"Focacce ad alta idratazione — genovese, barese, pugliese e varianti creative."},dolci:{name:"Dolci",dir:"dolci",emoji:"shortcake",unicode:"🍪",title:"Dolci e Pasticceria",desc:"Dolci tradizionali, frolle, biscotti e pasticceria artigianale."},conserve:{name:"Conserve",dir:"conserve",emoji:"canned-food",unicode:"🫙",title:"Conserve e Preparazioni",desc:"Conserve fatte in casa — dadi vegetali, salse, sottoli e preparazioni base."},condimenti:{name:"Condimenti",dir:"condimenti",emoji:"herb",unicode:"🌿",title:"Condimenti",desc:"Salse, pesti e condimenti artigianali per ogni piatto."},secondi_piatti:{name:"Secondi Piatti",dir:"secondi-piatti",emoji:"fork-and-knife",unicode:"🍲",title:"Secondi Piatti",desc:"Esplora ricette complete e saporite per i tuoi secondi piatti: carne, pesce, legumi e verdure."}},Se=["primi","pane","pizza","lievitati","dolci","focaccia","conserve","condimenti","secondi_piatti"],te=Object.fromEntries(Object.values(O).map(e=>[e.dir,e])),ie=Object.fromEntries(Object.values(O).map(e=>[e.name,e.emoji]));Object.values(O).map(e=>e.name);const Ae={"shopping-cart":"shopping-cart","balance-scale":"balance-scale",peanuts:"peanuts",gear:"gear","sheaf-of-rice":"flatbread",fire:"fire","light-bulb":"light-bulb","open-book":"open-book",prohibited:"prohibited",warning:"warning",droplet:"droplet",thermometer:"thermometer",stopwatch:"stopwatch",wrench:"wrench","baguette-bread":"baguette-bread",pizza:"pizza",spaghetti:"spaghetti",croissant:"croissant",cookie:"cookie",flatbread:"flatbread",shortcake:"shortcake","canned-food":"canned-food",herb:"herb","fork-and-knife":"fork-and-knife",star:"star",house:"house","high-voltage":"high-voltage",bullseye:"bullseye",package:"package",tomato:"tomato"};function C(e,t,i=20,o=""){const a=Ae[t]||t,r=`fluent-emoji${o?" "+o:""}`;return`<img src="${e}images/emoji/${a}.png" width="${i}" height="${i}" alt="" class="${r}" loading="lazy">`}function ze(e,t,i=20){const o=ie[t];return o?C(e,o,i):""}function l(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const p=l;function D(e,{base:t,titolo:i="Pagina non trovata",dettaglio:o="",uscite:a}={}){document.title=`${i} — Ricettario Lab`;const[r,...n]=a?.length?a:[{href:t,testo:"Torna alla home"},{href:`${t}#ricette`,testo:"Vedi tutte le ricette"}],s=(d,c="")=>`<a href="${l(d.href)}" data-link${c?` class="${c}"`:""}>${l(d.testo)}</a>`;e.innerHTML=`
    <div class="container" style="padding: 120px 0; text-align: center;">
      <h1>${C(t,"prohibited",28)} ${l(i)}</h1>
      ${o?`<p style="color: var(--color-text-muted);">${l(o)}</p>`:""}
      <p>${s(r,"btn-back")}</p>
      ${n.length?`<p>${n.map(d=>s(d)).join(" · ")}</p>`:""}
    </div>`}const f="/Ricettario/";let oe={};function Me(e){oe=e}function ae(e){let t=e.replace(f,"").replace(/^\/+|\/+$/g,"");if(!t||t==="index.html")return{type:"home",params:{}};const i=t.match(/^ricette\/([^/]+)\/([^/]+?)(?:\.html)?$/);if(i)return{type:"recipe",params:{category:i[1],slug:i[2]}};const o=t.match(/^ricette\/([^/]+)\/?$/);if(o)return{type:"category",params:{category:o[1]}};const a=t.match(/^cottura(?:\/([^/]+?))?(?:\.html)?$/);if(a)return{type:"cottura",params:{config:a[1]||null}};const r=t.match(/^strumenti(?:\/([^/]+?))?(?:\.html)?$/);return r?{type:"strumenti",params:{slug:r[1]||null}}:{type:"nonTrovata",params:{percorso:e}}}let V=!0;function U(){const e=document.getElementById("contenuto"),t=e?.querySelector("h1")||e;t&&(t.hasAttribute("tabindex")||t.setAttribute("tabindex","-1"),t.focus({preventScroll:!0}));const i=document.title.replace(/\s*[—-]\s*(Il )?Ricettario( Lab)?\s*$/i,"").trim();ee(i?`${i}, pagina caricata`:"Pagina caricata")}async function P(e,t=!0){const i=new URL(e,window.location.origin);t&&history.pushState(null,"",i.pathname+i.search);const o=ae(i.pathname),a=document.getElementById("app");if(!a)return;window.scrollTo(0,0);const r=V;if(V=!1,"startViewTransition"in document){const n=document.startViewTransition(async()=>{await W(o,a,r)});r||n.updateCallbackDone.then(U).catch(()=>{})}else await W(o,a,r),r||U()}async function W(e,t,i=!1){const o=oe[e.type];o?await o(t,e.params,{primoCaricamento:i}):D(t,{base:f}),I()}function I(){const e=document.querySelectorAll(".reveal:not(.visible)");if(e.length===0)return;const t=new IntersectionObserver(i=>{i.forEach(o=>{o.isIntersecting&&(o.target.classList.add("visible"),t.unobserve(o.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});e.forEach(i=>t.observe(i))}function Te(){const e=sessionStorage.getItem("spa-redirect");e&&(sessionStorage.removeItem("spa-redirect"),history.replaceState(null,"",e)),document.addEventListener("click",t=>{const i=t.target.closest("a[href]");if(!i)return;const o=i.getAttribute("href"),a=i.getAttribute("data-nav-section");if(a){if(ae(window.location.pathname).type!=="home"){t.preventDefault(),P(f).then(()=>{setTimeout(()=>{const s=document.getElementById(a);s&&s.scrollIntoView({behavior:"smooth"})},100)});return}return}if(!o||o.startsWith("http")||o.startsWith("#")||o.startsWith("mailto:")||o.startsWith("tel:")||i.target==="_blank")return;t.preventDefault();const r=new URL(o,window.location.href);P(r.href)}),window.addEventListener("popstate",()=>{P(window.location.href,!1)}),P(window.location.href,!1)}const re="ricettario_fatte";function H(){try{const e=localStorage.getItem(re);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function Ie(e){localStorage.setItem(re,JSON.stringify([...e]))}function je(e){return H().has(e)}function Pe(e){const t=H(),i=!t.has(e);return i?t.add(e):t.delete(e),Ie(t),i}function j(){const e=H();if(e.size===0)return;document.querySelectorAll(".recipe-card--compact, .category-card").forEach(i=>{const o=i.getAttribute("href")||"",a=new URL(o,location.origin).pathname.split("/").filter(Boolean).pop();if(a&&e.has(a)&&!i.querySelector(".made-badge")){const r=document.createElement("span");r.className="made-badge",r.textContent="✓",r.title="Ricetta già fatta!";const n=i.querySelector(".recipe-card--compact__image-wrapper, .category-card__image-wrapper");n&&n.appendChild(r)}})}function Re(e){const t=document.getElementById("made-toggle");if(!t)return;const i=o=>{t.classList.toggle("made-toggle--active",o),t.setAttribute("aria-pressed",String(o)),t.innerHTML=o?'<span class="made-toggle__icon" aria-hidden="true">✓</span> <span class="made-toggle__label">Fatta!</span>':'<span class="made-toggle__icon" aria-hidden="true">○</span> <span class="made-toggle__label">Segna come fatta</span>',t.title=o?"Clicca per rimuovere":"Segna questa ricetta come fatta"};i(je(e)),t.addEventListener("click",o=>{o.preventDefault();const a=Pe(e);i(a),t.classList.add("made-toggle--pop"),setTimeout(()=>t.classList.remove("made-toggle--pop"),400)})}const Be={"arrow-up-right":'<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"grid-3x3":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',list:'<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>',microscope:'<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',moon:'<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',search:'<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'},ne="http://www.w3.org/2000/svg",Oe={xmlns:ne,width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"};function De(e=document){for(const t of e.querySelectorAll("[data-lucide]")){const i=t.getAttribute("data-lucide"),o=Be[i];if(!o){console.warn(`[icons] icona "${i}" non disponibile: aggiungila a js/icons.js`);continue}const a=document.createElementNS(ne,"svg");for(const[r,n]of Object.entries(Oe))a.setAttribute(r,n);for(const r of t.attributes)r.name!=="data-lucide"&&a.setAttribute(r.name,r.value);a.setAttribute("class",`lucide lucide-${i}${t.className?" "+t.className:""}`),a.innerHTML=o,t.replaceWith(a)}}function q(e,t=20,i=""){return C(f,e,t,i)}const Fe=ie;function M(){De()}const qe=/\{([a-zA-Z_][a-zA-Z0-9_]*):(\d+(?:\.\d+)?)(!)?\}/,se=()=>new RegExp(qe.source,"g");function N(e){return e===0?"0":e>=10?`${Math.round(e)}`:e>=1?`${Math.round(e*10)/10}`:`${Math.round(e*100)/100}`}function He(e){return String(e||"").replace(se(),(t,i,o,a)=>{const r=parseFloat(o);return`<span class="dose-inline" data-base="${r}" data-token-id="${i}"${a?' data-fixed="true"':""}>${N(r)}</span>`})}function Ne(e){return String(e||"").replace(se(),(t,i,o)=>N(parseFloat(o)))}const Ge=["immagine esistente","caricata manualmente","provenienza non documentata"],Ve=["pexels","unsplash","pixabay","wikimedia","openverse","flickr"],X={"pexels license":"https://www.pexels.com/license/","unsplash license":"https://unsplash.com/license","pixabay license":"https://pixabay.com/service/license-summary/"};function Ue(e){const t=String(e??"").trim().toLowerCase();if(!t)return null;if(X[t])return X[t];const i=t.replace(/^cc\s+/,"");if(/^cc0\b/.test(i)||i==="zero")return"https://creativecommons.org/publicdomain/zero/1.0/";if(/^(public domain|pdm|dominio pubblico)\b/.test(i))return"https://creativecommons.org/publicdomain/mark/1.0/";const o=i.match(/^(by(?:-nc)?(?:-sa|-nd)?)\s+(\d\.\d)$/);return o?`https://creativecommons.org/licenses/${o[1]}/${o[2]}/`:null}function We(e){const t=String(e??"").trim();if(!/^https:\/\//i.test(t))return null;const i=t.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/[a-z-]+\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)/i);if(i)return`https://commons.wikimedia.org/wiki/File:${i[1]}`;const o=t.match(/^https:\/\/images\.pexels\.com\/photos\/(\d+)\//i);return o?`https://www.pexels.com/photo/${o[1]}/`:/^https:\/\/(commons\.wikimedia\.org\/wiki\/|www\.pexels\.com\/photo\/|unsplash\.com\/photos\/|pixabay\.com\/[a-z-]+\/|openverse\.org\/image\/|www\.flickr\.com\/photos\/)/i.test(t)?t:null}function Xe(e,t){const i=String(e??"").trim();if(!i)return null;const o=i.replace(/^📷\s*/,"").replace(/^Foto:\s*/i,"").trim();if(!o||Ge.includes(o.toLowerCase()))return null;const a=o.split(/\s+[—–]\s+/),r=a[0].trim();if(!r)return null;let n=null,s=null;if(a.length>1){const d=a.slice(1).join(" — ").trim(),c=d.match(/^(.*?)\s+via\s+(.+)$/i);c?(n=c[1].trim()||null,s=c[2].trim()):Ve.includes(d.toLowerCase())?s=d:n=d||null}return{autore:r,licenza:n,fonte:s,urlLicenza:Ue(n),urlFonte:We(t)}}function Ye(e,t){const i=Xe(e,t);if(!i)return"";const o=(n,s,d)=>s?`<a href="${l(s)}" target="_blank" rel="${d}">${l(n)}</a>`:l(n),a=!!(i.licenza&&!i.urlLicenza&&i.urlFonte);let r=`Foto: ${l(i.autore)}`;return i.licenza&&(r+=a?` — ${o(i.licenza,i.urlFonte,"noopener nofollow")}`:` — ${o(i.licenza,i.urlLicenza,"license noopener nofollow")}`),i.fonte?r+=` via ${o(i.fonte,a?null:i.urlFonte,"noopener nofollow")}`:i.urlFonte&&!a&&(r+=` — ${o("fonte",i.urlFonte,"noopener nofollow")}`),r}const Qe=["n/a","na","nessuna","nessuno","none","null","0","-","—"];function S(e){if(e==null)return!1;const t=String(e).trim();return t!==""&&!Qe.includes(t.toLowerCase())}const Ze={"images/ricette/condimenti/babaganoush-crema-melanzane":[1200,896],"images/ricette/condimenti/bagna-cauda":[1800,1350],"images/ricette/condimenti/besciamella":[1200,896],"images/ricette/condimenti/burro-composto-acciughe-tartufo":[1200,896],"images/ricette/condimenti/burro-maitre-d-hotel":[1200,896],"images/ricette/condimenti/caesar-dressing":[1200,896],"images/ricette/condimenti/chimichurri":[1200,896],"images/ricette/condimenti/coulis-salsa-pomodoro-fresco":[1800,1200],"images/ricette/condimenti/crema-al-parmigiano":[1200,896],"images/ricette/condimenti/crema-di-peperoni":[1600,1066],"images/ricette/condimenti/dressing-miele-senape":[1200,896],"images/ricette/condimenti/fumetto-di-crostacei":[1800,1200],"images/ricette/condimenti/guacamole":[1800,1200],"images/ricette/condimenti/maionese":[1800,1200],"images/ricette/condimenti/marinatura-menta-aceto-verdure-grigliate":[1280,896],"images/ricette/condimenti/olio-aglio-nero-ossidiana":[1200,896],"images/ricette/condimenti/olio-al-basilico-verde-smeraldo":[1280,896],"images/ricette/condimenti/olio-carota-zenzero-arancio-fluo":[1200,896],"images/ricette/condimenti/olio-cavolo-viola-elettrico":[1200,896],"images/ricette/condimenti/olio-curcuma-zafferano-giallo-oro":[1200,896],"images/ricette/condimenti/olio-extravergine-aromatizzato-verde-dorato":[1200,896],"images/ricette/condimenti/olio-peperone-crusco-rosso-rubino":[1200,896],"images/ricette/condimenti/pesto-alla-genovese-tradizionale":[1800,1200],"images/ricette/condimenti/pesto-alla-siciliana":[1800,1200],"images/ricette/condimenti/pesto-di-barbabietola":[1733,1300],"images/ricette/condimenti/pesto-di-fave-maro":[1314,1300],"images/ricette/condimenti/pesto-di-pistacchi-artigianale":[1800,1200],"images/ricette/condimenti/pesto-di-zucchine":[1800,1200],"images/ricette/condimenti/pesto-pomodori-secchi-mandorle-basilico":[1800,1119],"images/ricette/condimenti/pesto-rucola-artigianale":[1335,1300],"images/ricette/condimenti/pure-di-patate":[1200,896],"images/ricette/condimenti/salmoriglio-siciliano-tradizionale":[1800,1200],"images/ricette/condimenti/salsa-alle-noci":[1800,1200],"images/ricette/condimenti/salsa-allo-yogurt":[1800,1200],"images/ricette/condimenti/salsa-allo-yogurt-ed-erba-cipollina":[1800,1192],"images/ricette/condimenti/salsa-bbq-artigianale":[1800,965],"images/ricette/condimenti/salsa-bernese":[1200,896],"images/ricette/condimenti/salsa-cocktail-rosa-artigianale":[1200,896],"images/ricette/condimenti/salsa-teriyaki-originale":[1200,896],"images/ricette/condimenti/salsa-verde-tradizionale":[1800,1201],"images/ricette/condimenti/vinaigrette-classica-e-citronette":[1733,1300],"images/ricette/conserve/burro-chiarificato":[1200,896],"images/ricette/conserve/dado-vegetale-fatto-in-casa":[1200,896],"images/ricette/conserve/dado-vegetale-granulare":[1200,896],"images/ricette/conserve/pomodorini-confit-sottolio":[1800,1195],"images/ricette/dolci/cantuccini-di-prato":[1800,1239],"images/ricette/dolci/cartocci-alla-crema-siciliani":[1800,1200],"images/ricette/dolci/migliaccio-napoletano":[1800,1200],"images/ricette/focaccia/calzone-cipolla-barese-pugliese":[1200,896],"images/ricette/focaccia/focaccia-barese":[1800,1350],"images/ricette/focaccia/focaccia-di-recco-igp":[1800,1350],"images/ricette/focaccia/focaccia-genovese-classica":[1880,1253],"images/ricette/focaccia/focaccia-genovese-fugassa":[1200,896],"images/ricette/lievitati/burger-buns-con-biga":[1800,1200],"images/ricette/lievitati/cornetti-sfogliati-classici":[1800,1200],"images/ricette/lievitati/impasto-rosticceria-siciliana":[1200,896],"images/ricette/lievitati/panettone-fatto-in-casa-caputo":[1800,1202],"images/ricette/lievitati/panettone-pere-cioccolato":[1880,1251],"images/ricette/lievitati/pasta-brioche-artigianale":[1800,1200],"images/ricette/lievitati/pasta-brioche-classica":[1800,1064],"images/ricette/lievitati/pasta-madre-solida-creazione-rinfresco":[1800,1202],"images/ricette/pane/baguette-francese-tradizionale":[1733,1300],"images/ricette/pane/ciabatta-con-poolish":[1800,1200],"images/ricette/pane/pane-ai-cereali-semi":[1200,896],"images/ricette/pane/pane-alle-noci-con-poolish":[1200,896],"images/ricette/pane/pane-di-altamura-dop":[1200,896],"images/ricette/pane/pane-integrale-con-biga":[1800,1182],"images/ricette/pane/pane-pugliese-con-biga":[1500,1e3],"images/ricette/pane/treccia-di-pane-olio":[1800,1200],"images/ricette/pizza/pinsa-romana":[1500,1125],"images/ricette/pizza/pizza-contemporanea-canotto":[1880,1253],"images/ricette/pizza/pizza-in-teglia-romana":[1700,1300],"images/ricette/pizza/pizza-in-teglia-romana-alta-idratazione":[1800,1013],"images/ricette/pizza/pizza-margherita-verace-disciplinare-avpn":[1800,1200],"images/ricette/pizza/pizza-marinara-napoletana-verace":[1800,1202],"images/ricette/pizza/pizza-napoletana-biga-criscito":[1880,1253],"images/ricette/pizza/pizza-napoletana-verace-stg":[1800,1013],"images/ricette/pizza/pizza-romana-stesa-al-matterello":[1800,1202],"images/ricette/primi/gnocchi-di-patate":[1800,1196],"images/ricette/primi/polenta-concia-valdostana":[1200,896],"images/ricette/secondi-piatti/brisket-stile-toscano":[1800,1201],"images/ricette/secondi-piatti/mayak-gyeran-uova-marinate-coreane":[1200,896],"images/ricette/secondi-piatti/pulled-pork-bbq":[1280,853],"images/ricette/secondi-piatti/spare-ribs-salsa-bbq":[1280,853]};function ce(e){const t=e.replace(/\.(jpg|jpeg|png|webp)$/i,"");return{avif:`${t}.avif`,webp:`${t}.webp`}}const Y=640;function le(e){const t=e.indexOf("images/");if(t===-1)return null;const i=e.slice(t).replace(/\.(jpg|jpeg|png|webp)$/i,"");return Ze[i]||null}function z(e,t){return`${e.replace(/\.(avif|webp)$/i,`-${Y}.$1`)} ${Y}w, ${e} ${t}w`}function de(e,t,i="",o="lazy",a="100vw"){if(!e)return"";const{avif:r,webp:n}=ce(e),s=i?` class="${p(i)}"`:"",d=o?` loading="${p(o)}"`:"",c=le(e);if(!c)return`<picture>
  <source srcset="${p(r)}" type="image/avif">
  <source srcset="${p(n)}" type="image/webp">
  <img src="${p(n)}" alt="${p(t)}"${s}${d}>
</picture>`;const[u,h]=c,_=` sizes="${p(a)}"`;return`<picture>
  <source srcset="${p(z(r,u))}"${_} type="image/avif">
  <source srcset="${p(z(n,u))}"${_} type="image/webp">
  <img src="${p(n)}" srcset="${p(z(n,u))}"${_} width="${u}" height="${h}" alt="${p(t)}"${s}${d}>
</picture>`}function Je(e,t){if(!e)return"";const{avif:i,webp:o}=ce(e),a=le(e);if(!a)return`<picture class="recipe-hero__picture">
  <source srcset="${p(i)}" type="image/avif">
  <source srcset="${p(o)}" type="image/webp">
  <img src="${p(o)}" alt="${p(t)}" class="recipe-hero__img">
</picture>`;const[r,n]=a,s=' sizes="100vw"';return`<picture class="recipe-hero__picture">
  <source srcset="${p(z(i,r))}"${s} type="image/avif">
  <source srcset="${p(z(o,r))}"${s} type="image/webp">
  <img src="${p(o)}" srcset="${p(z(o,r))}"${s} width="${r}" height="${n}" alt="${p(t)}" class="recipe-hero__img">
</picture>`}const Ke=[{slug:"cutter-sirman-c-tronic-6",nome:"Sirman C-Tronic 6 VT",tipo:"Cutter professionale",title:"Cutter Sirman C-Tronic 6 VT: guida alle lame",desc:"Guida alle cinque lame del cutter Sirman C-Tronic 6 VT: usi, tecnica, errori da evitare, scheda tecnica e le ricette del sito in cui il cutter lavora meglio.",cardDesc:"Cutter da 5,3 litri con variatore di velocità: la guida completa ai cinque mozzi — lisce, dentate, forate, impasti e pesto.",image:null,lame:[{key:"lisce",nome:"Lame lisce"},{key:"dentate",nome:"Lame dentate"},{key:"forate",nome:"Lame forate"},{key:"impasti",nome:"Mozzo per impasti"},{key:"pesto",nome:"Mozzo per pesto"}]},{slug:"famag-grilletta",nome:"Famag Grilletta IM 5/230 HH",tipo:"Impastatrice a spirale",title:"Impastatrice Famag Grilletta IM 5/230 HH",desc:"La scheda dell'impastatrice a spirale Famag Grilletta IM 5/230 HH: motore brushless, dieci velocità, vasca da 7 litri e impasti fino al 95% di idratazione.",cardDesc:"Impastatrice a spirale con motore brushless e inverter: il cuore di tutti i lievitati del sito, tarata per l'alta idratazione.",image:"images/strumenti/famag-grilletta-detail.webp",lame:[]}],pe=Object.fromEntries(Ke.map(e=>[e.slug,e]));function et(e,t){const i=pe[e];if(!i)return null;const o=i.lame.find(a=>a.key===t);return o?o.nome:null}function tt(e){return e.replace(/class="([^"]*)"/g,(t,i)=>`class="${i.split(/\s+/).filter(a=>a&&a!=="reveal"&&!/^reveal-delay-\d$/.test(a)).join(" ")}"`)}function it(e,{base:t,categoryDir:i,interattivo:o=!0}){const a={base:t,interattivo:o,emoji:(c,u)=>C(t,c,u),testoStep:c=>o?He(l(c)):l(Ne(c))},r=ze(t,e.category,22),n=e.image?`${t}${String(e.image).replace(/^\//,"")}`:`${t}images/ricette/${i}/${e.slug}.webp`,s=Ye(e.imageAttribution,e._originalImageUrl),d=`
    <!-- ═══════════ RECIPE HERO ═══════════ -->
    ${s?'<figure class="recipe-foto">':""}
    <div class="recipe-hero" data-ricetta="${p(i)}/${p(e.slug)}">
      ${Je(n,e.title)}
      <div class="container">
        <nav class="breadcrumb reveal">
          <a href="${t}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${t}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${p(t)}ricette/${p(i)}/" data-link>${l(e.category)}</a>
          <span class="breadcrumb__separator">›</span>
          <span>${l(e.title)}</span>
        </nav>

        <div class="recipe-hero__content">
          <div class="recipe-hero__tags reveal">
            <span class="tag tag--category">${r} ${l(e.category)}</span>
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
        ${S(e.hydration)?`<div class="tech-badge">${a.emoji("droplet",18)} Idratazione: <span class="tech-badge__value">&nbsp;${l(e.hydration)}%</span></div>`:""}
        ${S(e.targetTemp)?`<div class="tech-badge">${a.emoji("thermometer",18)} Target Temp: <span class="tech-badge__value">&nbsp;${l(e.targetTemp)}</span></div>`:""}
        ${S(e.fermentation)?`<div class="tech-badge">${a.emoji("stopwatch",18)} Lievitazione: <span class="tech-badge__value">&nbsp;${l(e.fermentation)}</span></div>`:""}
        ${o?'<button class="made-toggle" id="made-toggle" type="button" aria-pressed="false"></button>':""}
      </div>
    </div>

    <!-- ═══════════ RECIPE CONTENT ═══════════ -->
    <section class="recipe-content" id="recipe-content">
      <div class="container">
        <div class="recipe-layout">

          <!-- COLONNA SX: Ingredienti -->
          <div>
            ${rt(e,a)}
            ${e.suspensions?.length?nt(e,a):""}
          </div>

          <!-- COLONNA DX: Procedimento -->
          <div>
            ${st(e,a)}
            ${ct(e,a)}
          </div>

        </div>

        ${lt(e,a)}
        ${dt(e,a)}
        ${pt(e,a)}
        ${ut(e,a)}
        ${gt(e,a)}
        ${mt(e,a)}
        ${ht(e,a)}
        ${ft(e,a)}
      </div>
    </section>
  `;return o?d:tt(d)}function Q(e){return`<tr${e.excludeFromTotal?' data-exclude-total="true"':""}>
    <th scope="row">${l(e.name)} ${e.note?`<span class="ingredient-note">${l(e.note)}</span>`:""}</th>
    <td class="ingredient-qty">${e.grams!=null?`${l(e.grams)}g`:""}</td>
  </tr>`}function ot(e){const i=(e.ingredientGroups?.length?e.ingredientGroups.flatMap(o=>o.items||[]):e.ingredients||[]).filter(o=>o&&!o.excludeFromTotal&&typeof o.grams=="number").reduce((o,a)=>o+a.grams,0);return i<=0?"":i>=1e3?`~${(i/1e3).toFixed(1)}kg`:`${Math.round(i)}g`}function at(e){return S(e.hydration)?"Peso Totale Impasto":"Peso Totale"}function rt(e,t){const i=e.ingredientGroups?.length>0,o=e.ingredients?.length>0;if(!i&&!o)return"";let a;i?a=e.ingredientGroups.map(n=>{if(!n.items?.length)return"";const s=`<tr class="ingredient-section-header"><th colspan="2" scope="colgroup">${l(n.group||"Ingredienti")}</th></tr>`,d=n.items.map(Q).join("");return s+d}).join(""):a=e.ingredients.map(Q).join("");const r=t.interattivo?`
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
      ${r}
      <table class="ingredients-table" id="ingredients-table" aria-label="Ingredienti e quantità">
        ${a}
        <tr class="ingredient-total-row" id="ingredient-total-row">
          <th scope="row">${at(e)}</th>
          <td class="ingredient-qty" id="ingredient-total-qty">${t.interattivo?"":ot(e)}</td>
        </tr>
      </table>
    </div>`}function nt(e,t){const i=e.suspensions.map(o=>`
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
    </div>`}function st(e,t){const i=e.steps;return i?.length?`
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
    </div>`:""}function ct(e,t){const i=e.stepsCondiment;return i?.length?`
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
    </div>`:""}function lt(e,t){if(!e.sensoryProfile||!e.sensoryProfile.axes||e.sensoryProfile.axes.length===0)return"";const i=e.sensoryProfile.axes.reduce((n,s)=>s.value>n.value?s:n,e.sensoryProfile.axes[0]),o=e.sensoryProfile.summary?`
    <div class="sensory-note">
      <h3 class="sensory-note__title">Note di Degustazione</h3>
      <p class="sensory-note__text">"${l(e.sensoryProfile.summary)}"</p>
    </div>
  `:"";let a="";if(e.nutrition&&e.nutrition.macros){const n=Number(e.nutrition.macros.carbs)||0,s=Number(e.nutrition.macros.protein)||0,d=Number(e.nutrition.macros.fat)||0,c=n+s+d,u=c>0?n/c*100:0,h=c>0?s/c*100:0,_=c>0?d/c*100:0,k=`
        <div class="nutrition-content">
          <div class="nutrition-kcal">
              <span class="nutrition-kcal__value">${l(e.nutrition.kcal_per_100g)}</span>
              <span class="nutrition-kcal__unit">Kcal</span>
          </div>

          <div class="nutrition-bar">
            <div class="nutrition-bar__segment nutrition-bar__segment--carbs" style="width: ${u}%;" title="Carboidrati"></div>
            <div class="nutrition-bar__segment nutrition-bar__segment--prot" style="width: ${h}%;" title="Proteine"></div>
            <div class="nutrition-bar__segment nutrition-bar__segment--fat" style="width: ${_}%;" title="Grassi"></div>
          </div>

          <div class="nutrition-legend">
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--carbs"></div>
              <span>Carboidrati <strong>${n}g</strong></span>
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
            <em>Disclaimer: Valori medi per 100 g di prodotto finito, calcolati sugli ingredienti della ricetta con dati USDA FoodData Central e resa di cottura dichiarata. I valori effettivi possono variare in base ai marchi commerciali usati.</em>
          </p>
        </div>`;a=t.interattivo?`
      <details class="nutrition-toggle">
        <summary class="nutrition-toggle__btn">
          <i data-lucide="microscope" class="nutrition-toggle__icon"></i> Analisi Nutrizionale
        </summary>
${k}
      </details>
      `:`
      <h3 class="sensory-note__title">Analisi Nutrizionale</h3>
${k}`}const r=e.sensoryProfile.axes.map(n=>`<tr><th scope="row">${l(n.label)}</th><td>${l(n.value)} su 10</td></tr>`).join("");return t.interattivo?`
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
            <tbody>${r}</tbody>
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
        <tbody>${r}</tbody>
      </table>
      ${o}
      ${a}
    </div>`}function dt(e,t){return e.flourTable?.length?`
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
    </div>`:""}function pt(e,t){return e.alert?`
    <div class="alert alert--danger reveal recipe-panel--spaced">
      <span class="alert__icon">${t.emoji("prohibited",28)}</span>
      <div class="alert__content">
        <strong>ALERT PROFESSIONALE</strong>
        <p>${t.emoji("warning",18)} ${l(e.alert)}</p>
      </div>
    </div>`:""}function ut(e,t){const i=(e.tools||[]).map(o=>({t:o,s:pe[o.strumento]})).filter(o=>o.s);return i.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("wrench",24)}</span> Strumenti del mestiere
      </h2>
      <ul class="tip-list">
        ${i.map(({t:o,s:a})=>{const r=o.lama?et(o.strumento,o.lama):null;return`<li class="tip-item">${t.emoji("wrench",16)} <a href="${p(`${t.base}strumenti/${a.slug}/`)}" data-link>${l(a.nome)}</a>${r?` — ${l(r)}`:""}${o.nota?`: ${l(o.nota)}`:""}</li>`}).join("")}
      </ul>
    </div>`:""}function gt(e,t){if(!e.baking)return"";const i=e.baking;return`
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
    </div>`}function mt(e,t){return e.proTips?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("light-bulb",24)}</span> Pro Tips
      </h2>
      <ul class="tip-list">
        ${e.proTips.map(i=>`<li class="tip-item">${t.emoji("light-bulb",16)} ${l(i)}</li>`).join("")}
      </ul>
    </div>`:""}function ht(e,t){return e.storage?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("package",24)}</span> Conservazione
      </h2>
      <ul class="tip-list">
        ${e.storage.map(i=>`<li class="tip-item">${t.emoji("package",16)} ${l(i)}</li>`).join("")}
      </ul>
    </div>`:""}function ft(e,t){return e.glossary?.length?`
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
    </div>`:""}async function _t(e,{category:t,slug:i},{primoCaricamento:o=!1}={}){const a=o&&e.querySelector(".recipe-hero[data-ricetta]")?.getAttribute("data-ricetta")===`${t}/${i}`;a||(e.innerHTML=`
      <div class="recipe-loading">
        <div class="recipe-loading__spinner"></div>
        <p>Caricamento ricetta...</p>
      </div>`);const r=window.location.pathname;let n=!1;try{const s=`${f}ricette/${t}/${i}.json`,d=await fetch(s);if(n=d.status===404,!d.ok)throw new Error(`HTTP ${d.status} su ${s}`);const c=await d.json();if(window.location.pathname!==r)return;document.title=`${c.title} — Ricettario Lab`;const u=document.querySelector('meta[name="description"]');u&&u.setAttribute("content",c.description||""),e.innerHTML=it(c,{base:f,categoryDir:t,interattivo:!0}),vt(c),Re(c.slug),bt(c),M()}catch(s){if(console.error(`Ricetta ${t}/${i} non caricata:`,s),window.location.pathname!==r)return;if(a){document.getElementById("recipe-content")?.insertAdjacentHTML("beforebegin",`
        <div class="container">
          <div class="alert alert--danger" role="alert">
            <span class="alert__icon">${q("warning",28)}</span>
            <div class="alert__content">
              <strong>La versione interattiva non si è caricata</strong>
              <p>La ricetta è completa e leggibile, ma il calcolatore dosi e il pulsante «Fatta» non sono attivi. Controlla la connessione e ricarica la pagina per riprovare.</p>
            </div>
          </div>
        </div>`);return}const d=te[t];D(e,{base:f,titolo:n?"Ricetta non trovata":"Ricetta non caricata",dettaglio:n?`Non c'è nessuna ricetta all'indirizzo «${t}/${i}». Può essere un refuso, o una ricetta che è stata spostata.`:"Il caricamento non è riuscito. Controlla la connessione e riprova.",uscite:d&&[{href:`${f}ricette/${t}/`,testo:`Vedi le ricette di ${d.name}`},{href:f,testo:"Torna alla home"}]})}}function vt(e){const t=document.getElementById("dose-badge"),i=document.getElementById("dose-decrease"),o=document.getElementById("dose-increase");if(!t||!i||!o)return;const a=.25,r=.25;let n=1;const s=[],d=e.ingredientGroups?.length?e.ingredientGroups.flatMap(g=>g.items||[]):e.ingredients||[],c=["ingredients-table","suspensions-table"],u=[d,e.suspensions||[]];c.forEach((g,y)=>{const b=document.getElementById(g);if(!b)return;const L=b.querySelectorAll("tr:not(.ingredient-section-header)"),$=u[y];let x=0;for(const w of $){if(w.grams==null)continue;if(x>=L.length)break;const E=L[x]?.querySelector(".ingredient-qty");E&&s.push({baseGrams:w.grams,cell:E}),x++}});const h=g=>g===0?"0g":g>=10?`${Math.round(g)}g`:g>=1?`${Math.round(g*10)/10}g`:`${Math.round(g*100)/100}g`,_=g=>{if(Number.isInteger(g))return`×${g}`;const y=Math.round(g*10)/10;return Math.abs(g-y)<.001?`×${y.toFixed(1)}`:`×${g.toFixed(2)}`},k=()=>ee(`Dosi ${_(n).replace(".",",")}`),v=()=>{t.textContent=_(n),t.classList.toggle("dose-calculator__display--modified",n!==1);const g=n<=r;g&&document.activeElement===i&&(o.disabled?(t.setAttribute("tabindex","-1"),t.focus()):o.focus()),i.disabled=g,s.forEach(({baseGrams:y,cell:b})=>{const L=b.getAttribute("data-base"),$=L!==null?parseFloat(L):y;b.textContent=h($*n),b.getAnimations().forEach(x=>x.cancel()),b.classList.remove("dose-updated"),requestAnimationFrame(()=>b.classList.add("dose-updated"))}),document.querySelectorAll(".dose-inline:not([data-fixed])").forEach(y=>{const b=parseFloat(y.getAttribute("data-base"));isNaN(b)||(y.textContent=N(b*n),y.getAnimations().forEach(L=>L.cancel()),y.classList.remove("dose-updated"),requestAnimationFrame(()=>y.classList.add("dose-updated")))}),yt()};i.addEventListener("click",()=>{const g=Math.round((n-a)*100)/100;g>=r&&(n=g,v(),k())}),o.addEventListener("click",()=>{n=Math.round((n+a)*100)/100,v(),k()}),v()}function yt(){const e=document.getElementById("ingredient-total-qty");if(!e)return;let t=0;const i=document.getElementById("ingredients-table");if(!i)return;i.querySelectorAll("tr:not(.ingredient-section-header):not(.ingredient-total-row):not([data-exclude-total]) .ingredient-qty").forEach(a=>{const r=a.textContent.trim(),n=parseFloat(r);isNaN(n)||(t+=n)});const o=t>=1e3?`~${(t/1e3).toFixed(1)}kg`:`${Math.round(t)}g`;e.textContent=o,e.classList.remove("dose-updated"),e.offsetWidth,e.classList.add("dose-updated")}let F=null;function bt(e){const t=document.getElementById("sensory-header");if(!t)return;const i=document.getElementById("sensory-chart-container");if(!i)return;const o=()=>t.querySelector(".sensory-chevron"),a=e.sensoryProfile?.axes;if(!a?.length)return;const r={labels:a.map(s=>s.label),values:a.map(s=>s.value)};let n=null;t.addEventListener("click",async()=>{const s=i.style.display==="none"||!i.style.display;if(t.setAttribute("aria-expanded",String(s)),s){if(i.style.display="block",o()?.style.setProperty("transform","rotate(180deg)"),!F)try{const{Chart:$,RadarController:x,RadialLinearScale:w,PointElement:E,LineElement:fe,Filler:_e,Tooltip:ve}=await R(async()=>{const{Chart:ye,RadarController:be,RadialLinearScale:$e,PointElement:we,LineElement:xe,Filler:Ee,Tooltip:Ce}=await import("./chart-Cns13J0s.js");return{Chart:ye,RadarController:be,RadialLinearScale:$e,PointElement:we,LineElement:xe,Filler:Ee,Tooltip:Ce}},[]);$.register(x,w,E,fe,_e,ve),F=$}catch($){console.error("Errore caricamento Chart.js:",$);return}n&&(n.destroy(),n=null);const d=document.getElementById("sensoryChart")?.getContext("2d");if(!d)return;const{labels:c,values:u}=r,h=window.innerWidth<600,_=h?10:14,k=c.map($=>{const x=[];let w="";for(const E of String($).split(" "))w?E==="/"||`${w} ${E}`.length<=_?w+=` ${E}`:(x.push(w),w=E):w=E;return w&&x.push(w),x.length>1?x:$}),v=document.documentElement.getAttribute("data-theme")==="dark",g=v?"rgba(212, 165, 116, 0.8)":"rgba(184, 129, 58, 0.8)",y=v?"rgba(212, 165, 116, 0.2)":"rgba(184, 129, 58, 0.2)",b=v?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.1)",L=v?"#94a3b8":"#64748b";n=new F(d,{type:"radar",data:{labels:k,datasets:[{label:"Valore",data:u,backgroundColor:y,borderColor:g,pointBackgroundColor:g,pointBorderColor:"#fff",pointHoverBackgroundColor:"#fff",pointHoverBorderColor:g,borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!0,layout:{padding:h?10:20},scales:{r:{min:0,max:10,angleLines:{color:b},grid:{color:b},pointLabels:{color:L,font:{family:"Inter",size:h?10:12,weight:"500"}},ticks:{display:!1,stepSize:2}}},plugins:{legend:{display:!1},tooltip:{backgroundColor:v?"#1e293b":"#fff",titleColor:v?"#f8fafc":"#0f172a",bodyColor:v?"#cbd5e1":"#475569",borderColor:v?"#334155":"#e2e8f0",borderWidth:1,padding:10,displayColors:!1,callbacks:{label:$=>$.formattedValue+" / 10"}}}}})}else i.style.display="none",o()?.style.setProperty("transform","rotate(0deg)")})}function $t(){return`
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

    </svg>`}function wt(){return`
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
        ${$t()}
      </div>

      <!-- Phase 7: Title text -->
      <div class="logo-intro__text">Il Ricettario</div>

      <!-- Phase 7b: Subtitle -->
      <div class="logo-intro__subtitle">Laboratorio Artigianale</div>
    </div>
  `}function xt(){if(sessionStorage.getItem("intro-shown"))return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){sessionStorage.setItem("intro-shown","1");return}R(()=>Promise.resolve({}),__vite__mapDeps([0]));const e=()=>{document.body.insertAdjacentHTML("afterbegin",wt()),Et(),sessionStorage.setItem("intro-shown","1")};document.body?e():document.addEventListener("DOMContentLoaded",e,{once:!0})}function Et(){const e=document.getElementById("logo-intro"),t=document.getElementById("logo-intro-logo");if(!e)return;document.documentElement.style.overflow="hidden";const i=setTimeout(()=>{t&&t.classList.add("glowing")},1700);e.addEventListener("animationend",o=>{o.animationName==="introOverlayOut"&&(document.documentElement.style.overflow="",e.classList.add("logo-intro--done"),requestAnimationFrame(()=>e.remove()),clearTimeout(i))}),setTimeout(()=>{document.getElementById("logo-intro")&&(document.documentElement.style.overflow="",e.remove())},5e3)}function ue(e,{base:t}){const i=`${t}ricette/${e.categoryDir}/${e.slug}/`,o=e.image?de(`${t}${e.image}`,"","category-card__image","lazy","(min-width: 640px) 368px, calc(100vw - 32px)"):"";return`
      <a href="${p(i)}" class="category-card" data-link
         data-title="${p((e.title||"").toLowerCase())}"
         data-hydration="${parseInt(e.hydration)||0}">
        <div class="category-card__image-wrapper">
          ${o}
          <div class="category-card__meta">
            ${S(e.hydration)?`<span class="category-card__tag">${C(t,"droplet",14)} ${l(e.hydration)}</span>`:""}
            ${S(e.time)?`<span class="category-card__tag">${C(t,"stopwatch",14)} ${l(e.time)}</span>`:""}
          </div>
        </div>
        <div class="category-card__body">
          <h2 class="category-card__title">${l(e.title)}</h2>
          ${e.description?`<p class="category-card__desc">${l(e.description)}</p>`:""}
        </div>
      </a>`}function Ct(e){return Array.from({length:e},()=>`
    <div class="category-card category-card--skeleton">
      <div class="category-card__image-wrapper"></div>
      <div class="category-card__body">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
      </div>
    </div>`).join("")}function kt(e){const t=e.title;return{titoloBreve:t,titolo:`${t} — Ricettario Lab`,descrizione:e.desc}}function Lt(e,t,{base:i,interattivo:o=!0,viewMode:a="grid"}){const n="⏳ Caricamento...",s=o?`
        <div class="category-toolbar" id="category-toolbar">
          <div class="category-toolbar__search">
            <span class="category-toolbar__search-icon"><i data-lucide="search" style="width:16px;height:16px"></i></span>
            <input type="text" class="category-toolbar__search-input" id="category-search"
              placeholder="Cerca tra le ricette di ${p(e.name.toLowerCase())}...">
          </div>
          <div class="category-toolbar__results" id="results-counter"></div>
          <div class="category-toolbar__sort">
            <button class="category-toolbar__sort-btn active" data-sort="az">A-Z</button>
            <button class="category-toolbar__sort-btn" data-sort="hydration">${C(i,"droplet",14)} Idratazione</button>
          </div>
          <div class="category-toolbar__views">
            <button class="view-toggle-btn ${a==="grid"?"active":""}" data-view="grid" aria-label="Vista griglia">
              <i data-lucide="grid-3x3" style="width:16px;height:16px"></i>
            </button>
            <button class="view-toggle-btn ${a==="list"?"active":""}" data-view="list" aria-label="Vista lista">
              <i data-lucide="list" style="width:16px;height:16px"></i>
            </button>
          </div>
        </div>`:"",d=o?Ct(6):t.map(c=>ue(c,{base:i})).join("");return`
    <section class="category-hero" id="category-hero">
      <div class="category-hero__content">
        <h1 class="category-hero__title">${l(e.title)}</h1>
        <p class="category-hero__subtitle">${l(e.desc)}</p>
        <div class="category-hero__count" id="recipe-count">${n}</div>
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
  `}function St(e,{base:t}){const i=`${t}ricette/${e.categoryDir}/${e.slug}/`,o=e.image?de(`${t}${e.image}`,"","recipe-card--compact__image","lazy","(min-width: 1200px) 290px, (min-width: 480px) 260px, 200px"):"";return`
          <a href="${p(i)}" class="recipe-card--compact" data-link data-title="${p((e.title||"").toLowerCase())}" data-category="${p(e.category)}">
            <div class="recipe-card--compact__image-wrapper">
              ${o}
            </div>
            <div class="recipe-card--compact__body">
              <h4 class="recipe-card--compact__title">${l(e.title)}</h4>
              <div class="recipe-card--compact__meta">
                ${S(e.hydration)?`<span class="recipe-card--compact__tag">${C(t,"droplet",16)} ${l(e.hydration)}</span>`:""}
                ${S(e.time)?`<span>${C(t,"stopwatch",16)} ${l(e.time)}</span>`:""}
              </div>
            </div>
          </a>`}function At(e,t,i,o,{base:a}){return`
    <div class="category-row__header">
      <h3 class="category-row__title">
        ${C(a,t,32)} ${l(e)}
        <span class="category-row__count">${o.length} ricett${o.length===1?"a":"e"}</span>
      </h3>
      <a href="${p(`${a}ricette/${i}/`)}" class="category-row__link" data-link>Vedi tutte</a>
    </div>
    <div class="category-row__carousel-wrapper">
      <div class="category-row__carousel">
        ${o.map(r=>St(r,{base:a})).join("")}
      </div>
    </div>
  `}const ge="?v=52be676d";xt();document.addEventListener("DOMContentLoaded",()=>{zt(),Mt(),Tt();const e=document.getElementById("current-year");e&&(e.textContent=new Date().getFullYear()),M(),jt(),Me({home:Rt,recipe:_t,category:Ot,cottura:async(t,i)=>{const{renderCottura:o}=await R(async()=>{const{renderCottura:a}=await import("./pagina-DJIr5fMk.js");return{renderCottura:a}},__vite__mapDeps([1,2]));return o(t,i)},strumenti:async(t,i)=>{const{renderStrumenti:o}=await R(async()=>{const{renderStrumenti:a}=await import("./pagina-BpGdkdqe.js");return{renderStrumenti:a}},__vite__mapDeps([3,4]));return o(t,i)},nonTrovata:(t,{percorso:i}={})=>D(t,{base:f,dettaglio:i?`L'indirizzo «${i}» non corrisponde a nessuna pagina di questo sito.`:""})}),Te()});function zt(){const e=document.getElementById("navbar");if(!e)return;const t=()=>e.classList.toggle("scrolled",window.scrollY>50);window.addEventListener("scroll",t,{passive:!0}),t()}function Mt(){const e=document.getElementById("theme-toggle");e&&(e.addEventListener("click",()=>{const i=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";e.classList.add("theme-toggle--switching"),setTimeout(()=>e.classList.remove("theme-toggle--switching"),400),document.documentElement.setAttribute("data-theme",i),window.applicaColoreBarra?.(i),localStorage.setItem("theme",i)}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",t=>{if(!localStorage.getItem("theme")){const i=t.matches?"dark":"light";document.documentElement.setAttribute("data-theme",i),window.applicaColoreBarra?.(i)}}))}function Tt(){const e=document.getElementById("hamburger"),t=document.getElementById("nav-links");!e||!t||(e.addEventListener("click",()=>{e.classList.toggle("open"),t.classList.toggle("open")}),t.querySelectorAll("a").forEach(i=>{i.addEventListener("click",()=>{e.classList.remove("open"),t.classList.remove("open")})}),document.addEventListener("click",i=>{!e.contains(i.target)&&!t.contains(i.target)&&(e.classList.remove("open"),t.classList.remove("open"))}))}let A=null;function It(e){const t=new URL(f,window.location.origin),i=o=>!o||/^([a-z]+:|\/\/|\/|#)/i.test(o)?o:new URL(o,t).pathname;e.querySelectorAll("[src], [href], [srcset]").forEach(o=>{["src","href"].forEach(r=>{const n=o.getAttribute(r);n&&o.setAttribute(r,i(n))});const a=o.getAttribute("srcset");a&&o.setAttribute("srcset",a.split(",").map(r=>{const[n,...s]=r.trim().split(/\s+/);return[i(n),...s].join(" ")}).join(", "))})}function me(e,t,i){const o=e.cloneNode(!0);return It(o),{html:o.innerHTML,title:t,description:i}}function jt(){const e=document.getElementById("app");e?.querySelector("#ricette")&&(A=me(e,document.title,document.querySelector('meta[name="description"]')?.getAttribute("content")||""))}async function Pt(){if(A)return A;const e=await fetch(f),t=new DOMParser().parseFromString(await e.text(),"text/html"),i=t.getElementById("app");if(!i)throw new Error("index.html non contiene #app");return A=me(i,t.title,t.querySelector('meta[name="description"]')?.getAttribute("content")||""),A}async function Rt(e){if(!e.querySelector("#ricette"))try{const i=await Pt();e.innerHTML=i.html}catch(i){console.error("Impossibile ricostruire la homepage:",i),window.location.assign(f);return}const t=A;if(t){document.title=t.title;const i=document.querySelector('meta[name="description"]');i&&i.setAttribute("content",t.description)}M(),Ft(),I()}const T=12,Bt=te;let m={allRecipes:[],filteredRecipes:[],displayedCount:T,viewMode:"grid",sortType:"az",searchQuery:"",categoryDir:""};async function Ot(e,{category:t}){const i=Bt[t];if(!i){D(e,{base:f,titolo:"Categoria non trovata",dettaglio:`La categoria «${t}» non esiste (o non esiste più).`});return}const o=kt(i);document.title=o.titolo;const a=document.querySelector('meta[name="description"]');a&&a.setAttribute("content",o.descrizione),m={allRecipes:[],filteredRecipes:[],displayedCount:T,viewMode:localStorage.getItem("catViewMode")||"grid",sortType:"az",searchQuery:"",categoryDir:t},e.innerHTML=Lt(i,null,{base:f,interattivo:!0,viewMode:m.viewMode}),M();try{const n=await(await fetch(`${f}recipes.json${ge}`)).json();m.allRecipes=n.recipes.filter(c=>c.categoryDir===t||c.category===i.name),m.allRecipes.sort((c,u)=>(c.title||"").localeCompare(u.title||"","it")),m.filteredRecipes=[...m.allRecipes];const s=m.allRecipes.find(c=>c.image);if(s){const c=document.getElementById("category-hero");c&&(c.style.backgroundImage=`url('${f}${s.image}')`)}const d=document.getElementById("recipe-count");d&&(d.innerHTML=`${q("bullseye",16)} ${m.allRecipes.length} ricett${m.allRecipes.length===1?"a":"e"}`),B(),Dt(e),I(),j()}catch(r){console.error("Errore caricamento categoria:",r);const n=document.getElementById("category-grid");n&&(n.innerHTML=`<div class="category-empty"><div class="category-empty__icon">${q("prohibited",32)}</div><p>Errore nel caricamento delle ricette.</p></div>`)}}function Dt(e){const t=document.getElementById("category-search");let i;t&&t.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(()=>{m.searchQuery=t.value.toLowerCase().trim(),m.displayedCount=T,Z(),B()},150)});const o=e.querySelectorAll(".category-toolbar__sort-btn");o.forEach(r=>{r.addEventListener("click",()=>{o.forEach(n=>n.classList.remove("active")),r.classList.add("active"),m.sortType=r.dataset.sort,m.displayedCount=T,Z(),B()})});const a=e.querySelectorAll(".view-toggle-btn");a.forEach(r=>{r.addEventListener("click",()=>{a.forEach(s=>s.classList.remove("active")),r.classList.add("active"),m.viewMode=r.dataset.view,localStorage.setItem("catViewMode",m.viewMode);const n=document.getElementById("category-grid");n&&n.classList.toggle("category-grid--list",m.viewMode==="list")})})}function Z(){let e=[...m.allRecipes];m.searchQuery&&(e=e.filter(t=>{const i=(t.title||"").toLowerCase(),o=(t.description||"").toLowerCase();return i.includes(m.searchQuery)||o.includes(m.searchQuery)})),m.sortType==="az"?e.sort((t,i)=>(t.title||"").localeCompare(i.title||"","it")):m.sortType==="hydration"&&e.sort((t,i)=>(parseInt(i.hydration)||0)-(parseInt(t.hydration)||0)),m.filteredRecipes=e}function B(){const e=document.getElementById("category-grid"),t=document.getElementById("load-more-container");if(!e)return;const{filteredRecipes:i,displayedCount:o}=m,a=i.slice(0,o),r=i.length,n=document.getElementById("results-counter");if(n&&(m.searchQuery?n.innerHTML=`<strong>${r}</strong> risultat${r===1?"o":"i"}`:n.innerHTML=`<strong>${Math.min(o,r)}</strong> di <strong>${r}</strong>`),r===0){e.innerHTML=`
      <div class="category-empty" style="grid-column: 1 / -1">
        <div class="category-empty__icon"><i data-lucide="search" style="width:32px;height:32px"></i></div>
        <p>Nessuna ricetta trovata</p>
      </div>`,t&&(t.innerHTML=""),M();return}if(e.innerHTML=a.map(s=>ue(s,{base:f})).join(""),t)if(o<r){const s=r-o,d=Math.round(o/r*100);t.innerHTML=`
        <div class="load-more-wrapper">
          <button class="load-more-btn" id="load-more-btn">
            <span>Carica altre ${Math.min(s,T)} ricette</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="load-more-progress">${o} di ${r} ricette</div>
          <div class="load-more-bar"><div class="load-more-bar__fill" style="width: ${d}%"></div></div>
        </div>`,document.getElementById("load-more-btn")?.addEventListener("click",()=>{m.displayedCount+=T,B(),setTimeout(()=>{const u=e.querySelectorAll(".category-card")[o];u&&u.scrollIntoView({behavior:"smooth",block:"center"})},100),j()})}else t.innerHTML="";M(),j()}function J(e,t,i,o,a){const r=document.createElement("div");r.className="category-row reveal",r.dataset.category=t,r.innerHTML=At(t,i,o,a,{base:f}),e.appendChild(r),he(r)}function he(e){if(e.dataset.attivo)return;e.dataset.attivo="1";const t=e.querySelector(".category-row__carousel"),i=e.querySelector(".category-row__carousel-wrapper");if(!t||!i)return;const o=(d,c,u)=>{const h=document.createElement("button");return h.className=`carousel-arrow ${d}`,h.setAttribute("aria-label",c),h.textContent=u,h},a=o("carousel-arrow--prev","Precedente","‹"),r=o("carousel-arrow--next","Successivo","›");i.insertBefore(a,t),i.appendChild(r);const n=276,s=()=>{const{scrollLeft:d,scrollWidth:c,clientWidth:u}=t;i.classList.toggle("has-scroll-left",d>10),i.classList.toggle("has-scroll-right",d<c-u-10),a.disabled=d<=10,r.disabled=d>=c-u-10};t.addEventListener("scroll",s,{passive:!0}),s(),new ResizeObserver(s).observe(t),a.addEventListener("click",()=>t.scrollBy({left:-n*3,behavior:"smooth"})),r.addEventListener("click",()=>t.scrollBy({left:n*3,behavior:"smooth"}))}function Ft(){const e=document.getElementById("recipe-carousels");if(!e)return;const t=e.querySelectorAll(".category-row");if(t.length){t.forEach(he),I(),K(),j();return}const i=Se.map(o=>{const a=O[o];return{key:a.name,emoji:a.emoji,dir:a.dir}});fetch(`${f}recipes.json${ge}`).then(o=>o.json()).then(o=>{e.innerHTML="";const a={};o.recipes.forEach(n=>{a[n.category]||(a[n.category]=[]),a[n.category].push(n)}),i.forEach(n=>{const s=a[n.key];!s||s.length===0||J(e,n.key,n.emoji,n.dir,s)});const r=new Set(i.map(n=>n.key));Object.keys(a).forEach(n=>{if(r.has(n))return;const s=a[n];if(!s||s.length===0)return;const d=n.toLowerCase(),c=Fe[n]||"fork-and-knife";J(e,n,c,d,s)}),I(),K(),j()}).catch(o=>{console.error("Errore caricamento recipes.json:",o),e.innerHTML='<p style="text-align:center; color: var(--color-text-muted);">Errore nel caricamento delle ricette.</p>'})}function K(){const e=document.getElementById("search-input");e&&(e.addEventListener("input",()=>{const t=e.value.toLowerCase().trim(),i=document.querySelectorAll(".recipe-card--compact"),o=document.querySelectorAll(".category-row");i.forEach(a=>{const r=a.dataset.title||a.textContent.toLowerCase();a.classList.toggle("hidden",!!(t&&!r.includes(t)))}),o.forEach(a=>{const r=a.querySelectorAll(".recipe-card--compact:not(.hidden)");a.classList.toggle("hidden",r.length===0)})}),document.addEventListener("keydown",t=>{t.key==="/"&&document.activeElement!==e&&(t.preventDefault(),e.focus(),e.scrollIntoView({behavior:"smooth",block:"center"})),t.key==="Escape"&&document.activeElement===e&&(e.value="",e.dispatchEvent(new Event("input")),e.blur())}))}export{f as B,O as C,pe as S,ee as a,de as b,p as c,Ke as d,l as e,D as m,P as n};
