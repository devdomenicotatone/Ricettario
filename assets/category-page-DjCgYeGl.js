import"./animations-D-SwE_vs.js";document.addEventListener("DOMContentLoaded",()=>{const m=window.location.pathname,h={"/ricette/pasta/":"Pasta","/ricette/pane/":"Pane","/ricette/pizza/":"Pizza","/ricette/lievitati/":"Lievitati","/ricette/focaccia/":"Focaccia","/ricette/dolci/":"Dolci"};let d=null;for(const[e,t]of Object.entries(h))if(m.includes(e)){d=t;break}if(!d){console.error("Categoria non riconosciuta dal path:",m);return}const o=document.getElementById("theme-toggle");o&&o.addEventListener("click",()=>{const t=document.documentElement.getAttribute("data-theme")==="dark"?"light":"dark";o.classList.add("theme-toggle--switching"),setTimeout(()=>o.classList.remove("theme-toggle--switching"),400),document.documentElement.setAttribute("data-theme",t),localStorage.setItem("theme",t)});const r=document.getElementById("hamburger"),s=document.getElementById("nav-links");r&&s&&(r.addEventListener("click",()=>{r.classList.toggle("open"),s.classList.toggle("open")}),s.querySelectorAll("a").forEach(e=>{e.addEventListener("click",()=>{r.classList.remove("open"),s.classList.remove("open")})}));const u=document.getElementById("navbar");if(u){const e=()=>u.classList.toggle("scrolled",window.scrollY>50);window.addEventListener("scroll",e,{passive:!0}),e()}const y=document.getElementById("current-year");y&&(y.textContent=new Date().getFullYear());const i=document.getElementById("category-grid"),v=document.getElementById("recipe-count");let l=[];fetch("/Ricettario/recipes.json").then(e=>e.json()).then(e=>{l=e.recipes.filter(t=>t.category===d),v.textContent=`📊 ${l.length} ricette`,p(l),E(),L()}).catch(e=>{console.error("Errore caricamento:",e),i.innerHTML='<p style="text-align:center; padding: 2rem;">Errore nel caricamento.</p>'});function p(e){if(e.length===0){i.innerHTML=`
        <div class="category-empty" style="grid-column: 1 / -1">
          <div class="category-empty__icon">🔍</div>
          <p>Nessuna ricetta trovata</p>
        </div>`;return}i.innerHTML=e.map((t,n)=>{const a=Math.min(n*.05,1.5);return`
      <a href="${t.slug}.html" class="category-card slide-up-enter" style="animation-delay: ${a}s" data-title="${t.title.toLowerCase()}" data-hydration="${parseInt(t.hydration)||0}">
        <div class="category-card__image-wrapper">
          ${t.image?`<img src="../../${t.image}" alt="${t.title}" class="category-card__image" loading="lazy">`:""}
          <div class="category-card__meta">
            ${t.hydration?`<span class="category-card__tag">💧 ${t.hydration}</span>`:""}
            ${t.tool?`<span class="category-card__tag">🔧 ${t.tool}</span>`:""}
          </div>
        </div>
        <div class="category-card__body">
          <h3 class="category-card__title">${t.title}</h3>
          ${t.description?`<p class="category-card__desc">${t.description}</p>`:""}
        </div>
      </a>
    `}).join("")}function E(){const e=document.getElementById("category-search");e&&e.addEventListener("input",()=>{const t=e.value.toLowerCase().trim();i.querySelectorAll(".category-card").forEach(a=>{const c=a.dataset.title||"";a.style.display=!t||c.includes(t)?"":"none"})})}function L(){const e=document.querySelectorAll(".category-toolbar__sort-btn");e.forEach(t=>{t.addEventListener("click",()=>{e.forEach(c=>c.classList.remove("active")),t.classList.add("active");const n=t.dataset.sort;let a=[...l];n==="az"?a.sort((c,g)=>c.title.localeCompare(g.title,"it")):n==="hydration"&&a.sort((c,g)=>{const f=parseInt(c.hydration)||0;return(parseInt(g.hydration)||0)-f}),p(a)})})}});
