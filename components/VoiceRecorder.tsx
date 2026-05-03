"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
  onError: (error: string) => void;
}

type RecordingState = "idle" | "recording" | "processing";

export default function VoiceRecorder({ onTranscript, onError }: VoiceRecorderProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach((t) => t.stop());
        await processAudio(blob);
      };

      mediaRecorder.start(100);
      setState("recording");
      setDuration(0);
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    } catch {
      onError("Microphone access denied. Please allow microphone access.");
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setState("processing");
    }
  };

  const processAudio = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Transcription failed");
      onTranscript(data.transcript as string);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Transcription failed";
      onError(message);
    } finally {
      setState("idle");
      setDuration(0);
    }
  };

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <button
        type="button"
        onClick={state === "recording" ? stopRecording : startRecording}
        disabled={state === "processing"}
        aria-label={state === "recording" ? "Stop recording" : "Start recording"}
        className={`
          relative w-20 h-20 min-h-[44px] min-w-[44px] rounded-lg border-2 flex items-center justify-center
          transition-all duration-200 group
          ${
            state === "recording"
              ? "border-[var(--accent)] bg-[var(--accent-dim)] mic-recording"
              : state === "processing"
                ? "border-[var(--border)] bg-[var(--bg-elevated)] cursor-not-allowed"
                : "border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)] hover:bg-[var(--accent-dim)]"
          }
        `}
      >
        {state === "processing" ? (
          <Loader2 className="w-8 h-8 text-[var(--text-secondary)] animate-spin" />
        ) : state === "recording" ? (
          <Square className="w-7 h-7 text-[var(--accent)] fill-[var(--accent)]" />
        ) : (
          <Mic className="w-8 h-8 text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors" />
        )}
      </button>

      {state === "recording" ? (
        <div className="flex items-center gap-3">
          <div className="flex items-end gap-0.5 h-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="wave-bar w-1 bg-[var(--accent)] rounded-sm origin-bottom"
                style={{ height: "100%" }}
              />
            ))}
          </div>
          <span className="font-mono text-sm text-[var(--accent)]">{formatDuration(duration)}</span>
        </div>
      ) : null}

      <p className="text-sm text-[var(--text-secondary)] text-center">
        {state === "idle" && "Tap to describe the job"}
        {state === "recording" && "Tap to stop recording"}
        {state === "processing" && "Transcribing..."}
      </p>

      {state === "idle" ? (
        <p className="text-xs text-[var(--text-muted)] text-center max-w-xs leading-relaxed">
          Example:{" "}
          <span className="text-[var(--text-secondary)]">
            &quot;Replaced hot water tank at 42 Oak St for John Smith, 2 hours labor at $95 and a
            50-gallon Rheem unit for $480&quot;
          </span>
        </p>
      ) : null}
    </div>
  );
}
