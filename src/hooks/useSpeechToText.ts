
import { useState, useRef, useCallback } from 'react';
import { pipeline } from '@huggingface/transformers';

interface UseSpeechToTextReturn {
  isRecording: boolean;
  isProcessing: boolean;
  transcript: string;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  clearTranscript: () => void;
}

export const useSpeechToText = (): UseSpeechToTextReturn => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const transcriberRef = useRef<any>(null);

  const initializeTranscriber = useCallback(async () => {
    if (!transcriberRef.current) {
      try {
        console.log('Initializing Whisper model...');
        transcriberRef.current = await pipeline(
          'automatic-speech-recognition',
          'onnx-community/whisper-tiny.en',
          { device: 'webgpu' }
        );
        console.log('Whisper model initialized successfully');
      } catch (error) {
        console.warn('WebGPU not available, falling back to CPU');
        transcriberRef.current = await pipeline(
          'automatic-speech-recognition',
          'onnx-community/whisper-tiny.en'
        );
      }
    }
    return transcriberRef.current;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioChunksRef.current = [];
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const transcriber = await initializeTranscriber();
          
          // Convert blob to array buffer for processing
          const arrayBuffer = await audioBlob.arrayBuffer();
          const result = await transcriber(arrayBuffer);
          
          setTranscript(result.text.trim());
        } catch (error) {
          console.error('Transcription error:', error);
          setTranscript('Error processing speech. Please try again.');
        } finally {
          setIsProcessing(false);
        }
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  }, [initializeTranscriber]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isRecording,
    isProcessing,
    transcript,
    startRecording,
    stopRecording,
    clearTranscript,
  };
};
