import fs from 'fs';
import path from 'path';

const mappingPath = path.join(process.cwd(), 'mapping.json');
const productsJsPath = path.join(process.cwd(), 'src', 'data', 'products.js');
const imgDirPath = path.join(process.cwd(), 'public', 'img');

function toTitleCase(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function toSlug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
    // 1. Read mappings
    const mappingData = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
    const map = {};
    for (const item of mappingData) {
        if (!map[item.matched_product_key]) {
            map[item.matched_product_key] = item;
        } else {
            // Prefer items with actual extracted names/prices
            if (item.extracted_name && !map[item.matched_product_key].extracted_name) {
                map[item.matched_product_key].extracted_name = item.extracted_name;
            }
            if (item.extracted_price && !map[item.matched_product_key].extracted_price) {
                map[item.matched_product_key].extracted_price = item.extracted_price;
            }
        }
    }

    // 2. Read products.js
    let productsText = fs.readFileSync(productsJsPath, 'utf8');
    const arrayStartIndex = productsText.indexOf('[');
    const arrayEndIndex = productsText.lastIndexOf(']') + 1;
    let productsArray = JSON.parse(productsText.substring(arrayStartIndex, arrayEndIndex));

    // 3. Iterate through img folders and rename
    const folders = fs.readdirSync(imgDirPath).filter(f => fs.statSync(path.join(imgDirPath, f)).isDirectory());
    
    for (const folder of folders) {
        // e.g. folder = "01-gold-blue-floral-necklace"
        const productKeyMatch = folder.match(/^\d+-(.+)$/);
        if (!productKeyMatch) continue;
        const productKey = productKeyMatch[1];
        
        const mapData = map[productKey] || {};
        const realName = mapData.extracted_name || toTitleCase(productKey);
        const realPrice = mapData.extracted_price || 999; // default fallback
        const nameSlug = toSlug(realName);

        const folderPath = path.join(imgDirPath, folder);
        const images = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
        
        for (let i = 0; i < images.length; i++) {
            const oldImage = images[i];
            const ext = path.extname(oldImage);
            // new image name: slug-1.jpg, slug-2.jpg etc
            const newImageName = images.length > 1 ? `${nameSlug}-${i + 1}${ext}` : `${nameSlug}${ext}`;
            
            const oldImagePath = path.join(folderPath, oldImage);
            const newImagePath = path.join(folderPath, newImageName);
            
            // Rename file
            fs.renameSync(oldImagePath, newImagePath);
            console.log(`Renamed: ${oldImage} -> ${newImageName}`);
            
            // Update products.js entry that corresponds to this old image
            // We find the product entry that has an image path ending with oldImage
            for (const prod of productsArray) {
                if (prod.image.endsWith(`/${oldImage}`)) {
                    prod.name = `${realName}${images.length > 1 ? ` (View ${i + 1})` : ''}`;
                    prod.price = parseInt(realPrice, 10);
                    if (prod.originalPrice) {
                        prod.originalPrice = Math.floor(prod.price * 1.25);
                    }
                    prod.description = `Beautiful ${prod.category} crafted with precision. ${realName}.`;
                    prod.image = `/img/${folder}/${newImageName}`;
                }
            }
        }
    }

    // 4. Write back products.js
    const newProductsText = `export const products = ${JSON.stringify(productsArray, null, 2)};\n`;
    fs.writeFileSync(productsJsPath, newProductsText, 'utf8');
    console.log("Updated products.js successfully!");
}

main().catch(console.error);
