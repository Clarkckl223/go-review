# 围棋复盘本 · Go Review Notebook

在浏览器里复盘围棋的工具，电脑、Android、iPhone、iPad 都能用，也可以装到桌面当 App 用。

**打开使用：** https://clarkckl223.github.io/go-review/

*English summary below.*

---

## 功能

**复盘**
- 打开 SGF 棋谱：可以贴上、打开文件，或在野狐少儿围棋分享页按「复盘」直接载入
- 翻棋谱：← →、鼠标滚轮、自动播放（遇到有评论的那一手会停下来）
- 试下变化，有 MultiGo 式的棋谱树，可以切换变化、设为主线、删除
- 每一手都可以写评论，按「我是」区分不同人写的评论和变化
- 好手、恶手标记（! !! ? ?? ?! !?），以及 △ ○ □ ✕ A 记号
- 撤销 / 重做，落子和提子音效

**判断与计分**
- 「形势」：估算双方的地和目数差
- 「数子 / 数目」：支持中国数子、日韩数目、应氏计点，会自动判断死子，有双活和假眼判断

**AI（KataGo，在你自己的设备上计算）**
- 「AI 分析」：显示候选点的胜率和计算次数、黑白胜率条、目数差，以及推荐变化
  - 思考时间可以选 1 秒、5 秒、10 秒、30 秒或不限，可以随时停止或继续
  - 推荐变化可以加进棋谱树
- 「整盘分析」：AI 把每一手都算一遍，画出胜率和目数曲线，统计双方平均损失、和 AI 首选的吻合率，列出恶手、大恶手和中文说明（方向错误、次序错误、哪块棋变死等）
  - 可以把分析写进棋谱（作者为「AI」的评论、恶手记号和 AI 推荐的变化），或下载报告（HTML，可打印或存成 PDF）
- 「设置」可以选 AI 网络：轻量 b10（12 MB，用显卡）或强力 b18（30 MB，新一代网络，用 CPU）
- 「新对局」：7、9、13、19 路棋盘，可以让子、设贴目
  - 可以和 AI 下，有 8 种棋力，从 25 级到最强
  - 也可以不用 AI，自己摆谱

**练习与分享**
- 「做题」：死活题、手筋题练习册（内建吃子入门、死活入门）；老师建立班级、出题、导入 SGF 题库；学生用班级代码 + 名字 + 4 位数密码登录，做题记录和积分跨设备保存，有排行榜
- 「猜下一手」练习，最后会显示正确率
- 存成图片（PNG），可以存目前局面，也可以存一段手数并标上编号
- 共享链接：老师和学生打开同一个链接一起写评论，几秒内同步
- 快照链接：把整盘棋和评论做成一次性的副本
- Google Drive 同步：电脑、手机、iPad 之间同步棋谱库
- 中文 / English 界面，可以离线使用（PWA）

## 文件

| 文件 | 用途 |
|---|---|
| `index.html` | 整个程序（单一网页） |
| `sw.js` | 离线缓存，AI 模型只下载一次 |
| `manifest.webmanifest`、`icon-*.png`、`apple-touch-icon.png` | 安装到桌面用 |
| `katago/` | KataGo 神经网络：b10（TensorFlow.js，`model.json` 和 3 个 `.bin`）、b18（ONNX，分成两个 `.bin`，因为 GitHub 网页上传每个文件不能超过 25 MB）和授权文件 |

## 自己架设

1. Fork 这个仓库，在 Settings → Pages 用 `main` 分支发布。
2. **Google Drive 同步（可选）**
   - 在 Google Cloud 建一个 OAuth 用户端 ID（网页应用程序），把你的 GitHub Pages 网址加到「已授权的 JavaScript 来源」。
   - 把 `index.html` 里的 `DRIVE_CLIENT_ID` 换成你自己的。
   - OAuth 还在「测试」状态时，只有加进 Test users 的账号能连接 Drive。
3. **共享链接（可选）**
   - 建一个 Firebase 项目，打开「匿名登录」和 Firestore。
   - 把 `index.html` 里的 `FIREBASE_CONFIG` 和 `SHARE_BASE` 换成你自己的。

所有资料都存在使用者自己的浏览器、自己的 Google Drive 或你的 Firebase，不经过其他服务器。

## 致谢与授权

- **KataGo**（David J Wu “lightvector”）：使用 g170e-b10c128 网络，依照 KataGo 授权使用，见 [`katago/LICENSE.txt`](katago/LICENSE.txt)。
  - 网络的 TensorFlow.js 版本由 Yuji Ichikawa 转换。这里另外修改了它的计算方式，让 7、9、13 路小棋盘也能正确使用。
  - https://github.com/lightvector/KataGo
- **goscorer**（David J Wu）：数目、双活和假眼判断，MIT 授权。https://github.com/lightvector/goscorer
- **TensorFlow.js**、**ONNX Runtime Web**：Apache 2.0 / MIT 授权，从 jsDelivr 载入。
- b18 网络（kata1-b18c384nbt）的 ONNX 版本取自 OnnxGo-models，依照 KataGo 网络授权使用，见 [`katago/LICENSE-b18.txt`](katago/LICENSE-b18.txt)。
- 落子和提子音效取自 MultiGo 4。

---

## English

**Go Review Notebook** is a browser-based Go (weiqi / baduk) review tool. It works on desktop, Android, iPhone and iPad, and can be installed as an app.

**Use it:** https://clarkckl223.github.io/go-review/

**Reviewing games**
- Open SGF files, or load a game straight from a Fox Weiqi share page.
- Use a MultiGo-style variation tree, and write per-move comments, with each person's comments kept separate.
- Mark good and bad moves, and add board marks.

**Estimating and scoring**
- Get a quick position estimate.
- Score with Chinese, Japanese/Korean or Ing rules, with automatic dead-stone, seki and false-eye detection.

**KataGo AI**
- The AI runs on your own device; nothing is sent to a server.
- **Game review:** analyses every move, draws win-rate and score graphs, gives per-player statistics, lists mistakes with explanations, and can write the review into the SGF or export an HTML report.
- **Networks:** choose Light b10 (TensorFlow.js, GPU) or Strong b18 (ONNX Runtime Web, CPU) in Settings.
- **Analysis:** MCTS search showing candidate moves with win rate and visit counts, plus the score lead and the best line. Thinking time can be 1/5/10/30 s or unlimited, and lines can be added to the game tree.
- **New game:** 7×7, 9×9, 13×13 or 19×19 boards, with handicap and komi. Play the AI at 8 levels, from 25 kyu to strongest.

**Practice and sharing**
- Practise with "guess the next move", and export the board as a PNG.
- Shared links let teachers and students write together. Snapshot links make a one-off copy.
- Sync your library through Google Drive.
- The interface is in Chinese and English, and it works offline as a PWA.

**Self-hosting**
- Enable GitHub Pages.
- Optionally set your own `DRIVE_CLIENT_ID` (Google OAuth web client) and `FIREBASE_CONFIG` / `SHARE_BASE` (Firebase with anonymous auth and Firestore) in `index.html`.

**Credits**
- KataGo network g170e-b10c128 by David J Wu, used under the KataGo license (see `katago/LICENSE.txt`). TensorFlow.js conversion by Yuji Ichikawa, with masking added for small boards.
- goscorer (MIT) by David J Wu.
- TensorFlow.js (Apache 2.0).
- Move sounds from MultiGo 4.
