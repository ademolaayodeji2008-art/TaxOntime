import { CheckCircle2, Target, Eye, Heart, Award, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedSection from '../components/ui/AnimatedSection';
import PageHero from '../components/ui/PageHero';
import ImageSection from '../components/ui/ImageSection';

const values = [
  {
    icon: Target,
    title: 'Client-Centric Service',
    description: 'Tailoring our services to meet your unique tax and business needs — no one-size-fits-all approach.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'Keeping you informed and involved every step of the way. No hidden fees, no surprises.',
  },
  {
    icon: Award,
    title: 'Reliability',
    description: 'Delivering accurate, timely, and reliable tax solutions you can count on every time.',
  },
  {
    icon: Heart,
    title: 'Integrity',
    description: 'Committed to ethical practices and fair treatment for all clients — always.',
  },
];

const expertise = [
  {
    title: 'Tax Planning',
    description:
      'Comprehensive strategies to minimize tax liabilities and maximize wealth. We analyze your financial situation and craft a tailored tax plan that keeps more money in your pocket — legally and ethically.',
  },
  {
    title: 'Tax Advisory',
    description:
      'Expert advice on all tax-related matters to ensure informed decision-making. We provide insightful guidance to help you navigate complex tax situations with confidence and clarity.',
  },
  {
    title: 'Tax Management',
    description:
      'Seamless, compliant tax processes with ongoing support and monitoring. We handle the complexity so you can focus on running your business, with continuous support to ensure compliance with the latest tax laws.',
  },
  {
    title: 'Business Regulations & Compliance',
    description:
      'We help individuals and small businesses stay compliant with business and tax regulations while avoiding penalties. Our support ensures smooth operations, credibility, and sustainable growth.',
  },
];

const approach = [
  {
    icon: Users,
    title: 'Educate',
    description:
      'We prioritize creating awareness and understanding of tax responsibilities among our clients. We believe that informed business owners and individuals are more likely to meet their tax obligations willingly and ethically, without resorting to practices that could harm their integrity or business reputation.',
  },
  {
    icon: Target,
    title: 'Advise',
    description:
      'We provide clear, actionable advice to help our clients meet their tax and business compliance responsibilities. Every piece of advice is grounded in the principles of equity and fairness — the foundation of everything we do at TaxonTime.Ng.',
  },
  {
    icon: TrendingUp,
    title: 'Ensure Compliance',
    description:
      'We ensure full compliance with all Tax and Business laws and regulations to safeguard your financial future. Our ongoing support keeps you on the right side of the law, no matter how regulations evolve.',
  },
];

export default function About() {
  return (
    <>
      <PageHero
        breadcrumb="About Us"
        title="Meet the Team Behind"
        highlight="TaxonTime.Ng"
        subtitle="A dedicated team of tax professionals committed to helping you create and preserve wealth through smart tax planning and full compliance."
      />

      {/* ── Welcome & Founder ───────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

            {/* Owner Photo Card */}
            <AnimatedSection variant="fadeLeft">
              <div className="relative">
                <div className="absolute -inset-3 bg-brand-green/10 rounded-3xl -z-10" />
                <div className="bg-black rounded-2xl overflow-hidden">
                  {/* Owner photo — drop your image as /owner.jpg into frontend/public/ */}
                  <div className="relative w-full aspect-[4/5] bg-gradient-to-br from-gray-900 to-black">
                    <img
                      src="/owner.png"
                      alt="Zarat Ranti L. — Lead Tax Consultant & Founder, TaxonTime.Ng"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: '50% 20%' }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback until photo is added */}
                    <div
                      className="absolute inset-0 flex-col items-center justify-center gap-4 hero-pattern"
                      style={{ display: 'none' }}
                    >
                      <img
                        src="/tnt.png"
                        alt="TaxonTime.Ng"
                        className="w-28 h-28 rounded-2xl object-contain animate-float"
                      />
                      <p className="text-gray-500 text-sm">Owner photo coming soon</p>
                    </div>
                    {/* Name overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent px-6 py-6">
                      <h3 className="text-white font-heading font-bold text-2xl mb-0.5">Zarat Ranti L.</h3>
                      <p className="text-brand-green text-sm font-medium">Lead Tax Consultant & Founder</p>
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-px bg-white/5 border-t border-white/10">
                    {[
                      { v: '10+', l: 'Years of Experience' },
                      { v: '100+', l: 'Clients Served' },
                      { v: 'ICAN', l: 'Chartered Accountant' },
                      { v: 'CITN', l: 'Tax Specialist' },
                    ].map(({ v, l }) => (
                      <div key={l} className="bg-black/80 p-4 text-center">
                        <div className="text-brand-green font-bold text-xl">{v}</div>
                        <div className="text-gray-400 text-xs mt-0.5">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Welcome Text — full content from document */}
            <AnimatedSection variant="fadeRight">
              <p className="text-brand-green font-medium uppercase tracking-widest text-sm mb-3">
                Welcome to TaxonTime.Ng
              </p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-5">
                Your Trusted Partner in Tax & Business Compliance
              </h2>

              <p className="text-gray-600 leading-relaxed mb-4">
                We are a dedicated team of tax consultants led by <strong>Zarat Ranti L.</strong>,
                a seasoned Tax Consultant with up to a decade of experience in Tax Planning,
                Tax Advisory, and Management.
              </p>

              <p className="text-gray-600 leading-relaxed mb-4">
                Our mission is to help individuals and small to medium-sized enterprises (SMEs)
                <strong> create and preserve wealth</strong> by minimizing their tax liabilities while
                ensuring full compliance with all relevant tax laws and regulations.
              </p>

              <p className="text-gray-600 leading-relaxed mb-4">
                With a robust background in Accounting and credentials as a <strong>Chartered
                Accountant</strong> and <strong>Chartered Taxation Specialist</strong>, Zarat Ranti L.
                has successfully guided more than 100 clients — both businesses and individuals —
                in optimizing their tax strategies.
              </p>

              <p className="text-gray-600 leading-relaxed mb-6">
                Whether you are an individual seeking to optimize your personal taxes or a business
                looking to streamline your Tax and Business Compliance processes, TaxonTime.Ng is
                here to help. We look forward to working with you and helping you navigate the
                complexities of Business and Tax management with <strong>ease and confidence</strong>.
              </p>

              <Link to="/contact" className="btn-primary">
                Work With Us <ArrowRight size={16} />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Our Expertise ───────────────────────────────────────── */}
      <section className="section bg-gray-50">
        <div className="container-site">
          <AnimatedSection className="text-center mb-14">
            <p className="text-brand-green font-medium uppercase tracking-widest text-sm mb-2">Our Expertise</p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              What We Specialize In
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our expertise lies in four core areas that cover everything an individual or business
              needs to stay tax-smart and financially healthy.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {expertise.map(({ title, description }, i) => (
              <AnimatedSection key={title} variant="fadeUp" delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(22,163,74,0.10)' }}
                  className="flex gap-4 p-7 rounded-2xl bg-white border border-gray-100 hover:border-brand-green/30 transition-all duration-300 h-full"
                >
                  <div className="w-10 h-10 bg-brand-green/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 size={18} className="text-brand-green" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-gray-900 mb-2 text-lg">{title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Philosophy ──────────────────────────────────────── */}
      {/* ── Our Philosophy — ant-bg3.jpg (green growth chart) ───── */}
      <ImageSection
        image="/ant-bg3.jpg"
        overlay="from-black/88 via-black/70 to-black/60"
        direction="center"
        className="section"
      >
        <div className="container-site">
          <AnimatedSection className="text-center mb-14">
            <p className="text-brand-green font-medium uppercase tracking-widest text-sm mb-2">Our Philosophy</p>
            <h2 className="text-white font-heading font-bold text-3xl md:text-4xl mb-4 drop-shadow-lg">
              We Are <span className="gradient-text">Taxpreneurs</span>
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed drop-shadow">
              We believe in the principles of <strong className="text-white">equity and fairness</strong>, and
              our approach is driven by these values. At TaxonTime.Ng, we are passionate about being
              "Taxpreneurs" — entrepreneurs in the field of tax who are committed to ethical practices
              and fairness.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {approach.map(({ icon: Icon, title, description }, i) => (
              <AnimatedSection key={title} variant="fadeUp" delay={i * 0.15}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(22,163,74,0.2)' }}
                  className="bg-white/8 backdrop-blur-sm border border-white/15 rounded-2xl p-8 text-center hover:bg-white/15 transition-all duration-300 hover:border-brand-green/50 h-full"
                >
                  <div className="w-14 h-14 bg-brand-green/25 rounded-full flex items-center justify-center mx-auto mb-5 ring-2 ring-brand-green/30">
                    <Icon size={24} className="text-brand-green" />
                  </div>
                  <h3 className="text-white font-heading font-semibold text-xl mb-3 drop-shadow">{title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </ImageSection>

      {/* ── Why Choose Us ───────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <AnimatedSection variant="fadeLeft">
              <p className="text-brand-green font-medium uppercase tracking-widest text-sm mb-3">Why Choose Us</p>
              <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-5">
                Choosing TaxonTime.Ng Means Partnering With a Firm That Values Your Success
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We are committed to delivering tax and business compliance solutions that are accurate,
                ethical, and tailored to your specific situation. Here is what sets us apart:
              </p>
              <ul className="space-y-4">
                {[
                  { title: 'Client-Centric Service', desc: 'Tailoring our services to meet your unique needs — no cookie-cutter approach.' },
                  { title: 'Transparency', desc: 'Keeping you informed and involved every step of the way — no surprises.' },
                  { title: 'Reliability', desc: 'Delivering accurate, timely, and reliable tax solutions you can always count on.' },
                  { title: 'Professionalism', desc: 'Chartered qualifications and a proven track record of success across 100+ clients.' },
                  { title: 'Integrity', desc: 'Commitment to ethical practices and fair treatment for every single client.' },
                ].map(({ title, desc }) => (
                  <li key={title} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-brand-green/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={13} className="text-brand-green" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">{title}:</span>{' '}
                      <span className="text-gray-500 text-sm">{desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection variant="fadeRight">
              <div className="grid grid-cols-2 gap-4">
                {values.map(({ icon: Icon, title, description }, i) => (
                  <motion.div
                    key={title}
                    whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(22,163,74,0.12)' }}
                    className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-brand-green/30 transition-all duration-300"
                  >
                    <div className="w-11 h-11 bg-brand-green/10 rounded-xl flex items-center justify-center mb-4">
                      <Icon size={20} className="text-brand-green" />
                    </div>
                    <h3 className="font-heading font-semibold text-gray-900 mb-2 text-sm">{title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">{description}</p>
                  </motion.div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Get in Touch — ant.bg.png (law/gavel) ───────────────── */}
      <ImageSection
        image="/ant.bg.png"
        overlay="from-black/90 via-black/75 to-black/65"
        direction="center"
        className="section"
      >
        <div className="container-site">
          <AnimatedSection variant="scaleUp">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-brand-green font-medium uppercase tracking-widest text-sm mb-3 drop-shadow">
                Get in Touch
              </p>
              <h2 className="text-white font-heading font-bold text-3xl md:text-4xl mb-5 drop-shadow-lg">
                Ready to Partner With Us?
              </h2>
              <p className="text-gray-200 text-lg max-w-2xl mx-auto mb-4 leading-relaxed drop-shadow">
                Whether you are an individual seeking to optimize your personal taxes or a business
                looking to streamline your Tax and Business Compliance processes,
                <strong className="text-white"> TaxonTime.Ng is here to help.</strong>
              </p>
              <p className="text-gray-300 max-w-xl mx-auto mb-10 drop-shadow">
                Contact us today to learn how we can assist you in achieving your financial goals
                while maintaining full compliance with your Business regulations and Tax laws.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/contact" className="btn-primary px-8 py-4 animate-pulse-green shadow-lg shadow-brand-green/30">
                    Contact Us <ArrowRight size={16} />
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Link to="/services" className="btn-secondary px-8 py-4 backdrop-blur-sm">
                    View Our Services
                  </Link>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </ImageSection>
    </>
  );
}
