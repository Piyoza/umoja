
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Bot,
  Loader2,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  askAstra,
  transcribeAstraAudio,
} from "@/lib/server-fns";
import { useAuth } from "@/lib/AuthContext";
import { ASTRA_LANGUAGES } from "@/lib/user-profile";
import { cn } from "@/lib/utils";

export default function AstraChat({
  mode = "general",
  context = "",
  suggestions = [],
  compact = false,
}) {
  const ask = useServerFn(askAstra);
  const transcribe = useServerFn(transcribeAstraAudio);
  const { profile } = useAuth();

  const language = profile?.preferences?.language || "en";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  const [listening, setListening] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [speechError, setSpeechError] = useState("");

  const endRef = useRef(null);
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  const selectedLanguage =
    ASTRA_LANGUAGES.find((item) => item.code === language) ||
    ASTRA_LANGUAGES[0];

  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, busy, transcribing]);

  useEffect(() => {
    return () => {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current.stop();
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function speak(text, index) {
    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      return;
    }

    const speech = window.speechSynthesis;

    if (speakingIndex === index) {
      speech.cancel();
      setSpeakingIndex(null);
      return;
    }

    speech.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedLanguage.speechLocale;
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = speech.getVoices();

    const matchingVoice =
      voices.find(
        (voice) =>
          voice.lang.toLowerCase() ===
          selectedLanguage.speechLocale.toLowerCase()
      ) ||
      voices.find((voice) =>
        voice.lang.toLowerCase().startsWith(language.toLowerCase())
      );

    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => setSpeakingIndex(index);
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);

    setSpeakingIndex(index);
    speech.speak(utterance);
  }

  async function send(text) {
    const prompt = (text ?? input).trim();

    if (!prompt || busy || transcribing) return;

    setMessages((all) => [
      ...all,
      { role: "user", text: prompt },
    ]);

    setInput("");
    setBusy(true);

    try {
      const res = await ask({
        data: {
          prompt,
          mode,
          context,
          language,
        },
      });

      setMessages((all) => [
        ...all,
        {
          role: "astra",
          text: res.answer || "I have no answer for that yet.",
        },
      ]);
    } catch (error) {
      console.error("ASTRA chat error:", error);

      setMessages((all) => [
        ...all,
        {
          role: "astra",
          text: "I can't reach the instructor channel right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function startRecording() {
    setSpeechError("");

    if (busy || transcribing || listening) return;

    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setSpeechError(
        "Microphone recording is not supported here. Please use Google Chrome on localhost or a secure HTTPS connection."
      );
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      streamRef.current = stream;
      chunksRef.current = [];

      let options = {};

      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        options.mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        options.mimeType = "audio/webm";
      }

      const recorder = new MediaRecorder(stream, options);

      recorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = (event) => {
        console.error("ASTRA recording error:", event.error);
        setSpeechError(
          "There was a problem recording your question. Please try again."
        );
        setListening(false);
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      };

      recorder.onstop = async () => {
        setListening(false);

        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        recorderRef.current = null;

        const mimeType = recorder.mimeType || "audio/webm";

        const audioBlob = new Blob(chunksRef.current, {
          type: mimeType,
        });

        chunksRef.current = [];

        if (!audioBlob.size) {
          setSpeechError(
            "I couldn't hear a recording. Please try again."
          );
          return;
        }

        if (audioBlob.size > 25 * 1024 * 1024) {
          setSpeechError(
            "That recording is too large. Please record a shorter question."
          );
          return;
        }

        setTranscribing(true);
        setSpeechError("");

        try {
          const formData = new FormData();

          const extension = mimeType.includes("mp4")
            ? "mp4"
            : "webm";

          formData.append(
            "audio",
            audioBlob,
            `astra-question.${extension}`
          );

          formData.append("language", language);

          const result = await transcribe({
            data: formData,
          });

          if (result?.error) {
            setSpeechError(result.error);
            return;
          }

          const transcript = result?.text?.trim();

          if (!transcript) {
            setSpeechError(
              "I couldn't understand that recording. Please try again."
            );
            return;
          }

          setInput(transcript);
          await send(transcript);
        } catch (error) {
          console.error("ASTRA transcription error:", error);

          setSpeechError(
            "I couldn't process your recording. Please try again."
          );
        } finally {
          setTranscribing(false);
        }
      };

      recorder.start();
      setListening(true);
    } catch (error) {
      console.error("Could not access ASTRA microphone:", error);

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      if (error.name === "NotAllowedError") {
        setSpeechError(
          "Microphone permission was denied. Please allow microphone access in your browser."
        );
      } else if (error.name === "NotFoundError") {
        setSpeechError(
          "No microphone was detected. Please check your microphone."
        );
      } else {
        setSpeechError(
          "The microphone could not start. Please try again."
        );
      }
    }
  }

  function stopRecording() {
    const recorder = recorderRef.current;

    if (recorder && recorder.state === "recording") {
      recorder.stop();
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        className={cn(
          "min-h-0 flex-1 space-y-3 overflow-y-auto pr-1",
          compact ? "max-h-[320px]" : "max-h-[460px]"
        )}
      >
        {messages.length === 0 && (
          <div className="rounded-xl border border-border/70 bg-background/40 p-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              ASTRA · AI Instructor
            </p>

            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
              Ask about the science behind what you see, or request a hint.
              You can type your question or use the microphone to speak to me.
              Hints guide your reasoning — they won't hand you the answer
              during an active assessment.
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "rounded-xl px-3 py-2 text-xs leading-relaxed",
              message.role === "user"
                ? "ml-6 bg-primary/15 text-foreground"
                : "mr-2 border border-border/60 bg-card/70 text-muted-foreground"
            )}
          >
            {message.role === "astra" && (
              <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                <Bot className="h-3 w-3" />
                ASTRA
              </span>
            )}

            <p className="whitespace-pre-wrap">{message.text}</p>

            {message.role === "astra" && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="mt-1 h-7 px-2 text-[11px]"
                onClick={() => speak(message.text, index)}
                aria-label={
                  speakingIndex === index
                    ? "Stop ASTRA speaking"
                    : "Listen to ASTRA"
                }
              >
                {speakingIndex === index ? (
                  <>
                    <VolumeX className="mr-1 h-3.5 w-3.5" />
                    Stop
                  </>
                ) : (
                  <>
                    <Volume2 className="mr-1 h-3.5 w-3.5" />
                    Listen to ASTRA
                  </>
                )}
              </Button>
            )}
          </div>
        ))}

        {busy && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ASTRA is analysing…
          </p>
        )}

        {transcribing && (
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ASTRA is processing your voice…
          </p>
        )}

        <div ref={endRef} />
      </div>

      {suggestions.length > 0 && messages.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => send(suggestion)}
              disabled={busy || transcribing}
              className="rounded-full border border-border/70 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {listening && (
        <p className="mt-2 flex items-center gap-2 text-xs text-primary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
          Recording... Speak to ASTRA, then press Stop.
        </p>
      )}

      {speechError && (
        <p role="alert" className="mt-2 text-xs text-destructive">
          {speechError}
        </p>
      )}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        className="mt-3 flex items-end gap-2"
      >
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              send();
            }
          }}
          rows={2}
          placeholder={
            listening
              ? "Recording your question..."
              : transcribing
                ? "ASTRA is processing your voice..."
                : "Ask ASTRA a question..."
          }
          disabled={listening || transcribing}
          className="min-h-[52px] resize-none text-xs"
        />

        <Button
          type="button"
          size="icon"
          variant={listening ? "destructive" : "outline"}
          disabled={busy || transcribing}
          onClick={listening ? stopRecording : startRecording}
          className="h-[52px] w-12 shrink-0"
          aria-label={listening ? "Stop recording" : "Record a question"}
          title={listening ? "Stop recording" : "Record a question"}
        >
          {listening ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>

        <Button
          type="submit"
          size="icon"
          disabled={busy || listening || transcribing || !input.trim()}
          className="h-[52px] w-12 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
