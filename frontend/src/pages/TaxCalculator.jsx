import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, ChevronDown, CheckCircle2, RefreshCw,
  BadgeDollarSign, Users, TrendingUp, Info,
} from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import PageHero from '../components/ui/PageHero';
import { Link } from 'react-router-dom';

// ─── Nigerian PIT Tax Table (2024 PITA) ───────────────────────────────────────
// Based on FIRS/NRS graduated tax bands
const PIT_BANDS = [
  { limit: 300000,   rate: 0.07 },
  { limit: 300000,   rate: 0.11 },
  { limit: 500000,   rate: 0.15 },
  { limit: 500000,   rate: 0.19 },
  { limit: 1600000,  rate: 0.21 },
  { limit: Infinity, rate: 0.24 },
];

const CONSOLIDATED_RELIEF = 200000; // ₦200,000 CRA
const CRA_PERCENTAGE = 0.20; // 20% of gross income

const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);

// ─── PIT Calculator Logic ─────────────────────────────────────────────────────
function calculatePIT(annualGross) {
  const grossIncome = Number(annualGross);
  if (!grossIncome || grossIncome <= 0) return null;

  // Consolidated Relief Allowance
  const cra = Math.max(CONSOLIDATED_RELIEF, CRA_PERCENTAGE * grossIncome);

  // Taxable Income
  const taxableIncome = Math.max(0, grossIncome - cra);

  // Apply tax bands
  let tax = 0;
  let remaining = taxableIncome;
  const breakdown = [];

  for (const band of PIT_BANDS) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, band.limit);
    const bandTax = taxable * band.rate;
    if (taxable > 0) {
      breakdown.push({
        amount: taxable,
        rate: band.rate * 100,
        tax: bandTax,
      });
    }
    tax += bandTax;
    remaining -= taxable;
  }

  const effectiveRate = grossIncome > 0 ? (tax / grossIncome) * 100 : 0;
  const monthlyTax = tax / 12;
  const netAnnual = grossIncome - tax;
  const netMonthly = netAnnual / 12;

  return {
    grossIncome,
    cra,
    taxableIncome,
    annualTax: tax,
    monthlyTax,
    netAnnual,
    netMonthly,
    effectiveRate,
    breakdown,
  };
}

// ─── PAYE Calculator Logic ────────────────────────────────────────────────────
function calculatePAYE(monthlyBasic, housing, transport, otherAllowances) {
  const basic = Number(monthlyBasic) || 0;
  const houseAllowance = Number(housing) || 0;
  const transportAllowance = Number(transport) || 0;
  const others = Number(otherAllowances) || 0;

  const monthlyGross = basic + houseAllowance + transportAllowance + others;
  const annualGross = monthlyGross * 12;

  const result = calculatePIT(annualGross);
  if (!result) return null;

  // Pension: 8% of basic + housing + transport (employee contribution)
  const monthlyPension = (basic + houseAllowance + transportAllowance) * 0.08;
  const annualPension = monthlyPension * 12;

  // NHF: 2.5% of basic salary
  const monthlyNHF = basic * 0.025;

  const totalMonthlyDeductions = result.monthlyTax + monthlyPension + monthlyNHF;
  const monthlyNet = monthlyGross - totalMonthlyDeductions;

  return {
    monthlyGross,
    annualGross,
    monthlyPAYE: result.monthlyTax,
    annualPAYE: result.annualTax,
    monthlyPension,
    monthlyNHF,
    totalMonthlyDeductions,
    monthlyNet,
    effectiveRate: result.effectiveRate,
    breakdown: result.breakdown,
    cra: result.cra,
    taxableIncome: result.taxableIncome,
  };
}

// ─── VAT Calculator Logic ─────────────────────────────────────────────────────
const VAT_RATE = 0.075; // 7.5% Nigeria

function calculateVAT(amount, mode) {
  const val = Number(amount) || 0;
  if (mode === 'exclusive') {
    const vat = val * VAT_RATE;
    return { base: val, vat, total: val + vat };
  } else {
    const base = val / (1 + VAT_RATE);
    const vat = val - base;
    return { base, vat, total: val };
  }
}

// ─── Tab Button ───────────────────────────────────────────────────────────────
const TabBtn = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
      active
        ? 'bg-brand-green text-white shadow-md shadow-brand-green/30'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

// ─── Result Row ───────────────────────────────────────────────────────────────
const ResultRow = ({ label, value, highlight, indent }) => (
  <div className={`flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0 ${indent ? 'pl-4' : ''}`}>
    <span className={`text-sm ${highlight ? 'font-bold text-gray-900' : 'text-gray-600'}`}>{label}</span>
    <span className={`text-sm font-semibold ${highlight ? 'text-brand-green text-base' : 'text-gray-900'}`}>{value}</span>
  </div>
);

// ─── Disclaimer ───────────────────────────────────────────────────────────────
const Disclaimer = () => (
  <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
    <Info size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
    <p className="text-xs text-amber-700 leading-relaxed">
      <strong>Disclaimer:</strong> These calculators are for estimation purposes only and are based on current Nigerian tax laws. 
      Results may vary based on individual circumstances, additional allowances, and specific tax reliefs. 
      Please consult a qualified tax professional for accurate tax advice.{' '}
      <Link to="/contact" className="underline hover:text-amber-900">Book a consultation</Link> for personalised guidance.
    </p>
  </div>
);

// ─── PIT Calculator ───────────────────────────────────────────────────────────
function PITCalculator() {
  const [income, setIncome] = useState('');
  const [frequency, setFrequency] = useState('annual');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const annual = frequency === 'monthly' ? Number(income) * 12 : Number(income);
    setResult(calculatePIT(annual));
  };

  const handleReset = () => { setIncome(''); setResult(null); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">Personal Income Tax (PIT)</h3>
        <p className="text-gray-500 text-sm mb-6">Based on FIRS/NRS graduated tax bands (PITA)</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Income Frequency</label>
            <div className="flex gap-3">
              {['monthly', 'annual'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFrequency(f)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                    frequency === f
                      ? 'border-brand-green bg-brand-green/5 text-brand-green'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {frequency === 'monthly' ? 'Monthly' : 'Annual'} Gross Income (₦)
            </label>
            <input
              type="number"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="input"
              placeholder="e.g. 500000"
              min="0"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleCalculate} className="btn-primary flex-1 justify-center py-3">
              <Calculator size={16} /> Calculate
            </button>
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-500 hover:border-gray-300 transition-all">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        {/* Tax bands info */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Nigerian PIT Tax Bands</p>
          <div className="space-y-1">
            {[
              { range: 'First ₦300,000', rate: '7%' },
              { range: 'Next ₦300,000', rate: '11%' },
              { range: 'Next ₦500,000', rate: '15%' },
              { range: 'Next ₦500,000', rate: '19%' },
              { range: 'Next ₦1,600,000', rate: '21%' },
              { range: 'Above ₦3,200,000', rate: '24%' },
            ].map(({ range, rate }) => (
              <div key={range} className="flex justify-between text-xs text-gray-500">
                <span>{range}</span>
                <span className="font-semibold text-brand-green">{rate}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-2xl border border-brand-green/20 p-6 shadow-sm"
          >
            <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-brand-green" /> Your Tax Estimate
            </h3>

            <ResultRow label="Gross Income (Annual)" value={formatNaira(result.grossIncome)} />
            <ResultRow label="Consolidated Relief Allowance (CRA)" value={`- ${formatNaira(result.cra)}`} />
            <ResultRow label="Taxable Income" value={formatNaira(result.taxableIncome)} />

            <div className="mt-3 mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tax Breakdown</p>
              {result.breakdown.map((b, i) => (
                <ResultRow
                  key={i}
                  label={`₦${(b.amount).toLocaleString()} @ ${b.rate}%`}
                  value={formatNaira(b.tax)}
                  indent
                />
              ))}
            </div>

            <div className="bg-brand-green/5 rounded-xl p-4 mt-2 space-y-2">
              <ResultRow label="Annual Tax Payable" value={formatNaira(result.annualTax)} highlight />
              <ResultRow label="Monthly Tax Payable" value={formatNaira(result.monthlyTax)} highlight />
              <ResultRow label="Effective Tax Rate" value={`${result.effectiveRate.toFixed(2)}%`} highlight />
              <ResultRow label="Annual Net Income" value={formatNaira(result.netAnnual)} />
              <ResultRow label="Monthly Net Income" value={formatNaira(result.netMonthly)} />
            </div>

            <Disclaimer />
          </motion.div>
        ) : (
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 flex flex-col items-center justify-center text-center">
            <Calculator size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-400 font-medium">Enter your income and click Calculate</p>
            <p className="text-gray-300 text-sm mt-1">Your result will appear here</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── PAYE Calculator ──────────────────────────────────────────────────────────
function PAYECalculator() {
  const [form, setForm] = useState({ basic: '', housing: '', transport: '', others: '' });
  const [result, setResult] = useState(null);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleCalculate = () => {
    setResult(calculatePAYE(form.basic, form.housing, form.transport, form.others));
  };
  const handleReset = () => { setForm({ basic: '', housing: '', transport: '', others: '' }); setResult(null); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">PAYE Calculator</h3>
        <p className="text-gray-500 text-sm mb-6">Pay As You Earn — monthly employee payroll tax</p>

        <div className="space-y-4">
          {[
            { name: 'basic', label: 'Basic Salary (Monthly) ₦', placeholder: 'e.g. 200000', required: true },
            { name: 'housing', label: 'Housing Allowance (Monthly) ₦', placeholder: 'e.g. 80000' },
            { name: 'transport', label: 'Transport Allowance (Monthly) ₦', placeholder: 'e.g. 50000' },
            { name: 'others', label: 'Other Allowances (Monthly) ₦', placeholder: 'e.g. 20000' },
          ].map(({ name, label, placeholder, required }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {label} {required && <span className="text-red-400">*</span>}
              </label>
              <input
                name={name}
                type="number"
                value={form[name]}
                onChange={handleChange}
                className="input"
                placeholder={placeholder}
                min="0"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button onClick={handleCalculate} disabled={!form.basic} className="btn-primary flex-1 justify-center py-3 disabled:opacity-50">
              <Calculator size={16} /> Calculate PAYE
            </button>
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-500 hover:border-gray-300 transition-all">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        <div className="mt-5 bg-blue-50 rounded-xl p-4 text-xs text-blue-700 space-y-1">
          <p className="font-semibold mb-1">Deductions included:</p>
          <p>• PAYE tax (based on annual PIT bands)</p>
          <p>• Pension: 8% of (Basic + Housing + Transport)</p>
          <p>• NHF: 2.5% of Basic Salary</p>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-brand-green/20 p-6 shadow-sm"
          >
            <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-brand-green" /> PAYE Estimate
            </h3>

            <ResultRow label="Monthly Gross Income" value={formatNaira(result.monthlyGross)} />
            <ResultRow label="Annual Gross Income" value={formatNaira(result.annualGross)} />

            <div className="mt-3 mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Monthly Deductions</p>
              <ResultRow label="PAYE Tax" value={formatNaira(result.monthlyPAYE)} indent />
              <ResultRow label="Pension (8%)" value={formatNaira(result.monthlyPension)} indent />
              <ResultRow label="NHF (2.5%)" value={formatNaira(result.monthlyNHF)} indent />
            </div>

            <div className="bg-brand-green/5 rounded-xl p-4 mt-2 space-y-2">
              <ResultRow label="Total Monthly Deductions" value={formatNaira(result.totalMonthlyDeductions)} highlight />
              <ResultRow label="Monthly Net Pay" value={formatNaira(result.monthlyNet)} highlight />
              <ResultRow label="Annual PAYE Tax" value={formatNaira(result.annualPAYE)} />
              <ResultRow label="Effective Tax Rate" value={`${result.effectiveRate.toFixed(2)}%`} />
            </div>

            <Disclaimer />
          </motion.div>
        ) : (
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 flex flex-col items-center justify-center text-center">
            <Users size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-400 font-medium">Enter salary details and click Calculate</p>
            <p className="text-gray-300 text-sm mt-1">Your PAYE breakdown will appear here</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── VAT Calculator ───────────────────────────────────────────────────────────
function VATCalculator() {
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState('exclusive');
  const [result, setResult] = useState(null);

  const handleCalculate = () => setResult(calculateVAT(amount, mode));
  const handleReset = () => { setAmount(''); setResult(null); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">VAT Calculator</h3>
        <p className="text-gray-500 text-sm mb-6">Nigerian VAT rate: 7.5% (as per VAIDS Act)</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Calculation Mode</label>
            <div className="flex gap-3">
              {[
                { value: 'exclusive', label: 'Add VAT to amount' },
                { value: 'inclusive', label: 'Extract VAT from amount' },
              ].map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMode(m.value)}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium border-2 transition-all ${
                    mode === m.value
                      ? 'border-brand-green bg-brand-green/5 text-brand-green'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {mode === 'exclusive' ? 'Amount Before VAT (₦)' : 'Amount Including VAT (₦)'}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="input"
              placeholder="e.g. 100000"
              min="0"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={handleCalculate} disabled={!amount} className="btn-primary flex-1 justify-center py-3 disabled:opacity-50">
              <Calculator size={16} /> Calculate VAT
            </button>
            <button onClick={handleReset} className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-gray-200 text-gray-500 hover:border-gray-300 transition-all">
              <RefreshCw size={15} />
            </button>
          </div>
        </div>

        <div className="mt-5 bg-gray-50 rounded-xl p-4 text-xs text-gray-600 space-y-1">
          <p className="font-semibold text-gray-700 mb-1">About Nigerian VAT</p>
          <p>• Standard rate: <strong className="text-brand-green">7.5%</strong></p>
          <p>• Governed by the Value Added Tax Act (as amended)</p>
          <p>• Applicable on most goods and services in Nigeria</p>
          <p>• Registered businesses with ₦25M+ annual turnover must charge VAT</p>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-brand-green/20 p-6 shadow-sm"
          >
            <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-brand-green" /> VAT Breakdown
            </h3>

            <div className="bg-brand-green/5 rounded-xl p-6 space-y-3">
              <ResultRow label="Base Amount (excl. VAT)" value={formatNaira(result.base)} />
              <ResultRow label="VAT Amount (7.5%)" value={formatNaira(result.vat)} highlight />
              <div className="border-t-2 border-brand-green/20 pt-3">
                <ResultRow label="Total Amount (incl. VAT)" value={formatNaira(result.total)} highlight />
              </div>
            </div>

            {/* Visual breakdown */}
            <div className="mt-5">
              <div className="flex rounded-xl overflow-hidden h-8">
                <div
                  className="bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 transition-all"
                  style={{ width: `${(result.base / result.total) * 100}%` }}
                >
                  Base ({((result.base / result.total) * 100).toFixed(1)}%)
                </div>
                <div
                  className="bg-brand-green flex items-center justify-center text-xs font-medium text-white"
                  style={{ width: `${(result.vat / result.total) * 100}%` }}
                >
                  VAT (7.5%)
                </div>
              </div>
            </div>

            <Disclaimer />
          </motion.div>
        ) : (
          <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-10 flex flex-col items-center justify-center text-center">
            <BadgeDollarSign size={40} className="text-gray-300 mb-3" />
            <p className="text-gray-400 font-medium">Enter an amount and click Calculate</p>
            <p className="text-gray-300 text-sm mt-1">Your VAT breakdown will appear here</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TaxCalculator() {
  const [activeTab, setActiveTab] = useState('pit');

  const tabs = [
    { id: 'pit',  label: 'PIT Calculator',  icon: TrendingUp },
    { id: 'paye', label: 'PAYE Calculator', icon: Users },
    { id: 'vat',  label: 'VAT Calculator',  icon: BadgeDollarSign },
  ];

  return (
    <>
      <PageHero
        breadcrumb="Free Tax Tools"
        title="Free Nigerian"
        highlight="Tax Calculators"
        subtitle="Estimate your Personal Income Tax, PAYE deductions, and VAT in seconds — free, no signup required."
      />

      <section className="section bg-white">
        <div className="container-site">

          {/* Tab Selector */}
          <AnimatedSection className="flex flex-wrap gap-3 mb-10">
            {tabs.map(({ id, label, icon }) => (
              <TabBtn
                key={id}
                active={activeTab === id}
                onClick={() => setActiveTab(id)}
                icon={icon}
                label={label}
              />
            ))}
          </AnimatedSection>

          {/* Calculator Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {activeTab === 'pit'  && <PITCalculator />}
              {activeTab === 'paye' && <PAYECalculator />}
              {activeTab === 'vat'  && <VATCalculator />}
            </motion.div>
          </AnimatePresence>

          {/* CTA */}
          <AnimatedSection className="mt-16">
            <div className="bg-black rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 hero-pattern pointer-events-none" />
              <div className="relative z-10">
                <p className="text-brand-green font-medium uppercase tracking-widest text-sm mb-2">Need More Than an Estimate?</p>
                <h2 className="text-white font-heading font-bold text-2xl md:text-3xl mb-3">
                  Get a Personalised Tax Review
                </h2>
                <p className="text-gray-400 max-w-lg mx-auto mb-8">
                  Our calculators give you a good estimate — but every person's tax situation is different.
                  Book a consultation for accurate, personalised tax guidance.
                </p>
                <Link to="/contact" className="btn-primary px-8 py-3 animate-pulse-green">
                  Book a Consultation
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
