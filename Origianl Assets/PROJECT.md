# Squares — Project Overview

## Project Name
Squares

## Summary

Squares is a minimalist logic puzzle web application where players partition a square grid into rectangles based on clue numbers. Each clue defines the exact area of a rectangle that must include that clue cell. The objective is to fill the board completely using valid rectangles with no overlaps or gaps.

This project is a weekend MVP designed to test agentic development workflows using Codex via the get-shit-done system.

## Goals

Primary goals:

- Build a complete playable puzzle game
- Validate Codex-based implementation workflow
- Ship a polished frontend-only experience
- Support desktop and mobile interaction
- Implement deterministic puzzle validation logic

Secondary goals:

- Maintain clean separation between logic and UI
- Use structured JSON puzzle definitions
- Support persistent completion tracking
- Prepare architecture for future generator expansion

## Target Platform

Primary:

- Web browser (desktop + mobile responsive)

Out of scope:

- Native mobile builds
- Backend services
- Authentication
- Multiplayer
- Monetization

## Core Gameplay Concept

The player is given a square grid containing clue numbers.

Each number represents the area of a rectangle that:

- must include the clue cell
- must match the clue value
- must not overlap other rectangles
- must remain inside the grid

The puzzle is solved when:

- all cells are filled
- each clue has exactly one rectangle
- all rectangles satisfy area rules
- no overlaps exist

## MVP Scope

Included:

- Puzzle rendering engine
- Rectangle selection interaction
- Placement validation engine
- Completion detection
- Undo/reset support
- Static puzzle packs
- Difficulty grouping
- Progress persistence (localStorage)
- Tutorial overlay
- Responsive layout

Excluded:

- Procedural generation UI
- Hint engine
- Daily puzzle mode
- Square-only constraint mode
- Leaderboards
- Sound effects
- Animations beyond minimal feedback

## Success Criteria

The project is successful if:

- users can load puzzles
- rectangles can be placed via drag interaction
- invalid placements are rejected
- puzzles can be solved completely
- completion is detected correctly
- progress persists across reload
- mobile interaction is usable
- at least 20 puzzles ship with the app

## Technology Stack

Frontend:

- React
- TypeScript
- CSS or Tailwind

Storage:

- localStorage only

Architecture:

- pure validation logic layer
- UI layer separated from puzzle engine