// Weblio sample-site motion library. Load after lenis (optional). Exposes window.FX.
(function(){
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine=matchMedia("(hover:hover) and (pointer:fine)").matches;
  const root=document.documentElement;
  const clamp=(v,a,b)=>Math.min(Math.max(v,a),b);
  const FX={reduce,fine,clamp,lenis:null,onScroll:[]};
  window.FX=FX;

  // Split text into masked words (keeps inline elements like <em>)
  function split(el){
    let i=0;
    const walk=node=>{
      [...node.childNodes].forEach(n=>{
        if(n.nodeType===3){
          const parts=n.textContent.split(/(\s+)/);const frag=document.createDocumentFragment();
          parts.forEach(p=>{
            if(!p)return;
            if(/^\s+$/.test(p)){frag.append(document.createTextNode(" "));return;}
            const o=document.createElement("span");o.className="sw";const s=document.createElement("span");s.textContent=p;s.style.setProperty("--wi",i++);o.append(s);frag.append(o);
          });
          n.replaceWith(frag);
        }else if(n.nodeType===1&&n.tagName!=="BR"){walk(n);}
      });
    };
    walk(el);
  }
  document.querySelectorAll("[data-split]").forEach(split);

  if(!reduce&&"IntersectionObserver" in window){
    root.classList.add("fx");
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}}),{rootMargin:"0px 0px -8% 0px",threshold:.01});
    requestAnimationFrame(()=>document.querySelectorAll("[data-reveal],[data-split]").forEach(el=>io.observe(el)));
    // failsafe: never leave content hidden
    setTimeout(()=>document.querySelectorAll("[data-reveal]:not(.in),[data-split]:not(.in)").forEach(el=>{const r=el.getBoundingClientRect();if(r.top<innerHeight)el.classList.add("in");}),2500);
  }

  // Smooth scroll
  if(!reduce&&window.Lenis){
    try{FX.lenis=new Lenis({lerp:.1});const raf=t=>{FX.lenis.raf(t);requestAnimationFrame(raf);};requestAnimationFrame(raf);}catch(e){FX.lenis=null;}
  }
  FX.scrollTo=(target,offset=-70)=>{
    const el=typeof target==="string"?document.querySelector(target):target;if(!el)return;
    if(FX.lenis)FX.lenis.scrollTo(el,{offset,duration:1.3});
    else scrollTo({top:el.getBoundingClientRect().top+scrollY+offset,behavior:reduce?"auto":"smooth"});
  };
  document.addEventListener("click",e=>{
    const a=e.target.closest('a[href^="#"]');if(!a)return;const h=a.getAttribute("href");if(h.length<2)return;
    const t=document.querySelector(h);if(!t)return;e.preventDefault();FX.scrollTo(t,+(a.dataset.offset||-70));
    document.dispatchEvent(new CustomEvent("fx:navigate"));
  });

  // Counters
  const counters=[...document.querySelectorAll("[data-count]")];
  if(counters.length){
    const run=el=>{const end=parseFloat(el.dataset.count),dec=(el.dataset.count.split(".")[1]||"").length,dur=1600,t0=performance.now(),pre=el.dataset.pre||"",suf=el.dataset.suf||"";
      const step=t=>{const p=clamp((t-t0)/dur,0,1),v=end*(1-Math.pow(1-p,4));el.textContent=pre+v.toLocaleString("en-US",{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;if(p<1)requestAnimationFrame(step);};
      if(reduce){el.textContent=pre+end.toLocaleString("en-US",{minimumFractionDigits:dec})+suf;return;}requestAnimationFrame(step);};
    const io2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){run(e.target);io2.unobserve(e.target);}}),{threshold:.4});
    counters.forEach(c=>io2.observe(c));
  }

  // Pinned horizontal scroll
  const hs=[...document.querySelectorAll("[data-hscroll]")];
  function sizeH(){hs.forEach(s=>{const tr=s.querySelector(".h-track");if(innerWidth<=760){s.style.height="";return;}const dist=Math.max(tr.scrollWidth-innerWidth,0);s.style.height=(dist+innerHeight)+"px";s._dist=dist;});}
  if(hs.length){sizeH();addEventListener("resize",sizeH);addEventListener("load",sizeH);}

  // Parallax + per-frame hooks
  const par=[...document.querySelectorAll("[data-parallax]")];
  function frame(){
    const y=scrollY;
    if(innerWidth>760)hs.forEach(s=>{const tr=s.querySelector(".h-track");const top=s.offsetTop;const p=clamp((y-top)/(s.offsetHeight-innerHeight||1),0,1);tr.style.transform=`translate3d(${-p*(s._dist||0)}px,0,0)`;s.style.setProperty("--hp",p);});
    if(!reduce)par.forEach(el=>{const r=el.getBoundingClientRect();const c=(r.top+r.height/2-innerHeight/2);el.style.transform=`translate3d(0,${c*-parseFloat(el.dataset.parallax)}px,0)`;});
    FX.onScroll.forEach(fn=>fn(y));
  }
  let ticking=false;
  addEventListener("scroll",()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{frame();ticking=false;});}},{passive:true});
  addEventListener("resize",frame);requestAnimationFrame(frame);

  // Compare sliders
  document.querySelectorAll(".cmp input").forEach(inp=>{const c=inp.closest(".cmp");const set=()=>c.style.setProperty("--p",inp.value+"%");inp.addEventListener("input",set);set();});

  // Magnetic
  if(fine&&!reduce)document.querySelectorAll("[data-magnetic]").forEach(b=>{
    b.addEventListener("pointermove",e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.25}px,${(e.clientY-r.top-r.height/2)*.35}px)`;});
    b.addEventListener("pointerleave",()=>{b.style.transform="";});
  });

  // Forms: validate, then show a confirmation
  document.querySelectorAll("form[data-kit]").forEach(form=>{
    form.addEventListener("submit",e=>{
      e.preventDefault();let ok=true;
      form.querySelectorAll("[required]").forEach(input=>{
        const err=input.closest("[data-field]")?.querySelector(".err");let msg="";
        if(!input.value.trim())msg="Please fill this in.";
        else if(input.type==="email"&&!/^\S+@\S+\.\S+$/.test(input.value))msg="Enter an email like name@example.com.";
        else if(input.type==="tel"&&input.value.replace(/\D/g,"").length<10)msg="Enter a 10-digit phone number.";
        if(err)err.textContent=msg;input.setAttribute("aria-invalid",msg?"true":"false");
        if(msg&&ok){ok=false;input.focus();}
      });
      if(!ok)return;
      const first=(form.querySelector("[name=name]")?.value||"").trim().split(/\s+/)[0];
      const tpl=form.parentElement.querySelector("template[data-done]");
      const done=document.createElement("div");done.className="form-done "+(form.dataset.doneClass||"");done.setAttribute("role","status");
      const h=document.createElement("h3");h.textContent=(form.dataset.doneTitle||"Thanks{n}!").replace("{n}",first?", "+first:"");
      const p=document.createElement("p");p.textContent=form.dataset.doneText||"We'll be in touch within one business day.";
      done.append(h,p);form.replaceWith(done);
    });
  });

  // Back to Weblio
  document.querySelectorAll("[data-back]").forEach(a=>a.addEventListener("click",e=>{
    try{if(document.referrer&&new URL(document.referrer).origin===location.origin&&history.length>1){e.preventDefault();history.back();}}catch(_){}
  }));
})();
