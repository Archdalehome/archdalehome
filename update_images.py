import os
import json
import re

# 获取images目录下的所有图片文件
def get_image_files():
    image_dir = "images"
    images = []
    for filename in os.listdir(image_dir):
        if filename.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
            # 从文件名中提取信息
            price = ''
            title = filename
            size = ''
            category = ''
            
            # 1. 提取分类信息
            category_match = re.search(r'^\[(.*?)\]', title)
            if category_match:
                category = category_match.group(1).strip()
                title = re.sub(r'^\[.*?\]', '', title)
            
            # 2. 提取价格信息
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
            
            # 3. 提取尺寸信息
            size_match = re.search(r'\(((?![\d,]+元)[^\)]+)\)', title)
            if size_match:
                size = size_match.group(1).strip()
                title = re.sub(r'\([^\)]+\)', '', title)
            
            # 4. 清理和格式化标题
            title = re.sub(r'\.(jpg|jpeg|png|gif)$', '', title, flags=re.I)
            title = re.sub(r'\s+', ' ', title)
            title = title.strip()
            
            images.append({
                "path": os.path.join(image_dir, filename).replace("\\", "/"),
                "name": filename,
                "title": title,
                "price": price,
                "size": size,
                "category": category
            })
    
    # 从category中提取数字前缀作为排序依据
    def get_category_order(image):
        category = image['category']
        match = re.match(r'^(\d+)', category)
        order = int(match.group(1)) if match else float('inf')
        return (order, image['name'].lower())
    
    # 按category的数字前缀排序，然后按文件名字母顺序排序
    sorted_images = sorted(images, key=get_category_order)
    return sorted_images

# 更新images.json文件
def update_images_json():
    images = get_image_files()
    data = {"images": images}
    
    with open("images.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print("images.json has been updated successfully!")

if __name__ == "__main__":
    update_images_json()