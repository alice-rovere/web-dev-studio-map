import { getViewportForBounds } from "@xyflow/react";

export function getFocusViewport(nodes, mapRect, panelRect, maxZoom) {
  const left = Math.min(...nodes.map((node) => node.position.x));
  const top = Math.min(...nodes.map((node) => node.position.y));
  const right = Math.max(
    ...nodes.map((node) => node.position.x + node.measured.width),
  );
  const bottom = Math.max(
    ...nodes.map((node) => node.position.y + node.measured.height),
  );
  const visibleWidth = Math.max(
    1,
    Math.min(mapRect.width, panelRect.left - mapRect.left),
  );

  return getViewportForBounds(
    { x: left, y: top, width: right - left, height: bottom - top },
    visibleWidth,
    mapRect.height,
    0.2,
    maxZoom,
    0.1,
  );
}
