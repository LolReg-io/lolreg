import React from 'react';
import { Copy, Check } from 'lucide-react';

const Contribute = () => {
    const [copied, setCopied] = React.useState(false);

    const template = `name: "Name of the Registry Key/Technique"
description: "A brief description of what this key is used for and how it can be abused."
tags:
  - persistence
  - privilege_escalation
  - defense_evasion
mitre_ids:
  - T1547.001
keys:
  - "HKCU\\\\Software\\\\Microsoft\\\\Windows\\\\CurrentVersion\\\\Run"
resources:
  - link: "https://learn.microsoft.com/en-us/windows/win32/setupapi/run-and-runonce-registry-keys"
use_cases:
  - title: "Technique Title"
    description: "Description of the specific malicious use case."
    code: |
      reg add "HKCU\\Software\\..." /v "MaliciousValue" /d "C:\\Path\\To\\Payload.exe" /f`;

    const handleCopy = () => {
        navigator.clipboard.writeText(template);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold text-[var(--text-primary)]">Contribute to LOLReg</h1>
                <p className="text-lg text-[var(--text-secondary)]">
                    LOLReg is a community-driven project. We welcome contributions to expand our registry of "Living Off The Land" techniques.
                </p>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">How to Add a New Key</h2>
                <ol className="list-decimal list-inside space-y-3 text-[var(--text-secondary)] marker:text-[var(--accent-primary)]">
                    <li><strong className="text-[var(--text-primary)]">Fork</strong> the repository on GitHub.</li>
                    <li>Create a new <strong className="text-[var(--text-primary)]">.yml</strong> file in the <code className="bg-[var(--bg-tertiary)] px-1.5 py-0.5 rounded text-sm">src/data/</code> directory.</li>
                    <li>Use the template below to structure your data.</li>
                    <li>Submit a <strong className="text-[var(--text-primary)]">Pull Request</strong>.</li>
                </ol>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">YAML Template</h2>
                    <button
                        onClick={handleCopy}
                        className="flex items-center space-x-2 px-3 py-1.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-color)] transition-all"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy Template'}</span>
                    </button>
                </div>

                <div className="bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)] p-6 overflow-x-auto">
                    <pre className="text-sm font-mono text-gray-300 whitespace-pre">
                        {template}
                    </pre>
                </div>
            </div>
        </div>
    );
};

export default Contribute;
