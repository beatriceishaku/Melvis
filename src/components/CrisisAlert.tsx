import React from 'react';
import { AlertTriangle, Phone, MessageSquare, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface EmergencyResource {
  id: string;
  resource_type: string;
  name: string;
  phone?: string;
  website?: string;
  description: string;
  available_24_7: boolean;
}

interface CrisisAlertProps {
  severity: 'medium' | 'high' | 'critical';
  resources: EmergencyResource[];
  onClose?: () => void;
}

export const CrisisAlert: React.FC<CrisisAlertProps> = ({ severity, resources, onClose }) => {
  const severityConfig = {
    critical: {
      title: 'Immediate Help Available',
      description: 'If you\'re in immediate danger or having thoughts of self-harm, please reach out for help right now.',
      bgColor: 'bg-red-50 dark:bg-red-950/20',
      borderColor: 'border-red-200 dark:border-red-800',
      icon: <AlertTriangle className="h-6 w-6 text-red-600" />
    },
    high: {
      title: 'Support Resources Available',
      description: 'It sounds like you\'re going through a difficult time. Please know that help is available.',
      bgColor: 'bg-orange-50 dark:bg-orange-950/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      icon: <AlertTriangle className="h-6 w-6 text-orange-600" />
    },
    medium: {
      title: 'We\'re Here to Help',
      description: 'Consider reaching out to these resources for additional support.',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      icon: <AlertTriangle className="h-6 w-6 text-yellow-600" />
    }
  };

  const config = severityConfig[severity];

  return (
    <div className="space-y-4 animate-fade-in">
      <Alert className={`${config.bgColor} ${config.borderColor} border-2`}>
        <div className="flex gap-3">
          {config.icon}
          <div className="flex-1">
            <AlertTitle className="text-lg font-semibold mb-2">{config.title}</AlertTitle>
            <AlertDescription className="text-sm mb-4">
              {config.description}
            </AlertDescription>
            
            {severity === 'critical' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
                <p className="font-semibold text-red-600 dark:text-red-400 mb-2">
                  🚨 In a Crisis? Call 988 Now
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  The 988 Suicide & Crisis Lifeline provides 24/7 free and confidential support.
                </p>
                <Button 
                  className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => window.open('tel:988')}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call 988 Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </Alert>

      <div className="grid gap-3">
        {resources.map((resource) => (
          <Card key={resource.id} className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {resource.resource_type === 'hotline' && <Phone className="h-4 w-4" />}
                {resource.resource_type === 'online_support' && <MessageSquare className="h-4 w-4" />}
                {resource.name}
                {resource.available_24_7 && (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                    24/7
                  </span>
                )}
              </CardTitle>
              <CardDescription className="text-sm">
                {resource.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 flex gap-2">
              {resource.phone && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => window.open(`tel:${resource.phone.replace(/\D/g, '')}`)}
                >
                  <Phone className="mr-2 h-3 w-3" />
                  {resource.phone}
                </Button>
              )}
              {resource.website && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(resource.website, '_blank')}
                >
                  <ExternalLink className="mr-2 h-3 w-3" />
                  Visit Website
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Remember: You're not alone. These services are confidential and here to help.
        </p>
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="mt-2"
          >
            Continue Conversation
          </Button>
        )}
      </div>
    </div>
  );
};
