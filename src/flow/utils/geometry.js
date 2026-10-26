/**
 * Calcola le posizioni dei nodi figli disposti a cerchio attorno al centro del padre
 * @param {number} parentX - Coordinata X dell'angolo in alto a sinistra del padre
 * @param {number} parentY - Coordinata Y dell'angolo in alto a sinistra del padre
 * @param {number} totalChildren - Numero totale di figli da disporre
 * @param {number} radius - Raggio del cerchio in pixel (aumentato a 250 per dare respiro)
 * @returns {Array<{x: number, y: number}>} Array di coordinate centrate
 */
export const calculateCircularPositions = (parentX, parentY, totalChildren, radius = 180) => {
  const positions = [];
  if (totalChildren === 0) return positions;

  // Dimensioni medie dei nodi per correggere il punto di ancoraggio di React Flow
  const parentWidth = 160;
  const parentHeight = 44;
  const childWidth = 140;
  const childHeight = 40;

  // Troviamo il vero centro geometrico del nodo padre
  const parentCenterX = parentX + parentWidth / 2;
  const parentCenterY = parentY + parentHeight / 2;

  // Ruotiamo l'asse iniziale a ore 12 (-90 gradi in radianti) per evitare collisioni orizzontali
  const startAngle = -Math.PI / 2; 

  for (let i = 0; i < totalChildren; i++) {
    // Dividiamo il cerchio in parti uguali partendo dall'angolo sfasato
    const angle = startAngle + (i * 2 * Math.PI) / totalChildren;
    
    // Calcoliamo la proiezione della circonferenza dal centro
    const childCenterX = parentCenterX + radius * Math.cos(angle);
    const childCenterY = parentCenterY + radius * Math.sin(angle);

    positions.push({
      // Sottraiamo metà dimensione del figlio per centrare il suo box sul punto della circonferenza
      x: Math.round(childCenterX - childWidth / 2),
      y: Math.round(childCenterY - childHeight / 2)
    });
  }
  
  return positions;
};
