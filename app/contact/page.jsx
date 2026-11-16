'use client';
import { useState } from 'react';
import { FiPhone, FiMail, FiMapPin, FiClock, FiSend, FiFacebook, FiInstagram, FiMessageCircle } from 'react-icons/fi';
import { toast } from 'sonner';

const contactInfo = [
  { icon: FiPhone, title: 'ফোন', lines: ['01XXXXXXXXX', '01XXXXXXXXX'], sub: 'সকাল ৯টা — রাত ১০টা' },
  { icon: FiMail, title: 'ইমেইল', lines: ['support@shopbd.com', 'info@shopbd.com'], sub: '২৪ ঘণ্টার মধ্যে উত্তর' },
  { icon: FiMapPin, title: 'ঠিকানা', lines: ['১২৩, মতিঝিল বাণিজ্যিক এলাকা', 'ঢাকা-১০০০, বাংলাদেশ'], sub: 'সোম–শনি, সকাল ১০টা–সন্ধ্যা ৬টা' },
  { icon: FiClock, title: 'সাপোর্ট সময়', lines: ['সোম–শনি: সকাল ৯টা–রাত ১০টা', 'রবিবার: সকাল ১০টা–সন্ধ্যা ৬টা'], sub: 'জরুরি সাপোর্ট ২৪/৭' },
];

const socials = [
  { icon: FiFacebook, label: 'Facebook', href: '#', color: 'bg-blue-600' },
  { icon: FiInstagram, label: 'Instagram', href: '#', color: 'bg-pink-600' },
  { icon: FiMessageCircle, label: 'WhatsApp', href: '#', color: 'bg-green-600' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    toast.success('function not implemented');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-16">
        <div className="section-container text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">যোগাযোগ করুন</h1>
          <p className="text-primary-100 text-lg">
            আমাদের সাথে যোগাযোগ করুন। আমরা সর্বদা আপনাকে সাহায্য করতে প্রস্তুত।
          </p>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="section-container py-14">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {contactInfo.map((info) => (
            <div key={info.title} className="card p-5 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <info.icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-bold text-surface-900 mb-2">{info.title}</h3>
              {info.lines.map((line, i) => (
                <p key={i} className="text-sm text-surface-600">{line}</p>
              ))}
              <p className="text-xs text-surface-400 mt-2">{info.sub}</p>
            </div>
          ))}
        </div>

        {/* Form + Map */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="card p-6">
            <h2 className="text-xl font-bold text-surface-900 mb-5">বার্তা পাঠান</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">নাম *</label>
                  <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input" placeholder="আপনার নাম" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1.5">ফোন *</label>
                  <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="input" placeholder="01XXXXXXXXX" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">ইমেইল</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="input" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">বিষয় *</label>
                <select value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="input" required>
                  <option value="">বিষয় বাছাই করুন</option>
                  <option>অর্ডার সম্পর্কিত</option>
                  <option>পণ্য সম্পর্কিত</option>
                  <option>পেমেন্ট সম্পর্কিত</option>
                  <option>রিটার্ন/রিফান্ড</option>
                  <option>অন্যান্য</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">বার্তা *</label>
                <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="input min-h-[120px] resize-none" placeholder="আপনার বার্তা লিখুন..." required />
              </div>
              <button type="submit" disabled={sending} className="btn-primary w-full py-3 gap-2">
                {sending ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />পাঠানো হচ্ছে...</>
                ) : (
                  <><FiSend className="w-4 h-4" />বার্তা পাঠান</>
                )}
              </button>
            </form>
          </div>

          {/* Social + FAQ */}
          <div className="space-y-5">
            <div className="card p-5">
              <h3 className="font-bold text-surface-900 mb-4">সোশ্যাল মিডিয়া</h3>
              <div className="space-y-3">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} className={`flex items-center gap-3 p-3 rounded-xl text-white ${s.color} hover:opacity-90 transition-opacity`}>
                    <s.icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{s.label} এ ফলো করুন</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-surface-900 mb-4">সাধারণ প্রশ্ন</h3>
              {[
                ['ডেলিভারি কতদিন লাগে?', 'ঢাকায় ১-২ দিন, ঢাকার বাইরে ২-৪ দিন।'],
                ['অর্ডার ক্যান্সেল করা যাবে?', 'Shipped হওয়ার আগে যেকোনো সময় ক্যান্সেল করা যাবে।'],
                ['রিটার্ন পলিসি কী?', 'পণ্য পাওয়ার ৭ দিনের মধ্যে রিটার্ন করা যাবে।'],
              ].map(([q, a]) => (
                <div key={q} className="border-b border-surface-100 pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
                  <p className="text-sm font-semibold text-surface-800 mb-1">{q}</p>
                  <p className="text-xs text-surface-500">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}