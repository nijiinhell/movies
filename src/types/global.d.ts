interface SpeechRecognition extends EventTarget {
  lang: string;
  start: () => void;
  stop: () => void;
  interimResults: boolean;
  maxAlternatives: number;
  onaudiostart?: (event: Event) => void;
  onaudioend?: (event: Event) => void;
  onend?: (event: Event) => void;
  onerror?: (event: Event) => void;
  onresult?: (event: SpeechRecognitionEvent) => void;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
  };
}

declare interface Window {
  webkitSpeechRecognition?: {
    new (): SpeechRecognition;
  };
  SpeechRecognition?: {
    new (): SpeechRecognition;
  };
}
