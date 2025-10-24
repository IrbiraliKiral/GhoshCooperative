import { Service } from '@/types';
import * as Icons from 'react-icons/fa';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const IconComponent = (Icons as any)[service.icon];

  return (
    <div className="bg-white rounded-lg p-6 border-2 border-banking-blue-600 transition-colors hover:border-banking-blue-700">
      <div className="w-14 h-14 rounded-lg bg-banking-blue-100 flex items-center justify-center mb-4">
        {IconComponent && <IconComponent className="text-banking-blue-600 text-2xl" />}
      </div>
      <h3 className="font-semibold text-xl text-banking-gray-900 mb-2">
        {service.title}
      </h3>
      <p className="text-banking-gray-600 leading-relaxed">
        {service.description}
      </p>
    </div>
  );
};
