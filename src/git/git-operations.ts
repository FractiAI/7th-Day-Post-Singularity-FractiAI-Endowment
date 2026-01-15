/**
 * Git Operations for Protocol Snapshots
 * Commit and push snapshots to repositories
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

export interface GitConfig {
  repositoryPath: string;
  branch?: string;
  remote?: string;
  authorName?: string;
  authorEmail?: string;
  autoCommit?: boolean;
  autoPush?: boolean;
}

export interface GitCommitResult {
  success: boolean;
  commitHash?: string;
  branch?: string;
  message?: string;
  error?: string;
}

export interface GitPushResult {
  success: boolean;
  remote?: string;
  branch?: string;
  commits?: string[];
  error?: string;
}

export class GitOperations {
  public config: GitConfig;

  constructor(config: GitConfig) {
    this.config = {
      branch: 'main',
      remote: 'origin',
      autoCommit: true,
      autoPush: false,
      ...config
    };
  }

  /**
   * Initialize git repository if not exists
   */
  async initializeRepository(): Promise<void> {
    try {
      await fs.access(path.join(this.config.repositoryPath, '.git'));
      // Repository already exists
    } catch {
      // Repository doesn't exist, initialize it
      await execAsync('git init', { cwd: this.config.repositoryPath });
    }
  }

  /**
   * Check if repository is initialized
   */
  async isRepositoryInitialized(): Promise<boolean> {
    try {
      await fs.access(path.join(this.config.repositoryPath, '.git'));
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Stage files for commit
   */
  async stageFiles(files: string[]): Promise<void> {
    if (files.length === 0) {
      // Stage all files
      await execAsync('git add -A', { cwd: this.config.repositoryPath });
    } else {
      // Stage specific files
      for (const file of files) {
        await execAsync(`git add "${file}"`, { cwd: this.config.repositoryPath });
      }
    }
  }

  /**
   * Commit changes
   */
  async commit(
    message: string,
    files?: string[]
  ): Promise<GitCommitResult> {
    try {
      // Initialize if needed
      if (!(await this.isRepositoryInitialized())) {
        await this.initializeRepository();
      }

      // Stage files
      if (files && files.length > 0) {
        await this.stageFiles(files);
      } else {
        await this.stageFiles([]);
      }

      // Configure git user if not set
      if (this.config.authorName && this.config.authorEmail) {
        await execAsync(
          `git config user.name "${this.config.authorName}"`,
          { cwd: this.config.repositoryPath }
        );
        await execAsync(
          `git config user.email "${this.config.authorEmail}"`,
          { cwd: this.config.repositoryPath }
        );
      }

      // Get current branch
      const { stdout: branchOutput } = await execAsync(
        'git branch --show-current',
        { cwd: this.config.repositoryPath }
      );
      const currentBranch = branchOutput.trim() || this.config.branch;

      // Create branch if it doesn't exist
      try {
        await execAsync(
          `git checkout -b ${currentBranch}`,
          { cwd: this.config.repositoryPath }
        );
      } catch {
        // Branch might already exist, try to checkout
        await execAsync(
          `git checkout ${currentBranch}`,
          { cwd: this.config.repositoryPath }
        );
      }

      // Commit
      const { stdout: commitOutput } = await execAsync(
        `git commit -m "${message}"`,
        { cwd: this.config.repositoryPath }
      );

      // Get commit hash
      const { stdout: hashOutput } = await execAsync(
        'git rev-parse HEAD',
        { cwd: this.config.repositoryPath }
      );
      const commitHash = hashOutput.trim();

      return {
        success: true,
        commitHash,
        branch: currentBranch,
        message
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message
      };
    }
  }

  /**
   * Push to remote repository
   */
  async push(
    branch?: string,
    remote?: string
  ): Promise<GitPushResult> {
    try {
      const targetBranch = branch || this.config.branch || 'main';
      const targetRemote = remote || this.config.remote || 'origin';

      // Check if remote exists
      try {
        await execAsync(
          `git remote get-url ${targetRemote}`,
          { cwd: this.config.repositoryPath }
        );
      } catch {
        return {
          success: false,
          error: `Remote '${targetRemote}' not found`
        };
      }

      // Get commits to push
      const { stdout: commitsOutput } = await execAsync(
        `git log ${targetRemote}/${targetBranch}..HEAD --oneline`,
        { cwd: this.config.repositoryPath }
      ).catch(() => ({ stdout: '' }));
      
      const commits = commitsOutput
        .split('\n')
        .filter(line => line.trim())
        .map(line => line.split(' ')[0]);

      // Push
      await execAsync(
        `git push ${targetRemote} ${targetBranch}`,
        { cwd: this.config.repositoryPath }
      );

      return {
        success: true,
        remote: targetRemote,
        branch: targetBranch,
        commits
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        remote: remote || this.config.remote,
        branch: branch || this.config.branch
      };
    }
  }

  /**
   * Commit and push in one operation
   */
  async commitAndPush(
    message: string,
    files?: string[],
    branch?: string,
    remote?: string
  ): Promise<{
    commit: GitCommitResult;
    push: GitPushResult;
  }> {
    const commitResult = await this.commit(message, files);
    
    let pushResult: GitPushResult = {
      success: false,
      error: 'Commit failed, skipping push'
    };

    if (commitResult.success) {
      pushResult = await this.push(branch, remote);
    }

    return {
      commit: commitResult,
      push: pushResult
    };
  }

  /**
   * Get repository status
   */
  async getStatus(): Promise<{
    branch: string;
    hasChanges: boolean;
    stagedFiles: string[];
    unstagedFiles: string[];
    untrackedFiles: string[];
  }> {
    try {
      // Get current branch
      const { stdout: branchOutput } = await execAsync(
        'git branch --show-current',
        { cwd: this.config.repositoryPath }
      );
      const branch = branchOutput.trim() || 'main';

      // Get status
      const { stdout: statusOutput } = await execAsync(
        'git status --porcelain',
        { cwd: this.config.repositoryPath }
      );

      const lines = statusOutput.split('\n').filter(line => line.trim());
      const stagedFiles: string[] = [];
      const unstagedFiles: string[] = [];
      const untrackedFiles: string[] = [];

      lines.forEach(line => {
        const status = line.substring(0, 2);
        const file = line.substring(3);

        if (status.startsWith('??')) {
          untrackedFiles.push(file);
        } else if (status.startsWith(' ')) {
          // Staged
          if (status[1] !== ' ') {
            stagedFiles.push(file);
          }
        } else {
          // Unstaged
          if (status[0] !== ' ') {
            unstagedFiles.push(file);
          }
        }
      });

      return {
        branch,
        hasChanges: lines.length > 0,
        stagedFiles,
        unstagedFiles,
        untrackedFiles
      };
    } catch (error) {
      throw new Error(`Failed to get git status: ${error}`);
    }
  }

  /**
   * Get commit history
   */
  async getCommitHistory(limit: number = 10): Promise<Array<{
    hash: string;
    message: string;
    author: string;
    date: string;
  }>> {
    try {
      const { stdout } = await execAsync(
        `git log -${limit} --pretty=format:"%H|%s|%an|%ad" --date=iso`,
        { cwd: this.config.repositoryPath }
      );

      return stdout
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [hash, message, author, date] = line.split('|');
          return { hash, message, author, date };
        });
    } catch (error) {
      return [];
    }
  }

  /**
   * Create snapshot branch
   */
  async createSnapshotBranch(snapshotId: string): Promise<string> {
    const branchName = `snapshot/${snapshotId}`;
    
    try {
      await execAsync(
        `git checkout -b ${branchName}`,
        { cwd: this.config.repositoryPath }
      );
      return branchName;
    } catch {
      // Branch might already exist
      await execAsync(
        `git checkout ${branchName}`,
        { cwd: this.config.repositoryPath }
      );
      return branchName;
    }
  }

  /**
   * Tag snapshot
   */
  async tagSnapshot(snapshotId: string, tag: string): Promise<void> {
    await execAsync(
      `git tag -a "${tag}" -m "Snapshot: ${snapshotId}"`,
      { cwd: this.config.repositoryPath }
    );
  }
}

