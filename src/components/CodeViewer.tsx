import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  Download,
  FolderTree,
  FileText,
  FileTerminal,
  ExternalLink
} from 'lucide-react';
import JSZip from 'jszip';
import { ANDROID_FILES } from '../data/androidFiles';
import { AndroidCodeFile } from '../types';

export const CodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidCodeFile>(ANDROID_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Root build files
      zip.file(
        'settings.gradle.kts',
        `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "PotatoDialer"
include(":app")
`
      );

      zip.file(
        'build.gradle.kts',
        `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`
      );

      zip.file(
        'gradle/libs.versions.toml',
        `[versions]
agp = "8.7.2"
kotlin = "2.0.21"
coreKtx = "1.15.0"
lifecycleRuntimeKtx = "2.8.7"
activityCompose = "1.9.3"
composeBom = "2024.11.00"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`
      );

      // Add all project code files
      ANDROID_FILES.forEach(file => {
        zip.file(file.path, file.content);
      });

      // Sample strings.xml
      zip.file(
        'app/src/main/res/values/strings.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Potato Dialer</string>
</resources>`
      );

      // Sample styles.xml
      zip.file(
        'app/src/main/res/values/themes.xml',
        `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.PotatoDialer" parent="android:Theme.Material.Light.NoActionBar" />
    <style name="Theme.PotatoDialer.InCall" parent="android:Theme.Material.NoActionBar">
        <item name="android:windowBackground">@android:color/black</item>
        <item name="android:windowShowWhenLocked">true</item>
        <item name="android:windowTurnScreenOn">true</item>
    </style>
</resources>`
      );

      // Generate zip blob and trigger browser download
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'PotatoDialer-AOSP-Project.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ZIP:', err);
    } finally {
      setIsZipping(false);
    }
  };

  const getLanguageBadgeColor = (lang: string) => {
    switch (lang) {
      case 'kotlin':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'xml':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'gradle':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between p-4 bg-neutral-900 border-b border-neutral-800 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
            <FileCode size={20} />
          </div>
          <div>
            <h2 className="font-bold text-base text-white">Production Android Native Source</h2>
            <p className="text-xs text-neutral-400">AOSP Telecom Subsystem &amp; Compose Implementation</p>
          </div>
        </div>

        {/* Action Buttons: Copy & Download ZIP */}
        <div className="flex items-center gap-2">
          <button
            id="btn-copy-code"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-xs font-semibold text-neutral-200 transition-all border border-neutral-700"
            title="Copy current file code"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            id="btn-download-project-zip"
            onClick={handleDownloadZip}
            disabled={isZipping}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs font-bold text-white transition-all shadow-md disabled:opacity-50"
            title="Download full Android Studio project as ZIP"
          >
            <Download size={14} />
            <span>{isZipping ? 'Bundling...' : 'Download Project ZIP'}</span>
          </button>
        </div>
      </div>

      {/* Main Code View: Left File List + Right Code Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left File Tree Sidebar */}
        <div className="w-64 border-r border-neutral-800 bg-neutral-900/60 p-3 overflow-y-auto space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 py-1 flex items-center gap-1.5">
            <FolderTree size={12} /> Project Files ({ANDROID_FILES.length})
          </div>

          {ANDROID_FILES.map(file => {
            const isSelected = selectedFile.filename === file.filename;
            return (
              <button
                key={file.filename}
                id={`file-tab-${file.filename}`}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left p-2.5 rounded-xl transition-all flex flex-col gap-0.5 ${
                  isSelected
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold truncate">
                    {file.filename}
                  </span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${getLanguageBadgeColor(
                      file.language
                    )}`}
                  >
                    {file.language}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 truncate font-mono">
                  {file.path}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Code Content Pane */}
        <div className="flex-1 flex flex-col overflow-hidden bg-neutral-950">
          {/* File Metadata Bar */}
          <div className="p-3 bg-neutral-900/40 border-b border-neutral-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-mono text-emerald-400 font-semibold truncate">
                {selectedFile.path}
              </span>
            </div>
            <span className="text-[11px] text-neutral-400 italic shrink-0 max-w-md truncate">
              {selectedFile.description}
            </span>
          </div>

          {/* Syntax-formatted Code Text Area */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-neutral-200 leading-relaxed select-text">
            <pre className="whitespace-pre">
              {selectedFile.content.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-white/5">
                  <span className="table-cell pr-4 text-right select-none text-neutral-600 w-10 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="table-cell whitespace-pre">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
