export const MACRO_GROUPS = [
  {
    id: "group-frontend",
    type: "macroGroup",
    data: {
      label: "Frontend",
      borderColor: "border-blue-500/20",
      bgColor: "bg-gradient-to-br from-blue-950/25 via-blue-950/5 to-transparent",
      textColor: "text-blue-400",
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
      borderColor: "border-emerald-500/20",
      bgColor: "bg-gradient-to-br from-emerald-950/25 via-emerald-950/5 to-transparent",
      textColor: "text-emerald-400",
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
      borderColor: "border-purple-500/20",
      bgColor: "bg-gradient-to-br from-purple-950/25 via-purple-950/5 to-transparent",
      textColor: "text-purple-400",
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
};

export const CATEGORY_COLORS = {
  frontend: "#7ab8ff",
  backend: "#64d9bd",
  database: "#c49aff",
};

export const CATEGORY_LABELS = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
};
