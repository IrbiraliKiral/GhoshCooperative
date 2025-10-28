import { Link } from 'react-router-dom';
import { FaArrowRight, FaShieldAlt, FaUsers, FaCheckCircle, FaRupeeSign, FaHandHoldingUsd } from 'react-icons/fa';
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
    <section className="banking-gradient-hero text-white">
      <div className="banking-container banking-section">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <div className="flex items-center gap-3 mb-6">
              <FaShieldAlt className="text-4xl" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-banking-blue-100 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/learn-more">
                <Button 
                  size="lg" 
                  className="bg-white text-banking-blue-600 hover:bg-banking-blue-50 shadow-banking-lg w-full sm:w-auto"
                >
                  {t.hero.learnMore}
                  <FaArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/members">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-banking-blue-600 shadow-banking-lg w-full sm:w-auto"
                >
                  {t.hero.viewMembers}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Side - Info Banner */}
          <div className="animate-in fade-in slide-in-from-right duration-700 delay-150">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/20 shadow-banking-xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Quick Overview</h3>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                  <FaUsers className="text-3xl mx-auto mb-2" />
                  <div className="text-2xl font-bold">{totalMembers}</div>
                  <div className="text-sm text-banking-blue-100">Total Members</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center backdrop-blur-sm">
                  <FaRupeeSign className="text-3xl mx-auto mb-2" />
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-banking-blue-100">Monthly Fee</div>
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-3">
                <h4 className="font-semibold text-lg mb-3">Key Features</h4>
                <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                  <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Full Transparency</div>
                    <div className="text-sm text-banking-blue-100">Complete visibility of all operations</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                  <FaHandHoldingUsd className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Flexible Loans</div>
                    <div className="text-sm text-banking-blue-100">Access loans with flexible repayment</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white/5 rounded-lg p-3">
                  <FaCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Community Support</div>
                    <div className="text-sm text-banking-blue-100">Financial assistance when you need it</div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <Button 
                  size="lg"
                  className="w-full bg-white text-banking-blue-600 hover:bg-banking-blue-50 shadow-banking-md"
                  onClick={handleRegister}
                >
                  Register Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
