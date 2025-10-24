import { services } from '@/constants/data/servicesData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import * as Icons from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

export const Overview = () => {
  const { t } = useLanguage();
  return (
    <section className="banking-section bg-white">
      <div className="banking-container">
        <div className="text-center mb-12">
          <h2 className="banking-heading mb-4">{t.overview.title}</h2>
          <p className="banking-text max-w-2xl mx-auto">
            {t.overview.subtitle}
          </p>
        </div>

        <div className="space-y-6">
          {services.map((service, index) => {
            const IconComponent = (Icons as any)[service.icon];
            
            return (
              <Card key={index} className="banking-card hover:shadow-banking-lg banking-transition">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-lg bg-banking-blue-100 flex items-center justify-center flex-shrink-0">
                      {IconComponent && <IconComponent className="text-banking-blue-600 text-2xl" />}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl text-banking-gray-900 mb-2">
                        {service.title}
                      </CardTitle>
                      <CardDescription className="text-base text-banking-gray-600">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-banking-gray-700 leading-relaxed">
                    {service.detailedDescription || service.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
