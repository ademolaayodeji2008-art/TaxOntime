import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator, ChevronDown, CheckCircle2, RefreshCw,
  BadgeDollarSign, Users, TrendingUp, Info,
} from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';
import PageHero from '../components/ui/PageHero';
import { Link } from 'react-router-dom';

// ─── Nigeria Tax Act 2025 — Effective 1 January 2026 ─────────────────────────
// Source: KPMG Flash Alert 2025-168, PwC Tax Summaries, countrytaxcalc.com
// CRA abolished. First ₦800,000 taxed at 0%. New progressive bands.
// Minimum wage exemption: ₦840,000/year (₦70,000/month) — fully exempt.

const NTA_BANDS = [
  { limit: 800000,    rate: 0.00 }, // 0%   — first ₦800,000
  { limit: 2200000,   rate: 0.15 }, // 15%  — next ₦2.2M  (up to ₦3M)
  { limit: 9000000,   rate: 0.18 }, // 18%  — next ₦9M    (up to ₦12M)
  { limit: 13000000,  rate: 0.21 }, // 21%  — next ₦13M   (up to ₦25M)
  { limit: 25000000,  rate: 0.23 }, // 23%  — next ₦25M   (up to ₦50M)
  { limit: Infinity,  rate: 0.25 }, // 25%  — above ₦50M
];

const MINIMUM_WAGE_ANNUAL = 840000; // ₦70,000/month — exempt from tax
const PENSION_RATE = 0.08;          // 8% employee pension contribution
const NHF_RATE    = 0.025;          // 2.5% of basic salary

const formatNaira = (amount) =>
  new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount);

// ─── PIT Calculator Logic (NTA 2025) ─────────────────────────────────────────
function calculatePIT(annualGross, annualPensionDeduction = 0, rentRelief = 0) {
  const grossIncome = Number(annualGross);
  if (!grossIncome || grossIncome <= 0) return null;

  // Minimum wage exemption
  if (grossIncome <= MINIMUM_WAGE_ANNUAL) {
    return {
      grossIncome,
      pensionDeduction: annualPensionDeduction,
      rentRelief: 0,
      chargeableIncome: 0,
      annualTax: 0,
      monthlyTax: 0,
      netAnnual: grossIncome - annualPensionDeduction,
      netMonthly: (grossIncome - annualPensionDeduction) / 12,
      effectiveRate: 0,
      breakdown: [],
      exempt: true,
    };
  }

  // Rent relief capped at ₦500,000 (20% of declared annual rent, claim-based)
  const cappedRentRelief = Math.min(Number(rentRelief) || 0, 500000);

  // Chargeable income = Gross − Pension − Rent Relief
  const chargeableIncome = Math.max(0, grossIncome - annualPensionDeduction - cappedRentRelief);

  // Apply NTA 2025 tax bands
  let tax = 0;
  let remaining = chargeableIncome;
  const breakdown = [];

  for (const band of NTA_BANDS) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, band.limit);
    const bandTax = taxable * band.rate;
    if (taxable > 0) {
      breakdown.push({ amount: taxable, rate: band.rate * 100, tax: bandTax });
    }
    tax += bandTax;
    remaining -= taxable;
  }

  const effectiveRate = grossIncome > 0 ? (tax / grossIncome) * 100 : 0;
  const netAnnual = grossIncome - annualPensionDeduction - tax;

  return {
    grossIncome,
    pensionDeduction: annualPensionDeduction,
    rentRelief: cappedRentRelief,
    chargeableIncome,
    annualTax: tax,
    monthlyTax: tax / 12,
    netAnnual,
    netMonthly: netAnnual / 12,
    effectiveRate,
    breakdown,
    exempt: false,
  };
}

// ─── PAYE Calculator Logic (NTA 2025) ────────────────────────────────────────
function calculatePAYE(monthlyBasic, housing, transport, otherAllowances) {
  const basic = Number(monthlyBasic) || 0;
  const houseAllowance = Number(housing) || 0;
  const transportAllowance = Number(transport) || 0;
  const others = Number(otherAllowances) || 0;

  const monthlyGross = basic + houseAllowance + transportAllowance + others;
  const annualGross = monthlyGross * 12;

  // Pension: 8% of total monthly emoluments (NTA 2025 — all emoluments, not just basic+housing+transport)
  const monthlyPension = monthlyGross * PENSION_RATE;
  const annualPension = monthlyPension * 12;

  // NHF: 2.5% of basic salary
  const monthlyNHF = basic * NHF_RATE;

  const result = calculatePIT(annualGross, annualPension);
  if (!result) return null;

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
    chargeableIncome: result.chargeableIncome,
    pensionDeduction: result.pensionDeduction,
    exempt: result.exempt,
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
      <strong>Disclaimer:</strong> These calculators are for estimation purposes only, based on the Nigeria Tax Act 2025 (effective 1 January 2026). Results may vary based on individual circumstances, additional reliefs, state-level rules and changes introduced by future Finance Acts.
      Always consult a qualified tax professional for advice specific to your situation.{' '}
      <Link to="/contact" className="underline hover:text-amber-900">Book a consultation</Link> for personalised guidance.
    </p>
  </div>
);

// ─── PIT Calculator ───────────────────────────────────────────────────────────
function PITCalculator() {
  const [income, setIncome] = useState('');
  const [frequency, setFrequency] = useState('annual');
  const [rentRelief, setRentRelief] = useState('');
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    const annual = frequency === 'monthly' ? Number(income) * 12 : Number(income);
    // For standalone PIT (no PAYE), pension is not auto-deducted — user enters gross
    const annualPension = annual * PENSION_RATE;
    setResult(calculatePIT(annual, annualPension, Number(rentRelief) * 12 || 0));
  };

  const handleReset = () => { setIncome(''); setRentRelief(''); setResult(null); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h3 className="font-heading font-bold text-lg text-gray-900 mb-1">Personal Income Tax (PIT)</h3>
        <p className="text-gray-500 text-sm mb-1">Based on the <strong>Nigeria Tax Act 2025</strong> — effective 1 January 2026</p>
        <p className="text-xs text-brand-green font-medium mb-5">✓ CRA abolished · ✓ New progressive bands · ✓ 0% on first ₦800,000</p>

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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Monthly Rent Paid (₦) <span className="text-gray-400 font-normal">— optional, for rent relief</span>
            </label>
            <input
              type="number"
              value={rentRelief}
              onChange={(e) => setRentRelief(e.target.value)}
              className="input"
              placeholder="e.g. 50000 (rent relief = 20%, capped at ₦500k/year)"
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

        {/* NTA 2025 tax bands info */}
        <div className="mt-6 bg-gray-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-gray-700 mb-2">Nigeria Tax Act 2025 — PIT Bands</p>
          <div className="space-y-1">
            {[
              { range: 'First ₦800,000',           rate: '0%',  note: 'Tax-free' },
              { range: 'Next ₦2.2M (up to ₦3M)',   rate: '15%', note: '' },
              { range: 'Next ₦9M (up to ₦12M)',    rate: '18%', note: '' },
              { range: 'Next ₦13M (up to ₦25M)',   rate: '21%', note: '' },
              { range: 'Next ₦25M (up to ₦50M)',   rate: '23%', note: '' },
              { range: 'Above ₦50M',                rate: '25%', note: 'Top rate' },
            ].map(({ range, rate, note }) => (
              <div key={range} className="flex justify-between text-xs text-gray-500">
                <span>{range}</span>
                <span className={`font-semibold ${rate === '0%' ? 'text-green-600' : 'text-brand-green'}`}>
                  {rate} {note && <span className="text-gray-400 font-normal">({note})</span>}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-200">
            CRA abolished from Jan 2026. Pension (8%) deducted before tax is applied.
            Min. wage earners (≤₦840k/year) are fully exempt.
          </p>
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

            {result.exempt ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                <CheckCircle2 size={36} className="text-green-500 mx-auto mb-2" />
                <p className="font-semibold text-green-800">Tax Exempt</p>
                <p className="text-sm text-green-700 mt-1">
                  Income at or below the national minimum wage (₦840,000/year) is fully exempt from Personal Income Tax under the Nigeria Tax Act 2025.
                </p>
              </div>
            ) : (
              <>
                <ResultRow label="Annual Gross Income" value={formatNaira(result.grossIncome)} />
                <ResultRow label="Pension Deduction (8%)" value={`- ${formatNaira(result.pensionDeduction)}`} />
                {result.rentRelief > 0 && (
                  <ResultRow label="Rent Relief (20%, max ₦500k)" value={`- ${formatNaira(result.rentRelief)}`} />
                )}
                <ResultRow label="Chargeable Income" value={formatNaira(result.chargeableIncome)} />

                <div className="mt-3 mb-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Tax Band Breakdown</p>
                  {result.breakdown.filter(b => b.rate > 0).map((b, i) => (
                    <ResultRow
                      key={i}
                      label={`₦${b.amount.toLocaleString()} @ ${b.rate}%`}
                      value={formatNaira(b.tax)}
                      indent
                    />
                  ))}
                  {result.breakdown.find(b => b.rate === 0) && (
                    <ResultRow
                      label={`₦${result.breakdown.find(b => b.rate === 0).amount.toLocaleString()} @ 0% (tax-free band)`}
                      value="₦0.00"
                      indent
                    />
                  )}
                </div>

                <div className="bg-brand-green/5 rounded-xl p-4 mt-2 space-y-2">
                  <ResultRow label="Annual Tax Payable" value={formatNaira(result.annualTax)} highlight />
                  <ResultRow label="Monthly Tax Payable" value={formatNaira(result.monthlyTax)} highlight />
                  <ResultRow label="Effective Tax Rate" value={`${result.effectiveRate.toFixed(2)}%`} highlight />
                  <ResultRow label="Annual Net (after tax & pension)" value={formatNaira(result.netAnnual)} />
                  <ResultRow label="Monthly Net Take-Home" value={formatNaira(result.netMonthly)} />
                </div>
              </>
            )}
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
          <p className="font-semibold mb-1">Deductions included (NTA 2025):</p>
          <p>• PAYE tax (Nigeria Tax Act 2025 bands)</p>
          <p>• Pension: 8% of total gross emoluments</p>
          <p>• NHF: 2.5% of Basic Salary</p>
          <p>• Minimum wage earners (≤₦70k/month) are fully exempt</p>
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
              <ResultRow label="Pension (8% of gross emoluments)" value={formatNaira(result.monthlyPension)} indent />
              <ResultRow label="NHF (2.5% of basic)" value={formatNaira(result.monthlyNHF)} indent />
              <ResultRow label="PAYE Tax" value={formatNaira(result.monthlyPAYE)} indent />
            </div>

            <div className="bg-brand-green/5 rounded-xl p-4 mt-2 space-y-2">
              <ResultRow label="Total Monthly Deductions" value={formatNaira(result.totalMonthlyDeductions)} highlight />
              <ResultRow label="Monthly Net Pay" value={formatNaira(result.monthlyNet)} highlight />
              <ResultRow label="Annual PAYE Tax" value={formatNaira(result.annualPAYE)} />
              <ResultRow label="Chargeable Income (Annual)" value={formatNaira(result.chargeableIncome)} />
              <ResultRow label="Effective Tax Rate on Gross" value={`${result.effectiveRate.toFixed(2)}%`} />
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
        subtitle="Estimate your Personal Income Tax, PAYE deductions, and VAT — updated for the Nigeria Tax Act 2025 (effective January 2026). Free, no signup required."
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
