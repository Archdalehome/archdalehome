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
        console.log('\n处理文件:', filename);
        
        // 解析文件名的各个部分
        let price = '';
        let title = filename;
        let size = '';
        
        // 1. 提取并移除价格信息
        const pricePatterns = [
          { pattern: /【(\d[\d,]*)元】/, group: 1 },
          { pattern: /\s+(\d[\d,]*)\s*元(?![^\(\)]*\))/, group: 1 },
          { pattern: /\s+Price\s+(\d[\d,]*)\s*RMB/, group: 1 }
        ];
        
        for (const { pattern, group } of pricePatterns) {
          const match = title.match(pattern);
          if (match) {
            price = match[group].replace(/,/g, '');
            title = title.replace(match[0], '');
            console.log('找到价格:', price, '元');
            break;
          }
        }
        
        // 2. 提取并移除尺寸信息
        const sizeMatch = title.match(/\(((?![\d,]+元)[^\)]+)\)/);
        if (sizeMatch) {
          size = sizeMatch[1].trim();
          title = title.replace(sizeMatch[0], '');
          console.log('找到尺寸:', size);
        }
        
        // 3. 清理和格式化标题
        title = title
          .replace(/\.(jpg|jpeg|png|gif)$/i, '')
          .replace(/\s+/g, ' ')
          .trim();
        
        console.log('处理后的标题:', title);
        console.log('最终结果:', {
          title: title,
          price: price,
          size: size
        });
        
        // 确保在所有环境下都使用正确的路径格式
        const imagePath = path.join(imageDir, filename).replace(/\\/g, '/');
        console.log(`Processing image: ${filename}`);
        console.log(`Generated path: ${imagePath}`);
        
        images.push({
          path: imagePath,
          name: filename,
          title: title,
          price: price,
          size: size
        });
      }
    }
  } catch (error) {
    console.error('Error reading images directory:', error);
    console.error('Current working directory:', process.cwd());
    console.error('Attempted to read directory:', path.resolve(imageDir));
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
    console.error('Current working directory:', process.cwd());
    console.error('Generated data:', JSON.stringify(data, null, 2));
    process.exit(1);
  }
}

// 执行更新
console.log('Starting Cloudflare build process...');
updateImagesJson();
console.log('Cloudflare build process completed!');