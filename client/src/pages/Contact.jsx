import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px 60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <span style={{ 
          display: 'inline-block', 
          fontSize: '13px', 
          fontWeight: 600, 
          letterSpacing: '0.08em', 
          textTransform: 'uppercase', 
          color: 'var(--color-primary, #ff385c)',
          background: 'rgba(255, 56, 92, 0.08)',
          padding: '6px 14px',
          borderRadius: '20px',
          marginBottom: '16px'
        }}>
          Get in Touch
        </span>
        <h1 style={{ fontSize: '38px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
          We'd Love to Hear From You
        </h1>
        <p style={{ fontSize: '17px', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
          Have questions about a booking, partnership, or feedback? Send us a message and our support team will respond within 2 hours.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'start' }}>
        {/* Contact Info Card */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '24px' }}>Contact Information</h3>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,56,92,0.1)', color: '#ff385c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Mail size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Email Support</h4>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>support@stayease.com</p>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>help@stayease.com</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,56,92,0.1)', color: '#ff385c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Phone size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Phone Support</h4>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>+91 1800-123-4567 (Toll Free)</p>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px' }}>+91 98765-43210 (24x7 Helpline)</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,56,92,0.1)', color: '#ff385c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <MapPin size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '0 0 4px' }}>Headquarters</h4>
              <p style={{ color: '#64748b', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
                StayEase Tech Park, 4th Floor<br />
                MG Road, Bengaluru, Karnataka 560001
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '36px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 10px' }}>
              <CheckCircle2 size={56} color="#10b981" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Message Sent Successfully!</h3>
              <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>
                Thank you for reaching out. Our support team will get back to you shortly at {formData.email}.
              </p>
              <button 
                className="btn btn-outline" 
                onClick={() => setSubmitted(false)}
                style={{ borderRadius: '10px' }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Send us a message</h3>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Your Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Email Address</label>
                <input 
                  type="email" 
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Subject</label>
                <input 
                  type="text" 
                  required
                  placeholder="Booking inquiry, feedback..."
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Message</label>
                <textarea 
                  rows="4" 
                  required
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '15px', resize: 'vertical' }}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '10px', fontSize: '16px', fontWeight: 600 }}
              >
                <Send size={18} /> Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
