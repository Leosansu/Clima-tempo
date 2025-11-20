import React from 'react'
import style from '../App.module.css'

interface WeatherData {
  temperature: number
  tempMin: number
  tempMax: number
  description: string
  rain: number | null
  humidity: number
}

interface WeatherInfoProps {
  weather: WeatherData
}

export default function WeatherInfo({ weather }: WeatherInfoProps) {
  return (
    <div className={style.infoClima}>
      <p>Mínima: <strong>{weather.tempMin}°C</strong></p>
      <p>Máxima: <strong>{weather.tempMax}°C</strong></p>
      <p>Condição: <strong>{weather.description}</strong></p>
      <p>Umidade: <strong>{weather.humidity}%</strong></p>
      {weather.rain !== null && (
        <p>Chuva (última hora): <strong>{weather.rain} mm</strong></p>
      )}
    </div>
  )
}
