import * as THREE from "./vendor/three.module.min.js";

const container = document.getElementById("sceneContainer");
const trainingSection = document.getElementById("training");
let renderer, scene, camera, caregiver, elder, elderLabel, markerGroup, scenarioProps;
let currentScenario = window.smartCareState?.scenario || "fall";
let currentView = window.smartCareState?.view || "3d";
let cameraMode = window.smartCareState?.camera || "third";
let yaw = 0;
let pitch = 0.5;
let cameraDistance = 5.8;
let pointerDown = false;
let pointerMoved = false;
let pointerStart = { x: 0, y: 0 };
let previousPointer = { x: 0, y: 0 };
let lastTime = performance.now();
const keys = { forward: false, backward: false, left: false, right: false };
const markerMeshes = [];
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const initialPositions = {
  fall: new THREE.Vector3(1.1, 0, 3.2),
  acute: new THREE.Vector3(1.1, 0, 3.1),
  dementia: new THREE.Vector3(2.6, 0, 2.4),
  daily: new THREE.Vector3(-1.3, 0, 2.2)
};
const scenarioHotspots = {
  fall: [
    { position: [-0.9, 0.65, 0.8], label: "手杖", observation: "手杖落在一旁，地毯边缘卷起；先排除继续滑倒的风险。" },
    { position: [0.1, 1.0, 0], label: "意识", observation: "老人能回应，但表示髋部疼痛。保持原位，继续观察并呼叫支援。" },
    { position: [4.1, 1.3, -3.5], label: "呼叫", observation: "呼叫装置在床边。确认需要支援后，按机构流程联系护士或导师。" }
  ],
  acute: [
    { position: [0, 1.7, -0.3], label: "状态", observation: "老人清醒，主诉胸闷与呼吸不适。不要让其独自离开或强行平躺。" },
    { position: [4.1, 1.3, -3.5], label: "求助", observation: "立即按机构应急流程联系医护人员；真实急症应联系当地急救服务。" },
    { position: [-2.1, 1.1, 0.7], label: "记录", observation: "记录症状开始时间、主诉、意识呼吸变化及已采取的措施，便于交接。" }
  ],
  dementia: [
    { position: [2.4, 1.75, -1.1], label: "情绪", observation: "重复提问可能伴随焦虑或不确定感，不必用争辩证明谁记得正确。" },
    { position: [1.6, 1.15, -0.4], label: "餐具", observation: "提供两种简单选择即可，避免一次给出过多信息。" },
    { position: [-3.5, 1.5, -3.8], label: "环境", observation: "降低噪声与干扰，保持平视和舒缓语速，有助于建立安全感。" }
  ],
  daily: [
    { position: [-2.5, 1.8, -1.1], label: "意愿", observation: "老人希望保留自主性。先询问需要怎样的帮助，而不是全部代劳。" },
    { position: [-1.0, 0.55, 0.7], label: "通道", observation: "移动前检查通道、设备刹车和防滑穿着，避免临时障碍。" },
    { position: [-4.1, 1.5, -2.4], label: "隐私", observation: "洗漱与移动前说明步骤、遮挡隐私部位，并确认老人准备就绪。" }
  ]
};

function material(color, roughness = 0.82, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}
function box(parent, size, position, color, options = {}) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), options.material || material(color, options.roughness));
  mesh.position.set(...position);
  mesh.castShadow = options.cast !== false;
  mesh.receiveShadow = options.receive !== false;
  if (options.rotation) mesh.rotation.set(...options.rotation);
  parent.add(mesh);
  return mesh;
}
function cylinder(parent, radiusTop, radiusBottom, height, position, color, segments = 20) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material(color));
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function sphere(parent, radius, position, color, scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 14), material(color));
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  parent.add(mesh);
  return mesh;
}
function makeLabel(text, accent = "#e98763", width = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = 72;
  const context = canvas.getContext("2d");
  context.fillStyle = "rgba(12,41,41,0.88)";
  context.beginPath();
  context.roundRect(3, 3, width - 6, 62, 16);
  context.fill();
  context.fillStyle = accent;
  context.fillRect(16, 17, 5, 30);
  context.fillStyle = "#ffffff";
  context.font = "600 25px Microsoft YaHei, sans-serif";
  context.textBaseline = "middle";
  context.fillText(text, 34, 34);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
  sprite.scale.set(1.65, 0.47, 1);
  sprite.renderOrder = 20;
  return sprite;
}
function disposeObject(object) {
  if (!object) return;
  object.traverse((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) {
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((item) => { if (item.map) item.map.dispose(); item.dispose(); });
    }
  });
  object.removeFromParent();
}

function buildRoom() {
  const room = new THREE.Group();
  scene.add(room);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), material("#c9b99f", 0.95));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);
  for (let x = -5.5; x <= 5.5; x += 1) box(room, [0.012, 0.008, 10], [x, 0.006, 0], "#b6a78e", { cast: false });
  box(room, [12, 3.6, 0.16], [0, 1.8, -5], "#e7e1d4");
  box(room, [0.16, 3.6, 10], [-6, 1.8, 0], "#e2ded2");
  box(room, [12, 0.14, 0.12], [0, 0.11, -4.87], "#8fa99d");
  box(room, [0.12, 0.14, 10], [-5.87, 0.11, 0], "#8fa99d");
  box(room, [4.1, 2.15, 0.08], [1.5, 2.05, -4.88], "#a8d1cc", { material: new THREE.MeshStandardMaterial({ color: "#b9ddd6", emissive: "#8ebbb3", emissiveIntensity: 0.25, roughness: 0.25 }) });
  box(room, [4.35, 0.11, 0.15], [1.5, 3.16, -4.79], "#f7f3e9");
  box(room, [4.35, 0.11, 0.15], [1.5, 0.95, -4.79], "#f7f3e9");
  box(room, [0.11, 2.3, 0.15], [-0.68, 2.05, -4.79], "#f7f3e9");
  box(room, [0.11, 2.3, 0.15], [3.68, 2.05, -4.79], "#f7f3e9");
  box(room, [0.08, 2.15, 0.14], [1.5, 2.05, -4.77], "#f7f3e9");
  box(room, [4.1, 0.08, 0.14], [1.5, 2.05, -4.77], "#f7f3e9");
  box(room, [1.25, 2.25, 0.09], [-4.5, 1.55, -4.87], "#d2c3a8");
  box(room, [0.95, 1.9, 0.1], [-4.5, 1.48, -4.8], "#789b8b");
  const wallLabel = makeLabel("SMARTCARE · 护理实训室", "#8fd1ba", 420);
  wallLabel.position.set(-2.2, 2.75, -4.75);
  wallLabel.scale.set(2.5, 0.43, 1);
  room.add(wallLabel);

  const rug = box(room, [3.7, 0.035, 2.4], [0.3, 0.025, 0.3], "#b7cbbd", { cast: false });
  rug.rotation.y = -0.08;
  for (let i = 0; i < 5; i += 1) box(room, [0.035, 0.01, 2.1], [-1.1 + i * 0.7, 0.05, 0.3], "#9db8a7", { cast: false });

  const bed = new THREE.Group();
  bed.position.set(-3.8, 0, -2.8);
  room.add(bed);
  box(bed, [2.25, 0.38, 3.0], [0, 0.43, 0], "#8b9f93");
  box(bed, [2.12, 0.28, 2.85], [0, 0.73, 0], "#f0eee5");
  box(bed, [2.14, 0.12, 1.9], [0, 0.92, 0.43], "#8fb5a4");
  box(bed, [1.55, 0.18, 0.68], [0, 0.95, -0.9], "#fffaf0");
  box(bed, [2.35, 1.2, 0.16], [0, 0.85, -1.52], "#6f8c7f");
  [-0.9, 0.9].forEach((x) => [-1.25, 1.25].forEach((z) => cylinder(bed, 0.055, 0.055, 0.4, [x, 0.2, z], "#6d7d75")));

  const cabinet = new THREE.Group();
  cabinet.position.set(4.65, 0, -3.65);
  room.add(cabinet);
  box(cabinet, [1.5, 1.15, 0.75], [0, 0.58, 0], "#9a8267");
  box(cabinet, [1.42, 0.06, 0.78], [0, 1.18, 0], "#c6ad8b");
  box(cabinet, [0.04, 0.85, 0.78], [0, 0.6, 0.02], "#7b6753");
  [-0.37, 0.37].forEach((x) => sphere(cabinet, 0.035, [x, 0.72, 0.4], "#d9c9a8"));
  const callButton = cylinder(cabinet, 0.12, 0.12, 0.07, [-0.45, 1.28, 0], "#e98763", 24);
  callButton.rotation.x = Math.PI / 2;

  const table = new THREE.Group();
  table.position.set(2.3, 0, -1.25);
  room.add(table);
  cylinder(table, 0.92, 0.92, 0.11, [0, 0.85, 0], "#b39470", 36);
  cylinder(table, 0.12, 0.17, 0.8, [0, 0.42, 0], "#806d57");
  cylinder(table, 0.5, 0.5, 0.08, [0, 0.05, 0], "#806d57");
  const plate = cylinder(table, 0.23, 0.25, 0.035, [0.2, 0.93, 0.1], "#f5f1e6", 28);
  plate.material.roughness = 0.4;
  cylinder(table, 0.09, 0.075, 0.22, [-0.35, 1.0, -0.15], "#d8ece5", 20);

  const sofa = new THREE.Group();
  sofa.position.set(-4.3, 0, 2.35);
  sofa.rotation.y = Math.PI / 2;
  room.add(sofa);
  box(sofa, [2.7, 0.5, 0.95], [0, 0.48, 0], "#75998c");
  box(sofa, [2.7, 0.85, 0.28], [0, 0.95, -0.42], "#6b8d80");
  box(sofa, [0.25, 0.65, 1.05], [-1.3, 0.62, 0], "#6b8d80");
  box(sofa, [0.25, 0.65, 1.05], [1.3, 0.62, 0], "#6b8d80");
  box(sofa, [0.85, 0.18, 0.7], [-0.62, 0.82, 0], "#d9c9a6");
  box(sofa, [0.85, 0.18, 0.7], [0.62, 0.82, 0], "#d9c9a6");

  const shelf = new THREE.Group();
  shelf.position.set(-5.65, 0, 0.2);
  room.add(shelf);
  box(shelf, [0.5, 2.1, 1.6], [0, 1.05, 0], "#a88e6d");
  [0.45, 1.05, 1.65].forEach((y) => box(shelf, [0.56, 0.06, 1.55], [0.05, y, 0], "#d2bb98"));
  ["#d88e6d", "#e7d59c", "#7fa797", "#ede5d5"].forEach((color, index) => box(shelf, [0.22, 0.42, 0.28], [0.35, 1.32, -0.5 + index * 0.32], color));

  const plant = new THREE.Group();
  plant.position.set(4.85, 0, 2.8);
  room.add(plant);
  cylinder(plant, 0.32, 0.24, 0.55, [0, 0.28, 0], "#b87d5e");
  cylinder(plant, 0.05, 0.05, 1.0, [0, 1.0, 0], "#577660");
  for (let i = 0; i < 7; i += 1) {
    const leaf = sphere(plant, 0.32, [Math.sin(i * 2.2) * 0.32, 0.9 + i * 0.11, Math.cos(i * 2.2) * 0.32], i % 2 ? "#5f9271" : "#769f77", [0.5, 1, 0.3]);
    leaf.rotation.z = Math.sin(i) * 0.8;
  }
  const ceilingLight = new THREE.PointLight("#fff0d5", 20, 12, 2);
  ceilingLight.position.set(0, 3.4, 1);
  room.add(ceilingLight);
}

function createPerson({ uniform = "#317f73", elderly = false } = {}) {
  const group = new THREE.Group();
  const skin = elderly ? "#d9b79b" : "#d7ad8d";
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 0.48, 5, 12), material(uniform));
  body.position.y = 1.05;
  body.castShadow = true;
  group.add(body);
  const head = sphere(group, 0.235, [0, 1.64, 0], skin, [0.92, 1.05, 0.95]);
  const hair = sphere(group, 0.225, [0, 1.76, -0.015], elderly ? "#d8d5cb" : "#3c3531", [0.96, 0.55, 0.95]);
  if (elderly) {
    sphere(group, 0.07, [-0.2, 1.65, -0.03], "#d8d5cb");
    sphere(group, 0.07, [0.2, 1.65, -0.03], "#d8d5cb");
  }
  [-0.073, 0.073].forEach((x) => sphere(group, 0.018, [x, 1.66, 0.215], "#3d4441"));
  const nose = sphere(group, 0.025, [0, 1.60, 0.235], skin);
  nose.scale.z = 1.25;
  const arms = [];
  [-1, 1].forEach((side) => {
    const armPivot = new THREE.Group();
    armPivot.position.set(side * 0.34, 1.29, 0);
    const arm = cylinder(armPivot, 0.07, 0.065, 0.58, [0, -0.26, 0], uniform, 12);
    sphere(armPivot, 0.075, [0, -0.58, 0], skin);
    armPivot.rotation.z = side * -0.08;
    group.add(armPivot);
    arms.push(armPivot);
  });
  const legs = [];
  [-1, 1].forEach((side) => {
    const legPivot = new THREE.Group();
    legPivot.position.set(side * 0.14, 0.76, 0);
    cylinder(legPivot, 0.09, 0.08, 0.65, [0, -0.3, 0], elderly ? "#65766f" : "#315a55", 12);
    const shoe = sphere(legPivot, 0.12, [0, -0.65, 0.08], "#384743", [0.85, 0.55, 1.4]);
    shoe.castShadow = true;
    group.add(legPivot);
    legs.push(legPivot);
  });
  group.userData = { body, head, hair, arms, legs };
  return group;
}

function makeChair(position, rotation = 0) {
  const chair = new THREE.Group();
  chair.position.set(...position);
  chair.rotation.y = rotation;
  box(chair, [0.85, 0.12, 0.8], [0, 0.62, 0], "#9c8061");
  box(chair, [0.85, 0.95, 0.12], [0, 1.04, -0.36], "#9c8061");
  [-0.33, 0.33].forEach((x) => [-0.29, 0.29].forEach((z) => cylinder(chair, 0.035, 0.035, 0.58, [x, 0.29, z], "#6f5b48", 10)));
  scenarioProps.add(chair);
  return chair;
}
function makeWheelchair(position) {
  const chair = new THREE.Group();
  chair.position.set(...position);
  box(chair, [0.85, 0.12, 0.8], [0, 0.7, 0], "#567a72");
  box(chair, [0.85, 0.85, 0.12], [0, 1.05, -0.35], "#567a72");
  [-0.52, 0.52].forEach((x) => {
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.43, 0.035, 10, 28), material("#364b48", 0.5, 0.25));
    wheel.position.set(x, 0.46, 0);
    wheel.rotation.y = Math.PI / 2;
    chair.add(wheel);
    cylinder(chair, 0.025, 0.025, 0.75, [x, 0.88, -0.42], "#6e7c77", 8);
  });
  box(chair, [0.75, 0.06, 0.3], [0, 0.25, 0.65], "#657873");
  scenarioProps.add(chair);
}

function rebuildScenario(id) {
  currentScenario = id;
  disposeObject(elder);
  disposeObject(elderLabel);
  disposeObject(markerGroup);
  disposeObject(scenarioProps);
  markerMeshes.length = 0;
  scenarioProps = new THREE.Group();
  scene.add(scenarioProps);
  elder = createPerson({ uniform: id === "acute" ? "#a27c68" : "#bb8e75", elderly: true });
  scene.add(elder);
  elderLabel = makeLabel("陈奶奶 · 虚拟老人");
  scene.add(elderLabel);
  const parts = elder.userData;
  if (id === "fall") {
    elder.position.set(-0.25, 0.35, 0.05);
    elder.rotation.z = -Math.PI / 2;
    elder.rotation.y = 0.25;
    parts.arms[0].rotation.x = -0.8;
    parts.arms[1].rotation.x = 0.7;
    elderLabel.position.set(-1.35, 1.05, 0.1);
    const cane = cylinder(scenarioProps, 0.025, 0.025, 1.25, [-0.9, 0.09, 0.9], "#725b46", 10);
    cane.rotation.z = Math.PI / 2;
    cane.rotation.y = 0.35;
  } else if (id === "acute") {
    elder.position.set(0, 0, -0.25);
    parts.legs.forEach((leg) => { leg.rotation.x = -1.25; });
    parts.arms[0].rotation.x = -1.1;
    parts.arms[0].rotation.z = -0.45;
    elderLabel.position.set(0, 2.2, -0.25);
    makeChair([0, 0, -0.35]);
    box(scenarioProps, [0.65, 0.65, 0.65], [-2.1, 0.35, 0.7], "#9a8267");
    box(scenarioProps, [0.45, 0.03, 0.32], [-2.1, 0.7, 0.7], "#f3efe4");
  } else if (id === "dementia") {
    elder.position.set(2.4, 0, -1.2);
    elder.rotation.y = 0.25;
    parts.legs.forEach((leg) => { leg.rotation.x = -1.2; });
    parts.arms[0].rotation.x = -0.65;
    parts.arms[1].rotation.x = -0.55;
    elderLabel.position.set(2.4, 2.2, -1.2);
    makeChair([2.4, 0, -1.3], 0.25);
  } else {
    elder.position.set(-2.5, 0, -1.1);
    elder.rotation.y = 0.3;
    parts.arms[1].rotation.x = -0.45;
    elderLabel.position.set(-2.5, 2.2, -1.1);
    makeWheelchair([-3.9, 0, 0.25]);
  }
  caregiver.position.copy(initialPositions[id]);
  caregiver.rotation.y = Math.PI;
  markerGroup = new THREE.Group();
  scene.add(markerGroup);
  scenarioHotspots[id].forEach((spot, index) => {
    const group = new THREE.Group();
    group.position.set(...spot.position);
    group.userData.baseY = spot.position[1];
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 12), new THREE.MeshStandardMaterial({ color: "#f4a17e", emissive: "#e98763", emissiveIntensity: 1.3, roughness: 0.3 }));
    core.userData.hotspot = index;
    group.add(core);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.018, 8, 30), new THREE.MeshBasicMaterial({ color: "#fff3e8", transparent: true, opacity: 0.9, depthTest: false }));
    ring.userData.hotspot = index;
    group.add(ring);
    const label = makeLabel(`${index + 1} · ${spot.label}`);
    label.position.y = 0.37;
    label.scale.set(1.15, 0.33, 1);
    group.add(label);
    markerGroup.add(group);
    markerMeshes.push(core, ring);
  });
  yaw = 0;
  pitch = cameraMode === "third" ? 0.5 : 0;
  cameraDistance = 5.8;
}

function emitHotspot(index) {
  const spot = scenarioHotspots[currentScenario][index];
  if (!spot) return;
  window.dispatchEvent(new CustomEvent("smartcare:hotspot", { detail: spot }));
  const group = markerGroup.children[index];
  if (group) group.userData.pulse = 1;
}
function observeNearest() {
  if (!markerGroup || !caregiver) return;
  let nearest = 0;
  let distance = Infinity;
  markerGroup.children.forEach((group, index) => {
    const current = group.position.distanceTo(caregiver.position);
    if (current < distance) { distance = current; nearest = index; }
  });
  emitHotspot(nearest);
}
function setCameraMode(mode) {
  cameraMode = mode;
  pitch = mode === "third" ? 0.5 : 0;
  caregiver.visible = mode === "third";
  document.getElementById("crosshair").classList.toggle("is-visible", currentView === "3d" && mode === "first");
}
function trainingIsVisible() {
  const rect = trainingSection.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}
function updateMovement(delta) {
  if (currentView !== "3d" || !trainingIsVisible()) return;
  let forwardAmount = 0;
  let sideAmount = 0;
  if (keys.forward) forwardAmount += 1;
  if (keys.backward) forwardAmount -= 1;
  if (keys.left) sideAmount -= 1;
  if (keys.right) sideAmount += 1;
  if (!forwardAmount && !sideAmount) return;
  const length = Math.hypot(forwardAmount, sideAmount) || 1;
  forwardAmount /= length;
  sideAmount /= length;
  const speed = delta * 2.15;
  const forward = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, Math.sin(yaw));
  caregiver.position.addScaledVector(forward, forwardAmount * speed);
  caregiver.position.addScaledVector(right, sideAmount * speed);
  caregiver.position.x = THREE.MathUtils.clamp(caregiver.position.x, -4.9, 4.9);
  caregiver.position.z = THREE.MathUtils.clamp(caregiver.position.z, -3.9, 4.0);
  caregiver.rotation.y = Math.PI - yaw;
}
function updateCamera(delta) {
  if (!caregiver) return;
  const forward = new THREE.Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
  let desiredPosition, lookTarget;
  if (cameraMode === "first") {
    desiredPosition = caregiver.position.clone().add(new THREE.Vector3(0, 1.58, 0));
    lookTarget = desiredPosition.clone().add(new THREE.Vector3(
      Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      -Math.cos(yaw) * Math.cos(pitch)
    ));
    camera.position.lerp(desiredPosition, Math.min(1, delta * 18));
  } else {
    const target = caregiver.position.clone().addScaledVector(forward, 1.25).add(new THREE.Vector3(0, 1.05, 0));
    const horizontalDistance = cameraDistance * Math.cos(pitch);
    desiredPosition = target.clone().addScaledVector(forward, -horizontalDistance);
    desiredPosition.y += cameraDistance * Math.sin(pitch);
    lookTarget = target;
    camera.position.lerp(desiredPosition, Math.min(1, delta * 8));
  }
  camera.lookAt(lookTarget);
}
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const delta = Math.min((now - lastTime) / 1000, 0.05);
  lastTime = now;
  if (!renderer || currentView !== "3d" || document.hidden) return;
  updateMovement(delta);
  updateCamera(delta);
  const elapsed = clock.getElapsedTime();
  if (elder && currentScenario !== "fall") elder.userData.body.scale.y = 1 + Math.sin(elapsed * 1.5) * 0.008;
  if (markerGroup) markerGroup.children.forEach((group, index) => {
    group.position.y = group.userData.baseY + Math.sin(elapsed * 2 + index) * 0.055;
    if (group.children[1]) group.children[1].rotation.z = elapsed * 0.8;
    if (group.userData.pulse > 0) {
      group.userData.pulse = Math.max(0, group.userData.pulse - delta * 1.8);
      const scale = 1 + Math.sin(group.userData.pulse * Math.PI) * 0.35;
      group.scale.setScalar(scale);
    } else group.scale.setScalar(1);
  });
  renderer.render(scene, camera);
}
function resize() {
  if (!renderer || !camera) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (!width || !height) return;
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
function bindSceneEvents() {
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute("aria-label", "3D 护理情景。WASD 移动，拖动环顾，V 切换第一或第三视角。");
  canvas.addEventListener("pointerdown", (event) => {
    pointerDown = true;
    pointerMoved = false;
    pointerStart = { x: event.clientX, y: event.clientY };
    previousPointer = { x: event.clientX, y: event.clientY };
    canvas.setPointerCapture(event.pointerId);
  });
  canvas.addEventListener("pointermove", (event) => {
    if (!pointerDown) return;
    const dx = event.clientX - previousPointer.x;
    const dy = event.clientY - previousPointer.y;
    if (Math.hypot(event.clientX - pointerStart.x, event.clientY - pointerStart.y) > 5) pointerMoved = true;
    yaw -= dx * 0.0045;
    pitch = THREE.MathUtils.clamp(pitch - dy * 0.0035, cameraMode === "third" ? 0.15 : -1.05, cameraMode === "third" ? 1.05 : 1.05);
    previousPointer = { x: event.clientX, y: event.clientY };
  });
  canvas.addEventListener("pointerup", (event) => {
    pointerDown = false;
    if (!pointerMoved) {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width * 2 - 1;
      pointer.y = -(event.clientY - rect.top) / rect.height * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(markerMeshes, false);
      if (hits.length) emitHotspot(hits[0].object.userData.hotspot);
    }
  });
  canvas.addEventListener("pointercancel", () => { pointerDown = false; });
  canvas.addEventListener("wheel", (event) => {
    if (cameraMode !== "third") return;
    event.preventDefault();
    cameraDistance = THREE.MathUtils.clamp(cameraDistance + event.deltaY * 0.006, 3.2, 8.5);
  }, { passive: false });
  const keyMap = { KeyW: "forward", ArrowUp: "forward", KeyS: "backward", ArrowDown: "backward", KeyA: "left", ArrowLeft: "left", KeyD: "right", ArrowRight: "right" };
  window.addEventListener("keydown", (event) => {
    if (["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName) || event.target.isContentEditable) return;
    if (event.code === "KeyV" && currentView === "3d" && trainingIsVisible() && !event.repeat) {
      event.preventDefault();
      window.dispatchEvent(new CustomEvent("smartcare:camera-changed", { detail: cameraMode === "third" ? "first" : "third" }));
      return;
    }
    const direction = keyMap[event.code];
    if (direction && currentView === "3d" && trainingIsVisible()) {
      event.preventDefault();
      keys[direction] = true;
    }
  });
  window.addEventListener("keyup", (event) => { const direction = keyMap[event.code]; if (direction) keys[direction] = false; });
  window.addEventListener("blur", () => Object.keys(keys).forEach((key) => { keys[key] = false; }));
  window.addEventListener("smartcare:scenario", (event) => rebuildScenario(event.detail));
  window.addEventListener("smartcare:view", (event) => { currentView = event.detail; if (currentView === "3d") setTimeout(resize, 30); });
  window.addEventListener("smartcare:camera", (event) => setCameraMode(event.detail));
  window.addEventListener("smartcare:reset-camera", () => {
    caregiver.position.copy(initialPositions[currentScenario]);
    yaw = 0;
    pitch = cameraMode === "third" ? 0.5 : 0;
    cameraDistance = 5.8;
  });
  window.addEventListener("smartcare:observe", observeNearest);
  window.addEventListener("smartcare:move", (event) => { if (keys[event.detail.direction] !== undefined) keys[event.detail.direction] = event.detail.active; });
  new ResizeObserver(resize).observe(container);
}

function init() {
  try {
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#d6e2d9");
    scene.fog = new THREE.Fog("#d6e2d9", 12, 25);
    camera = new THREE.PerspectiveCamera(48, 1, 0.05, 70);
    camera.position.set(0, 4, 8);
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);
    const hemisphere = new THREE.HemisphereLight("#f5f4e9", "#63776b", 2.0);
    scene.add(hemisphere);
    const sun = new THREE.DirectionalLight("#fff2d8", 3.1);
    sun.position.set(3.5, 7, 4.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1536, 1536);
    sun.shadow.camera.left = -7;
    sun.shadow.camera.right = 7;
    sun.shadow.camera.top = 7;
    sun.shadow.camera.bottom = -7;
    sun.shadow.bias = -0.0003;
    scene.add(sun);
    const fill = new THREE.DirectionalLight("#b9dcd5", 1.1);
    fill.position.set(-5, 3, 1);
    scene.add(fill);
    buildRoom();
    caregiver = createPerson({ uniform: "#257c70", elderly: false });
    caregiver.position.copy(initialPositions.fall);
    scene.add(caregiver);
    rebuildScenario(currentScenario);
    setCameraMode(cameraMode);
    bindSceneEvents();
    resize();
    updateCamera(1);
    renderer.render(scene, camera);
    window.dispatchEvent(new CustomEvent("smartcare:scene-ready", { detail: { ready: true } }));
    animate();
  } catch (error) {
    console.error("SmartCare 3D initialization failed:", error);
    window.dispatchEvent(new CustomEvent("smartcare:scene-ready", { detail: { ready: false } }));
  }
}

init();
