import { useState, useRef, useCallback } from 'react';
import { openAIVoice } from '@/services/ai/openAI';

export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Erro ao iniciar gravação:', error);
      throw new Error('Não foi possível acessar o microfone');
    }
  }, []);

  const stopRecording = useCallback((): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!mediaRecorderRef.current) {
        reject(new Error('Gravação não iniciada'));
        return;
      }

      mediaRecorderRef.current.onstop = async () => {
        try {
          setIsRecording(false);
          setIsTranscribing(true);

          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const transcription = await openAIVoice.speechToText(audioBlob);

          // Clean up
          mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());
          
          setIsTranscribing(false);
          resolve(transcription);
        } catch (error) {
          setIsTranscribing(false);
          reject(error);
        }
      };

      mediaRecorderRef.current.stop();
    });
  }, []);

  return {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording
  };
}