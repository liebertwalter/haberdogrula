import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface VoiceInputProps {
  onResult: (text: string) => void;
}

export function VoiceInput({ onResult }: VoiceInputProps) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSupported(true);
      const recognition = new SpeechRecognition();
      recognition.lang = "tr-TR";
      recognition.continuous = true;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join(" ");
        onResult(transcript);
      };

      recognition.onerror = () => {
        setListening(false);
        toast({ title: "Mikrofon hatası", description: "Ses tanıma başarısız oldu.", variant: "destructive" });
      };

      recognition.onend = () => setListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggle = () => {
    if (!supported) {
      toast({ title: "Desteklenmiyor", description: "Tarayıcınız ses tanımayı desteklemiyor.", variant: "destructive" });
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setListening(true);
    }
  };

  if (!supported) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggle}
      className={`h-10 w-10 rounded-full shrink-0 ${listening ? "bg-danger/10 border-danger/30 text-danger animate-pulse" : ""}`}
      title={listening ? "Dinlemeyi durdur" : "Sesle giriş"}
    >
      {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
}
