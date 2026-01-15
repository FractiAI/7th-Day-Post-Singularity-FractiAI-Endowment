# Git Operations for Protocol Snapshots

## Overview

The Git Operations module provides automatic commit and push functionality for protocol snapshots. When a snapshot is created, it can automatically:

1. Commit the snapshot to the repository
2. Push to the remote repository
3. Tag the snapshot for easy reference

## Configuration

```typescript
import { GitConfig } from './git/git-operations.js';

const gitConfig: GitConfig = {
  repositoryPath: './',
  branch: 'main',
  remote: 'origin',
  authorName: 'NSPFRP OmniMission Station',
  authorEmail: 'omnimission@nspfrp.ai',
  autoCommit: true,
  autoPush: true
};
```

## Usage

### Automatic Commit and Push

When creating a protocol snapshot, if git is configured, it will automatically:

1. Create a commit with the snapshot
2. Tag the commit with the snapshot ID
3. Push to the remote repository (if `autoPush` is enabled)

```typescript
const station = new NSPFRPOmniMissionStation({
  encryptionKey: process.env.ENCRYPTION_KEY!,
  gitConfig: {
    repositoryPath: './',
    branch: 'main',
    remote: 'origin',
    autoCommit: true,
    autoPush: true
  }
});

// When you create a snapshot, it will automatically commit and push
const snapshot = await station.snapshotManager.createSnapshot(
  protocol,
  context,
  agentIdentity,
  options
);
```

### Manual Git Operations

You can also use git operations manually:

```typescript
const git = station.git;

// Commit changes
const commitResult = await git.commit('Update protocol snapshot', ['snapshots/']);

// Push to remote
const pushResult = await git.push('main', 'origin');

// Commit and push in one operation
const result = await git.commitAndPush(
  'Update protocol snapshot',
  ['snapshots/'],
  'main',
  'origin'
);
```

## Commit Messages

Automatic commit messages include:
- Protocol name and version
- POB ID
- Snapshot ID
- Protocol ID
- Creation timestamp
- Tags
- Deployment information (if applicable)
- Button information (if applicable)

Example commit message:
```
Protocol Snapshot: My Protocol v1.0.0

POB ID: POB-PROTOCOL-123-1234567890
Snapshot ID: SNAP-1234567890-ABC123
Protocol ID: PROTOCOL-123
Created: 2024-01-15T10:30:00.000Z
Deployment: vercel - https://my-protocol.vercel.app
Deployment Button: BTN-1234567890-ABC123
```

## Tags

Each snapshot is automatically tagged with:
- `pob-{pobId}` - For POB snapshots
- `snapshot-{pobId}` - For protocol snapshots

## Repository Status

Check repository status:

```typescript
const status = await git.getStatus();
console.log(status);
// {
//   branch: 'main',
//   hasChanges: true,
//   stagedFiles: ['snapshots/protocol-123/pob.json'],
//   unstagedFiles: [],
//   untrackedFiles: []
// }
```

## Commit History

Get commit history:

```typescript
const history = await git.getCommitHistory(10);
console.log(history);
// [
//   {
//     hash: 'abc123...',
//     message: 'Protocol Snapshot: My Protocol v1.0.0',
//     author: 'NSPFRP OmniMission Station',
//     date: '2024-01-15T10:30:00.000Z'
//   },
//   ...
// ]
```

## Snapshot Branches

Create a branch for a specific snapshot:

```typescript
const branchName = await git.createSnapshotBranch('SNAP-1234567890-ABC123');
// Returns: 'snapshot/SNAP-1234567890-ABC123'
```

## Error Handling

Git operations are optional and won't fail the snapshot creation if they fail. Errors are logged but don't throw exceptions:

```typescript
try {
  await git.commit('Message');
} catch (error) {
  // Error is logged but doesn't break snapshot creation
  console.error('Git commit failed:', error);
}
```

## Integration with Snapshots

The git operations are automatically integrated into:

1. **POB Snapshots**: When a POB is created, it's automatically committed
2. **Protocol Snapshots**: When a protocol snapshot is created, it's automatically committed
3. **Mission Craft**: Snapshots created during mission execution are automatically committed

---

**Protocol ID:** `P-GIT-OPS-V17`  
**Version:** `17.0+GitOps`  
**Status:** Implementation Complete


