import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import NewsletterForm from '../ui/NewsletterForm';

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      {/* Newsletter Banner */}
      <div className="bg-brand-green/10 border-y border-brand-green/20 py-12">
        <div className="container-site">
          <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="text-white font-heading font-bold text-2xl">
                Stay Tax-Smart. Subscribe.
              </h3>
              <p className="text-gray-400 mt-1">
                Get free tax tips, compliance updates, and business guides straight to your inbox.
              </p>
            </div>
            <div className="w-full md:w-auto md:min-w-[400px]">
              <NewsletterForm variant="footer" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-site py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img src="/tnt.png" alt="TaxonTime.Ng" className="h-14 w-14 rounded-lg object-contain" />
              <span className="text-white font-heading font-bold text-lg">
                TaxonTime<span className="text-brand-green">.Ng</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Helping individuals and SMEs create and preserve wealth through smart tax planning,
              advisory, and full compliance with Nigerian tax laws.
            </p>
            <div className="flex gap-3 mt-5">
              {[
                { Icon: Instagram, href: 'https://instagram.com/taxontime.ng', label: 'Instagram' },
                { Icon: Twitter, href: 'https://twitter.com/taxontimeng', label: 'Twitter' },
                { Icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
                { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-brand-green hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/services#consultation', label: 'Consultation' },
                { to: '/services#tax-filing', label: 'Tax Filing' },
                { to: '/services#business-formation', label: 'Business Formation' },
                { to: '/services#tax-audit', label: 'Tax Audit & Investigation' },
                { to: '/services#tax-defence', label: 'Tax Defence & Resolution' },
                { to: '/services#kickstart', label: 'Kickstart Tax Career' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="hover:text-brand-green transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/', label: 'Home' },
                { to: '/about', label: 'About Us' },
                { to: '/blog', label: 'Blog & Resources' },
                { to: '/products', label: 'Products' },
                { to: '/contact', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="hover:text-brand-green transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-brand-green mt-0.5 flex-shrink-0" />
                <a href="mailto:zaratolabisi@gmail.com" className="hover:text-brand-green transition-colors">
                  zaratolabisi@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-brand-green mt-0.5 flex-shrink-0" />
                <a href="tel:+2347062190613" className="hover:text-brand-green transition-colors">
                  +234 706 219 0613
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-brand-green mt-0.5 flex-shrink-0" />
                <span>Nigeria</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5">
        <div className="container-site flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} TaxonTime.Ng. All rights reserved.</p>
          <p>
            Led by{' '}
            <span className="text-brand-green font-medium">Zarat Ranti L.</span>{' '}
            — Chartered Tax Consultant
          </p>
        </div>
      </div>
    </footer>
  );
}

