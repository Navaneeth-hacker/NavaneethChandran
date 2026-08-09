const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

// ===== Scroll progress + nav bg + hide-on-scroll-down =====
const progressBar = document.getElementById('progressBar');
const nav = document.getElementById('nav');
let lastScrollY = window.scrollY;
function onScroll(){
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const scrolled = max > 0 ? (h.scrollTop / max) * 100 : 0;
  if(progressBar) progressBar.style.width = scrolled + '%';
  if(nav){
    nav.classList.toggle('scrolled', h.scrollTop > 40);
    const goingDown = h.scrollTop > lastScrollY;
    if(goingDown && h.scrollTop > 200){
      nav.classList.add('hidden');
    } else {
      nav.classList.remove('hidden');
    }
  }
  lastScrollY = h.scrollTop;
}
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// ===== Mobile menu =====
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
if(navToggle && mobileMenu){
  navToggle.addEventListener('click', ()=>{
    const isOpen = mobileMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });
  mobileMenu.querySelectorAll('a').forEach(a=>a.addEventListener('click', ()=>{
    mobileMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }));
}

// ===== Fade-up reveal on scroll =====
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
}, {threshold:0.15, rootMargin:'0px 0px -60px 0px'});
document.querySelectorAll('.fade-up, .tl-item').forEach(el=>io.observe(el));

// ===== Hero title char reveal =====
window.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.reveal-line span').forEach((el,i)=>{
    el.style.transform = 'translateY(110%)';
    el.style.opacity = '0';
    setTimeout(()=>{
      el.style.transition = 'transform 0.9s cubic-bezier(.16,.84,.28,1), opacity 0.9s';
      el.style.transform = 'translateY(0)';
      el.style.opacity = '1';
    }, 200 + i*130);
  });
  document.querySelectorAll('.hero .fade-up').forEach((el,i)=>{
    setTimeout(()=>el.classList.add('visible'), 700 + i*150);
  });
});


// ===== Magnetic buttons =====
if(!isTouch && !prefersReducedMotion){
  document.querySelectorAll('.magnetic').forEach(el=>{
    el.addEventListener('mousemove', (e)=>{
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width/2;
      const y = e.clientY - rect.top - rect.height/2;
      el.style.transform = `translate(${x*0.12}px, ${y*0.18}px)`;
    });
    el.addEventListener('mouseleave', ()=>{
      el.style.transform = 'translate(0,0)';
    });
  });
}

// ===== Animated counters (generic) =====
const counters = document.querySelectorAll('[data-count]');
const counterIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      let cur = 0;
      const step = Math.max(1, Math.round(target/40));
      const iv = setInterval(()=>{
        cur += step;
        if(cur >= target){ cur = target; clearInterval(iv); }
        el.textContent = cur;
      }, 30);
      counterIO.unobserve(el);
    }
  });
}, {threshold:0.5});
counters.forEach(c=>counterIO.observe(c));

// ===== Tech card stagger animations =====
if(typeof gsap !== 'undefined'){
  const techCards = document.querySelectorAll('.tech-card');
  const techIO = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && !entry.target.dataset.animated){
        entry.target.dataset.animated = 'true';
        gsap.from(entry.target, {
          opacity:0, scale:0.8, y:20, duration:0.5, stagger:0.06,
          ease:'back.out(1.5)', delay:0.1
        });
      }
    });
  }, {threshold:0.2, rootMargin:'0px 0px -40px 0px'});
  techCards.forEach(card=>techIO.observe(card));

  const groupHeaders = document.querySelectorAll('.group-header');
  const headerIO = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && !entry.target.dataset.animated){
        entry.target.dataset.animated = 'true';
        gsap.from(entry.target, {opacity:0, x:-30, duration:0.6, ease:'power2.out'});
      }
    });
  }, {threshold:0.3});
  groupHeaders.forEach(header=>headerIO.observe(header));

  const marqueeTrack = document.querySelector('.marquee-track');
  if(marqueeTrack){
    const marqueeContainer = marqueeTrack.parentElement;
    marqueeContainer.addEventListener('mouseenter', ()=>{
      marqueeTrack.style.animationPlayState = 'paused';
      gsap.to('.marquee-tech svg', {filter:'drop-shadow(0 8px 24px rgba(255,255,255,.15))', duration:0.3, stagger:0.05});
    });
    marqueeContainer.addEventListener('mouseleave', ()=>{
      marqueeTrack.style.animationPlayState = 'running';
      gsap.to('.marquee-tech svg', {filter:'drop-shadow(0 0px 0px rgba(255,255,255,0))', duration:0.3, stagger:0.05});
    });
  }
}


// ===== Active nav link on scroll =====
const sections = document.querySelectorAll('section, header.hero');
const navLinks = document.querySelectorAll('.nav-links a');
const navIO = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const id = entry.target.getAttribute('id');
      navLinks.forEach(l=>l.classList.toggle('active', l.getAttribute('href') === '#'+id));
    }
  });
}, {threshold:0.5});
sections.forEach(s=>navIO.observe(s));

// ===== Copy email =====
const copyBtn = document.getElementById('copyEmail');
const emailText = document.getElementById('emailText');
const copyIcon = document.getElementById('copyIcon');
if(copyBtn){
  copyBtn.addEventListener('click', ()=>{
    navigator.clipboard?.writeText(emailText.textContent.trim());
    const original = copyIcon.textContent;
    copyIcon.textContent = '✓';
    setTimeout(()=>copyIcon.textContent = original, 1500);
  });
}

// ===== Lightbox gallery =====
const galleryItems = Array.from(document.querySelectorAll('.g-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let currentLightboxIndex = 0;

function openLightbox(index){
  if(!lightbox || !galleryItems.length) return;
  currentLightboxIndex = (index + galleryItems.length) % galleryItems.length;
  const item = galleryItems[currentLightboxIndex];
  const src = item.dataset.src || item.querySelector('img')?.getAttribute('data-src') || item.querySelector('img')?.src;
  const caption = item.dataset.caption || '';
  lightboxImage.src = src;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeLightbox(){
  if(!lightbox) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
galleryItems.forEach((item, i)=>{
  item.addEventListener('click', ()=>openLightbox(i));
});
lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', ()=>openLightbox(currentLightboxIndex - 1));
lightboxNext?.addEventListener('click', ()=>openLightbox(currentLightboxIndex + 1));
document.querySelector('.lightbox-fade')?.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e)=>{
  if(!lightbox || !lightbox.classList.contains('open')) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') openLightbox(currentLightboxIndex - 1);
  if(e.key === 'ArrowRight') openLightbox(currentLightboxIndex + 1);
});

// ===== Lazy-load images marked with data-src (gallery uses this pattern) =====
document.querySelectorAll('img[data-src]').forEach(img=>{
  if(!img.getAttribute('src')){
    img.src = img.dataset.src;
  }
});

// ===== Smooth anchor scroll =====
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const target = document.querySelector(a.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior: prefersReducedMotion ? 'auto' : 'smooth', block:'start'});
    }
  });
});