import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loadTeam, type TeamMember } from "@/lib/team";
import { loadProjects, type Project } from "@/lib/projects";


export const Route = createFileRoute("/")({
  component: VorteqonPage,
});

function VorteqonPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setTeam(loadTeam());
    setProjects(loadProjects());
    const s = document.createElement("script");
    s.src = "/vorteqon.js";
    s.async = false;
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, []);


  return (
    <>
      <div className="cursor-dot" id="cursorDot" />
      <div className="cursor-ring" id="cursorRing" />

      <canvas id="vortex-canvas" />

      {/* NAVBAR */}
      <nav id="navbar">
        <div className="nav-left">
          <button className="icon-btn" id="hamburgerBtn" aria-label="Open menu">
            <svg viewBox="0 0 24 24">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <a href="#hero" className="logo-link">VORTEQON</a>
        </div>
        <div className="nav-center">
          <a href="#hero" className="nav-link active">Home</a>
          <a href="#projects" className="nav-link">Projects</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#team" className="nav-link">Team</a>
          <a href="#contact" className="nav-link">Contact</a>
        </div>
        <div className="nav-right">
          <Link to="/admin" className="icon-btn" aria-label="Admin">
            <svg viewBox="0 0 24 24">
              <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" />
            </svg>
          </Link>
        </div>

      </nav>

      <div id="sidebar-overlay" />

      <aside id="sidebar">
        <div className="sidebar-header">
          <span>MENU</span>
          <button className="icon-btn" id="sidebarClose" aria-label="Close menu">
            <svg viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="sidebar-nav">
          <a href="#hero" className="sidebar-link" data-close="">Home</a>
          <a href="#projects" className="sidebar-link" data-close="">Projects (Services)</a>
          <a href="#about" className="sidebar-link" data-close="">About Vorteqon</a>
          <a href="#team" className="sidebar-link" data-close="">Team</a>
          <a href="#contact" className="sidebar-link" data-close="">Contact Us</a>
          <div className="sidebar-divider" />
          <a href="#" className="sidebar-link" data-close="">Templates</a>
          <a href="#" className="sidebar-link" data-close="">Portfolio</a>
          <a href="#" className="sidebar-link" data-close="">Notifications</a>
          <a href="#" className="sidebar-link" data-close="">Wishlist</a>
          <a href="#" className="sidebar-link" data-close="">My Orders</a>
          <div className="sidebar-divider" />
          <Link to="/admin" className="sidebar-link" data-close="">Admin</Link>
        </nav>
        <div className="sidebar-footer">© 2025 VORTEQON</div>
      </aside>



      <div className="toast" id="toast" />

      <main>
        <section id="hero" style={{ maxWidth: "100%", paddingLeft: 24, paddingRight: 24, position: "relative" }}>
          <div className="scanlines" />
          <div className="hero-badge">Engineering the Future</div>
          <h1 className="hero-title glitch" data-text="VORTEQON">VORTEQON</h1>
          <p className="hero-tagline" id="heroTagline">
            <span id="taglineText" />
            <span className="typewriter-cursor" />
          </p>
          <div className="hero-cta">
            <a href="#projects" className="btn-cta-primary"><span className="btn-mag-glow" />View Projects</a>
            <a href="#contact" className="btn-outline"><span className="btn-mag-glow" />Get in Touch</a>
          </div>
          <div className="hero-scroll">
            <div className="scroll-line" />Scroll
          </div>
        </section>

        <div className="stats-section reveal">
          <div className="stats-grid">
            <div className="stat-item"><span className="stat-num" data-target="3">0</span><span className="stat-label">Active Projects</span></div>
            <div className="stat-item"><span className="stat-num" data-target="100">0</span><span className="stat-label">% Open Source</span></div>
            <div className="stat-item"><span className="stat-num" data-target="5">0</span><span className="stat-label">Core Team</span></div>
            <div className="stat-item"><span className="stat-num" data-target="2025">0</span><span className="stat-label">Founded</span></div>
          </div>
        </div>

        <div className="section-wrap" id="about">
          <p className="section-label reveal">About</p>
          <h2 className="section-title reveal">What is Vorteqon?</h2>
          <div className="about-grid">
            <div className="about-text reveal">
              <p><strong>Vorteqon</strong> is derived from <em>Vortex + Tech + -on</em> — three forces fused into one identity.</p>
              <p><strong>Vortex</strong> symbolizes dynamic energy, innovation, and rapid movement — futuristic and scientific symbolism at its core.</p>
              <p><strong>Tech</strong> represents technology, advancement, and engineering at the cutting edge of possibility.</p>
              <p><strong>-on</strong> is a suffix common in scientific terms like <em>electron</em> and <em>proton</em>, giving it high-tech resonance.</p>
              <div className="about-meaning">
                Together, "Vorteqon" represents a powerful force of innovation — a vortex of technology spinning the world forward toward transformation.
              </div>
            </div>
            <div className="words-grid reveal">
              <div className="word-card">
                <h4>VORTEX</h4>
                <p>Dynamic energy &amp; rapid movement. A spinning force that pulls everything toward the center of innovation.</p>
              </div>
              <div className="word-card">
                <h4>TECH</h4>
                <p>Advancement &amp; engineering. The backbone of everything Vorteqon builds, creates, and ships.</p>
              </div>
              <div className="word-card">
                <h4>-ON</h4>
                <p>Scientific resonance. Like electron or proton — a particle of pure technological force.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="section-wrap" id="projects">
          <p className="section-label reveal">Products</p>
          <h2 className="section-title reveal">Projects</h2>
          <div className="projects-grid">
            {projects.map((p) => (
              <ProjectCard key={p.id} status={p.status} icon={p.icon} title={p.title} desc={p.desc} tag={p.tag} progress={p.progress} />
            ))}
          </div>
        </div>

        <div className="section-wrap" id="team">
          <p className="section-label reveal">People</p>
          <h2 className="section-title reveal" style={{ textAlign: "center" }}>The Team</h2>
          <div className="team-wrapper">
            {team.map((m) => (
              <TeamCard key={m.id} initials={m.initials} name={m.name} role={m.role} bio={m.bio} link={m.link} image={m.image} />
            ))}
          </div>

        </div>

        <div className="section-wrap" id="contact">
          <div className="contact-inner">
            <p className="section-label" style={{ justifyContent: "center" }}>Contact</p>
            <h2 className="section-title">Join the Force</h2>
            <p>Have an idea, a project, or just the drive to innovate? Reach out — Vorteqon is always looking for the next spark.</p>
            <form className="contact-form" id="contactForm">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" required />
              <button type="submit">Send Message</button>
            </form>

            <div className="social-links">
              <p className="social-label">Or reach us directly</p>
              <div className="social-icons">
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=vorteqon@gmail.com" target="_blank" rel="noopener noreferrer"
                  className="social-icon-btn" aria-label="Email us on Gmail" title="vorteqon@gmail.com">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <polyline points="2,4 12,13 22,4" />
                  </svg>
                  <span className="social-icon-label">Gmail</span>
                </a>
                <a href="https://www.linkedin.com/company/vorteqon/" target="_blank" rel="noopener noreferrer"
                  className="social-icon-btn social-icon-btn--ln" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="4" />
                    <line x1="8" y1="11" x2="8" y2="17" />
                    <line x1="8" y1="7" x2="8" y2="8" />
                    <path d="M12 17v-4a2 2 0 0 1 4 0v4" />
                    <line x1="12" y1="11" x2="12" y2="17" />
                  </svg>
                  <span className="social-icon-label">LinkedIn</span>
                </a>
                <a href="https://www.instagram.com/vorteqon" target="_blank" rel="noopener noreferrer"
                  className="social-icon-btn social-icon-btn--ig" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  <span className="social-icon-label">Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <p>© 2025 <span>Vorteqon</span>. All rights reserved. &nbsp;|&nbsp; Engineering the Future, One Vortex at a Time.</p>
      </footer>
    </>
  );
}

function ProjectCard({ status, icon, title, desc, tag, progress }: {
  status: "live" | "dev"; icon: string; title: string; desc: string; tag: string; progress: string;
}) {
  return (
    <div className="project-card reveal" data-tilt="">
      <div className={`card-status ${status}`}>
        <span className="card-status-dot" />{status === "live" ? "Live" : "In Dev"}
      </div>
      <div className="project-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <span className="project-tag">{tag}</span>
      <div className="card-progress-wrap">
        <div className="card-progress-bar" style={{ ["--progress" as string]: progress } as React.CSSProperties} />
      </div>
    </div>
  );
}

function TeamCard({ initials, name, role, bio, link, image }: {
  initials: string; name: string; role: string; bio: string; link: string; image?: string;
}) {
  return (
    <div className={`team-card reveal${image ? " has-img" : ""}`}>
      {image && (
        <>
          <div className="team-card-bg-img" style={{ backgroundImage: `url(${image})` }} />
          <div className="team-card-glass-overlay" />
        </>
      )}
      {!image && <div className="avatar">{initials}</div>}
      <h3>{name}</h3>
      <p className="team-role">{role}</p>
      <p className="team-bio">{bio}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" className="team-linkedin">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="4" />
          <line x1="8" y1="11" x2="8" y2="17" />
          <line x1="8" y1="7" x2="8" y2="8" />
          <path d="M12 17v-4a2 2 0 0 1 4 0v4" />
          <line x1="12" y1="11" x2="12" y2="17" />
        </svg>
        LinkedIn
      </a>
    </div>
  );
}
