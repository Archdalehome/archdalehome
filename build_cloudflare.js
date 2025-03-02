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
        
        // 使用正斜杠作为路径分隔符，确保在Cloudflare Pages环境中正常工作
        const imagePath = `${imageDir}/${filename}`;
        
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
    process.exit(1);
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
    console.error('Error updating images.json:', error);
    process.exit(1);
  }
}

// 执行更新
console.log('Starting Cloudflare build process...');
updateImagesJson();
console.log('Cloudflare build process completed!');