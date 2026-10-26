/**
 * Calcola le posizioni dei nodi figli disposti a cerchio attorno al centro del padre
 * @param {number} parentX - Coordinata X dell'angolo in alto a sinistra del padre
 * @param {number} parentY - Coordinata Y dell'angolo in alto a sinistra del padre
 * @param {number} totalChildren - Numero totale di figli da disporre
 * @param {number} radius - Raggio del cerchio ridotto a 150px per tenerli vicini
 * @returns {Array<{x: number, y: number}>} Array di coordinate centrate
 */
export const calculateCircularPositions = (parentX, parentY, totalChildren, radius = 150) => {
  const positions = [];
  if (totalChildren === 0) return positions;

  const parentWidth = 160;
  const parentHeight = 44;
  const childWidth = 140;
  const childHeight = 40;

  const parentCenterX = parentX + parentWidth / 2;
  const parentCenterY = parentY + parentHeight / 2;
  const startAngle = -Math.PI / 2; // Parte a ore 12

  for (let i = 0; i < totalChildren; i++) {
    const angle = startAngle + (i * 2 * Math.PI) / totalChildren;
    
    const childCenterX = parentCenterX + radius * Math.cos(angle);
    const childCenterY = parentCenterY + radius * Math.sin(angle);

    positions.push({
      x: Math.round(childCenterX - childWidth / 2),
      y: Math.round(childCenterY - childHeight / 2)
    });
  }
  
  return positions;
};
