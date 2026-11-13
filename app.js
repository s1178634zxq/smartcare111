"use strict";

const scenarios = {
  fall: {
    code: "SCENARIO 01", title: "老人跌倒处理", short: "跌倒应急", duration: "8 分钟",
    elderLine: "“我……腿有点疼，先别动我。”",
    mentor: "先确保现场安全，再评估意识与疼痛。不要立即扶起。",
    color: "#e98763", elderPos: [390, 320], caregiverPos: [510, 385],
    mapNote: "跌倒点靠近地毯边缘与手杖，先排查现场风险。",
    hotspots: [
      { x: 300, y: 345, label: "手杖", observation: "手杖落在一旁，地毯边缘卷起；先排除继续滑倒的风险。" },
      { x: 430, y: 260, label: "意识", observation: "老人能回应，但表示髋部疼痛。保持原位，继续观察并呼叫支援。" },
      { x: 585, y: 220, label: "呼叫", observation: "呼叫装置在床边。确认需要支援后，按机构流程联系护士或导师。" }
    ],
    steps: [
      { title: "发现老人坐在地上，你的首要行动是什么？", context: "陈奶奶意识清楚，右手撑地，表情疼痛。房间暂时没有其他人。", choices: ["立即搀扶她站起来，尽快回到床上", "确保环境安全，蹲下平视安抚并观察", "先离开房间寻找其他护理员"], correct: 1, feedback: "立即扶起可能加重损伤。先排除环境危险、建立沟通并观察意识与伤情，再按流程求助。" },
      { title: "她说髋部疼痛，接下来应怎样处理？", context: "老人能够清楚回应，但不愿移动，疼痛集中在髋部。", choices: ["让她保持原位，询问并观察疼痛情况，同时呼叫支援", "搀扶她走几步，确认是否还能负重", "给她喝水并让她独自休息"], correct: 0, feedback: "疑似严重损伤时不应测试行走或负重。保持原位、持续观察并尽快获得专业支援。" },
      { title: "支援到达前，哪项记录与观察最有价值？", context: "你已呼叫支援，老人仍清醒，现场安全。", choices: ["只记录跌倒结果，等待他人处理", "记录发现时间、意识、疼痛部位与现场情况，并持续观察", "凭经验判断没有骨折，不再记录"], correct: 1, feedback: "时间、意识、疼痛部位、现场情况和状态变化，都是交接与后续专业判断的重要证据。" },
      { title: "完成处置后，怎样体现以人为中心的照护？", context: "支援人员已到达，老人显得紧张，担心再次跌倒。", choices: ["只与支援人员交谈，避免老人担心", "用平静语气解释每一步，倾听担忧并完成交接", "告诉她以后不要乱走，避免再次跌倒"], correct: 1, feedback: "解释、倾听和尊重能减少恐惧与责备感。专业处置与情绪支持应同时发生。" }
    ]
  },
  acute: {
    code: "SCENARIO 02", title: "突发健康状况", short: "突发不适", duration: "8 分钟",
    elderLine: "“我突然觉得胸闷，有点喘。”",
    mentor: "留在老人身边，快速观察意识与呼吸，立即按机构流程请求专业支援。",
    color: "#d9ad60", elderPos: [390, 285], caregiverPos: [515, 360],
    mapNote: "老人坐在椅子上，呼叫装置与出口均在可及范围。",
    hotspots: [
      { x: 390, y: 235, label: "状态", observation: "老人清醒，主诉胸闷与呼吸不适。不要让其独自离开或强行平躺。" },
      { x: 575, y: 220, label: "求助", observation: "需要立即按机构应急流程联系医护人员；真实急症应联系当地急救服务。" },
      { x: 315, y: 355, label: "记录", observation: "记录症状开始时间、主诉、意识呼吸变化及已采取的措施，便于交接。" }
    ],
    steps: [
      { title: "老人突然主诉胸闷、呼吸不适，你先做什么？", context: "老人坐在椅子上，能回应，但看起来不安。", choices: ["让他独自回房休息，稍后再看", "留在身边安抚，观察意识与呼吸并立即呼叫专业支援", "让他步行到护理站，活动一下"], correct: 1, feedback: "突发不适应尽快获得专业评估。陪伴观察并及时求助，避免让老人独处或增加活动负担。" },
      { title: "等待支援时，哪种做法最合适？", context: "老人仍能回应，你已完成求助。", choices: ["持续观察状态变化，保持沟通并准备交接信息", "自行给予其他老人的备用药物", "反复要求他深呼吸并保证一定没事"], correct: 0, feedback: "不应自行给药或做空泛保证。持续观察、安抚并准备准确的交接信息更安全。" },
      { title: "哪组信息最需要在交接时说明？", context: "医护支援即将到达。", choices: ["只说“他不太舒服”", "症状开始时间、主诉、意识呼吸变化、既往已知信息与已采取措施", "只说明老人的年龄和房间号"], correct: 1, feedback: "清晰交接应包含时间、症状、状态变化与已采取行动，避免模糊描述和无关信息。" },
      { title: "情景结束后，最合适的复盘重点是什么？", context: "本次为虚拟训练，没有真实患者。", choices: ["只记住最终结果，不看过程", "复盘求助是否及时、观察是否连续、交接是否准确", "把 AI 的回答当作现实医疗指令"], correct: 1, feedback: "应急训练要评估行为顺序和证据。AI 仅作教学辅助，现实处置必须遵循专业规范。" }
    ]
  },
  dementia: {
    code: "SCENARIO 03", title: "失智症情绪沟通", short: "失智沟通", duration: "10 分钟",
    elderLine: "“我已经吃过了，为什么又要我吃？”",
    mentor: "不要争论记忆对错。先回应情绪，再用简短、具体的选择支持老人。",
    color: "#8eb9a4", elderPos: [390, 275], caregiverPos: [510, 350],
    mapNote: "餐桌已经布置好，周围环境安静，适合减少干扰后沟通。",
    hotspots: [
      { x: 385, y: 210, label: "情绪", observation: "重复提问可能伴随焦虑或不确定感，不必用争辩证明谁记得正确。" },
      { x: 300, y: 320, label: "餐具", observation: "提供两种简单选择即可，避免一次给出过多信息。" },
      { x: 580, y: 220, label: "环境", observation: "降低噪声与干扰，保持平视和舒缓语速，有助于建立安全感。" }
    ],
    steps: [
      { title: "老人反复说已经吃过饭，你如何回应？", context: "午餐尚未开始，老人语气急促，认为你在强迫他。", choices: ["明确告诉他记错了，必须服从安排", "先接纳情绪，用简短语言说明现在的情况", "不再解释，直接把餐具放到他面前"], correct: 1, feedback: "争论事实容易升级焦虑。先回应感受，再用简短、平静的语言重新建立情境。" },
      { title: "老人仍拒绝进食，下一步怎样支持自主选择？", context: "老人情绪稍微缓和，但仍不愿坐下。", choices: ["提供两个简单选择，例如先喝汤或先坐一会儿", "连续列出所有菜品，让他马上决定", "以取消活动为条件要求他吃饭"], correct: 0, feedback: "有限而具体的选择能减少认知负担，也保留老人的控制感和尊严。" },
      { title: "沟通中，哪种非语言行为更合适？", context: "你准备再次靠近老人。", choices: ["站在高处快速说话，催促回应", "保持平视、适当距离和舒缓语速，留出回应时间", "从背后突然拉住他的手臂"], correct: 1, feedback: "平视、距离、语速和等待时间都影响安全感。避免突然接触和催促。" },
      { title: "这次互动最应该记录什么？", context: "老人最终愿意先坐一会儿。", choices: ["只记录“老人不配合”", "记录触发情境、有效安抚方式、选择与反应", "记录护理员认为他故意找麻烦"], correct: 1, feedback: "行为记录应具体、客观，帮助团队理解未满足需要，而不是给老人贴标签。" }
    ]
  },
  daily: {
    code: "SCENARIO 04", title: "日常生活照护", short: "日常照护", duration: "12 分钟",
    elderLine: "“我想自己试试，但你能在旁边陪我吗？”",
    mentor: "先解释、征得同意，再提供恰到好处的支持；安全与自主并不冲突。",
    color: "#6fa9a0", elderPos: [390, 290], caregiverPos: [515, 350],
    mapNote: "床、座椅与移动辅具位置清晰，通道应保持无障碍。",
    hotspots: [
      { x: 290, y: 350, label: "通道", observation: "移动前检查通道、设备刹车和防滑穿着，避免临时障碍。" },
      { x: 405, y: 230, label: "意愿", observation: "老人希望保留自主性。先询问需要怎样的帮助，而不是全部代劳。" },
      { x: 585, y: 220, label: "隐私", observation: "洗漱与移动前说明步骤、遮挡隐私部位，并确认老人准备就绪。" }
    ],
    steps: [
      { title: "协助老人移动前，首先要做什么？", context: "老人表示想自己尝试，但希望你陪在旁边。", choices: ["直接搀扶，节省时间", "说明计划并征得同意，询问他希望获得哪些支持", "告诉他必须完全由护理员完成"], correct: 1, feedback: "解释与同意是尊重式照护的起点。支持应匹配老人的能力，而不是全部代劳。" },
      { title: "开始移动前，哪项环境检查最完整？", context: "老人准备从床边转移到座椅。", choices: ["只看座椅是否好看", "检查通道、座椅与辅具稳定性、刹车和老人穿着", "等开始移动后再处理障碍"], correct: 1, feedback: "通道、设备稳定、刹车和合适穿着都关系到转移安全，应在行动前检查。" },
      { title: "老人动作较慢，你怎样提供帮助？", context: "老人能够完成部分动作，但需要短暂停顿。", choices: ["立即把他拉到目标位置", "给予口头提示和必要支撑，允许按自己的节奏完成", "批评他动作太慢"], correct: 1, feedback: "恰到好处的支持能同时维护安全、自主与信心，避免过度协助和催促。" },
      { title: "日常照护结束时，怎样兼顾尊严与质量？", context: "老人已安全坐好，准备休息。", choices: ["确认舒适与需求，整理环境并记录异常", "马上离开，不再交流", "当着其他老人讨论他的隐私"], correct: 0, feedback: "结束前的舒适确认、环境整理、必要记录和隐私保护，都是完整照护的一部分。" }
    ]
  }
};

const courses = [
  { id: "basic", category: "care", categoryName: "基础必修", title: "老人基础护理", en: "BASIC ELDERLY CARE", hours: "8 小时", mode: "理论 + VR", description: "围绕进食、移动与洗漱，建立安全、尊重且有温度的日常照护流程。", outcome: "安全移动 · 风险识别 · 尊重式照护", objectives: ["掌握日常照护与安全移动的基本流程", "识别环境、设备和沟通中的常见风险", "在支持安全的同时保留老人的自主性"], assessment: "2D 流程排序 + 3D 日常照护任务 + 导师监督实践" },
  { id: "dementia", category: "special", categoryName: "专项进阶", title: "失智症照护", en: "DEMENTIA CARE", hours: "7 小时", mode: "生成式 AI + 案例", description: "理解重复提问、拒绝与焦虑背后的未满足需要，练习共情沟通。", outcome: "需求识别 · 情绪安抚 · 客观记录", objectives: ["区分行为描述与对老人的主观标签", "练习简短语言、有限选择与非语言支持", "记录有效安抚策略并用于团队协作"], assessment: "AI 对话分支 + 沟通行为量规 + 案例复盘" },
  { id: "emergency", category: "special", categoryName: "应急专项", title: "应急处理", en: "EMERGENCY RESPONSE", hours: "6 小时", mode: "VR 模拟", description: "围绕跌倒与突发不适，训练观察、评估、求助、交接与记录。", outcome: "处置顺序 · 风险判断 · 清晰交接", objectives: ["建立不造成二次伤害的安全意识", "在高压情景中保持正确的行动顺序", "用具体信息完成专业交接"], assessment: "跌倒与突发不适双情景 + 行为证据评分" },
  { id: "digital", category: "digital", categoryName: "数字素养", title: "AI 数字技能", en: "AI DIGITAL SKILLS", hours: "5 小时", mode: "AI 导师", description: "理解 AI 辅助工具与智能设备的适用边界、风险和基本使用方法。", outcome: "工具应用 · 结果核验 · 边界意识", objectives: ["说明 AI 可以辅助哪些学习与照护任务", "识别错误建议、自动化偏见与过度依赖", "掌握智能设备数据的基本核验方法"], assessment: "案例判断 + 工具操作 + 错误建议识别" },
  { id: "ethics", category: "digital", categoryName: "核心素养", title: "沟通与职业伦理", en: "COMMUNICATION & ETHICS", hours: "6 小时", mode: "案例教学", description: "把同理心、隐私保护、知情同意与人机协作放进具体照护决定。", outcome: "同理沟通 · 隐私保护 · 人工复核", objectives: ["在困难情境中解释、倾听并维护尊严", "应用数据最小化与隐私保护原则", "明确 AI 教学辅助与专业判断的边界"], assessment: "伦理案例讨论 + 情景选择 + 反思记录" }
];

const journeyData = [
  { title: "护理员登录系统", description: "建立学习档案，查看个人进度与本次训练任务，为能力评估建立清晰起点。", metric: "LEARNER PROFILE", value: "学习档案已建立", evidence: "证据：课程记录与任务起点" },
  { title: "AI 导师推荐课程", description: "根据已有表现推荐知识内容与情景任务，并说明推荐对应的能力缺口。", metric: "PERSONALIZED PATH", value: "推荐跌倒情景复盘", evidence: "证据：上一轮遗漏的观察步骤" },
  { title: "进入虚拟养老院", description: "用 2D 图谱熟悉空间与任务，再进入 3D 房间，以第一或第三视角练习。", metric: "DUAL MODE", value: "2D + 3D 已连接", evidence: "证据：空间观察与视角切换记录" },
  { title: "AI 虚拟老人互动", description: "面对不同状态与情绪的老人，练习解释、倾听、安抚和尊重式沟通。", metric: "HUMAN INTERACTION", value: "先回应需要，再处理任务", evidence: "证据：对话选择与沟通行为" },
  { title: "完成护理任务", description: "把知识转化为可观察的行动顺序，错误分支即时反馈，可安全地重复练习。", metric: "PRACTICE & FEEDBACK", value: "每一步都有行为证据", evidence: "证据：选择、顺序、观察与复盘" },
  { title: "生成报告并再推荐", description: "汇总表现形成能力画像，把薄弱步骤转化为下一轮训练建议，完成闭环。", metric: "CLOSED LOOP", value: "评估回到下一轮学习", evidence: "证据：能力画像与可解释建议" }
];

const storageKey = "smartcare-vr-training-v2";
let history = [];
try { history = JSON.parse(localStorage.getItem(storageKey) || "[]"); if (!Array.isArray(history)) history = []; } catch (error) { history = []; }

let currentScenario = "fall";
let currentView = "3d";
let currentCamera = "third";
let sceneReady = false;
let toastTimer;
let journeyIndex = 0;
let journeyTimer = null;
const progress = {};
Object.keys(scenarios).forEach((id) => { progress[id] = { index: 0, answers: [], score: 0, completed: false, recorded: false }; });

window.smartCareState = { scenario: currentScenario, view: currentView, camera: currentCamera };
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function emit(name, detail) { window.dispatchEvent(new CustomEvent(name, { detail })); }
function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function setView(view) {
  currentView = view;
  window.smartCareState.view = view;
  $$('[data-view]').forEach((button) => {
    const active = button.dataset.view === view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  $("#sceneContainer").hidden = view !== "3d";
  $("#mapView").hidden = view !== "2d";
  $("#cameraControls").hidden = view !== "3d";
  $(".move-pad").hidden = view !== "3d";
  $(".control-hints").innerHTML = view === "3d" ? '<span><kbd>WASD</kbd> 移动</span><span><kbd>拖动</kbd> 环顾</span><span><kbd>滚轮</kbd> 第三视角缩放</span><span><kbd>V</kbd> 切换视角</span>' : '<span><kbd>点击</kbd> 编号标记观察线索</span><span><kbd>选择</kbd> 右侧答案继续任务</span>';
  $("#crosshair").classList.toggle("is-visible", view === "3d" && currentCamera === "first");
  $("#viewBadge").innerHTML = view === "3d" ? '<svg><use href="#i-cube"/></svg> 3D LIVE' : '<svg><use href="#i-map"/></svg> 2D MAP';
  $("#cameraBadge").textContent = view === "3d" ? `${currentCamera === "third" ? "第三视角" : "第一视角"} · 按 V 切换` : "俯视情景 · 点击线索标记";
  $("#sceneLoading").classList.toggle("is-hidden", sceneReady || view === "2d");
  if (view === "2d") renderMap();
  emit("smartcare:view", view);
}

function setCamera(mode) {
  currentCamera = mode;
  window.smartCareState.camera = mode;
  $$('[data-camera]').forEach((button) => {
    const active = button.dataset.camera === mode;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  $("#cameraBadge").textContent = `${mode === "third" ? "第三视角" : "第一视角"} · 按 V 切换`;
  $("#crosshair").classList.toggle("is-visible", currentView === "3d" && mode === "first");
  emit("smartcare:camera", mode);
}

function setScenario(id) {
  if (!scenarios[id]) return;
  currentScenario = id;
  window.smartCareState.scenario = id;
  const scenario = scenarios[id];
  $$(".scenario-tab").forEach((button) => {
    const active = button.dataset.scenario === id;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  $("#sceneCode").textContent = scenario.code;
  $("#sceneTitle").textContent = scenario.title;
  $("#elderLine").textContent = scenario.elderLine;
  $("#mentorTip").textContent = scenario.mentor;
  $("#stageObservation span").textContent = scenario.mapNote;
  renderMission();
  renderMap();
  emit("smartcare:scenario", id);
}

function renderMap() {
  const scenario = scenarios[currentScenario];
  const elder = scenario.elderPos;
  const caregiver = scenario.caregiverPos;
  const hotspots = scenario.hotspots.map((spot, index) => `<g class="map-hotspot" data-hotspot="${index}" tabindex="0" role="button" aria-label="观察${spot.label}"><circle cx="${spot.x}" cy="${spot.y}" r="17"/><text x="${spot.x}" y="${spot.y + 4}" text-anchor="middle">${index + 1}</text><text class="map-person-label" x="${spot.x + 24}" y="${spot.y + 4}">${spot.label}</text></g>`).join("");
  $("#mapView").innerHTML = `<svg viewBox="0 0 800 560" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${scenario.title}二维俯视情景图">
    <rect width="800" height="560" fill="#e6eee7"/><path d="M0 80H800M0 160H800M0 240H800M0 320H800M0 400H800M0 480H800" stroke="#dce6de"/>
    <rect class="map-room" x="100" y="65" width="600" height="425" rx="8"/>
    <path class="map-route" d="M${caregiver[0]} ${caregiver[1]} Q460 400 ${elder[0]} ${elder[1]}"/>
    <rect class="map-furniture" x="130" y="100" width="170" height="100" rx="12"/><rect x="145" y="112" width="140" height="25" rx="8" fill="#f7faf5"/><text class="map-label" x="215" y="180" text-anchor="middle">护理床</text>
    <rect class="map-furniture" x="525" y="100" width="140" height="65" rx="10"/><text class="map-label" x="595" y="140" text-anchor="middle">储物柜</text>
    <rect class="map-furniture" x="135" y="385" width="135" height="65" rx="16"/><text class="map-label" x="202" y="425" text-anchor="middle">休息沙发</text>
    <circle class="map-furniture" cx="410" cy="180" r="52"/><text class="map-label" x="410" y="184" text-anchor="middle">餐桌</text>
    <rect x="330" y="65" width="150" height="9" fill="#9ec7bb"/><text class="map-label" x="405" y="55" text-anchor="middle">自然采光窗</text>
    <path d="M690 300v85" stroke="#173b3a" stroke-width="5"/><text class="map-label" x="665" y="410">出口</text>
    <circle class="map-person" cx="${elder[0]}" cy="${elder[1]}" r="25" fill="${scenario.color}"/><circle cx="${elder[0]}" cy="${elder[1] - 6}" r="7" fill="#f4d4b8"/><path d="M${elder[0] - 11} ${elder[1] + 13}q11-19 22 0" fill="#fff" opacity=".8"/>
    <text class="map-person-label" x="${elder[0]}" y="${elder[1] + 45}" text-anchor="middle">陈奶奶</text>
    <circle class="map-person" cx="${caregiver[0]}" cy="${caregiver[1]}" r="25" fill="#176f63"/><path d="M${caregiver[0]} ${caregiver[1] - 14}l8 14-8 14-8-14Z" fill="#fff"/>
    <text class="map-person-label" x="${caregiver[0]}" y="${caregiver[1] + 45}" text-anchor="middle">你 · 护理员</text>
    ${hotspots}
    <g transform="translate(120 515)"><circle r="5" fill="#e98763"/><text class="map-label" x="14" y="4">编号标记可点击观察</text><path d="M200 0h30" class="map-route"/><text class="map-label" x="240" y="4">建议接近路线</text></g>
  </svg>`;
  $$(".map-hotspot").forEach((node) => {
    const activate = () => showObservation(Number(node.dataset.hotspot));
    node.addEventListener("click", activate);
    node.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); } });
  });
}

function showObservation(index) {
  const spot = scenarios[currentScenario].hotspots[index];
  if (!spot) return;
  $("#stageObservation span").textContent = spot.observation;
  showToast(`现场线索 · ${spot.label}`);
}

function renderMission() {
  const scenario = scenarios[currentScenario];
  const state = progress[currentScenario];
  const total = scenario.steps.length;
  $("#missionScore").textContent = `${state.score} / ${total}`;
  const completedSteps = state.completed ? total : state.index + (state.answers[state.index] !== undefined ? 1 : 0);
  $("#missionProgress").style.width = `${completedSteps / total * 100}%`;
  const content = $("#missionContent");
  if (state.completed) {
    const percent = Math.round(state.score / total * 100);
    const message = percent >= 75 ? "关键判断顺序较稳固，可以切换视角复盘空间位置，或进入下一情景。" : "建议先查看错题对应的行为证据，再重新开始本情景，巩固判断顺序。";
    content.innerHTML = `<div class="mission-complete"><div class="completion-ring">${percent}</div><p class="eyebrow">SCENARIO COMPLETE</p><h3>本次训练已完成</h3><p>${message}</p><div class="completion-actions"><button class="button button-coral" id="nextScenario" type="button">进入下一情景 <svg><use href="#i-arrow"/></svg></button><button class="button button-outline" id="reviewAssessment" type="button">查看能力复盘</button></div></div>`;
    $("#nextScenario").addEventListener("click", () => {
      const ids = Object.keys(scenarios);
      setScenario(ids[(ids.indexOf(currentScenario) + 1) % ids.length]);
    });
    $("#reviewAssessment").addEventListener("click", () => $("#assessment").scrollIntoView({ behavior: "smooth" }));
    return;
  }
  const step = scenario.steps[state.index];
  const answer = state.answers[state.index];
  const answered = answer !== undefined;
  const letters = ["A", "B", "C"];
  const choices = step.choices.map((choice, index) => {
    let className = "choice-button";
    if (answered && index === step.correct) className += " is-correct";
    if (answered && index === answer && answer !== step.correct) className += " is-wrong";
    return `<button type="button" class="${className}" data-choice="${index}" data-letter="${letters[index]}" ${answered ? "disabled" : ""}>${choice}</button>`;
  }).join("");
  const feedback = answered ? `<div class="feedback-box ${answer === step.correct ? "" : "is-review"}"><strong>${answer === step.correct ? "判断合适 · 已记录行为证据" : "这一步需要复盘"}</strong><p>${step.feedback}</p></div><button class="button button-coral mission-next" id="missionNext" type="button">${state.index === total - 1 ? "完成并生成复盘" : "下一步"} <svg><use href="#i-arrow"/></svg></button>` : "";
  content.innerHTML = `<div class="mission-step-label"><span>STEP ${String(state.index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</span><span>${scenario.short}</span></div><h3>${step.title}</h3><p class="mission-context">${step.context}</p><div class="choice-list">${choices}</div>${feedback}`;
  $$("[data-choice]").forEach((button) => button.addEventListener("click", () => selectChoice(Number(button.dataset.choice))));
  if (answered) $("#missionNext").addEventListener("click", nextStep);
}

function selectChoice(choice) {
  const state = progress[currentScenario];
  if (state.answers[state.index] !== undefined) return;
  state.answers[state.index] = choice;
  state.score = state.answers.reduce((sum, answer, index) => sum + (answer === scenarios[currentScenario].steps[index].correct ? 1 : 0), 0);
  renderMission();
}

function nextStep() {
  const state = progress[currentScenario];
  if (state.answers[state.index] === undefined) return;
  if (state.index < scenarios[currentScenario].steps.length - 1) {
    state.index += 1;
  } else {
    state.completed = true;
    recordCompletion();
  }
  renderMission();
}

function recordCompletion() {
  const state = progress[currentScenario];
  if (state.recorded) return;
  state.recorded = true;
  const score = Math.round(state.score / scenarios[currentScenario].steps.length * 100);
  history.unshift({ scenario: currentScenario, title: scenarios[currentScenario].title, score, correct: state.score, total: scenarios[currentScenario].steps.length, date: new Date().toISOString() });
  history = history.slice(0, 30);
  try { localStorage.setItem(storageKey, JSON.stringify(history)); } catch (error) { /* local storage can be unavailable in private contexts */ }
  renderAssessment();
}

function restartScenario() {
  progress[currentScenario] = { index: 0, answers: [], score: 0, completed: false, recorded: false };
  renderMission();
  showToast("本情景已重置，历史复盘记录仍保留");
}

function renderCourses() {
  $("#courseGrid").innerHTML = courses.map((course, index) => `<article class="course-card" data-category="${course.category}"><div class="course-card-top"><span class="course-number">COURSE ${String(index + 1).padStart(2, "0")}</span><span class="course-category">${course.categoryName}</span></div><h3>${course.title}</h3><span class="course-en">${course.en}</span><p>${course.description}</p><div class="course-meta"><span>${course.hours}</span><span>${course.mode}</span></div><div class="course-outcome">${course.outcome}</div><button class="course-open" type="button" data-course="${course.id}">查看学习目标与评价 <svg><use href="#i-arrow"/></svg></button></article>`).join("");
  $$("[data-course]").forEach((button) => button.addEventListener("click", () => openCourse(button.dataset.course)));
}

function openCourse(id) {
  const course = courses.find((item) => item.id === id);
  if (!course) return;
  $("#dialogContent").innerHTML = `<span class="dialog-tag">${course.categoryName} · ${course.hours}</span><h2>${course.title}</h2><span class="course-en">${course.en}</span><p class="dialog-description">${course.description}</p><h4>完成课程后，你能够：</h4><ul>${course.objectives.map((item) => `<li>${item}</li>`).join("")}</ul><h4>评价证据</h4><p class="dialog-description">${course.assessment}</p><a class="button button-coral" href="#training" id="dialogTraining">进入相关情景训练 <svg><use href="#i-arrow"/></svg></a>`;
  $("#dialogTraining").addEventListener("click", () => $("#courseDialog").close());
  $("#courseDialog").showModal();
}

function renderJourney() {
  $("#journeySteps").innerHTML = journeyData.map((item, index) => `<button class="journey-step ${index === journeyIndex ? "is-active" : ""} ${index < journeyIndex ? "is-past" : ""}" type="button" data-journey="${index}" aria-pressed="${index === journeyIndex}"><span>${String(index + 1).padStart(2, "0")}</span><b>${item.title}</b></button>`).join("");
  $$("[data-journey]").forEach((button) => button.addEventListener("click", () => { stopJourney(); journeyIndex = Number(button.dataset.journey); renderJourney(); }));
  const item = journeyData[journeyIndex];
  $("#journeyLabel").textContent = `STEP ${String(journeyIndex + 1).padStart(2, "0")} / 06`;
  $("#journeyTitle").textContent = item.title;
  $("#journeyDescription").textContent = item.description;
  $("#journeyMetric").textContent = item.metric;
  $("#journeyValue").textContent = item.value;
  $("#journeyEvidence").textContent = item.evidence;
  $("#journeyProgress").style.width = `${(journeyIndex + 1) / journeyData.length * 100}%`;
}

function stopJourney() {
  clearInterval(journeyTimer);
  journeyTimer = null;
  $("#journeyPlay").disabled = false;
  $("#journeyPause").disabled = true;
}
function playJourney() {
  if (journeyTimer) return;
  $("#journeyPlay").disabled = true;
  $("#journeyPause").disabled = false;
  journeyTimer = setInterval(() => {
    if (journeyIndex >= journeyData.length - 1) { stopJourney(); return; }
    journeyIndex += 1;
    renderJourney();
  }, 3500);
}

function getBestScores() {
  const best = {};
  history.forEach((record) => { if (!best[record.scenario] || record.score > best[record.scenario]) best[record.scenario] = record.score; });
  return best;
}

function renderRadar(values) {
  const labels = ["护理知识", "应急处理", "沟通关怀", "数字技能", "学习进度", "职业伦理"];
  const cx = 210, cy = 156, radius = 98;
  const point = (index, scale = 1) => {
    const angle = (-90 + index * 60) * Math.PI / 180;
    return [cx + Math.cos(angle) * radius * scale, cy + Math.sin(angle) * radius * scale];
  };
  let markup = "";
  [0.25, 0.5, 0.75, 1].forEach((scale) => {
    const points = labels.map((_, index) => point(index, scale).join(",")).join(" ");
    markup += `<polygon class="radar-grid" points="${points}"/>`;
  });
  labels.forEach((label, index) => {
    const axisEnd = point(index, 1);
    const labelPoint = point(index, 1.32);
    const valuePoint = point(index, 1.17);
    markup += `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${axisEnd[0]}" y2="${axisEnd[1]}"/><text class="radar-label" x="${labelPoint[0]}" y="${labelPoint[1]}" text-anchor="middle">${label}</text><text class="radar-value" x="${valuePoint[0]}" y="${valuePoint[1]}" text-anchor="middle">${values[index]}</text>`;
  });
  const valuePoints = values.map((value, index) => point(index, value / 100));
  markup += `<polygon class="radar-shape" points="${valuePoints.map((p) => p.join(",")).join(" ")}"/>`;
  valuePoints.forEach((p) => { markup += `<circle class="radar-dot" cx="${p[0]}" cy="${p[1]}" r="4"/>`; });
  $("#abilityRadar").innerHTML = markup;
}

function renderAssessment() {
  const best = getBestScores();
  const values = [86, 78, 82, 74, 76, 88];
  const mapping = { fall: [1], acute: [0, 1], dementia: [2], daily: [0, 5] };
  Object.entries(best).forEach(([id, score]) => {
    mapping[id].forEach((index) => { values[index] = Math.round((values[index] + score) / 2); });
  });
  renderRadar(values);
  const completed = Object.keys(best).length;
  $("#completedScenarioCount").innerHTML = `${completed}<small>/4</small>`;
  const latest = history[0];
  if (latest) {
    $("#recommendationTitle").textContent = latest.score >= 75 ? `保持${latest.title}判断，尝试下一情景` : `复盘${latest.title}的关键步骤`;
    $("#recommendationText").textContent = latest.score >= 75 ? `本次得分 ${latest.score}。建议切换第一与第三视角检查行动顺序，再把能力迁移到其他情景。` : `本次得分 ${latest.score}。推荐依据是答错的具体步骤，而不是笼统的“能力不足”；重新练习后再比较成绩。`;
  }
  const container = $("#trainingHistory");
  if (!history.length) {
    container.innerHTML = '<div class="history-empty">尚未完成本地情景。进入上方训练台完成四个判断步骤后，这里会显示成绩、时间与下一步建议。</div>';
    return;
  }
  container.innerHTML = history.slice(0, 8).map((record) => {
    const date = new Date(record.date);
    const dateText = Number.isNaN(date.getTime()) ? "本地记录" : date.toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    const advice = record.score >= 75 ? "可进入下一情景，并切换视角复盘" : "建议重做本情景，重点阅读错误反馈";
    return `<div class="history-row"><strong>${record.title}</strong><span class="history-score">${record.score} 分</span><span class="history-advice">${advice}</span><time>${dateText}</time></div>`;
  }).join("");
}

function downloadReport() {
  const lines = ["SmartCare VR · 本地情景训练复盘", "================================", `导出时间：${new Date().toLocaleString("zh-CN")}`, ""];
  if (!history.length) lines.push("尚未完成情景训练。请先进入训练台完成至少一个情景。", "");
  history.forEach((record, index) => {
    lines.push(`${index + 1}. ${record.title}｜${record.score} 分｜答对 ${record.correct}/${record.total}`, `   时间：${new Date(record.date).toLocaleString("zh-CN")}`, `   建议：${record.score >= 75 ? "进入下一情景，并用双视角复盘。" : "重新练习本情景，重点阅读错误步骤反馈。"}`, "");
  });
  lines.push("说明：本文件来自课程交互原型，仅记录当前浏览器中的演示训练，不代表真实护理资格或临床能力。", "AI 与 VR 仅作教学辅助，不替代专业护理判断与真实导师监督实践。");
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "SmartCare-训练复盘.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  showToast("复盘摘要已导出");
}

function bindEvents() {
  $$(".scenario-tab").forEach((button) => button.addEventListener("click", () => setScenario(button.dataset.scenario)));
  $$('[data-view]').forEach((button) => button.addEventListener("click", () => setView(button.dataset.view)));
  $$('[data-camera]').forEach((button) => button.addEventListener("click", () => setCamera(button.dataset.camera)));
  $$('[data-set-view]').forEach((link) => link.addEventListener("click", () => setView(link.dataset.setView)));
  $("#observeButton").addEventListener("click", () => currentView === "3d" ? emit("smartcare:observe") : showObservation(0));
  $("#resetCamera").addEventListener("click", () => currentView === "3d" ? emit("smartcare:reset-camera") : showToast("2D 已显示完整俯视情景"));
  $("#restartScenario").addEventListener("click", restartScenario);
  $("#fallback2d").addEventListener("click", () => setView("2d"));
  $("#journeyPlay").addEventListener("click", playJourney);
  $("#journeyPause").addEventListener("click", stopJourney);
  $("#journeyReplay").addEventListener("click", () => { stopJourney(); journeyIndex = 0; renderJourney(); playJourney(); });
  $$("[data-filter]").forEach((button) => button.addEventListener("click", () => {
    $$("[data-filter]").forEach((item) => item.classList.toggle("is-active", item === button));
    $$(".course-card").forEach((card) => card.classList.toggle("is-hidden", button.dataset.filter !== "all" && card.dataset.category !== button.dataset.filter));
  }));
  $("#dialogClose").addEventListener("click", () => $("#courseDialog").close());
  $("#courseDialog").addEventListener("click", (event) => { if (event.target === $("#courseDialog")) $("#courseDialog").close(); });
  $("#downloadReport").addEventListener("click", downloadReport);
  $("#menuToggle").addEventListener("click", () => {
    const open = !$("#mobileNav").classList.contains("is-open");
    $("#mobileNav").classList.toggle("is-open", open);
    $("#menuToggle").setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });
  $$("#mobileNav a").forEach((link) => link.addEventListener("click", () => {
    $("#mobileNav").classList.remove("is-open");
    $("#menuToggle").setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }));
  $$('[data-move]').forEach((button) => {
    const start = (event) => { event.preventDefault(); emit("smartcare:move", { direction: button.dataset.move, active: true }); };
    const end = () => emit("smartcare:move", { direction: button.dataset.move, active: false });
    button.addEventListener("pointerdown", start);
    button.addEventListener("pointerup", end);
    button.addEventListener("pointercancel", end);
    button.addEventListener("pointerleave", end);
  });
  window.addEventListener("smartcare:hotspot", (event) => {
    $("#stageObservation span").textContent = event.detail.observation;
    showToast(`现场线索 · ${event.detail.label}`);
  });
  window.addEventListener("smartcare:camera-changed", (event) => setCamera(event.detail));
  window.addEventListener("smartcare:scene-ready", (event) => {
    sceneReady = event.detail.ready;
    $("#sceneLoading").classList.toggle("is-hidden", sceneReady || currentView === "2d");
    if (!sceneReady && currentView === "3d") $("#sceneFallback").hidden = false;
  });
  window.addEventListener("scroll", () => $("#siteHeader").classList.toggle("is-scrolled", window.scrollY > 30), { passive: true });
}

function setupReveal() {
  if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((item) => item.classList.add("is-visible")); return; }
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.08 });
  $$(".reveal").forEach((item) => observer.observe(item));
  const sections = $$("main section[id]");
  const navObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) $$(".desktop-nav a").forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
  }), { rootMargin: "-25% 0px -65% 0px" });
  sections.forEach((section) => navObserver.observe(section));
}

bindEvents();
renderCourses();
renderJourney();
renderAssessment();
setScenario("fall");
setCamera("third");
setView("3d");
setupReveal();
