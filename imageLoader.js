// 判断是否为本地开发环境
const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// 从目录中加载图片
async function loadImagesFromDirectory() {
    try {
        const response = await fetch('/images/');
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const links = Array.from(doc.querySelectorAll('a'));
        
        const imageFiles = links
            .filter(link => {
                const href = link.getAttribute('href');
                return href && href.match(/\.(jpg|jpeg|png|gif)$/i);
            })
            .map(link => {
                const href = link.getAttribute('href');
                return {
                    path: `images/${href}`,
                    name: decodeURIComponent(href)
                };
            });

        return { images: imageFiles };
    } catch (error) {
        console.error('Error loading images from directory:', error);
        return { images: [] };
    }
}

// 从images.json加载图片
async function loadImagesFromJson() {
    try {
        const response = await fetch('/images.json');
        return await response.json();
    } catch (error) {
        console.error('Error loading images from JSON:', error);
        return { images: [] };
    }
}

// 导出加载函数
export async function loadImages() {
    return loadImagesFromJson();
}