export const metadata = {
  title: 'Privacy Policy | ShopBD',
  description: 'ShopBD এর গোপনীয়তা নীতি।',
};

const sections = [
  {
    title: '১. তথ্য সংগ্রহ',
    content: `আমরা নিম্নলিখিত তথ্য সংগ্রহ করি:
- নাম, ইমেইল ঠিকানা, ফোন নম্বর
- ডেলিভারি ঠিকানা
- অর্ডার ইতিহাস ও পছন্দ
- ডিভাইস ও ব্রাউজার তথ্য (analytics এর জন্য)
- পেমেন্ট তথ্য (এনক্রিপ্টেড আকারে)`,
  },
  {
    title: '২. তথ্য ব্যবহার',
    content: `আপনার তথ্য ব্যবহার করা হয়:
- অর্ডার প্রসেস ও ডেলিভারির জন্য
- কাস্টমার সাপোর্ট প্রদানের জন্য
- নতুন পণ্য ও অফার সম্পর্কে জানাতে (আপনার অনুমতি সাপেক্ষে)
- ওয়েবসাইটের অভিজ্ঞতা উন্নত করতে
- আইনি বাধ্যবাধকতা পূরণে`,
  },
  {
    title: '৩. তথ্য সুরক্ষা',
    content: `আমরা আপনার তথ্য সুরক্ষায় প্রতিশ্রুতিবদ্ধ:
- SSL এনক্রিপশন ব্যবহার করা হয়
- পাসওয়ার্ড bcrypt দিয়ে hash করা থাকে
- নিয়মিত security audit পরিচালনা করা হয়
- তৃতীয় পক্ষের কাছে তথ্য বিক্রি করা হয় না
- শুধুমাত্র প্রয়োজনীয় কর্মীরা তথ্য access করতে পারেন`,
  },
  {
    title: '৪. কুকি পলিসি',
    content: `আমরা কুকি ব্যবহার করি:
- সেশন ম্যানেজমেন্টের জন্য (জরুরি)
- কার্ট তথ্য সংরক্ষণের জন্য
- Analytics ও performance tracking এর জন্য
- আপনার পছন্দ মনে রাখার জন্য
আপনি ব্রাউজার সেটিংসে কুকি বন্ধ করতে পারেন।`,
  },
  {
    title: '৫. তৃতীয় পক্ষ',
    content: `আমরা নির্ভরযোগ্য তৃতীয় পক্ষের সেবা ব্যবহার করি:
- পেমেন্ট প্রসেসিং (SSL Commerz, bKash, Nagad)
- ডেলিভারি (Steadfast, Pathao)
- Analytics (Google Analytics)
- ছবি সংরক্ষণ (Cloudinary)
এই সেবাগুলো তাদের নিজস্ব privacy policy অনুসরণ করে।`,
  },
  {
    title: '৬. আপনার অধিকার',
    content: `আপনার নিম্নলিখিত অধিকার রয়েছে:
- আপনার সম্পর্কে রক্ষিত তথ্য দেখার অধিকার
- তথ্য সংশোধনের অধিকার
- তথ্য মুছে ফেলার অনুরোধের অধিকার
- মার্কেটিং ইমেইল বন্ধ করার অধিকার
- ডেটা পোর্টেবিলিটির অধিকার`,
  },
  {
    title: '৭. যোগাযোগ',
    content: `Privacy সংক্রান্ত যেকোনো প্রশ্নে যোগাযোগ করুন:
ইমেইল: privacy@shopbd.com
ফোন: 01XXXXXXXXX
ঠিকানা: ১২৩, মতিঝিল, ঢাকা-১০০০`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-surface-800 to-surface-900 text-white py-14">
        <div className="section-container text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-3">গোপনীয়তা নীতি</h1>
          <p className="text-surface-300">সর্বশেষ আপডেট: ১ জানুয়ারি, ২০২৫</p>
        </div>
      </section>

      <section className="section-container py-12 max-w-3xl mx-auto">
        <div className="card p-6 mb-6 bg-primary-50 border border-primary-200">
          <p className="text-sm text-primary-800 leading-relaxed">
            <strong>সারসংক্ষেপ:</strong> ShopBD আপনার গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দেয়।
            আমরা আপনার তথ্য সংগ্রহ করি শুধুমাত্র সেবা প্রদানের উদ্দেশ্যে এবং
            কখনো তৃতীয় পক্ষের কাছে বিক্রি করি না।
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="card p-6">
              <h2 className="text-lg font-bold text-surface-900 mb-3">{section.title}</h2>
              <p className="text-surface-600 text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}