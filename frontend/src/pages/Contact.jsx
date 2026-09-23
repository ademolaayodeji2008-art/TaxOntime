import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedSection from '../components/ui/AnimatedSection';
import PageHero from '../components/ui/PageHero';
import NewsletterForm from '../components/ui/NewsletterForm';
import api from '../utils/api';

const services = [
  'General Inquiry',
  'Start-up Business Structure',
  'Business Structure Review',
  'Tax Call',
  'Quick Question Call',
  'Annual Tax Filing — Individual',
  'Annual Tax Filing — Small Business',
  'Monthly VAT Filing',
  'Monthly PAYE Filing',
  'Tax Return Review',
  'Business Formation / CAC Registration',
  'Tax Audit & Investigation',
  'Tax Defence & Resolution',
  'Kickstart Tax Career',
  'Partnership Inquiry',
];

export default function Contact() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: searchParams.get('service') || 'General Inquiry',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const s = searchParams.get('service');
    if (s) setForm((f) => ({ ...f, service: s }));
  }, [searchParams]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      return toast.error('Please fill in all required fields.');
    }
    setLoading(true);
    try {
      await api.post('/contact', form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', service: 'General Inquiry', message: '' });
      toast.success('Message sent! We\'ll get back to you within 24–48 hours.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHero
        breadcrumb="Contact Us"
        title="Let's Talk About"
        highlight="Your Taxes"
        subtitle="Ready to optimize your tax position? Book a consultation or send us a message — we respond within 24 hours."
      />

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <div className="lg:col-span-3">
              <AnimatedSection variant="fadeLeft">
                <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">Send Us a Message</h2>

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-brand-green/10 border border-brand-green/30 rounded-2xl p-10 text-center"
                  >
                    <CheckCircle2 size={52} className="text-brand-green mx-auto mb-4" />
                    <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for reaching out. We'll get back to you within <strong>24–48 hours</strong>.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="btn-outline mt-6"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          className="input"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          className="input"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          className="input"
                          placeholder="+234 706 219 0613"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Interested In</label>
                        <select
                          name="service"
                          value={form.service}
                          onChange={handleChange}
                          className="input"
                        >
                          {services.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={6}
                        className="input resize-none"
                        placeholder="Tell us about your tax or business situation..."
                        required
                      />
                    </div>

                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-4">
                      {loading ? (
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={17} />
                      )}
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </AnimatedSection>
            </div>

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <AnimatedSection variant="fadeRight">
                <h2 className="font-heading font-bold text-2xl text-gray-900 mb-6">Contact Information</h2>

                <div className="space-y-5 mb-8">
                  {[
                    { icon: Mail, label: 'Email', value: 'zaratolabisi@gmail.com', href: 'mailto:zaratolabisi@gmail.com' },
                    { icon: Phone, label: 'Phone / WhatsApp', value: '+234 706 219 0613', href: 'tel:+2347062190613' },
                    { icon: MapPin, label: 'Location', value: 'Nigeria', href: null },
                    { icon: Clock, label: 'Response Time', value: 'Within 24–48 hours', href: null },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-brand-green/5 transition-colors">
                      <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon size={18} className="text-brand-green" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                        {href ? (
                          <a href={href} className="text-gray-800 font-medium hover:text-brand-green transition-colors">
                            {value}
                          </a>
                        ) : (
                          <p className="text-gray-800 font-medium">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social */}
                <div className="bg-black rounded-2xl p-6">
                  <p className="text-white font-semibold mb-1">Follow us on social media</p>
                  <p className="text-gray-400 text-sm mb-4">For daily tax tips and updates</p>
                  <div className="flex gap-3">
                    {[
                      { label: 'Instagram', href: 'https://instagram.com/taxontime.ng' },
                      { label: 'Twitter', href: 'https://twitter.com/taxontimeng' },
                      { label: 'LinkedIn', href: 'https://linkedin.com' },
                    ].map(({ label, href }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center py-2 bg-white/10 hover:bg-brand-green text-gray-300 hover:text-white text-xs font-medium rounded-lg transition-all duration-200"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section bg-gray-50">
        <div className="container-site max-w-xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-brand-green font-medium uppercase tracking-widest text-sm mb-2">Stay Connected</p>
            <h2 className="font-heading font-bold text-2xl text-gray-900 mb-2">Subscribe to Our Newsletter</h2>
            <p className="text-gray-500 mb-6">
              Get free tax tips, compliance reminders, and exclusive resources — straight to your inbox.
            </p>
            <NewsletterForm />
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}

