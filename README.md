# SmartCare VR｜2D + 3D 智慧康养情景培训

这是基于 **6141 小组作业框架** 与初代公开网站升级制作的静态课程项目网站。无需构建工具、后端或商业 AI API，可直接部署到 GitHub Pages。

## 已实现

- 2D 俯视情景图与 3D 护理房间互相切换，任务进度共享。
- 3D 第一视角 / 第三视角切换，支持键盘、鼠标与触屏操作。
- 四个训练情景：老人跌倒、突发健康状况、失智症沟通、日常生活照护。
- 每个情景包含四个判断步骤、即时解释、完成评分与下一步建议。
- 点击 3D 发光标记或 2D 编号标记可观察现场线索。
- 六阶段学习闭环演示、五门课程筛选与课程详情。
- 六维能力画像、本地训练记录与可下载的复盘摘要。
- 响应式布局、键盘焦点、减少动态效果偏好与 WebGL 失败后的 2D 降级。

## 3D 操作

| 操作 | 方式 |
| --- | --- |
| 移动护理员 | `W A S D` 或方向键；手机使用画面右下方方向按钮 |
| 环顾 / 旋转 | 在 3D 画面中按住并拖动 |
| 第一 / 第三视角 | 点击工具栏视角按钮，或按 `V` |
| 第三视角缩放 | 鼠标滚轮 |
| 观察空间线索 | 点击发光标记，或点击“观察附近线索” |
| 重置位置与视角 | 点击“重置视角” |

第一视角用于临场观察，第三视角用于检查人物位置、距离与行动顺序。2D 与 3D 切换不会重置任务。

## GitHub Pages 部署

### 方式一：直接上传（最简单）

1. 在 GitHub 新建一个公开仓库，例如 `smartcare-vr`。
2. 解压本压缩包，把 **压缩包内的全部文件和文件夹** 上传到仓库根目录。不要再多套一层 `smartcare-vr` 文件夹。
3. 仓库根目录应直接看到 `index.html`、`styles.css`、`app.js`、`scene.js`、`assets`、`vendor`。
4. 打开仓库 **Settings → Pages**。
5. 在 **Build and deployment** 中选择 **Deploy from a branch**。
6. Branch 选择 `main`，目录选择 `/ (root)`，点击 Save。
7. 等待部署完成，访问：`https://你的用户名.github.io/smartcare-vr/`。

### 方式二：Git 命令

```bash
git init
git add .
git commit -m "Launch SmartCare VR training prototype"
git branch -M main
git remote add origin https://github.com/你的用户名/smartcare-vr.git
git push -u origin main
```

随后按上面第 4—7 步启用 Pages。

## 本地预览

由于浏览器的 ES Module 安全限制，不建议直接双击 `index.html`。请在本目录启动静态服务：

```bash
python -m http.server 8080
```

然后访问 `http://localhost:8080`。Windows 若只有 `py` 命令，可使用 `py -m http.server 8080`。

## 文件结构

```text
index.html                 页面结构与课程内容
styles.css                 视觉系统、响应式与动效
app.js                     情景题库、2D 图谱、任务、评估与页面交互
scene.js                   Three.js 房间、人物、相机与 3D 交互
assets/                    图片、插画与网站图标
vendor/three.module.min.js 本地 Three.js 引擎（无需 CDN）
vendor/THREE-LICENSE.txt   Three.js 许可证
.nojekyll                  关闭 Jekyll 处理，保障静态资源路径
README.md                  本说明
```

## 数据与教学边界

- 训练记录只保存在当前浏览器的 `localStorage`，不会上传服务器。
- “下载复盘摘要”生成的是本地 `.txt` 文件。
- 网站为课程交互原型，不连接真实 VR 头显、AI API 或真实学员数据。
- 情景和评分用于教学演示，不替代现实急救规范、机构流程、专业护理判断或导师监督实践。
- 初代网站的摄影和人物素材继续用于本课程项目；若公开商用，需另行确认素材授权。

Three.js 使用 MIT 许可证，许可证原文随 `vendor` 目录提供。
