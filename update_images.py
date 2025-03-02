import os
import json
import re

# 获取images目录下的所有图片文件
def get_image_files():
    image_dir = "images"
    images = []
    for filename in os.listdir(image_dir):
        if filename.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
                    # 从文件名中提取价格信息
            price = ''
            title = filename
            size = ''
            
            # 1. 提取价格信息
            price_patterns = [
                r'【(\d[\d,]*)元】',
                r'\s+(\d[\d,]*)\s*元(?![^\(\)]*\))',
                r'\s+Price\s+(\d[\d,]*)\s*RMB'
            ]
            
            for pattern in price_patterns:
                match = re.search(pattern, title)
                if match:
                    price = match.group(1).replace(',', '')
                    title = re.sub(pattern, '', title)
                    break
            
            # 2. 提取尺寸信息
            size_match = re.search(r'\(((?![\d,]+元)[^\)]+)\)', title)
            if size_match:
                size = size_match.group(1).strip()
                title = re.sub(r'\([^\)]+\)', '', title)
            
            # 3. 清理和格式化标题
            title = re.sub(r'\.(jpg|jpeg|png|gif)$', '', title, flags=re.I)
            title = re.sub(r'\s+', ' ', title)
            title = title.strip()
            
            images.append({
                "path": os.path.join(image_dir, filename).replace("\\", "/"),
                "name": filename,
                "title": title,
                "price": price,
                "size": size
            })
    return images

# 更新images.json文件
def update_images_json():
    images = get_image_files()
    data = {"images": images}
    
    with open("images.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("images.json has been updated successfully!")

if __name__ == "__main__":
    update_images_json()