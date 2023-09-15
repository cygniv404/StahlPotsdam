import React, { useEffect, useRef } from 'react';

export default function ({
  bendTypeData, chosenEdge, dimX, dimY, showLabel, scale, defaultColor = '#000', lineWidth = 1, ...rest
}) {
  const canvasRef = useRef(null);

  const getColorForId = (i) => {
    if (i === chosenEdge) {
      return '#FF0000';
    }
    return defaultColor;
  };
  const draw = (ctx) => {
    if (ctx) {
      ctx.clearRect(0, 0, dimX, dimY);
      ctx.lineWidth = lineWidth;
    }
    // eslint-disable-next-line no-plusplus
    for (let i = 1; i <= 10; i++) {
      ctx.beginPath();
      ctx.strokeStyle = getColorForId(i);

      if (showLabel && (bendTypeData[`e${i}`] > 0 || bendTypeData[`f${i}`] > 0)) {
        ctx.fillStyle = getColorForId(i);
        ctx.fillText(
          String.fromCharCode(96 + i),
          (bendTypeData[`e${i}`] - 15) * scale,
          dimY - (bendTypeData[`f${i}`] - 30) * scale,
        );
      }

      if (bendTypeData[`o${i}`] <= 5) {
        ctx.moveTo(bendTypeData[`a${i}`] * scale, dimY - bendTypeData[`b${i}`] * scale);
        ctx.lineTo(bendTypeData[`c${i}`] * scale, dimY - bendTypeData[`d${i}`] * scale);
        ctx.stroke();
      } else {
        ctx.arc(
          bendTypeData[`a${i}`] * scale,
          dimY - bendTypeData[`b${i}`] * scale, // Y
          bendTypeData[`o${i}`] * scale, // r
          bendTypeData[`c${i}`] * (Math.PI / 180),
          bendTypeData[`d${i}`] * (Math.PI / 180),
          false,
        );
        ctx.stroke();
      }
    }
  };
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    draw(context);
  }, [draw]);

  return <canvas ref={canvasRef} {...rest} />;
}
