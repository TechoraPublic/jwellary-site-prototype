import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const screenshotsDir = path.join(process.cwd(), 'price name ss');
const manifestPath = path.join(process.cwd(), 'public', 'img', 'product_manifest.csv');
const outputPath = path.join(process.cwd(), 'mapping.json');

async function main() {
    // 1. Read the manifest to get the product keys
    const manifestText = fs.readFileSync(manifestPath, 'utf8');
    const lines = manifestText.split('\n').slice(1).filter(l => l.trim().length > 0);
    const productKeys = lines.map(l => l.split(',')[1].trim());

    console.log(`Found ${productKeys.length} product keys.`);

    // 2. Read the screenshots
    const screenshots = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
    console.log(`Found ${screenshots.length} screenshots.`);

    const results = [];

    // 3. Process each screenshot
    for (let i = 0; i < screenshots.length; i++) {
        const file = screenshots[i];
        const filePath = path.join(screenshotsDir, file);
        
        console.log(`Processing ${i + 1}/${screenshots.length}: ${file}`);
        
        try {
            const fileData = fs.readFileSync(filePath);
            const base64Data = fileData.toString('base64');
            
            const prompt = `You are an expert product identifier. I am giving you a screenshot of a jewelry product.
            
Task:
1. Extract the EXACT product name written in the screenshot (if any). It might be in the caption like "The Celeste Pavé Band Ring 199".
2. Extract the EXACT price written in the screenshot. If the text says "199", the price is 199.
3. Compare the jewelry shown in the image to this list of available product keys and select the ONE that matches best visually and textually:
[ ${productKeys.join(', ')} ]

Return ONLY a valid JSON object (no markdown formatting, just the raw JSON) with the following structure:
{
  "extracted_name": "Name from image (or null if none)",
  "extracted_price": 199,
  "matched_product_key": "the-matching-key-from-the-list"
}`;

            const response = await ai.models.generateContent({
                model: 'gemini-3.6-flash',
                contents: [
                    { role: 'user', parts: [
                        { inlineData: { data: base64Data, mimeType: 'image/jpeg' } },
                        { text: prompt }
                    ]}
                ]
            });
            
            let responseText = response.text;
            if (responseText.startsWith('```json')) {
                responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            }
            
            const parsed = JSON.parse(responseText);
            parsed.screenshot = file;
            results.push(parsed);
            
            console.log(`  -> Matched: ${parsed.matched_product_key}, Name: ${parsed.extracted_name}, Price: ${parsed.extracted_price}`);
            
            // Write intermediate results just in case
            fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
            
            // Simple rate limiting delay
            await new Promise(r => setTimeout(r, 2000));
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }
    
    console.log(`Done! Results saved to ${outputPath}`);
}

main().catch(console.error);
