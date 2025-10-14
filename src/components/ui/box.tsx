/**
 * Box Component - Ink 版本
 * 使用 Ink 的 Box 组件实现边框盒子
 */

import React from 'react';
import { Box as InkBox, Text } from 'ink';
import type { Theme } from '../../types/theme.js';

/**
 * Box 边框样式
 */
export type BoxBorderStyle = 'single' | 'double' | 'round' | 'bold' | 'classic' | 'none';

/**
 * Box 对齐方式
 */
export type BoxAlign = 'left' | 'center' | 'right';

/**
 * Box 组件属性
 */
export interface BoxProps {
  /** 子元素 */
  children: React.ReactNode;
  /** 边框样式 */
  borderStyle?: BoxBorderStyle;
  /** 边框颜色 */
  borderColor?: string;
  /** 内边距 */
  padding?: number;
  /** 外边距 */
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  /** 标题 */
  title?: string;
  /** 标题对齐 */
  titleAlignment?: BoxAlign;
  /** 最小宽度 */
  minWidth?: number;
  /** 最大宽度 */
  maxWidth?: number;
  /** 主题 */
  theme?: Theme;
}

/**
 * Box 组件
 *
 * @example
 * ```tsx
 * <Box borderStyle="round" borderColor="cyan" title="Info">
 *   <Text>Content here</Text>
 * </Box>
 * ```
 */
export const Box: React.FC<BoxProps> = ({
  children,
  borderStyle = 'single',
  borderColor,
  padding = 1,
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  title,
  minWidth: _minWidth, // Ink Box 不支持 minWidth，保留参数以兼容 API
  maxWidth,
  theme,
}) => {
  // 如果没有边框，只返回带边距的内容
  if (borderStyle === 'none') {
    return (
      <InkBox
        paddingTop={marginTop}
        paddingBottom={marginBottom}
        paddingLeft={marginLeft}
        paddingRight={marginRight}
        flexDirection="column"
        width={maxWidth}
      >
        {children}
      </InkBox>
    );
  }

  // 确定边框样式的映射
  const borderStyleMap: 'single' | 'double' | 'round' | 'bold' | 'classic' = borderStyle;

  return (
    <InkBox
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      flexDirection="column"
    >
      <InkBox
        borderStyle={borderStyleMap}
        borderColor={borderColor || (theme?.colors.primary) || 'cyan'}
        padding={padding}
        flexDirection="column"
        width={maxWidth}
      >
        {title && (
          <InkBox marginBottom={1}>
            <Text bold color={borderColor || theme?.colors.primary || 'cyan'}>
              {title}
            </Text>
          </InkBox>
        )}
        {children}
      </InkBox>
    </InkBox>
  );
};

/**
 * 创建 Box 组件的辅助函数
 */
export const createBox = (props: BoxProps) => <Box {...props} />;
