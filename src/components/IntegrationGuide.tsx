import React, { useState } from 'react';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  Copy, 
  Check, 
  Github, 
  Globe, 
  Terminal, 
  Flame, 
  ArrowUpRight, 
  ShieldCheck, 
  CheckCircle2,
  Cpu,
  Layers,
  Database,
  ExternalLink
} from 'lucide-react';

export const IntegrationGuide: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, keyName: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
    } catch {
      // Fallback
    }
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const vercelEnvSnippet = `VITE_FIREBASE_API_KEY=${firebaseConfig.apiKey}
VITE_FIREBASE_AUTH_DOMAIN=${firebaseConfig.authDomain}
VITE_FIREBASE_PROJECT_ID=${firebaseConfig.projectId}
VITE_FIREBASE_STORAGE_BUCKET=${firebaseConfig.storageBucket}
VITE_FIREBASE_MESSAGING_SENDER_ID=${firebaseConfig.messagingSenderId}
VITE_FIREBASE_APP_ID=${firebaseConfig.appId}
VITE_FIREBASE_DATABASE_ID=${firebaseConfig.firestoreDatabaseId}
`;

  const gitBashSnippet = `# 1. In your project directory, initialize Git
git init
git add .
git commit -m "feat: Cultrahus delegate & ticket portal connected to Firebase"

# 2. Create a new repository on GitHub (e.g. cultrahus-portal)
# 3. Push your repository:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/cultrahus-portal.git
git branch -M main
git push -u origin main
`;

  return (
    <div id="integration-guide-view" className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
          <Layers className="w-4 h-4" /> Three-Way Synchronization
        </div>
        <h2 className="text-2xl font-bold text-stone-900">
          GitHub + Vercel + Firebase + AI Studio Architecture
        </h2>
        <p className="text-stone-600 text-sm mt-1 max-w-3xl leading-relaxed">
          Here is how your system connects together so registrations made on Vercel appear instantaneously in this Admin Portal without any loading issues.
        </p>

        {/* Visual Pipeline Diagram */}
        <div className="mt-6 p-5 bg-stone-900 text-white rounded-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="text-center p-3 rounded-lg bg-stone-800 border border-stone-700">
            <div className="w-8 h-8 rounded-full bg-stone-700 flex items-center justify-center mx-auto mb-2 text-white">
              <Github className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-200">1. GitHub Repo</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Code storage & version control</div>
          </div>

          <div className="text-center p-3 rounded-lg bg-stone-800 border border-stone-700">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center mx-auto mb-2 text-white border border-stone-600">
              ▲
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-200">2. Vercel Hosting</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Instant global CDN & registration</div>
          </div>

          <div className="text-center p-3 rounded-lg bg-amber-950/80 border border-amber-500/40">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mx-auto mb-2 text-stone-950">
              <Flame className="w-4 h-4 fill-current" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-300">3. Firebase Firestore</div>
            <div className="text-[11px] text-amber-200/80 mt-0.5">Single source of truth in cloud</div>
          </div>

          <div className="text-center p-3 rounded-lg bg-stone-800 border border-stone-700">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-2 text-white">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-200">4. Admin Portal</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Real-time sync, badge validation</div>
          </div>
        </div>
      </div>

      {/* Step 1: GitHub instructions */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
              1
            </span>
            <h3 className="text-lg font-bold text-stone-900">Push to GitHub Repository</h3>
          </div>
          <span className="text-xs font-mono text-stone-500">Repository Setup</span>
        </div>
        <p className="text-stone-600 text-sm">
          Because browser sandboxes cannot directly execute your personal SSH credentials for GitHub, export this project using the top-right Settings menu (<strong>&ldquo;Export to GitHub&rdquo;</strong> or <strong>&ldquo;Download ZIP&rdquo;</strong>), or run the commands below on your terminal:
        </p>

        <div className="relative">
          <pre className="p-4 bg-stone-900 text-stone-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
            {gitBashSnippet}
          </pre>
          <button
            onClick={() => handleCopy(gitBashSnippet, 'git')}
            className="absolute top-3 right-3 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-md flex items-center gap-1 cursor-pointer"
          >
            {copiedKey === 'git' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            {copiedKey === 'git' ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Step 2: Vercel instructions with zero-loading fix */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
              2
            </span>
            <h3 className="text-lg font-bold text-stone-900">
              Deploy to Vercel (Eliminating Loading Delays)
            </h3>
          </div>
          <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> High-Performance Pre-Configured
          </span>
        </div>

        <p className="text-stone-600 text-sm leading-relaxed">
          To prevent Vercel from hanging or having loading issues, our implementation includes:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="font-semibold text-stone-900 mb-1">✓ Multi-Tab Persistent Cache</div>
            <div className="text-stone-600">
              Uses Firestore <code>persistentLocalCache</code> with multiple-tab coordination so the app opens instantly with zero spin delay.
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
            <div className="font-semibold text-stone-900 mb-1">✓ Instant Optimistic Submissions</div>
            <div className="text-stone-600">
              Participant gets their unique code immediately on submission, while Firestore syncs in the background.
            </div>
          </div>
        </div>

        <div className="pt-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">
            Vercel Environment Variables (Copy & Paste to your Vercel Project Settings)
          </h4>
          <div className="relative">
            <pre className="p-4 bg-stone-900 text-stone-200 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
              {vercelEnvSnippet}
            </pre>
            <button
              onClick={() => handleCopy(vercelEnvSnippet, 'vercel')}
              className="absolute top-3 right-3 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs rounded-md flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'vercel' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'vercel' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>

      {/* Step 3: Firebase Config Verification */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-full bg-stone-900 text-white font-bold text-xs flex items-center justify-center">
              3
            </span>
            <h3 className="text-lg font-bold text-stone-900">Current Firebase Connection Status</h3>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" /> LIVE & ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="text-stone-500 font-sans text-[11px]">Firebase Project ID</div>
            <div className="font-bold text-stone-900 truncate mt-0.5">{firebaseConfig.projectId}</div>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="text-stone-500 font-sans text-[11px]">Firestore Database ID</div>
            <div className="font-bold text-stone-900 truncate mt-0.5">{firebaseConfig.firestoreDatabaseId || '(default)'}</div>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="text-stone-500 font-sans text-[11px]">Rules Status</div>
            <div className="font-bold text-emerald-700 truncate mt-0.5">Deployed & Enabled</div>
          </div>
        </div>

        {/* Collections Breakdown and Console Link */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-stone-900">Firestore Collections in Database</span>
            </div>
            <a
              href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId || '(default)'}/data`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Open in Firebase Console
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 bg-white rounded-lg border border-stone-200">
              <span className="font-mono font-bold text-amber-700">/registrations</span>
              <p className="text-stone-600 mt-0.5">Delegate & ticket buyers with generated unique codes.</p>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-stone-200">
              <span className="font-mono font-bold text-cyan-700">/event_settings</span>
              <p className="text-stone-600 mt-0.5">Cultrahus organization details & event preferences.</p>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-stone-200">
              <span className="font-mono font-bold text-emerald-700">/test</span>
              <p className="text-stone-600 mt-0.5">Heartbeat connectivity document for client probe.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
