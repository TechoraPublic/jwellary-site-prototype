import React, { useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send } from 'lucide-react';
import ScrollReveal from '../components/animations/ScrollReveal';
import GoldDivider from '../components/animations/GoldDivider';

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--color-ivory)', minHeight: '100vh' }}>

      {/* Contact Hero */}
      <div style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-ivory)', paddingTop: '160px', paddingBottom: '100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <ScrollReveal className="container" style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: '500', fontFamily: 'var(--font-sans)' }}>
            Contact Blue Bells
          </p>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '1.5rem', fontFamily: 'var(--font-serif)', maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>
            Let's Create Something Timeless
          </h1>
          <GoldDivider delay={0.4} style={{ marginBottom: '2rem' }} />
          <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(248, 245, 238, 0.8)' }}>
            Whether you're looking for a signature piece, a meaningful gift, or simply wish to know more about our collections, we'd love to hear from you.
          </p>
        </ScrollReveal>

        {/* Subtle Decorative Element */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05, transform: 'scale(1.5)', pointerEvents: 'none' }}>
          <svg width="400" height="400" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50 0 C60 40 100 50 100 50 C60 60 50 100 50 100 C40 60 0 50 0 50 C40 40 50 0 50 0 Z" />
          </svg>
        </div>
      </div>

      <div className="container section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'start' }}>

          {/* Left Column: Contact Information */}
          <ScrollReveal delay={0.2} className="contact-info-column" style={{ backgroundColor: 'var(--color-navy)', color: 'var(--color-ivory)', borderRadius: '4px', position: 'relative', overflow: 'hidden' }}>

            <h2 style={{ fontSize: '2rem', marginBottom: '3rem', fontFamily: 'var(--font-serif)', borderBottom: '1px solid rgba(217, 164, 65, 0.3)', paddingBottom: '1rem' }}>
              Contact Information
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <Phone size={24} color="var(--color-gold)" style={{ strokeWidth: 1.5 }} />
                <div>
                  <h3 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>Phone</h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: '300', letterSpacing: '1px' }}>+91 00000 00000</p>
                </div>
              </div>

              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <Mail size={24} color="var(--color-gold)" style={{ strokeWidth: 1.5 }} />
                <div>
                  <h3 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>Email</h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: '300', letterSpacing: '1px' }}>support@Bluebells.com</p>
                </div>
              </div>

              {/* Address */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <MapPin size={24} color="var(--color-gold)" style={{ strokeWidth: 1.5 }} />
                <div>
                  <h3 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>Address</h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: '300', lineHeight: '1.6' }}>Your Address, City, State — PIN</p>
                </div>
              </div>

              {/* Business Hours */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <Clock size={24} color="var(--color-gold)" style={{ strokeWidth: 1.5 }} />
                <div>
                  <h3 style={{ fontSize: '0.75rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem', fontFamily: 'var(--font-sans)' }}>Business Hours</h3>
                  <p style={{ fontSize: '1.1rem', fontWeight: '300', letterSpacing: '1px' }}>Mon–Sat, 9 AM – 6 PM IST</p>
                </div>
              </div>
            </div>

            {/* Quick Response */}
            <div style={{ marginTop: '4rem', padding: '2rem', border: '1px solid rgba(217, 164, 65, 0.3)', borderRadius: '2px', backgroundColor: 'var(--color-navy)' }}>
              <MessageSquare size={28} color="var(--color-gold)" style={{ strokeWidth: 1.5, marginBottom: '1.5rem' }} />
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontFamily: 'var(--font-serif)', color: 'var(--color-ivory)' }}>We're Here to Help</h3>
              <p style={{ fontSize: '0.95rem', color: 'rgba(248, 245, 238, 0.7)', lineHeight: '1.6', fontWeight: '300' }}>
                We typically respond to all enquiries within 24 business hours.
              </p>
            </div>

          </ScrollReveal>

          {/* Right Column: Form */}
          <ScrollReveal delay={0.4} className="contact-form-column" style={{}}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span style={{ color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.75rem', fontWeight: '600' }}>Get In Touch</span>
              <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-serif)', marginTop: '1rem', color: 'var(--color-navy)' }}>Send Us a Message</h2>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-gold)', opacity: 0.5 }}></div>
                <span style={{ color: 'var(--color-gold)', fontSize: '1.2rem' }}>✦</span>
                <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-gold)', opacity: 0.5 }}></div>
              </div>
            </div>

            <form onSubmit={(e) => e.preventDefault()}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                  <label htmlFor="fullName" style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', color: 'var(--color-navy)' }}>
                    Full Name <span style={{ color: 'var(--color-gold)' }}>*</span>
                  </label>
                  <input type="text" id="fullName" placeholder="Your name" style={{ width: '100%', padding: '1rem', border: '1px solid rgba(3,22,55,0.20)', borderRadius: '2px', outline: 'none', backgroundColor: 'transparent', fontFamily: 'var(--font-sans)' }} required />
                </div>
                <div>
                  <label htmlFor="email" style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', color: 'var(--color-navy)' }}>
                    Email Address <span style={{ color: 'var(--color-gold)' }}>*</span>
                  </label>
                  <input type="email" id="email" placeholder="you@example.com" style={{ width: '100%', padding: '1rem', border: '1px solid rgba(3,22,55,0.20)', borderRadius: '2px', outline: 'none', backgroundColor: 'transparent', fontFamily: 'var(--font-sans)' }} required />
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label htmlFor="mobile" style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', color: 'var(--color-navy)' }}>
                  Mobile Number
                </label>
                <input type="tel" id="mobile" placeholder="10-digit mobile (optional)" style={{ width: '100%', padding: '1rem', border: '1px solid rgba(3,22,55,0.20)', borderRadius: '2px', outline: 'none', backgroundColor: 'transparent', fontFamily: 'var(--font-sans)' }} />
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label htmlFor="subject" style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', color: 'var(--color-navy)' }}>
                  Subject <span style={{ color: 'var(--color-gold)' }}>*</span>
                </label>
                <select id="subject" style={{ width: '100%', padding: '1rem', border: '1px solid rgba(3,22,55,0.20)', borderRadius: '2px', outline: 'none', appearance: 'none', backgroundColor: 'transparent', fontFamily: 'var(--font-sans)', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23031637%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }} required>
                  <option value="">Select a subject</option>
                  <option value="Product Inquiry">Product Inquiry</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Return / Refund">Return / Refund</option>
                  <option value="Wholesale">Wholesale</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: '3rem' }}>
                <label htmlFor="message" style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.75rem', color: 'var(--color-navy)' }}>
                  Message <span style={{ color: 'var(--color-gold)' }}>*</span>
                </label>
                <textarea id="message" rows="6" placeholder="How can we help you?" style={{ width: '100%', padding: '1rem', border: '1px solid rgba(3,22,55,0.20)', borderRadius: '2px', outline: 'none', resize: 'vertical', backgroundColor: 'transparent', fontFamily: 'var(--font-sans)' }} required></textarea>
              </div>

              <button type="submit" className="btn" style={{ width: '100%', padding: '1.25rem', backgroundColor: 'var(--color-navy)', color: 'var(--color-ivory)', border: '1px solid var(--color-gold)', borderRadius: '2px', fontSize: '0.85rem', letterSpacing: '2px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', transition: 'all 0.4s ease' }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-gold)'; e.currentTarget.style.color = 'var(--color-navy)'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-navy)'; e.currentTarget.style.color = 'var(--color-ivory)'; }}>
                Send Message <Send size={16} />
              </button>
            </form>
          </ScrollReveal>

        </div>
      </div>

      <style>{`
        input:focus, select:focus, textarea:focus {
          border-color: var(--color-gold) !important;
        }
        .contact-info-column {
          padding: 3.5rem;
        }
        .contact-form-column {
          padding: 2rem 1rem;
        }
        @media (max-width: 992px) {
          .container.section > div {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          .contact-info-column {
            padding: 2rem 1.5rem !important;
            margin: 0 1rem;
          }
          .contact-form-column {
            padding: 2rem 1rem !important;
            margin: 0 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
