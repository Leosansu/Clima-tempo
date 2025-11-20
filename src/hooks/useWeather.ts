import { useState } from 'react'

export interface WeatherData {
  temperature: number
  tempMin: number
  tempMax: number
  description: string
  rain: number | null
  humidity: number
  weatherId?: number
  windSpeed?: number
  windDeg?: number
}

export default function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [horaCidade, setHoraCidade] = useState('')
  const [dataCidade, setDataCidade] = useState('')

  const buscarClima = async (cidade: string) => {
    setWeather(null)
    setErro('')
    setLoading(true)

    try {
      const apiKey = '4e06cde920bf91494f360abb00e81d97'

      // 1) Geocoding
      const geoResp = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cidade)}&limit=1&appid=${apiKey}`
      )
      const geoData = await geoResp.json()
      if (!Array.isArray(geoData) || geoData.length === 0) {
        setErro('Cidade não encontrada (geocoding).')
        setLoading(false)
        return
      }
      const { lat, lon, name: resolvedName, country: resolvedCountry } = geoData[0]

      // 2) Weather
      const weatherResp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`
      )
      const weatherData = await weatherResp.json()
      if (weatherData.cod !== 200) {
        setErro('Cidade não encontrada (weather).')
        setLoading(false)
        return
      }

      setWeather({
        temperature: weatherData.main.temp,
        tempMin: weatherData.main.temp_min,
        tempMax: weatherData.main.temp_max,
        description: weatherData.weather[0].description,
        rain: weatherData.rain ? weatherData.rain['1h'] : null,
        humidity: weatherData.main.humidity,
        weatherId: weatherData.weather[0].id,
        windSpeed: weatherData.wind?.speed ?? 0,
        windDeg: weatherData.wind?.deg ?? 0,
      })

      // 3) Hora e data local
      if (typeof weatherData.dt === 'number' && typeof weatherData.timezone === 'number') {
        const utcMs = weatherData.dt * 1000
        const offsetMs = weatherData.timezone * 1000
        const cityLocalMs = utcMs + offsetMs
        const cityDate = new Date(cityLocalMs)
        const hh = String(cityDate.getUTCHours()).padStart(2, '0')
        const mm = String(cityDate.getUTCMinutes()).padStart(2, '0')
        setHoraCidade(`${hh}:${mm}`)
        const df = new Intl.DateTimeFormat('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
        setDataCidade(df.format(cityDate))
      } else {
        setHoraCidade('')
        setDataCidade('')
      }
    } catch (err) {
      console.error(err)
      setErro('Erro ao buscar clima.')
    } finally {
      setLoading(false)
    }
  }

  return { weather, loading, erro, horaCidade, dataCidade, buscarClima }
}
