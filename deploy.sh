#!/bin/bash

# Vue 项目部署脚本
# 用法: ./deploy.sh [环境]
# 示例: ./deploy.sh production

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ENV=${1:-production}

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Vue 项目部署脚本${NC}"
echo -e "${GREEN}  环境: $ENV${NC}"
echo -e "${GREEN}========================================${NC}"

# 1. 清理旧构建
echo -e "\n${YELLOW}[1/5] 清理旧构建...${NC}"
rm -rf dist/

# 2. 安装依赖
echo -e "\n${YELLOW}[2/5] 安装依赖...${NC}"
npm ci

# 3. 构建项目
echo -e "\n${YELLOW}[3/5] 构建项目...${NC}"
npm run build

# 4. 检查构建结果
if [ ! -d "dist" ]; then
    echo -e "${RED}构建失败！dist 目录不存在${NC}"
    exit 1
fi

echo -e "${GREEN}构建成功！${NC}"
du -sh dist/

# 5. 部署选项
echo -e "\n${YELLOW}[4/5] 选择部署方式:${NC}"
echo "1) 本地预览 (npm run preview)"
echo "2) 复制到服务器目录"
echo "3) 构建 Docker 镜像"
echo "4) 仅构建（手动部署）"
read -p "请选择 (1-4): " choice

case $choice in
    1)
        echo -e "${GREEN}启动本地预览服务器...${NC}"
        npm run preview
        ;;
    2)
        read -p "请输入服务器路径 (如 /var/www/html): " server_path
        echo -e "${YELLOW}复制文件到 $server_path${NC}"
        cp -r dist/* $server_path/
        echo -e "${GREEN}部署完成！${NC}"
        ;;
    3)
        echo -e "${YELLOW}构建 Docker 镜像...${NC}"
        docker build -t notespace-frontend:latest .
        echo -e "${GREEN}Docker 镜像构建完成！${NC}"
        echo "运行: docker run -p 80:80 notespace-frontend:latest"
        ;;
    4)
        echo -e "${GREEN}构建产物位于 dist/ 目录${NC}"
        echo "请手动部署到服务器"
        ;;
    *)
        echo -e "${RED}无效选择${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}  部署完成！${NC}"
echo -e "${GREEN}========================================${NC}"
