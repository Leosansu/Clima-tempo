import React from 'react';

export type WeatherTitleProps = {
  temperature?: number;
  description?: string;
  classes: {
    container: string;
    temp: string;
    title: string;
  };
};

const WeatherTitle: React.FC<WeatherTitleProps> = ({ temperature, description, classes }) => {
  const hasWeather = typeof temperature === 'number' && !!description;
  return (
    <div className={classes.container}>
      {hasWeather ? (
        <>
          <span className={classes.temp}>{Math.round(temperature!)}°C</span>
          <h1 className={classes.title}>{description}</h1>
        </>
      ) : (
        <h1 className={classes.title}>Condições climáticas</h1>
      )}
    </div>
  );
};

export default WeatherTitle;
