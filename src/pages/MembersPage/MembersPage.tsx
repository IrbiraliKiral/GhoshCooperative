import { getStaffMembers, getRegularMembers } from '@/constants/data/memberData';
import { MemberCard } from '@/components/cards/MemberCard/MemberCard';
import { Button } from '@/components/ui/button';
import { FaUserPlus } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { getCurrentMachineSession } from '@/services/sessionService';
import { useToast } from '@/hooks/ui/useToast';

export const MembersPage = () => {
  const staffMembers = getStaffMembers();
  const regularMembers = getRegularMembers();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegisterClick = () => {
    const session = getCurrentMachineSession();
    
    if (session) {
      // User is already logged in/registered
      toast.info(t.alreadyRegistered.message);
    } else {
      // User is not registered, navigate to registration page
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen banking-gradient-section">
      <div className="banking-container py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
          <div>
            <h1 className="banking-heading mb-2">{t.members.allMembers}</h1>
            <p className="banking-text">
              {t.members.allMembersSubtitle}
            </p>
          </div>
          <Button
            size="lg"
            className="bg-banking-blue-600 hover:bg-banking-blue-700 text-white shadow-banking-md"
            onClick={handleRegisterClick}
          >
            <FaUserPlus className="mr-2" />
            {t.members.register}
          </Button>
        </div>

        {/* Staff Members Section */}
        <div className="mb-16">
          <div className="mb-6">
            <h2 className="banking-subheading mb-2">{t.members.bankStaff}</h2>
            <p className="text-banking-gray-600">
              {t.members.dedicatedTeam}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staffMembers.map((member, index) => (
              <MemberCard key={index} member={member} />
            ))}
          </div>
        </div>

        {/* Regular Members Section */}
        <div>
          <div className="mb-6">
            <h2 className="banking-subheading mb-2">{t.members.bankMembers}</h2>
            <p className="text-banking-gray-600">
              {t.members.valuedMembers}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularMembers.map((member, index) => (
              <MemberCard key={index} member={member} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
