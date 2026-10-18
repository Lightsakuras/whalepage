# WhalePage Kit

零依赖的静态落地页设计系统。一套 CSS + 一个 `data-theme`，做出三种完全不同气质的站点。

**在线部分：** 销售页（`index.html`）+ 三个可直接点开的案例（`demos/`）。

---

## 目录结构

```
whalepage/
├── index.html              销售页（中文，卖的是服务）
├── about.html              关于我（Day 4 待补）
├── assets/
│   ├── kit.css             设计系统（reset + 变量 + 组件 + 响应式 + 无障碍）
│   └── kit.js              交互（3KB：滚动态、菜单、入场、数字、光标聚光）
├── demos/
│   ├── demo-ai.html        AI 产品 —— 暗黑 + 紫青渐变
│   ├── demo-studio.html    设计工作室 —— 纸色 + 衬线 + 朱红
│   └── demo-shop.html      实体品牌 —— 黑金 + 荧光绿
├── SALES.md                闲鱼/小红书文案、报价单、交付 SOP
├── PLAN-7DAYS.md           7 天执行计划
└── README.md               本文件
```

没有 `package.json`、没有构建步骤、没有 node_modules。双击 `index.html` 就能看。

---

## 换主题

整站气质只由一个属性控制：

```html
<html lang="zh-CN" data-theme="ai">     <!-- 暗黑渐变 -->
<html lang="zh-CN" data-theme="studio"> <!-- 纸色衬线 -->
<html lang="zh-CN" data-theme="shop">   <!-- 黑金荧光 -->
```

改 `kit.css` 里对应的 `[data-theme="..."]` 块即可：

```css
[data-theme="studio"] {
  --bg: #f6f3ee;        /* 页面底色 */
  --fg: #15120f;        /* 正文颜色 */
  --accent: #e8452c;    /* 主色（按钮、强调、渐变起点） */
  --accent-2: #1d4ed8;  /* 渐变终点 */
  --radius: 4px;        /* 圆角，4px = 编辑感，18px = 现代感 */
  --font-display: Georgia, serif;
}
```

### 给新客户换个品牌色（最常见的需求，2 分钟）

1. 复制 `demo-ai.html` 为 `客户.html`
2. 把 `data-theme` 改成 `ai`（或新建一套）
3. 只改三行：

```css
:root {
  --accent: #客户主色;
  --accent-2: #客户辅色;
  --grad: linear-gradient(100deg, var(--accent), var(--accent-2));
}
```

或者更省事：在客户页面 `<head>` 里加一段内联 `<style>` 覆盖，不改公共 CSS。

---

## 组件速查

| 类名 | 用途 |
|---|---|
| `.wrap` / `.narrow` | 1180px / 760px 容器 |
| `.hero` `.hero-grid` `.hero-copy` `.hero-art` | 首屏两栏布局 |
| `.display` `.h2` `.h3` `.lead` `.eyebrow` | 排版层级（字号全用 clamp，自动响应式） |
| `.grad-text` | 渐变文字 |
| `.btn` `.btn-primary` `.btn-ghost` `.btn-lg` | 按钮 |
| `.grid.g-2/.g-3/.g-4` | 等分栅格，手机自动单列 |
| `.bento` `.b-span-2/.b-span-3/.b-row-2` | 非等分网格（杂志感） |
| `.card` `.card-solid` | 卡片 |
| `.stats` `.stat-value` | 数字区（配 `data-count` 滚动） |
| `.steps` `.step` | 流程编号列表 |
| `.pricing` `.plan(.featured)` | 三档报价 |
| `.faq`（`<details>`） | 折叠问答，零 JS |
| `.cta-band` | 结尾行动区 |
| `.marquee` | 无限滚动条 |
| `.quote` | 客户评价 |
| `.reveal` | 滚动入场（无障碍自动降级） |

---

## 交互（kit.js 做的事）

1. `html.js` —— 有 JS 才启用入场动画，无 JS 时内容直接可见
2. 顶栏滚动态 `.stuck`
3. 移动端菜单（`.menu-btn` 切 `.nav.open`）
4. `.reveal` 用 IntersectionObserver 加 `.in`，`--i` 控制交错延迟
5. `[data-count]` + `[data-suffix]` 数字滚动
6. `.spotlight` 光标跟随（只对精确指针设备启用）
7. `[data-year]` 自动年份
8. 兜底：2.5s 后把视口内未触发的 `.reveal` 直接显示（后台标签页不回调 IO）

全部尊重 `prefers-reduced-motion`。

---

## 本地预览

直接双击 `index.html` 就行，`file://` 下一切正常（没有 fetch、没有模块）。

需要本地服务器时（比如测试部署行为）：

```powershell
# 任选一个
npx serve D:\whalepage
python -m http.server 8080 --directory D:\whalepage
```

---

## 部署

### Cloudflare Pages（推荐，免费、快、不用信用卡）

1. dash.cloudflare.com → Workers & Pages → Create → Pages → Upload assets
2. 拖入整个 `whalepage` 文件夹
3. 得到 `项目名.pages.dev`
4. 绑自定义域名：Pages 项目 → Custom domains → 输入域名 → 按提示去域名商改 CNAME

### GitHub Pages

```powershell
cd D:\whalepage
git init
git add .
git commit -m "WhalePage kit"
git branch -M main
git remote add origin https://github.com/<你的用户名>/whalepage.git
git push -u origin main
```
仓库 Settings → Pages → Source 选 `main` / root。注意路径是 `/whalepage/` 而不是 `/`，页面里的相对路径（`assets/kit.css`）不需要改，绝对路径要改。

### 任意静态托管

Netlify / Vercel / 阿里云 OSS / 腾讯云 COS / 自己的 Nginx，把文件夹扔上去就行。整个站点不到 60KB（不含字体）。

---

## 已知取舍

- **字体**：没有内置 webfont，用系统字体栈。好处是零请求、首屏快；坏处是不同系统观感略有差异。要统一观感就自己加 `@font-face`（会多 100-300KB）。
- **图片**：三个 demo 的产品图是纯 CSS 画的（`.stack`、`.speaker`），没有位图。客户要真实图时替换对应的 div 即可。
- **动画**：全部是 CSS transition + 少量 rAF，没有动画库。
- **SEO**：每页有 title / description / theme-color。需要 OG 图和 sitemap 时自己加，模板故意不预置（客户情况不同）。
- **表单**：不内置后端。用 `mailto:`、Formspree、或客户自己的接口，`action` 直接填。

---

## 授权与售卖

代码是你自己的，怎么卖都行。给客户交付时的建议条款：

- 交付源码，无加密、无域限制
- 客户可自行修改、二次开发
- 不含第三方素材的版权转移（客户自备的图，版权归客户）
- 你保留把该页面作为作品展示的权利（需要客户同意的话提前说）
- 交付后新增需求另计，报价单里写清

**不要**把 MIT 项目的代码混进来当自有代码卖——这份 kit 是原创的，保持干净。

---

## 下一步（可选）

- [ ] `about.html`：一页讲清"我是谁、做过什么、怎么联系"
- [ ] 案例加"前后对比"：改前的旧页面 vs 改后（最有说服力）
- [ ] `preview.html`：输入框实时替换页面文案，给客户当场演示
- [ ] 把 kit 打包成 Gumroad / 爱发电商品（¥99-199）
