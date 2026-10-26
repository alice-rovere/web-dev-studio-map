export const MACRO_GROUPS = [
  {
    id: "group-frontend",
    type: "macroGroup",
    data: {
      label: "Frontend",
      borderColor: "border-blue-300",
      bgColor: "bg-blue-50/30",
      textColor: "text-blue-500",
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
      borderColor: "border-emerald-300",
      bgColor: "bg-emerald-50/30",
      textColor: "text-emerald-500",
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
      borderColor: "border-purple-300",
      bgColor: "bg-purple-50/30",
      textColor: "text-purple-500",
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
