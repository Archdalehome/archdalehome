const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 获取images目录下的所有图片文件
function getImageFiles() {
  const imageDir = 'images';
  const images = [];
  
  try {
    const files = fs.readdirSync(imageDir);
    
    for (const filename of files) {
      if (/\.(jpg|jpeg|png|gif)$/i.test(filename)) {
        // 从文件名中提取价格信息
        const priceMatch = filename.match(/【(.+?)元】|\s+(\d+)\s*元/i);
        const price = priceMatch ? (priceMatch[1] || priceMatch[2]) : '';
        
        // 从文件名中提取标题（移除价格部分）
        let title = filename.replace(/\.(jpg|jpeg|png|gif)$/i, '')
                            .replace(/【.+?元】/, '')
                            .replace(/\s+\d+\s*元/, '')
                            .trim();
        
        images.push({
          path: path.join(imageDir, filename).replace(/\\/g, '/'),
          name: filename,
          title: title,
          price: price
        });
      }
    }
  } catch (error) {
    console.error('Error reading images directory:', error);
  }
  
  return images;
}

// 更新images.json文件
function updateImagesJson() {
  const images = getImageFiles();
  const data = { images };
  
  try {
    fs.writeFileSync(
      'images.json',
      JSON.stringify(data, null, 2),
      'utf8'
    );
    console.log('images.json has been updated successfully!');
  } catch (error) {
    console.error('Error writing images.json:', error);
  }
}

// 执行构建过程
console.log('Starting build process...');
updateImagesJson();
console.log('Build process completed!');