import { Service } from '@/types';
import * as Icons from 'react-icons/fa';

interface ServiceCardProps {
  service: Service;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const IconComponent = (Icons as any)[service.icon];

  return (
    <div className="group relative h-full bg-white rounded-2xl p-8 border border-banking-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      {/* Decorative top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-banking-blue-600 to-banking-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Icon Container */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-banking-blue-50 to-banking-blue-100 flex items-center justify-center mb-6 group-hover:from-banking-blue-100 group-hover:to-banking-blue-200 transition-all duration-300">
        {IconComponent && <IconComponent className="text-banking-blue-600 text-3xl group-hover:text-banking-blue-700 transition-colors" />}
      </div>
      
      {/* Content */}
      <h3 className="font-semibold text-xl text-banking-gray-900 mb-3 group-hover:text-banking-blue-600 transition-colors">
        {service.title}
      </h3>
      
      <p className="text-banking-gray-600 leading-relaxed mb-4 text-sm">
        {service.description}
      </p>
      
      {/* Read More Link */}
      <div className="flex items-center text-banking-blue-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span>Learn more</span>
        <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
};
