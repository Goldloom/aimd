# AIMD License Policy

This document explains how the license files in this repository apply to different materials.

It is intended to remove ambiguity where this repository contains both publicly released specification materials and commercially licensed materials.

## Summary

Apache License 2.0 applies to:

- public AIMD specification history through v1.5
- public AIMD Core v2 specification files explicitly released in this repository under Apache License 2.0
- public documentation files that are explicitly presented as part of the public Core release

Commercial or separately stated terms apply to:

- AIMD extensions not explicitly released under Apache License 2.0
- commercial implementations
- hosted products and services
- enterprise-only workflow, orchestration, or productization materials unless explicitly stated otherwise

If a file or directory is not explicitly identified as part of the Apache-licensed public Core release, do not assume that Apache License 2.0 applies to it.

## Repository-Level Interpretation

The presence of an Apache `LICENSE` file at the repository root does not by itself mean that every file in this repository is released under Apache License 2.0.

This repository contains a mixed licensing structure:

- some materials are publicly released under Apache License 2.0
- some materials are subject to the Commercial License
- some materials may later be released under separate terms

For mixed cases, this policy document and any file-level or directory-level notices control the intended scope.

## Apache-Licensed Public Materials

The following materials are intended to be Apache-licensed public materials unless a file says otherwise:

- public AIMD legacy spec history through v1.5
- public AIMD Core v2 specification documents
- supporting public-facing guides and philosophy documents that are distributed as part of the public Core release

Typical locations may include:

- `spec/en/`
- `spec/ko/`
- selected root documentation files such as `README.md`, `GUIDE.md`, `PHILOSOPHY.md`, `CHANGELOG.md`, and `CONTRIBUTING.md`

This list is descriptive, not automatic. File-specific notices override directory-level assumptions.

## Commercially Licensed Materials

The Commercial License applies to materials such as:

- AIMD extensions not explicitly released under Apache License 2.0
- commercial implementations of AIMD-based systems
- hosted AIMD products and services
- enterprise governance and orchestration layers

See:

- `LICENSE-COMMERCIAL.md`

## Rule of Construction

When interpreting scope:

1. file-level notice wins
2. directory-level notice wins if there is no file-level notice
3. this policy explains repository-wide intent
4. `LICENSE` and `LICENSE-COMMERCIAL.md` define the legal terms for their respective scopes

## No Implied Apache Grant for Commercial Materials

No material should be treated as Apache-licensed merely because it appears in the same repository as Apache-licensed public specification files.

Commercial materials remain commercial unless they are explicitly released under Apache License 2.0.

## Questions

For licensing questions, contact:

- hwehsoo@gmail.com
