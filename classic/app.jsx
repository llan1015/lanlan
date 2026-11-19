/* global React, ReactDOM */
const { useState, useEffect, useRef, useMemo } = React;

const C = window.SITE_CONTENT;

// i18n text picker
function useLang() {
  const [lang, setLang] = useState(() => localStorage.getItem("site-lang") || "en");
  useEffect(() => {
    localStorage.setItem("site-lang", lang);
    document.body.setAttribute("data-lang", lang);
  }, [lang]);
  return [lang, setLang];
}
const T = (obj, lang) => obj && typeof obj === "object" && lang in obj ? obj[lang] : obj;

// ========== NAV ==========
function Nav({ lang, setLang, active, onJump }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
  ["about", C.nav.about],
  ["research", C.nav.research],
  ["projects", C.nav.projects],
  ["cv", C.nav.cv],
  ["talks", C.nav.talks],
  ["teaching", C.nav.teaching]];


  return (
    <nav className={"nav" + (scrolled ? " is-scrolled" : "")}>
      <div className="nav-inner">
        <a href="#top" className="brand" onClick={(e) => {e.preventDefault();onJump("top");}}>
          <span className="brand-dot" />
          <span>{T(C.meta.name, lang)}</span>
        </a>
        <div className="nav-links">
          {links.map(([id, label]) =>
          <a
            key={id}
            href={`#${id}`}
            className={active === id ? "is-active" : ""}
            onClick={(e) => {e.preventDefault();onJump(id);}}>
            
              {T(label, lang)}
            </a>
          )}
        </div>
        <div className="lang-toggle" role="tablist" aria-label="Language">
          <button className={lang === "en" ? "is-active" : ""} onClick={() => setLang("en")}>EN</button>
          <button className={lang === "zh" ? "is-active" : ""} onClick={() => setLang("zh")}>中文</button>
        </div>
      </div>
    </nav>);

}

// ========== HERO ==========
function Hero({ lang }) {
  const m = C.meta;
  return (
    <header id="top" className="hero">
      <div className="container">
        <div className="hero-grid">
          <div>
            <h1 className="rise-in rise-in--2">
              {lang === "en" ? "Lan Lan" : "兰 兰"}
              <span className="name-zh" style={{ fontFamily: "-apple-system" }}>{lang === "en" ? "兰兰" : "Lan Lan"}</span>
            </h1>
            <p className="hero-tagline rise-in rise-in--3">
              <em style={{ fontFamily: "\"Times New Roman\"" }}>{T(m.tagline, lang).quote}</em> <span className="hero-tagline-attr" style={{ fontFamily: "Ubuntu" }}>{T(m.tagline, lang).attribution}</span>
            </p>
          </div>

          <aside className="hero-card rise-in rise-in--3" aria-label="Affiliation summary">
            <h3>{lang === "en" ? "Affiliation" : "所属机构"}</h3>
            <p>{T(m.affiliation, lang)}</p>
            <p className="hero-card-location">{T(m.location, lang)}</p>
            <div className="card-rule" />
            <dl className="kv">
              <dt>{lang === "en" ? "Role" : "职位"}</dt>
              <dd>{T(m.role, lang)}</dd>
              <dt>{lang === "en" ? "Field" : "领域"}</dt>
              <dd>{lang === "en" ? "Applied micro · Labor · Urban" : "应用微观 · 劳动 · 城市"}</dd>
              <dt>{lang === "en" ? "Email" : "邮箱"}</dt>
              <dd><a href={`mailto:${C.contact.email}`}>{C.contact.email}</a></dd>
            </dl>
          </aside>
        </div>
      </div>
    </header>);

}

// ========== ABOUT ==========
function About({ lang }) {
  return (
    <section id="about" className="block" data-screen-label="About">
      <div className="container">
        <div className="block-head">
          <span className="block-index">01</span>
          <h2>{T(C.about.heading, lang)}</h2>
        </div>
        <div className="about-grid">
          <div>
            {C.about.body.map((p, i) =>
            <p key={i}>{T(p, lang)}</p>
            )}
          </div>
          <figure className="about-portrait">
            <img src="assets/portrait.png" alt="Portrait of Lan Lan" />
          </figure>
        </div>
      </div>
    </section>);

}

// ========== RESEARCH ==========
function Research({ lang }) {
  return (
    <section id="research" className="block" data-screen-label="Research">
      <div className="container">
        <div className="block-head">
          <span className="block-index">02</span>
          <h2>{T(C.research.heading, lang)}</h2>
          <span className="block-note">
            {lang === "en" ?
            "Three threads running through the current agenda." :
            "当前研究议程的三条主线。"}
          </span>
        </div>
        <div className="research-grid">
          {C.research.areas.map((a, i) =>
          <article key={a.key} className="research-card reveal" style={{ "--reveal-delay": `${i * 80}ms` }}>
              <div className="rc-key">{String(i + 1).padStart(2, "0")} · {a.key}</div>
              <h3>{T(a.title, lang)}</h3>
              <p>{T(a.body, lang)}</p>
            </article>
          )}
        </div>
      </div>
    </section>);

}

// ========== WORKING PAPERS ==========
function Projects({ lang }) {
  return (
    <section id="projects" className="block" data-screen-label="Working papers">
      <div className="container">
        <div className="block-head">
          <span className="block-index">03</span>
          <h2>{T(C.projects.heading, lang)}</h2>
          <span className="block-note">{T(C.projects.note, lang)}</span>
        </div>
        <div className="proj-grid">
          {C.projects.items.map((p, i) =>
          <article key={i} className="proj reveal" style={{ "--reveal-delay": `${i * 60}ms` }}>
              <span className="proj-status">{T(p.status, lang)}</span>
              <h3>{T(p.title, lang)}</h3>
              <p>{T(p.blurb, lang)}</p>
            </article>
          )}
        </div>
      </div>
    </section>);

}

// ========== CV ==========
function CV({ lang }) {
  return (
    <section id="cv" className="block" data-screen-label="CV">
      <div className="container">
        <div className="block-head">
          <span className="block-index">04</span>
          <h2>{T(C.cv.heading, lang)}</h2>
          <a className="cv-download" href="https://drive.google.com/file/d/1iCjv1kHQmObWwlaFaMuTsLrK1nZMz7_b/view?usp=drive_link" target="_blank" rel="noopener">
            {T(C.cv.download, lang)} <span className="arrow">↗</span>
          </a>
        </div>
        <div className="cv-grid">
          <div className="cv-col">
            <h4>{lang === "en" ? "Positions" : "工作经历"}</h4>
            {C.cv.positions.map((it, i) =>
            <div key={i} className="cv-item reveal" style={{ "--reveal-delay": `${i * 60}ms` }}>
                <div className="cv-when">{it.when}</div>
                <div>
                  <div className="cv-role">{T(it.role, lang)}</div>
                  <div className="cv-where">{T(it.where, lang)}</div>
                </div>
              </div>
            )}
          </div>
          <div className="cv-col">
            <h4>{lang === "en" ? "Education" : "教育经历"}</h4>
            {C.cv.education.map((it, i) =>
            <div key={i} className="cv-item reveal" style={{ "--reveal-delay": `${i * 60}ms` }}>
                <div className="cv-when">{it.when}</div>
                <div>
                  <div className="cv-role">{T(it.role, lang)}</div>
                  <div className="cv-where">{T(it.where, lang)}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

// ========== TALKS ==========
function Talks({ lang }) {
  return (
    <section id="talks" className="block" data-screen-label="Talks">
      <div className="container">
        <div className="block-head">
          <span className="block-index">05</span>
          <h2>{T(C.talks.heading, lang)}</h2>
        </div>
        <div className="talks-list">
          {C.talks.items.map((t, i) =>
          <div key={i} className="talk reveal" style={{ "--reveal-delay": `${i * 50}ms` }}>
              <div className="talk-when">{t.when}</div>
              <div className="talk-what">{T(t.what, lang)}</div>
              <div className="talk-where">{T(t.where, lang)}</div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ========== TEACHING ==========
function Teaching({ lang }) {
  return (
    <section id="teaching" className="block" data-screen-label="Teaching">
      <div className="container">
        <div className="block-head">
          <span className="block-index">06</span>
          <h2>{T(C.teaching.heading, lang)}</h2>
        </div>
        <div className="teach-groups">
          <div className="teach-group">
            <h4 className="teach-group-head">{T(C.teaching.instructor.heading, lang)}</h4>
            <div className="teach-rows">
              {C.teaching.instructor.items.map((t, i) =>
              <div key={i} className="teach-row">
                  <div className="teach-row-school">{T(t.school, lang)}</div>
                  <div className="teach-row-main">
                    <div className="teach-row-course">{T(t.course, lang)}</div>
                    <div className="teach-row-level">{T(t.level, lang)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="teach-group">
            <h4 className="teach-group-head">{T(C.teaching.ta.heading, lang)}</h4>
            <div className="teach-rows">
              {C.teaching.ta.items.map((t, i) =>
              <div key={i} className="teach-row">
                  <div className="teach-row-school">{T(t.school, lang)}</div>
                  <ul className="teach-course-list">
                    {t.courses.map((c, j) =>
                  <li key={j}>
                        <span className="teach-row-course">{T(c.name, lang)}</span>
                        <span className="teach-row-level">{T(c.level, lang)}</span>
                      </li>
                  )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="advising">
          <h4>{T(C.teaching.advising.heading, lang)}</h4>
          <p>{T(C.teaching.advising.body, lang)}</p>
        </div>
      </div>
    </section>);

}

// ========== CONTACT ==========
function Contact({ lang }) {
  return (
    <section id="contact" className="block" data-screen-label="Contact">
      <div className="container">
        <div className="block-head">
          <span className="block-index">07</span>
          <h2>{T(C.contact.heading, lang)}</h2>
        </div>
        <div className="contact-grid">
          <div className="contact-intro">{T(C.contact.intro, lang)}</div>
          <dl className="contact-card">
            <div className="contact-row">
              <dt>{T(C.contact.labels.email, lang)}</dt>
              <dd><a href={`mailto:${C.contact.email}`}>{C.contact.email}</a></dd>
            </div>
            <div className="contact-row">
              <dt>{T(C.contact.labels.emailAlt, lang)}</dt>
              <dd><a href={`mailto:${C.contact.emailAlt}`}>{C.contact.emailAlt}</a></dd>
            </div>
            <div className="contact-row">
              <dt>{T(C.contact.labels.phone, lang)}</dt>
              <dd>{C.contact.phone}</dd>
            </div>
            <div className="contact-row">
              <dt>{T(C.contact.labels.office, lang)}</dt>
              <dd>{T(C.contact.office, lang)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>);

}

function Footer({ lang }) {
  return (
    <footer className="foot">
      <div className="container foot-inner">
        <span>© 2026 · {T(C.meta.name, lang)}</span>
        <span>{T(C.footer.built, lang)}</span>
      </div>
    </footer>);

}

// ========== TWEAKS ==========
const PALETTES = {
  cool: { "--accent": "oklch(0.55 0.12 255)", "--accent-soft": "oklch(0.95 0.03 255)", "--accent-ink": "oklch(0.38 0.12 255)", "--accent-2": "oklch(0.5 0.1 160)" },
  warm: { "--accent": "oklch(0.58 0.14 40)", "--accent-soft": "oklch(0.95 0.03 40)", "--accent-ink": "oklch(0.42 0.13 40)", "--accent-2": "oklch(0.5 0.1 160)" },
  forest: { "--accent": "oklch(0.52 0.12 155)", "--accent-soft": "oklch(0.95 0.03 155)", "--accent-ink": "oklch(0.38 0.12 155)", "--accent-2": "oklch(0.58 0.14 40)" },
  plum: { "--accent": "oklch(0.52 0.14 315)", "--accent-soft": "oklch(0.95 0.03 315)", "--accent-ink": "oklch(0.38 0.14 315)", "--accent-2": "oklch(0.5 0.1 160)" },
  mono: { "--accent": "oklch(0.25 0 0)", "--accent-soft": "oklch(0.94 0 0)", "--accent-ink": "oklch(0.2 0 0)", "--accent-2": "oklch(0.45 0 0)" },
  elements: { "--accent": "oklch(0.6 0.16 38)", "--accent-soft": "oklch(0.95 0.035 60)", "--accent-ink": "oklch(0.42 0.15 35)", "--accent-2": "oklch(0.5 0.14 50)" }
};

function Tweaks({ open, onClose, state, setState }) {
  const applyPalette = (k) => {
    const p = PALETTES[k];
    Object.entries(p).forEach(([k2, v]) => document.documentElement.style.setProperty(k2, v));
  };
  useEffect(() => {applyPalette(state.palette);}, [state.palette]);
  useEffect(() => {document.body.setAttribute("data-density", state.density);}, [state.density]);
  useEffect(() => {document.body.setAttribute("data-cards", state.cards);}, [state.cards]);
  useEffect(() => {document.body.setAttribute("data-type", state.type);}, [state.type]);
  useEffect(() => {document.body.setAttribute("data-motion", state.motion || "subtle");}, [state.motion]);
  useEffect(() => {document.body.classList.toggle("elements-theme", state.palette === "elements");}, [state.palette]);

  const persist = (patch) => {
    setState((s) => {
      const next = { ...s, ...patch };
      localStorage.setItem("site-tweaks-v2", JSON.stringify(next));
      window.parent.postMessage({ type: "__edit_mode_set_keys", edits: patch }, "*");
      return next;
    });
  };

  return (
    <div className={"tweaks" + (open ? " is-open" : "")}>
      <div className="tweaks-head">
        <h5>Tweaks</h5>
        <button onClick={onClose} aria-label="Close" style={{ border: 0, background: "transparent", color: "var(--meta)" }}>✕</button>
      </div>
      <div className="tweaks-body">
        <div className="tweak-row">
          <label>Palette</label>
          <div className="tweak-swatches">
            {Object.entries(PALETTES).map(([k, v]) =>
            <button
              key={k}
              className={state.palette === k ? "is-active" : ""}
              style={{ "--sw": v["--accent"] }}
              onClick={() => persist({ palette: k })}
              aria-label={k}
              title={k} />

            )}
          </div>
        </div>

        <div className="tweak-row">
          <label>Density</label>
          <div className="tweak-seg">
            {["compact", "cozy", "roomy"].map((d) =>
            <button key={d} className={state.density === d ? "is-active" : ""} onClick={() => persist({ density: d })}>{d}</button>
            )}
          </div>
        </div>

        <div className="tweak-row">
          <label>Cards</label>
          <div className="tweak-seg">
            {["soft", "flat", "bordered"].map((c) =>
            <button key={c} className={state.cards === c ? "is-active" : ""} onClick={() => persist({ cards: c })}>{c}</button>
            )}
          </div>
        </div>

        <div className="tweak-row">
          <label>Motion</label>
          <div className="tweak-seg">
            {["subtle", "lively", "off"].map((m) =>
            <button key={m} className={(state.motion || "subtle") === m ? "is-active" : ""} onClick={() => persist({ motion: m })}>{m}</button>
            )}
          </div>
        </div>

        <div className="tweak-row">
          <label>Display type</label>
          <div className="tweak-seg">
            {[["sans", "sans"], ["serif-display", "serif"], ["mono-display", "mono"]].map(([k, l]) =>
            <button key={k} className={state.type === k ? "is-active" : ""} onClick={() => persist({ type: k })}>{l}</button>
            )}
          </div>
        </div>
      </div>
    </div>);

}

// ========== APP ==========
function App() {
  const [lang, setLang] = useLang();
  const [active, setActive] = useState("top");

  const defaults = /*EDITMODE-BEGIN*/{
    "palette": "elements",
    "density": "cozy",
    "cards": "soft",
    "type": "sans",
    "motion": "subtle"
  } /*EDITMODE-END*/;

  const [tweaks, setTweaks] = useState(() => {
    try {return { ...defaults, ...JSON.parse(localStorage.getItem("site-tweaks-v2") || "{}") };}
    catch {return defaults;}
  });
  const [tweaksOpen, setTweaksOpen] = useState(false);

  // Smooth scroll
  const onJump = (id) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  // Scroll spy
  useEffect(() => {
    const ids = ["about", "research", "projects", "cv", "talks", "teaching"];
    const obs = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      if (visible[0]) setActive(visible[0].target.id);
    }, { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.4, 0.6] });
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Arm entrance animations after mount so opacity:0 starting frame never sticks
  useEffect(() => {
    const id = requestAnimationFrame(() => document.body.classList.add("is-armed"));
    return () => cancelAnimationFrame(id);
  }, []);

  // Scroll progress bar
  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;
    const update = () => {
      const h = document.documentElement;
      const total = h.scrollHeight - h.clientHeight;
      const p = total > 0 ? h.scrollTop / total * 100 : 0;
      bar.style.setProperty("--p", p + "%");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Reveal-on-scroll for .reveal elements
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [lang]);

  // Mouse spotlight delegation removed

  // Edit mode protocol
  useEffect(() => {
    const handler = (e) => {
      if (!e.data) return;
      if (e.data.type === "__activate_edit_mode") setTweaksOpen(true);
      if (e.data.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", handler);
  }, []);

  return (
    <>
      <div id="scroll-progress" className="scroll-progress" />
      <Nav lang={lang} setLang={setLang} active={active} onJump={onJump} />
      <Hero lang={lang} />
      <About lang={lang} />
      <Research lang={lang} />
      <Projects lang={lang} />
      <CV lang={lang} />
      <Talks lang={lang} />
      <Teaching lang={lang} />
      <Footer lang={lang} />
      <Tweaks open={tweaksOpen} onClose={() => setTweaksOpen(false)} state={tweaks} setState={setTweaks} />
    </>);

}

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);