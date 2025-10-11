import Table from 'cli-table3';
import chalk from 'chalk';
import type { ThemeConfig } from '../types.js';

export interface TableColumn {
  header: string;
  key: string;
  align?: 'left' | 'center' | 'right';
  width?: number;
}

export interface TableOptions {
  theme?: ThemeConfig;
  showBorder?: boolean;
  compact?: boolean;
}

/**
 * Create a formatted table
 */
export function createTable(
  columns: TableColumn[],
  rows: Record<string, any>[],
  options: TableOptions = {}
): string {
  const { showBorder = true, compact = false } = options;

  const table = new Table({
    head: columns.map((col) => chalk.bold(col.header)),
    colAligns: columns.map((col) => col.align || 'left'),
    colWidths: columns.map((col) => col.width),
    style: {
      head: showBorder ? [] : ['cyan'],
      border: showBorder ? [] : ['gray'],
      compact: compact,
    },
    chars: showBorder
      ? {
          top: '─',
          'top-mid': '┬',
          'top-left': '┌',
          'top-right': '┐',
          bottom: '─',
          'bottom-mid': '┴',
          'bottom-left': '└',
          'bottom-right': '┘',
          left: '│',
          'left-mid': '├',
          mid: '─',
          'mid-mid': '┼',
          right: '│',
          'right-mid': '┤',
          middle: '│',
        }
      : {
          top: '',
          'top-mid': '',
          'top-left': '',
          'top-right': '',
          bottom: '',
          'bottom-mid': '',
          'bottom-left': '',
          'bottom-right': '',
          left: '',
          'left-mid': '',
          mid: '',
          'mid-mid': '',
          right: '',
          'right-mid': '',
          middle: ' ',
        },
  });

  // Add rows
  rows.forEach((row) => {
    const rowData = columns.map((col) => {
      const value = row[col.key];
      return value !== undefined && value !== null ? String(value) : '';
    });
    table.push(rowData);
  });

  return table.toString();
}

/**
 * Create a simple key-value table
 */
export function createKeyValueTable(
  data: Record<string, any>,
  options: TableOptions = {}
): string {
  const columns: TableColumn[] = [
    { header: 'Key', key: 'key', align: 'right' },
    { header: 'Value', key: 'value', align: 'left' },
  ];

  const rows = Object.entries(data).map(([key, value]) => ({
    key: chalk.cyan(key),
    value: String(value),
  }));

  return createTable(columns, rows, options);
}
