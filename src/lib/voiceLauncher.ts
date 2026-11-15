/**
 * Security-hardened Voice Wake Launcher generator and deep-link builder.
 *
 * Allows any PurohitJI AI user on Windows (or macOS via Shortcuts/Siri URL)
 * to launch the application directly into voice-ready chat via a wake phrase.
 */

export const DEFAULT_PUBLIC_ORIGIN = "https://astroweb-swart.vercel.app";
export const DEFAULT_WAKE_PHRASE = "Purohitji";

const SAFE_ORIGIN_REGEX = /^https?:\/\/[A-Za-z0-9.\-:]+$/;
const SAFE_WAKE_PHRASE_REGEX = /^[A-Za-z0-9]+(?:[ -][A-Za-z0-9]+)*$/;
const FORBIDDEN_SHELL_CHARS_REGEX = /['"`$;&|<>%\r\n\\]/;

export interface WakePhraseValidation {
  valid: boolean;
  normalized: string;
  error?: string;
}

export interface LaunchDeepLinkOptions {
  origin?: string;
  openChat?: boolean;
  autoVoice?: boolean;
  prompt?: string;
}

export interface WindowsLauncherOptions {
  origin?: string;
  wakePhrase?: string;
  openChat?: boolean;
  autoVoice?: boolean;
  confidenceThreshold?: number;
}

/**
 * Strictly validates and returns only the scheme+host+port origin from a user/browser URL.
 * Rejects non-HTTP(S) schemes (javascript:, file:, data:) and unsafe characters.
 */
export function sanitizeOriginUrl(rawOrigin?: string): string {
  if (!rawOrigin || typeof rawOrigin !== "string") {
    return DEFAULT_PUBLIC_ORIGIN;
  }
  const trimmed = rawOrigin.trim();
  if (!trimmed || FORBIDDEN_SHELL_CHARS_REGEX.test(trimmed)) {
    return DEFAULT_PUBLIC_ORIGIN;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return DEFAULT_PUBLIC_ORIGIN;
    }
    if (!SAFE_ORIGIN_REGEX.test(parsed.origin)) {
      return DEFAULT_PUBLIC_ORIGIN;
    }
    return parsed.origin;
  } catch {
    return DEFAULT_PUBLIC_ORIGIN;
  }
}

/**
 * Validates a spoken wake phrase using an explicit ASCII allowlist so no
 * shell/Batch/PowerShell metacharacters can ever enter generated launcher files.
 */
export function validateWakePhrase(rawPhrase?: string): WakePhraseValidation {
  const input = (rawPhrase ?? "").trim().replace(/\s+/g, " ");
  if (!input) {
    return {
      valid: true,
      normalized: DEFAULT_WAKE_PHRASE,
    };
  }
  if (FORBIDDEN_SHELL_CHARS_REGEX.test(input)) {
    return {
      valid: false,
      normalized: "",
      error: "Wake phrase may only contain English letters, numbers, spaces, and hyphens.",
    };
  }
  if (input.length < 3 || input.length > 40) {
    return {
      valid: false,
      normalized: "",
      error: "Wake phrase must be between 3 and 40 characters long.",
    };
  }
  if (!SAFE_WAKE_PHRASE_REGEX.test(input)) {
    return {
      valid: false,
      normalized: "",
      error: "Wake phrase may only contain letters, numbers, spaces, and hyphens.",
    };
  }
  return {
    valid: true,
    normalized: input,
  };
}

/**
 * Returns a validated wake phrase or throws an explicit error on unsafe input.
 */
export function sanitizeWakePhraseOrThrow(rawPhrase?: string): string {
  const result = validateWakePhrase(rawPhrase);
  if (!result.valid) {
    throw new Error(result.error || "Invalid wake phrase.");
  }
  return result.normalized;
}

/**
 * Builds the deep-link URL that opens PurohitJI AI straight into the chatbot
 * and optionally triggers hands-free speech recognition.
 */
export function buildLaunchDeepLink(options: LaunchDeepLinkOptions = {}): string {
  const safeOrigin = sanitizeOriginUrl(options.origin);
  const url = new URL(safeOrigin);

  if (options.openChat !== false) {
    url.searchParams.set("openChat", "1");
  }
  if (options.autoVoice) {
    url.searchParams.set("voice", "1");
  }
  if (options.prompt && typeof options.prompt === "string") {
    const cleanedPrompt = options.prompt
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 200);
    if (cleanedPrompt) {
      url.searchParams.set("prompt", cleanedPrompt);
    }
  }

  return url.toString();
}

/**
 * Returns the single validated wake word recognized by Windows Speech Engine.
 */
export function buildWakePhrasesList(primaryPhrase?: string): string[] {
  return [sanitizeWakePhraseOrThrow(primaryPhrase)];
}

/**
 * Validates final PowerShell single-quoted string literal safety.
 */
function assertSafePsLiteral(value: string, label: string): string {
  if (/['`\r\n\u0000]/.test(value)) {
    throw new Error(`Unsafe character detected in ${label}.`);
  }
  return value;
}

/**
 * Generates a self-contained Windows .cmd installer + PowerShell system-tray
 * offline voice wake launcher using built-in .NET System.Speech.Recognition.
 *
 * Uses CRLF line endings so Windows cmd.exe parses it reliably across all builds.
 */
export function generateWindowsVoiceLauncherCmd(
  options: WindowsLauncherOptions = {}
): string {
  const primaryPhrase = sanitizeWakePhraseOrThrow(options.wakePhrase);
  const phrases = buildWakePhrasesList(primaryPhrase);
  const launchUrl = buildLaunchDeepLink({
    origin: options.origin,
    openChat: options.openChat !== false,
    autoVoice: Boolean(options.autoVoice),
  });

  const safeLaunchUrl = assertSafePsLiteral(launchUrl, "launchUrl");
  const safePrimaryPhrase = assertSafePsLiteral(primaryPhrase, "wakePhrase");
  const psPhrasesLiteral = phrases
    .map((p) => `'${assertSafePsLiteral(p, "wakePhraseVariant")}'`)
    .join(", ");

  const rawConfidence = Number(options.confidenceThreshold);
  const confidence = Number.isFinite(rawConfidence)
    ? Math.min(0.95, Math.max(0.65, rawConfidence))
    : 0.8;

  // Note: Split the marker string in the batch line so IndexOf finds ONLY the separator line below `exit /b`.
  const batchLines = [
    "@echo off",
    "setlocal",
    'set "APP_DIR=%LOCALAPPDATA%\\PurohitjiAI"',
    'if not exist "%APP_DIR%" mkdir "%APP_DIR%"',
    'set "PUROHITJI_SELF=%~f0"',
    'powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$c = Get-Content -Raw -LiteralPath $env:PUROHITJI_SELF; $m = \'###\' + \'__PUROHITJI_PS_START__###\'; $i = $c.IndexOf($m); if ($i -ge 0) { $ps = $c.Substring($i + $m.Length).TrimStart(); Set-Content -LiteralPath (Join-Path $env:LOCALAPPDATA \'PurohitjiAI\\PurohitjiVoiceLauncher.ps1\') -Value $ps -Encoding UTF8 }"',
    'start "" /min powershell.exe -STA -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File "%APP_DIR%\\PurohitjiVoiceLauncher.ps1"',
    "exit /b 0",
    "###__PUROHITJI_PS_START__###",
  ];

  const psLines = [
    "# PurohitJI AI - Offline Windows Voice Wake Launcher",
    "# Uses built-in Windows .NET System.Speech (no third-party runtimes required).",
    "$ErrorActionPreference = 'Stop'",
    "",
    "Add-Type -AssemblyName System.Windows.Forms",
    "Add-Type -AssemblyName System.Drawing",
    "Add-Type -AssemblyName System.Speech",
    "",
    "[System.Windows.Forms.Application]::EnableVisualStyles()",
    "",
    `$LaunchUrl = '${safeLaunchUrl}'`,
    `$PrimaryWakePhrase = '${safePrimaryPhrase}'`,
    `$WakePhrases = @(${psPhrasesLiteral})`,
    `$MinConfidence = ${confidence.toFixed(2)}`,
    "",
    "# Ensure only one tray listener runs at a time",
    "$createdNew = $false",
    "$mutex = New-Object System.Threading.Mutex($true, 'Local\\PurohitjiAIVoiceLauncherMutex', [ref]$createdNew)",
    "if (-not $createdNew) {",
    "  $nl = [Environment]::NewLine",
    '  $alreadyMsg = "PurohitJI AI Voice Launcher is already running in your Windows System Tray (bottom-right near the clock)." + $nl + $nl + "Say \'$PrimaryWakePhrase\' anytime to open it."',
    "  [System.Windows.Forms.MessageBox]::Show(",
    "    $alreadyMsg,",
    "    'PurohitJI AI Voice Launcher',",
    "    [System.Windows.Forms.MessageBoxButtons]::OK,",
    "    [System.Windows.Forms.MessageBoxIcon]::Information",
    "  ) | Out-Null",
    "  exit 0",
    "}",
    "",
    "# Native C# bridge so SpeechRecognitionEngine runs safely without PowerShell thread-runspace crashes",
    "$csharpWatcher = @'",
    "using System;",
    "using System.Collections.Concurrent;",
    "using System.Globalization;",
    "using System.Speech.Recognition;",
    "",
    "public sealed class PurohitjiSpeechWatcher : IDisposable {",
    "    private SpeechRecognitionEngine _engine;",
    "    private readonly ConcurrentQueue<string> _matches = new ConcurrentQueue<string>();",
    "    private readonly float _minConfidence;",
    "    private volatile bool _paused;",
    "    public string InitError { get; private set; }",
    "    public string ActiveCulture { get; private set; }",
    "",
    "    public PurohitjiSpeechWatcher(string[] phrases, float minConfidence) {",
    "        _minConfidence = minConfidence;",
    "        try {",
    "            var installed = SpeechRecognitionEngine.InstalledRecognizers();",
    "            if (installed.Count == 0) {",
    '                InitError = "No Windows Speech Recognizer pack is installed. Open Windows Settings -> Time & language -> Speech, install English Speech, and restart this launcher.";',
    "                return;",
    "            }",
    "",
    "            RecognizerInfo chosen = null;",
    "            string currentName = CultureInfo.CurrentUICulture.Name;",
    "            foreach (var info in installed) {",
    "                if (info.Culture.Name.Equals(currentName, StringComparison.OrdinalIgnoreCase)) {",
    "                    chosen = info;",
    "                    break;",
    "                }",
    "            }",
    "            if (chosen == null) {",
    "                foreach (var info in installed) {",
    '                    if (info.Culture.TwoLetterISOLanguageName.Equals("en", StringComparison.OrdinalIgnoreCase)) {',
    "                        chosen = info;",
    "                        break;",
    "                    }",
    "                }",
    "            }",
    "            if (chosen == null) {",
    "                chosen = installed[0];",
    "            }",
    "",
    "            ActiveCulture = chosen.Culture.Name;",
    "            _engine = new SpeechRecognitionEngine(chosen);",
    "",
    "            var choices = new Choices();",
    "            foreach (var p in phrases) {",
    "                if (!string.IsNullOrWhiteSpace(p)) {",
    "                    choices.Add(p);",
    "                }",
    "            }",
    "            var gb = new GrammarBuilder();",
    "            gb.Culture = chosen.Culture;",
    "            gb.Append(choices);",
    "",
    "            _engine.LoadGrammar(new Grammar(gb));",
    "            _engine.SpeechRecognized += OnSpeechRecognized;",
    "            _engine.SetInputToDefaultAudioDevice();",
    "            _engine.RecognizeAsync(RecognizeMode.Multiple);",
    "        } catch (Exception ex) {",
    '            InitError = "Could not start microphone listener: " + ex.Message;',
    "        }",
    "    }",
    "",
    "    private void OnSpeechRecognized(object sender, SpeechRecognizedEventArgs e) {",
    "        if (_paused || e == null || e.Result == null) return;",
    "        if (e.Result.Confidence >= _minConfidence) {",
    '            _matches.Enqueue(e.Result.Text + "|" + e.Result.Confidence.ToString("0.00", CultureInfo.InvariantCulture));',
    "        }",
    "    }",
    "",
    "    public bool TryTakeMatch(out string matchInfo) {",
    "        return _matches.TryDequeue(out matchInfo);",
    "    }",
    "",
    "    public bool TogglePause() {",
    "        _paused = !_paused;",
    "        return _paused;",
    "    }",
    "",
    "    public void Dispose() {",
    "        if (_engine != null) {",
    "            try {",
    "                _engine.SpeechRecognized -= OnSpeechRecognized;",
    "                _engine.RecognizeAsyncCancel();",
    "            } catch { }",
    "            _engine.Dispose();",
    "            _engine = null;",
    "        }",
    "    }",
    "}",
    "'@",
    "",
    "if (-not ('PurohitjiSpeechWatcher' -as [type])) {",
    "  $speechAsm = [System.Speech.Recognition.SpeechRecognitionEngine].Assembly.Location",
    "  Add-Type -TypeDefinition $csharpWatcher -ReferencedAssemblies @($speechAsm)",
    "}",
    "",
    "function Open-PurohitjiApp {",
    "  param([string]$TargetUrl)",
    "  $pf86 = [Environment]::GetFolderPath('ProgramFilesX86')",
    "  $pf64 = [Environment]::GetFolderPath('ProgramFiles')",
    "  $candidates = @(",
    "    (Join-Path $pf64 'Google\\Chrome\\Application\\chrome.exe'),",
    "    (Join-Path $pf86 'Google\\Chrome\\Application\\chrome.exe'),",
    "    (Join-Path $env:LocalAppData 'Google\\Chrome\\Application\\chrome.exe'),",
    "    (Join-Path $pf86 'Microsoft\\Edge\\Application\\msedge.exe'),",
    "    (Join-Path $pf64 'Microsoft\\Edge\\Application\\msedge.exe')",
    "  )",
    "  foreach ($browser in $candidates) {",
    "    if ($browser -and (Test-Path -LiteralPath $browser)) {",
    '      Start-Process -FilePath $browser -ArgumentList @("--app=$TargetUrl")',
    "      return",
    "    }",
    "  }",
    "  Start-Process -FilePath $TargetUrl",
    "}",
    "",
    "function Get-StartupShortcutPath {",
    "  $startupDir = [Environment]::GetFolderPath('Startup')",
    "  return (Join-Path $startupDir 'PurohitjiAI-Voice.lnk')",
    "}",
    "",
    "function Test-StartupEnabled {",
    "  return (Test-Path -LiteralPath (Get-StartupShortcutPath))",
    "}",
    "",
    "function Toggle-StartupShortcut {",
    "  $lnkPath = Get-StartupShortcutPath",
    "  if (Test-Path -LiteralPath $lnkPath) {",
    "    Remove-Item -LiteralPath $lnkPath -Force",
    "    return $false",
    "  }",
    "  $scriptPath = Join-Path $env:LOCALAPPDATA 'PurohitjiAI\\PurohitjiVoiceLauncher.ps1'",
    "  $q = [char]34",
    "  $shell = New-Object -ComObject WScript.Shell",
    "  $shortcut = $shell.CreateShortcut($lnkPath)",
    "  $shortcut.TargetPath = 'powershell.exe'",
    '  $shortcut.Arguments = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File " + $q + $scriptPath + $q',
    "  $shortcut.WorkingDirectory = Split-Path -Parent $scriptPath",
    "  $shortcut.Description = 'PurohitJI AI Voice Wake Launcher'",
    "  $shortcut.Save()",
    "  return $true",
    "}",
    "",
    "# Build cosmic gold tray icon procedurally (zero external asset dependency)",
    "$bmp = New-Object System.Drawing.Bitmap 32, 32",
    "$g = [System.Drawing.Graphics]::FromImage($bmp)",
    "$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias",
    "$bgBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(15, 23, 42))",
    "$goldBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(245, 158, 11))",
    "$ringPen = New-Object System.Drawing.Pen ([System.Drawing.Color]::FromArgb(252, 211, 77)), 2.5",
    "$g.FillEllipse($bgBrush, 1, 1, 30, 30)",
    "$g.DrawEllipse($ringPen, 3, 3, 26, 26)",
    "$g.FillEllipse($goldBrush, 10, 10, 12, 12)",
    "$g.Dispose()",
    "$bgBrush.Dispose()",
    "$goldBrush.Dispose()",
    "$ringPen.Dispose()",
    "$trayIconGraphic = [System.Drawing.Icon]::FromHandle($bmp.GetHicon())",
    "",
    "$watcher = New-Object PurohitjiSpeechWatcher -ArgumentList (, [string[]]$WakePhrases), ([float]$MinConfidence)",
    "if (-not [string]::IsNullOrEmpty($watcher.InitError)) {",
    "  [System.Windows.Forms.MessageBox]::Show(",
    "    $watcher.InitError,",
    "    'PurohitJI AI Voice Launcher Setup',",
    "    [System.Windows.Forms.MessageBoxButtons]::OK,",
    "    [System.Windows.Forms.MessageBoxIcon]::Warning",
    "  ) | Out-Null",
    "  $watcher.Dispose()",
    "  $bmp.Dispose()",
    "  $mutex.ReleaseMutex()",
    "  $mutex.Dispose()",
    "  exit 1",
    "}",
    "",
    "$activeTrayText = 'PurohitJI AI Voice (' + $PrimaryWakePhrase + ')'",
    "if ($activeTrayText.Length -gt 63) { $activeTrayText = $activeTrayText.Substring(0, 63) }",
    "",
    "$notifyIcon = New-Object System.Windows.Forms.NotifyIcon",
    "$notifyIcon.Icon = $trayIconGraphic",
    "$notifyIcon.Text = $activeTrayText",
    "$notifyIcon.Visible = $true",
    "",
    "$menu = New-Object System.Windows.Forms.ContextMenuStrip",
    "",
    "$openItem = $menu.Items.Add('Open PurohitJI AI Now')",
    "$openItem.add_Click({ Open-PurohitjiApp -TargetUrl $LaunchUrl })",
    "",
    "$pauseItem = $menu.Items.Add('Listening: ON (Click to Pause)')",
    "$pauseItem.add_Click({",
    "  $isPaused = $watcher.TogglePause()",
    "  if ($isPaused) {",
    "    $pauseItem.Text = 'Listening: PAUSED (Click to Resume)'",
    "    $notifyIcon.Text = 'PurohitJI AI Voice (Paused)'",
    "  } else {",
    "    $pauseItem.Text = 'Listening: ON (Click to Pause)'",
    "    $notifyIcon.Text = $activeTrayText",
    "  }",
    "})",
    "",
    "$startupItem = $menu.Items.Add('Start Automatically with Windows')",
    "$startupItem.CheckOnClick = $false",
    "$startupItem.Checked = (Test-StartupEnabled)",
    "$startupItem.add_Click({",
    "  $enabled = Toggle-StartupShortcut",
    "  $startupItem.Checked = $enabled",
    "  $msg = if ($enabled) { 'Auto-start with Windows enabled.' } else { 'Auto-start with Windows disabled.' }",
    "  $notifyIcon.ShowBalloonTip(2500, 'PurohitJI AI Voice', $msg, [System.Windows.Forms.ToolTipIcon]::Info)",
    "})",
    "",
    "$menu.Items.Add('-') | Out-Null",
    "",
    "$exitItem = $menu.Items.Add('Exit Voice Launcher')",
    "$exitItem.add_Click({",
    "  $script:appTimer.Stop()",
    "  $notifyIcon.Visible = $false",
    "  $notifyIcon.Dispose()",
    "  $watcher.Dispose()",
    "  [System.Windows.Forms.Application]::ExitThread()",
    "})",
    "",
    "$notifyIcon.ContextMenuStrip = $menu",
    "$notifyIcon.add_DoubleClick({ Open-PurohitjiApp -TargetUrl $LaunchUrl })",
    "",
    "$script:lastLaunchAt = [DateTime]::MinValue",
    "$script:appTimer = New-Object System.Windows.Forms.Timer",
    "$script:appTimer.Interval = 150",
    "$script:appTimer.add_Tick({",
    "  $matchInfo = $null",
    "  while ($watcher.TryTakeMatch([ref]$matchInfo)) {",
    "    $now = [DateTime]::UtcNow",
    "    if (($now - $script:lastLaunchAt).TotalSeconds -ge 5) {",
    "      $script:lastLaunchAt = $now",
    "      Open-PurohitjiApp -TargetUrl $LaunchUrl",
    "    }",
    "  }",
    "})",
    "$script:appTimer.Start()",
    "",
    "$notifyIcon.ShowBalloonTip(",
    "  3500,",
    "  'PurohitJI AI Voice Ready',",
    '  "Say \'$PrimaryWakePhrase\' anytime to launch PurohitJI AI.",',
    "  [System.Windows.Forms.ToolTipIcon]::Info",
    ")",
    "",
    "try {",
    "  [System.Windows.Forms.Application]::Run()",
    "} finally {",
    "  $script:appTimer.Stop()",
    "  $notifyIcon.Visible = $false",
    "  $notifyIcon.Dispose()",
    "  $watcher.Dispose()",
    "  $mutex.ReleaseMutex()",
    "  $mutex.Dispose()",
    "}",
  ];

  const combined = [...batchLines, ...psLines].join("\n");
  return combined.replace(/\r?\n/g, "\r\n");
}
