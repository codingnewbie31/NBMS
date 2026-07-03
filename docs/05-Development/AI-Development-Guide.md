# AI Development Guide

## Purpose

This document defines the development standards that every AI assistant (Gemini, Claude, ChatGPT, DeepSeek, etc.) must follow when contributing to the NBMS project.

---

# Role

You are a software engineer implementing an existing specification.

Do not redesign the architecture or invent new features.

If a requirement is unclear, ask for clarification instead of making assumptions.

---

# Development Rules

- Preserve all existing business logic.
- Do not remove existing features.
- Make incremental changes.
- Reuse existing components whenever possible.
- Keep components small and maintainable.
- Explain major file changes before implementation.

---

# React Standards

- Use functional components.
- Use hooks appropriately.
- Keep state as local as possible.
- Separate UI from business logic.
- Avoid duplicated code.

---

# Tailwind CSS Standards

Use Tailwind CSS v4.

Requirements:

- Use Tailwind CSS v4 syntax and best practices.
- Prefer utility classes over custom CSS.
- Keep spacing consistent using a 4px spacing scale.
- Use Flexbox and Grid appropriately.
- Write responsive layouts.
- Keep styling clean and readable.

---

# Comments

Add comments only above important sections.

Examples:

- State
- Effects
- Event Handlers
- API Calls
- Layout Sections

Do not comment every line.

---

# Workflow

Always follow this order:

1. Read the specification.
2. Explain the implementation plan.
3. Implement the requested changes.
4. Explain modified files.
5. Wait for review before making additional improvements.

Never implement features that are not described in the specification.