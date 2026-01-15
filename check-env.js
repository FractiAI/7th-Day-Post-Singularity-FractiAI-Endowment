#!/usr/bin/env node
/**
 * NSPFRP Environment Checker
 * Checks for missing environment variables and prompts for them
 * Also checks for FSR .env files in wallets directory
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Required environment variables for deployment
const REQUIRED_ENV = {
  // Vercel
  VERCEL_TOKEN: {
    description: 'Vercel deployment token',
    platforms: ['vercel'],
    optional: true
  },
  
  // Supabase
  SUPABASE_ACCESS_TOKEN: {
    description: 'Supabase access token',
    platforms: ['supabase'],
    optional: true
  },
  SUPABASE_PROJECT_REF: {
    description: 'Supabase project reference ID',
    platforms: ['supabase'],
    optional: true
  },
  
  // FSR Specific
  FSR_MODE: {
    description: 'FSR Mode activation',
    platforms: ['fsr'],
    optional: true,
    default: 'active'
  },
  FSR_OCTAVE: {
    description: 'FSR Octave level',
    platforms: ['fsr'],
    optional: true,
    default: '7.5'
  }
};

// Check for .env files
function findEnvFiles() {
  const envFiles = [];
  const rootEnv = join(__dirname, '.env');
  const walletsDir = join(__dirname, 'wallets');
  const fsrEnv = join(__dirname, '.env.fsr');
  const walletsFsrEnv = join(walletsDir, '.env.fsr');
  
  // Check root .env
  if (existsSync(rootEnv)) {
    envFiles.push({ path: rootEnv, type: 'root' });
  }
  
  // Check wallets directory
  if (existsSync(walletsDir)) {
    // Check for .env files in wallets
    try {
      const walletFiles = execSync(`find "${walletsDir}" -name ".env*" -type f 2>/dev/null`, { encoding: 'utf-8' });
      walletFiles.trim().split('\n').forEach(file => {
        if (file) {
          envFiles.push({ path: file, type: 'wallet' });
        }
      });
    } catch (e) {
      // Directory might not exist or no files
    }
    
    // Check for FSR .env in wallets
    if (existsSync(walletsFsrEnv)) {
      envFiles.push({ path: walletsFsrEnv, type: 'wallet-fsr' });
    }
  }
  
  // Check root FSR .env
  if (existsSync(fsrEnv)) {
    envFiles.push({ path: fsrEnv, type: 'fsr' });
  }
  
  return envFiles;
}

// Load environment from .env file
function loadEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const env = {};
    
    content.split('\n').forEach(line => {
      line = line.trim();
      if (line && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        }
      }
    });
    
    return env;
  } catch (e) {
    return {};
  }
}

// Check environment variables
function checkEnvironment() {
  console.log('🔍 NSPFRP Environment Checker');
  console.log('================================\n');
  
  // Find all .env files
  const envFiles = findEnvFiles();
  const allEnv = {};
  
  // Load all .env files
  envFiles.forEach(({ path, type }) => {
    console.log(`📄 Found ${type} .env: ${path}`);
    const env = loadEnvFile(path);
    Object.assign(allEnv, env);
  });
  
  // Load from process.env
  Object.assign(allEnv, process.env);
  
  console.log('\n');
  
  // Check required variables
  const missing = [];
  const found = [];
  
  Object.entries(REQUIRED_ENV).forEach(([key, config]) => {
    if (allEnv[key]) {
      found.push({ key, value: '***' + allEnv[key].slice(-4), ...config });
    } else if (!config.optional) {
      missing.push({ key, ...config });
    } else {
      console.log(`⚠️  ${key}: Not set (optional for ${config.platforms.join(', ')})`);
    }
  });
  
  // Report found variables
  if (found.length > 0) {
    console.log('✅ Found Environment Variables:');
    found.forEach(({ key, description }) => {
      console.log(`   ${key}: ${description}`);
    });
    console.log('');
  }
  
  // Report missing variables
  if (missing.length > 0) {
    console.log('❌ Missing Required Environment Variables:');
    missing.forEach(({ key, description, platforms }) => {
      console.log(`   ${key}: ${description} (for ${platforms.join(', ')})`);
    });
    console.log('');
  }
  
  // Check for FSR .env specifically
  const fsrEnvFiles = envFiles.filter(f => f.type.includes('fsr'));
  if (fsrEnvFiles.length > 0) {
    console.log('🌌 FSR .env Files Found:');
    fsrEnvFiles.forEach(({ path, type }) => {
      console.log(`   ${type}: ${path}`);
      const fsrEnv = loadEnvFile(path);
      console.log(`   Variables: ${Object.keys(fsrEnv).join(', ')}`);
    });
    console.log('');
  } else {
    console.log('⚠️  No FSR .env files found in wallets or root');
    console.log('   Expected locations:');
    console.log('   - .env.fsr (root)');
    console.log('   - wallets/.env.fsr');
    console.log('');
  }
  
  // Summary
  console.log('📊 Summary:');
  console.log(`   Found: ${found.length} variables`);
  console.log(`   Missing: ${missing.length} required variables`);
  console.log(`   .env Files: ${envFiles.length} found`);
  console.log(`   FSR .env Files: ${fsrEnvFiles.length} found`);
  console.log('');
  
  // Recommendations
  if (missing.length > 0) {
    console.log('💡 Recommendations:');
    missing.forEach(({ key, description }) => {
      console.log(`   export ${key}=your_value_here  # ${description}`);
    });
    console.log('');
  }
  
  // Create .env.example if missing
  const envExample = join(__dirname, '.env.example');
  if (!existsSync(envExample)) {
    console.log('📝 Creating .env.example file...');
    const exampleContent = Object.entries(REQUIRED_ENV)
      .map(([key, config]) => `# ${config.description}\n${key}=${config.default || 'your_value_here'}`)
      .join('\n\n');
    writeFileSync(envExample, exampleContent);
    console.log('✅ Created .env.example\n');
  }
  
  return {
    found: found.length,
    missing: missing.length,
    envFiles: envFiles.length,
    fsrEnvFiles: fsrEnvFiles.length,
    allEnv
  };
}

// Run check
const result = checkEnvironment();

// Exit with appropriate code
process.exit(result.missing > 0 ? 1 : 0);




