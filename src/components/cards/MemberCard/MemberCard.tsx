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
    <div className="group relative h-full bg-white rounded-2xl p-7 border border-banking-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden hover:-translate-y-1">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-banking-blue-600 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          member.isStaff 
            ? 'bg-gradient-to-br from-banking-blue-500 to-banking-blue-600 group-hover:from-banking-blue-600 group-hover:to-banking-blue-700' 
            : 'bg-gradient-to-br from-banking-blue-400 to-banking-blue-500 group-hover:from-banking-blue-500 group-hover:to-banking-blue-600'
        }`}>
          {member.isStaff ? (
            <FaUserTie className="text-white text-xl" />
          ) : (
            <FaUser className="text-white text-xl" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-banking-gray-900 truncate text-lg group-hover:text-banking-blue-600 transition-colors">
            {member.name}
          </h3>
          <p className="text-sm text-banking-gray-600 mt-1 line-clamp-2">
            {member.role}
          </p>
        </div>
        
        {/* Staff Badge */}
        {member.isStaff && (
          <Badge 
            variant="default" 
            className="bg-gradient-to-r from-banking-blue-600 to-banking-blue-700 hover:from-banking-blue-700 hover:to-banking-blue-800 text-white flex-shrink-0 text-xs font-semibold px-3 py-1 transition-all"
          >
            {t.members.staff}
          </Badge>
        )}
      </div>
    </div>
  );
};
