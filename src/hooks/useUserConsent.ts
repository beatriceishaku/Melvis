import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ConsentStatus {
  hasAccepted: boolean;
  loading: boolean;
}

export const useUserConsent = () => {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>({
    hasAccepted: false,
    loading: true
  });

  useEffect(() => {
    checkConsent();
  }, []);

  const checkConsent = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setConsentStatus({ hasAccepted: false, loading: false });
        return;
      }

      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking consent:', error);
      }

      setConsentStatus({
        hasAccepted: data?.accepted_terms && data?.accepted_disclaimer || false,
        loading: false
      });
    } catch (error) {
      console.error('Error in checkConsent:', error);
      setConsentStatus({ hasAccepted: false, loading: false });
    }
  };

  const saveConsent = async (crisisSharing: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('user_consents')
        .upsert({
          user_id: user.id,
          accepted_terms: true,
          accepted_disclaimer: true,
          crisis_sharing_consent: crisisSharing,
          accepted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      setConsentStatus({ hasAccepted: true, loading: false });
      return true;
    } catch (error) {
      console.error('Error saving consent:', error);
      return false;
    }
  };

  return { ...consentStatus, saveConsent, refetch: checkConsent };
};
