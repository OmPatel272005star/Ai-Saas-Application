// test-models.js
import dotenv from 'dotenv';
dotenv.config();

async function testGeminiAPI() {
  const API_KEY = process.env.GEMINI_API_KEY;
  
  console.log("API Key (first 10 chars):", API_KEY?.substring(0, 10));
  console.log("\n=== Testing Gemini API ===\n");

  // List of models to test
  const modelsToTest = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-2.0-flash-exp',
    'gemini-pro'
  ];

  for (const modelName of modelsToTest) {
    console.log(`\nTesting: ${modelName}`);
    console.log('---');
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Say hello in one word"
            }]
          }]
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        console.log(`✅ SUCCESS! Response: ${text.substring(0, 50)}`);
        console.log(`   This model works! Use: "${modelName}"`);
        break; // Stop after finding first working model
      } else {
        const errorData = await response.json();
        console.log(`❌ FAILED: ${response.status}`);
        console.log(`   Error: ${errorData.error?.message || JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
  }
}

testGeminiAPI();