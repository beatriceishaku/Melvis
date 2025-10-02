import React, { useState } from 'react';
import { AlertCircle, Shield, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DisclaimerConsentProps {
  onAccept: () => void;
}

export const DisclaimerConsent: React.FC<DisclaimerConsentProps> = ({ onAccept }) => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [crisisSharing, setCrisisSharing] = useState(false);

  const canProceed = acceptedTerms && acceptedDisclaimer;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Card className="max-w-2xl w-full shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-fit">
            <Heart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl">Welcome to Melvis</CardTitle>
          <CardDescription>
            Your AI Mental Health Companion
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <AlertCircle className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-sm ml-2">
              Please read and accept the following before continuing
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            {/* Important Disclaimer */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 rounded-lg border-2 border-orange-200 dark:border-orange-800">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Important Disclaimer
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span><strong>Not a Replacement for Professional Care:</strong> Melvis is an AI assistant designed to provide emotional support and coping strategies. It is NOT a substitute for professional medical advice, diagnosis, or treatment.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span><strong>Emergency Situations:</strong> If you are experiencing a mental health crisis or emergency, please call 988 (Suicide & Crisis Lifeline) or go to your nearest emergency room immediately.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span><strong>Always Consult Professionals:</strong> For any medical or psychological concerns, please consult with a licensed healthcare provider or mental health professional.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-orange-600 font-bold">•</span>
                  <span><strong>Limitations of AI:</strong> While Melvis uses advanced AI technology, it has limitations and may not fully understand complex situations or provide perfect responses.</span>
                </li>
              </ul>
            </div>

            {/* Privacy & Data */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border">
              <h3 className="font-semibold mb-2">Privacy & Your Data</h3>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Your conversations are stored securely and encrypted</li>
                <li>• We will never share your personal information with third parties</li>
                <li>• You can delete your data at any time</li>
                <li>• Crisis events may be logged for safety purposes</li>
              </ul>
            </div>

            {/* Consent Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <label 
                  htmlFor="terms" 
                  className="text-sm cursor-pointer leading-relaxed"
                >
                  I understand that Melvis is an AI assistant and <strong>not a replacement for professional mental health care</strong>. I will seek professional help when needed.
                </label>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Checkbox 
                  id="disclaimer" 
                  checked={acceptedDisclaimer}
                  onCheckedChange={(checked) => setAcceptedDisclaimer(checked as boolean)}
                />
                <label 
                  htmlFor="disclaimer" 
                  className="text-sm cursor-pointer leading-relaxed"
                >
                  I acknowledge that <strong>in case of emergency or crisis</strong>, I will call 988 or seek immediate professional help, and not rely solely on this AI service.
                </label>
              </div>

              <div className="flex items-start gap-3 p-3 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
                <Checkbox 
                  id="crisis" 
                  checked={crisisSharing}
                  onCheckedChange={(checked) => setCrisisSharing(checked as boolean)}
                />
                <label 
                  htmlFor="crisis" 
                  className="text-sm cursor-pointer leading-relaxed"
                >
                  <span className="text-blue-700 dark:text-blue-300">Optional:</span> I consent to having crisis events logged for safety monitoring and potential human intervention if needed.
                </label>
              </div>
            </div>

            <Button 
              className="w-full h-12 text-lg"
              disabled={!canProceed}
              onClick={onAccept}
            >
              I Understand - Continue to Melvis
            </Button>

            <p className="text-xs text-center text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
