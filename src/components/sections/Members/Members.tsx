import { Link } from 'react-router-dom';
import { getStaffMembers } from '@/constants/data/memberData';
import { MemberCard } from '@/components/cards/MemberCard/MemberCard';
import { Button } from '@/components/ui/button';
import { FaUsers } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

export const Members = () => {
  const staffMembers = getStaffMembers();
  const { t } = useLanguage();

  return (
    <section className="banking-section bg-white">
      <div className="banking-container">
        <div className="text-center mb-12">
          <h2 className="banking-heading mb-4">{t.members.title}</h2>
          <p className="banking-text max-w-2xl mx-auto">
            {t.members.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {staffMembers.map((member, index) => (
            <MemberCard key={index} member={member} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/members">
            <Button 
              size="lg" 
              className="bg-banking-blue-600 hover:bg-banking-blue-700 text-white shadow-banking-md"
            >
              <FaUsers className="mr-2" />
              {t.members.viewAll}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
