# ralph.sh
# Usage: ./ralph.sh <iterations> [epic_numbers...]
# Examples:
#   ./ralph.sh 10              # Process all epics
#   ./ralph.sh 10 1            # Process only Epic 1
#   ./ralph.sh 10 1 2 3        # Process Epics 1, 2, and 3
#   ./ralph.sh 10 4-6          # Process Epics 4, 5, and 6
# Runs Claude Code in Docker with access to this repository only

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 <iterations> [epic_numbers...]"
  echo ""
  echo "Examples:"
  echo "  $0 10              # Process all epics"
  echo "  $0 10 1            # Process only Epic 1"
  echo "  $0 10 1 2 3        # Process Epics 1, 2, and 3"
  echo "  $0 10 4-6          # Process Epics 4, 5, and 6"
  exit 1
fi

ITERATIONS=$1
shift  # Remove first argument, remaining are epic numbers

# Get the absolute path to this repository
REPO_PATH="$(cd "$(dirname "$0")" && pwd)"

# Convert Windows path to Unix-style for Docker (if on Windows/Git Bash)
# This handles paths like /c/Users/... or C:/Users/...
if [[ "$REPO_PATH" =~ ^/[a-z]/ ]]; then
  # Already in Git Bash format (/c/Users/...)
  DOCKER_PATH="$REPO_PATH"
elif [[ "$REPO_PATH" =~ ^[A-Za-z]: ]]; then
  # Windows format (C:/Users/...), convert to /c/Users/...
  DOCKER_PATH="$(echo "$REPO_PATH" | sed 's|^\([A-Za-z]\):|/\L\1|')"
else
  DOCKER_PATH="$REPO_PATH"
fi

# Ensure progress.txt exists
touch "$REPO_PATH/progress.txt"

# Container name for persistent Claude Code environment
CONTAINER_NAME="ralph-claude-dev"

# Load environment variables from .env file
if [ -f "$REPO_PATH/.env" ]; then
  echo "📄 Loading API key from .env file..."
  export $(grep -v '^#' "$REPO_PATH/.env" | xargs)
else
  echo "⚠️  Warning: .env file not found at $REPO_PATH/.env"
fi

# Check for Anthropic API key
if [ -z "$ANTHROPIC_API_KEY" ]; then
  echo "❌ Error: ANTHROPIC_API_KEY not found"
  echo ""
  echo "Please create a .env file in the project root with:"
  echo "  ANTHROPIC_API_KEY=your-api-key-here"
  echo ""
  echo "Get your API key from: https://console.anthropic.com/settings/keys"
  exit 1
fi

# Check if container already exists and is running
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "♻️  Reusing existing container: $CONTAINER_NAME"
  CONTAINER_EXISTS=true
else
  echo "🆕 Creating new container: $CONTAINER_NAME"
  CONTAINER_EXISTS=false
fi

# Parse epic numbers
EPIC_FILTER=""
if [ $# -gt 0 ]; then
  # Build epic filter string
  EPIC_LIST=""
  for arg in "$@"; do
    if [[ "$arg" == *-* ]]; then
      # Range format: 4-6
      START=$(echo "$arg" | cut -d'-' -f1)
      END=$(echo "$arg" | cut -d'-' -f2)
      for ((e=$START; e<=$END; e++)); do
        EPIC_LIST="$EPIC_LIST $e"
      done
    else
      # Single epic number
      EPIC_LIST="$EPIC_LIST $arg"
    fi
  done
  EPIC_FILTER="Focus ONLY on these epics: Epic$(echo $EPIC_LIST | sed 's/ /, Epic/g')"
  echo "🎯 Epic Filter Active: Processing Epic$(echo $EPIC_LIST | sed 's/ /, Epic/g')"
else
  echo "📋 Processing ALL epics (1-11)"
fi

# For each iteration, run Claude Code with the following prompt.
# Mount the repository as /workspace in the container
for ((i=1; i<=ITERATIONS; i++)); do
  echo "=== Iteration $i/$ITERATIONS ==="
  
  # Create prompt file for this iteration
  cat > "$REPO_PATH/claude_prompt.txt" <<PROMPT
@//workspace/_bmad-output/implementation-artifacts/sprint-status.yaml
@//workspace/_bmad/bmm/config.yaml
@//workspace/progress.txt

# BMAD Development Workflow - Story-Driven Implementation

You are executing the BMAD (Business-Managed Agile Development) methodology.
Follow these instructions EXACTLY:
\
## EPIC SCOPE
$EPIC_FILTER
$([ -z "$EPIC_FILTER" ] && echo "Process all epics in priority order (Epic 1 → Epic 11)")
\
## 1. Story Discovery & Selection
- Load config from @_bmad/bmm/config.yaml (user_name, project_name, skill_level)
- Review @sprint-status.yaml to identify story states and epic progress
- Check @progress.txt to see what tasks have been completed in current session
- **RESPECT EPIC SCOPE**: Only work on stories within the specified epic(s)
- Select the HIGHEST PRIORITY story with status 'ready-for-dev' within allowed epic(s)
- Load the story file from @_bmad-output/implementation-artifacts/[story-id].md
- If no 'ready-for-dev' stories exist in scope, check for 'in-progress' stories to continue
\
## 2. Story Context Loading
- Read the complete story file: [story-id].md from //workspace/_bmad-output/implementation-artifacts/
- Parse the Story section (user story format)
- Review Acceptance Criteria (Given-When-Then format)
- Load Tasks/Subtasks section - this is your AUTHORITATIVE implementation guide
- Review Dev Notes for architecture requirements and technical constraints
- Check Dependencies section to ensure prerequisite stories are complete
- Load project-context.md if it exists for coding standards
\
## 3. Task-Driven Implementation (Red-Green-Refactor)
- Work through Tasks/Subtasks in EXACT order listed in the story file
- For EACH task/subtask:
  * RED: Write FAILING tests first (unit, integration, e2e as needed)
  * GREEN: Implement MINIMAL code to make tests pass
  * REFACTOR: Improve code structure while keeping tests green
  * VALIDATE: Run full test suite - NO regressions allowed
  * MARK COMPLETE: Update story file - change [ ] to [x] for completed task
  * UPDATE FILE LIST: Add all modified files to the File List section
  * DOCUMENT: Add completion notes to Dev Agent Record section
\
## 4. Quality Gates (NEVER skip)
- All existing tests MUST pass before proceeding to next task
- New tests MUST exist and pass for each task
- Follow acceptance criteria EXACTLY - no extra features
- Verify all subtasks under a parent task are complete before marking parent complete
- Update story file's File List with all changed files
- Document key decisions in Dev Agent Record
\
## 5. Progress Tracking
- Update the story file in implementation-artifacts/ after EACH completed task
- Append to progress.txt after each completed task:
  * Story ID and task number completed
  * Files created/modified
  * Tests added/updated
  * Any blockers or technical decisions
- Make atomic git commits per task with format: '[story-id] Complete task N: description'
\
## 6. Story Completion
- When ALL tasks/subtasks in story file are marked [x] complete
- AND all tests pass (run full test suite)
- Before committing, run ALL feedback loops:
  * TypeScript: npm run typecheck (must pass with no errors)
  * Tests: npm run test (must pass)
  * Lint: npm run lint (must pass)
- AND all acceptance criteria are satisfied
- THEN:
  * Update story status in sprint-status.yaml: 'ready-for-dev' → 'review'
  * Update story file header: Status: review
  * Make final git commit: '[story-id] Story complete - moved to review'
  * Output: <promise>STORY-COMPLETE: [story-id]</promise>
  * **EXIT IMMEDIATELY** - Do NOT start the next story
\
## 7. Single Story Per Session Rule
- **CRITICAL**: Complete ONLY ONE story per session
- After completing a story and outputting <promise>STORY-COMPLETE</promise>, EXIT
- The script will launch a new Claude Code instance for the next story
- This ensures clean state and proper story isolation
\
## CRITICAL RULES:
- NEVER implement anything not explicitly listed in Tasks/Subtasks
- NEVER mark task complete without passing tests
- NEVER skip the red-green-refactor cycle
- ONLY work on ONE task at a time (sequential execution)
- ALWAYS update the story file after completing each task
- ALWAYS reference the implementation-artifacts/[story-id].md file as source of truth
- Execute continuously until COMPLETE or HALT condition
\
## FILE LOCATIONS:
- Story files: //workspace/_bmad-output/implementation-artifacts/[epic]-[story]-[name].md
- Sprint status: //workspace/_bmad-output/implementation-artifacts/sprint-status.yaml
- Progress log: //workspace/progress.txt
- Config: //workspace/_bmad/bmm/config.yaml
PROMPT

  # Create container on first iteration
  if [ "$CONTAINER_EXISTS" = false ] && [ $i -eq 1 ]; then
    echo "📦 Setting up Claude Code container (one-time setup)..."
    # Prevent Git Bash from converting paths on Windows
    MSYS_NO_PATHCONV=1 docker run -d \
      --name "$CONTAINER_NAME" \
      -v "$DOCKER_PATH:/workspace" \
      -w /workspace \
      --cpus=2 \
      --memory=4g \
      --pids-limit=200 \
      --network=bridge \
      mcr.microsoft.com/devcontainers/typescript-node:20 \
      tail -f /dev/null
    
    # Create non-root user and install Claude Code (one-time)
    docker exec "$CONTAINER_NAME" bash -c "
      # Create a non-root user 'developer'
      useradd -m -s /bin/bash developer
      # Give developer ownership of workspace
      chown -R developer:developer /workspace
    "
    
    # Install Claude Code as the non-root user
    docker exec -u developer "$CONTAINER_NAME" bash -c "
      curl -fsSL https://claude.ai/install.sh | bash
      export PATH=\"\$HOME/.local/bin:\$PATH\"
      claude --version
    "
    echo "✅ Container setup complete"
    CONTAINER_EXISTS=true
  fi
  
  # Start container if it's stopped
  if [ "$(docker inspect -f '{{.State.Running}}' "$CONTAINER_NAME" 2>/dev/null)" != "true" ]; then
    echo "▶️  Starting container..."
    docker start "$CONTAINER_NAME"
  fi
  
  # Copy prompt file into container
  docker cp "$REPO_PATH/claude_prompt.txt" "$CONTAINER_NAME:/tmp/prompt.txt"
  
  echo "🤖 Running Claude Code for story..."
  
  # Execute Claude Code in the running container as non-root user
  # Capture output to check for completion
  output=$(docker exec -i -u developer "$CONTAINER_NAME" bash -c "
    export PATH=\"\$HOME/.local/bin:\$PATH\"
    export ANTHROPIC_API_KEY=\"$ANTHROPIC_API_KEY\"
    cd /workspace
    echo '=== Starting Claude Code ==='
    cat /tmp/prompt.txt | claude --dangerously-skip-permissions 2>&1
    echo '=== Claude Code finished ==='
  ")
  
  result_code=$?
  echo "$output"
  echo ""
  echo "Exit code: $result_code"
  
  # Clean up prompt file
  rm -f "$REPO_PATH/claude_prompt.txt"
  
  # Check for story completion
  if [[ "$output" == *"<promise>STORY-COMPLETE"* ]]; then
    echo ""
    echo "✅ Story completed! Moving to next story..."
    echo ""
    sleep 2
    continue
  fi
  
  # Check if we should stop
  if [ $result_code -ne 0 ]; then
    echo "⚠️  Claude Code exited with error code $result_code"
    echo "Stopping iterations."
    break
  fi
  
  # If no story completion detected, warn and continue
  echo "⚠️  No STORY-COMPLETE marker found. Continuing to next iteration..."
  sleep 2
done

echo "⚠️  Reached maximum iterations ($ITERATIONS) without completion."

# Cleanup: Stop and remove the container
echo ""
echo "🧹 Cleaning up container..."
docker stop "$CONTAINER_NAME" >/dev/null 2>&1
docker rm "$CONTAINER_NAME" >/dev/null 2>&1
echo "✅ Container removed"