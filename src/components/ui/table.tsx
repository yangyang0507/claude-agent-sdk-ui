/**
 * Table 组件 - 自定义实现
 * 使用 cli-table3 渲染表格
 */

import React from 'react';
import { Text } from 'ink';
import CliTable3 from 'cli-table3';
import type { Theme } from '../../types/theme.js';

/**
 * 表格数据类型
 */
export type TableData = Record<string, any>[];

/**
 * Table 组件属性
 */
export interface TableProps {
  /** 表格数据 */
  data: TableData;
  /** 主题 */
  theme?: Theme;
  /** 是否显示表头 */
  showHeader?: boolean;
  /** 单元格内边距 */
  padding?: number;
  /** 列配置 */
  columns?: Array<{
    key: string;
    header?: string;
    width?: number;
    align?: 'left' | 'center' | 'right';
  }>;
}

/**
 * Table 组件
 *
 * 渲染表格数据，支持主题定制
 *
 * @example
 * ```tsx
 * <Table
 *   data={[
 *     { name: 'Alice', age: 25 },
 *     { name: 'Bob', age: 30 }
 *   ]}
 *   theme={theme}
 * />
 * ```
 */
export const Table: React.FC<TableProps> = ({
  data,
  theme: _theme,
  showHeader = true,
  padding: _padding = 1,
  columns,
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  // 获取表头
  const headers = columns
    ? columns.map((col) => col.header || col.key)
    : Object.keys(data[0]);

  // 准备表格数据
  const table = new CliTable3({
    head: showHeader ? headers : undefined,
    style: {
      head: [],
      border: [],
    },
  });

  // 添加数据行
  data.forEach((row) => {
    const values = columns
      ? columns.map((col) => String(row[col.key] ?? ''))
      : Object.values(row).map((v) => String(v ?? ''));
    table.push(values);
  });

  return <Text>{table.toString()}</Text>;
};

/**
 * 默认导出
 */
export default Table;
