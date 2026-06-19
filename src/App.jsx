import { useEffect, useRef, useState } from 'react';
import './index.css'

// ── Counter Hook ─────────────────────────────────────────
function useCountUp(target, duration = 1800, suffix = '') {
  const [display, setDisplay] = useState('0' + suffix);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const startTime = performance.now();
        const isDecimal = target !== Math.floor(target);
        const step = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = eased * target;
          setDisplay(
            (isDecimal ? val.toFixed(1) : Math.floor(val)) + suffix
          );
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, suffix]);

  return [display, ref];
}

export default function App() {
  // Scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const hiddenElements = document.querySelectorAll('.reveal-on-scroll');
    hiddenElements.forEach((el) => observer.observe(el));

    return () => {
      hiddenElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Stat counters
  const [stat1, ref1] = useCountUp(99, 1600, '%');
  const [stat3, ref3] = useCountUp(100, 1800, '+');

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="page-wrapper">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <a href="#home" className="nav-logo">
          <img src="/logo.jpeg" alt="Hope Trans Inc." className="nav-logo-img" />
          <div className="nav-logo-text">
            <span className="brand-name">Hope Trans</span>
            <span className="brand-sub">Inc.</span>
          </div>
        </a>

        <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li><a href="#home" className="active" onClick={() => setIsMobileMenuOpen(false)}>Home</a></li>
          <li><a href="#services" onClick={() => setIsMobileMenuOpen(false)}>Services</a></li>
          <li><a href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a></li>
          <li><a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a></li>
        </ul>

        <div className="nav-actions">
          <a href="#contact" className="nav-cta-btn">Get a Quote</a>
          <button 
            className={`mobile-menu-btn ${isMobileMenuOpen ? 'open' : ''}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="home" className="hero">
        {/* Left: copy — slides up on load */}
        <div className="hero-left hero-enter-left">
          <div className="hero-badge">
            <span className="badge-icon">✓</span> Trusted Across Canada
          </div>
          <h1 className="hero-title">
            DRIVING<br />
            <span className="hero-title-gold">YOUR SUCCESS</span><br />
            FORWARD
          </h1>
          <p className="hero-sub">
            Premium FTL and LTL freight solutions tailored for your supply chain across Canada. We deliver your promises safely, efficiently, and on time.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="btn-primary">Get a Quote</a>
            <a href="#services" className="btn-secondary">Our Services</a>
          </div>
          <div className="hero-stats">
            <div className="stat-item" ref={ref1}>
              <span className="stat-num">{stat1}</span>
              <span className="stat-text">On-Time</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">24/7</span>
              <span className="stat-text">Dispatch</span>
            </div>
            <div className="stat-item" ref={ref3}>
              <span className="stat-num">{stat3}</span>
              <span className="stat-text">Fleet Size</span>
            </div>
          </div>
        </div>

        {/* Right: composite hero image — slides in from right */}
        <div className="hero-right hero-enter-right">
          <div className="hero-composite-wrapper">
            <img
              src="/final_truck.jfif"
              alt="Hope Trans Inc. — Freight across Canada"
              className="hero-new-img"
            />
            <div className="hero-img-glow" />
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="services-section">
        <p className="section-eyebrow reveal-on-scroll">What We Offer</p>
        <h2 className="section-heading reveal-on-scroll">Our Core Services</h2>
        <div className="services-grid">
          {[
            { icon: '🚛', title: 'Full Truckload (FTL)', desc: 'Dedicated trucks for large shipments with guaranteed delivery windows.' },
            { icon: '📦', title: 'Less-Than-Truckload (LTL)', desc: 'Cost-efficient shared freight for smaller loads without sacrificing speed or safety.' },
            { icon: '🍁', title: 'Domestic Intermodal', desc: 'Cost-effective rail and truck combination shipping across all Canadian provinces.' },
            { icon: '❄️', title: 'Temperature-Controlled', desc: 'Refrigerated and heated transport for perishables and sensitive goods.' },
            { icon: '🏗️', title: 'Flatbed & Heavy Haul', desc: 'Specialized flatbed equipment for oversized, overweight, and unconventional cargo.' },
            { icon: '⚓', title: 'Port Drayage', desc: 'Efficient container drayage from major ports to distribution centers.' },
          ].map((s, idx) => (
            <div key={s.title} className={`service-card reveal-on-scroll delay-${idx % 3}`}>
              <div className="service-icon-wrap">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="about-section">

        {/* Top: who we are */}
        <div className="about-intro reveal-on-scroll">
          <p className="section-eyebrow">Our Story</p>
          <h2 className="section-heading about-heading">
            More Than a Trucking Company.<br />
            <em>We're Your Freight Partner.</em>
          </h2>
          <p className="about-lead">
            Founded in Mississauga, Ontario, Hope Trans Inc. was built on a single belief:
            that every shipment matters. From a small regional carrier to a trusted
            pan-Canadian logistics partner, we have grown by putting our clients'
            supply chains first — every mile, every load, every time.
          </p>
        </div>

        {/* Middle: pillars grid */}
        <div className="about-pillars">
          {[
            {
              num: '01',
              title: 'Our Mission',
              body: 'To provide businesses across Canada with safe, efficient, and reliable freight transportation — delivered on time, every time, without compromise.',
            },
            {
              num: '02',
              title: 'Our Vision',
              body: 'To be the most trusted name in Canadian trucking by setting the highest standard for driver professionalism, cargo security, and client transparency.',
            },
            {
              num: '03',
              title: 'Our Values',
              body: 'Integrity in every interaction. Accountability on every route. Safety above all. We hold ourselves to the same standard we promise our clients.',
            },
          ].map((p, i) => (
            <div key={p.num} className={`about-pillar reveal-on-scroll delay-${i}`}>
              <span className="about-pillar-num">{p.num}</span>
              <h3 className="about-pillar-title">{p.title}</h3>
              <p className="about-pillar-body">{p.body}</p>
            </div>
          ))}
        </div>

        {/* Bottom: milestones timeline */}
        <div className="about-milestones">
          <p className="section-eyebrow reveal-on-scroll" style={{textAlign:'center'}}>Our Journey</p>
          <div className="milestones-track">
            {[
              { year: '2010', label: 'Founded', detail: 'Hope Trans Inc. launched operations out of Mississauga with a two-truck fleet.' },
              { year: '2014', label: 'Pan-Canadian', detail: 'Expanded service coverage to 7 provinces with a growing team of certified drivers.' },
              { year: '2018', label: 'Reefer Fleet', detail: 'Launched a dedicated temperature-controlled division for perishables and pharma.' },
              { year: '2022', label: '100+ Trucks', detail: 'Surpassed 100 active units and introduced real-time cargo tracking technology.' },
              { year: 'Today', label: 'Your Partner', detail: '24/7 dispatch, fully insured loads, and a 99% on-time delivery record — and growing.' },
            ].map((m, i) => (
              <div key={m.year} className={`milestone-item reveal-on-scroll delay-${i % 3}`}>
                <div className="milestone-year">{m.year}</div>
                <div className="milestone-dot" />
                <div className="milestone-content">
                  <strong>{m.label}</strong>
                  <p>{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── WHY US ── */}
      <section id="why-us" className="why-section">
        <div className="why-img-wrap reveal-on-scroll">
          <img src="/highway_bg.png" alt="Hope Trans highway" className="why-img" />
          <div className="why-img-overlay" />
        </div>
        <div className="why-content">
          <p className="section-eyebrow reveal-on-scroll">Why Choose Us</p>
          <h2 className="section-heading reveal-on-scroll">Built for Reliability</h2>
          <ul className="why-list">
            {[
              { title: 'Pan-Canadian Coverage', desc: 'We operate across 7 provinces with established routes and trusted partners.' },
              { title: 'Experienced Drivers', desc: 'All our drivers are certified, background-checked, and trained for safety.' },
              { title: 'Cargo Insurance', desc: 'Every shipment is fully insured for complete peace of mind.' },
              { title: '24/7 Dispatch', desc: 'Our operations team is always on call to handle any situation on the road.' },
            ].map((w, idx) => (
              <li key={w.title} className={`why-item reveal-on-scroll delay-${idx}`}>
                <div className="why-check">✓</div>
                <div>
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── CTA / GET A QUOTE ── */}
      <section id="contact" className="cta-section">
        <div className="cta-inner reveal-on-scroll">
          <h2>Ready to Ship <em>With Us?</em></h2>
          <p>Get a free quote in under 2 minutes. No commitment needed.</p>
          
          <form action="https://api.web3forms.com/submit" method="POST" className="quote-form">
            <input type="hidden" name="access_key" value="69a1b0c9-0270-43ad-bc61-3a79a64a34c3" />
            <input type="hidden" name="subject" value="New Freight Quote Request from Website" />
            <input type="hidden" name="redirect" value="https://web3forms.com/success" />
            
            <div className="form-row">
              <input 
                type="text" 
                name="name" 
                placeholder="Your Name" 
                required 
                className="form-input" 
                pattern="[A-Za-z\s\-]+" 
                title="Please enter a valid name (letters and spaces only)"
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Your Email" 
                required 
                className="form-input" 
                title="Please enter a valid email address"
              />
            </div>
            <div className="form-row">
              <input 
                type="tel" 
                name="phone" 
                placeholder="Phone Number" 
                required 
                className="form-input" 
                pattern="[\d\s\-\+\(\)]+" 
                title="Please enter a valid phone number (numbers and symbols only)"
              />
              <select name="freight_type" required className="form-select">
                <option value="">Select Freight Type</option>
                <option value="FTL">Full Truckload (FTL)</option>
                <option value="LTL">Less-Than-Truckload (LTL)</option>
                <option value="Intermodal">Domestic Intermodal</option>
                <option value="Reefer">Temperature-Controlled</option>
                <option value="Flatbed">Flatbed / Heavy Haul</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-row">
              <input type="text" name="origin" placeholder="From (Origin City/Zip)" required className="form-input" />
              <input type="text" name="destination" placeholder="To (Destination City/Zip)" required className="form-input" />
            </div>
            <textarea name="message" placeholder="Additional Freight Details (Weight, Dimensions, etc.)" rows="3" className="form-textarea"></textarea>
            <button type="submit" className="btn-cta btn-submit">Get Quote</button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-brand">
          <img src="/logo.jpeg" alt="Hope Trans Inc." className="footer-logo" />
          <span className="footer-brand-name">Hope Trans Inc.</span>
          <p className="footer-tagline">Canada's trusted freight partner.<br />Safe. Reliable. On Time.</p>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <a href="#services">Full Truckload</a>
          <a href="#services">LTL Shipping</a>
          <a href="#services">Refrigerated Freight</a>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <a href="#why-us">Why Us</a>
          <a href="#home">Careers</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <a href="tel:+11234567890" className="footer-contact-link">📞 (123) 456-7890</a>
          <a href="mailto:info@hopetransinc.com" className="footer-contact-link">✉️ info@hopetransinc.com</a>
          <a href="https://maps.google.com/?q=Mississauga, Ontario, Canada" target="_blank" rel="noopener noreferrer" className="footer-contact-link">📍 Mississauga, Ontario, Canada</a>
        </div>
      </footer>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Hope Trans Inc. All rights reserved.
      </div>
    </div>
  )
}
