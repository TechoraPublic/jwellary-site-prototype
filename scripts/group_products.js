import fs from 'fs';
import path from 'path';

const productsJsPath = path.join(process.cwd(), 'src', 'data', 'products.js');
const imgDirPath = path.join(process.cwd(), 'public', 'img');

function toTitleCase(str) {
    return str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function main() {
    // 1. Read existing products
    let productsText = fs.readFileSync(productsJsPath, 'utf8');
    const arrayStartIndex = productsText.indexOf('[');
    const arrayEndIndex = productsText.lastIndexOf(']') + 1;
    let productsArray = JSON.parse(productsText.substring(arrayStartIndex, arrayEndIndex));

    const folders = fs.readdirSync(imgDirPath).filter(f => fs.statSync(path.join(imgDirPath, f)).isDirectory());
    
    const newProducts = [];
    
    for (const folder of folders) {
        const productKeyMatch = folder.match(/^\d+-(.+)$/);
        if (!productKeyMatch) continue;
        const productKey = productKeyMatch[1];
        
        const folderPath = path.join(imgDirPath, folder);
        const images = fs.readdirSync(folderPath).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
        
        if (images.length === 0) continue;
        
        // Find existing product matching this folder to grab price/category/name
        const matchedExistingProd = productsArray.find(p => p.image && p.image.includes(`/${folder}/`));
        
        if (matchedExistingProd) {
            // Remove "(View X)" from name if exists
            const cleanName = matchedExistingProd.name.replace(/\s*\(View \d+\)/, '');
            
            const newProduct = {
                ...matchedExistingProd,
                id: productKey, // use product key as a robust ID
                name: cleanName,
                image: `/img/${folder}/${images[0]}`,
                images: images.map(img => `/img/${folder}/${img}`)
            };
            
            newProducts.push(newProduct);
        }
    }

    const newProductsText = `export const products = ${JSON.stringify(newProducts, null, 2)};\n\nexport const getProductById = (id) => products.find(p => p.id === id);\nexport const getFeaturedProducts = () => products.filter(p => p.featured);\n`;
    fs.writeFileSync(productsJsPath, newProductsText, 'utf8');
    console.log(`Updated products.js! Found ${newProducts.length} unique products.`);
}

main();
