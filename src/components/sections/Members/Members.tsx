import { Link } from 'react-router-dom';
import { getStaffMembers } from '@/constants/data/memberData';
import { MemberCard } from '@/components/cards/MemberCard/MemberCard';
import { Button } from '@/components/ui/button';
import { FaUsers, FaStar } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

export const Members = () => {
  const staffMembers = getStaffMembers();
  const { t } = useLanguage();

  return (
    <section className="relative banking-section bg-gradient-to-b from-white via-banking-blue-50 to-white">
      {/* Decorative left accent */}
      <div className="absolute left-0 top-1/2 w-1 h-32 bg-gradient-to-b from-transparent via-banking-blue-400 to-transparent opacity-50"></div>
      
      <div className="banking-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 bg-banking-blue-50 rounded-full px-4 py-2 border border-banking-blue-200">
            <FaStar className="text-banking-blue-600 text-sm" />
            <span className="text-sm font-semibold text-banking-blue-700">Leadership Team</span>
          </div>
          <h2 className="banking-heading mb-4 text-4xl md:text-5xl">{t.members.title}</h2>
          <p className="banking-text max-w-3xl mx-auto text-lg">
            {t.members.subtitle}
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {staffMembers.map((member, index) => (
            <div key={index} className="animate-in fade-in" style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: 'both'
            }}>
              <MemberCard member={member} />
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-banking-blue-50 to-banking-blue-100 rounded-3xl p-8 md:p-12 border border-banking-blue-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:flex-1">
              <h3 className="text-2xl md:text-3xl font-bold text-banking-gray-900 mb-2">
                View Our Complete Team
              </h3>
              <p className="text-banking-gray-600">
                Meet all our members and staff who contribute to the cooperative's success
              </p>
            </div>
            <div className="md:flex-shrink-0">
              <Link to="/members">
                <Button 
                  size="lg" 
                  className="bg-banking-blue-600 hover:bg-banking-blue-700 text-white shadow-lg font-semibold rounded-xl whitespace-nowrap"
                >
                  <FaUsers className="mr-2" />
                  {t.members.viewAll}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
