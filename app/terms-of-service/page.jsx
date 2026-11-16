export const metadata = {
  title: 'Terms of Service | ShopBD',
  description: 'ShopBD এর সেবার শর্তাবলী।',
};

const sections = [
  { title: '১. সেবা ব্যবহারের শর্ত', content: `ShopBD ব্যবহার করে আপনি নিম্নলিখিত শর্তে সম্মত হচ্ছেন:\n• আপনার বয়স কমপক্ষে ১৮ বছর হতে হবে\n• প্রদত্ত তথ্য সত্য ও সঠিক হতে হবে\n• একটি মাত্র account রাখতে হবে\n• অন্যের account ব্যবহার করা যাবে না\n• যেকোনো অবৈধ কার্যকলাপ নিষিদ্ধ` },
  { title: '২. অর্ডার ও পেমেন্ট', content: `অর্ডার সংক্রান্ত শর্তাবলী:\n• অর্ডার দেওয়ার পর নিশ্চিতকরণ SMS/Email পাবেন\n• Stock শেষ হলে অর্ডার বাতিল হতে পারে\n• COD অর্ডারে পণ্য গ্রহণের সময় পেমেন্ট করতে হবে\n• মিথ্যা অর্ডার দিলে account বন্ধ করা হবে\n• প্রিপেইড অর্ডার বাতিল হলে ৭ কার্যদিবসে রিফান্ড দেওয়া হবে` },
  { title: '৩. ডেলিভারি নীতি', content: `ডেলিভারি সংক্রান্ত তথ্য:\n• ঢাকায় সাধারণত ১-২ কার্যদিবস\n• ঢাকার বাইরে ২-৫ কার্যদিবস\n• ঠিকানা ভুল থাকলে ডেলিভারি ব্যর্থ হতে পারে\n• অনুপস্থিত থাকলে পুনরায় ডেলিভারির চেষ্টা করা হবে\n• প্রাকৃতিক দুর্যোগে ডেলিভারি বিলম্ব হতে পারে` },
  { title: '৪. রিটার্ন ও রিফান্ড', content: `রিটার্ন পলিসি:\n• পণ্য পাওয়ার ৭ দিনের মধ্যে রিটার্ন করা যাবে\n• পণ্য অব্যবহৃত ও মূল প্যাকেজিংয়ে থাকতে হবে\n• ত্রুটিপূর্ণ পণ্যে বিনামূল্যে রিটার্ন গ্রহণযোগ্য\n• রিফান্ড ৭-১০ কার্যদিবসে প্রদান করা হবে\n• কিছু পণ্য রিটার্নযোগ্য নয় (স্বাস্থ্য পণ্য, আন্ডারগার্মেন্ট)` },
  { title: '৫. মেধাস্বত্ব', content: `ShopBD এর সমস্ত কন্টেন্ট সংরক্ষিত:\n• লোগো, ডিজাইন ও ব্র্যান্ড আমাদের সম্পত্তি\n• কন্টেন্ট কপি বা ব্যবহার নিষিদ্ধ\n• পণ্যের ছবি সরবরাহকারীর অনুমতি সাপেক্ষে ব্যবহৃত` },
  { title: '৬. দায়বদ্ধতার সীমা', content: `ShopBD নিম্নলিখিত বিষয়ে দায়বদ্ধ নয়:\n• তৃতীয় পক্ষের কারণে সৃষ্ট ক্ষতি\n• প্রাকৃতিক দুর্যোগজনিত বিলম্ব\n• কাস্টমারের ভুল তথ্যের কারণে ক্ষতি\n• সাময়িক সার্ভিস বিভ্রাট` },
  { title: '৭. পরিবর্তনের অধিকার', content: `ShopBD যেকোনো সময়:\n• শর্তাবলী পরিবর্তন করতে পারে\n• সেবা বন্ধ বা পরিবর্তন করতে পারে\n• মূল্য পরিবর্তন করতে পারে\nগুরুত্বপূর্ণ পরিবর্তনে ইমেইলে জানানো হবে।` },
];

export default function TermsPage() {
  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-surface-800 to-surface-900 text-white py-14">
        <div className="section-container text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-3">সেবার শর্তাবলী</h1>
          <p className="text-surface-300">সর্বশেষ আপডেট: ১ জানুয়ারি, ২০২৫</p>
        </div>
      </section>

      <section className="section-container py-12 max-w-3xl mx-auto">
        <div className="card p-6 mb-6 bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>গুরুত্বপূর্ণ:</strong> ShopBD ব্যবহার করে আপনি এই শর্তাবলীতে সম্মত হচ্ছেন।
            অনুগ্রহ করে মনোযোগ দিয়ে পড়ুন।
          </p>
        </div>
        <div className="space-y-5">
          {sections.map((s) => (
            <div key={s.title} className="card p-6">
              <h2 className="text-lg font-bold text-surface-900 mb-3">{s.title}</h2>
              <p className="text-surface-600 text-sm leading-relaxed whitespace-pre-line">{s.content}</p>
            </div>
          ))}
        </div>
        <div className="card p-5 mt-6 text-center">
          <p className="text-sm text-surface-500">
            প্রশ্ন থাকলে{' '}
            <a href="/contact" className="text-primary-600 font-medium hover:underline">যোগাযোগ করুন</a>
          </p>
        </div>
      </section>
    </div>
  );
}