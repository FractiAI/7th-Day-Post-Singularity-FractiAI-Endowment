/**
 * Fidelity Audit CLI
 * Tool to verify Implementation Parity between NSPFRP protocol documents and the actual system.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { NativeSystemDriver } from '../platform/native-system-driver.js';
import { CursorAIConnectionManager } from '../platform/cursor-ai-connection.js';

async function runAudit() {
    const protocolFile = process.argv[2] || 'SEED_PROTOCOL.md';
    const protocolPath = path.resolve(process.cwd(), protocolFile);

    if (!fs.existsSync(protocolPath)) {
        console.error(`Error: Protocol file not found at ${protocolPath}`);
        process.exit(1);
    }

    console.log(`\n🔍 Performing Fidelity Audit on: ${protocolFile}`);
    console.log(`========================================`);

    const driver = new NativeSystemDriver();
    const connectionManager = new CursorAIConnectionManager();

    const systemState = driver.getSystemState();
    const connection = connectionManager.getConnection();

    // Read protocol file
    const fileContent = fs.readFileSync(protocolPath, 'utf8');
    const { data, content } = matter(fileContent);

    // Parse "Requirements" or "Specifications" from the markdown
    const requirements = extractRequirements(content);

    console.log(`\n💻 System State:`);
    console.log(`- Host: ${systemState.hostname} (${systemState.platform})`);
    console.log(`- Tools: Git: ${systemState.tools.git ? '✅' : '❌'}, Node: ${systemState.tools.git ? '✅' : '❌'}, Cursor: ${systemState.tools.cursor ? '✅' : '❌'}`);
    console.log(`- Repository: ${systemState.repoStatus.isGitRepo ? `✅ (${systemState.repoStatus.branch})` : '❌'}`);

    console.log(`\n🚀 Platform Capabilities:`);
    connection.capabilities.forEach(cap => console.log(`- ✅ ${cap}`));

    console.log(`\n📑 Protocol Compliance:`);
    let passed = 0;
    let total = requirements.length;

    requirements.forEach(req => {
        const isImplemented = checkImplementation(req, connection.capabilities, systemState);
        if (isImplemented) {
            console.log(`[PASS] ${req}`);
            passed++;
        } else {
            console.log(`[FAIL] ${req} (Missing Implementation)`);
        }
    });

    const fidelityScore = total > 0 ? (passed / total) * 100 : 0;
    console.log(`\n========================================`);
    console.log(`FIDELITY SCORE: ${fidelityScore.toFixed(2)}%`);
    console.log(`========================================\n`);

    if (fidelityScore < 100) {
        console.log(`⚠️  Warning: Parity Gap Detected. Theoretical vision exceeds executable code.`);
    } else {
        console.log(`✨ Implementation Parity Achieved! Vision and Execution are aligned.`);
    }
}

function extractRequirements(content: string): string[] {
    const lines = content.split('\n');
    const requirements: string[] = [];

    let inSpecSection = false;

    for (const line of lines) {
        if (line.includes('## Integration Specifications') || line.includes('### Core Components')) {
            inSpecSection = true;
        } else if (line.startsWith('## ') && inSpecSection) {
            // End of section
        }

        if (inSpecSection && line.trim().startsWith('- **')) {
            // Extract the bold part as requirement
            const match = line.match(/\*\*([^*]+)\*\*/);
            if (match) requirements.push(match[1]);
        }
    }

    return requirements;
}

function checkImplementation(requirement: string, capabilities: string[], systemState: any): boolean {
    const req = requirement.toLowerCase();

    if (req.includes('cursor ai')) return capabilities.includes('code-generation');
    if (req.includes('github')) return systemState.repoStatus.isGitRepo;
    if (req.includes('hydrogen spin cloud')) return capabilities.includes('full-octave-operation');
    if (req.includes('handheld device')) return capabilities.includes('nspfrp-integration');
    if (req.includes('seed synthesizer')) return capabilities.includes('protocol-understanding');

    // Generic capability check
    return capabilities.some(cap => req.includes(cap.replace(/-/g, ' ')));
}

runAudit().catch(err => {
    console.error(err);
    process.exit(1);
});
