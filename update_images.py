import os
import json

# 获取images目录下的所有图片文件
def get_image_files():
    image_dir = "images"
    images = []
    for filename in os.listdir(image_dir):
        if filename.lower().endswith((".jpg", ".jpeg", ".png", ".gif")):
            images.append({
                "path": os.path.join(image_dir, filename).replace("\\", "/"),
                "name": filename
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