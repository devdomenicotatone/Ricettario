const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/logo-intro-DWh29O1b.css","assets/pagina-w6ineq97.js","assets/pagina-x-fbNz_H.css"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function o(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(r){if(r.ep)return;r.ep=!0;const a=o(r);fetch(r.href,a)}})();const ye="modulepreload",ve=function(e){return"/Ricettario/"+e},q={},O=function(t,o,i){let r=Promise.resolve();if(o&&o.length>0){let n=function(d){return Promise.all(d.map(g=>Promise.resolve(g).then(h=>({status:"fulfilled",value:h}),h=>({status:"rejected",reason:h}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),l=s?.nonce||s?.getAttribute("nonce");r=n(o.map(d=>{if(d=ve(d),d in q)return;q[d]=!0;const g=d.endsWith(".css"),h=g?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${h}`))return;const v=document.createElement("link");if(v.rel=g?"stylesheet":ye,g||(v.as="script"),v.crossOrigin="",v.href=d,l&&v.setAttribute("nonce",l),document.head.appendChild(v),g)return new Promise((f,p)=>{v.addEventListener("load",f),v.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(n){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=n,window.dispatchEvent(s),!s.defaultPrevented)throw n}return r.then(n=>{for(const s of n||[])s.status==="rejected"&&a(s.reason);return t().catch(a)})};function be(e){const t=document.getElementById("annuncio-pagina");!t||!e||(t.textContent="",setTimeout(()=>{t.textContent=e},100))}const _="/Ricettario/";let Q={};function $e(e){Q=e}function Z(e){let t=e.replace(_,"").replace(/^\/+|\/+$/g,"");if(!t||t==="index.html")return{type:"home",params:{}};const o=t.match(/^ricette\/([^/]+)\/([^/]+?)(?:\.html)?$/);if(o)return{type:"recipe",params:{category:o[1],slug:o[2]}};const i=t.match(/^ricette\/([^/]+)\/?$/);if(i)return{type:"category",params:{category:i[1]}};const r=t.match(/^cottura(?:\/([^/]+?))?(?:\.html)?$/);return r?{type:"cottura",params:{config:r[1]||null}}:{type:"home",params:{}}}let H=!0;function N(){const e=document.getElementById("contenuto"),t=e?.querySelector("h1")||e;t&&(t.hasAttribute("tabindex")||t.setAttribute("tabindex","-1"),t.focus({preventScroll:!0}));const o=document.title.replace(/\s*[—-]\s*(Il )?Ricettario( Lab)?\s*$/i,"").trim();be(o?`${o}, pagina caricata`:"Pagina caricata")}async function P(e,t=!0){const o=new URL(e,window.location.origin);t&&history.pushState(null,"",o.pathname+o.search);const i=Z(o.pathname),r=document.getElementById("app");if(!r)return;window.scrollTo(0,0);const a=H;if(H=!1,"startViewTransition"in document){const n=document.startViewTransition(async()=>{await G(i,r)});a||n.updateCallbackDone.then(N).catch(()=>{})}else await G(i,r),a||N()}async function G(e,t){const o=Q[e.type];o?await o(t,e.params):(document.title="Pagina non trovata — Ricettario Lab",t.innerHTML=`<div class="container" style="padding: 80px 0; text-align: center;">
      <h1>Pagina non trovata</h1>
      <p><a href="${_}" data-link>← Torna alla Home</a></p>
    </div>`),M()}function M(){const e=document.querySelectorAll(".reveal:not(.visible)");if(e.length===0)return;const t=new IntersectionObserver(o=>{o.forEach(i=>{i.isIntersecting&&(i.target.classList.add("visible"),t.unobserve(i.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});e.forEach(o=>t.observe(o))}function we(){const e=sessionStorage.getItem("spa-redirect");e&&(sessionStorage.removeItem("spa-redirect"),history.replaceState(null,"",e)),document.addEventListener("click",t=>{const o=t.target.closest("a[href]");if(!o)return;const i=o.getAttribute("href"),r=o.getAttribute("data-nav-section");if(r){if(Z(window.location.pathname).type!=="home"){t.preventDefault(),P(_).then(()=>{setTimeout(()=>{const s=document.getElementById(r);s&&s.scrollIntoView({behavior:"smooth"})},100)});return}return}if(!i||i.startsWith("http")||i.startsWith("#")||i.startsWith("mailto:")||i.startsWith("tel:")||o.target==="_blank")return;t.preventDefault();const a=new URL(i,window.location.href);P(a.href)}),window.addEventListener("popstate",()=>{P(window.location.href,!1)}),P(window.location.href,!1)}const J="ricettario_fatte";function D(){try{const e=localStorage.getItem(J);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function xe(e){localStorage.setItem(J,JSON.stringify([...e]))}function Ee(e){return D().has(e)}function Ce(e){const t=D(),o=!t.has(e);return o?t.add(e):t.delete(e),xe(t),o}function I(){const e=D();if(e.size===0)return;document.querySelectorAll(".recipe-card--compact, .category-card").forEach(o=>{const i=o.getAttribute("href")||"",r=new URL(i,location.origin).pathname.split("/").filter(Boolean).pop();if(r&&e.has(r)&&!o.querySelector(".made-badge")){const a=document.createElement("span");a.className="made-badge",a.textContent="✓",a.title="Ricetta già fatta!";const n=o.querySelector(".recipe-card--compact__image-wrapper, .category-card__image-wrapper");n&&n.appendChild(a)}})}function ke(e){const t=document.getElementById("made-toggle");if(!t)return;const o=i=>{t.classList.toggle("made-toggle--active",i),t.innerHTML=i?'<span class="made-toggle__icon">✓</span> <span class="made-toggle__label">Fatta!</span>':'<span class="made-toggle__icon">○</span> <span class="made-toggle__label">Segna come fatta</span>',t.title=i?"Clicca per rimuovere":"Segna questa ricetta come fatta"};o(Ee(e)),t.addEventListener("click",i=>{i.preventDefault();const r=Ce(e);o(r),t.classList.add("made-toggle--pop"),setTimeout(()=>t.classList.remove("made-toggle--pop"),400)})}const Le={"arrow-up-right":'<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"grid-3x3":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',list:'<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>',microscope:'<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',moon:'<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',search:'<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'},K="http://www.w3.org/2000/svg",Se={xmlns:K,width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"};function Ae(e=document){for(const t of e.querySelectorAll("[data-lucide]")){const o=t.getAttribute("data-lucide"),i=Le[o];if(!i){console.warn(`[icons] icona "${o}" non disponibile: aggiungila a js/icons.js`);continue}const r=document.createElementNS(K,"svg");for(const[a,n]of Object.entries(Se))r.setAttribute(a,n);for(const a of t.attributes)a.name!=="data-lucide"&&r.setAttribute(a.name,a.value);r.setAttribute("class",`lucide lucide-${o}${t.className?" "+t.className:""}`),r.innerHTML=i,t.replaceWith(r)}}const z={pane:{name:"Pane",dir:"pane",emoji:"baguette-bread",unicode:"🥖",title:"Pane Artigianale",desc:"Ricette di pane ad alta idratazione — ciabatta, filone, baguette e pane speciale."},pizza:{name:"Pizza",dir:"pizza",emoji:"pizza",unicode:"🍕",title:"Pizza Artigianale",desc:"Pizze con lievitazione lunga — napoletana, in teglia, canotto e pinsa romana."},primi:{name:"Primi",dir:"primi",emoji:"tomato",unicode:"🥣",title:"Primi Piatti",desc:"Primi piatti della tradizione — gnocchi, polenta, zuppe e piatti unici caldi."},lievitati:{name:"Lievitati",dir:"lievitati",emoji:"croissant",unicode:"🥐",title:"Lievitati Dolci e Salati",desc:"Brioche, cornetti, panettone, burger buns e rosticceria."},focaccia:{name:"Focaccia",dir:"focaccia",emoji:"flatbread",unicode:"🫓",title:"Focaccia Artigianale",desc:"Focacce ad alta idratazione — genovese, barese, pugliese e varianti creative."},dolci:{name:"Dolci",dir:"dolci",emoji:"shortcake",unicode:"🍪",title:"Dolci e Pasticceria",desc:"Dolci tradizionali, frolle, biscotti e pasticceria artigianale."},conserve:{name:"Conserve",dir:"conserve",emoji:"canned-food",unicode:"🫙",title:"Conserve e Preparazioni",desc:"Conserve fatte in casa — dadi vegetali, salse, sottoli e preparazioni base."},condimenti:{name:"Condimenti",dir:"condimenti",emoji:"herb",unicode:"🌿",title:"Condimenti",desc:"Salse, pesti e condimenti artigianali per ogni piatto."},secondi_piatti:{name:"Secondi Piatti",dir:"secondi-piatti",emoji:"fork-and-knife",unicode:"🍲",title:"Secondi Piatti",desc:"Esplora ricette complete e saporite per i tuoi secondi piatti: carne, pesce, legumi e verdure."}},Me=["primi","pane","pizza","lievitati","dolci","focaccia","conserve","condimenti","secondi_piatti"],Ie=Object.fromEntries(Object.values(z).map(e=>[e.dir,e])),ee=Object.fromEntries(Object.values(z).map(e=>[e.name,e.emoji]));Object.values(z).map(e=>e.name);const Te={"shopping-cart":"shopping-cart","balance-scale":"balance-scale",peanuts:"peanuts",gear:"gear","sheaf-of-rice":"flatbread",fire:"fire","light-bulb":"light-bulb","open-book":"open-book",prohibited:"prohibited",warning:"warning",droplet:"droplet",thermometer:"thermometer",stopwatch:"stopwatch",wrench:"wrench","baguette-bread":"baguette-bread",pizza:"pizza",spaghetti:"spaghetti",croissant:"croissant",cookie:"cookie",flatbread:"flatbread",shortcake:"shortcake","canned-food":"canned-food",herb:"herb","fork-and-knife":"fork-and-knife",star:"star",house:"house","high-voltage":"high-voltage",bullseye:"bullseye",package:"package",tomato:"tomato"};function w(e,t,o=20,i=""){const r=Te[t]||t,a=`fluent-emoji${i?" "+i:""}`;return`<img src="${e}images/emoji/${r}.png" width="${o}" height="${o}" alt="" class="${a}" loading="lazy">`}function Re(e,t,o=20){const i=ee[t];return i?w(e,i,o):""}function A(e,t=20,o=""){return w(_,e,t,o)}const Pe=ee;function E(){Ae()}function c(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const m=c,je=/\{([a-zA-Z_][a-zA-Z0-9_]*):(\d+(?:\.\d+)?)(!)?\}/,te=()=>new RegExp(je.source,"g");function F(e){return e===0?"0":e>=10?`${Math.round(e)}`:e>=1?`${Math.round(e*10)/10}`:`${Math.round(e*100)/100}`}function ze(e){return String(e||"").replace(te(),(t,o,i,r)=>{const a=parseFloat(i);return`<span class="dose-inline" data-base="${a}" data-token-id="${o}"${r?' data-fixed="true"':""}>${F(a)}</span>`})}function Be(e){return String(e||"").replace(te(),(t,o,i)=>F(parseFloat(i)))}const Oe=["immagine esistente","caricata manualmente","provenienza non documentata"],De=["pexels","unsplash","pixabay","wikimedia","openverse","flickr"],V={"pexels license":"https://www.pexels.com/license/","unsplash license":"https://unsplash.com/license","pixabay license":"https://pixabay.com/service/license-summary/"};function Fe(e){const t=String(e??"").trim().toLowerCase();if(!t)return null;if(V[t])return V[t];const o=t.replace(/^cc\s+/,"");if(/^cc0\b/.test(o)||o==="zero")return"https://creativecommons.org/publicdomain/zero/1.0/";if(/^(public domain|pdm|dominio pubblico)\b/.test(o))return"https://creativecommons.org/publicdomain/mark/1.0/";const i=o.match(/^(by(?:-nc)?(?:-sa|-nd)?)\s+(\d\.\d)$/);return i?`https://creativecommons.org/licenses/${i[1]}/${i[2]}/`:null}function qe(e){const t=String(e??"").trim();if(!/^https:\/\//i.test(t))return null;const o=t.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/[a-z-]+\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)/i);if(o)return`https://commons.wikimedia.org/wiki/File:${o[1]}`;const i=t.match(/^https:\/\/images\.pexels\.com\/photos\/(\d+)\//i);return i?`https://www.pexels.com/photo/${i[1]}/`:/^https:\/\/(commons\.wikimedia\.org\/wiki\/|www\.pexels\.com\/photo\/|unsplash\.com\/photos\/|pixabay\.com\/[a-z-]+\/|openverse\.org\/image\/|www\.flickr\.com\/photos\/)/i.test(t)?t:null}function He(e,t){const o=String(e??"").trim();if(!o)return null;const i=o.replace(/^📷\s*/,"").replace(/^Foto:\s*/i,"").trim();if(!i||Oe.includes(i.toLowerCase()))return null;const r=i.split(/\s+[—–]\s+/),a=r[0].trim();if(!a)return null;let n=null,s=null;if(r.length>1){const l=r.slice(1).join(" — ").trim(),d=l.match(/^(.*?)\s+via\s+(.+)$/i);d?(n=d[1].trim()||null,s=d[2].trim()):De.includes(l.toLowerCase())?s=l:n=l||null}return{autore:a,licenza:n,fonte:s,urlLicenza:Fe(n),urlFonte:qe(t)}}function Ne(e,t){const o=He(e,t);if(!o)return"";const i=(n,s,l)=>s?`<a href="${c(s)}" target="_blank" rel="${l}">${c(n)}</a>`:c(n),r=!!(o.licenza&&!o.urlLicenza&&o.urlFonte);let a=`Foto: ${c(o.autore)}`;return o.licenza&&(a+=r?` — ${i(o.licenza,o.urlFonte,"noopener nofollow")}`:` — ${i(o.licenza,o.urlLicenza,"license noopener nofollow")}`),o.fonte?a+=` via ${i(o.fonte,r?null:o.urlFonte,"noopener nofollow")}`:o.urlFonte&&!r&&(a+=` — ${i("fonte",o.urlFonte,"noopener nofollow")}`),a}const Ge=["n/a","na","nessuna","nessuno","none","null","0","-","—"];function x(e){if(e==null)return!1;const t=String(e).trim();return t!==""&&!Ge.includes(t.toLowerCase())}function oe(e){const t=e.replace(/\.(jpg|jpeg|png|webp)$/i,"");return{avif:`${t}.avif`,webp:`${t}.webp`}}function ie(e,t,o="",i="lazy"){if(!e)return"";const{avif:r,webp:a}=oe(e),n=o?` class="${m(o)}"`:"",s=i?` loading="${m(i)}"`:"";return`<picture>
  <source srcset="${m(r)}" type="image/avif">
  <source srcset="${m(a)}" type="image/webp">
  <img src="${m(a)}" alt="${m(t)}"${n}${s}>
</picture>`}function Ve(e,t){if(!e)return"";const{avif:o,webp:i}=oe(e);return`<picture class="recipe-hero__picture">
  <source srcset="${m(o)}" type="image/avif">
  <source srcset="${m(i)}" type="image/webp">
  <img src="${m(i)}" alt="${m(t)}" class="recipe-hero__img">
</picture>`}function Ue(e){return e.replace(/class="([^"]*)"/g,(t,o)=>`class="${o.split(/\s+/).filter(r=>r&&r!=="reveal"&&!/^reveal-delay-\d$/.test(r)).join(" ")}"`)}function We(e,{base:t,categoryDir:o,interattivo:i=!0}){const r={base:t,interattivo:i,emoji:(d,g)=>w(t,d,g),testoStep:d=>i?ze(c(d)):c(Be(d))},a=Re(t,e.category,22),n=e.image?`${t}${String(e.image).replace(/^\//,"")}`:`${t}images/ricette/${o}/${e.slug}.webp`,s=Ne(e.imageAttribution,e._originalImageUrl),l=`
    <!-- ═══════════ RECIPE HERO ═══════════ -->
    ${s?'<figure class="recipe-foto">':""}
    <div class="recipe-hero">
      ${Ve(n,e.title)}
      <div class="container">
        <nav class="breadcrumb reveal">
          <a href="${t}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${t}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${m(t)}ricette/${m(o)}/" data-link>${c(e.category)}</a>
          <span class="breadcrumb__separator">›</span>
          <span>${c(e.title)}</span>
        </nav>

        <div class="recipe-hero__content">
          <div class="recipe-hero__tags reveal">
            <span class="tag tag--category">${a} ${c(e.category)}</span>
          </div>
          <h1 class="recipe-hero__title reveal reveal-delay-1">${c(e.title)}</h1>
          <p class="recipe-hero__subtitle reveal reveal-delay-2">${c(e.subtitle||e.description)}</p>
        </div>
      </div>
    </div>
    ${s?`<figcaption class="recipe-foto__credito"><div class="container">${s}</div></figcaption></figure>`:""}

    <!-- ═══════════ TECH BADGES ═══════════ -->
    <div class="container" style="padding-top: 40px;">
      <div class="tech-badges reveal">
        ${x(e.hydration)?`<div class="tech-badge">${r.emoji("droplet",18)} Idratazione: <span class="tech-badge__value">&nbsp;${c(e.hydration)}%</span></div>`:""}
        ${x(e.targetTemp)?`<div class="tech-badge">${r.emoji("thermometer",18)} Target Temp: <span class="tech-badge__value">&nbsp;${c(e.targetTemp)}</span></div>`:""}
        ${x(e.fermentation)?`<div class="tech-badge">${r.emoji("stopwatch",18)} Lievitazione: <span class="tech-badge__value">&nbsp;${c(e.fermentation)}</span></div>`:""}
        ${i?'<button class="made-toggle" id="made-toggle" type="button" aria-label="Segna come fatta"></button>':""}
      </div>
    </div>

    <!-- ═══════════ RECIPE CONTENT ═══════════ -->
    <section class="recipe-content" id="recipe-content">
      <div class="container">
        <div class="recipe-layout">

          <!-- COLONNA SX: Ingredienti -->
          <div>
            ${Ye(e,r)}
            ${e.suspensions?.length?Qe(e,r):""}
          </div>

          <!-- COLONNA DX: Procedimento -->
          <div>
            ${Ze(e,r)}
            ${Je(e,r)}
          </div>

        </div>

        ${Ke(e,r)}
        ${et(e,r)}
        ${tt(e,r)}
        ${ot(e,r)}
        ${it(e,r)}
        ${rt(e,r)}
        ${at(e,r)}
      </div>
    </section>
  `;return i?l:Ue(l)}function U(e){return`<tr${e.excludeFromTotal?' data-exclude-total="true"':""}>
    <th scope="row">${c(e.name)} ${e.note?`<span class="ingredient-note">${c(e.note)}</span>`:""}</th>
    <td class="ingredient-qty">${e.grams!=null?`${c(e.grams)}g`:""}</td>
  </tr>`}function Xe(e){const o=(e.ingredientGroups?.length?e.ingredientGroups.flatMap(i=>i.items||[]):e.ingredients||[]).filter(i=>i&&!i.excludeFromTotal&&typeof i.grams=="number").reduce((i,r)=>i+r.grams,0);return o<=0?"":o>=1e3?`~${(o/1e3).toFixed(1)}kg`:`${Math.round(o)}g`}function Ye(e,t){const o=e.ingredientGroups?.length>0,i=e.ingredients?.length>0;if(!o&&!i)return"";let r;o?r=e.ingredientGroups.map(n=>{if(!n.items?.length)return"";const s=`<tr class="ingredient-section-header"><th colspan="2" scope="colgroup">${c(n.group||"Ingredienti")}</th></tr>`,l=n.items.map(U).join("");return s+l}).join(""):r=e.ingredients.map(U).join("");const a=t.interattivo?`
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
      ${a}
      <table class="ingredients-table" id="ingredients-table" aria-label="Ingredienti e quantità">
        ${r}
        <tr class="ingredient-total-row" id="ingredient-total-row">
          <th scope="row">Peso Totale Impasto</th>
          <td class="ingredient-qty" id="ingredient-total-qty">${t.interattivo?"":Xe(e)}</td>
        </tr>
      </table>
    </div>`}function Qe(e,t){const o=e.suspensions.map(i=>`
    <tr>
      <th scope="row">${c(i.name)} ${i.note?`<span class="ingredient-note">${c(i.note)}</span>`:""}</th>
      <td class="ingredient-qty">${i.grams!=null?`${c(i.grams)}g`:""}</td>
    </tr>
  `).join("");return`
    <div class="recipe-panel reveal" style="margin-top: 24px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("peanuts",24)}</span> Ingredienti Aggiuntivi / Sospensioni
      </h2>
      <table class="ingredients-table" id="suspensions-table" aria-label="Ingredienti aggiuntivi e quantità">${o}</table>
    </div>`}function Ze(e,t){const o=e.steps;return o?.length?`
    <div class="recipe-panel reveal reveal-delay-1" id="steps-panel">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("gear",24)}</span> Procedimento
      </h2>
      <ol class="steps-list">
        ${o.map(i=>`<li class="step-item">
            <strong>${c(i.title)}</strong>
            <p>${t.testoStep(i.text)}</p>
          </li>`).join("")}
      </ol>
    </div>`:""}function Je(e,t){const o=e.stepsCondiment;return o?.length?`
    <div class="recipe-panel reveal reveal-delay-2" id="steps-condimento" style="margin-top: 32px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("tomato",24)}</span> Preparazione Condimento
      </h2>
      <ol class="steps-list">
        ${o.map(i=>`<li class="step-item">
            <strong>${c(i.title)}</strong>
            <p>${t.testoStep(i.text)}</p>
          </li>`).join("")}
      </ol>
    </div>`:""}function Ke(e,t){if(!e.sensoryProfile||!e.sensoryProfile.axes||e.sensoryProfile.axes.length===0)return"";const o=e.sensoryProfile.axes.reduce((n,s)=>s.value>n.value?s:n,e.sensoryProfile.axes[0]),i=e.sensoryProfile.summary?`
    <div class="sensory-note">
      <h3 class="sensory-note__title">Note di Degustazione</h3>
      <p class="sensory-note__text">"${c(e.sensoryProfile.summary)}"</p>
    </div>
  `:"";let r="";if(e.nutrition&&e.nutrition.macros){const n=Number(e.nutrition.macros.carbs)||0,s=Number(e.nutrition.macros.protein)||0,l=Number(e.nutrition.macros.fat)||0,d=n+s+l,g=d>0?n/d*100:0,h=d>0?s/d*100:0,v=d>0?l/d*100:0,f=`
        <div class="nutrition-content">
          <div class="nutrition-kcal">
              <span class="nutrition-kcal__value">${c(e.nutrition.kcal_per_100g)}</span>
              <span class="nutrition-kcal__unit">Kcal</span>
          </div>

          <div class="nutrition-bar">
            <div class="nutrition-bar__segment nutrition-bar__segment--carbs" style="width: ${g}%;" title="Carboidrati"></div>
            <div class="nutrition-bar__segment nutrition-bar__segment--prot" style="width: ${h}%;" title="Proteine"></div>
            <div class="nutrition-bar__segment nutrition-bar__segment--fat" style="width: ${v}%;" title="Grassi"></div>
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
              <span>Grassi <strong>${l}g</strong></span>
            </div>
          </div>

          <p class="nutrition-disclaimer">
            <em>Disclaimer: Valori medi calcolati tramite database USDA per l'intera ricetta. Considerano il calo peso da evaporazione. I valori effettivi possono variare in base ai marchi commerciali usati.</em>
          </p>
        </div>`;r=t.interattivo?`
      <details class="nutrition-toggle">
        <summary class="nutrition-toggle__btn">
          <i data-lucide="microscope" class="nutrition-toggle__icon"></i> Analisi Nutrizionale
        </summary>
${f}
      </details>
      `:`
      <h3 class="sensory-note__title">Analisi Nutrizionale</h3>
${f}`}const a=e.sensoryProfile.axes.map(n=>`<tr><th scope="row">${c(n.label)}</th><td>${c(n.value)} su 10</td></tr>`).join("");return t.interattivo?`
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
            👑 Tratto Dominante: ${c(o.label)} (${c(o.value)}/10)
          </span>
        </div>

        <div class="sensory-canvas-wrap">
          <canvas id="sensoryChart" aria-hidden="true"></canvas>
          <table class="solo-lettore" aria-label="Profilo sensoriale, in scala da 1 a 10">
            <tbody>${a}</tbody>
          </table>
        </div>

        ${i}
        ${r}

      </div>
    </div>
  `:`
    <div class="recipe-panel sensory-panel recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span><span class="recipe-panel__title-icon">${t.emoji("star",24)}</span> Dati Tecnici & Sensoriali</span>
      </h2>
      <div class="sensory-dominant">
        <span class="sensory-dominant__badge">
          👑 Tratto Dominante: ${c(o.label)} (${c(o.value)}/10)
        </span>
      </div>
      <table class="ingredients-table" aria-label="Profilo sensoriale, in scala da 1 a 10">
        <tbody>${a}</tbody>
      </table>
      ${i}
      ${r}
    </div>`}function et(e,t){return e.flourTable?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("flatbread",24)}</span> Consigli Farine & Marchi
      </h2>
      <table class="flour-table">
        <thead><tr><th>Tipo Farina</th><th>Forza (W)</th><th>Marchi Consigliati</th></tr></thead>
        <tbody>
          ${e.flourTable.map(o=>`
            <tr>
              <td>${c(o.type)}</td>
              <td class="flour-table__w">${c(o.w||"-")}</td>
              <td>${c(o.brands||"")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="pro-tip-box">
        <p><strong>${t.emoji("light-bulb",18)} PRO TIP:</strong> La forza (W) è il parametro chiave. Se non trovi i marchi suggeriti, cerca qualsiasi farina con il valore W indicato.</p>
      </div>
    </div>`:""}function tt(e,t){return e.alert?`
    <div class="alert alert--danger reveal recipe-panel--spaced">
      <span class="alert__icon">${t.emoji("prohibited",28)}</span>
      <div class="alert__content">
        <strong>ALERT PROFESSIONALE</strong>
        <p>${t.emoji("warning",18)} ${c(e.alert)}</p>
      </div>
    </div>`:""}function ot(e,t){if(!e.baking)return"";const o=e.baking;return`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("fire",24)}</span> Cottura
      </h2>
      <div class="tech-badges">
        ${o.temperature?`<div class="tech-badge">${t.emoji("thermometer",18)} Temperatura: <span class="tech-badge__value">&nbsp;${c(o.temperature)}</span></div>`:""}
        ${o.time?`<div class="tech-badge">${t.emoji("stopwatch",18)} Tempo: <span class="tech-badge__value">&nbsp;${c(o.time)}</span></div>`:""}
      </div>
      ${o.tips?.length?`<ul class="tip-list">
        ${o.tips.map(i=>`<li class="tip-item">${t.emoji("light-bulb",16)} ${c(i)}</li>`).join("")}
      </ul>`:""}
    </div>`}function it(e,t){return e.proTips?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("light-bulb",24)}</span> Pro Tips
      </h2>
      <ul class="tip-list">
        ${e.proTips.map(o=>`<li class="tip-item">${t.emoji("light-bulb",16)} ${c(o)}</li>`).join("")}
      </ul>
    </div>`:""}function rt(e,t){return e.storage?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("package",24)}</span> Conservazione
      </h2>
      <ul class="tip-list">
        ${e.storage.map(o=>`<li class="tip-item">${t.emoji("package",16)} ${c(o)}</li>`).join("")}
      </ul>
    </div>`:""}function at(e,t){return e.glossary?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${t.emoji("open-book",24)}</span> Glossario
      </h2>
      <dl class="glossary-list">
        ${e.glossary.map(o=>`
          <dt class="glossary-term">${c(o.term)}</dt>
          <dd class="glossary-def">${c(o.definition)}</dd>
        `).join("")}
      </dl>
    </div>`:""}async function nt(e,{category:t,slug:o}){e.innerHTML=`
    <div class="recipe-loading">
      <div class="recipe-loading__spinner"></div>
      <p>Caricamento ricetta...</p>
    </div>`;try{const i=`${_}ricette/${t}/${o}.json`,r=await fetch(i);if(!r.ok)throw new Error(`Ricetta non trovata (${r.status})`);const a=await r.json();document.title=`${a.title} — Ricettario Lab`;const n=document.querySelector('meta[name="description"]');n&&n.setAttribute("content",a.description||""),e.innerHTML=We(a,{base:_,categoryDir:t,interattivo:!0}),st(a),ke(a.slug),lt(a),E()}catch(i){document.title="Ricetta non trovata — Ricettario Lab",e.innerHTML=`
      <div class="container" style="padding: 120px 0; text-align: center;">
        <h1>${A("prohibited",28)} Ricetta non trovata</h1>
        <p style="color: var(--color-text-muted);">${c(i.message)}</p>
        <a href="${_}" data-link class="btn-back">${A("fire",16)} Torna alla Home</a>
      </div>`}}function st(e){const t=document.getElementById("dose-badge"),o=document.getElementById("dose-decrease"),i=document.getElementById("dose-increase");if(!t||!o||!i)return;const r=.25,a=.25;let n=1;const s=[],l=e.ingredientGroups?.length?e.ingredientGroups.flatMap(p=>p.items||[]):e.ingredients||[],d=["ingredients-table","suspensions-table"],g=[l,e.suspensions||[]];d.forEach((p,y)=>{const $=document.getElementById(p);if(!$)return;const C=$.querySelectorAll("tr:not(.ingredient-section-header)"),b=g[y];let S=0;for(const T of b){if(T.grams==null)continue;if(S>=C.length)break;const R=C[S]?.querySelector(".ingredient-qty");R&&s.push({baseGrams:T.grams,cell:R}),S++}});const h=p=>p===0?"0g":p>=10?`${Math.round(p)}g`:p>=1?`${Math.round(p*10)/10}g`:`${Math.round(p*100)/100}g`,v=p=>{if(Number.isInteger(p))return`×${p}`;const y=Math.round(p*10)/10;return Math.abs(p-y)<.001?`×${y.toFixed(1)}`:`×${p.toFixed(2)}`},f=()=>{t.textContent=v(n),t.classList.toggle("dose-calculator__display--modified",n!==1),o.disabled=n<=a,s.forEach(({baseGrams:p,cell:y})=>{const $=y.getAttribute("data-base"),C=$!==null?parseFloat($):p;y.textContent=h(C*n),y.getAnimations().forEach(b=>b.cancel()),y.classList.remove("dose-updated"),requestAnimationFrame(()=>y.classList.add("dose-updated"))}),document.querySelectorAll(".dose-inline:not([data-fixed])").forEach(p=>{const y=parseFloat(p.getAttribute("data-base"));isNaN(y)||(p.textContent=F(y*n),p.getAnimations().forEach($=>$.cancel()),p.classList.remove("dose-updated"),requestAnimationFrame(()=>p.classList.add("dose-updated")))}),ct()};o.addEventListener("click",()=>{const p=Math.round((n-r)*100)/100;p>=a&&(n=p,f())}),i.addEventListener("click",()=>{n=Math.round((n+r)*100)/100,f()}),f()}function ct(){const e=document.getElementById("ingredient-total-qty");if(!e)return;let t=0;const o=document.getElementById("ingredients-table");if(!o)return;o.querySelectorAll("tr:not(.ingredient-section-header):not(.ingredient-total-row):not([data-exclude-total]) .ingredient-qty").forEach(r=>{const a=r.textContent.trim(),n=parseFloat(a);isNaN(n)||(t+=n)});const i=t>=1e3?`~${(t/1e3).toFixed(1)}kg`:`${Math.round(t)}g`;e.textContent=i,e.classList.remove("dose-updated"),e.offsetWidth,e.classList.add("dose-updated")}let B=null;function lt(e){const t=document.getElementById("sensory-header");if(!t)return;const o=document.getElementById("sensory-chart-container");if(!o)return;const i=()=>t.querySelector(".sensory-chevron"),r=e.sensoryProfile?.axes;if(!r?.length)return;const a={labels:r.map(s=>s.label),values:r.map(s=>s.value)};let n=null;t.addEventListener("click",async()=>{const s=o.style.display==="none"||!o.style.display;if(t.setAttribute("aria-expanded",String(s)),s){if(o.style.display="block",i()?.style.setProperty("transform","rotate(180deg)"),!B)try{const{Chart:b,RadarController:S,RadialLinearScale:T,PointElement:R,LineElement:ce,Filler:le,Tooltip:de}=await O(async()=>{const{Chart:pe,RadarController:ue,RadialLinearScale:ge,PointElement:me,LineElement:he,Filler:fe,Tooltip:_e}=await import("./chart-Cns13J0s.js");return{Chart:pe,RadarController:ue,RadialLinearScale:ge,PointElement:me,LineElement:he,Filler:fe,Tooltip:_e}},[]);b.register(S,T,R,ce,le,de),B=b}catch(b){console.error("Errore caricamento Chart.js:",b);return}n&&(n.destroy(),n=null);const l=document.getElementById("sensoryChart")?.getContext("2d");if(!l)return;const{labels:d,values:g}=a,h=window.innerWidth<600,v=d.map(b=>h&&b.includes(" ")?b.split(" "):b),f=document.documentElement.getAttribute("data-theme")==="dark",p=f?"rgba(212, 165, 116, 0.8)":"rgba(184, 129, 58, 0.8)",y=f?"rgba(212, 165, 116, 0.2)":"rgba(184, 129, 58, 0.2)",$=f?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.1)",C=f?"#94a3b8":"#64748b";n=new B(l,{type:"radar",data:{labels:v,datasets:[{label:"Valore",data:g,backgroundColor:y,borderColor:p,pointBackgroundColor:p,pointBorderColor:"#fff",pointHoverBackgroundColor:"#fff",pointHoverBorderColor:p,borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!0,layout:{padding:h?10:20},scales:{r:{min:0,max:10,angleLines:{color:$},grid:{color:$},pointLabels:{color:C,font:{family:"Inter",size:h?10:12,weight:"500"}},ticks:{display:!1,stepSize:2}}},plugins:{legend:{display:!1},tooltip:{backgroundColor:f?"#1e293b":"#fff",titleColor:f?"#f8fafc":"#0f172a",bodyColor:f?"#cbd5e1":"#475569",borderColor:f?"#334155":"#e2e8f0",borderWidth:1,padding:10,displayColors:!1,callbacks:{label:b=>b.formattedValue+" / 10"}}}}})}else o.style.display="none",i()?.style.setProperty("transform","rotate(0deg)")})}function dt(){return`
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

    </svg>`}function pt(){return`
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
        ${dt()}
      </div>

      <!-- Phase 7: Title text -->
      <div class="logo-intro__text">Il Ricettario</div>

      <!-- Phase 7b: Subtitle -->
      <div class="logo-intro__subtitle">Laboratorio Artigianale</div>
    </div>
  `}function ut(){if(sessionStorage.getItem("intro-shown"))return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){sessionStorage.setItem("intro-shown","1");return}O(()=>Promise.resolve({}),__vite__mapDeps([0]));const e=()=>{document.body.insertAdjacentHTML("afterbegin",pt()),gt(),sessionStorage.setItem("intro-shown","1")};document.body?e():document.addEventListener("DOMContentLoaded",e,{once:!0})}function gt(){const e=document.getElementById("logo-intro"),t=document.getElementById("logo-intro-logo");if(!e)return;document.documentElement.style.overflow="hidden";const o=setTimeout(()=>{t&&t.classList.add("glowing")},1700);e.addEventListener("animationend",i=>{i.animationName==="introOverlayOut"&&(document.documentElement.style.overflow="",e.classList.add("logo-intro--done"),requestAnimationFrame(()=>e.remove()),clearTimeout(o))}),setTimeout(()=>{document.getElementById("logo-intro")&&(document.documentElement.style.overflow="",e.remove())},5e3)}function re(e,{base:t}){const o=`${t}ricette/${e.categoryDir}/${e.slug}/`;return`
      <a href="${m(o)}" class="category-card" data-link
         data-title="${m((e.title||"").toLowerCase())}"
         data-hydration="${parseInt(e.hydration)||0}">
        <div class="category-card__image-wrapper">
          ${e.image?ie(`${t}${e.image}`,"","category-card__image","lazy"):""}
          <div class="category-card__meta">
            ${x(e.hydration)?`<span class="category-card__tag">${w(t,"droplet",14)} ${c(e.hydration)}</span>`:""}
            ${x(e.time)?`<span class="category-card__tag">${w(t,"stopwatch",14)} ${c(e.time)}</span>`:""}
          </div>
        </div>
        <div class="category-card__body">
          <h2 class="category-card__title">${c(e.title)}</h2>
          ${e.description?`<p class="category-card__desc">${c(e.description)}</p>`:""}
        </div>
      </a>`}function mt(e){return Array.from({length:e},()=>`
    <div class="category-card category-card--skeleton">
      <div class="category-card__image-wrapper"></div>
      <div class="category-card__body">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
      </div>
    </div>`).join("")}function ht(e,t,{base:o,interattivo:i=!0,viewMode:r="grid"}){const a="⏳ Caricamento...",n=i?`
        <div class="category-toolbar" id="category-toolbar">
          <div class="category-toolbar__search">
            <span class="category-toolbar__search-icon"><i data-lucide="search" style="width:16px;height:16px"></i></span>
            <input type="text" class="category-toolbar__search-input" id="category-search"
              placeholder="Cerca tra le ricette di ${m(e.name.toLowerCase())}...">
          </div>
          <div class="category-toolbar__results" id="results-counter"></div>
          <div class="category-toolbar__sort">
            <button class="category-toolbar__sort-btn active" data-sort="az">A-Z</button>
            <button class="category-toolbar__sort-btn" data-sort="hydration">${w(o,"droplet",14)} Idratazione</button>
          </div>
          <div class="category-toolbar__views">
            <button class="view-toggle-btn ${r==="grid"?"active":""}" data-view="grid" aria-label="Vista griglia">
              <i data-lucide="grid-3x3" style="width:16px;height:16px"></i>
            </button>
            <button class="view-toggle-btn ${r==="list"?"active":""}" data-view="list" aria-label="Vista lista">
              <i data-lucide="list" style="width:16px;height:16px"></i>
            </button>
          </div>
        </div>`:"",s=i?mt(6):t.map(l=>re(l,{base:o})).join("");return`
    <section class="category-hero" id="category-hero">
      <div class="category-hero__content">
        <h1 class="category-hero__title">${c(e.title)}</h1>
        <p class="category-hero__subtitle">${c(e.desc)}</p>
        <div class="category-hero__count" id="recipe-count">${a}</div>
      </div>
    </section>

    <!-- Qui ci vuole una "section", non un "main": il landmark principale è
         quello del guscio, che avvolge #app e sopravvive ai cambi di rotta.
         Uno annidato dentro l'altro è markup non valido. -->
    <section class="section">
      <div class="container">
        <nav class="breadcrumb">
          <a href="${o}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${o}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <span class="breadcrumb__current">${c(e.name)}</span>
        </nav>
        ${n}
        <div class="category-grid ${r==="list"?"category-grid--list":""}" id="category-grid">
          ${s}
        </div>

        ${i?'<div id="load-more-container"></div>':""}
      </div>
    </section>
  `}function ft(e,{base:t}){const o=`${t}ricette/${e.categoryDir}/${e.slug}/`;return`
          <a href="${m(o)}" class="recipe-card--compact" data-link data-title="${m((e.title||"").toLowerCase())}" data-category="${m(e.category)}">
            <div class="recipe-card--compact__image-wrapper">
              ${e.image?ie(`${t}${e.image}`,"","recipe-card--compact__image","lazy"):""}
            </div>
            <div class="recipe-card--compact__body">
              <h4 class="recipe-card--compact__title">${c(e.title)}</h4>
              <div class="recipe-card--compact__meta">
                ${x(e.hydration)?`<span class="recipe-card--compact__tag">${w(t,"droplet",16)} ${c(e.hydration)}</span>`:""}
                ${x(e.time)?`<span>${w(t,"stopwatch",16)} ${c(e.time)}</span>`:""}
              </div>
            </div>
          </a>`}function _t(e,t,o,i,{base:r}){return`
    <div class="category-row__header">
      <h3 class="category-row__title">
        ${w(r,t,32)} ${c(e)}
        <span class="category-row__count">${i.length} ricett${i.length===1?"a":"e"}</span>
      </h3>
      <a href="${m(`${r}ricette/${o}/`)}" class="category-row__link" data-link>Vedi tutte</a>
    </div>
    <div class="category-row__carousel-wrapper">
      <div class="category-row__carousel">
        ${i.map(a=>ft(a,{base:r})).join("")}
      </div>
    </div>
  `}const ae="?v=0291d9c4";ut();document.addEventListener("DOMContentLoaded",()=>{yt(),vt(),bt();const e=document.getElementById("current-year");e&&(e.textContent=new Date().getFullYear()),E(),wt(),$e({home:Et,recipe:nt,category:kt,cottura:async(t,o)=>{const{renderCottura:i}=await O(async()=>{const{renderCottura:r}=await import("./pagina-w6ineq97.js");return{renderCottura:r}},__vite__mapDeps([1,2]));return i(t,o)}}),we()});function yt(){const e=document.getElementById("navbar");if(!e)return;const t=()=>e.classList.toggle("scrolled",window.scrollY>50);window.addEventListener("scroll",t,{passive:!0}),t()}function vt(){const e=document.getElementById("theme-toggle");e&&(e.addEventListener("click",()=>{const o=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";e.classList.add("theme-toggle--switching"),setTimeout(()=>e.classList.remove("theme-toggle--switching"),400),document.documentElement.setAttribute("data-theme",o),window.applicaColoreBarra?.(o),localStorage.setItem("theme",o)}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",t=>{if(!localStorage.getItem("theme")){const o=t.matches?"dark":"light";document.documentElement.setAttribute("data-theme",o),window.applicaColoreBarra?.(o)}}))}function bt(){const e=document.getElementById("hamburger"),t=document.getElementById("nav-links");!e||!t||(e.addEventListener("click",()=>{e.classList.toggle("open"),t.classList.toggle("open")}),t.querySelectorAll("a").forEach(o=>{o.addEventListener("click",()=>{e.classList.remove("open"),t.classList.remove("open")})}),document.addEventListener("click",o=>{!e.contains(o.target)&&!t.contains(o.target)&&(e.classList.remove("open"),t.classList.remove("open"))}))}let k=null;function $t(e){const t=new URL(_,window.location.origin),o=i=>!i||/^([a-z]+:|\/\/|\/|#)/i.test(i)?i:new URL(i,t).pathname;e.querySelectorAll("[src], [href], [srcset]").forEach(i=>{["src","href"].forEach(a=>{const n=i.getAttribute(a);n&&i.setAttribute(a,o(n))});const r=i.getAttribute("srcset");r&&i.setAttribute("srcset",r.split(",").map(a=>{const[n,...s]=a.trim().split(/\s+/);return[o(n),...s].join(" ")}).join(", "))})}function ne(e,t,o){const i=e.cloneNode(!0);return $t(i),{html:i.innerHTML,title:t,description:o}}function wt(){const e=document.getElementById("app");e?.querySelector("#ricette")&&(k=ne(e,document.title,document.querySelector('meta[name="description"]')?.getAttribute("content")||""))}async function xt(){if(k)return k;const e=await fetch(_),t=new DOMParser().parseFromString(await e.text(),"text/html"),o=t.getElementById("app");if(!o)throw new Error("index.html non contiene #app");return k=ne(o,t.title,t.querySelector('meta[name="description"]')?.getAttribute("content")||""),k}async function Et(e){if(!e.querySelector("#ricette"))try{const o=await xt();e.innerHTML=o.html}catch(o){console.error("Impossibile ricostruire la homepage:",o),window.location.assign(_);return}const t=k;if(t){document.title=t.title;const o=document.querySelector('meta[name="description"]');o&&o.setAttribute("content",t.description)}E(),St(),M()}const L=12,Ct=Ie;let u={allRecipes:[],filteredRecipes:[],displayedCount:L,viewMode:"grid",sortType:"az",searchQuery:"",categoryDir:""};async function kt(e,{category:t}){const o=Ct[t];if(!o){document.title="Categoria non trovata — Ricettario Lab",e.innerHTML=`
      <div class="container" style="padding: 120px 0; text-align: center;">
        <h1>${A("prohibited",28)} Categoria non trovata</h1>
        <p style="color: var(--color-text-muted);">La categoria "${c(t)}" non esiste (o non esiste più).</p>
        <p><a href="${_}#ricette" data-link>← Vedi tutte le ricette</a></p>
      </div>`,E();return}document.title=`${o.title} — Il Ricettario`;const i=document.querySelector('meta[name="description"]');i&&i.setAttribute("content",o.desc),u={allRecipes:[],filteredRecipes:[],displayedCount:L,viewMode:localStorage.getItem("catViewMode")||"grid",sortType:"az",searchQuery:"",categoryDir:t},e.innerHTML=ht(o,null,{base:_,interattivo:!0,viewMode:u.viewMode}),E();try{const a=await(await fetch(`${_}recipes.json${ae}`)).json();u.allRecipes=a.recipes.filter(l=>l.categoryDir===t||l.category===o.name),u.allRecipes.sort((l,d)=>(l.title||"").localeCompare(d.title||"","it")),u.filteredRecipes=[...u.allRecipes];const n=u.allRecipes.find(l=>l.image);if(n){const l=document.getElementById("category-hero");l&&(l.style.backgroundImage=`url('${_}${n.image}')`)}const s=document.getElementById("recipe-count");s&&(s.innerHTML=`${A("bullseye",16)} ${u.allRecipes.length} ricett${u.allRecipes.length===1?"a":"e"}`),j(),Lt(e),M(),I()}catch(r){console.error("Errore caricamento categoria:",r);const a=document.getElementById("category-grid");a&&(a.innerHTML=`<div class="category-empty"><div class="category-empty__icon">${A("prohibited",32)}</div><p>Errore nel caricamento delle ricette.</p></div>`)}}function Lt(e){const t=document.getElementById("category-search");let o;t&&t.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(()=>{u.searchQuery=t.value.toLowerCase().trim(),u.displayedCount=L,W(),j()},150)});const i=e.querySelectorAll(".category-toolbar__sort-btn");i.forEach(a=>{a.addEventListener("click",()=>{i.forEach(n=>n.classList.remove("active")),a.classList.add("active"),u.sortType=a.dataset.sort,u.displayedCount=L,W(),j()})});const r=e.querySelectorAll(".view-toggle-btn");r.forEach(a=>{a.addEventListener("click",()=>{r.forEach(s=>s.classList.remove("active")),a.classList.add("active"),u.viewMode=a.dataset.view,localStorage.setItem("catViewMode",u.viewMode);const n=document.getElementById("category-grid");n&&n.classList.toggle("category-grid--list",u.viewMode==="list")})})}function W(){let e=[...u.allRecipes];u.searchQuery&&(e=e.filter(t=>{const o=(t.title||"").toLowerCase(),i=(t.description||"").toLowerCase();return o.includes(u.searchQuery)||i.includes(u.searchQuery)})),u.sortType==="az"?e.sort((t,o)=>(t.title||"").localeCompare(o.title||"","it")):u.sortType==="hydration"&&e.sort((t,o)=>(parseInt(o.hydration)||0)-(parseInt(t.hydration)||0)),u.filteredRecipes=e}function j(){const e=document.getElementById("category-grid"),t=document.getElementById("load-more-container");if(!e)return;const{filteredRecipes:o,displayedCount:i}=u,r=o.slice(0,i),a=o.length,n=document.getElementById("results-counter");if(n&&(u.searchQuery?n.innerHTML=`<strong>${a}</strong> risultat${a===1?"o":"i"}`:n.innerHTML=`<strong>${Math.min(i,a)}</strong> di <strong>${a}</strong>`),a===0){e.innerHTML=`
      <div class="category-empty" style="grid-column: 1 / -1">
        <div class="category-empty__icon"><i data-lucide="search" style="width:32px;height:32px"></i></div>
        <p>Nessuna ricetta trovata</p>
      </div>`,t&&(t.innerHTML=""),E();return}if(e.innerHTML=r.map(s=>re(s,{base:_})).join(""),t)if(i<a){const s=a-i,l=Math.round(i/a*100);t.innerHTML=`
        <div class="load-more-wrapper">
          <button class="load-more-btn" id="load-more-btn">
            <span>Carica altre ${Math.min(s,L)} ricette</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="load-more-progress">${i} di ${a} ricette</div>
          <div class="load-more-bar"><div class="load-more-bar__fill" style="width: ${l}%"></div></div>
        </div>`,document.getElementById("load-more-btn")?.addEventListener("click",()=>{u.displayedCount+=L,j(),setTimeout(()=>{const g=e.querySelectorAll(".category-card")[i];g&&g.scrollIntoView({behavior:"smooth",block:"center"})},100),I()})}else t.innerHTML="";E(),I()}function X(e,t,o,i,r){const a=document.createElement("div");a.className="category-row reveal",a.dataset.category=t,a.innerHTML=_t(t,o,i,r,{base:_}),e.appendChild(a),se(a)}function se(e){if(e.dataset.attivo)return;e.dataset.attivo="1";const t=e.querySelector(".category-row__carousel"),o=e.querySelector(".category-row__carousel-wrapper");if(!t||!o)return;const i=(l,d,g)=>{const h=document.createElement("button");return h.className=`carousel-arrow ${l}`,h.setAttribute("aria-label",d),h.textContent=g,h},r=i("carousel-arrow--prev","Precedente","‹"),a=i("carousel-arrow--next","Successivo","›");o.insertBefore(r,t),o.appendChild(a);const n=276,s=()=>{const{scrollLeft:l,scrollWidth:d,clientWidth:g}=t;o.classList.toggle("has-scroll-left",l>10),o.classList.toggle("has-scroll-right",l<d-g-10),r.disabled=l<=10,a.disabled=l>=d-g-10};t.addEventListener("scroll",s,{passive:!0}),s(),new ResizeObserver(s).observe(t),r.addEventListener("click",()=>t.scrollBy({left:-n*3,behavior:"smooth"})),a.addEventListener("click",()=>t.scrollBy({left:n*3,behavior:"smooth"}))}function St(){const e=document.getElementById("recipe-carousels");if(!e)return;const t=e.querySelectorAll(".category-row");if(t.length){t.forEach(se),M(),Y(),I();return}const o=Me.map(i=>{const r=z[i];return{key:r.name,emoji:r.emoji,dir:r.dir}});fetch(`${_}recipes.json${ae}`).then(i=>i.json()).then(i=>{e.innerHTML="";const r={};i.recipes.forEach(n=>{r[n.category]||(r[n.category]=[]),r[n.category].push(n)}),o.forEach(n=>{const s=r[n.key];!s||s.length===0||X(e,n.key,n.emoji,n.dir,s)});const a=new Set(o.map(n=>n.key));Object.keys(r).forEach(n=>{if(a.has(n))return;const s=r[n];if(!s||s.length===0)return;const l=n.toLowerCase(),d=Pe[n]||"fork-and-knife";X(e,n,d,l,s)}),M(),Y(),I()}).catch(i=>{console.error("Errore caricamento recipes.json:",i),e.innerHTML='<p style="text-align:center; color: var(--color-text-muted);">Errore nel caricamento delle ricette.</p>'})}function Y(){const e=document.getElementById("search-input");e&&(e.addEventListener("input",()=>{const t=e.value.toLowerCase().trim(),o=document.querySelectorAll(".recipe-card--compact"),i=document.querySelectorAll(".category-row");o.forEach(r=>{const a=r.dataset.title||r.textContent.toLowerCase();r.classList.toggle("hidden",!!(t&&!a.includes(t)))}),i.forEach(r=>{const a=r.querySelectorAll(".recipe-card--compact:not(.hidden)");r.classList.toggle("hidden",a.length===0)})}),document.addEventListener("keydown",t=>{t.key==="/"&&document.activeElement!==e&&(t.preventDefault(),e.focus(),e.scrollIntoView({behavior:"smooth",block:"center"})),t.key==="Escape"&&document.activeElement===e&&(e.value="",e.dispatchEvent(new Event("input")),e.blur())}))}export{_ as B,be as a,c as e,P as n};
