const fs = require('fs');
const path = require('path');

// 获取images目录下的所有图片文件
function getImageFiles() {
  const imageDir = 'images';
  const images = [];
  
  try {
    const files = fs.readdirSync(imageDir);
    
    for (const filename of files) {
      const ext = path.extname(filename).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
        images.push({
          path: path.join(imageDir, filename).replace(/\\/g, '/'),
          name: filename
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
      { encoding: 'utf8' }
    );
    console.log('images.json has been updated successfully!');
  } catch (error) {
    console.error('Error writing images.json:', error);
  }
}

// 执行更新
updateImagesJson();