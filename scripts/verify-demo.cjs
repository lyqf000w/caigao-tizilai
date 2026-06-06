const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')

async function main() {
  fs.mkdirSync('artifacts', { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({
    viewport: { width: 375, height: 812 },
    deviceScaleFactor: 1,
  })
  const errors = []

  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) {
      errors.push(`${msg.type()}: ${msg.text()}`)
    }
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))

  await page.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: '生成题单' }).click()
  await page.waitForSelector('.form-panel')
  await page.screenshot({ path: path.join('artifacts', 'generate-mobile.png') })

  await page.getByRole('button', { name: '生成专属题单' }).click()
  await page.waitForSelector('.practice-head', { timeout: 8000 })
  await page.screenshot({ path: path.join('artifacts', 'practice-mobile.png') })

  await page.getByRole('button', { name: '角色、任务、上下文、约束、输出格式' }).click()
  await page.getByRole('button', { name: '下一题' }).click()

  await page
    .locator('textarea')
    .fill('我会先追问目标人群、产品卖点、平台语气、输出格式、禁忌边界和评价标准，再给出默认假设，确保文案稳定可复用。')
  await page.getByRole('button', { name: '下一题' }).click()

  await page
    .locator('textarea')
    .fill('我会先看上下文是否足够，再检查 Prompt 是否包含角色、任务、约束、输出格式和样例。随后设计测试集，比较优化前后的命中率和可执行性。')
  await page.getByRole('button', { name: '下一题' }).click()

  await page.getByRole('button', { name: '说明边界，提供安全替代方案' }).click()
  await page.getByRole('button', { name: '下一题' }).click()

  await page
    .locator('textarea')
    .fill('模板会包含岗位、难度、题型、数量、能力标签、输出 JSON 格式和评分标准等变量，便于前端表单复用，也便于后端接入真实模型。')
  await page.getByRole('button', { name: '完成复盘' }).click()
  await page.waitForSelector('.score-panel')
  await page.screenshot({ path: path.join('artifacts', 'result-mobile.png') })

  await page.getByRole('button', { name: '查看记录' }).click()
  await page.waitForSelector('.history-list, .soft-empty')
  await page.screenshot({ path: path.join('artifacts', 'mine-mobile.png') })

  const sessions = await page.evaluate(() =>
    JSON.parse(localStorage.getItem('cgttl_sessions_v1') || '[]').length,
  )

  console.log(JSON.stringify({ errors, sessions }, null, 2))
  await browser.close()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
