# 🤖 Ralph Wiggum - Autonomous Development Guide

> **Ralph Wiggum** is an autonomous AI developer that implements TrickTrack stories using BMAD methodology and Claude Code.

---

## 📋 Table of Contents

- [What is Ralph?](#what-is-ralph)
- [How Ralph Works](#how-ralph-works)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Usage Examples](#usage-examples)
- [Configuration](#configuration)
- [Monitoring Progress](#monitoring-progress)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## What is Ralph?

Ralph Wiggum is a bash script that:
- Runs Claude Code in an isolated Docker container
- Implements stories using BMAD (Business-Managed Agile Development) methodology
- Follows red-green-refactor TDD cycle
- Works epic-by-epic or across multiple epics
- Tracks progress automatically
- Makes atomic git commits per task

**Key Benefits:**
- ⚡ **Autonomous**: Runs continuously without manual intervention
- 🔒 **Isolated**: Docker container has access only to this repository
- 📝 **Story-Driven**: Follows tasks/subtasks exactly as written
- ✅ **Test-First**: Writes failing tests before implementation
- 🎯 **Epic-Focused**: Can target specific epics or ranges

---

## How Ralph Works

```
┌─────────────────────────────────────────────────────────────┐
│  1. Ralph reads sprint-status.yaml                          │
│     - Finds stories with status: ready-for-dev              │
│     - Respects epic scope filter (if provided)              │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  2. Loads story file from implementation-artifacts/         │
│     - Story description (user story format)                 │
│     - Acceptance Criteria (Given-When-Then)                 │
│     - Tasks/Subtasks (authoritative implementation guide)   │
│     - Dev Notes (architecture requirements)                 │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  3. For EACH task/subtask (in order):                       │
│     🔴 RED: Write failing tests first                       │
│     🟢 GREEN: Implement minimal code to pass tests          │
│     🔵 REFACTOR: Improve code while keeping tests green     │
│     ✅ VALIDATE: Run full test suite (no regressions)       │
│     📝 MARK COMPLETE: Update story file [ ] → [x]           │
│     💾 GIT COMMIT: Atomic commit per task                   │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  4. Story completion:                                        │
│     - All tasks marked [x]                                  │
│     - All tests passing                                     │
│     - Update sprint-status.yaml: ready-for-dev → review     │
│     - Output: <promise>STORY-COMPLETE: [story-id]</promise> │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│  5. Move to next story in epic scope                        │
│     - Repeat until epic complete or max iterations reached  │
│     - Output: <promise>EPIC-COMPLETE: Epic N</promise>      │
└─────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required Software

1. **Docker Desktop** (Windows/Mac) or Docker Engine (Linux)
   ```bash
   # Verify Docker is installed
   docker --version
   # Should show: Docker version 20.x or higher
   ```

2. **Git Bash** (Windows) or Bash shell (Mac/Linux)
   ```bash
   # Verify bash is available
   bash --version
   ```

3. **Anthropic API Key**
   - Get from: https://console.anthropic.com/settings/keys
   - Set in `.env.local` or directly in `ralph.sh`

### Repository Setup

```bash
# Ensure you're in the repository root
cd /c/Users/thoma/OneDrive/Documents/Projects/tricktrack

# Make ralph.sh executable
chmod +x ralph.sh

# Verify sprint-status.yaml exists
ls _bmad-output/implementation-artifacts/sprint-status.yaml
```

---

## Quick Start

### 1. Set API Key

**Option A: Environment Variable (Recommended)**
```bash
export ANTHROPIC_API_KEY="sk-ant-api03-your-key-here"
```

**Option B: Edit ralph.sh**
```bash
# Edit line 46 in ralph.sh
ANTHROPIC_API_KEY="sk-ant-api03-your-actual-key-here"
```

### 2. Run Ralph on Epic 1

```bash
# Process Epic 1 (Foundation) with max 20 iterations
./ralph.sh 20 1
```

### 3. Monitor Progress

```bash
# Watch progress in real-time (new terminal)
tail -f progress.txt

# Check sprint status
cat _bmad-output/implementation-artifacts/sprint-status.yaml | grep -A 10 "epic-1"

# View git commits
git log --oneline -20
```

---

## Usage Examples

### Basic Usage

```bash
# Syntax
./ralph.sh <max_iterations> [epic_numbers...]

# Process all epics (max 10 iterations each)
./ralph.sh 10

# Process only Epic 1 (max 20 iterations)
./ralph.sh 20 1

# Process Epics 1, 2, and 3 (max 15 iterations each)
./ralph.sh 15 1 2 3

# Process Epic range 4-6 (max 25 iterations)
./ralph.sh 25 4-6
```

### Recommended Epic-by-Epic Strategy

```bash
# Phase 1: Foundation (Epic 1)
# Estimated: 40-60 hours, 2 stories remaining
./ralph.sh 20 1

# Phase 2: Core Features (Epics 2-5)
# Estimated: 246-369 hours, 32 stories
./ralph.sh 30 2-5

# Phase 3: Advanced Features (Epics 6-8)
# Estimated: 114-171 hours, 19 stories
./ralph.sh 25 6-8

# Phase 4: Governance & Admin (Epics 9-11)
# Estimated: 130-195 hours, 20 stories
./ralph.sh 20 9-11
```

### Targeted Development

```bash
# Just finish Epic 1 (2 stories left)
./ralph.sh 10 1

# Work on wallet features (Epic 2)
./ralph.sh 25 2

# Smart contracts only (Epic 4)
./ralph.sh 30 4

# Multiple specific epics
./ralph.sh 20 2 4 6
```

---

## Configuration

### Ralph Script Settings

Edit `ralph.sh` to customize:

```bash
# Line 45: Container name
CONTAINER_NAME="ralph-claude-dev"

# Line 46: API key (or use environment variable)
ANTHROPIC_API_KEY="sk-ant-api03-..."

# Lines 234-237: Container resources
--cpus=2              # CPU cores
--memory=4g           # RAM limit
--pids-limit=200      # Process limit
```

### Docker Container Specs

- **Image**: `mcr.microsoft.com/devcontainers/typescript-node:20`
- **CPUs**: 2 cores
- **Memory**: 4GB RAM
- **Network**: Bridge mode
- **User**: Non-root (`developer`)
- **Persistence**: Container reused across runs

### BMAD Prompt Configuration

The prompt is dynamically generated in `ralph.sh` (lines 96-200). Key sections:

- **Epic Scope**: Filters stories by epic number(s)
- **Story Discovery**: Reads sprint-status.yaml
- **Red-Green-Refactor**: TDD cycle enforcement
- **Quality Gates**: Test requirements
- **Progress Tracking**: Updates story files and progress.txt

---

## Monitoring Progress

### Real-Time Monitoring

```bash
# Terminal 1: Run Ralph
./ralph.sh 20 1

# Terminal 2: Watch progress log
tail -f progress.txt

# Terminal 3: Monitor git commits
watch -n 5 'git log --oneline -10'

# Terminal 4: Check Docker logs
docker logs -f ralph-claude-dev
```

### Progress Files

**`progress.txt`** - Session log
```
[2026-01-16 18:30:15] Story 1-7: Complete task 1 - Set up ESLint base config
Files: packages/config/eslint/base.js
Tests: packages/config/eslint/base.test.js
Decision: Using @typescript-eslint/recommended preset
```

**`sprint-status.yaml`** - Story states
```yaml
development_status:
  epic-1: in-progress
  1-7-configure-eslint: in-progress  # ← Ralph is working on this
  1-8-deployment-pipelines: ready-for-dev
```

**Story files** - Task completion
```markdown
## Tasks/Subtasks
- [x] Task 1: Set up ESLint base configuration
- [ ] Task 2: Configure TypeScript-specific rules
- [ ] Task 3: Add Prettier integration
```

### Git History

```bash
# View Ralph's commits
git log --oneline --author="ralph" -20

# See what Ralph changed
git diff HEAD~5..HEAD

# Check current branch
git branch --show-current
```

---

## Troubleshooting

### Common Issues

#### 1. "Docker daemon not running"

```bash
# Windows: Start Docker Desktop
# Mac: Start Docker Desktop
# Linux: 
sudo systemctl start docker
```

#### 2. "ANTHROPIC_API_KEY not set"

```bash
# Set environment variable
export ANTHROPIC_API_KEY="sk-ant-api03-your-key"

# Or edit ralph.sh line 46
```

#### 3. "No ready-for-dev stories found"

```bash
# Check sprint status
cat _bmad-output/implementation-artifacts/sprint-status.yaml

# Create stories manually
/create-story  # In Windsurf/Cascade

# Or check if stories are in 'review' status (already complete)
```

#### 4. "Container already exists"

```bash
# Ralph reuses containers - this is normal
# To force fresh container:
docker stop ralph-claude-dev
docker rm ralph-claude-dev
./ralph.sh 10 1
```

#### 5. "Tests failing"

```bash
# Ralph will halt on test failures
# Check the error in Docker logs:
docker logs ralph-claude-dev | tail -100

# Fix manually, then restart Ralph
```

#### 6. "Path conversion issues (Windows)"

```bash
# Ralph handles Windows paths automatically
# If issues persist, check DOCKER_PATH conversion (lines 29-39)

# Verify path:
echo $REPO_PATH
echo $DOCKER_PATH
```

### Debug Mode

```bash
# Add debug output to ralph.sh
set -x  # Add after line 10

# View full Docker output
docker exec -it ralph-claude-dev bash
cd /workspace
ls -la
```

### Manual Cleanup

```bash
# Stop Ralph
Ctrl+C

# Clean up container
docker stop ralph-claude-dev
docker rm ralph-claude-dev

# Clean up temp files
rm -f claude_prompt.txt

# Reset progress (if needed)
> progress.txt
```

---

## Best Practices

### 1. Start Small

```bash
# Don't run all epics at once on first try
# Start with Epic 1 to validate setup
./ralph.sh 10 1
```

### 2. Monitor First Run

Watch the first iteration closely to ensure:
- Stories are being discovered correctly
- Tests are running
- Git commits are being made
- Story files are being updated

### 3. Set Realistic Iteration Limits

```bash
# Too few: Ralph stops before story complete
./ralph.sh 5 1  # ❌ Might not finish even 1 story

# Too many: Wastes API credits if issues occur
./ralph.sh 100 1  # ❌ Overkill for 2 stories

# Just right: Enough to complete epic with buffer
./ralph.sh 20 1  # ✅ Good for Epic 1 (2 stories)
```

### 4. Review Ralph's Work

```bash
# After Ralph completes a story, review:
git diff HEAD~10..HEAD  # See changes
pnpm test               # Run tests manually
pnpm typecheck          # Verify types

# If issues found, fix manually and continue
```

### 5. Use Epic-by-Epic Approach

```bash
# Complete Epic 1 before moving to Epic 2
./ralph.sh 20 1

# Review Epic 1 work
git log --oneline | grep "1-"

# Then move to Epic 2
./ralph.sh 25 2
```

### 6. Backup Before Long Runs

```bash
# Create a branch before running Ralph
git checkout -b ralph-epic-1
./ralph.sh 20 1

# If issues, reset and try again
git checkout main
git branch -D ralph-epic-1
```

### 7. Monitor API Usage

Ralph uses Claude API credits. Monitor usage at:
https://console.anthropic.com/settings/usage

**Estimated costs**:
- ~$0.50-$2 per story (depending on complexity)
- Epic 1 (2 stories): ~$1-$4
- Full project (79 stories): ~$40-$160

### 8. Combine with Manual Development

```bash
# Use Ralph for repetitive tasks
./ralph.sh 15 1  # Foundation setup

# Do complex features manually
/dev-story  # For Epic 4 (smart contracts)

# Use Ralph for CRUD features
./ralph.sh 20 6  # Token rewards (straightforward)
```

---

## Advanced Usage

### Custom Prompt Modifications

Edit the prompt in `ralph.sh` (lines 96-200) to:
- Add project-specific coding standards
- Enforce additional quality gates
- Customize commit message format
- Add custom validation steps

### Parallel Epic Development

```bash
# Terminal 1: Epic 1
./ralph.sh 20 1

# Terminal 2: Epic 2 (different container name)
# Edit ralph.sh, change CONTAINER_NAME to "ralph-claude-dev-epic2"
./ralph.sh 25 2
```

### Integration with CI/CD

```bash
# Run Ralph in CI pipeline
#!/bin/bash
export ANTHROPIC_API_KEY=${{ secrets.ANTHROPIC_API_KEY }}
./ralph.sh 10 1
git push origin main
```

---

## Summary

Ralph Wiggum automates story implementation using:
- ✅ BMAD methodology (story-driven development)
- ✅ Red-Green-Refactor TDD cycle
- ✅ Epic-by-epic or multi-epic processing
- ✅ Automatic progress tracking
- ✅ Isolated Docker environment
- ✅ Atomic git commits

**Start with**: `./ralph.sh 20 1` to complete Epic 1!

---

*For more information, see [README.md](README.md) or [BMAD documentation](_bmad/)*
