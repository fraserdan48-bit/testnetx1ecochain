#!/usr/bin/env node

// Simple backend validation script
console.log('🔍 Validating X1 EcoChain Backend...\n');

// Check if required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'server.js',
  'package.json',
  'models/User.js',
  'routes/user.js',
  'services/discord.js',
  'middleware/browserInfo.js',
  '.env.local'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file} - Found`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

console.log('\n📋 Checking package.json dependencies...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredDeps = ['express', 'mongoose', 'cors', 'dotenv', 'ua-parser-js', 'axios'];

  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} - Listed in dependencies`);
    } else {
      console.log(`❌ ${dep} - Missing from dependencies`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Error reading package.json');
  allFilesExist = false;
}

console.log('\n🔧 Checking environment variables...');
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const requiredEnvVars = ['MONGODB_URI', 'DISCORD_WEBHOOK_URL'];

  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar} - Found in .env.local`);
    } else {
      console.log(`❌ ${envVar} - Missing from .env.local`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ Error reading .env.local');
  allFilesExist = false;
}

console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 Backend validation PASSED!');
  console.log('Ready for deployment to Render.');
  console.log('\nNext steps:');
  console.log('1. Push code to GitHub');
  console.log('2. Connect Render to your GitHub repo');
  console.log('3. Set environment variables in Render dashboard');
  console.log('4. Deploy!');
} else {
  console.log('❌ Backend validation FAILED!');
  console.log('Please fix the missing files/dependencies before deploying.');
}
console.log('='.repeat(50));