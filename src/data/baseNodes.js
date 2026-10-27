export const MACRO_GROUPS = [
  // Grandi ovali esterni che comprendono il core stack
  {
    id: "group-devops",
    type: "macroGroup",
    data: {
      label: "DevOps",
      borderColor: "border-amber-500/20",
      bgColor: "bg-gradient-to-r from-amber-950/20 via-amber-950/5 to-transparent",
      textColor: "text-amber-400",
      align: "left",
    },
    position: { x: -420, y: -60 },
    style: { width: 1680, height: 1280 },
    focusable: false,
    draggable: false,
    selectable: false,
  },
  {
    id: "group-tools",
    type: "macroGroup",
    data: {
      label: "Tools",
      borderColor: "border-cyan-500/20",
      bgColor: "bg-gradient-to-l from-cyan-950/20 via-cyan-950/5 to-transparent",
      textColor: "text-cyan-400",
      align: "right",
    },
    position: { x: 30, y: -60 },
    style: { width: 1680, height: 1280 },
    focusable: false,
    draggable: false,
    selectable: false,
  },

  // 3 Cerchi centrali sovrapposti originari (Core Full-Stack)
  {
    id: "group-frontend",
    type: "macroGroup",
    data: {
      label: "Frontend",
      borderColor: "border-blue-500/25",
      bgColor: "bg-gradient-to-br from-blue-950/25 via-blue-950/5 to-transparent",
      textColor: "text-blue-400",
      align: "top",
    },
    position: { x: 50, y: 50 },
    style: { width: 700, height: 700 },
    focusable: false,
    draggable: false,
    selectable: false,
  },
  {
    id: "group-backend",
    type: "macroGroup",
    data: {
      label: "Backend",
      borderColor: "border-emerald-500/25",
      bgColor: "bg-gradient-to-br from-emerald-950/25 via-emerald-950/5 to-transparent",
      textColor: "text-emerald-400",
      align: "top",
    },
    position: { x: 540, y: 50 },
    style: { width: 700, height: 700 },
    focusable: false,
    draggable: false,
    selectable: false,
  },
  {
    id: "group-database",
    type: "macroGroup",
    data: {
      label: "Database",
      borderColor: "border-purple-500/25",
      bgColor: "bg-gradient-to-br from-purple-950/25 via-purple-950/5 to-transparent",
      textColor: "text-purple-400",
      align: "bottom",
    },
    position: { x: 295, y: 470 },
    style: { width: 700, height: 700 },
    focusable: false,
    draggable: false,
    selectable: false,
  },
];

export const CATEGORY_ANCHORS = {
  frontend: { x: 250, y: 280 },
  backend: { x: 760, y: 300 },
  database: { x: 540, y: 620 },
  devops: { x: -180, y: 450 },
  tools: { x: 1420, y: 450 },
};

export const CATEGORY_COLORS = {
  frontend: "#7ab8ff",
  backend: "#64d9bd",
  database: "#c49aff",
  devops: "#fb923c",
  tools: "#38bdf8",
};

export const CATEGORY_LABELS = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  tools: "Tools",
};
