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
        // 从文件名中提取价格信息，支持多种格式
        const priceMatch = filename.match(/【(.+?)元】|\s+(\d+)\s*元|\s+Price\s+(\d+)\s*RMB|\s+(\d+(?:,\d+)?)\s*元/i);
        const price = priceMatch ? (priceMatch[1] || priceMatch[2] || priceMatch[3] || priceMatch[4]) : '';
        
        // 从文件名中提取尺寸信息（如果有）
        const sizeMatch = filename.match(/\((.*?)\)/i);
        const size = sizeMatch ? sizeMatch[1] : '';
        
        // 从文件名中提取标题（移除价格部分和尺寸部分）
        let title = filename.replace(/\.(jpg|jpeg|png|gif)$/i, '')
                            .replace(/【.+?元】/, '')
                            .replace(/\s+\d+(?:,\d+)?\s*元/, '')
                            .replace(/\s+Price\s+\d+\s*RMB/, '')
                            .replace(/\(.*?\)/, '')
                            .trim();
        
        // 确保在所有环境下都使用正确的路径格式
        const imagePath = path.join(imageDir, filename).replace(/\\/g, '/');
        console.log(`Processing image: ${filename}`);
        console.log(`Generated path: ${imagePath}`);
        
        images.push({
          path: imagePath,
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