"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  DEFAULT_PUBLIC_ORIGIN,
  DEFAULT_WAKE_PHRASE,
  buildLaunchDeepLink,
  buildWakePhrasesList,
  generateWindowsVoiceLauncherCmd,
  sanitizeOriginUrl,
  validateWakePhrase,
} from "../lib/voiceLauncher";

export interface VoiceLauncherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VoiceTab = "windows-tray" | "windows-access" | "mac-siri";

interface BeforeInstallPromptLike extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function VoiceLauncherModal({ isOpen, onClose }: VoiceLauncherModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<VoiceTab>("windows-tray");
  const [wakePhrase, setWakePhrase] = useState(DEFAULT_WAKE_PHRASE);
  const [openChatOnLaunch, setOpenChatOnLaunch] = useState(true);
  const [autoVoiceOnLaunch, setAutoVoiceOnLaunch] = useState(true);
  const [detectedOrigin, setDetectedOrigin] = useState(DEFAULT_PUBLIC_ORIGIN);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptLike | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      setDetectedOrigin(sanitizeOriginUrl(window.location.origin));
      const existing = (window as unknown as { __purohitjiInstallPrompt?: BeforeInstallPromptLike })
        .__purohitjiInstallPrompt;
      if (existing) setInstallPrompt(existing);

      const handleInstallAvailable = () => {
        const promptEvt = (window as unknown as { __purohitjiInstallPrompt?: BeforeInstallPromptLike })
          .__purohitjiInstallPrompt;
        if (promptEvt) setInstallPrompt(promptEvt);
      };

      const ua = navigator.userAgent.toLowerCase();
      if (ua.includes("mac os") || ua.includes("iphone") || ua.includes("ipad")) {
        setActiveTab("mac-siri");
      }

      window.addEventListener("purohitji-pwa-install-available", handleInstallAvailable);
      return () => {
        window.removeEventListener("purohitji-pwa-install-available", handleInstallAvailable);
      };
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const phraseValidation = useMemo(() => validateWakePhrase(wakePhrase), [wakePhrase]);

  const deepLinkUrl = useMemo(() => {
    return buildLaunchDeepLink({
      origin: detectedOrigin,
      openChat: openChatOnLaunch,
      autoVoice: autoVoiceOnLaunch,
    });
  }, [detectedOrigin, openChatOnLaunch, autoVoiceOnLaunch]);

  const activePhraseVariants = useMemo(() => {
    if (!phraseValidation.valid) return [];
    return buildWakePhrasesList(phraseValidation.normalized);
  }, [phraseValidation]);

  const handleDownloadWindowsLauncher = () => {
    if (!phraseValidation.valid) return;
    try {
      const cmdContent = generateWindowsVoiceLauncherCmd({
        origin: detectedOrigin,
        wakePhrase: phraseValidation.normalized,
        openChat: openChatOnLaunch,
        autoVoice: autoVoiceOnLaunch,
      });
      const blob = new Blob([cmdContent], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Purohitji-AI-Voice-Launcher.cmd";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setDownloadStatus(
        "Downloaded Purohitji-AI-Voice-Launcher.cmd — double-click it to start listening in your Windows System Tray."
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not generate launcher file.";
      setDownloadStatus(`Error: ${message}`);
    }
  };

  const handleCopyDeepLink = async () => {
    try {
      await navigator.clipboard.writeText(deepLinkUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      setCopiedUrl(false);
    }
  };

  const handleInstallPwa = async () => {
    if (!installPrompt) return;
    try {
      await installPrompt.prompt();
      const res = await installPrompt.userChoice;
      if (res.outcome === "accepted") {
        setInstallPrompt(null);
      }
    } catch {
      // Ignore user cancel
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="voice-launcher-title"
        className="relative z-10 glass-panel bg-slate-950 border border-amber-500/40 w-full max-w-2xl rounded-2xl p-4 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] my-auto overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 flex-shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </div>
            <div>
              <h3 id="voice-launcher-title" className="font-bold text-sm sm:text-base text-slate-100">
                Open PurohitJI AI by Voice on Your PC
              </h3>
              <p className="text-[11px] text-slate-400">
                Set up hands-free voice launch on Windows or Mac for anyone using PurohitJI AI
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Voice Setup"
            className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Platform / Method Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("windows-tray")}
            className={`px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
              activeTab === "windows-tray"
                ? "bg-amber-500/15 border-amber-400 text-amber-200 shadow-sm"
                : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <div className="text-xs font-bold">🪟 Custom Wake Phrase</div>
            <div className="text-[10px] opacity-80">Windows 10/11 Tray App</div>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("windows-access")}
            className={`px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
              activeTab === "windows-access"
                ? "bg-amber-500/15 border-amber-400 text-amber-200 shadow-sm"
                : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <div className="text-xs font-bold">🎙️ Win 11 Voice Access</div>
            <div className="text-[10px] opacity-80">Zero Download (Built-in)</div>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mac-siri")}
            className={`px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
              activeTab === "mac-siri"
                ? "bg-amber-500/15 border-amber-400 text-amber-200 shadow-sm"
                : "bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
            }`}
          >
            <div className="text-xs font-bold">🍎 Mac &amp; iPhone Siri</div>
            <div className="text-[10px] opacity-80">Apple Shortcuts Deep Link</div>
          </button>
        </div>

        {/* Shared Launch Customization Bar */}
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={openChatOnLaunch}
                onChange={(e) => setOpenChatOnLaunch(e.target.checked)}
                className="accent-amber-500 rounded cursor-pointer"
              />
              <span>Open AI Astrologer Chat automatically</span>
            </label>
            <label className="flex items-center gap-2 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoVoiceOnLaunch}
                onChange={(e) => setAutoVoiceOnLaunch(e.target.checked)}
                className="accent-amber-500 rounded cursor-pointer"
              />
              <span>Auto-activate mic inside chat</span>
            </label>
          </div>
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5">
            <span className="text-[10px] font-mono text-amber-400 flex-shrink-0">URL:</span>
            <code className="text-[10px] font-mono text-slate-300 truncate flex-1">{deepLinkUrl}</code>
            <button
              type="button"
              onClick={handleCopyDeepLink}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold cursor-pointer flex-shrink-0"
            >
              {copiedUrl ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Tab 1: Windows Custom Wake-Word Launcher */}
        {activeTab === "windows-tray" && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <label htmlFor="wake-phrase-input" className="text-xs font-bold text-slate-200 block">
                Your Spoken Wake Word (English letters/numbers, 3–40 chars)
              </label>
              <input
                id="wake-phrase-input"
                type="text"
                maxLength={40}
                value={wakePhrase}
                onChange={(e) => {
                  setWakePhrase(e.target.value);
                  setDownloadStatus(null);
                }}
                placeholder="Purohitji"
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
              {!phraseValidation.valid && (
                <p className="text-[11px] text-rose-400 font-medium">{phraseValidation.error}</p>
              )}
              {phraseValidation.valid && (
                <p className="text-[10.5px] text-slate-400">
                  Listens only for:{" "}
                  <span className="text-slate-200 font-medium">
                    {activePhraseVariants.map((p) => `"${p}"`).join(", ")}
                  </span>
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleDownloadWindowsLauncher}
              disabled={!phraseValidation.valid}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>⬇️</span>
              <span>Download Windows Voice Launcher (.cmd)</span>
            </button>

            {downloadStatus && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-[11px]">
                {downloadStatus}
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-[11px] text-slate-300">
              <div className="font-bold text-amber-300">How to run on your Windows PC (100% Offline Speech):</div>
              <ol className="list-decimal list-inside space-y-1 text-slate-300">
                <li>
                  Double-click <code className="text-amber-300">Purohitji-AI-Voice-Launcher.cmd</code>. No Python or Node.js required — it uses Windows&apos; built-in Speech engine.
                </li>
                <li>
                  If Windows SmartScreen asks for confirmation (because personal open-source scripts are unsigned), click{" "}
                  <strong className="text-slate-100">More info → Run anyway</strong>. You can right-click → Edit in Notepad first to review every line.
                </li>
                <li>
                  Look for the gold orb in your bottom-right <strong className="text-slate-100">System Tray</strong>. Say{" "}
                  <strong className="text-amber-300">&ldquo;{phraseValidation.normalized || DEFAULT_WAKE_PHRASE}&rdquo;</strong> anytime to open PurohitJI AI!
                </li>
                <li>
                  Right-click the tray icon to toggle <strong className="text-slate-100">Start Automatically with Windows</strong>, Pause listening, or Exit.
                </li>
              </ol>
              <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                Note: Requires a microphone and Windows Speech language pack enabled (Windows Settings → Time &amp; language → Speech).
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Windows 11 Built-In Voice Access */}
        {activeTab === "windows-access" && (
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-100">Step 1: Install PurohitJI AI as a Windows App</h4>
                  <p className="text-[11px] text-slate-400">
                    Gives Windows a native Start Menu entry named &ldquo;PurohitJI AI&rdquo;.
                  </p>
                </div>
                {installPrompt && (
                  <button
                    type="button"
                    onClick={handleInstallPwa}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs cursor-pointer flex-shrink-0"
                  >
                    📲 Install App
                  </button>
                )}
              </div>
              {!installPrompt && (
                <p className="text-[11px] text-amber-300/90">
                  In Edge or Chrome, click the <strong>Install app</strong> icon in the right side of your address bar (or Menu → Apps → Install PurohitJI AI).
                </p>
              )}
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2 text-[11px]">
              <h4 className="font-bold text-amber-300">Step 2: Turn on Windows 11 Voice Access</h4>
              <ol className="list-decimal list-inside space-y-1.5">
                <li>
                  Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-amber-300">Win</kbd> +{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-amber-300">Ctrl</kbd> +{" "}
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-amber-300">S</kbd> (or go to Settings → Accessibility → Speech → Voice access).
                </li>
                <li>
                  Say <strong className="text-amber-300">&ldquo;Open PurohitJI AI&rdquo;</strong> from anywhere in Windows to launch it.
                </li>
                <li>
                  Want to say only <strong className="text-amber-300">&ldquo;Purohitji&rdquo;</strong>? Add a custom Voice Access shortcut in Windows Voice Access Settings that opens the URL copied above.
                </li>
              </ol>
            </div>
          </div>
        )}

        {/* Tab 3: macOS & iPhone Siri Shortcuts */}
        {activeTab === "mac-siri" && (
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 space-y-2.5 text-[11px] text-slate-300">
            <h4 className="font-bold text-xs text-amber-300">Hands-Free Launch with Siri (macOS, iPhone &amp; iPad)</h4>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Click <strong>Copy</strong> next to the Launch URL above.</li>
              <li>
                Open Apple&apos;s built-in <strong className="text-slate-100">Shortcuts</strong> app and click <strong>+</strong> (New Shortcut).
              </li>
              <li>
                Add the <strong className="text-slate-100">Open URLs</strong> action and paste the copied PurohitJI AI link.
              </li>
              <li>
                Rename the shortcut to <strong className="text-amber-300">&ldquo;Purohitji&rdquo;</strong>.
              </li>
              <li>
                Now simply say <strong className="text-amber-300">&ldquo;Hey Siri, Purohitji&rdquo;</strong> on your Mac or iPhone!
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
