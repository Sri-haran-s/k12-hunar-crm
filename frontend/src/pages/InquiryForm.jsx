import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { InquiryFormCard } from './Home';

export default function InquiryForm() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-24">
        {/* Page header */}
        <div className="text-center mb-8 max-w-lg">
          <span className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-[#2563EB] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            Educational Inquiry Portal
          </span>
          <h1 className="text-3xl font-extrabold text-[#172554] mb-3">
            Submit Your Inquiry
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Tell us about your needs and an expert from K12 Hunar will get back to you
            with personalized guidance within 24 hours.
          </p>
        </div>

        {/* Centered form card */}
        <div className="w-full max-w-xl">
          <InquiryFormCard />
        </div>
      </main>

      <Footer />
    </div>
  );
}
