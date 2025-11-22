# Contributing to LOLReg

Thank you for your interest in contributing to LOLReg! We rely on the community to keep this registry up-to-date with the latest "Living Off The Land" registry keys.

## How to Add a New Key

1.  **Fork** the repository.
2.  Create a new branch for your changes.
3.  Create a new `.yml` file in the `src/data/` directory.
4.  Use the filename as the ID (e.g., `run_keys.yml` -> ID: `run_keys`).

### YAML Template

Please follow this structure for your new file:

```yaml
name: "Name of the Registry Key/Technique"
description: "A brief description of what this key is used for and how it can be abused."
tags:
  - persistence
  - privilege_escalation
  - defense_evasion
  # Add other relevant tags
mitre_ids:
  - T1547.001
  # Add relevant MITRE ATT&CK IDs
keys:
  - "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
  - "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run"
  # List the exact registry paths
resources:
  - link: "https://learn.microsoft.com/en-us/windows/win32/setupapi/run-and-runonce-registry-keys"
  # Add links to documentation or articles
use_cases:
  - title: "Technique Title"
    description: "Description of the specific malicious use case."
    code: |
      reg add "HKCU\Software\..." /v "MaliciousValue" /d "C:\Path\To\Payload.exe" /f
```

## Validation

Before submitting your Pull Request, please ensure:
- The YAML syntax is valid.
- You have included at least one use case with a command example.
- The description is clear and concise.

## Submitting

1.  Push your changes to your fork.
2.  Open a **Pull Request** against the `develop` branch of the main repository.
3.  Describe your changes in the PR description.

Thank you for helping the community!
