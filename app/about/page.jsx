import Link from "next/link";
import {
  FiUsers,
  FiTarget,
  FiHeart,
  FiTruck,
  FiShield,
  FiAward,
} from "react-icons/fi";

export const metadata = {
  title: "আমাদের সম্পর্কে | ShopBD",
  description:
    "ShopBD — বাংলাদেশের সেরা অনলাইন শপিং প্ল্যাটফর্ম সম্পর্কে জানুন।",
};

const stats = [
  { value: "৫০,০০০+", label: "সন্তুষ্ট কাস্টমার" },
  { value: "১০,০০০+", label: "পণ্য সংগ্রহ" },
  { value: "৬৪", label: "জেলায় ডেলিভারি" },
  { value: "৯৮%", label: "কাস্টমার সন্তুষ্টি" },
];

const values = [
  {
    icon: FiHeart,
    title: "কাস্টমার ফার্স্ট",
    desc: "আমাদের প্রতিটি সিদ্ধান্তের কেন্দ্রে থাকেন আমাদের কাস্টমার। তাদের সন্তুষ্টিই আমাদের সাফল্য।",
  },
  {
    icon: FiShield,
    title: "বিশ্বাসযোগ্যতা",
    desc: "প্রতিটি পণ্যের গুণগত মান নিশ্চিত করা আমাদের প্রধান দায়িত্ব। কোনো আপোষ নেই।",
  },
  {
    icon: FiTruck,
    title: "দ্রুত ডেলিভারি",
    desc: "সারা বাংলাদেশে দ্রুত ও নিরাপদ ডেলিভারি নিশ্চিত করি আমরা।",
  },
  {
    icon: FiAward,
    title: "সেরা মূল্য",
    desc: "সর্বোচ্চ মানের পণ্য সবচেয়ে সাশ্রয়ী মূল্যে পৌঁছে দেওয়াই আমাদের লক্ষ্য।",
  },
];

const team = [
  { name: "Sanaullah", role: "প্রতিষ্ঠাতা ও CEO", },
  { name: "সারা খান", role: "Head of Operations", },
  { name: "তানভীর হোসেন", role: "Head of Technology", },
  { name: "নাদিয়া ইসলাম", role: "Head of Customer Care", },
];

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20">
        <div className="section-container text-center max-w-3xl mx-auto">
          <span className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-white/30">
            🇧🇩 বাংলাদেশের নিজস্ব প্ল্যাটফর্ম
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
            আমাদের সম্পর্কে
          </h1>
          <p className="text-lg text-primary-100 leading-relaxed">
            ShopBD হলো বাংলাদেশের একটি বিশ্বস্ত অনলাইন শপিং প্ল্যাটফর্ম যেখানে
            আপনি পাবেন হাজারো মানসম্পন্ন পণ্য সর্বোত্তম মূল্যে।
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-surface-100">
        <div className="section-container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-black text-primary-600 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-surface-500 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-container py-16 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-4">
              আমাদের গল্প
            </h2>
            <p className="text-surface-600 leading-relaxed mb-4">
              ২০২৩ সালে যাত্রা শুরু করা ShopBD আজ বাংলাদেশের অন্যতম বিশ্বস্ত
              ই-কমার্স প্ল্যাটফর্ম। আমাদের লক্ষ্য ছিল বাংলাদেশের প্রতিটি মানুষের
              কাছে মানসম্পন্ন পণ্য সহজলভ্য করে তোলা।
            </p>
            <p className="text-surface-600 leading-relaxed mb-4">
              আমরা বিশ্বাস করি যে প্রযুক্তির মাধ্যমে কেনাকাটার অভিজ্ঞতাকে
              আনন্দদায়ক করা সম্ভব। তাই আমরা সর্বদা নতুন প্রযুক্তি ও উদ্ভাবনে
              বিনিয়োগ করি।
            </p>
            <p className="text-surface-600 leading-relaxed">
              আমাদের দেশীয় উদ্যোক্তাদের সাথে কাজ করে স্থানীয় অর্থনীতিকে
              শক্তিশালী করাও আমাদের অন্যতম লক্ষ্য।
            </p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center">
            <div className="w-20 h-20 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-black text-3xl">S</span>
            </div>
            <h3 className="text-xl font-bold text-surface-900 mb-2">ShopBD</h3>
            <p className="text-primary-600 font-semibold text-sm mb-4">
              Bangladesh&apos;s Premier Online Store
            </p>
            <p className="text-surface-500 text-sm">
              &quot;আমাদের স্বপ্ন হলো প্রতিটি বাংলাদেশীর দোরগোড়ায় বিশ্বমানের পণ্য
              পৌঁছে দেওয়া।&quot;
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface-50 py-16">
        <div className="section-container">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-2">
              আমাদের মূল্যবোধ
            </h2>
            <p className="text-surface-500">যে নীতিগুলো আমাদের পথ দেখায়</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="card p-5 text-center hover:-translate-y-1 transition-transform duration-200"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-bold text-surface-900 mb-2">{v.title}</h3>
                <p className="text-sm text-surface-500 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-container py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-surface-900 mb-2">
            আমাদের টিম
          </h2>
          <p className="text-surface-500">
            যাদের পরিশ্রমে ShopBD আজ এই অবস্থানে
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-3xl mx-auto">
          {team.map((member) => (
            <div key={member.name} className="card p-5 text-center">
              <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold text-xl">
                  {member?.name[0]}
                </span>
              </div>
              <h3 className="font-bold text-surface-800 text-sm">
                {member.name}
              </h3>
              <p className="text-xs text-surface-500 mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-14">
        <div className="section-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">আজই শুরু করুন</h2>
          <p className="text-primary-100 mb-7 max-w-md mx-auto">
            হাজারো পণ্য থেকে আপনার পছন্দের জিনিস বেছে নিন এবং দ্রুত ডেলিভারি
            উপভোগ করুন।
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-7 py-3 rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
          >
            পণ্য দেখুন →
          </Link>
        </div>
      </section>
    </div>
  );
}
