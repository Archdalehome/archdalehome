import os
import json

def update_images_json():
    # 指定图片目录
    images_dir = 'images'
    
    # 获取所有jpg文件
    image_files = []
    for file in os.listdir(images_dir):
        if file.lower().endswith('.jpg'):
            # 使用正斜杠以确保URL格式正确
            image_path = f'{images_dir}/{file}'
            image_files.append(image_path)
    
    # 按文件名排序
    image_files.sort()
    
    # 将图片列表写入images.json文件
    with open('images.json', 'w', encoding='utf-8') as f:
        json.dump(image_files, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    update_images_json()
    print('images.json has been updated successfully!')