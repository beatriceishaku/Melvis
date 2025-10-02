import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Crisis keywords organized by severity
const CRISIS_KEYWORDS = {
  critical: [
    'suicide', 'kill myself', 'end my life', 'want to die', 
    'suicide plan', 'overdose', 'jump off', 'hang myself'
  ],
  high: [
    'self harm', 'cut myself', 'hurt myself', 'hate myself',
    'worthless', 'no reason to live', 'better off dead'
  ],
  medium: [
    'depressed', 'hopeless', 'cant go on', 'give up', 
    'no point', 'lonely', 'isolated', 'desperate'
  ]
};

interface CrisisDetectionResult {
  isCrisis: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  matchedKeywords: string[];
  recommendedAction: string;
}

function detectCrisis(message: string): CrisisDetectionResult {
  const normalizedMessage = message.toLowerCase();
  const matchedKeywords: string[] = [];
  let highestSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';

  // Check for critical keywords
  for (const keyword of CRISIS_KEYWORDS.critical) {
    if (normalizedMessage.includes(keyword)) {
      matchedKeywords.push(keyword);
      highestSeverity = 'critical';
    }
  }

  // Check for high severity keywords
  if (highestSeverity !== 'critical') {
    for (const keyword of CRISIS_KEYWORDS.high) {
      if (normalizedMessage.includes(keyword)) {
        matchedKeywords.push(keyword);
        highestSeverity = 'high';
      }
    }
  }

  // Check for medium severity keywords
  if (highestSeverity === 'low') {
    for (const keyword of CRISIS_KEYWORDS.medium) {
      if (normalizedMessage.includes(keyword)) {
        matchedKeywords.push(keyword);
        highestSeverity = 'medium';
      }
    }
  }

  const isCrisis = matchedKeywords.length > 0;

  const recommendedAction = isCrisis 
    ? highestSeverity === 'critical' 
      ? 'immediate_intervention'
      : highestSeverity === 'high'
      ? 'show_resources_urgently'
      : 'show_resources'
    : 'continue_conversation';

  return {
    isCrisis,
    severity: highestSeverity,
    matchedKeywords,
    recommendedAction
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message, userId, sessionId } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    console.log('Analyzing message for crisis indicators:', message);

    // Detect crisis
    const detection = detectCrisis(message);

    console.log('Crisis detection result:', detection);

    // If crisis detected, log to database
    if (detection.isCrisis) {
      const { error: insertError } = await supabase
        .from('crisis_events')
        .insert({
          user_id: userId || null,
          session_id: sessionId,
          detected_at: new Date().toISOString(),
          trigger_keywords: detection.matchedKeywords,
          message_content: message,
          severity_level: detection.severity,
          action_taken: detection.recommendedAction,
          resolved: false
        });

      if (insertError) {
        console.error('Error logging crisis event:', insertError);
      } else {
        console.log('Crisis event logged successfully');
      }
    }

    return new Response(
      JSON.stringify(detection),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in detect-crisis function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
