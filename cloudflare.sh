#!/bin/bash

# 首先执行JavaScript脚本更新images.json
node build_cloudflare.js

# 构建完成提示
echo "Cloudflare build completed successfully!"