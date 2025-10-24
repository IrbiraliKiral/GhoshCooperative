import { useState, useEffect } from 'react';

export const NoticeBanner = () => {
  const [currentLang, setCurrentLang] = useState<'en' | 'bn'>('en');

  // Alternate between English and Bengali every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLang((prev) => (prev === 'en' ? 'bn' : 'en'));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const noticeText = currentLang === 'en'
    ? 'Register now at Ghosh Cooperative Bank! Get 30% off in joining fees! Contact us now.'
    : 'এখনই ঘোষ সমবায় ব্যাংকে নিবন্ধন করুন! যোগদান ফিতে ৩০% ছাড় পান! এখনই আমাদের সাথে যোগাযোগ করুন।';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-banking-blue-600 text-white py-3 z-50 shadow-banking-lg overflow-hidden">
      <div className="animate-scroll whitespace-nowrap">
        <span className="inline-block px-4 text-sm md:text-base font-medium">
          {noticeText}
        </span>
        <span className="inline-block px-4 text-sm md:text-base font-medium">
          {noticeText}
        </span>
        <span className="inline-block px-4 text-sm md:text-base font-medium">
          {noticeText}
        </span>
        <span className="inline-block px-4 text-sm md:text-base font-medium">
          {noticeText}
        </span>
      </div>
    </div>
  );
};
