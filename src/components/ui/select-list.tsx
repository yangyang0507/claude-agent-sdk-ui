/**
 * SelectList Component - 选择列表组件
 * 用于在多个选项中进行选择
 */

import React, { useState, useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import type { Theme } from '../../types/theme.js';

/**
 * 选项类型
 */
export interface SelectOption<T = string> {
  /** 选项值 */
  value: T;
  /** 显示标签 */
  label: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 描述文本 */
  description?: string;
}

/**
 * SelectList 组件属性
 */
export interface SelectListProps<T = string> {
  /** 选项列表 */
  options: SelectOption<T>[];
  /** 选中的值 */
  value?: T;
  /** 默认选中的值 */
  defaultValue?: T;
  /** 选择变化回调 */
  onChange?: (value: T) => void;
  /** 确认选择回调（按 Enter 键） */
  onSelect?: (value: T) => void;
  /** 是否聚焦 */
  focus?: boolean;
  /** 标签文本 */
  label?: string;
  /** 指示器样式 */
  indicator?: string;
  /** 选中标记样式 */
  checkmark?: string;
  /** 是否显示描述 */
  showDescription?: boolean;
  /** 主题 */
  theme?: Theme;
}

/**
 * SelectList 组件
 *
 * 在多个选项中进行选择的交互组件
 *
 * @example
 * ```tsx
 * <SelectList
 *   options={[
 *     { value: 'a', label: 'Option A' },
 *     { value: 'b', label: 'Option B' },
 *     { value: 'c', label: 'Option C', disabled: true },
 *   ]}
 *   onSelect={(value) => console.log('Selected:', value)}
 * />
 * ```
 */
export function SelectList<T = string>({
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  onSelect,
  focus = true,
  label,
  indicator = '❯',
  checkmark = '✓',
  showDescription = true,
  theme,
}: SelectListProps<T>): React.ReactElement {
  // 找到默认选中的索引
  const getDefaultIndex = () => {
    const val = controlledValue ?? defaultValue;
    if (val !== undefined) {
      const idx = options.findIndex((opt) => opt.value === val);
      return idx >= 0 ? idx : 0;
    }
    // 找到第一个非禁用的选项
    const firstEnabled = options.findIndex((opt) => !opt.disabled);
    return firstEnabled >= 0 ? firstEnabled : 0;
  };

  const [highlightedIndex, setHighlightedIndex] = useState(getDefaultIndex);
  const [selectedValue, setSelectedValue] = useState<T | undefined>(
    controlledValue ?? defaultValue
  );

  // 同步受控值
  useEffect(() => {
    if (controlledValue !== undefined) {
      setSelectedValue(controlledValue);
      const idx = options.findIndex((opt) => opt.value === controlledValue);
      if (idx >= 0) {
        setHighlightedIndex(idx);
      }
    }
  }, [controlledValue, options]);

  // 处理键盘输入
  useInput(
    (input, key) => {
      if (!focus) return;

      if (key.upArrow) {
        // 向上移动，跳过禁用选项
        let newIndex = highlightedIndex;
        do {
          newIndex = newIndex > 0 ? newIndex - 1 : options.length - 1;
        } while (options[newIndex]?.disabled && newIndex !== highlightedIndex);
        setHighlightedIndex(newIndex);
        return;
      }

      if (key.downArrow) {
        // 向下移动，跳过禁用选项
        let newIndex = highlightedIndex;
        do {
          newIndex = newIndex < options.length - 1 ? newIndex + 1 : 0;
        } while (options[newIndex]?.disabled && newIndex !== highlightedIndex);
        setHighlightedIndex(newIndex);
        return;
      }

      if (key.return) {
        const option = options[highlightedIndex];
        if (option && !option.disabled) {
          if (controlledValue === undefined) {
            setSelectedValue(option.value);
          }
          onChange?.(option.value);
          onSelect?.(option.value);
        }
        return;
      }

      // 空格键也可以选择
      if (input === ' ') {
        const option = options[highlightedIndex];
        if (option && !option.disabled) {
          if (controlledValue === undefined) {
            setSelectedValue(option.value);
          }
          onChange?.(option.value);
        }
      }
    },
    { isActive: focus }
  );

  const primaryColor = theme?.colors.primary || 'cyan';
  const textColor = theme?.colors.text || 'white';
  const dimColor = theme?.colors.dim || 'gray';
  const successColor = theme?.colors.success || 'green';

  return (
    <Box flexDirection="column">
      {label && (
        <Box marginBottom={1}>
          <Text color={textColor} bold>
            {label}
          </Text>
        </Box>
      )}
      {options.map((option, index) => {
        const isHighlighted = index === highlightedIndex;
        const isSelected = selectedValue === option.value;
        const isDisabled = option.disabled;

        return (
          <Box key={String(option.value)} flexDirection="column">
            <Box>
              {/* 指示器 */}
              <Text color={isHighlighted ? primaryColor : undefined}>
                {isHighlighted ? indicator : ' '}{' '}
              </Text>

              {/* 选中标记 */}
              <Text color={isSelected ? successColor : dimColor}>
                {isSelected ? checkmark : ' '}{' '}
              </Text>

              {/* 选项标签 */}
              <Text
                color={
                  isDisabled
                    ? dimColor
                    : isHighlighted
                    ? primaryColor
                    : textColor
                }
                bold={isHighlighted}
                strikethrough={isDisabled}
              >
                {option.label}
              </Text>

              {/* 禁用标记 */}
              {isDisabled && (
                <Text color={dimColor}> (disabled)</Text>
              )}
            </Box>

            {/* 描述文本 */}
            {showDescription && option.description && isHighlighted && (
              <Box marginLeft={4}>
                <Text color={dimColor} italic>
                  {option.description}
                </Text>
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

/**
 * 创建 SelectList 组件的辅助函数
 */
export const createSelectList = <T,>(props: SelectListProps<T>) => (
  <SelectList {...props} />
);
