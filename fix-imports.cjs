const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.jsx') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Pages have moved one level deeper.
  if (file.includes(path.join('src', 'pages'))) {
    const newContent = content
      .replace(/from\s+['"]\.\.\/components\/Hero['"]/g, "from '../../components/home/Hero'")
      .replace(/from\s+['"]\.\.\/components\/ProductGrid['"]/g, "from '../../components/product/ProductGrid'")
      .replace(/from\s+['"]\.\.\/components\/ProductCard['"]/g, "from '../../components/product/ProductCard'")
      .replace(/from\s+['"]\.\.\/components\/animations\/(.*?)['"]/g, "from '../../components/animations/$1'")
      .replace(/from\s+['"]\.\.\/data\/products['"]/g, "from '../../data/products'")
      .replace(/from\s+['"]\.\.\/context\/ShopContext['"]/g, "from '../../context/ShopContext'")
      .replace(/from\s+['"]\.\.\/components\/animations\/PageLoader['"]/g, "from '../../components/animations/PageLoader'")
      .replace(/from\s+['"]\.\.\/App\.css['"]/g, "from '../../App.css'")
      .replace(/import\s+['"]\.\/Collection\.css['"]/g, "import './Collection.css'"); // this is same directory

    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  }

  // Components moved one level deeper
  if (file.includes(path.join('src', 'components', 'layout')) || file.includes(path.join('src', 'components', 'home')) || file.includes(path.join('src', 'components', 'product'))) {
    const newContent = content
      .replace(/from\s+['"]\.\.\/context\/ShopContext['"]/g, "from '../../context/ShopContext'")
      .replace(/from\s+['"]\.\.\/data\/products['"]/g, "from '../../data/products'")
      .replace(/from\s+['"]\.\.\/components\/animations\/(.*?)['"]/g, "from '../animations/$1'")
      .replace(/from\s+['"]\.\.\/utils\/imageUrl['"]/g, "from '../../utils/imageUrl'")
      .replace(/from\s+['"]\.\/Navbar\.css['"]/g, "import './Navbar.css'")
      .replace(/from\s+['"]\.\/Footer\.css['"]/g, "import './Footer.css'");
    
    if (newContent !== content) {
      content = newContent;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
