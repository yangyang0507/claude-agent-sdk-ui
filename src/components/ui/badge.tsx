/**
 * Badge Component - Ink 版本
 * 使用 Ink 的 Text 组件实现徽章
 */

import React from 'react';
import { Text } from 'ink';
import type { Theme } from '../../types/theme.js';

/**
 * Badge 类型
 */
export type BadgeType = 'success' | 'error' | 'warning' | 'info' | 'custom';

/**
 * Badge 样式
 */
export type BadgeStyle = 'filled' | 'outlined';

/**
 * Badge 组件属性
 */
export interface BadgeProps {
  /** 徽章文本 */
  children: React.ReactNode;
  /** 徽章类型 */
  type?: BadgeType;
  /** 自定义颜色（type 为 custom 时使用） */
  color?: string;
  /** 样式 */
  style?: BadgeStyle;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 是否加粗 */
  bold?: boolean;
  /** 主题 */
  theme?: Theme;
}

/**
 * 类型图标映射
 */
const typeIcons: Record<Exclude<BadgeType, 'custom'>, string> = {
  success: '✓',
  error: '✗',
  warning: '⚠',
  info: 'ℹ',
};

/**
 * 类型颜色映射
 */
const getTypeColor = (type: BadgeType, theme?: Theme): string => {
  if (!theme) {
    // 默认颜色
    return type === 'success'
      ? 'green'
      : type === 'error'
      ? 'red'
      : type === 'warning'
      ? 'yellow'
      : 'blue';
  }

  // 使用主题颜色
  return type === 'success'
    ? theme.colors.success
    : type === 'error'
    ? theme.colors.error
    : type === 'warning'
    ? theme.colors.warning
    : theme.colors.info;
};

/**
 * Badge 组件
 *
 * @example
 * ```tsx
 * <Badge type="success">SUCCESS</Badge>
 * <Badge type="error" showIcon>FAILED</Badge>
 * <Badge type="custom" color="magenta">CUSTOM</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  type = 'info',
  color,
  style = 'filled',
  showIcon = true,
  bold = true,
  theme,
}) => {
  // 确定颜色
  const badgeColor = type === 'custom' && color ? color : getTypeColor(type, theme);

  // 构建文本内容
  const icon = type !== 'custom' && showIcon ? typeIcons[type] : '';
  const text = icon ? `${icon} ${children}` : children;

  // 根据样式渲染
  if (style === 'outlined') {
    return (
      <Text bold={bold} color={badgeColor}>
        [{text}]
      </Text>
    );
  }

  // filled 样式
  return (
    <Text bold={bold} backgroundColor={badgeColor as any} color="black">
      {` ${text} `}
    </Text>
  );
};

/**
 * 便捷函数 - Success Badge
 */
export const SuccessBadge: React.FC<Omit<BadgeProps, 'type'>> = (props) => (
  <Badge type="success" {...props} />
);

/**
 * 便捷函数 - Error Badge
 */
export const ErrorBadge: React.FC<Omit<BadgeProps, 'type'>> = (props) => (
  <Badge type="error" {...props} />
);

/**
 * 便捷函数 - Warning Badge
 */
export const WarningBadge: React.FC<Omit<BadgeProps, 'type'>> = (props) => (
  <Badge type="warning" {...props} />
);

/**
 * 便捷函数 - Info Badge
 */
export const InfoBadge: React.FC<Omit<BadgeProps, 'type'>> = (props) => (
  <Badge type="info" {...props} />
);

/**
 * 创建 Badge 组件的辅助函数
 */
export const createBadge = (props: BadgeProps) => <Badge {...props} />;
