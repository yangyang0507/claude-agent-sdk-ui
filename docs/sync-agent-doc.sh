#!/bin/bash

# 设置颜色输出
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="${SCRIPT_DIR}/agent-sdk-docs"

# 文档 URL 列表
docs=(
https://docs.claude.com/en/api/agent-sdk/cost-tracking.md
https://docs.claude.com/en/api/agent-sdk/custom-tools.md
https://docs.claude.com/en/api/agent-sdk/mcp.md
https://docs.claude.com/en/api/agent-sdk/modifying-system-prompts.md
https://docs.claude.com/en/api/agent-sdk/overview.md
https://docs.claude.com/en/api/agent-sdk/permissions.md
https://docs.claude.com/en/api/agent-sdk/python.md
https://docs.claude.com/en/api/agent-sdk/sessions.md
https://docs.claude.com/en/api/agent-sdk/slash-commands.md
https://docs.claude.com/en/api/agent-sdk/streaming-vs-single-mode.md
https://docs.claude.com/en/api/agent-sdk/subagents.md
https://docs.claude.com/en/api/agent-sdk/todo-tracking.md
https://docs.claude.com/en/api/agent-sdk/typescript.md
)

echo -e "${YELLOW}开始同步 Claude Agent SDK 文档...${NC}"

# 创建目标目录（如果不存在）
mkdir -p "${TARGET_DIR}"

# 计数器
success_count=0
fail_count=0
total_count=${#docs[@]}

# 下载每个文档
for url in "${docs[@]}"; do
    # 从 URL 中提取文件名
    filename=$(basename "$url")
    target_file="${TARGET_DIR}/${filename}"
    
    echo -e "\n正在下载: ${filename}"
    
    # 使用 curl 下载文件
    if curl -f -s -o "${target_file}" "${url}"; then
        echo -e "${GREEN}✓ 成功: ${filename}${NC}"
        ((success_count++))
    else
        echo -e "${RED}✗ 失败: ${filename}${NC}"
        ((fail_count++))
    fi
done

# 输出统计信息
echo -e "\n${YELLOW}========================================${NC}"
echo -e "${YELLOW}同步完成！${NC}"
echo -e "总计: ${total_count} 个文件"
echo -e "${GREEN}成功: ${success_count}${NC}"
if [ $fail_count -gt 0 ]; then
    echo -e "${RED}失败: ${fail_count}${NC}"
fi
echo -e "${YELLOW}========================================${NC}"

# 如果有失败的文件，返回非零退出码
if [ $fail_count -gt 0 ]; then
    exit 1
fi