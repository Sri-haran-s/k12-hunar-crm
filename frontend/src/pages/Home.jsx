import { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  GraduationCap,
  Shield,
  Loader2,
  Check,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitInquiry } from '../services/api';

const INITIAL_FORM = {
  name: '',
  email: '',
  phone: '',
  user_type: '',
  category: '',
  message: '',
};

function validateForm(values) {
  const errors = {};
  if (!values.name.trim() || values.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }
  if (!values.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!values.phone.trim() || !/^[+]?[\d\s\-\(\)]{7,20}$/.test(values.phone)) {
    errors.phone = 'Please enter a valid phone number.';
  }
  if (!values.user_type) {
    errors.user_type = 'Please select a user type.';
  }
  if (!values.category) {
    errors.category = 'Please select an inquiry category.';
  }
  if (!values.message.trim() || values.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }
  return errors;
}

export function InquiryFormCard({ onSuccessOverride } = {}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validateForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitting(true);
    try {
      await submitInquiry(form);
      setSuccess(true);
      setForm(INITIAL_FORM);
      setErrors({});
      if (onSuccessOverride) onSuccessOverride();
    } catch (err) {
      setApiError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputBase =
    'w-full px-3 py-2.5 text-sm border rounded-lg bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-150';
  const inputError = 'border-red-400';
  const inputNormal = 'border-slate-200 hover:border-slate-300';

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#172554]">Submit Your Inquiry</h2>
        <p className="text-sm text-slate-500 mt-1">
          Fill in the details below and we&apos;ll be in touch shortly.
        </p>
      </div>

      {success && (
        <div className="mb-6 flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-green-700">
            Your inquiry has been submitted successfully! We&apos;ll get back to you within 24 hours.
          </p>
        </div>
      )}

      {apiError && (
        <div className="mb-6 flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{apiError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`${inputBase} pl-9 ${errors.name ? inputError : inputNormal}`}
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`${inputBase} pl-9 ${errors.email ? inputError : inputNormal}`}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className={`${inputBase} pl-9 ${errors.phone ? inputError : inputNormal}`}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* User Type + Category row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-1">
              User Type <span className="text-red-500">*</span>
            </label>
            <select
              name="user_type"
              value={form.user_type}
              onChange={handleChange}
              className={`${inputBase} ${errors.user_type ? inputError : inputNormal}`}
            >
              <option value="">Select type...</option>
              <option value="Parent">Parent</option>
              <option value="Student">Student</option>
              <option value="School">School</option>
            </select>
            {errors.user_type && (
              <p className="mt-1 text-xs text-red-500">{errors.user_type}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`${inputBase} ${errors.category ? inputError : inputNormal}`}
            >
              <option value="">Select category...</option>
              <option value="Scholarship">Scholarship</option>
              <option value="Concert">Concert</option>
              <option value="Admission">Admission</option>
              <option value="General Query">General Query</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1">
            Message / Query <span className="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            rows={4}
            maxLength={2000}
            placeholder="Describe your inquiry in detail..."
            className={`${inputBase} resize-none ${errors.message ? inputError : inputNormal}`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message ? (
              <p className="text-xs text-red-500">{errors.message}</p>
            ) : (
              <span />
            )}
            <span className="text-xs text-slate-400 ml-auto">
              {form.message.length}/2000
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full flex items-center justify-center gap-2 bg-[#2563EB] hover:bg-[#1d4ed8] text-white text-sm font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Send Inquiry
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

const features = [
  {
    icon: Clock,
    title: 'Quick Response',
    description: 'Our team responds to all inquiries within 24 hours on business days.',
  },
  {
    icon: GraduationCap,
    title: 'Expert Guidance',
    description:
      'Get personalized advice from education specialists who understand your needs.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description:
      'Your information is protected and never shared with third parties.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Fill the Form',
    description: 'Provide your details and describe your inquiry clearly.',
  },
  {
    number: '02',
    title: 'Expert Review',
    description: 'Our education specialists review your submission and prepare a response.',
  },
  {
    number: '03',
    title: 'Get Connected',
    description: 'Receive personalized guidance tailored to your needs within 24 hours.',
  },
];

const stats = [
  { value: '500+', label: 'Students Helped' },
  { value: '4 Categories', label: 'of Inquiry' },
  { value: '24hr', label: 'Response Time' },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="flex flex-col gap-6">
              <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
                <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
                Educational Inquiry Portal
              </span>

              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#172554] leading-tight">
                  Connect with K12 Hunar&apos;s
                </h1>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2563EB] leading-tight">
                  Learning Experts
                </h1>
              </div>

              <p className="text-base text-slate-500 leading-relaxed max-w-lg">
                Submit your inquiry and our team will get back to you with personalized
                guidance on admissions, scholarships, and educational opportunities.
              </p>

              <div className="flex flex-wrap gap-3">
                <span className="flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  <Check className="w-3.5 h-3.5" />
                  Quick Response
                </span>
                <span className="flex items-center gap-1.5 bg-green-50 border border-green-100 text-green-700 text-sm font-medium px-3 py-1.5 rounded-full">
                  <Check className="w-3.5 h-3.5" />
                  Expert Guidance
                </span>
              </div>

              {/* Stats mini-bar */}
              <div className="flex gap-8 pt-4 border-t border-slate-200 mt-2">
                {stats.map((s) => (
                  <div key={s.label}>
                    <p className="text-xl font-bold text-[#172554]">{s.value}</p>
                    <p className="text-xs text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div className="w-full max-w-lg mx-auto lg:mx-0">
              <InquiryFormCard />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172554] mb-3">
              Why Choose EduConnect?
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              We make it easy for students, parents, and schools to connect with the right
              educational guidance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl border border-slate-100 bg-[#F8FAFC] hover:shadow-md transition-shadow duration-200"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#2563EB]" />
                </div>
                <h3 className="text-base font-semibold text-[#172554]">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#172554] mb-3">
              How It Works
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Get the guidance you need in three simple steps.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => (
              <div key={step.number} className="flex flex-col items-center text-center gap-3 relative">
                <div className="w-14 h-14 rounded-full bg-[#172554] text-white flex items-center justify-center font-bold text-lg shadow-lg">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[calc(50%+36px)] right-[calc(-50%+36px)] h-0.5 bg-slate-200" />
                )}
                <h3 className="text-base font-semibold text-[#172554] mt-2">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#172554]">
        <div className="max-w-3xl mx-auto text-center flex flex-col gap-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Ready to take the next step?
          </h2>
          <p className="text-blue-200 text-sm">
            Submit your inquiry today and connect with an expert who can help you navigate
            your educational journey.
          </p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 bg-white text-[#172554] font-semibold text-sm px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors mx-auto shadow"
          >
            Submit an Inquiry
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
