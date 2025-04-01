import { test, expect } from '@playwright/test';

test.describe('聊天室功能测试', () => {
  test.beforeEach(async ({ page }) => {
    // 在每个测试前访问聊天页面
    await page.goto('http://localhost:5173');
  });

  test('页面基本元素存在', async ({ page }) => {
    // 检查消息区域是否存在
    await expect(page.locator('.bg-gray-100')).toBeVisible();
    
    // 检查输入框是否存在
    await expect(page.locator('input[placeholder="輸入訊息並按 Enter"]')).toBeVisible();
    
    // 检查发送按钮是否存在
    await expect(page.locator('button:has-text("發送")')).toBeVisible();
  });

  test('可以发送消息', async ({ page }) => {
    const message = '测试消息';
    
    // 输入消息
    await page.fill('input[placeholder="輸入訊息並按 Enter"]', message);
    
    // 点击发送按钮
    await page.click('button:has-text("發送")');
    
    // 验证消息是否显示在消息区域
    const expectedText = `已發送: ${message}`;
    await expect(page.locator(`.message:has-text("${expectedText}")`)).toBeVisible();
  });

  test('可以通过回车键发送消息', async ({ page }) => {
    const message = '回车测试消息';
    
    // 输入消息并按回车
    await page.fill('input[placeholder="輸入訊息並按 Enter"]', message);
    await page.keyboard.press('Enter');
    
    // 验证消息是否显示在消息区域
    const expectedText = `已發送: ${message}`;
    await expect(page.locator(`.message:has-text("${expectedText}")`)).toBeVisible();
  });

  test('空消息不能发送', async ({ page }) => {
    // 尝试发送空消息
    await page.click('button:has-text("發送")');
    
    // 验证是否有警告提示
    const alertPromise = page.waitForEvent('dialog');
    await page.click('button:has-text("發送")');
    const alert = await alertPromise;
    expect(alert.message()).toBe('WebSocket 連線未開啟或訊息為空！');
  });
}); 