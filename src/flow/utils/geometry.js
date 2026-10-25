/**
 * Calcola le posizioni relative dei nodi figli disposti a cerchio attorno al padre
 * @param {number} parentX - Coordinata X del padre
 * @param {number} parentY - Coordinata Y del padre
 * @param {number} totalChildren - Numero totale di figli da disporre
 * @param {number} radius - Raggio del cerchio in pixel
 * @returns {Array<{x: number, y: number}>} Array di coordinate
 */
export const calculateCircularPositions = (parentX, parentY, totalChildren, radius = 120) => {
  const positions = [];
  
  for (let i = 0; i < totalChildren; i++) {
    // Dividiamo il cerchio (2 * Math.PI) in parti uguali
    const angle = (i * 2 * Math.PI) / totalChildren;
    
    positions.push({
      x: parentX + radius * Math.cos(angle),
      y: parentY + radius * Math.sin(angle)
    });
  }
  
  return positions;
};
