const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/logo-intro-Cp8JEbss.css"])))=>i.map(i=>d[i]);
(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function o(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerPolicy&&(r.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?r.credentials="include":n.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function i(n){if(n.ep)return;n.ep=!0;const r=o(n);fetch(n.href,r)}})();const h="/Ricettario/";let q={};function te(e){q=e}function F(e){let t=e.replace(h,"").replace(/^\/+|\/+$/g,"");if(!t||t==="index.html")return{type:"home",params:{}};const o=t.match(/^ricette\/([^/]+)\/([^/]+?)(?:\.html)?$/);if(o)return{type:"recipe",params:{category:o[1],slug:o[2]}};const i=t.match(/^ricette\/([^/]+)\/?$/);return i?{type:"category",params:{category:i[1]}}:{type:"home",params:{}}}async function M(e,t=!0){const o=new URL(e,window.location.origin);t&&history.pushState(null,"",o.pathname);const i=F(o.pathname),n=document.getElementById("app");n&&(window.scrollTo(0,0),"startViewTransition"in document?document.startViewTransition(async()=>{await j(i,n)}):await j(i,n))}async function j(e,t){const o=q[e.type];o?await o(t,e.params):t.innerHTML=`<div class="container" style="padding: 80px 0; text-align: center;">
      <h2>Pagina non trovata</h2>
      <p><a href="${h}" data-link>← Torna alla Home</a></p>
    </div>`,P()}function P(){const e=document.querySelectorAll(".reveal:not(.visible)");if(e.length===0)return;const t=new IntersectionObserver(o=>{o.forEach(i=>{i.isIntersecting&&(i.target.classList.add("visible"),t.unobserve(i.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});e.forEach(o=>t.observe(o))}function oe(){const e=sessionStorage.getItem("spa-redirect");e&&(sessionStorage.removeItem("spa-redirect"),history.replaceState(null,"",e)),document.addEventListener("click",t=>{const o=t.target.closest("a[href]");if(!o)return;const i=o.getAttribute("href"),n=o.getAttribute("data-nav-section");if(n){if(F(window.location.pathname).type!=="home"){t.preventDefault(),M(h).then(()=>{setTimeout(()=>{const s=document.getElementById(n);s&&s.scrollIntoView({behavior:"smooth"})},100)});return}return}if(!i||i.startsWith("http")||i.startsWith("#")||i.startsWith("mailto:")||i.startsWith("tel:")||o.target==="_blank")return;t.preventDefault();const r=new URL(i,window.location.href);M(r.href)}),window.addEventListener("popstate",()=>{M(window.location.href,!1)}),M(window.location.href,!1)}const ie="modulepreload",re=function(e){return"/Ricettario/"+e},D={},N=function(t,o,i){let n=Promise.resolve();if(o&&o.length>0){let a=function(g){return Promise.all(g.map(f=>Promise.resolve(f).then(_=>({status:"fulfilled",value:_}),_=>({status:"rejected",reason:_}))))};document.getElementsByTagName("link");const s=document.querySelector("meta[property=csp-nonce]"),c=s?.nonce||s?.getAttribute("nonce");n=a(o.map(g=>{if(g=re(g),g in D)return;D[g]=!0;const f=g.endsWith(".css"),_=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${g}"]${_}`))return;const l=document.createElement("link");if(l.rel=f?"stylesheet":ie,f||(l.as="script"),l.crossOrigin="",l.href=g,c&&l.setAttribute("nonce",c),document.head.appendChild(l),f)return new Promise((v,d)=>{l.addEventListener("load",v),l.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${g}`)))})}))}function r(a){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=a,window.dispatchEvent(s),!s.defaultPrevented)throw a}return n.then(a=>{for(const s of a||[])s.status==="rejected"&&r(s.reason);return t().catch(r)})};function G(e){const t=e.replace(/\.(jpg|jpeg|png|webp)$/i,"");return{avif:`${t}.avif`,webp:`${t}.webp`}}function V(e,t,o="",i="lazy"){if(!e)return"";const{avif:n,webp:r}=G(e),a=o?` class="${o}"`:"",s=i?` loading="${i}"`:"";return`<picture>
  <source srcset="${n}" type="image/avif">
  <source srcset="${r}" type="image/webp">
  <img src="${r}" alt="${t}"${a}${s}>
</picture>`}function ae(e,t){if(!e)return"";const{avif:o,webp:i}=G(e);return`<picture class="recipe-hero__picture">
  <source srcset="${o}" type="image/avif">
  <source srcset="${i}" type="image/webp">
  <img src="${i}" alt="${t}" class="recipe-hero__img">
</picture>`}const W="ricettario_fatte";function R(){try{const e=localStorage.getItem(W);return e?new Set(JSON.parse(e)):new Set}catch{return new Set}}function ne(e){localStorage.setItem(W,JSON.stringify([...e]))}function se(e){return R().has(e)}function ce(e){const t=R(),o=!t.has(e);return o?t.add(e):t.delete(e),ne(t),o}function I(){const e=R();if(e.size===0)return;document.querySelectorAll(".recipe-card--compact, .category-card").forEach(o=>{const i=o.getAttribute("href")||"",n=new URL(i,location.origin).pathname.split("/").filter(Boolean).pop();if(n&&e.has(n)&&!o.querySelector(".made-badge")){const r=document.createElement("span");r.className="made-badge",r.textContent="✓",r.title="Ricetta già fatta!";const a=o.querySelector(".recipe-card--compact__image-wrapper, .category-card__image-wrapper");a&&a.appendChild(r)}})}function le(e){const t=document.getElementById("made-toggle");if(!t)return;const o=i=>{t.classList.toggle("made-toggle--active",i),t.innerHTML=i?'<span class="made-toggle__icon">✓</span> <span class="made-toggle__label">Fatta!</span>':'<span class="made-toggle__icon">○</span> <span class="made-toggle__label">Segna come fatta</span>',t.title=i?"Clicca per rimuovere":"Segna questa ricetta come fatta"};o(se(e)),t.addEventListener("click",i=>{i.preventDefault();const n=ce(e);o(n),t.classList.add("made-toggle--pop"),setTimeout(()=>t.classList.remove("made-toggle--pop"),400)})}const de={"arrow-up-right":'<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',"grid-3x3":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',list:'<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>',microscope:'<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',moon:'<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',search:'<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>'},U="http://www.w3.org/2000/svg",pe={xmlns:U,width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"};function ge(e=document){for(const t of e.querySelectorAll("[data-lucide]")){const o=t.getAttribute("data-lucide"),i=de[o];if(!i){console.warn(`[icons] icona "${o}" non disponibile: aggiungila a js/icons.js`);continue}const n=document.createElementNS(U,"svg");for(const[r,a]of Object.entries(pe))n.setAttribute(r,a);for(const r of t.attributes)r.name!=="data-lucide"&&n.setAttribute(r.name,r.value);n.setAttribute("class",`lucide lucide-${o}${t.className?" "+t.className:""}`),n.innerHTML=i,t.replaceWith(n)}}const B={pane:{name:"Pane",dir:"pane",emoji:"baguette-bread",unicode:"🥖",title:"Pane Artigianale",desc:"Ricette di pane ad alta idratazione — ciabatta, filone, baguette e pane speciale."},pizza:{name:"Pizza",dir:"pizza",emoji:"pizza",unicode:"🍕",title:"Pizza Artigianale",desc:"Pizze con lievitazione lunga — napoletana, in teglia, canotto e pinsa romana."},pasta:{name:"Pasta",dir:"pasta",emoji:"spaghetti",unicode:"🍝",title:"Pasta Fresca",desc:"Pasta fresca fatta in casa — trafilata, ripiena e formati speciali."},primi:{name:"Primi",dir:"primi",emoji:"tomato",unicode:"🥣",title:"Primi Piatti",desc:"Primi piatti della tradizione — polenta, zuppe e piatti unici caldi."},lievitati:{name:"Lievitati",dir:"lievitati",emoji:"croissant",unicode:"🥐",title:"Lievitati Dolci e Salati",desc:"Brioche, cornetti, panettone, burger buns e rosticceria."},focaccia:{name:"Focaccia",dir:"focaccia",emoji:"flatbread",unicode:"🫓",title:"Focaccia Artigianale",desc:"Focacce ad alta idratazione — genovese, barese, pugliese e varianti creative."},dolci:{name:"Dolci",dir:"dolci",emoji:"shortcake",unicode:"🍪",title:"Dolci e Pasticceria",desc:"Dolci tradizionali, frolle, biscotti e pasticceria artigianale."},conserve:{name:"Conserve",dir:"conserve",emoji:"canned-food",unicode:"🫙",title:"Conserve e Preparazioni",desc:"Conserve fatte in casa — dadi vegetali, salse, sottoli e preparazioni base."},condimenti:{name:"Condimenti",dir:"condimenti",emoji:"herb",unicode:"🌿",title:"Condimenti",desc:"Salse, pesti e condimenti artigianali per ogni piatto."},secondi_piatti:{name:"Secondi Piatti",dir:"secondi-piatti",emoji:"fork-and-knife",unicode:"🍲",title:"Secondi Piatti",desc:"Esplora ricette complete e saporite per i tuoi secondi piatti: carne, pesce, legumi e verdure."}},ue=["pasta","primi","pane","pizza","lievitati","dolci","focaccia","conserve","condimenti","secondi_piatti"],he=Object.fromEntries(Object.values(B).map(e=>[e.dir,e])),me=Object.fromEntries(Object.values(B).map(e=>[e.name,e.emoji]));Object.values(B).map(e=>e.name);const fe={"shopping-cart":"shopping-cart","balance-scale":"balance-scale",peanuts:"peanuts",gear:"gear","sheaf-of-rice":"flatbread",fire:"fire","light-bulb":"light-bulb","open-book":"open-book",prohibited:"prohibited",warning:"warning",droplet:"droplet",thermometer:"thermometer",stopwatch:"stopwatch",wrench:"wrench","baguette-bread":"baguette-bread",pizza:"pizza",spaghetti:"spaghetti",croissant:"croissant",cookie:"cookie",flatbread:"flatbread",shortcake:"shortcake","canned-food":"canned-food",herb:"herb","fork-and-knife":"fork-and-knife",star:"star",house:"house","high-voltage":"high-voltage",bullseye:"bullseye",package:"package",tomato:"tomato"};function p(e,t=20,o=""){const i=fe[e]||e,n=`fluent-emoji${o?" "+o:""}`;return`<img src="${h}images/emoji/${i}.png" width="${t}" height="${t}" alt="" class="${n}" loading="lazy">`}const X=me;function _e(e,t=20){const o=X[e];return o?p(o,t):""}function E(){ge()}const ye=["n/a","na","nessuna","nessuno","none","null","0","-","—"];function $(e){if(e==null)return!1;const t=String(e).trim();return t!==""&&!ye.includes(t.toLowerCase())}async function be(e,{category:t,slug:o}){e.innerHTML=`
    <div class="recipe-loading">
      <div class="recipe-loading__spinner"></div>
      <p>Caricamento ricetta...</p>
    </div>`;try{const i=`${h}ricette/${t}/${o}.json`,n=await fetch(i);if(!n.ok)throw new Error(`Ricetta non trovata (${n.status})`);const r=await n.json();document.title=`${r.title} — Ricettario Lab`;const a=document.querySelector('meta[name="description"]');a&&a.setAttribute("content",r.description||""),e.innerHTML=ve(r,t),Te(r),le(r.slug),Be(),E()}catch(i){e.innerHTML=`
      <div class="container" style="padding: 120px 0; text-align: center;">
        <h2>${p("prohibited",28)} Ricetta non trovata</h2>
        <p style="color: var(--color-text-muted);">${i.message}</p>
        <a href="${h}" data-link class="btn-back">${p("fire",16)} Torna alla Home</a>
      </div>`}}function ve(e,t){const o=_e(e.category,22),i=e.image?`${h}${e.image.replace(/^\//,"")}`:`${h}images/ricette/${t}/${e.slug}.webp`;return`
    <!-- ═══════════ RECIPE HERO ═══════════ -->
    <div class="recipe-hero">
      ${ae(i,e.title)}
      <div class="container">
        <nav class="breadcrumb reveal">
          <a href="${h}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${h}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${h}ricette/${t}/" data-link>${e.category}</a>
          <span class="breadcrumb__separator">›</span>
          <span>${e.title}</span>
        </nav>

        <div class="recipe-hero__content">
          <div class="recipe-hero__tags reveal">
            <span class="tag tag--category">${o} ${e.category}</span>
          </div>
          <h1 class="recipe-hero__title reveal reveal-delay-1">${e.title}</h1>
          <p class="recipe-hero__subtitle reveal reveal-delay-2">${e.subtitle||e.description}</p>
        </div>
      </div>
    </div>

    <!-- ═══════════ TECH BADGES ═══════════ -->
    <div class="container" style="padding-top: 40px;">
      <div class="tech-badges reveal">
        ${$(e.hydration)?`<div class="tech-badge">${p("droplet",18)} Idratazione: <span class="tech-badge__value">&nbsp;${e.hydration}%</span></div>`:""}
        ${$(e.targetTemp)?`<div class="tech-badge">${p("thermometer",18)} Target Temp: <span class="tech-badge__value">&nbsp;${e.targetTemp}</span></div>`:""}
        ${$(e.fermentation)?`<div class="tech-badge">${p("stopwatch",18)} Lievitazione: <span class="tech-badge__value">&nbsp;${e.fermentation}</span></div>`:""}
        <button class="made-toggle" id="made-toggle" type="button" aria-label="Segna come fatta"></button>
      </div>
    </div>

    <!-- ═══════════ RECIPE CONTENT ═══════════ -->
    <section class="recipe-content" id="recipe-content">
      <div class="container">
        <div class="recipe-layout">

          <!-- COLONNA SX: Ingredienti -->
          <div>
            ${we(e)}
            ${e.suspensions?.length?$e(e):""}
          </div>

          <!-- COLONNA DX: Procedimento -->
          <div>
            ${xe(e)}
            ${Ee(e)}
          </div>

        </div>

        ${Ce(e)}
        ${ke(e)}
        ${Le(e)}
        ${Ae(e)}
        ${Se(e)}
        ${Me(e)}
        ${Ie(e)}
      </div>
    </section>
  `}function z(e){return`<tr${e.excludeFromTotal?' data-exclude-total="true"':""}>
    <td>${m(e.name)} ${e.note?`<span class="ingredient-note">${m(e.note)}</span>`:""}</td>
    <td class="ingredient-qty">${e.grams!=null?`${e.grams}g`:""}</td>
  </tr>`}function we(e){const t=e.ingredientGroups?.length>0,o=e.ingredients?.length>0;if(!t&&!o)return"";let i;return t?i=e.ingredientGroups.map(n=>{if(!n.items?.length)return"";const r=`<tr class="ingredient-section-header"><td colspan="2">${m(n.group||"Ingredienti")}</td></tr>`,a=n.items.map(z).join("");return r+a}).join(""):i=e.ingredients.map(z).join(""),`
    <div class="recipe-panel reveal">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${p("shopping-cart",24)}</span> Ingredienti Base
      </h2>

      <div class="dose-calculator" id="dose-calculator">
        <div class="dose-calculator__label">
          <span class="dose-calculator__label-icon">${p("balance-scale",18)}</span> Dosi
        </div>
        <div class="dose-calculator__controls">
          <button class="dose-calculator__btn" id="dose-decrease" aria-label="Diminuisci dosi">−</button>
          <div class="dose-calculator__display" id="dose-badge">×1</div>
          <button class="dose-calculator__btn" id="dose-increase" aria-label="Aumenta dosi">+</button>
        </div>
      </div>

      <table class="ingredients-table" id="ingredients-table">
        ${i}
        <tr class="ingredient-total-row" id="ingredient-total-row">
          <td>Peso Totale Impasto</td>
          <td class="ingredient-qty" id="ingredient-total-qty"></td>
        </tr>
      </table>
    </div>`}function $e(e){const t=e.suspensions.map(o=>`
    <tr>
      <td>${m(o.name)} ${o.note?`<span class="ingredient-note">${m(o.note)}</span>`:""}</td>
      <td class="ingredient-qty">${o.grams!=null?`${o.grams}g`:""}</td>
    </tr>
  `).join("");return`
    <div class="recipe-panel reveal" style="margin-top: 24px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${p("peanuts",24)}</span> Ingredienti Aggiuntivi / Sospensioni
      </h2>
      <table class="ingredients-table" id="suspensions-table">${t}</table>
    </div>`}function xe(e){const t=e.steps;return t?.length?`
    <div class="recipe-panel reveal reveal-delay-1" id="steps-panel">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${p("gear",24)}</span> Procedimento
      </h2>
      <ol class="steps-list">
        ${t.map((o,i)=>`<li class="step-item">
            <strong>${m(o.title)}</strong>
            <p>${Y(m(o.text))}</p>
          </li>`).join("")}
      </ol>
    </div>`:""}function Ee(e){const t=e.stepsCondiment;return t?.length?`
    <div class="recipe-panel reveal reveal-delay-2" id="steps-condimento" style="margin-top: 32px;">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${p("tomato",24)}</span> Preparazione Condimento
      </h2>
      <ol class="steps-list">
        ${t.map((o,i)=>`<li class="step-item">
            <strong>${m(o.title)}</strong>
            <p>${Y(m(o.text))}</p>
          </li>`).join("")}
      </ol>
    </div>`:""}function Ce(e){if(!e.sensoryProfile||!e.sensoryProfile.axes||e.sensoryProfile.axes.length===0)return"";const t=e.sensoryProfile.axes.reduce((a,s)=>s.value>a.value?s:a,e.sensoryProfile.axes[0]),o=e.sensoryProfile.summary?`
    <div class="sensory-note">
      <h4 class="sensory-note__title">Note di Degustazione</h4>
      <p class="sensory-note__text">"${m(e.sensoryProfile.summary)}"</p>
    </div>
  `:"";let i="";if(e.nutrition&&e.nutrition.macros){const a=e.nutrition.macros.carbs||0,s=e.nutrition.macros.protein||0,c=e.nutrition.macros.fat||0,g=a+s+c,f=g>0?a/g*100:0,_=g>0?s/g*100:0,l=g>0?c/g*100:0;i=`
      <details class="nutrition-toggle">
        <summary class="nutrition-toggle__btn">
          <i data-lucide="microscope" class="nutrition-toggle__icon"></i> Analisi Nutrizionale
        </summary>
        
        <div class="nutrition-content">
          <div class="nutrition-kcal">
              <span class="nutrition-kcal__value">${e.nutrition.kcal_per_100g}</span>
              <span class="nutrition-kcal__unit">Kcal</span>
          </div>

          <div class="nutrition-bar">
            <div class="nutrition-bar__segment nutrition-bar__segment--carbs" style="width: ${f}%;" title="Carboidrati"></div>
            <div class="nutrition-bar__segment nutrition-bar__segment--prot" style="width: ${_}%;" title="Proteine"></div>
            <div class="nutrition-bar__segment nutrition-bar__segment--fat" style="width: ${l}%;" title="Grassi"></div>
          </div>

          <div class="nutrition-legend">
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--carbs"></div>
              <span>Carboidrati <strong>${a}g</strong></span>
            </div>
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--prot"></div>
              <span>Proteine <strong>${s}g</strong></span>
            </div>
            <div class="nutrition-legend__item">
              <div class="nutrition-legend__dot nutrition-legend__dot--fat"></div>
              <span>Grassi <strong>${c}g</strong></span>
            </div>
          </div>

          <p class="nutrition-disclaimer">
            <em>Disclaimer: Valori medi calcolati tramite database USDA per l'intera ricetta. Considerano il calo peso da evaporazione. I valori effettivi possono variare in base ai marchi commerciali usati.</em>
          </p>
        </div>
      </details>
      `}const n={labels:e.sensoryProfile.axes.map(a=>a.label),values:e.sensoryProfile.axes.map(a=>a.value)},r=`sensory_${Date.now()}`;return window.__sensoryChartData=window.__sensoryChartData||{},window.__sensoryChartData[r]=n,`
    <div class="recipe-panel sensory-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title sensory-panel__header" id="sensory-header" data-chart-id="${r}">
        <span><span class="recipe-panel__title-icon">${p("star",24)}</span> Dati Tecnici & Sensoriali</span>
        <i data-lucide="chevron-down" class="sensory-chevron"></i>
      </h2>
      <div class="sensory-chart-container" id="sensory-chart-container" style="display:none;">
        
        <div class="sensory-dominant">
          <span class="sensory-dominant__badge">
            👑 Tratto Dominante: ${m(t.label)} (${t.value}/10)
          </span>
        </div>

        <div class="sensory-canvas-wrap">
          <canvas id="sensoryChart"></canvas>
        </div>

        ${o}
        ${i}

      </div>
    </div>
  `}function ke(e){return e.flourTable?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${p("flatbread",24)}</span> Consigli Farine & Marchi
      </h2>
      <table class="flour-table">
        <thead><tr><th>Tipo Farina</th><th>Forza (W)</th><th>Marchi Consigliati</th></tr></thead>
        <tbody>
          ${e.flourTable.map(t=>`
            <tr>
              <td>${m(t.type)}</td>
              <td class="flour-table__w">${m(t.w||"-")}</td>
              <td>${m(t.brands||"")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="pro-tip-box">
        <p><strong>${p("light-bulb",18)} PRO TIP:</strong> La forza (W) è il parametro chiave. Se non trovi i marchi suggeriti, cerca qualsiasi farina con il valore W indicato.</p>
      </div>
    </div>`:""}function Le(e){return e.alert?`
    <div class="alert alert--danger reveal recipe-panel--spaced">
      <span class="alert__icon">${p("prohibited",28)}</span>
      <div class="alert__content">
        <strong>ALERT PROFESSIONALE</strong>
        <p>${p("warning",18)} ${m(e.alert)}</p>
      </div>
    </div>`:""}function Ae(e){if(!e.baking)return"";const t=e.baking;return`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${p("fire",24)}</span> Cottura
      </h2>
      <div class="tech-badges">
        ${t.temperature?`<div class="tech-badge">${p("thermometer",18)} Temperatura: <span class="tech-badge__value">&nbsp;${m(t.temperature)}</span></div>`:""}
        ${t.time?`<div class="tech-badge">${p("stopwatch",18)} Tempo: <span class="tech-badge__value">&nbsp;${m(t.time)}</span></div>`:""}
      </div>
      ${t.tips?.length?`<ul class="tip-list">
        ${t.tips.map(o=>`<li class="tip-item">${p("light-bulb",16)} ${m(o)}</li>`).join("")}
      </ul>`:""}
    </div>`}function Se(e){return e.proTips?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${p("light-bulb",24)}</span> Pro Tips
      </h2>
      <ul class="tip-list">
        ${e.proTips.map(t=>`<li class="tip-item">${p("light-bulb",16)} ${m(t)}</li>`).join("")}
      </ul>
    </div>`:""}function Me(e){return e.storage?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${p("package",24)}</span> Conservazione
      </h2>
      <ul class="tip-list">
        ${e.storage.map(t=>`<li class="tip-item">${p("package",16)} ${m(t)}</li>`).join("")}
      </ul>
    </div>`:""}function Ie(e){return e.glossary?.length?`
    <div class="recipe-panel reveal recipe-panel--spaced">
      <h2 class="recipe-panel__title">
        <span class="recipe-panel__title-icon">${p("open-book",24)}</span> Glossario
      </h2>
      <dl class="glossary-list">
        ${e.glossary.map(t=>`
          <dt class="glossary-term">${m(t.term)}</dt>
          <dd class="glossary-def">${m(t.definition)}</dd>
        `).join("")}
      </dl>
    </div>`:""}function Te(e){const t=document.getElementById("dose-badge"),o=document.getElementById("dose-decrease"),i=document.getElementById("dose-increase");if(!t||!o||!i)return;const n=.25,r=.25;let a=1;const s=[],c=e.ingredientGroups?.length?e.ingredientGroups.flatMap(d=>d.items||[]):e.ingredients||[],g=["ingredients-table","suspensions-table"],f=[c,e.suspensions||[]];g.forEach((d,y)=>{const w=document.getElementById(d);if(!w)return;const b=w.querySelectorAll("tr:not(.ingredient-section-header)"),k=f[y];let L=0;for(const A of k){if(A.grams==null)continue;if(L>=b.length)break;const S=b[L]?.querySelector(".ingredient-qty");S&&s.push({baseGrams:A.grams,cell:S}),L++}});const _=d=>d===0?"0g":d>=10?`${Math.round(d)}g`:d>=1?`${Math.round(d*10)/10}g`:`${Math.round(d*100)/100}g`,l=d=>{if(Number.isInteger(d))return`×${d}`;const y=Math.round(d*10)/10;return Math.abs(d-y)<.001?`×${y.toFixed(1)}`:`×${d.toFixed(2)}`},v=()=>{t.textContent=l(a),t.classList.toggle("dose-calculator__display--modified",a!==1),o.disabled=a<=r,s.forEach(({baseGrams:d,cell:y})=>{const w=y.getAttribute("data-base"),b=w!==null?parseFloat(w):d;y.textContent=_(b*a),y.getAnimations().forEach(k=>k.cancel()),y.classList.remove("dose-updated"),requestAnimationFrame(()=>y.classList.add("dose-updated"))}),document.querySelectorAll(".dose-inline:not([data-fixed])").forEach(d=>{const y=parseFloat(d.getAttribute("data-base"));isNaN(y)||(d.textContent=Q(y*a),d.getAnimations().forEach(w=>w.cancel()),d.classList.remove("dose-updated"),requestAnimationFrame(()=>d.classList.add("dose-updated")))}),Pe()};o.addEventListener("click",()=>{const d=Math.round((a-n)*100)/100;d>=r&&(a=d,v())}),i.addEventListener("click",()=>{a=Math.round((a+n)*100)/100,v()}),v()}function Pe(){const e=document.getElementById("ingredient-total-qty");if(!e)return;let t=0;const o=document.getElementById("ingredients-table");if(!o)return;o.querySelectorAll("tr:not(.ingredient-section-header):not(.ingredient-total-row):not([data-exclude-total]) .ingredient-qty").forEach(n=>{const r=n.textContent.trim(),a=parseFloat(r);isNaN(a)||(t+=a)});const i=t>=1e3?`~${(t/1e3).toFixed(1)}kg`:`${Math.round(t)}g`;e.textContent=i,e.classList.remove("dose-updated"),e.offsetWidth,e.classList.add("dose-updated")}function m(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}function Y(e){return e.replace(/\{([a-z_]+):(\d+\.?\d*)(!)?\}/g,(t,o,i,n)=>{const r=parseFloat(i),a=Q(r);return`<span class="dose-inline" data-base="${r}" data-token-id="${o}"${n?' data-fixed="true"':""}>${a}</span>`})}function Q(e){return e===0?"0":e>=10?`${Math.round(e)}`:e>=1?`${Math.round(e*10)/10}`:`${Math.round(e*100)/100}`}function Be(){const e=document.getElementById("sensory-header");if(!e)return;const t=document.getElementById("sensory-chart-container"),o=e.querySelector(".sensory-chevron");if(!t||!o)return;const i=e.getAttribute("data-chart-id"),n=window.__sensoryChartData?.[i];if(!n)return;let r=null;e.addEventListener("click",async()=>{if(t.style.display==="none"||!t.style.display){if(t.style.display="block",o.style.transform="rotate(180deg)",!window.Chart)try{const b=await N(()=>import("https://cdn.jsdelivr.net/npm/chart.js@4/+esm"),[]);window.Chart=b.Chart;const{RadarController:k,RadialLinearScale:L,PointElement:A,LineElement:S,Filler:Z,Tooltip:ee}=b;window.Chart.register(k,L,A,S,Z,ee)}catch(b){console.error("Errore caricamento Chart.js:",b);return}r&&(r.destroy(),r=null);const s=document.getElementById("sensoryChart")?.getContext("2d");if(!s)return;const{labels:c,values:g}=n,f=window.innerWidth<600,_=c.map(b=>f&&b.includes(" ")?b.split(" "):b),l=document.documentElement.getAttribute("data-theme")==="dark",v=l?"rgba(212, 165, 116, 0.8)":"rgba(184, 129, 58, 0.8)",d=l?"rgba(212, 165, 116, 0.2)":"rgba(184, 129, 58, 0.2)",y=l?"rgba(255, 255, 255, 0.1)":"rgba(0, 0, 0, 0.1)",w=l?"#94a3b8":"#64748b";r=new Chart(s,{type:"radar",data:{labels:_,datasets:[{label:"Valore",data:g,backgroundColor:d,borderColor:v,pointBackgroundColor:v,pointBorderColor:"#fff",pointHoverBackgroundColor:"#fff",pointHoverBorderColor:v,borderWidth:2}]},options:{responsive:!0,maintainAspectRatio:!0,layout:{padding:f?10:20},scales:{r:{min:0,max:10,angleLines:{color:y},grid:{color:y},pointLabels:{color:w,font:{family:"Inter",size:f?10:12,weight:"500"}},ticks:{display:!1,stepSize:2}}},plugins:{legend:{display:!1},tooltip:{backgroundColor:l?"#1e293b":"#fff",titleColor:l?"#f8fafc":"#0f172a",bodyColor:l?"#cbd5e1":"#475569",borderColor:l?"#334155":"#e2e8f0",borderWidth:1,padding:10,displayColors:!1,callbacks:{label:b=>b.formattedValue+" / 10"}}}}})}else t.style.display="none",o.style.transform="rotate(0deg)"})}function Re(){return`
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

    </svg>`}function je(){return`
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
        ${Re()}
      </div>

      <!-- Phase 7: Title text -->
      <div class="logo-intro__text">Il Ricettario</div>

      <!-- Phase 7b: Subtitle -->
      <div class="logo-intro__subtitle">Laboratorio Artigianale</div>
    </div>
  `}function De(){if(sessionStorage.getItem("intro-shown"))return;if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){sessionStorage.setItem("intro-shown","1");return}N(()=>Promise.resolve({}),__vite__mapDeps([0]));const e=()=>{document.body.insertAdjacentHTML("afterbegin",je()),ze(),sessionStorage.setItem("intro-shown","1")};document.body?e():document.addEventListener("DOMContentLoaded",e,{once:!0})}function ze(){const e=document.getElementById("logo-intro"),t=document.getElementById("logo-intro-logo");if(!e)return;document.documentElement.style.overflow="hidden";const o=setTimeout(()=>{t&&t.classList.add("glowing")},1700);e.addEventListener("animationend",i=>{i.animationName==="introOverlayOut"&&(document.documentElement.style.overflow="",e.classList.add("logo-intro--done"),requestAnimationFrame(()=>e.remove()),clearTimeout(o))}),setTimeout(()=>{document.getElementById("logo-intro")&&(document.documentElement.style.overflow="",e.remove())},5e3)}const J="?v=f707180b";De();document.addEventListener("DOMContentLoaded",()=>{Oe(),He(),qe();const e=document.getElementById("current-year");e&&(e.textContent=new Date().getFullYear()),E(),Ne(),te({home:Ve,recipe:be,category:Ue}),oe()});function Oe(){const e=document.getElementById("navbar");if(!e)return;const t=()=>e.classList.toggle("scrolled",window.scrollY>50);window.addEventListener("scroll",t,{passive:!0}),t()}function He(){const e=document.getElementById("theme-toggle");e&&(e.addEventListener("click",()=>{const o=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";e.classList.add("theme-toggle--switching"),setTimeout(()=>e.classList.remove("theme-toggle--switching"),400),document.documentElement.setAttribute("data-theme",o),localStorage.setItem("theme",o)}),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",t=>{localStorage.getItem("theme")||document.documentElement.setAttribute("data-theme",t.matches?"dark":"light")}))}function qe(){const e=document.getElementById("hamburger"),t=document.getElementById("nav-links");!e||!t||(e.addEventListener("click",()=>{e.classList.toggle("open"),t.classList.toggle("open")}),t.querySelectorAll("a").forEach(o=>{o.addEventListener("click",()=>{e.classList.remove("open"),t.classList.remove("open")})}),document.addEventListener("click",o=>{!e.contains(o.target)&&!t.contains(o.target)&&(e.classList.remove("open"),t.classList.remove("open"))}))}let x=null;function Fe(e){const t=new URL(h,window.location.origin),o=i=>!i||/^([a-z]+:|\/\/|\/|#)/i.test(i)?i:new URL(i,t).pathname;e.querySelectorAll("[src], [href], [srcset]").forEach(i=>{["src","href"].forEach(r=>{const a=i.getAttribute(r);a&&i.setAttribute(r,o(a))});const n=i.getAttribute("srcset");n&&i.setAttribute("srcset",n.split(",").map(r=>{const[a,...s]=r.trim().split(/\s+/);return[o(a),...s].join(" ")}).join(", "))})}function K(e,t,o){const i=e.cloneNode(!0);return Fe(i),{html:i.innerHTML,title:t,description:o}}function Ne(){const e=document.getElementById("app");e?.querySelector("#ricette")&&(x=K(e,document.title,document.querySelector('meta[name="description"]')?.getAttribute("content")||""))}async function Ge(){if(x)return x;const e=await fetch(h),t=new DOMParser().parseFromString(await e.text(),"text/html"),o=t.getElementById("app");if(!o)throw new Error("index.html non contiene #app");return x=K(o,t.title,t.querySelector('meta[name="description"]')?.getAttribute("content")||""),x}async function Ve(e){if(!e.querySelector("#ricette"))try{const o=await Ge();e.innerHTML=o.html}catch(o){console.error("Impossibile ricostruire la homepage:",o),window.location.assign(h);return}const t=x;if(t){document.title=t.title;const o=document.querySelector('meta[name="description"]');o&&o.setAttribute("content",t.description)}E(),Qe(),P()}const C=12,We=he;let u={allRecipes:[],filteredRecipes:[],displayedCount:C,viewMode:"grid",sortType:"az",searchQuery:"",categoryDir:""};async function Ue(e,{category:t}){const o=We[t]||{name:t,emoji:"spaghetti",title:t,desc:`Tutte le ricette di ${t}.`};document.title=`${o.title} — Il Ricettario`;const i=document.querySelector('meta[name="description"]');i&&i.setAttribute("content",o.desc),u={allRecipes:[],filteredRecipes:[],displayedCount:C,viewMode:localStorage.getItem("catViewMode")||"grid",sortType:"az",searchQuery:"",categoryDir:t},e.innerHTML=`
    <section class="category-hero" id="category-hero">
      <div class="category-hero__content">
        <h1 class="category-hero__title">${o.title}</h1>
        <p class="category-hero__subtitle">${o.desc}</p>
        <div class="category-hero__count" id="recipe-count">⏳ Caricamento...</div>
      </div>
    </section>

    <main class="section">
      <div class="container">
        <nav class="breadcrumb">
          <a href="${h}" data-link>Home</a>
          <span class="breadcrumb__separator">›</span>
          <a href="${h}#ricette" data-link>Ricette</a>
          <span class="breadcrumb__separator">›</span>
          <span class="breadcrumb__current">${o.name}</span>
        </nav>

        <div class="category-toolbar" id="category-toolbar">
          <div class="category-toolbar__search">
            <span class="category-toolbar__search-icon"><i data-lucide="search" style="width:16px;height:16px"></i></span>
            <input type="text" class="category-toolbar__search-input" id="category-search"
              placeholder="Cerca tra le ricette di ${o.name.toLowerCase()}...">
          </div>
          <div class="category-toolbar__results" id="results-counter"></div>
          <div class="category-toolbar__sort">
            <button class="category-toolbar__sort-btn active" data-sort="az">A-Z</button>
            <button class="category-toolbar__sort-btn" data-sort="hydration">${p("droplet",14)} Idratazione</button>
          </div>
          <div class="category-toolbar__views">
            <button class="view-toggle-btn ${u.viewMode==="grid"?"active":""}" data-view="grid" aria-label="Vista griglia">
              <i data-lucide="grid-3x3" style="width:16px;height:16px"></i>
            </button>
            <button class="view-toggle-btn ${u.viewMode==="list"?"active":""}" data-view="list" aria-label="Vista lista">
              <i data-lucide="list" style="width:16px;height:16px"></i>
            </button>
          </div>
        </div>

        <div class="category-grid ${u.viewMode==="list"?"category-grid--list":""}" id="category-grid">
          ${Ye(6)}
        </div>

        <div id="load-more-container"></div>
      </div>
    </main>
  `,E();try{const r=await(await fetch(`${h}recipes.json${J}`)).json();u.allRecipes=r.recipes.filter(c=>c.categoryDir===t||c.category===o.name),u.allRecipes.sort((c,g)=>(c.title||"").localeCompare(g.title||"","it")),u.filteredRecipes=[...u.allRecipes];const a=u.allRecipes.find(c=>c.image);if(a){const c=document.getElementById("category-hero");c&&(c.style.backgroundImage=`url('${h}${a.image}')`)}const s=document.getElementById("recipe-count");s&&(s.innerHTML=`${p("bullseye",16)} ${u.allRecipes.length} ricett${u.allRecipes.length===1?"a":"e"}`),T(),Xe(e),P(),I()}catch(n){console.error("Errore caricamento categoria:",n);const r=document.getElementById("category-grid");r&&(r.innerHTML=`<div class="category-empty"><div class="category-empty__icon">${p("prohibited",32)}</div><p>Errore nel caricamento delle ricette.</p></div>`)}}function Xe(e){const t=document.getElementById("category-search");let o;t&&t.addEventListener("input",()=>{clearTimeout(o),o=setTimeout(()=>{u.searchQuery=t.value.toLowerCase().trim(),u.displayedCount=C,O(),T()},150)});const i=e.querySelectorAll(".category-toolbar__sort-btn");i.forEach(r=>{r.addEventListener("click",()=>{i.forEach(a=>a.classList.remove("active")),r.classList.add("active"),u.sortType=r.dataset.sort,u.displayedCount=C,O(),T()})});const n=e.querySelectorAll(".view-toggle-btn");n.forEach(r=>{r.addEventListener("click",()=>{n.forEach(s=>s.classList.remove("active")),r.classList.add("active"),u.viewMode=r.dataset.view,localStorage.setItem("catViewMode",u.viewMode);const a=document.getElementById("category-grid");a&&a.classList.toggle("category-grid--list",u.viewMode==="list")})})}function O(){let e=[...u.allRecipes];u.searchQuery&&(e=e.filter(t=>{const o=(t.title||"").toLowerCase(),i=(t.description||"").toLowerCase();return o.includes(u.searchQuery)||i.includes(u.searchQuery)})),u.sortType==="az"?e.sort((t,o)=>(t.title||"").localeCompare(o.title||"","it")):u.sortType==="hydration"&&e.sort((t,o)=>(parseInt(o.hydration)||0)-(parseInt(t.hydration)||0)),u.filteredRecipes=e}function T(){const e=document.getElementById("category-grid"),t=document.getElementById("load-more-container");if(!e)return;const{filteredRecipes:o,displayedCount:i,categoryDir:n}=u,r=o.slice(0,i),a=o.length,s=document.getElementById("results-counter");if(s&&(u.searchQuery?s.innerHTML=`<strong>${a}</strong> risultat${a===1?"o":"i"}`:s.innerHTML=`<strong>${Math.min(i,a)}</strong> di <strong>${a}</strong>`),a===0){e.innerHTML=`
      <div class="category-empty" style="grid-column: 1 / -1">
        <div class="category-empty__icon"><i data-lucide="search" style="width:32px;height:32px"></i></div>
        <p>Nessuna ricetta trovata</p>
      </div>`,t&&(t.innerHTML=""),E();return}if(e.innerHTML=r.map((c,g)=>`
      <a href="${`${h}ricette/${c.categoryDir||n}/${c.slug}`}" class="category-card" data-link
         data-title="${(c.title||"").toLowerCase()}"
         data-hydration="${parseInt(c.hydration)||0}">
        <div class="category-card__image-wrapper">
          ${c.image?V(`${h}${c.image}`,c.title,"category-card__image","lazy"):""}
          <div class="category-card__meta">
            ${$(c.hydration)?`<span class="category-card__tag">${p("droplet",14)} ${c.hydration}</span>`:""}
            ${$(c.time)?`<span class="category-card__tag">${p("stopwatch",14)} ${c.time}</span>`:""}
          </div>
        </div>
        <div class="category-card__body">
          <h3 class="category-card__title">${c.title}</h3>
          ${c.description?`<p class="category-card__desc">${c.description}</p>`:""}
        </div>
      </a>`).join(""),t)if(i<a){const c=a-i,g=Math.round(i/a*100);t.innerHTML=`
        <div class="load-more-wrapper">
          <button class="load-more-btn" id="load-more-btn">
            <span>Carica altre ${Math.min(c,C)} ricette</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div class="load-more-progress">${i} di ${a} ricette</div>
          <div class="load-more-bar"><div class="load-more-bar__fill" style="width: ${g}%"></div></div>
        </div>`,document.getElementById("load-more-btn")?.addEventListener("click",()=>{u.displayedCount+=C,T(),setTimeout(()=>{const _=e.querySelectorAll(".category-card")[i];_&&_.scrollIntoView({behavior:"smooth",block:"center"})},100),I()})}else t.innerHTML="";E(),I()}function Ye(e){return Array.from({length:e},()=>`
    <div class="category-card category-card--skeleton">
      <div class="category-card__image-wrapper"></div>
      <div class="category-card__body">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--desc"></div>
      </div>
    </div>`).join("")}function H(e,t,o,i,n){const r=document.createElement("div");r.className="category-row reveal",r.dataset.category=t,r.innerHTML=`
    <div class="category-row__header">
      <h3 class="category-row__title">
        ${p(o,32)} ${t}
        <span class="category-row__count">${n.length} ricett${n.length===1?"a":"e"}</span>
      </h3>
      <a href="${h}ricette/${i}/" class="category-row__link" data-link>Vedi tutte</a>
    </div>
    <div class="category-row__carousel-wrapper">
      <button class="carousel-arrow carousel-arrow--prev" aria-label="Precedente">‹</button>
      <div class="category-row__carousel">
        ${n.map(l=>`
          <a href="${l.href.replace(".html","")}" class="recipe-card--compact" data-link data-title="${l.title.toLowerCase()}" data-category="${l.category}">
            <div class="recipe-card--compact__image-wrapper">
              ${l.image?V(l.image,l.title,"recipe-card--compact__image","lazy"):""}
            </div>
            <div class="recipe-card--compact__body">
              <h4 class="recipe-card--compact__title">${l.title}</h4>
              <div class="recipe-card--compact__meta">
                ${$(l.hydration)?`<span class="recipe-card--compact__tag">${p("droplet",16)} ${l.hydration}</span>`:""}
                ${$(l.time)?`<span>${p("stopwatch",16)} ${l.time}</span>`:""}
              </div>
            </div>
          </a>`).join("")}
      </div>
      <button class="carousel-arrow carousel-arrow--next" aria-label="Successivo">›</button>
    </div>
  `,e.appendChild(r);const a=r.querySelector(".category-row__carousel"),s=r.querySelector(".category-row__carousel-wrapper"),c=r.querySelector(".carousel-arrow--prev"),g=r.querySelector(".carousel-arrow--next"),f=276,_=()=>{const{scrollLeft:l,scrollWidth:v,clientWidth:d}=a;s.classList.toggle("has-scroll-left",l>10),s.classList.toggle("has-scroll-right",l<v-d-10),c.disabled=l<=10,g.disabled=l>=v-d-10};a.addEventListener("scroll",_,{passive:!0}),requestAnimationFrame(_),c.addEventListener("click",()=>a.scrollBy({left:-f*3,behavior:"smooth"})),g.addEventListener("click",()=>a.scrollBy({left:f*3,behavior:"smooth"}))}function Qe(){const e=document.getElementById("recipe-carousels");if(!e)return;const t=ue.map(o=>{const i=B[o];return{key:i.name,emoji:i.emoji,dir:i.dir}});fetch(`${h}recipes.json${J}`).then(o=>o.json()).then(o=>{e.innerHTML="";const i={};o.recipes.forEach(r=>{i[r.category]||(i[r.category]=[]),i[r.category].push(r)}),t.forEach(r=>{const a=i[r.key];!a||a.length===0||H(e,r.key,r.emoji,r.dir,a)});const n=new Set(t.map(r=>r.key));Object.keys(i).forEach(r=>{if(n.has(r))return;const a=i[r];if(!a||a.length===0)return;const s=r.toLowerCase(),c=X[r]||"fork-and-knife";H(e,r,c,s,a)}),P(),Je(),I()}).catch(o=>{console.error("Errore caricamento recipes.json:",o),e.innerHTML='<p style="text-align:center; color: var(--color-text-muted);">Errore nel caricamento delle ricette.</p>'})}function Je(){const e=document.getElementById("search-input");e&&(e.addEventListener("input",()=>{const t=e.value.toLowerCase().trim(),o=document.querySelectorAll(".recipe-card--compact"),i=document.querySelectorAll(".category-row");o.forEach(n=>{const r=n.dataset.title||n.textContent.toLowerCase();n.classList.toggle("hidden",!!(t&&!r.includes(t)))}),i.forEach(n=>{const r=n.querySelectorAll(".recipe-card--compact:not(.hidden)");n.classList.toggle("hidden",r.length===0)})}),document.addEventListener("keydown",t=>{t.key==="/"&&document.activeElement!==e&&(t.preventDefault(),e.focus(),e.scrollIntoView({behavior:"smooth",block:"center"})),t.key==="Escape"&&document.activeElement===e&&(e.value="",e.dispatchEvent(new Event("input")),e.blur())}))}
