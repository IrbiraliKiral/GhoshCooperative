import { Member } from '@/types';
import { Badge } from '@/components/ui/badge';
import { FaUser, FaUserTie } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

interface MemberCardProps {
  member: Member;
}

export const MemberCard = ({ member }: MemberCardProps) => {
  const { t } = useLanguage();
  return (
    <div className="banking-card p-6 hover:shadow-banking-lg banking-transition">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-banking-blue-100 flex items-center justify-center flex-shrink-0">
          {member.isStaff ? (
            <FaUserTie className="text-banking-blue-600 text-xl" />
          ) : (
            <FaUser className="text-banking-blue-600 text-xl" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-banking-gray-900 truncate">
            {member.name}
          </h3>
          <p className="text-sm text-banking-gray-600 mt-1">
            {member.role}
          </p>
        </div>
        {member.isStaff && (
          <Badge variant="default" className="bg-banking-blue-600 hover:bg-banking-blue-700 text-white flex-shrink-0">
            {t.members.staff}
          </Badge>
        )}
      </div>
    </div>
  );
};
