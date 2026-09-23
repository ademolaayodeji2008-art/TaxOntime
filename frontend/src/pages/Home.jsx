import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Phone, FileText, Building2, Shield, BookOpen, ShoppingBag,
  CheckCircle2, Users, TrendingUp, Award, ChevronRight,
} from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import ServiceCard from '../components/ui/ServiceCard';
import NewsletterForm from '../components/ui/NewsletterForm';
import ImageSection from '../components/ui/ImageSection';

const stats = [
  { value: '100+', label: 'Clients Served', icon: Users },
  { value: '10+', label: 'Years Experience', icon: Award },
  { value: '100%', label: 'Compliance Rate', icon: CheckCircle2 },
  { value: '₦0', label: 'Hidden Fees', icon: TrendingUp },
];

const services = [
  {
    icon: Phone,
    title: 'Consultation',
    description: 'Expert advice on business structure, tax planning, and quick answers to your tax questions.',
    href: '/services#consultation',
  },
  {
    icon: FileText,
    title: 'Tax Filing',
    description: 'Annual and monthly tax filing for individuals (PITA) and small businesses (CITA, VAT, PAYE).',
    href: '/services#tax-filing',
  },
  {
    icon: Building2,
    title: 'Business Formation',
    description: 'Register your business, file CAC reports, reactivate or amend your business structure.',
    href: '/services#business-formation',
  },
  {
    icon: Shield,
    title: 'Tax Audit & Investigation',
    description: 'Professional handling of tax audits and investigations to minimize liabilities.',
    href: '/services#tax-audit',
  },
  {
    icon: BookOpen,
    title: 'Tax Defence & Resolution',
    description: 'Protect and resolve your tax issues with expert defence strategies.',
    href: '/services#tax-defence',
  },
  {
    icon: ShoppingBag,
    title: 'Products & Resources',
    description: 'E-books, templates, organizers, guides, and checklists to keep you tax-smart.',
    href: '/products',
  },
];

const whyUs = [
  'Chartered Accountant & Certified Tax Specialist',
  'Transparent, flat-fee pricing — no surprises',
  'Full compliance with Nigerian tax laws',
  'Personalized service tailored to your needs',
  'Proven track record with 100+ clients',
  'Ongoing support and tax education',
];

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="min-h-screen flex items-center relative overflow-hidden w-full max-w-[100vw]">

        {/* ── Background image — full brightness, sharp ── */}
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src="/hero-bj.jpg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </motion.div>

        {/* ── Minimal overlay — just enough contrast for text, no heavy black ── */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* ── Shimmer sweep — light moves across the image once on load ── */}
        <motion.div
          initial={{ x: '-100%', opacity: 0.4 }}
          animate={{ x: '200%', opacity: 0 }}
          transition={{ duration: 1.8, delay: 0.5, ease: 'easeInOut' }}
          className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 pointer-events-none"
        />

        {/* ── Floating particles ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { top: '15%', left: '8%', size: 3, delay: 0 },
            { top: '60%', left: '5%', size: 2, delay: 1 },
            { top: '30%', left: '88%', size: 3, delay: 0.5 },
            { top: '75%', left: '80%', size: 2, delay: 1.5 },
            { top: '45%', left: '50%', size: 2, delay: 2 },
            { top: '20%', left: '65%', size: 3, delay: 0.8 },
          ].map((p, i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -18, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
              className="absolute rounded-full bg-brand-green"
              style={{ top: p.top, left: p.left, width: p.size, height: p.size }}
            />
          ))}
        </div>

        {/* ── Animated green accent ring bottom-left ── */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.30, 0.15] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full border-2 border-brand-green/30 pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1.1, 1.4, 1.1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border border-brand-green/20 pointer-events-none"
        />

        {/* ── Content ── */}
        <div className="container-site relative z-10 pt-24 pb-16">
          <div className="max-w-3xl">

            {/* Badge — slides in from left */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-brand-green/25 border border-brand-green/50 text-green-300 text-sm font-medium px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-2 h-2 bg-brand-green rounded-full"
              />
              Nigeria's Trusted Tax & Business Compliance Experts
            </motion.div>

            {/* Headline — words animate in one by one */}
            <div className="mb-6">
              {['Pay Less Tax.', 'Stay Compliant.', 'Grow Your Business.'].map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.15 + i * 0.18, ease: 'easeOut' }}
                >
                  <h1 className={`font-heading font-bold leading-tight
                    text-4xl sm:text-5xl md:text-6xl lg:text-7xl
                    ${i === 1 ? 'gradient-text' : 'text-white'}`}
                  >
                    {line}
                  </h1>
                </motion.div>
              ))}
            </div>

            {/* Animated underline */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
              style={{ originX: 0 }}
              className="h-1 w-24 bg-brand-green rounded-full mb-6"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-gray-200 text-lg md:text-xl max-w-xl leading-relaxed mb-10 drop-shadow-md"
            >
              Expert tax consulting, business formation, and compliance services for individuals
              and SMEs in Nigeria — led by a Chartered Tax Specialist with 10+ years of experience.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contact" className="btn-primary text-base px-8 py-4 animate-pulse-green shadow-lg shadow-brand-green/30">
                  Book a Free Consultation
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link to="/services" className="btn-secondary text-base px-8 py-4 backdrop-blur-sm">
                  Explore Services
                  <ChevronRight size={18} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex flex-wrap items-center gap-5 mt-12"
            >
              {['Chartered Accountant', 'Certified Tax Specialist', 'ICAN Member', 'CITN Member'].map((badge, i) => (
                <motion.span
                  key={badge}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="flex items-center gap-1.5 text-gray-300 text-sm bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10"
                >
                  <CheckCircle2 size={13} className="text-brand-green" />
                  {badge}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400"
        >
          <div className="w-5 h-8 border-2 border-gray-500 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-brand-green rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────── */}
      <section className="bg-brand-green py-12">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label, icon: Icon }, i) => (
              <AnimatedSection key={label} variant="scaleUp" delay={i * 0.1}>
                <div className="text-center">
                  <Icon size={28} className="text-white/70 mx-auto mb-2" />
                  <div className="text-white font-heading font-bold text-3xl md:text-4xl">{value}</div>
                  <div className="text-green-100 text-sm mt-1">{label}</div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-site">
          <AnimatedSection className="text-center mb-14">
            <p className="text-brand-green font-medium uppercase tracking-widest text-sm mb-2">What We Do</p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900">
              Comprehensive Tax & Business Services
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              From startup registration to complex tax audits — we've got every stage of your financial journey covered.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <AnimatedSection key={service.title} variant="fadeUp" delay={i * 0.1}>
                <ServiceCard {...service} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection className="text-center mt-10">
            <Link to="/services" className="btn-outline">
              View All Services <ArrowRight size={16} />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ── About Teaser ────────────────────────────────────────── */}
      <section className="section bg-brand-gray-light">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimatedSection variant="fadeLeft">
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-green/10 rounded-3xl -z-10" />
                <div className="bg-black rounded-2xl p-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/20 rounded-full blur-3xl" />
                  <img
                    src="/tnt.png"
                    alt="TaxonTime.Ng"
                    className="w-28 h-28 rounded-xl object-contain mx-auto mb-6 animate-float"
                  />
                  <h3 className="text-white font-heading font-bold text-2xl text-center mb-2">
                    Zarat Ranti L.
                  </h3>
                  <p className="text-brand-green text-center text-sm font-medium mb-6">
                    Chartered Accountant & Tax Consultant
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { v: '10+', l: 'Years Experience' },
                      { v: '100+', l: 'Happy Clients' },
                      { v: 'ICAN', l: 'Certified' },
                      { v: 'CITN', l: 'Member' },
                    ].map(({ v, l }) => (
                      <div key={l} className="bg-white/5 rounded-xl p-3 text-center">
                        <div className="text-brand-green font-bold text-xl">{v}</div>
                        <div className="text-gray-400 text-xs mt-0.5">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection variant="fadeRight">
              <p className="text-brand-green font-medium uppercase tracking-widest text-sm mb-3">About Us</p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-5">
                Your Trusted Partner in{' '}
                <span className="gradient-text">Tax & Compliance</span>
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5">
                At TaxonTime.Ng, we are passionate "Taxpreneurs" — entrepreneurs in tax who
                believe that informed business owners and individuals are more likely to meet
                their tax obligations willingly and ethically.
              </p>
              <p className="text-gray-600 leading-relaxed mb-7">
                We help you understand your tax responsibilities, optimize your tax position, and
                maintain full compliance with Nigerian tax laws — so you can focus on growing your
                wealth and business.
              </p>

              <ul className="space-y-2 mb-8">
                {whyUs.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle2 size={16} className="text-brand-green flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/about" className="btn-outline">
                Learn More About Us <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────── */}
      {/* ── CTA Banner — ant-bg-4.jpg (blue growth chart) ──────── */}
      <ImageSection
        image="/ant-bg-4.jpg"
        overlay="from-black/85 via-black/60 to-black/50"
        direction="center"
        className="py-24"
      >
        <div className="container-site text-center">
          <AnimatedSection variant="scaleUp">
            <h2 className="text-white font-heading font-bold text-3xl md:text-4xl lg:text-5xl mb-4 drop-shadow-lg">
              Ready to Take Control of Your Taxes?
            </h2>
            <p className="text-gray-200 text-lg max-w-xl mx-auto mb-10 drop-shadow">
              Book a consultation today and let's create a tax strategy that works for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contact" className="btn-primary text-base px-8 py-4 animate-pulse-green shadow-lg shadow-brand-green/30">
                  Book a Consultation <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Link to="/services" className="btn-secondary text-base px-8 py-4 backdrop-blur-sm">
                  See Our Services
                </Link>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </ImageSection>

      {/* ── Newsletter ──────────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="max-w-xl mx-auto text-center">
            <AnimatedSection>
              <p className="text-brand-green font-medium uppercase tracking-widest text-sm mb-2">Stay Informed</p>
              <h2 className="font-heading font-bold text-3xl text-gray-900 mb-3">
                Free Tax Tips in Your Inbox
              </h2>
              <p className="text-gray-500 mb-8">
                Join hundreds of business owners and individuals getting weekly tax insights, compliance alerts, and money-saving tips.
              </p>
              <NewsletterForm />
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
