import { Link } from 'react-router-dom';
import { FaArrowRight, FaShieldAlt, FaUsers, FaCheckCircle, FaHandHoldingUsd } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getStaffMembers, getRegularMembers } from '@/constants/data/memberData';
import { useRegistration } from '@/hooks/useRegistration';

export const Hero = () => {
  const { t } = useLanguage();
  const { handleRegister } = useRegistration();
  const staffMembers = getStaffMembers();
  const regularMembers = getRegularMembers();
  const totalMembers = staffMembers.length + regularMembers.length;

  return (
    <section className="relative bg-gradient-to-b from-banking-blue-900 via-banking-blue-800 to-banking-blue-700 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-banking-blue-600 rounded-full opacity-20 -mr-48 -mt-48 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-banking-blue-500 rounded-full opacity-20 -ml-36 -mb-36 blur-3xl"></div>
      
      <div className="banking-container banking-section relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-3 mb-6 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm border border-white/20">
              <FaShieldAlt className="text-2xl" />
              <span className="text-sm font-semibold">Trusted Banking Partner</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>
            
            <p className="text-lg md:text-xl mb-8 text-banking-blue-100 leading-relaxed max-w-xl">
              {t.hero.subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/learn-more">
                <Button 
                  size="lg" 
                  className="bg-white text-banking-blue-700 hover:bg-banking-blue-50 shadow-lg hover:shadow-xl font-semibold px-8 w-full sm:w-auto"
                >
                  {t.hero.learnMore}
                  <FaArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/members">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-banking-blue-700 font-semibold px-8 w-full sm:w-auto backdrop-blur-sm"
                >
                  {t.hero.viewMembers}
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 pt-4 border-t border-white/20">
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-300 text-lg" />
                <span className="text-sm">Licensed & Regulated</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-300 text-lg" />
                <span className="text-sm">Member Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-green-300 text-lg" />
                <span className="text-sm">Transparent Operations</span>
              </div>
            </div>
          </div>

          {/* Right Side - Professional Stats Card */}
          <div className="animate-in fade-in slide-in-from-right duration-700 delay-150">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 lg:p-10 border border-white/20 shadow-2xl">
              <div className="mb-8">
                <div className="inline-block bg-white/10 rounded-2xl p-4 mb-4">
                  <FaUsers className="text-4xl text-banking-blue-200" />
                </div>
                <h3 className="text-3xl font-bold mb-2">Our Impact</h3>
                <p className="text-banking-blue-100">Growing cooperative community</p>
              </div>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-5 mb-8">
                <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all">
                  <div className="text-4xl font-bold mb-2">{totalMembers}</div>
                  <div className="text-sm text-banking-blue-100 font-medium">Active Members</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all">
                  <div className="text-4xl font-bold mb-2">₹12</div>
                  <div className="text-sm text-banking-blue-100 font-medium">Monthly Fee</div>
                </div>
              </div>

              {/* Key Benefits */}
              <div className="space-y-3 mb-8 border-t border-white/10 pt-8">
                <h4 className="font-semibold text-lg mb-4">Key Benefits</h4>
                <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/15 transition-all">
                  <FaCheckCircle className="text-emerald-300 mt-1 flex-shrink-0 text-lg" />
                  <div>
                    <div className="font-semibold text-sm">Full Transparency</div>
                    <div className="text-xs text-banking-blue-100">No hidden fees or charges</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/15 transition-all">
                  <FaHandHoldingUsd className="text-emerald-300 mt-1 flex-shrink-0 text-lg" />
                  <div>
                    <div className="font-semibold text-sm">Flexible Loans</div>
                    <div className="text-xs text-banking-blue-100">Easy access with flexible terms</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/5 rounded-xl p-3 border border-white/5 hover:border-white/15 transition-all">
                  <FaCheckCircle className="text-emerald-300 mt-1 flex-shrink-0 text-lg" />
                  <div>
                    <div className="font-semibold text-sm">Community Support</div>
                    <div className="text-xs text-banking-blue-100">Support when you need it</div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button 
                size="lg"
                className="w-full bg-white text-banking-blue-700 hover:bg-banking-blue-50 shadow-lg font-semibold rounded-xl"
                onClick={handleRegister}
              >
                Join Our Community
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
