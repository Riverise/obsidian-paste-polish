# PastePolish for Obsidian

**PastePolish** is a precision tool designed to fix the "spatial bloating" that occurs when pasting content from AI assistants like Gemini, ChatGPT, and Claude. It intelligently compresses redundant blank lines while strictly protecting Markdown's structural integrity.

## 🛠️ The Problem
AI-generated rich text often introduces excessive empty lines during Markdown conversion. 
- **Standard tools** are too aggressive: deleting the line above a table or code block breaks its rendering.
- **Manual editing** is tedious: cleaning up a long AI response takes more time than reading it.

## ✨ Key Features
- **Smart Protection**: Automatically detects and preserves essential "buffer lines" above block elements (Tables, Code Blocks, Callouts, Lists, Math, and Dividers).
- **Gradual Refinement ($x \rightarrow x-1$)**: A unique mode that reduces blank lines one by one, giving you physical control over your document's "breathing room."
- **One-Click Polish**: Aggressively collapse all messy gaps into a clean, single-line spacing.

## 🔍 Technical Implementation
- **Context-Aware Regex Engine**: Instead of simple global replacement, the plugin utilizes a lookahead regex replacer that scans the "upcoming" content before deciding to delete a line.

- **Block-Element Heuristics**: It identifies Markdown block-level syntax (e.g., /^[ \t]*([-=]{3,}|\||[\~]{3,}|>|[-*+][ \t]+|\d+.[ \t]+|$$|#{1,6}[ \t]+)/`) to enforce safety boundaries.

- **State-Based Reduction**: Implements a dynamic newline counter that respects the system's line-ending format (\n vs \r\n) while calculating the mathematical reduction of gaps.

## ⌨️ Shortcut
- **Default**: `Ctrl + Shift + X` (Windows/Linux) or `Cmd + Shift + X` (macOS).
- *Fully customizable in Obsidian Hotkeys settings.*

## ⚙️ Configuration
- **Compression Mode**:
    - **Gradual (Default)**: Reduces consecutive blank lines by one per execution. Perfect for manual fine-tuning.
    - **Aggressive**: Instantly collapses all consecutive blank lines into exactly one.

## 🚀 Installation
1. Create a folder: `.obsidian/plugins/paste-polish`
2. Drop in `main.js`, `manifest.json`, and `data.json`.
3. Enable **PastePolish** in Community Plugins.

## 📄 License
MIT

![PastePolish Before and After Comparison](images/before&after.png)
*Figure: Comparison showing text before and after applying PastePolish. The raw text are copied and pasted from Gemini on web with redundant blank lines due to HTML2Markdown conversion.*