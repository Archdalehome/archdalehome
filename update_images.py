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
            price_match = re.search(r'【(.+?)元】|\s+(\d+)\s*元', filename)
            price = price_match.group(1) or price_match.group(2) if price_match else ''
            
            # 从文件名中提取标题（移除价格部分）
            title = filename
            title = re.sub(r'\.(jpg|jpeg|png|gif)$', '', title, flags=re.I)
            title = re.sub(r'【.+?元】', '', title)
            title = re.sub(r'\s+\d+\s*元', '', title)
            title = title.strip()
            
            images.append({
                "path": os.path.join(image_dir, filename).replace("\\", "/"),
                "name": filename,
                "title": title,
                "price": price
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