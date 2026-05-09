// Script to verify Vite version for Cloudflare validation
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Vite Version Verification ===');

// Check package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const packageVersion = packageJson.devDependencies.vite || packageJson.dependencies.vite;
console.log('Package.json Vite version:', packageVersion);

// Check installed version
try {
  const installedVersion = execSync('npx vite --version', { encoding: 'utf8' }).trim();
  console.log('Installed Vite version:', installedVersion);
  
  // Extract just the version number
  const versionMatch = installedVersion.match(/vite\/(\d+\.\d+\.\d+)/);
  if (versionMatch) {
    const cleanVersion = versionMatch[1];
    console.log('Clean version number:', cleanVersion);
    
    // Check if it meets Cloudflare requirements
    const [major] = cleanVersion.split('.').map(Number);
    if (major >= 6) {
      console.log('✅ Vite version meets Cloudflare requirements (>= 6.0.0)');
    } else {
      console.log('❌ Vite version does NOT meet Cloudflare requirements');
    }
  }
} catch (error) {
  console.error('Error checking Vite version:', error.message);
}

// Check node_modules
const nodeModulesPath = path.join(__dirname, 'node_modules', 'vite', 'package.json');
if (fs.existsSync(nodeModulesPath)) {
  const nodeModulesVersion = JSON.parse(fs.readFileSync(nodeModulesPath, 'utf8')).version;
  console.log('Node modules Vite version:', nodeModulesVersion);
} else {
  console.log('Vite not found in node_modules');
}

console.log('=== End Verification ===');
