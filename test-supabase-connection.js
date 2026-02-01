#!/usr/bin/env node

/**
 * Supabase Connection Diagnostic Script
 * This script tests your Supabase configuration and identifies connection issues
 */

const https = require('https');

// Load environment variables
const SUPABASE_URL = 'https://wmdcvvsdjhllkwgwbmoi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtZGN2dnNkamhsbGt3Z3dibW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTk2OTQsImV4cCI6MjA3Njk5NTY5NH0.vyrtD6euGeS_k73X0WPhC9o-UdF-SsapBwQ2oqxfAnA';

console.log('🔍 AutoTrack Supabase Diagnostic Tool\n');
console.log('=' .repeat(50));

// Test 1: Check if Supabase URL is reachable
async function testConnection() {
  console.log('\n📡 Test 1: Checking Supabase server connectivity...');

  return new Promise((resolve) => {
    const url = new URL(SUPABASE_URL);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/rest/v1/',
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode === 200 || res.statusCode === 401) {
        console.log('   ✅ Supabase server is reachable');
        console.log(`   Status: ${res.statusCode}`);
        resolve(true);
      } else {
        console.log(`   ❌ Unexpected status code: ${res.statusCode}`);
        resolve(false);
      }
    });

    req.on('error', (error) => {
      console.log('   ❌ Cannot reach Supabase server');
      console.log(`   Error: ${error.message}`);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      console.log('   ❌ Connection timeout (10 seconds)');
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

// Test 2: Check Auth endpoint
async function testAuth() {
  console.log('\n🔐 Test 2: Checking authentication endpoint...');

  return new Promise((resolve) => {
    const url = new URL(SUPABASE_URL);

    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/auth/v1/signup',
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 422 || res.statusCode === 400) {
          // This is expected - we're not sending valid signup data
          console.log('   ✅ Auth endpoint is accessible');
          console.log(`   Status: ${res.statusCode} (expected for invalid request)`);
          resolve(true);
        } else if (res.statusCode === 403) {
          console.log('   ❌ Authentication disabled or API key invalid');
          console.log(`   Response: ${data}`);
          resolve(false);
        } else {
          console.log(`   ⚠️  Unexpected response: ${res.statusCode}`);
          console.log(`   Response: ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('   ❌ Cannot reach auth endpoint');
      console.log(`   Error: ${error.message}`);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      console.log('   ❌ Auth endpoint timeout');
      req.destroy();
      resolve(false);
    });

    // Send empty body (will cause validation error but proves endpoint works)
    req.write(JSON.stringify({}));
    req.end();
  });
}

// Test 3: Validate credentials format
function testCredentials() {
  console.log('\n🔑 Test 3: Validating credential format...');

  let allValid = true;

  // Check URL format
  if (SUPABASE_URL.startsWith('https://') && SUPABASE_URL.includes('.supabase.co')) {
    console.log('   ✅ Supabase URL format is valid');
  } else {
    console.log('   ❌ Invalid Supabase URL format');
    allValid = false;
  }

  // Check API key format (should be a JWT)
  if (SUPABASE_ANON_KEY.startsWith('eyJ') && SUPABASE_ANON_KEY.split('.').length === 3) {
    console.log('   ✅ API key format is valid (JWT)');
  } else {
    console.log('   ❌ Invalid API key format (should be JWT)');
    allValid = false;
  }

  return allValid;
}

// Run all tests
async function runDiagnostics() {
  const credentialsValid = testCredentials();

  if (!credentialsValid) {
    console.log('\n❌ Credential format issues detected!');
    console.log('\n💡 SOLUTION:');
    console.log('   1. Go to your Supabase dashboard');
    console.log('   2. Navigate to Settings > API');
    console.log('   3. Copy the correct Project URL and anon key');
    console.log('   4. Update frontend/.env.local with the correct values\n');
    return;
  }

  const connectionOk = await testConnection();
  const authOk = await testAuth();

  console.log('\n' + '='.repeat(50));
  console.log('\n📊 DIAGNOSTIC RESULTS:\n');

  if (connectionOk && authOk) {
    console.log('✅ All tests passed!');
    console.log('\n🤔 If signup still fails, the issue might be:');
    console.log('   1. Email provider not enabled in Supabase');
    console.log('   2. Email confirmations blocking signup');
    console.log('   3. Browser-specific issue (check DevTools console)');
    console.log('\n💡 NEXT STEPS:');
    console.log('   1. Open Supabase Dashboard');
    console.log('   2. Go to Authentication > Providers');
    console.log('   3. Ensure "Email" provider is enabled');
    console.log('   4. Under Authentication > Email Templates');
    console.log('      - Consider disabling "Confirm email" for testing');
  } else if (!connectionOk) {
    console.log('❌ Cannot connect to Supabase server');
    console.log('\n💡 POSSIBLE CAUSES:');
    console.log('   1. Supabase project is paused/deleted');
    console.log('   2. Network firewall blocking connection');
    console.log('   3. Invalid project URL');
    console.log('\n🔧 SOLUTIONS:');
    console.log('   1. Check if project exists in Supabase dashboard');
    console.log('   2. If deleted, create new project and update .env.local');
    console.log('   3. Check network connection and firewall settings');
  } else if (!authOk) {
    console.log('❌ Authentication endpoint issue');
    console.log('\n💡 POSSIBLE CAUSES:');
    console.log('   1. Email authentication is disabled');
    console.log('   2. Invalid or expired API key');
    console.log('   3. Project settings preventing signups');
    console.log('\n🔧 SOLUTIONS:');
    console.log('   1. Enable email auth in Supabase Dashboard:');
    console.log('      - Authentication > Providers > Email');
    console.log('   2. Regenerate API keys if needed:');
    console.log('      - Settings > API > Project API keys');
  }

  console.log('\n' + '='.repeat(50) + '\n');
}

// Execute diagnostics
runDiagnostics().catch(console.error);
