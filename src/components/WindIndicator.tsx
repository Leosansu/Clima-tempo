import React from 'react';

export type WindIndicatorProps = {
  deg?: number;
  speed?: number;
  classes: {
    container: string;
    compass: string;
    compassRing: string;
    compassLabels: string;
    north: string;
    east: string;
    south: string;
    west: string;
    needle: string;
    centerDot: string;
    info: string;
    velocidade: string;
    velocidadeSmall: string;
  };
};

const WindIndicator: React.FC<WindIndicatorProps> = ({ deg = 0, speed = 0, classes }) => {
  return (
    <div className={classes.container} aria-hidden={false}>
      <div className={classes.compass} title={`Direção do vento: ${deg}°`}>
        <div className={classes.compassRing} />
        <div className={classes.compassLabels}>
          <span className={classes.north}>N</span>
          <span className={classes.east}>E</span>
          <span className={classes.south}>S</span>
          <span className={classes.west}>W</span>
        </div>
        <div className={classes.needle} style={{ transform: `rotate(${deg}deg)` }} />
        <div className={classes.centerDot} />
      </div>
      <div className={classes.info}>
        <div className={classes.velocidade}>{speed.toFixed(1)} m/s</div>
        <div className={classes.velocidadeSmall}>({Math.round(speed * 3.6)} km/h)</div>
      </div>
    </div>
  );
};

export default WindIndicator;
