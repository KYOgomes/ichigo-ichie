/* =========================================================
   Ichigô Ichiê · 11ª Edição — interações e animações
   GSAP + ScrollTrigger (com fallback em IntersectionObserver)
   ========================================================= */
(() => {
  const WHATS = "5531988542319";
  const EVENT_START = new Date("2026-11-28T12:00:00-03:00");
  const EVENT_END = new Date("2026-11-28T21:00:00-03:00");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isSmall = window.matchMedia("(max-width: 820px)").matches;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Dados ---------- */
  // conteúdo editável em js/oficinas.js
  const workshops = window.OFICINAS || [];
  const TSURU_GOAL = 1000;

  const attractions = [
    { k: "器", t: "Exposição e feira de cerâmicas", d: "Sonia Imanishi e suas 15 alunas." },
    { k: "着", t: "Kimonos originais de Kyoto", d: "Exposição de peças autênticas." },
    { k: "本", t: "Lançamento: Crônicas de Portais", d: "Livro de Davi Dumont." },
    { k: "彫", t: "Tatuagem japonesa", d: "Eduardo Rosa (Eduart) · símbolos japoneses, preço sob consulta." },
    { k: "桜", t: "Cerejeiras e fragrâncias", d: "Henrique Miura · cerejeiras e seus produtos." },
    { k: "菓", t: "Doces japoneses", d: "Yumi Tomi · wagashi e delícias." },
    { k: "山", t: "Mostra do Livro Serra da Moeda", d: "As belezas da nossa serra." },
    { k: "種", t: "Sementes do Cerrado e Mata Atlântica", d: "Decoração do espaço com sementes de árvores nativas." },
  ];

  const waLink = (msg) => `https://wa.me/${WHATS}?text=${encodeURIComponent(msg)}`;
  const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });
  const waIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>';

  /* ---------- Tsuru de origami (SVG) ---------- */
  const palettes = {
    red:    ["#d7263d", "#b01e31", "#8c1726"],
    gold:   ["#e9c46a", "#cfa043", "#a87d2c"],
    white:  ["#fffaf1", "#e9e0cf", "#cbbfa8"],
    indigo: ["#3d5a80", "#2e4766", "#22354d"],
    pink:   ["#f6c1c9", "#e79aa7", "#c97584"],
  };
  function craneSVG(color = "red", still = false) {
    const [a, b, c] = palettes[color] || palettes.red;
    return `<svg class="crane${still ? " crane--still" : ""}" viewBox="0 0 200 120" aria-hidden="true">
      <polygon class="wing wing--far" points="100,80 128,82 150,8" fill="${c}"/>
      <polygon points="128,84 142,80 192,36" fill="${b}"/>
      <polygon points="62,84 100,76 142,82 104,108" fill="${a}"/>
      <polygon points="62,84 104,108 92,88" fill="${b}"/>
      <polygon points="62,84 82,82 24,34" fill="${b}"/>
      <polygon points="24,34 31,38 10,50" fill="${c}"/>
      <g class="wing wing--near">
        <polygon points="72,84 116,82 82,2" fill="${a}"/>
        <polygon points="72,84 94,83 82,2" fill="${b}"/>
      </g>
    </svg>`;
  }

  /* ---------- Revoada no hero ---------- */
  function buildSky() {
    const sky = $("#sky");
    if (!sky || reduceMotion) return;
    const colors = ["red", "gold", "white", "red", "indigo", "pink", "red", "gold"];
    const n = isSmall ? 5 : 8;
    for (let i = 0; i < n; i++) {
      const f = document.createElement("div");
      f.className = "flyer";
      const size = 40 + Math.random() * (isSmall ? 50 : 80);
      const dur = 16 + Math.random() * 18;
      f.style.cssText = `top:${8 + Math.random() * 62}%;--size:${size}px;--dur:${dur}s;--delay:${-Math.random() * dur}s;--op:${0.55 + size / 250};--flap:${0.7 + Math.random() * 0.6}s;z-index:${Math.round(size)}`;
      f.innerHTML = `<div class="flyer__bob">${craneSVG(colors[i % colors.length])}</div>`;
      sky.appendChild(f);
    }
  }

  /* camada fixa com overflow escondido: evita que pétalas e tsurus alarguem a página no celular */
  function fxLayer() {
    let l = $("#fx");
    if (!l) { l = document.createElement("div"); l.id = "fx"; l.className = "fx"; document.body.appendChild(l); }
    return l;
  }

  /* ---------- Pétalas de sakura ---------- */
  function startPetals() {
    if (reduceMotion) return;
    const max = isSmall ? 10 : 22;
    const layer = fxLayer();
    let alive = 0;
    const spawn = () => {
      if (document.hidden || alive >= max) return;
      const p = document.createElement("span");
      p.className = "petal";
      const fd = 9 + Math.random() * 9;
      p.style.cssText = `left:${Math.random() * 100}vw;--w:${8 + Math.random() * 10}px;--fd:${fd}s;--sx:${(Math.random() * 120 - 60).toFixed(0)}px`;
      layer.appendChild(p);
      alive++;
      p.addEventListener("animationend", () => { p.remove(); alive--; });
    };
    for (let i = 0; i < max / 2; i++) setTimeout(spawn, i * 600);
    setInterval(spawn, 900);
  }

  /* ---------- Contagem regressiva ---------- */
  function startCountdown() {
    const ids = ["cdD", "cdH", "cdM", "cdS"].map((id) => $("#" + id));
    const box = $("#countdown"), msg = $("#countdownMsg");
    const pad = (n) => String(n).padStart(2, "0");
    const tick = () => {
      const now = new Date();
      if (now >= EVENT_START) {
        box.hidden = true; msg.hidden = false;
        msg.textContent = now < EVENT_END ? "🎌 Acontecendo agora! Venha nos visitar." : "Arigatô! Obrigado por fazer parte deste encontro.";
        return;
      }
      let s = Math.floor((EVENT_START - now) / 1000);
      const d = Math.floor(s / 86400); s -= d * 86400;
      const h = Math.floor(s / 3600); s -= h * 3600;
      const m = Math.floor(s / 60); s -= m * 60;
      [d, h, m, s].forEach((v, i) => {
        const txt = pad(v);
        if (ids[i].textContent !== txt) {
          ids[i].textContent = txt;
          if (window.gsap && !reduceMotion) gsap.fromTo(ids[i], { yPercent: -40, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .35, ease: "back.out(2)" });
        }
      });
      setTimeout(tick, 1000);
    };
    tick();
  }

  /* ---------- Cards ---------- */
  function renderWorkshops() {
    const wrap = $("#workshops");
    wrap.innerHTML = workshops.map((w, i) => {
      const free = w.price === 0;
      return `<article class="card reveal" data-type="${free ? "free" : "paid"}" style="--i:${i}">
        ${w.img ? `<div class="card__thumb"><img src="${w.img}" alt="" loading="lazy"></div>` : ""}
        <div class="card__stamp" aria-hidden="true">${w.k}</div>
        <h3>${w.t}</h3>
        <p class="card__who">${w.who}</p>
        <div class="card__tags">${workshopTags(w)}</div>
        <div class="card__actions">
          <button class="card__more" type="button" data-index="${i}">Ver mais</button>
          <a class="card__btn" href="${waLink(reserveMsg(w))}" target="_blank" rel="noopener">${waIcon} Reservar</a>
        </div>
      </article>`;
    }).join("");

    $("#attractions").innerHTML = attractions.map((a) => `
      <div class="attr reveal">
        <span class="attr__k" aria-hidden="true">${a.k}</span>
        <div><h3>${a.t}</h3><p>${a.d}</p></div>
      </div>`).join("");
  }

  function workshopTags(w) {
    const priceTag = w.price === 0
      ? '<span class="tag tag--free">Gratuita</span>'
      : w.price ? `<span class="tag tag--price">${w.label ? w.label + " " : ""}${brl(w.price)}</span>` : `<span class="tag">${w.note || "Valor a consultar"}</span>`;
    return priceTag + (w.spots ? `<span class="tag">${w.spots}</span>` : "");
  }
  const reserveMsg = (w) => `Olá Geraldo! Gostaria de reservar uma vaga na oficina de ${w.t} (${w.who.split(" ·")[0]}) no Ichigô Ichiê, dia 28/11.`;

  /* ---------- "Ver mais" das oficinas ---------- */
  function setupWorkshopModal() {
    const dlg = $("#ofModal");
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const open = (w) => {
      $("#ofMedia").innerHTML = w.img
        ? `<img src="${w.img}" alt="Oficina de ${esc(w.t)}">`
        : `<div class="ofmodal__placeholder"><span>${w.k}</span><small>foto em breve</small></div>`;
      $("#ofStamp").textContent = w.k;
      $("#ofTitle").textContent = w.t;
      $("#ofWho").textContent = w.who;
      $("#ofTags").innerHTML = workshopTags(w);
      const texto = (w.texto || []).filter(Boolean);
      $("#ofText").innerHTML = texto.length
        ? texto.map((p) => `<p>${esc(p)}</p>`).join("")
        : '<p class="ofmodal__soon">A descrição completa desta oficina chega em breve. Enquanto isso, fale com o Geraldo pelo WhatsApp para tirar dúvidas e garantir sua vaga.</p>';
      const info = (w.detalhes || []).filter((d) => d.valor);
      $("#ofInfo").innerHTML = info.map((d) => `<div><dt>${esc(d.rotulo)}</dt><dd>${esc(d.valor)}</dd></div>`).join("");
      $("#ofInfo").hidden = !info.length;
      $("#ofReserve").href = waLink(reserveMsg(w));
      dlg.showModal();
      dlg.querySelector(".ofmodal__scroll").scrollTop = 0;
      if (window.gsap && !reduceMotion) {
        // a entrada da própria janela é feita em CSS: transformar o <dialog> pelo GSAP tira o modo modal no Chrome
        gsap.timeline()
          .fromTo("#ofMedia > *", { scale: 1.15 }, { scale: 1, duration: 1.2, ease: "power2.out" }, 0)
          .from("#ofStamp", { scale: 2.5, rotate: -40, opacity: 0, duration: .5, ease: "back.out(2.5)" }, .2)
          .from(".ofmodal__body > :not(#ofStamp)", { y: 20, opacity: 0, duration: .5, stagger: .06, ease: "power2.out" }, .25);
      }
    };
    $("#workshops").addEventListener("click", (e) => {
      const b = e.target.closest(".card__more");
      if (b) open(workshops[+b.dataset.index]);
    });
    $("#ofClose").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }

  function setupFilters() {
    $$(".filter").forEach((btn) => btn.addEventListener("click", () => {
      $$(".filter").forEach((b) => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-selected", b === btn); });
      const f = btn.dataset.filter;
      const cards = $$("#workshops .card");
      cards.forEach((c) => c.classList.toggle("is-hidden", f !== "all" && c.dataset.type !== f));
      if (window.gsap && !reduceMotion) {
        gsap.fromTo(cards.filter((c) => !c.classList.contains("is-hidden")),
          { opacity: 0, y: 30, rotate: -2, scale: .96 },
          { opacity: 1, y: 0, rotate: 0, scale: 1, duration: .5, stagger: .05, ease: "back.out(1.6)" });
      }
      window.ScrollTrigger && ScrollTrigger.refresh();
    }));
  }

  /* ---------- Navegação ---------- */
  function setupNav() {
    const nav = $("#nav"), toggle = $("#navToggle"), bar = $("#mobilebar");
    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 30);
      bar.classList.toggle("is-visible", y > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open);
    });
    $$("#navMenu a").forEach((a) => a.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
    // rolagem suave feita aqui e não via CSS (scroll-behavior: smooth): o CSS atrapalha as medições
    // do ScrollTrigger.refresh() e deixava o topo "apagado" depois de usar o filtro das oficinas
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      const target = a && a.getAttribute("href").length > 1 && document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      history.replaceState(null, "", a.getAttribute("href"));
    });
  }

  /* ---------- Desejos / tsuru ---------- */
  function setupWish() {
    $("#tsuruBig").innerHTML = craneSVG("white");
    const form = $("#wishForm"), input = $("#wishInput");
    const KEY_LOCAL = "ichigo-tsurus", KEY_MINE = "ichigo-tsurus-meus";
    const read = (k) => { try { return parseInt(localStorage.getItem(k), 10) || 0; } catch (e) { return 0; } };
    const save = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

    // Sem Firebase configurado, o contador fica só neste aparelho.
    // Com Firebase (js/contador.js), o total chega pelo evento "tsurus:total" e é o mesmo para todos.
    let online = false;
    let total = read(KEY_LOCAL);
    let mine = read(KEY_MINE);
    let wasDone = null;

    const colors = Object.keys(palettes);
    const launch = (x, y, note) => {
      const el = document.createElement("div");
      el.className = "released";
      el.style.left = x - 45 + "px";
      el.style.top = y - 40 + "px";
      el.style.setProperty("--tx", `${(Math.random() * 60 - 50).toFixed(0)}vw`);
      el.style.setProperty("--ty", `${-(y + 160)}px`);
      el.innerHTML = craneSVG(colors[Math.floor(Math.random() * colors.length)]) + (note ? '<span class="released__note"></span>' : "");
      if (note) el.querySelector(".released__note").textContent = note;
      fxLayer().appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    };
    const celebrate = () => {
      if (reduceMotion) return;
      for (let i = 0; i < (isSmall ? 14 : 26); i++) {
        setTimeout(() => launch(Math.random() * innerWidth, innerHeight * (.6 + Math.random() * .4)), i * 120);
      }
    };

    const paint = () => {
      const left = Math.max(0, TSURU_GOAL - total);
      const done = left === 0;
      $("#wishCount").textContent = total.toLocaleString("pt-BR");
      $("#wishLeft").textContent = left.toLocaleString("pt-BR");
      $("#wishMine").textContent = mine;
      $("#wishMineWrap").hidden = !mine;
      $("#wishBar").style.width = Math.min(100, (total / TSURU_GOAL) * 100) + "%";
      form.hidden = done;
      $("#wishStats").hidden = done;
      $("#wishDone").hidden = !done;
      if (done && wasDone === false) celebrate();
      wasDone = done;
    };

    window.addEventListener("tsurus:total", (e) => {
      online = true;
      const prev = total;
      total = e.detail;
      paint();
      if (total > prev && window.gsap && !reduceMotion) {
        gsap.fromTo("#wishCount", { scale: 1.6, color: "#c8102e" }, { scale: 1, duration: .6, ease: "back.out(2)" });
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const wish = input.value.trim();
      if (!wish) return;
      const r = form.querySelector("button").getBoundingClientRect();
      launch(r.left + r.width / 2, r.top, wish);
      if (window.gsap && !reduceMotion) gsap.fromTo("#tsuruBig", { scale: 1 }, { scale: 1.12, yoyo: true, repeat: 1, duration: .25, ease: "power2.out" });
      mine++;
      save(KEY_MINE, mine);
      if (online && window.tsuruStore) {
        total++; // otimista; o valor real chega em seguida pelo evento
        window.tsuruStore.increment().catch(() => {});
      } else {
        total++;
        save(KEY_LOCAL, total);
      }
      paint();
      input.value = "";
    });

    paint();
  }

  /* ---------- Galeria / lightbox ---------- */
  function setupLightbox() {
    const dlg = $("#lightbox"), img = $("#lightboxImg");
    $$(".gallery__item").forEach((b) => b.addEventListener("click", () => {
      img.src = b.dataset.full; img.alt = b.dataset.alt;
      dlg.showModal ? dlg.showModal() : window.open(b.dataset.full, "_blank");
    }));
    $("#lightboxClose").addEventListener("click", () => dlg.close());
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }

  /* ---------- Agenda / compartilhar ---------- */
  function setupCalendar() {
    const title = "Ichigô Ichiê – 11ª Edição";
    const details = "Encontro de cultura japonesa: oficinas, exposições, Kenjutsu, culinária japonesa e brasileira. Entrada gratuita. Reservas: Geraldo Faraci (31) 98854-2319. " + location.href.split("#")[0];
    const place = "Restaurante do Retiro do Chalé, Brumadinho - MG";
    const gcal = "https://calendar.google.com/calendar/render?action=TEMPLATE"
      + `&text=${encodeURIComponent(title)}&dates=20261128T150000Z/20261129T000000Z`
      + `&details=${encodeURIComponent(details)}&location=${encodeURIComponent(place)}`;
    $$(".js-gcal").forEach((a) => (a.href = gcal));
    $$(".js-ics").forEach((b) => b.addEventListener("click", () => {
      const ics = [
        "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//IchigoIchie//PT-BR", "BEGIN:VEVENT",
        "UID:ichigo-ichie-11@retirodochale", "DTSTAMP:20261101T000000Z",
        "DTSTART:20261128T150000Z", "DTEND:20261129T000000Z",
        `SUMMARY:${title}`, `DESCRIPTION:${details}`, `LOCATION:${place.replace(/,/g, "\\,")}`,
        "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", "DESCRIPTION:Amanhã é o Ichigô Ichiê!", "END:VALARM",
        "END:VEVENT", "END:VCALENDAR",
      ].join("\r\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
      a.download = "ichigo-ichie.ics";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    }));
  }

  function setupShare() {
    const btn = $("#shareBtn");
    btn.addEventListener("click", async () => {
      const data = { title: "Ichigô Ichiê · 11ª Edição", text: "Sábado, 28/nov, 12h às 21h no Retiro do Chalé (Brumadinho). Entrada gratuita!", url: location.href.split("#")[0] };
      if (navigator.share) { try { await navigator.share(data); } catch (e) {} return; }
      try { await navigator.clipboard.writeText(data.url); btn.textContent = "Link copiado! ✓"; }
      catch (e) { window.open(waLink(`${data.text} ${data.url}`), "_blank"); }
      setTimeout(() => (btn.textContent = "Compartilhar com amigos"), 2500);
    });
  }

  /* ---------- Fallback de revelação (sem GSAP) ---------- */
  function fallbackReveal() {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }), { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((el) => io.observe(el));
  }

  /* ---------- Animações GSAP ---------- */
  function splitChars(el) {
    // separa o texto em letras, preservando filhos (como o kanji acima do título)
    [...el.childNodes].forEach((node) => {
      if (node.nodeType !== 3 || !node.textContent.trim()) return;
      const frag = document.createDocumentFragment();
      [...node.textContent.trim()].forEach((ch) => {
        const s = document.createElement("span");
        s.className = "char";
        s.textContent = ch === " " ? " " : ch;
        frag.appendChild(s);
      });
      node.replaceWith(frag);
    });
    return $$(".char", el);
  }

  function gsapAnimations() {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("has-gsap");

    /* Hero: título letra a letra + kanji pincelado */
    const title = $(".hero__title");
    title.style.animation = "none";
    const chars = splitChars(title);
    gsap.timeline({ delay: .35 })
      .from(".hero__title-jp", { opacity: 0, letterSpacing: "1.4em", duration: 1.2, ease: "power3.out" })
      .from(chars, { yPercent: 110, rotate: 12, opacity: 0, duration: .8, stagger: .045, ease: "back.out(1.8)" }, "-=.8");

    /* Parallax do hero */
    const heroST = { trigger: ".hero", start: "top top", end: "bottom top", scrub: true };
    gsap.to(".hero__sun", { yPercent: 40, scale: 1.3, ease: "none", scrollTrigger: heroST });
    gsap.to(".hero__mountains", { yPercent: 25, ease: "none", scrollTrigger: heroST });
    gsap.to(".hero__vertical", { yPercent: 60, opacity: 0, ease: "none", scrollTrigger: heroST });
    gsap.to(".hero__content", { yPercent: -12, opacity: .2, ease: "none", scrollTrigger: heroST });
    gsap.to(".sky", { yPercent: -30, ease: "none", scrollTrigger: heroST });

    /* Kanji gigantes das seções crescem com a rolagem */
    $$(".section__kanji").forEach((k) => {
      gsap.fromTo(k, { scale: .6, opacity: 0, letterSpacing: ".6em" },
        { scale: 1, opacity: .14, letterSpacing: ".1em", ease: "none",
          scrollTrigger: { trigger: k, start: "top 95%", end: "top 45%", scrub: true } });
    });

    /* Títulos e textos genéricos */
    $$(".reveal").filter((el) => !el.matches(".card, .attr, .gallery__item, .feature, #tsuruStage, .food__mark, .local__map")).forEach((el) => {
      gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" } });
    });

    /* Kanji vertical do "sobre" — pinceladas uma a uma */
    gsap.from(".about__kanji span", { opacity: 0, scale: 1.8, filter: "blur(8px)", duration: .7, stagger: .18, ease: "power2.out",
      scrollTrigger: { trigger: ".about__kanji", start: "top 80%" } });
    gsap.from(".facts li", { x: -40, opacity: 0, duration: .6, stagger: .12, ease: "power2.out",
      scrollTrigger: { trigger: ".facts", start: "top 85%" } });

    /* Cards de oficinas: caem como papéis */
    ScrollTrigger.batch("#workshops .card", {
      start: "top 90%",
      onEnter: (batch) => gsap.fromTo(batch,
        { opacity: 0, y: 80, rotateX: -35, rotate: () => gsap.utils.random(-6, 6), transformPerspective: 800 },
        { opacity: 1, y: 0, rotateX: 0, rotate: 0, duration: .9, stagger: .1, ease: "back.out(1.4)", overwrite: true }),
    });
    gsap.set("#workshops .card", { opacity: 0 });
    $$("#workshops .card__stamp").forEach((s) => {
      gsap.from(s, { scale: 2.4, rotate: -30, opacity: 0, duration: .5, ease: "back.out(2.5)", delay: .35,
        scrollTrigger: { trigger: s, start: "top 90%" } });
    });

    /* Atrações */
    gsap.from(".feature", { clipPath: "inset(0 100% 0 0 round 14px)", duration: 1.2, ease: "power4.inOut",
      scrollTrigger: { trigger: ".feature", start: "top 85%" } });
    gsap.from(".feature__mark", { scale: 0, rotate: -90, duration: 1, delay: .5, ease: "back.out(1.7)",
      scrollTrigger: { trigger: ".feature", start: "top 85%" } });
    ScrollTrigger.batch(".attr", {
      start: "top 92%",
      onEnter: (batch) => gsap.fromTo(batch, { opacity: 0, x: -40, scale: .95 },
        { opacity: 1, x: 0, scale: 1, duration: .7, stagger: .08, ease: "power3.out", overwrite: true }),
    });
    gsap.set(".attr", { opacity: 0 });

    /* Tsuru grande gira ao entrar */
    gsap.from("#tsuruStage", { scale: .5, rotate: -25, opacity: 0, duration: 1.3, ease: "elastic.out(1, .6)",
      scrollTrigger: { trigger: "#tsuruStage", start: "top 80%" } });
    gsap.from(".tsuru__photo", { x: 80, y: 40, rotate: 30, opacity: 0, duration: 1, delay: .5, ease: "back.out(1.6)",
      scrollTrigger: { trigger: "#tsuruStage", start: "top 80%" } });

    /* Gastronomia: kanji 食 gira e o fundo desliza */
    gsap.from(".food__photo", { y: 80, rotate: -14, opacity: 0, duration: 1.2, ease: "power3.out",
      scrollTrigger: { trigger: ".food", start: "top 80%" } });
    gsap.from(".food__mark", { rotate: -180, scale: .2, opacity: 0, duration: 1.2, delay: .4, ease: "back.out(1.3)",
      scrollTrigger: { trigger: ".food", start: "top 80%" } });
    gsap.to(".section--red", { backgroundPositionY: "-120px", ease: "none",
      scrollTrigger: { trigger: ".section--red", scrub: true } });

    /* Galeria entra pelos lados */
    $$(".gallery__item").forEach((g, i) => {
      gsap.from(g, { x: i ? 120 : -120, rotate: i ? 18 : -18, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: ".gallery", start: "top 85%" } });
    });

    /* Mapa */
    gsap.from(".local__map", { scale: .85, rotate: 3, opacity: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".local__map", start: "top 88%" } });

    /* Tsuru guia: voa no topo acompanhando o progresso da página */
    const guide = document.createElement("div");
    guide.className = "guide";
    guide.innerHTML = `<div class="guide__line"></div><div class="guide__crane">${craneSVG("red")}</div>`;
    document.body.appendChild(guide);
    gsap.to(".guide__line", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .3 } });
    gsap.to(".guide__crane", { left: "100%", ease: "none", scrollTrigger: { start: 0, end: "max", scrub: .6 } });

    /* Botões magnéticos (desktop) */
    if (!isSmall) {
      $$(".btn").forEach((b) => {
        b.addEventListener("mousemove", (e) => {
          const r = b.getBoundingClientRect();
          gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .3 });
        });
        b.addEventListener("mouseleave", () => gsap.to(b, { x: 0, y: 0, duration: .6, ease: "elastic.out(1, .4)" }));
      });
      /* tsurus do hero seguem levemente o mouse */
      const hero = $(".hero");
      hero.addEventListener("mousemove", (e) => {
        const dx = e.clientX / innerWidth - .5, dy = e.clientY / innerHeight - .5;
        gsap.to(".sky", { x: dx * -40, y: dy * -25, duration: 1.2, ease: "power2.out" });
        gsap.to(".hero__sun", { x: dx * 30, y: dy * 20, duration: 1.5, ease: "power2.out" });
      });
    }

    window.addEventListener("load", () => ScrollTrigger.refresh());
  }

  /* ---------- Início ---------- */
  renderWorkshops();
  setupWorkshopModal();
  setupFilters();
  setupNav();
  buildSky();
  startPetals();
  startCountdown();
  setupWish();
  setupLightbox();
  setupCalendar();
  setupShare();

  if (window.gsap && window.ScrollTrigger && !reduceMotion) gsapAnimations();
  else fallbackReveal();
})();
