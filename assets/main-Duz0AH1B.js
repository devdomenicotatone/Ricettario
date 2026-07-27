const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/logo-intro-Cp8JEbss.css","assets/pagina-HTWYV3Vp.js","assets/pagina-BID1Vvn6.css"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))i(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const n of r.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&i(n)}).observe(document,{childList:!0,subtree:!0});function o(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(a){if(a.ep)return;a.ep=!0;const r=o(a);fetch(a.href,r)}})();const ge="modulepreload",me=function(e){return"/Ricettario/"+e},O={},D=function(t,o,i){let a=Promise.resolve();if(o&&o.length>0){let n=function(g){return Promise.all(g.map(h=>Promise.resolve(h).then(_=>({status:"fulfilled",value:_}),_=>({status:"rejected",reason:_}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),l=s?.nonce||s?.getAttribute("nonce");a=n(o.map(g=>{if(g=me(g),g in O)return;O[g]=!0;const h=g.endsWith(".css"),_=h?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${_}`))return;const d=document.createElement("link");if(d.rel=h?"stylesheet":ge,h||(d.as="script"),d.crossOrigin="",d.href=g,l&&d.setAttribute("nonce",l),document.head.appendChild(d),h)return new Promise((b,p)=>{d.addEventListener("load",b),d.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${g}`)))})}))}function r(n){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=n,window.dispatchEvent(s),!s.defaultPrevented)throw n}return a.then(n=>{for(const s of n||[])s.status==="rejected"&&r(s.reason);return t().catch(r)})};function he(e){const t=document.getElementById("annuncio-pagina");!t||!e||(t.textContent="",setTimeout(()=>{t.textContent=e},100))}const f="/Ricettario/";let W={};function fe(e){W=e}function X(e){let t=e.replace(f,"").replace(/^\/+|\/+$/g,"");if(!t||t==="index.html")return{type:"home",params:{}};const o=t.match(/^ricette\/([^/]+)\/([^/]+?)(?:\.html)?$/);if(o)return{type:"recipe",params:{category:o[1],slug:o[2]}};const i=t.match(/^ricette\/([^/]+)\/?$/);if(i)return{type:"category",params:{category:i[1]}};const a=t.match(/^cottura(?:\/([^/]+?))?(?:\.html)?$/);return a?{type:"cottura",params:{config:a[1]||null}}:{type:"home",params:{}}}let F=!0;function q(){const e=document.getElementById("contenuto");e&&e.focus({preventScroll:!0});const t=document.title.replace(/\s*[—-]\s*(Il )?Ricettario( Lab)?\s*$/i,"").trim();he(t?`${t}, pagina caricata`:"Pagina caricata")}async function I(e,t=!0){const o=new URL(e,window.location.origin);t&&history.pushState(null,"",o.pathname+o.search);const i=X(o.pathname),a=document.getElementById("app");if(!a)return;window.scrollTo(0,0);const r=F;if(F=!1,"startViewTransition"in document){const n=document.startViewTransition(async()=>{await H(i,a)});r||n.updateCallbackDone.then(q).catch(()=>{})}else await H(i,a),r||q()}async function H(e,t){const o=W[e.type];o?await o(t,e.params):t.innerHTML=`<div class="container" style="padding: 80px 0; text-align: center;">
      <h2>Pagina non trovata</h2>
      <p><a href="${f}" data-link>← Torna alla Home</a></p>
    </div>`,R()}function R(){const e=document.querySelectorAll(".reveal:not(.visible)");if(e.length===0)return;const t=new IntersectionObserver(o=>{o.forEach(i=>{i.isIntersecting&&(i.target.classList.add("visible"),t.unobserve(i.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});e.forEach(o=>t.observe(o))}function _e(){const e=sessionStorage.getItem("spa-redirect");e&&(sessionStorage.removeItem("spa-redirect"),history.replaceState(null,"",e)),document.addEventListener("click",t=>{const o=t.target.closest("a[href]");if(!o)return;const i=o.getAttribute("href"),a=o.getAttribute("data-nav-section");if(a){if(X(window.location.pathname).type!=="home"){t.preventDefault(),I(f).then(()=>{setTimeout(()=>{const s=document.getElementById(a);s&&s.scrollIntoView({behavior:"smooth"})},100)});return}return}if(!i||i.startsWith("http")||i.startsWith("#")||i.startsWith("mailto:")||i.startsWith("tel:")||o.target==="_blank")return;t.preventDefault();const r=new URL(i,window.location.href);I(r.href)}),window.addEventListener("popstate",()=>{I(window.location.href,!1)}),I(window.location.href,!1)}function c(e){return e==null?"":String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}const y=c;function Y(e){const t=e.replace(/\.(jpg|jpeg|png|webp)$/i,"");return{avif:`${t}.avif`,webp:`${t}.webp`}}function Q(e,t,o="",i="lazy"){if(!e)return"";const{avif:a,webp:r}=Y(e),n=o?` class="${y(o)}"`:"",s=i?` loading="${y(i)}"`:"";return`<picture>
  <source srcset="${y(a)}" type="image/avif">
  <source srcset="${y(r)}" type="image/webp">
  <img src="${y(r)}" alt="${y(t)}"${n}${s}>
</picture>`}function ye(e,t){if(!e)return"";const{avif:o,webp:i}=Y(e);return`<picture class="recipe-hero__picture">
  <source srcset="${y(o)}" type="image/avif">
  <source srcset="${y(i)}" type="image/webp">
  <img src="${y(i)}" alt="${y(t)}" class="recipe-hero__img">
</picture>`}const J="ricettario_fatte";function j(){try{const e=localStorage.getItem(J);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function be(e){localStorage.setItem(J,JSON.stringify([...e]))}function ve(e){return j().has(e)}function we(e){const t=j(),o=!t.has(e);return o?t.add(e):t.delete(e),be(t),o}function T(){const e=j();if(e.size===0)return;document.querySelectorAll(".recipe-card--compact, .category-card").forEach(o=>{const i=o.getAttribute("href")||"",a=new URL(i,location.origin).pathname.split("/").filter(Boolean).pop();if(a&&e.has(a)&&!o.querySelector(".made-badge")){const r=document.createElement("span");r.className="made-badge",r.textContent="✓",r.title="Ricetta già fatta!";const n=o.querySelector(".recipe-card--compact__image-wrapper, .category-card__image-wrapper");n&&n.appendChild(r)}})}function $e(e){const t=document.getElementById("made-toggle");if(!t)return;const o=i=>{t.classList.toggle("made-toggle--active",i),t.innerHTML=i?'<span class="made-toggle__icon">✓</span> <span class="made-toggle__label">Fatta!</span>':'<span class="made-toggle__icon">○</span> <span class="made-toggle__label">Segna come fatta</span>',t.title=i?"Clicca per rimuovere":"Segna questa ricetta come fatta"};o(ve(e)),t.addEventListener("click",i=>{i.preventDefault();const a=we(e);o(a),t.classList.add("made-toggle--pop"),setTimeout(()=>t.classList.remove("made-toggle--pop"),400)})}const xe={"arrow-up-right":'<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"grid-3x3":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',list:'<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>',microscope:'<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',moon:'<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',search:'<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'},Z="http://www.w3.org/2000/svg",Ee={xmlns:Z,width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"};function Ce(e=document){for(const t of e.querySelectorAll("[data-lucide]")){const o=t.getAttribute("data-lucide"),i=xe[o];if(!i){console.warn(`[icons] icona "${o}" non disponibile: aggiungila a js/icons.js`);continue}const a=document.createElementNS(Z,"svg");for(const[r,n]of Object.entries(Ee))a.setAttribute(r,n);for(const r of t.attributes)r.name!=="data-lucide"&&a.setAttribute(r.name,r.value);a.setAttribute("class",`lucide lucide-${o}${t.className?" "+t.className:""}`),a.innerHTML=i,t.replaceWith(a)}}const B={pane:{name:"Pane",dir:"pane",emoji:"baguette-bread",unicode:"🥖",title:"Pane Artigianale",desc:"Ricette di pane ad alta idratazione — ciabatta, filone, baguette e pane speciale."},pizza:{name:"Pizza",dir:"pizza",emoji:"pizza",unicode:"🍕",title:"Pizza Artigianale",desc:"Pizze con lievitazione lunga — napoletana, in teglia, canotto e pinsa romana."},primi:{name:"Primi",dir:"primi",emoji:"tomato",unicode:"🥣",title:"Primi Piatti",desc:"Primi piatti della tradizione — gnocchi, polenta, zuppe e piatti unici caldi."},lievitati:{name:"Lievitati",dir:"lievitati",emoji:"croissant",unicode:"🥐",title:"Lievitati Dolci e Salati",desc:"Brioche, cornetti, panettone, burger buns e rosticceria."},focaccia:{name:"Focaccia",dir:"focaccia",emoji:"flatbread",unicode:"🫓",title:"Focaccia Artigianale",desc:"Focacce ad alta idratazione — genovese, barese, pugliese e varianti creative."},dolci:{name:"Dolci",dir:"dolci",emoji:"shortcake",unicode:"🍪",title:"Dolci e Pasticceria",desc:"Dolci tradizionali, frolle, biscotti e pasticceria artigianale."},conserve:{name:"Conserve",dir:"conserve",emoji:"canned-food",unicode:"🫙",title:"Conserve e Preparazioni",desc:"Conserve fatte in casa — dadi vegetali, salse, sottoli e preparazioni base."},condimenti:{name:"Condimenti",dir:"condimenti",emoji:"herb",unicode:"🌿",title:"Condimenti",desc:"Salse, pesti e condimenti artigianali per ogni piatto."},secondi_piatti:{name:"Secondi Piatti",dir:"secondi-piatti",emoji:"fork-and-knife",unicode:"🍲",title:"Secondi Piatti",desc:"Esplora ricette complete e saporite per i tuoi secondi piatti: carne, pesce, legumi e verdure."}},ke=["primi","pane","pizza","lievitati","dolci","focaccia","conserve","condimenti","secondi_piatti"],Le=Object.fromEntries(Object.values(B).map(e=>[e.dir,e])),Se=Object.fromEntries(Object.values(B).map(e=>[e.name,e.emoji]));Object.values(B).map(e=>e.name);const Ae={"shopping-cart":"shopping-cart","balance-scale":"balance-scale",peanuts:"peanuts",gear:"gear","sheaf-of-rice":"flatbread",fire:"fire","light-bulb":"light-bulb","open-book":"open-book",prohibited:"prohibited",warning:"warning",droplet:"droplet",thermometer:"thermometer",stopwatch:"stopwatch",wrench:"wrench","baguette-bread":"baguette-bread",pizza:"pizza",spaghetti:"spaghetti",croissant:"croissant",cookie:"cookie",flatbread:"flatbread",shortcake:"shortcake","canned-food":"canned-food",herb:"herb","fork-and-knife":"fork-and-knife",star:"star",house:"house","high-voltage":"high-voltage",bullseye:"bullseye",package:"package",tomato:"tomato"};function u(e,t=20,o=""){const i=Ae[e]||e,a=`fluent-emoji${o?" "+o:""}`;return`<img src="${f}images/emoji/${i}.png" width="${t}" height="${t}" alt="" class="${a}" loading="lazy">`}const K=Se;function Me(e,t=20){const o=K[e];return o?u(o,t):""}function E(){Ce()}const Ie=["n/a","na","nessuna","nessuno","none","null","0","-","—"];function x(e){if(e==null)return!1;const t=String(e).trim();return t!==""&&!Ie.includes(t.toLowerCase())}const Te=["immagine esistente","caricata manualmente","provenienza non documentata"],Pe=["pexels","unsplash","pixabay","wikimedia","openverse","flickr"],N={"pexels license":"https://www.pexels.com/license/","unsplash license":"https://unsplash.com/license","pixabay license":"https://pixabay.com/service/license-summary/"};function Re(e){const t=String(e??"").trim().toLowerCase();if(!t)return null;if(N[t])return N[t];const o=t.replace(/^cc\s+/,"");if(/^cc0\b/.test(o)||o==="zero")return"https://creativecommons.org/publicdomain/zero/1.0/";if(/^(public domain|pdm|dominio pubblico)\b/.test(o))return"https://creativecommons.org/publicdomain/mark/1.0/";const i=o.match(/^(by(?:-nc)?(?:-sa|-nd)?)\s+(\d\.\d)$/);return i?`https://creativecommons.org/licenses/${i[1]}/${i[2]}/`:null}function Be(e){const t=String(e??"").trim();if(!/^https:\/\//i.test(t))return null;const o=t.match(/^https:\/\/upload\.wikimedia\.org\/wikipedia\/[a-z-]+\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)/i);if(o)return`https://commons.wikimedia.org/wiki/File:${o[1]}`;const i=t.match(/^https:\/\/images\.pexels\.com\/photos\/(\d+)\//i);return i?`https://www.pexels.com/photo/${i[1]}/`:/^https:\/\/(commons\.wikimedia\.org\/wiki\/|www\.pexels\.com\/photo\/|unsplash\.com\/photos\/|pixabay\.com\/[a-z-]+\/|openverse\.org\/image\/|www\.flickr\.com\/photos\/)/i.test(t)?t:null}function ze(e,t){const o=String(e??"").trim();if(!o)return null;const i=o.replace(/^📷\s*/,"").replace(/^Foto:\s*/i,"").trim();if(!i||Te.includes(i.toLowerCase()))return null;const a=i.split(/\s+[—–]\s+/),r=a[0].trim();if(!r)return null;let n=null,s=null;if(a.length>1){const l=a.slice(1).join(" — ").trim(),g=l.match(/^(.*?)\s+via\s+(.+)$/i);g?(n=g[1].trim()||null,s=g[2].trim()):Pe.includes(l.toLowerCase())?s=l:n=l||null}return{autore:r,licenza:n,fonte:s,urlLicenza:Re(n),urlFonte:Be(t)}}function De(e,t){const o=ze(e,t);if(!o)return"";const i=(n,s,l)=>s?`<a href="${c(s)}" target="_blank" rel="${l}">${c(n)}</a>`:c(n),a=!!(o.licenza&&!o.urlLicenza&&o.urlFonte);let r=`Foto: ${c(o.autore)}`;return o.licenza&&(r+=a?` — ${i(o.licenza,o.urlFonte,"noopener nofollow")}`:` — ${i(o.licenza,o.urlLicenza,"license noopener nofollow")}`),o.fonte?r+=` via ${i(o.fonte,a?null:o.urlFonte,"noopener nofollow")}`:o.urlFonte&&!a&&(r+=` — ${i("fonte",o.urlFonte,"noopener nofollow")}`),r}async function je(e,{category:t,slug:o}){e.innerHTML=`
    <div class="recipe-loading">
      <div class="recipe-loading__spinner"></div>
      <p>Caricamento ricetta...</p>
    </div>`;try{const i=`${f}ricette/${t}/${o}.json`,a=await fetch(i);if(!a.ok)throw new Error(`Ricetta non trovata (${a.status})`);const r=await a.json();document.title=`${r.title} — Ricettario Lab`;const n=document.querySelector('meta[name="description"]');n&&n.setAttribute("content",r.description||""),e.innerHTML=Oe(r,t),Je(r),$e(r.slug),Ke(),E()}catch(i){e.innerHTML=`
      <div class="container" style="padding: 120px 0; text-align: center;">
        <h2>${u("prohibited",28)} Ricetta non trovata</h2>
        <p style="color: var(--color-text-muted);">${c(i.message)}</p>
        <a href="${f}" data-link class="btn-back">${u("fire",16)} Torna alla Home</a>
      </div>`}}function Oe(e,t){const o=Me(e.category,22),i=e.image?`${f}${e.image.replace(/^\//,"")}`:`${f}images/ricette/${t}/${e.slug}.webp`,a=De(e.imageAttribution,e._originalImageUrl);return`
    <!-- ═══════════ RECIPE HERO ═══════════ -->
    ${a?'<figure class="recipe-foto">':""}
    <div class="recipe-hero">
      ${ye(i,e.title)}
      <div class="container">
        <nav class="breadcrumb reveal">
          <a href="${f}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${f}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${y(f)}ricette/${y(t)}/" data-link>${c(e.category)}</a>
          <span class="breadcrumb__separator">›</span>
          <span>${c(e.title)}</span>
        </nav>

        <div class="recipe-hero__content">
          <div class="recipe-hero__tags reveal">
            <span class="tag tag--category">${o} ${c(e.category)}</span>
          </div>
          <h1 class="recipe-hero__title reveal reveal-delay-1">${c(e.title)}</h1>
          <p class="recipe-hero__subtitle reveal reveal-delay-2">${c(e.subtitle||e.description)}</p>
        </div>
      </div>
    </div>
    ${a?`<figcaption class="recipe-foto__credito"><div class="container">${a}</div></figcaption></figure>`:""}

    <!-- ═══════════ TECH BADGES ═══════════ -->
    <div class="container" style="padding-top: 40px;">
      <div class="tech-badges reveal">
        ${x(e.hydration)?`<div class="tech-badge">${u("droplet",18)} Idratazione: <span class="tech-badge__value">&nbsp;${c(e.hydration)}%</span></div>`:""}
        ${x(e.targetTemp)?`<div class="tech-badge">${u("thermometer",18)} Target Temp: <span class="tech-badge__value">&nbsp;${c(e.targetTemp)}</span></div>`:""}
        ${x(e.fermentation)?`<div class="tech-badge">${u("stopwatch",18)} Lievitazione: <span class="tech-badge__value">&nbsp;${c(e.fermentation)}</span></div>`:""}
        <button class="made-toggle" id="made-toggle" type="button" aria-label="Segna come fatta"></button>
      </div>
    </div>

    <!-- ═══════════ RECIPE CONTENT ═══════════ -->
    <section class="recipe-content" id="recipe-content">
      <div class="container">
        <div class="recipe-layout">

          <!-- COLONNA SX: Ingredienti -->
          <div>
            ${Fe(e)}
            ${e.suspensions?.length?qe(e):""}
          </div>

          <!-- COLONNA DX: Procedimento -->
          <div>
            ${He(e)}
            ${Ne(e)}
          </div>

        </div>

        ${Ge(e)}
        ${Ve(e)}
        ${Ue(e)}
        ${We(e)}
        ${Xe(e)}
        ${Ye(e)}
        ${Qe(e)}
      </div>
    </section>
  `}function G(e){return`<tr${e.excludeFromTotal?' data-exclude-total="true"':""}>
    <th scope="row">${c(e.name)} ${e.note?`<span class="ingredient-note">${c(e.note)}</span>`:""}</th>
    <td class="ingredient-qty">${e.grams!=null?`${c(e.grams)}g`:""}</td>
  </tr>`}function Fe(e){const t=e.ingredientGroups?.length>0,o=e.ingredients?.length>0;if(!t&&!o)return"";let i;return t?i=e.ingredientGroups.map(a=>{if(!a.items?.length)return"";const r=`<tr class="ingredient-section-header"><th colspan="2" scope="colgroup">${c(a.group||"Ingredienti")}</th></tr>`,n=a.items.map(G).join("");return r+n}).join(""):i=e.ingredients.map(G).join(""),`
    <div class="recipe-panel reveal">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${u("shopping-cart",24)}</span> Ingredienti Base
      </h2>

      <div class="dose-calculator" id="dose-calculator">
        <div class="dose-calculator__label">
          <span class="dose-calculator__label-icon">${u("balance-scale",18)}</span> Dosi
        </div>
        <div class="dose-calculator__controls">
          <button class="dose-calculator__btn" id="dose-decrease" aria-label="Diminuisci dosi">−</button>
          <div class="dose-calculator__display" id="dose-badge">×1</div>
          <button class="dose-calculator__btn" id="dose-increase" aria-label="Aumenta dosi">+</button>
        </div>
      </div>

      <table class="ingredients-table" id="ingredients-table" aria-label="Ingredienti e quantità">
        ${i}
        <tr class="ingredient-total-row" id="ingredient-total-row">
          <th scope="row">Peso Totale Impasto</th>
          <td class="ingredient-qty" id="ingredient-total-qty"></td>
        </tr>
      </table>
    </div>`}function qe(e){const t=e.suspensions.map(o=>`
    <tr>
      <th scope="row">${c(o.name)} ${o.note?`<span class="ingredient-note">${c(o.note)}</span>`:""}</th>
      <td class="ingredient-qty">${o.grams!=null?`${c(o.grams)}g`:""}</td>
    </tr>
  `).join("");return`
    <div class="recipe-panel reveal" style="margin-top: 24px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${u("peanuts",24)}</span> Ingredienti Aggiuntivi / Sospensioni
      </h2>
      <table class="ingredients-table" id="suspensions-table" aria-label="Ingredienti aggiuntivi e quantità">${t}</table>
    </div>`}function He(e){const t=e.steps;return t?.length?`
    <div class="recipe-panel reveal reveal-delay-1" id="steps-panel">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${u("gear",24)}</span> Procedimento
      </h2>
      <ol class="steps-list">
        ${t.map((o,i)=>`<li class="step-item">
            <strong>${c(o.title)}</strong>
            <p>${ee(c(o.text))}</p>
          </li>`).join("")}
      </ol>
    </div>`:""}function Ne(e){const t=e.stepsCondiment;return t?.length?`
    <div class="recipe-panel reveal reveal-delay-2" id="steps-condimento" style="margin-top: 32px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${u("tomato",24)}</span> Preparazione Condimento
      </h2>
      <ol class="steps-list">
        ${t.map((o,i)=>`<li class="step-item">
            <strong>${c(o.title)}</strong>
            <p>${ee(c(o.text))}</p>
          </li>`).join("")}
      </ol>
    </div>`:""}function Ge(e){if(!e.sensoryProfile||!e.sensoryProfile.axes||e.sensoryProfile.axes.length===0)return"";const t=e.sensoryProfile.axes.reduce((s,l)=>l.value>s.value?l:s,e.sensoryProfile.axes[0]),o=e.sensoryProfile.summary?`
    <div class="sensory-note">
      <h3 class="sensory-note__title">Note di Degustazione</h3>
      <p class="sensory-note__text">"${c(e.sensoryProfile.summary)}"</p>
    </div>
  `:"";let i="";if(e.nutrition&&e.nutrition.macros){const s=Number(e.nutrition.macros.carbs)||0,l=Number(e.nutrition.macros.protein)||0,g=Number(e.nutrition.macros.fat)||0,h=s+l+g,_=h>0?s/h*100:0,d=h>0?l/h*100:0,b=h>0?g/h*100:0;i=`
      <details class="nutrition-toggle">
        <summary class="nutrition-toggle__btn">
          <i data-lucide="microscope" class="nutrition-toggle__icon"></i> Analisi Nutrizionale
        </summary>
        
        <div class="nutrition-content">
          <div class="nutrition-kcal">
              <span class="nutrition-kcal__value">${c(e.nutrition.kcal_per_100g)}</span>
              <span class="nutrition-kcal__unit">Kcal</span>
          </div>

          <div class="nutrition-bar">
            <div class="nutrition-bar__segment nutrition-bar__segment--carbs" style="width: ${_}%;" title="Carboidrati"></div>
            <div class="nutrition-bar__segment nutrition-bar__segment--prot" style="width: ${d}%;" title="Proteine"></div>
            <div class="nutrition-bar__segment nutrition-bar__segment--fat" style="width: ${b}%;" title="Grassi"></div>
          </div>

          <div class="nutrition-legend">
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--carbs"></div>
              <span>Carboidrati <strong>${s}g</strong></span>
            </div>
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--prot"></div>
              <span>Proteine <strong>${l}g</strong></span>
            </div>
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--fat"></div>
              <span>Grassi <strong>${g}g</strong></span>
            </div>
          </div>

          <p class="nutrition-disclaimer">
            <em>Disclaimer: Valori medi calcolati tramite database USDA per l'intera ricetta. Considerano il calo peso da evaporazione. I valori effettivi possono variare in base ai marchi commerciali usati.</em>
          </p>
        </div>
      </details>
      `}const a={labels:e.sensoryProfile.axes.map(s=>s.label),values:e.sensoryProfile.axes.map(s=>s.value)},r=`sensory_${Date.now()}`;window.__sensoryChartData=window.__sensoryChartData||{},window.__sensoryChartData[r]=a;const n=e.sensoryProfile.axes.map(s=>`<tr><th scope="row">${c(s.label)}</th><td>${c(s.value)} su 10</td></tr>`).join("");return`
    <div class="recipe-panel sensory-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <button type="button" class="sensory-panel__header" id="sensory-header"
                aria-expanded="false" aria-controls="sensory-chart-container"
                data-chart-id="${r}">
          <span><span class="recipe-panel__title-icon">${u("star",24)}</span> Dati Tecnici & Sensoriali</span>
          <i data-lucide="chevron-down" class="sensory-chevron" aria-hidden="true"></i>
        </button>
      </h2>
      <div class="sensory-chart-container" id="sensory-chart-container" style="display:none;">

        <div class="sensory-dominant">
          <span class="sensory-dominant__badge">
            👑 Tratto Dominante: ${c(t.label)} (${c(t.value)}/10)
          </span>
        </div>

        <div class="sensory-canvas-wrap">
          <canvas id="sensoryChart" aria-hidden="true"></canvas>
          <table class="solo-lettore" aria-label="Profilo sensoriale, in scala da 1 a 10">
            <tbody>${n}</tbody>
          </table>
        </div>

        ${o}
        ${i}

      </div>
    </div>
  `}function Ve(e){return e.flourTable?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${u("flatbread",24)}</span> Consigli Farine & Marchi
      </h2>
      <table class="flour-table">
        <thead><tr><th>Tipo Farina</th><th>Forza (W)</th><th>Marchi Consigliati</th></tr></thead>
        <tbody>
          ${e.flourTable.map(t=>`
            <tr>
              <td>${c(t.type)}</td>
              <td class="flour-table__w">${c(t.w||"-")}</td>
              <td>${c(t.brands||"")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="pro-tip-box">
        <p><strong>${u("light-bulb",18)} PRO TIP:</strong> La forza (W) è il parametro chiave. Se non trovi i marchi suggeriti, cerca qualsiasi farina con il valore W indicato.</p>
      </div>
    </div>`:""}function Ue(e){return e.alert?`
    <div class="alert alert--danger reveal recipe-panel--spaced">
      <span class="alert__icon">${u("prohibited",28)}</span>
      <div class="alert__content">
        <strong>ALERT PROFESSIONALE</strong>
        <p>${u("warning",18)} ${c(e.alert)}</p>
      </div>
    </div>`:""}function We(e){if(!e.baking)return"";const t=e.baking;return`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${u("fire",24)}</span> Cottura
      </h2>
      <div class="tech-badges">
        ${t.temperature?`<div class="tech-badge">${u("thermometer",18)} Temperatura: <span class="tech-badge__value">&nbsp;${c(t.temperature)}</span></div>`:""}
        ${t.time?`<div class="tech-badge">${u("stopwatch",18)} Tempo: <span class="tech-badge__value">&nbsp;${c(t.time)}</span></div>`:""}
      </div>
      ${t.tips?.length?`<ul class="tip-list">
        ${t.tips.map(o=>`<li class="tip-item">${u("light-bulb",16)} ${c(o)}</li>`).join("")}
      </ul>`:""}
    </div>`}function Xe(e){return e.proTips?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${u("light-bulb",24)}</span> Pro Tips
      </h2>
      <ul class="tip-list">
        ${e.proTips.map(t=>`<li class="tip-item">${u("light-bulb",16)} ${c(t)}</li>`).join("")}
      </ul>
    </div>`:""}function Ye(e){return e.storage?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${u("package",24)}</span> Conservazione
      </h2>
      <ul class="tip-list">
        ${e.storage.map(t=>`<li class="tip-item">${u("package",16)} ${c(t)}</li>`).join("")}
      </ul>
    </div>`:""}function Qe(e){return e.glossary?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${u("open-book",24)}</span> Glossario
      </h2>
      <dl class="glossary-list">
        ${e.glossary.map(t=>`
          <dt class="glossary-term">${c(t.term)}</dt>
          <dd class="glossary-def">${c(t.definition)}</dd>
        `).join("")}
      </dl>
    </div>`:""}function Je(e){const t=document.getElementById("dose-badge"),o=document.getElementById("dose-decrease"),i=document.getElementById("dose-increase");if(!t||!o||!i)return;const a=.25,r=.25;let n=1;const s=[],l=e.ingredientGroups?.length?e.ingredientGroups.flatMap(p=>p.items||[]):e.ingredients||[],g=["ingredients-table","suspensions-table"],h=[l,e.suspensions||[]];g.forEach((p,v)=>{const $=document.getElementById(p);if(!$)return;const w=$.querySelectorAll("tr:not(.ingredient-section-header)"),L=h[v];let S=0;for(const A of L){if(A.grams==null)continue;if(S>=w.length)break;const M=w[S]?.querySelector(".ingredient-qty");M&&s.push({baseGrams:A.grams,cell:M}),S++}});const _=p=>p===0?"0g":p>=10?`${Math.round(p)}g`:p>=1?`${Math.round(p*10)/10}g`:`${Math.round(p*100)/100}g`,d=p=>{if(Number.isInteger(p))return`×${p}`;const v=Math.round(p*10)/10;return Math.abs(p-v)<.001?`×${v.toFixed(1)}`:`×${p.toFixed(2)}`},b=()=>{t.textContent=d(n),t.classList.toggle("dose-calculator__display--modified",n!==1),o.disabled=n<=r,s.forEach(({baseGrams:p,cell:v})=>{const $=v.getAttribute("data-base"),w=$!==null?parseFloat($):p;v.textContent=_(w*n),v.getAnimations().forEach(L=>L.cancel()),v.classList.remove("dose-updated"),requestAnimationFrame(()=>v.classList.add("dose-updated"))}),document.querySelectorAll(".dose-inline:not([data-fixed])").forEach(p=>{const v=parseFloat(p.getAttribute("data-base"));isNaN(v)||(p.textContent=te(v*n),p.getAnimations().forEach($=>$.cancel()),p.classList.remove("dose-updated"),requestAnimationFrame(()=>p.classList.add("dose-updated")))}),Ze()};o.addEventListener("click",()=>{const p=Math.round((n-a)*100)/100;p>=r&&(n=p,b())}),i.addEventListener("click",()=>{n=Math.round((n+a)*100)/100,b()}),b()}function Ze(){const e=document.getElementById("ingredient-total-qty");if(!e)return;let t=0;const o=document.getElementById("ingredients-table");if(!o)return;o.querySelectorAll("tr:not(.ingredient-section-header):not(.ingredient-total-row):not([data-exclude-total]) .ingredient-qty").forEach(a=>{const r=a.textContent.trim(),n=parseFloat(r);isNaN(n)||(t+=n)});const i=t>=1e3?`~${(t/1e3).toFixed(1)}kg`:`${Math.round(t)}g`;e.textContent=i,e.classList.remove("dose-updated"),e.offsetWidth,e.classList.add("dose-updated")}function ee(e){return e.replace(/\{([a-z_]+):(\d+\.?\d*)(!)?\}/g,(t,o,i,a)=>{const r=parseFloat(i),n=te(r);return`<span class="dose-inline" data-base="${r}" data-token-id="${o}"${a?' data-fixed="true"':""}>${n}</span>`})}function te(e){return e===0?"0":e>=10?`${Math.round(e)}`:e>=1?`${Math.round(e*10)/10}`:`${Math.round(e*100)/100}`}let z=null;function Ke(){const e=document.getElementById("sensory-header");if(!e)return;const t=document.getElementById("sensory-chart-container");if(!t)return;const o=()=>e.querySelector(".sensory-chevron"),i=e.getAttribute("data-chart-id"),a=window.__sensoryChartData?.[i];if(!a)return;let r=null;e.addEventListener("click",async()=>{const n=t.style.display==="none"||!t.style.display;if(e.setAttribute("aria-expanded",String(n)),n){if(t.style.display="block",o()?.style.setProperty("transform","rotate(180deg)"),!z)try{const{Chart:w,RadarController:L,RadialLinearScale:S,PointElement:A,LineElement:M,Filler:re,Tooltip:ae}=await D(async()=>{const{Chart:ne,RadarController:se,RadialLinearScale:ce,PointElement:le,LineElement:de,Filler:pe,Tooltip:ue}=await import("./chart-Cns13J0s.js");return{Chart:ne,RadarController:se,RadialLinearScale:ce,PointElement:le,LineElement:de,Filler:pe,Tooltip:ue}},[]);w.register(L,S,A,M,re,ae),z=w}catch(w){console.error("Errore caricamento Chart.js:",w);return}r&&(r.destroy(),r=null);const s=document.getElementById("sensoryChart")?.getContext("2d");if(!s)return;const{labels:l,values:g}=a,h=window.innerWidth<600,_=l.map(w=>h&&w.includes(" ")?w.split(" "):w),d=document.documentElement.getAttribute("data-theme")==="dark",b=d?"rgba(212, 165, 116, 0.8)":"rgba(184, 129, 58, 0.8)",p=d?"rgba(212, 165, 116, 0.2)":"rgba(184, 129, 58, 0.2)",v=d?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.1)",$=d?"#94a3b8":"#64748b";r=new z(s,{type:"radar",data:{labels:_,datasets:[{label:"Valore",data:g,backgroundColor:p,borderColor:b,pointBackgroundColor:b,pointBorderColor:"#fff",pointHoverBackgroundColor:"#fff",pointHoverBorderColor:b,borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!0,layout:{padding:h?10:20},scales:{r:{min:0,max:10,angleLines:{color:v},grid:{color:v},pointLabels:{color:$,font:{family:"Inter",size:h?10:12,weight:"500"}},ticks:{display:!1,stepSize:2}}},plugins:{legend:{display:!1},tooltip:{backgroundColor:d?"#1e293b":"#fff",titleColor:d?"#f8fafc":"#0f172a",bodyColor:d?"#cbd5e1":"#475569",borderColor:d?"#334155":"#e2e8f0",borderWidth:1,padding:10,displayColors:!1,callbacks:{label:w=>w.formattedValue+" / 10"}}}}})}else t.style.display="none",o()?.style.setProperty("transform","rotate(0deg)")})}function et(){return`
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

    </svg>`}function tt(){return`
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
        ${et()}
      </div>

      <!-- Phase 7: Title text -->
      <div class="logo-intro__text">Il Ricettario</div>

      <!-- Phase 7b: Subtitle -->
      <div class="logo-intro__subtitle">Laboratorio Artigianale</div>
    </div>
  `}function ot(){if(sessionStorage.getItem("intro-shown"))return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){sessionStorage.setItem("intro-shown","1");return}D(()=>Promise.resolve({}),__vite__mapDeps([0]));const e=()=>{document.body.insertAdjacentHTML("afterbegin",tt()),it(),sessionStorage.setItem("intro-shown","1")};document.body?e():document.addEventListener("DOMContentLoaded",e,{once:!0})}function it(){const e=document.getElementById("logo-intro"),t=document.getElementById("logo-intro-logo");if(!e)return;document.documentElement.style.overflow="hidden";const o=setTimeout(()=>{t&&t.classList.add("glowing")},1700);e.addEventListener("animationend",i=>{i.animationName==="introOverlayOut"&&(document.documentElement.style.overflow="",e.classList.add("logo-intro--done"),requestAnimationFrame(()=>e.remove()),clearTimeout(o))}),setTimeout(()=>{document.getElementById("logo-intro")&&(document.documentElement.style.overflow="",e.remove())},5e3)}const oe="?v=f84e5d2e";ot();document.addEventListener("DOMContentLoaded",()=>{rt(),at(),nt();const e=document.getElementById("current-year");e&&(e.textContent=new Date().getFullYear()),E(),ct(),fe({home:dt,recipe:je,category:ut,cottura:async(t,o)=>{const{renderCottura:i}=await D(async()=>{const{renderCottura:a}=await import("./pagina-HTWYV3Vp.js");return{renderCottura:a}},__vite__mapDeps([1,2]));return i(t,o)}}),_e()});function rt(){const e=document.getElementById("navbar");if(!e)return;const t=()=>e.classList.toggle("scrolled",window.scrollY>50);window.addEventListener("scroll",t,{passive:!0}),t()}function at(){const e=document.getElementById("theme-toggle");e&&(e.addEventListener("click",()=>{const o=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";e.classList.add("theme-toggle--switching"),setTimeout(()=>e.classList.remove("theme-toggle--switching"),400),document.documentElement.setAttribute("data-theme",o),localStorage.setItem("theme",o)}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",t=>{localStorage.getItem("theme")||document.documentElement.setAttribute("data-theme",t.matches?"dark":"light")}))}function nt(){const e=document.getElementById("hamburger"),t=document.getElementById("nav-links");!e||!t||(e.addEventListener("click",()=>{e.classList.toggle("open"),t.classList.toggle("open")}),t.querySelectorAll("a").forEach(o=>{o.addEventListener("click",()=>{e.classList.remove("open"),t.classList.remove("open")})}),document.addEventListener("click",o=>{!e.contains(o.target)&&!t.contains(o.target)&&(e.classList.remove("open"),t.classList.remove("open"))}))}let C=null;function st(e){const t=new URL(f,window.location.origin),o=i=>!i||/^([a-z]+:|\/\/|\/|#)/i.test(i)?i:new URL(i,t).pathname;e.querySelectorAll("[src], [href], [srcset]").forEach(i=>{["src","href"].forEach(r=>{const n=i.getAttribute(r);n&&i.setAttribute(r,o(n))});const a=i.getAttribute("srcset");a&&i.setAttribute("srcset",a.split(",").map(r=>{const[n,...s]=r.trim().split(/\s+/);return[o(n),...s].join(" ")}).join(", "))})}function ie(e,t,o){const i=e.cloneNode(!0);return st(i),{html:i.innerHTML,title:t,description:o}}function ct(){const e=document.getElementById("app");e?.querySelector("#ricette")&&(C=ie(e,document.title,document.querySelector('meta[name="description"]')?.getAttribute("content")||""))}async function lt(){if(C)return C;const e=await fetch(f),t=new DOMParser().parseFromString(await e.text(),"text/html"),o=t.getElementById("app");if(!o)throw new Error("index.html non contiene #app");return C=ie(o,t.title,t.querySelector('meta[name="description"]')?.getAttribute("content")||""),C}async function dt(e){if(!e.querySelector("#ricette"))try{const o=await lt();e.innerHTML=o.html}catch(o){console.error("Impossibile ricostruire la homepage:",o),window.location.assign(f);return}const t=C;if(t){document.title=t.title;const o=document.querySelector('meta[name="description"]');o&&o.setAttribute("content",t.description)}E(),ht(),R()}const k=12,pt=Le;let m={allRecipes:[],filteredRecipes:[],displayedCount:k,viewMode:"grid",sortType:"az",searchQuery:"",categoryDir:""};async function ut(e,{category:t}){const o=pt[t];if(!o){document.title="Categoria non trovata — Ricettario Lab",e.innerHTML=`
      <div class="container" style="padding: 120px 0; text-align: center;">
        <h1>${u("prohibited",28)} Categoria non trovata</h1>
        <p style="color: var(--color-text-muted);">La categoria "${c(t)}" non esiste (o non esiste più).</p>
        <p><a href="${f}#ricette" data-link>← Vedi tutte le ricette</a></p>
      </div>`,E();return}document.title=`${o.title} — Il Ricettario`;const i=document.querySelector('meta[name="description"]');i&&i.setAttribute("content",o.desc),m={allRecipes:[],filteredRecipes:[],displayedCount:k,viewMode:localStorage.getItem("catViewMode")||"grid",sortType:"az",searchQuery:"",categoryDir:t},e.innerHTML=`
    <section class="category-hero" id="category-hero">
      <div class="category-hero__content">
        <h1 class="category-hero__title">${c(o.title)}</h1>
        <p class="category-hero__subtitle">${c(o.desc)}</p>
        <div class="category-hero__count" id="recipe-count">⏳ Caricamento...</div>
      </div>
    </section>

    <!-- Qui ci vuole una "section", non un "main": il landmark principale è
         quello del guscio, che avvolge #app e sopravvive ai cambi di rotta.
         Uno annidato dentro l'altro è markup non valido. -->
    <section class="section">
      <div class="container">
        <nav class="breadcrumb">
          <a href="${f}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${f}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <span class="breadcrumb__current">${c(o.name)}</span>
        </nav>

        <div class="category-toolbar" id="category-toolbar">
          <div class="category-toolbar__search">
            <span class="category-toolbar__search-icon"><i data-lucide="search" style="width:16px;height:16px"></i></span>
            <input type="text" class="category-toolbar__search-input" id="category-search"
              placeholder="Cerca tra le ricette di ${y(o.name.toLowerCase())}...">
          </div>
          <div class="category-toolbar__results" id="results-counter"></div>
          <div class="category-toolbar__sort">
            <button class="category-toolbar__sort-btn active" data-sort="az">A-Z</button>
            <button class="category-toolbar__sort-btn" data-sort="hydration">${u("droplet",14)} Idratazione</button>
          </div>
          <div class="category-toolbar__views">
            <button class="view-toggle-btn ${m.viewMode==="grid"?"active":""}" data-view="grid" aria-label="Vista griglia">
              <i data-lucide="grid-3x3" style="width:16px;height:16px"></i>
            </button>
            <button class="view-toggle-btn ${m.viewMode==="list"?"active":""}" data-view="list" aria-label="Vista lista">
              <i data-lucide="list" style="width:16px;height:16px"></i>
            </button>
          </div>
        </div>

        <div class="category-grid ${m.viewMode==="list"?"category-grid--list":""}" id="category-grid">
          ${mt(6)}
        </div>

        <div id="load-more-container"></div>
      </div>
    </section>
  `,E();try{const r=await(await fetch(`${f}recipes.json${oe}`)).json();m.allRecipes=r.recipes.filter(l=>l.categoryDir===t||l.category===o.name),m.allRecipes.sort((l,g)=>(l.title||"").localeCompare(g.title||"","it")),m.filteredRecipes=[...m.allRecipes];const n=m.allRecipes.find(l=>l.image);if(n){const l=document.getElementById("category-hero");l&&(l.style.backgroundImage=`url('${f}${n.image}')`)}const s=document.getElementById("recipe-count");s&&(s.innerHTML=`${u("bullseye",16)} ${m.allRecipes.length} ricett${m.allRecipes.length===1?"a":"e"}`),P(),gt(e),R(),T()}catch(a){console.error("Errore caricamento categoria:",a);const r=document.getElementById("category-grid");r&&(r.innerHTML=`<div class="category-empty"><div class="category-empty__icon">${u("prohibited",32)}</div><p>Errore nel caricamento delle ricette.</p></div>`)}}function gt(e){const t=document.getElementById("category-search");let o;t&&t.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(()=>{m.searchQuery=t.value.toLowerCase().trim(),m.displayedCount=k,V(),P()},150)});const i=e.querySelectorAll(".category-toolbar__sort-btn");i.forEach(r=>{r.addEventListener("click",()=>{i.forEach(n=>n.classList.remove("active")),r.classList.add("active"),m.sortType=r.dataset.sort,m.displayedCount=k,V(),P()})});const a=e.querySelectorAll(".view-toggle-btn");a.forEach(r=>{r.addEventListener("click",()=>{a.forEach(s=>s.classList.remove("active")),r.classList.add("active"),m.viewMode=r.dataset.view,localStorage.setItem("catViewMode",m.viewMode);const n=document.getElementById("category-grid");n&&n.classList.toggle("category-grid--list",m.viewMode==="list")})})}function V(){let e=[...m.allRecipes];m.searchQuery&&(e=e.filter(t=>{const o=(t.title||"").toLowerCase(),i=(t.description||"").toLowerCase();return o.includes(m.searchQuery)||i.includes(m.searchQuery)})),m.sortType==="az"?e.sort((t,o)=>(t.title||"").localeCompare(o.title||"","it")):m.sortType==="hydration"&&e.sort((t,o)=>(parseInt(o.hydration)||0)-(parseInt(t.hydration)||0)),m.filteredRecipes=e}function P(){const e=document.getElementById("category-grid"),t=document.getElementById("load-more-container");if(!e)return;const{filteredRecipes:o,displayedCount:i,categoryDir:a}=m,r=o.slice(0,i),n=o.length,s=document.getElementById("results-counter");if(s&&(m.searchQuery?s.innerHTML=`<strong>${n}</strong> risultat${n===1?"o":"i"}`:s.innerHTML=`<strong>${Math.min(i,n)}</strong> di <strong>${n}</strong>`),n===0){e.innerHTML=`
      <div class="category-empty" style="grid-column: 1 / -1">
        <div class="category-empty__icon"><i data-lucide="search" style="width:32px;height:32px"></i></div>
        <p>Nessuna ricetta trovata</p>
      </div>`,t&&(t.innerHTML=""),E();return}if(e.innerHTML=r.map((l,g)=>{const h=`${f}ricette/${l.categoryDir||a}/${l.slug}`;return`
      <a href="${y(h)}" class="category-card" data-link
         data-title="${y((l.title||"").toLowerCase())}"
         data-hydration="${parseInt(l.hydration)||0}">
        <div class="category-card__image-wrapper">
          ${l.image?Q(`${f}${l.image}`,l.title,"category-card__image","lazy"):""}
          <div class="category-card__meta">
            ${x(l.hydration)?`<span class="category-card__tag">${u("droplet",14)} ${c(l.hydration)}</span>`:""}
            ${x(l.time)?`<span class="category-card__tag">${u("stopwatch",14)} ${c(l.time)}</span>`:""}
          </div>
        </div>
        <div class="category-card__body">
          <h2 class="category-card__title">${c(l.title)}</h2>
          ${l.description?`<p class="category-card__desc">${c(l.description)}</p>`:""}
        </div>
      </a>`}).join(""),t)if(i<n){const l=n-i,g=Math.round(i/n*100);t.innerHTML=`
        <div class="load-more-wrapper">
          <button class="load-more-btn" id="load-more-btn">
            <span>Carica altre ${Math.min(l,k)} ricette</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="load-more-progress">${i} di ${n} ricette</div>
          <div class="load-more-bar"><div class="load-more-bar__fill" style="width: ${g}%"></div></div>
        </div>`,document.getElementById("load-more-btn")?.addEventListener("click",()=>{m.displayedCount+=k,P(),setTimeout(()=>{const _=e.querySelectorAll(".category-card")[i];_&&_.scrollIntoView({behavior:"smooth",block:"center"})},100),T()})}else t.innerHTML="";E(),T()}function mt(e){return Array.from({length:e},()=>`
    <div class="category-card category-card--skeleton">
      <div class="category-card__image-wrapper"></div>
      <div class="category-card__body">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
      </div>
    </div>`).join("")}function U(e,t,o,i,a){const r=document.createElement("div");r.className="category-row reveal",r.dataset.category=t,r.innerHTML=`
    <div class="category-row__header">
      <h3 class="category-row__title">
        ${u(o,32)} ${t}
        <span class="category-row__count">${a.length} ricett${a.length===1?"a":"e"}</span>
      </h3>
      <a href="${f}ricette/${i}/" class="category-row__link" data-link>Vedi tutte</a>
    </div>
    <div class="category-row__carousel-wrapper">
      <button class="carousel-arrow carousel-arrow--prev" aria-label="Precedente">‹</button>
      <div class="category-row__carousel">
        ${a.map(d=>{const b=d.href.replace(".html","");return`
          <a href="${y(b)}" class="recipe-card--compact" data-link data-title="${y(d.title.toLowerCase())}" data-category="${y(d.category)}">
            <div class="recipe-card--compact__image-wrapper">
              ${d.image?Q(d.image,d.title,"recipe-card--compact__image","lazy"):""}
            </div>
            <div class="recipe-card--compact__body">
              <h4 class="recipe-card--compact__title">${c(d.title)}</h4>
              <div class="recipe-card--compact__meta">
                ${x(d.hydration)?`<span class="recipe-card--compact__tag">${u("droplet",16)} ${c(d.hydration)}</span>`:""}
                ${x(d.time)?`<span>${u("stopwatch",16)} ${c(d.time)}</span>`:""}
              </div>
            </div>
          </a>`}).join("")}
      </div>
      <button class="carousel-arrow carousel-arrow--next" aria-label="Successivo">›</button>
    </div>
  `,e.appendChild(r);const n=r.querySelector(".category-row__carousel"),s=r.querySelector(".category-row__carousel-wrapper"),l=r.querySelector(".carousel-arrow--prev"),g=r.querySelector(".carousel-arrow--next"),h=276,_=()=>{const{scrollLeft:d,scrollWidth:b,clientWidth:p}=n;s.classList.toggle("has-scroll-left",d>10),s.classList.toggle("has-scroll-right",d<b-p-10),l.disabled=d<=10,g.disabled=d>=b-p-10};n.addEventListener("scroll",_,{passive:!0}),_(),new ResizeObserver(_).observe(n),l.addEventListener("click",()=>n.scrollBy({left:-h*3,behavior:"smooth"})),g.addEventListener("click",()=>n.scrollBy({left:h*3,behavior:"smooth"}))}function ht(){const e=document.getElementById("recipe-carousels");if(!e)return;const t=ke.map(o=>{const i=B[o];return{key:i.name,emoji:i.emoji,dir:i.dir}});fetch(`${f}recipes.json${oe}`).then(o=>o.json()).then(o=>{e.innerHTML="";const i={};o.recipes.forEach(r=>{i[r.category]||(i[r.category]=[]),i[r.category].push(r)}),t.forEach(r=>{const n=i[r.key];!n||n.length===0||U(e,r.key,r.emoji,r.dir,n)});const a=new Set(t.map(r=>r.key));Object.keys(i).forEach(r=>{if(a.has(r))return;const n=i[r];if(!n||n.length===0)return;const s=r.toLowerCase(),l=K[r]||"fork-and-knife";U(e,r,l,s,n)}),R(),ft(),T()}).catch(o=>{console.error("Errore caricamento recipes.json:",o),e.innerHTML='<p style="text-align:center; color: var(--color-text-muted);">Errore nel caricamento delle ricette.</p>'})}function ft(){const e=document.getElementById("search-input");e&&(e.addEventListener("input",()=>{const t=e.value.toLowerCase().trim(),o=document.querySelectorAll(".recipe-card--compact"),i=document.querySelectorAll(".category-row");o.forEach(a=>{const r=a.dataset.title||a.textContent.toLowerCase();a.classList.toggle("hidden",!!(t&&!r.includes(t)))}),i.forEach(a=>{const r=a.querySelectorAll(".recipe-card--compact:not(.hidden)");a.classList.toggle("hidden",r.length===0)})}),document.addEventListener("keydown",t=>{t.key==="/"&&document.activeElement!==e&&(t.preventDefault(),e.focus(),e.scrollIntoView({behavior:"smooth",block:"center"})),t.key==="Escape"&&document.activeElement===e&&(e.value="",e.dispatchEvent(new Event("input")),e.blur())}))}export{f as B,he as a,c as e,I as n};
