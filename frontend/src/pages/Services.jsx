import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Phone, FileText, Building2, Shield, Rocket, ArrowRight,
  CheckCircle2, Users, Star, UserCircle, Briefcase,
  MessageCircleQuestion, RefreshCw, FilePen, FileSearch,
  ClipboardList, Scale, Handshake, GraduationCap,
  BookMarked, ExternalLink, BadgeDollarSign, SearchCheck,
} from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import PageHero from '../components/ui/PageHero';
import ImageSection from '../components/ui/ImageSection';

const serviceGroups = [
  {
    id: 'consultation',
    icon: Phone,
    title: 'Consultation',
    color: 'from-green-500 to-emerald-600',
    description:
      'Get expert guidance before making critical business and tax decisions. Our consultation services are designed to give you clarity and confidence.',
    items: [
      {
        icon: Briefcase,
        title: 'Start-up Business Structure',
        description:
          'Get expert advice on the best legal and tax structure for your new business — sole proprietorship, partnership, or limited liability company.',
      },
      {
        icon: SearchCheck,
        title: 'Business Structure Review',
        description:
          'Ensure your current business structure is optimized for growth and tax efficiency. We identify gaps and recommend improvements.',
      },
      {
        icon: UserCircle,
        title: 'Tax Call — Individual',
        description:
          'A one-on-one session with our tax consultant focused on your personal tax concerns, obligations, reliefs, and opportunities.',
      },
      {
        icon: Users,
        title: 'Tax Call — Business',
        description:
          'A dedicated session for businesses to discuss corporate tax planning, compliance obligations, and strategic tax management.',
      },
      {
        icon: MessageCircleQuestion,
        title: 'Quick Question Call — Individual',
        description:
          'Fast, focused answers to your urgent personal tax and financial questions. Perfect when you need clarity without a full consultation.',
      },
      {
        icon: Briefcase,
        title: 'Quick Question Call — Business',
        description:
          'Quick, targeted answers to pressing business tax and compliance questions. Get the clarity you need to keep moving forward.',
      },
    ],
  },
  {
    id: 'tax-filing',
    icon: FileText,
    title: 'Tax Filing',
    color: 'from-blue-500 to-blue-700',
    description:
      'Accurate, timely tax filing for individuals and businesses. We handle everything so you never miss a deadline or overpay.',
    items: [
      {
        icon: UserCircle,
        title: 'Annual Filing — Individual (PITA)',
        description:
          'Personal Income Tax Assessment filing in three tiers: Lite (basic filers), Max (multiple income streams), and Pro (complex portfolios).',
      },
      {
        icon: Briefcase,
        title: 'Annual Filing — Small Business (CITA)',
        description:
          'Companies Income Tax Act filing for small businesses — Lite, Max, and Pro packages tailored to your business size and complexity.',
      },
      {
        icon: BadgeDollarSign,
        title: 'Monthly VAT Filing',
        description:
          'Value Added Tax monthly filing for Pro & Max businesses. We ensure accurate returns and full compliance with FIRS/NRS requirements.',
      },
      {
        icon: ClipboardList,
        title: 'Monthly PAYE Filing',
        description:
          'Pay As You Earn monthly payroll tax filing for Pro & Max small businesses. Stay compliant with employee tax obligations.',
      },
    ],
  },
  {
    id: 'tax-return-review',
    icon: FileSearch,
    title: 'Tax Return Review',
    color: 'from-purple-500 to-purple-700',
    description:
      'Already filed? Let us review your returns to ensure accuracy, optimize deductions, and confirm compliance.',
    items: [
      {
        icon: UserCircle,
        title: 'Individual Tax Return Review',
        description:
          'A thorough review of your personal tax returns to identify errors, missed deductions, and optimization opportunities.',
      },
      {
        icon: Briefcase,
        title: 'Small Business Tax Return Review',
        description:
          'Comprehensive review of small business tax returns for compliance, savings identification, and accuracy assurance.',
      },
    ],
  },
  {
    id: 'business-formation',
    icon: Building2,
    title: 'Business Formation & Structuring',
    color: 'from-orange-500 to-orange-700',
    description:
      'From registration to ongoing compliance — we handle all your CAC and business structuring needs.',
    items: [
      {
        icon: FilePen,
        title: 'Form Your Business / Register for Business',
        description:
          'Complete assistance with business formation and CAC registration — name search, documentation, and filing.',
      },
      {
        icon: ClipboardList,
        title: 'File Your CAC / Business Annual Report',
        description:
          'Ensure timely and accurate Annual Returns filing with the Corporate Affairs Commission to keep your business in good standing.',
      },
      {
        icon: RefreshCw,
        title: 'Reactivate Your Business',
        description:
          'Get your inactive or struck-off business back on track with our reactivation process management.',
      },
      {
        icon: FileSearch,
        title: 'Amend Your Business',
        description:
          'Make necessary changes to your business structure, directors, address, or registration details with ease.',
      },
    ],
  },
  {
    id: 'tax-audit',
    icon: Shield,
    title: 'Tax Audit & Investigation',
    color: 'from-red-500 to-red-700',
    description:
      'Facing a tax audit or investigation? Our experts will represent and protect you throughout the process.',
    items: [
      {
        icon: SearchCheck,
        title: 'Tax Audits Case',
        description:
          'Expert handling of tax audit cases — we prepare documentation, represent you before the authorities, and work to minimize liabilities.',
      },
      {
        icon: Scale,
        title: 'Tax Investigation Case',
        description:
          'Professional assistance during tax investigations, ensuring your rights are protected and the process is handled properly.',
      },
      {
        icon: Handshake,
        title: 'Partner with Us',
        description:
          'Tax practitioners and firms can partner with us for collaborative support on complex audit and investigation cases.',
      },
    ],
  },
  {
    id: 'tax-defence',
    icon: Scale,
    title: 'Tax Defence & Resolution',
    color: 'from-teal-500 to-teal-700',
    description:
      'Dispute with the tax authorities? We provide strategic defence and resolution services to protect your interests.',
    items: [
      {
        icon: Shield,
        title: 'Tax Defence and Resolution',
        description:
          'Comprehensive defence strategies to contest incorrect tax assessments and resolve disputes with FIRS/NRS or state tax authorities.',
      },
      {
        icon: Handshake,
        title: 'Want to Partner with Us?',
        description:
          'Tax professionals and firms can collaborate with us on tax defence and resolution cases for their clients.',
      },
    ],
  },
  {
    id: 'kickstart',
    icon: Rocket,
    title: 'Kickstart Your Tax Profession',
    color: 'from-pink-500 to-pink-700',
    description:
      'Interested in a career in tax? We offer resources, guidance, and mentorship to help you start and thrive in the tax profession.',
    items: [
      {
        icon: GraduationCap,
        title: 'Career Guidance & Mentorship',
        description:
          'Get guided by an experienced Chartered Tax Specialist on how to build a successful career in taxation and accounting.',
      },
      {
        icon: BookMarked,
        title: 'Resources & Training',
        description:
          'Access curated resources, study guides, and practical knowledge to fast-track your journey into the tax profession.',
      },
    ],
  },
];

// ─── Academy link — update href when ready ────────────────────────────────────
const ACADEMY_URL = 'https://academy.taxontime.ng'; // replace with your actual academy link

export default function Services() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [hash]);

  return (
    <>
      <PageHero
        breadcrumb="Our Services"
        title="Everything You Need to"
        highlight="Stay Compliant & Grow"
        subtitle="From business registration to complex tax defence — comprehensive tax and business services for every stage of your journey."
      />

      {/* Quick Nav */}
      <section className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-40 overflow-x-auto">
        <div className="container-site">
          <div className="flex gap-1 py-3 w-max md:w-auto">
            {serviceGroups.map(({ id, title, icon: Icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-600 hover:text-brand-green hover:bg-brand-green/5 transition-all whitespace-nowrap"
              >
                <Icon size={13} />
                {title}
              </a>
            ))}
            <a
              href="#academy"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-brand-green hover:bg-brand-green/5 transition-all whitespace-nowrap border border-brand-green/30"
            >
              <GraduationCap size={13} />
              Our Academy
            </a>
          </div>
        </div>
      </section>

      {/* Service Sections */}
      <div className="bg-white">
        {serviceGroups.map((group, groupIdx) => {
          const Icon = group.icon;
          const isEven = groupIdx % 2 === 0;
          return (
            <section
              key={group.id}
              id={group.id}
              className={`section scroll-mt-32 ${isEven ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="container-site">
                {/* Group Header */}
                <AnimatedSection className="mb-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${group.color} flex items-center justify-center`}>
                      <Icon size={22} className="text-white" />
                    </div>
                    <div>
                      <h2 className="font-heading font-bold text-2xl md:text-3xl text-gray-900">
                        {group.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-gray-600 max-w-2xl leading-relaxed ml-16">{group.description}</p>
                </AnimatedSection>

                {/* Service Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 ml-0 md:ml-16">
                  {group.items.map((item, i) => {
                    const ItemIcon = item.icon;
                    return (
                      <AnimatedSection key={item.title} variant="fadeUp" delay={i * 0.1}>
                        <motion.div
                          whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(22,163,74,0.12)' }}
                          className="bg-white border border-gray-100 rounded-2xl p-6 h-full"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-brand-green/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <ItemIcon size={17} className="text-brand-green" />
                            </div>
                            <div>
                              <h3 className="font-heading font-semibold text-gray-900 mb-2">{item.title}</h3>
                              <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      </AnimatedSection>
                    );
                  })}
                </div>

                {/* Book CTA */}
                <AnimatedSection className="mt-8 ml-0 md:ml-16">
                  <Link
                    to={`/contact?service=${encodeURIComponent(group.title)}`}
                    className="btn-outline inline-flex"
                  >
                    Book {group.title} <ArrowRight size={16} />
                  </Link>
                </AnimatedSection>
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Academy Section ───────────────────────────────────────── */}
      <section id="academy" className="section scroll-mt-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-green to-transparent" />

        <div className="container-site relative z-10">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection>
              <div className="flex flex-col lg:flex-row items-center gap-10">
                {/* Icon block */}
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-28 h-28 rounded-3xl bg-brand-green/20 border border-brand-green/30 flex items-center justify-center"
                  >
                    <GraduationCap size={52} className="text-brand-green" />
                  </motion.div>
                </div>

                {/* Text */}
                <div className="flex-grow text-center lg:text-left">
                  <p className="text-brand-green font-medium uppercase tracking-widest text-sm mb-2">
                    TaxonTime Academy
                  </p>
                  <h2 className="text-white font-heading font-bold text-3xl md:text-4xl mb-4">
                    Interested in Our Academy?
                  </h2>
                  <p className="text-gray-400 text-lg leading-relaxed mb-3">
                    Take your tax knowledge to the next level. Our academy offers structured
                    courses, workshops, and practical training for individuals who want to
                    understand tax or build a career in the profession.
                  </p>
                  <ul className="space-y-2 mb-8 text-left inline-block">
                    {[
                      { icon: BookMarked, text: 'Practical tax courses for beginners & professionals' },
                      { icon: GraduationCap, text: 'Mentorship from a Chartered Tax Specialist' },
                      { icon: CheckCircle2, text: 'Certificates of completion' },
                      { icon: Users, text: 'Community of tax-savvy entrepreneurs' },
                    ].map(({ icon: Icon, text }) => (
                      <li key={text} className="flex items-center gap-3 text-gray-300 text-sm">
                        <Icon size={15} className="text-brand-green flex-shrink-0" />
                        {text}
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                    <a
                      href={ACADEMY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center gap-2 animate-pulse-green"
                    >
                      <GraduationCap size={17} />
                      Visit the Academy
                      <ExternalLink size={14} />
                    </a>
                    <Link to="/contact?service=Kickstart Tax Career" className="btn-secondary inline-flex">
                      Ask Us About It <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {/* ── Final CTA — ant-bg2.jpg (TAX dial) ──────────────────── */}
      <ImageSection
        image="/ant-bg2.jpg"
        overlay="from-black/88 via-black/70 to-black/60"
        direction="center"
        className="py-24"
      >
        <div className="container-site text-center">
          <AnimatedSection variant="scaleUp">
            <h2 className="text-white font-heading font-bold text-3xl md:text-4xl mb-4 drop-shadow-lg">
              Not Sure Which Service You Need?
            </h2>
            <p className="text-gray-200 text-lg max-w-xl mx-auto mb-10 drop-shadow">
              Book a quick call and let's figure out the best approach for your specific situation.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Link to="/contact" className="btn-primary text-base px-10 py-4 animate-pulse-green shadow-lg shadow-brand-green/30">
                Talk to Us <ArrowRight size={18} />
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </ImageSection>
    </>
  );
}
