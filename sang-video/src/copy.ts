// 脚本与节奏定义：单场景时长（帧），帧率 30
export const FPS = 30;
export const DIP = 20; // 每场开头/结尾的黑场渐入渐出帧数
export const BEAT_GAP = 16; // 主句与副句之间的出场间隔

export type Beat = { main: string; sub?: string };

export type Scene = {
  id: string;
  img: string;
  chapter?: string;
  ghost: string; // 背景竖排虚字
  beats: Beat[];
  rain?: boolean;
  fog?: boolean;
  dur: number; // 该场总帧数
};

// 单场时长（帧）。总时长 = 求和 = 2120 帧 ≈ 70.7s
export const SCENES: Scene[] = [
  {
    id: "title",
    img: "/img/s1-title.jpg",
    ghost: "丧",
    beats: [
      { main: "当代年轻人", sub: "为什么都这么丧" },
    ],
    rain: true,
    dur: 270,
  },
  {
    id: "childhood",
    img: "/img/s2-classroom.jpg",
    chapter: "壹 · 从前",
    ghost: "答",
    beats: [{ main: "小时候，我们以为", sub: "努力，就会有答案" }],
    dur: 230,
  },
  {
    id: "running",
    img: "/img/s3-subway.jpg",
    chapter: "贰 · 奔跑",
    ghost: "跑",
    beats: [
      { main: "长大后才发现", sub: "世界是一个巨大的跑道" },
      { main: "我们拼命地跑", sub: "却只是留在原地" },
    ],
    rain: true,
    dur: 240,
  },
  {
    id: "era",
    img: "/img/s4-office.jpg",
    chapter: "叁 · 时代",
    ghost: "夜",
    beats: [
      { main: "有人告诉我们", sub: "这是最好的时代" },
      { main: "可我们看见的", sub: "是涨不动的工资，和买不起的远方" },
    ],
    dur: 240,
  },
  {
    id: "lying",
    img: "/img/s5-room.jpg",
    chapter: "肆 · 躺平",
    ghost: "躺",
    beats: [
      { main: "于是我们学会了躺平", sub: "学会了说——算了" },
      { main: "不是不想努力", sub: "是怕努力之后，依然没有回声" },
    ],
    rain: true,
    dur: 240,
  },
  {
    id: "selfmock",
    img: "/img/s6-rooftop.jpg",
    chapter: "伍 · 自嘲",
    ghost: "笑",
    beats: [
      { main: "我们笑着说，我太难了", sub: "笑着笑着，眼眶就红了" },
      { main: "我们不是放弃了", sub: "只是把期待，轻轻放回了口袋" },
    ],
    dur: 230,
  },
  {
    id: "understand",
    img: "/img/s7-street.jpg",
    chapter: "陆 · 明白",
    ghost: "悟",
    beats: [
      { main: "后来才明白", sub: "丧，不是一种失败" },
      { main: "它是我们对生活", sub: "最后的温柔" },
    ],
    rain: true,
    dur: 215,
  },
  {
    id: "allow",
    img: "/img/s8-dawn.jpg",
    chapter: "柒 · 允许",
    ghost: "许",
    beats: [
      { main: "允许自己慢一点", sub: "允许期待落空" },
      { main: "也允许自己", sub: "只是普通地活着" },
    ],
    fog: true,
    dur: 215,
  },
  {
    id: "together",
    img: "/img/s9-sky.jpg",
    chapter: "捌 · 相处",
    ghost: "存",
    beats: [
      { main: "不必急着好起来", sub: "丧一点，也没关系" },
      { main: "我们只是换了一种方式", sub: "继续爱着这人间" },
    ],
    dur: 240,
  },
];

export const TOTAL_FRAMES = SCENES.reduce((a, s) => a + s.dur, 0);
export const TITLE_TEXT = "当代年轻人\n为什么都这么丧";
export const TITLE_SUB = "没有人教过我们，怎么不动声色地长大";
export const ENDING_LINE = "致我们 —— 温柔地与世界相处";
