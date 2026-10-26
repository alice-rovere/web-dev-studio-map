import { calculateCircularPositions } from "./geometry";
import { CATEGORY_ANCHORS, CATEGORY_COLORS } from "../../data/baseNodes";

const asNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

function getPrimaryCategory(categories = []) {
  if (!categories.length) return "frontend";
  const primary = categories.find((entry) => entry.is_primary);
  return primary?.category ?? categories[0].category;
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] ?? "#94a3b8";
}

export function buildNodeGraph({
  nodes = [],
  parents = [],
  categories = [],
} = {}) {
  const categoriesByNode = new Map();

  for (const entry of categories) {
    const list = categoriesByNode.get(entry.node_id) ?? [];
    list.push({ category: entry.category, is_primary: Boolean(entry.is_primary) });
    categoriesByNode.set(entry.node_id, list);
  }

  for (const list of categoriesByNode.values()) {
    list.sort((a, b) => {
      if (a.is_primary === b.is_primary) {
        return a.category.localeCompare(b.category);
      }
      return a.is_primary ? -1 : 1;
    });
  }

  const nodesById = new Map();

  for (const node of nodes) {
    const nodeCategories = categoriesByNode.get(node.id) ?? [
      { category: "frontend", is_primary: true },
    ];

    nodesById.set(node.id, {
      ...node,
      position_x: asNumber(node.position_x),
      position_y: asNumber(node.position_y),
      categories: nodeCategories,
      primaryCategory: getPrimaryCategory(nodeCategories),
    });
  }

  const parentsByChild = new Map();
  const childrenByParent = new Map();

  for (const relation of parents) {
    if (!nodesById.has(relation.parent_id) || !nodesById.has(relation.child_id)) {
      continue;
    }

    const parentList = parentsByChild.get(relation.child_id) ?? [];
    parentList.push(relation);
    parentsByChild.set(relation.child_id, parentList);

    const childList = childrenByParent.get(relation.parent_id) ?? [];
    childList.push(relation);
    childrenByParent.set(relation.parent_id, childList);
  }

  const byPrimary = (a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
    return a.parent_id.localeCompare(b.parent_id);
  };

  for (const list of parentsByChild.values()) list.sort(byPrimary);
  for (const list of childrenByParent.values()) {
    list.sort((a, b) => {
      if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
      return a.child_id.localeCompare(b.child_id);
    });
  }

  const roots = [...nodesById.keys()].filter(
    (id) => !(parentsByChild.get(id)?.length > 0),
  );

  function getVisibleGraph(expandedIds) {
    const expanded =
      expandedIds instanceof Set ? expandedIds : new Set(expandedIds ?? []);
    const visibleIds = new Set(roots);
    const queue = [...roots];
    const edges = [];
    const visited = new Set();

    while (queue.length > 0) {
      const parentId = queue.shift();
      if (visited.has(parentId)) continue;
      visited.add(parentId);

      if (!expanded.has(parentId)) continue;

      for (const relation of childrenByParent.get(parentId) ?? []) {
        const childId = relation.child_id;

        if (!visibleIds.has(childId)) {
          visibleIds.add(childId);
          queue.push(childId);
        }

        if (visibleIds.has(childId)) {
          edges.push({
            id: `edge-${parentId}-${childId}`,
            source: parentId,
            target: childId,
          });
        }
      }
    }

    return { visibleIds, edges };
  }

  function getDescendants(nodeId) {
    const descendants = new Set();
    const stack = [nodeId];
    const visited = new Set();

    while (stack.length > 0) {
      const current = stack.pop();
      if (visited.has(current)) continue;
      visited.add(current);

      for (const relation of childrenByParent.get(current) ?? []) {
        if (!descendants.has(relation.child_id)) {
          descendants.add(relation.child_id);
          stack.push(relation.child_id);
        }
      }
    }

    descendants.delete(nodeId);
    return descendants;
  }

  function getDepth(nodeId) {
    let depth = 0;
    let current = nodeId;
    const seen = new Set();

    while (!seen.has(current)) {
      seen.add(current);
      const parent = parentsByChild.get(current)?.[0];
      if (!parent) break;
      current = parent.parent_id;
      depth += 1;
    }

    return depth;
  }

  function getParentIds(nodeId) {
    return (parentsByChild.get(nodeId) ?? []).map((entry) => entry.parent_id);
  }

  function getChildIds(nodeId) {
    return (childrenByParent.get(nodeId) ?? []).map((entry) => entry.child_id);
  }

  return {
    nodesById,
    categoriesByNode,
    parentsByChild,
    childrenByParent,
    roots,
    getVisibleGraph,
    getDescendants,
    getDepth,
    getParentIds,
    getChildIds,
  };
}

export function getNodePosition(node, parent, index = 0, total = 1, depth = 0) {
  if (parent) {
    const radius = 150 + Math.max(0, depth - 1) * 40;
    const positions = calculateCircularPositions(
      parent.x,
      parent.y,
      Math.max(total, 1),
      radius,
    );
    return positions[index] ?? { x: parent.x, y: parent.y + radius };
  }

  if (
    Number.isFinite(node?.position_x) &&
    Number.isFinite(node?.position_y)
  ) {
    return { x: node.position_x, y: node.position_y };
  }

  const anchor = CATEGORY_ANCHORS[node?.primaryCategory] ?? CATEGORY_ANCHORS.frontend;
  const column = index % 4;
  const row = Math.floor(index / 4);

  return {
    x: anchor.x + column * 175,
    y: anchor.y + row * 110,
  };
}
