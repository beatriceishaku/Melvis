import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface EmergencyResource {
  id: string;
  resource_type: string;
  name: string;
  phone?: string;
  website?: string;
  description: string;
  available_24_7: boolean;
  priority_order: number;
}

export const useEmergencyResources = () => {
  const [resources, setResources] = useState<EmergencyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('emergency_resources')
        .select('*')
        .eq('active', true)
        .order('priority_order', { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (err: any) {
      console.error('Error fetching emergency resources:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { resources, loading, error, refetch: fetchResources };
};
