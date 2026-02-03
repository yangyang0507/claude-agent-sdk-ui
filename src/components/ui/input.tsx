/**
 * Input Component - 输入框组件
 * 用于接收用户文本输入
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import type { Theme } from '../../types/theme.js';

/**
 * Input 组件属性
 */
export interface InputProps {
  /** 占位符文本 */
  placeholder?: string;
  /** 默认值 */
  defaultValue?: string;
  /** 当前值（受控模式） */
  value?: string;
  /** 值变化回调 */
  onChange?: (value: string) => void;
  /** 提交回调（按 Enter 键） */
  onSubmit?: (value: string) => void;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否聚焦 */
  focus?: boolean;
  /** 输入框宽度 */
  width?: number;
  /** 标签文本 */
  label?: string;
  /** 是否为密码输入（显示 *） */
  mask?: boolean;
  /** 主题 */
  theme?: Theme;
}

/**
 * Input 组件
 *
 * 接收用户文本输入的交互组件
 *
 * @example
 * ```tsx
 * <Input
 *   placeholder="Enter your name"
 *   onSubmit={(value) => console.log(value)}
 * />
 * <Input label="Password:" mask onSubmit={handlePassword} />
 * ```
 */
export const Input: React.FC<InputProps> = ({
  placeholder = '',
  defaultValue = '',
  value: controlledValue,
  onChange,
  onSubmit,
  disabled = false,
  focus = true,
  width,
  label,
  mask = false,
  theme,
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [cursorVisible, setCursorVisible] = useState(true);

  // 使用受控值或内部值
  const value = controlledValue !== undefined ? controlledValue : internalValue;

  // 光标闪烁效果
  useEffect(() => {
    if (!focus || disabled) return;

    const timer = setInterval(() => {
      setCursorVisible((v) => !v);
    }, 500);

    return () => clearInterval(timer);
  }, [focus, disabled]);

  // 处理输入
  useInput(
    (input, key) => {
      if (disabled || !focus) return;

      if (key.return) {
        onSubmit?.(value);
        return;
      }

      if (key.backspace || key.delete) {
        const newValue = value.slice(0, -1);
        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
        return;
      }

      // 忽略控制键
      if (key.ctrl || key.meta || key.escape || key.upArrow || key.downArrow) {
        return;
      }

      // 添加输入字符
      if (input) {
        const newValue = value + input;
        if (controlledValue === undefined) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      }
    },
    { isActive: focus && !disabled }
  );

  // 显示的文本
  const displayValue = mask ? '*'.repeat(value.length) : value;
  const showPlaceholder = value.length === 0 && placeholder;

  const textColor = disabled
    ? theme?.colors.dim || 'gray'
    : theme?.colors.text || 'white';
  const placeholderColor = theme?.colors.dim || 'gray';
  const cursorColor = theme?.colors.primary || 'cyan';

  return (
    <Box>
      {label && (
        <Text color={textColor}>
          {label}{' '}
        </Text>
      )}
      <Box
        borderStyle="single"
        borderColor={focus ? cursorColor : placeholderColor}
        paddingLeft={1}
        paddingRight={1}
        width={width}
      >
        {showPlaceholder ? (
          <Text color={placeholderColor}>{placeholder}</Text>
        ) : (
          <Text color={textColor}>
            {displayValue}
            {focus && cursorVisible && !disabled && (
              <Text color={cursorColor}>▌</Text>
            )}
          </Text>
        )}
      </Box>
    </Box>
  );
};

/**
 * 创建 Input 组件的辅助函数
 */
export const createInput = (props: InputProps) => <Input {...props} />;
