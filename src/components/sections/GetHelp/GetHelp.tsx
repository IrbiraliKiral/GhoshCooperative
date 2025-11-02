import { ContactForm } from '@/components/forms/ContactForm/ContactForm';
import { FaHeadset, FaEnvelope, FaPhone, FaQuestionCircle } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { appConfig } from '@/config';

export const GetHelp = () => {
  const { t } = useLanguage();
  return (
    <section className="relative banking-section bg-gradient-to-b from-white to-banking-gray-50">
      {/* Decorative accent elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-banking-blue-100 rounded-full opacity-20 -mr-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-banking-blue-50 rounded-full opacity-30 -mb-24 blur-2xl"></div>
      
      <div className="banking-container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 bg-banking-blue-50 rounded-full px-4 py-2 border border-banking-blue-200">
            <FaQuestionCircle className="text-banking-blue-600 text-sm" />
            <span className="text-sm font-semibold text-banking-blue-700">Customer Support</span>
          </div>
          <h2 className="banking-heading mb-4 text-4xl md:text-5xl">{t.getHelp.title}</h2>
          <p className="banking-text max-w-3xl mx-auto text-lg">
            {t.getHelp.subtitle}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info Cards */}
            <div className="space-y-6">
              <div className="animate-in fade-in slide-in-from-left">
                <h3 className="text-2xl font-bold text-banking-gray-900 mb-6">
                  {t.getHelp.contactInfo}
                </h3>
              </div>
              
              {/* Email Card */}
              <div className="group bg-white rounded-2xl p-7 border border-banking-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-left delay-100">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-banking-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-banking-blue-100 to-banking-blue-50 flex items-center justify-center flex-shrink-0 group-hover:from-banking-blue-200 group-hover:to-banking-blue-100 transition-all">
                    <FaEnvelope className="text-banking-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-banking-gray-900">{t.getHelp.email}</p>
                    <a 
                      href={`mailto:${appConfig.contactEmail}`}
                      className="text-banking-blue-600 hover:text-banking-blue-700 text-sm mt-1 font-medium transition-colors"
                    >
                      {appConfig.contactEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone Card */}
              <div className="group bg-white rounded-2xl p-7 border border-banking-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-left delay-200">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-banking-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-banking-blue-100 to-banking-blue-50 flex items-center justify-center flex-shrink-0 group-hover:from-banking-blue-200 group-hover:to-banking-blue-100 transition-all">
                    <FaPhone className="text-banking-blue-600 text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-banking-gray-900">{t.getHelp.phone}</p>
                    <a 
                      href={`tel:${appConfig.contactPhone}`}
                      className="text-banking-blue-600 hover:text-banking-blue-700 text-sm mt-1 font-medium transition-colors"
                    >
                      {appConfig.contactPhone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Support Hours Info */}
              <div className="group bg-gradient-to-br from-banking-blue-50 to-banking-blue-100 rounded-2xl p-7 border border-banking-blue-200 animate-in fade-in slide-in-from-left delay-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-banking-blue-200 flex items-center justify-center flex-shrink-0">
                    <FaHeadset className="text-banking-blue-700 text-lg" />
                  </div>
                  <div>
                    <p className="font-semibold text-banking-gray-900">Available 24/7</p>
                    <p className="text-banking-gray-600 text-sm mt-1">We're here to help you anytime</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-in fade-in slide-in-from-right">
              <div className="bg-white rounded-2xl p-8 border border-banking-gray-200 shadow-lg sticky top-24">
                <h3 className="text-2xl font-bold text-banking-gray-900 mb-6">
                  {t.getHelp.form.title}
                </h3>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
