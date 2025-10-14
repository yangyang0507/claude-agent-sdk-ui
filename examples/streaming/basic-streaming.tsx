/**
 * 基础流式测试 - 打字机效果
 *
 * 测试 StreamingText 组件的打字机效果
 */

import React from 'react';
import { render, Box, Text } from 'ink';
import { StreamingText } from '../../src/components/ui/streaming-text.js';
import { ThemeProvider } from '../../src/hooks/use-theme.js';
import { Divider } from '../../src/components/ui/divider.js';

const TestApp = () => {
  const [step, setStep] = React.useState(0);

  return (
    <ThemeProvider theme="dark">
      <Box flexDirection="column">
        <Divider text="🎬 STREAMING TEXT TEST" marginBottom={1} />

        {/* 第一段文本 */}
        <Box marginBottom={1}>
          <Text bold color="cyan">
            Step 1:{' '}
          </Text>
          <StreamingText
            text="Hello! I'm testing the streaming text component."
            speed={30}
            onComplete={() => setStep(1)}
          />
        </Box>

        {/* 第二段文本（等第一段完成后显示） */}
        {step >= 1 && (
          <Box marginBottom={1}>
            <Text bold color="green">
              Step 2:{' '}
            </Text>
            <StreamingText
              text="This text appears with a typing effect, character by character."
              speed={20}
              onComplete={() => setStep(2)}
            />
          </Box>
        )}

        {/* 第三段文本（等第二段完成后显示） */}
        {step >= 2 && (
          <Box marginBottom={1}>
            <Text bold color="yellow">
              Step 3:{' '}
            </Text>
            <StreamingText
              text="You can customize the typing speed and add completion callbacks!"
              speed={15}
              onComplete={() => {
                setStep(3);
                setTimeout(() => {
                  process.exit(0);
                }, 1000);
              }}
            />
          </Box>
        )}

        {/* 完成提示 */}
        {step >= 3 && (
          <Box marginTop={1}>
            <Text color="green">✅ Streaming test completed!</Text>
          </Box>
        )}
      </Box>
    </ThemeProvider>
  );
};

// 渲染应用
render(<TestApp />);
