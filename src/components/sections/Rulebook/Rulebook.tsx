import { rules } from '@/constants/data/rulesData';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FaCheckCircle, FaExclamationCircle, FaBook } from 'react-icons/fa';
import { useLanguage } from '@/contexts/LanguageContext';

export const Rulebook = () => {
  const { t } = useLanguage();
  return (
    <section className="banking-section banking-gradient-section">
      <div className="banking-container">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <FaBook className="text-5xl text-banking-blue-600" />
          </div>
          <h2 className="banking-heading mb-4">{t.rulebook.title}</h2>
          <p className="banking-text max-w-2xl mx-auto">
            {t.rulebook.subtitle}
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          {rules.map((rule, index) => (
            <Alert
              key={index}
              variant={rule.important ? "default" : "default"}
              className={`banking-card ${rule.important ? 'border-banking-blue-600 bg-banking-blue-50' : 'bg-white'}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-banking-blue-600 text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <AlertTitle className="flex items-center gap-2 mb-2">
                    {rule.important ? (
                      <FaExclamationCircle className="text-banking-blue-600" />
                    ) : (
                      <FaCheckCircle className="text-banking-blue-600" />
                    )}
                    <span className="font-semibold text-banking-gray-900">{rule.title}</span>
                  </AlertTitle>
                  <AlertDescription className="text-banking-gray-700 leading-relaxed">
                    {rule.description}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </div>

        <div className="mt-12 max-w-4xl mx-auto">
          <Alert className="banking-card bg-banking-blue-50 border-banking-blue-600">
            <AlertTitle className="flex items-center gap-2">
              <FaExclamationCircle className="text-banking-blue-600" />
              <span>Important Notice</span>
            </AlertTitle>
            <AlertDescription>
              All members must adhere to these rules to maintain their good standing with Ghosh Cooperative Bankings. 
              For any questions or clarifications, please contact our management team.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </section>
  );
};
