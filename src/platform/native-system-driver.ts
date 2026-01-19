/**
 * Native System Driver
 * Bridge between NSPFRP protocols and the host operating system.
 * Provides implementation parity by checking actual system state.
 */

import { execSync } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';

export interface SystemState {
    hostname: string;
    platform: string;
    arch: string;
    memory: {
        total: number;
        free: number;
    };
    tools: {
        git: boolean;
        node: boolean;
        cursor: boolean;
    };
    repoStatus: {
        isGitRepo: boolean;
        branch?: string;
        lastCommit?: string;
    };
}

export class NativeSystemDriver {
    private rootPath: string;

    constructor(rootPath: string = process.cwd()) {
        this.rootPath = rootPath;
    }

    /**
     * Get the current system state
     */
    getSystemState(): SystemState {
        return {
            hostname: os.hostname(),
            platform: os.platform(),
            arch: os.arch(),
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
            },
            tools: {
                git: this.checkTool('git --version'),
                node: this.checkTool('node --version'),
                cursor: this.checkCursorPresence(),
            },
            repoStatus: this.getRepoStatus(),
        };
    }

    /**
     * Check if a command is available in the shell
     */
    private checkTool(command: string): boolean {
        try {
            execSync(command, { stdio: 'ignore' });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Check for Cursor IDE presence (heuristic based on common paths/markers)
     */
    private checkCursorPresence(): boolean {
        // On Mac, check Applications or ~/.cursor
        const macPath = '/Applications/Cursor.app';
        const homeCursor = path.join(os.homedir(), '.cursor');
        const localCursor = path.join(this.rootPath, '.cursor');

        return fs.existsSync(macPath) || fs.existsSync(homeCursor) || fs.existsSync(localCursor);
    }

    /**
     * Get git repository status
     */
    private getRepoStatus(): SystemState['repoStatus'] {
        const isGitRepo = fs.existsSync(path.join(this.rootPath, '.git'));

        if (!isGitRepo) {
            return { isGitRepo: false };
        }

        try {
            const branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd: this.rootPath }).toString().trim();
            const lastCommit = execSync('git rev-parse --short HEAD', { cwd: this.rootPath }).toString().trim();

            return {
                isGitRepo: true,
                branch,
                lastCommit,
            };
        } catch (e) {
            return { isGitRepo: true };
        }
    }

    /**
     * Detect "Awareness" based on system load and repository density
     */
    calculateSystemDensity(): number {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const loadAvg = os.loadavg()[0]; // 1 minute load average

        // Density calculation: higher load/memory usage = higher computational density
        const memUsage = (totalMem - freeMem) / totalMem;
        const density = (memUsage + (loadAvg / os.cpus().length)) / 2;

        return Math.min(density, 1.0);
    }
}
