import { useEffect, useState } from 'react'
import style from './App.module.css'
import Header from './components/Header.tsx'
import SearchBar from './components/SearchBar'
import WeatherTitle from './components/WeatherTitle'
import WindIndicator from './components/WindIndicator'
import WeatherInfo from './components/WeatherInfo'
import useWeather from './hooks/useWeather'

function App() {
  const [modoNoite, setModoNoite] = useState(false)
  const [busca, setBusca] = useState('')
  const [cidade, setCidade] = useState('')

  // estados e lógica de clima agora vêm do hook
  const { weather, loading, erro, horaCidade, dataCidade, buscarClima } = useWeather()

  const alternarModoNoite = () => setModoNoite(!modoNoite)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setBusca(cidade)
    buscarClima(cidade)
  }

  // helper: converte weather id em classe de fundo
  const getWeatherBgClass = (id?: number, desc?: string) => {
    if (typeof id === 'number') {
      if (id === 800) return 'bg_sunny'
      if (id === 500) return 'bg_chuvaLeve'
      if (id >= 200 && id < 300) return 'bg_thunder'
      if (id >= 300 && id < 400) return 'bg_drizzle'
      if (id >= 500 && id < 600) return 'bg_rain'
      if (id >= 600 && id < 700) return 'bg_snow'
      if (id >= 700 && id < 800) return 'bg_fog'
      if (id === 801 || id === 802) return 'bg_clouds'
      if (id === 803 || id === 804) return 'bg_drizzle'
      return 'bg_clouds'
    }

    const d = (desc ?? '').toLowerCase()
    if (d.includes('chuva leve') || d.includes('light rain')) return 'bg_chuvaLeve'
    if (d.includes('nuvens dispersas') || d.includes('algumas nuvens') || d.includes('few clouds') || d.includes('scattered')) return 'bg_clouds'
    if (d.includes('nublado') || d.includes('broken clouds') || d.includes('overcast')) return 'bg_drizzle'
    if (d.includes('névoa') || d.includes('neblina') || d.includes('bruma') || d.includes('fog') || d.includes('mist')) return 'bg_fog'
    if (d.includes('chuva') || d.includes('chuvoso') || d.includes('rain')) return 'bg_rain'
    if (d.includes('trovoada') || d.includes('tempestade') || d.includes('thunder')) return 'bg_thunder'
    if (d.includes('ensolarado') || d.includes('céu limpo') || d.includes('clear')) return 'bg_sunny'
    if (d.includes('neve') || d.includes('snow')) return 'bg_snow'
    if (d.includes('chuvisco') || d.includes('drizzle')) return 'bg_drizzle'
    return undefined
  }

  const resolvedClassName = getWeatherBgClass(weather?.weatherId, weather?.description)
  const bgCssClass = (!modoNoite && weather && resolvedClassName)
    ? style[resolvedClassName as string]
    : ''

  const bgInline = (!modoNoite && weather && resolvedClassName && !style[resolvedClassName as string])
    ? { backgroundImage: `url('/images/${resolvedClassName.replace('bg_', '')}.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined

  useEffect(() => {
    if (weather) {
      const temp = Math.round(weather.temperature)
      const desc = weather.description ?? ''
      const place = busca || ''
      document.title = `${temp}°C — ${desc}${place ? ` | ${place}` : ''} | Projeto Clima`
    } else {
      document.title = 'Condições climáticas — Projeto Clima'
    }
  }, [weather, busca])

  return (
    <div
      className={`${modoNoite ? style.modoNoite : style.modoDia} ${bgCssClass}`}
      style={bgInline}
    >
      <Header
        modoNoite={modoNoite}
        alternarModoNoite={alternarModoNoite}
        cidade={busca ? busca : undefined}
        hora={horaCidade ? horaCidade : undefined}
        data={dataCidade ? dataCidade : undefined}
      />

      <div className={style.main}>
        <WeatherTitle
          temperature={weather?.temperature}
          description={weather?.description}
          classes={{
            container: style.tituloContainer,
            temp: style.temperaturaLocal,
            title: style.titulo,
          }}
        />

        <SearchBar
          cidade={cidade}
          onCidadeChange={setCidade}
          onSubmit={handleSubmit}
          loading={loading}
          erro={erro}
          className={style.formBusca}
          inputClassName={style.inputBusca}
          buttonClassName={style.botaoBusca}
        />

        {weather && <WeatherInfo weather={weather} />}

        {weather && (
          <WindIndicator
            deg={weather.windDeg ?? 0}
            speed={weather.windSpeed ?? 0}
            classes={{
              container: style.ventoContainer,
              compass: style.compass,
              compassRing: style.compassRing,
              compassLabels: style.compassLabels,
              north: style.north,
              east: style.east,
              south: style.south,
              west: style.west,
              needle: style.needle,
              centerDot: style.centerDot,
              info: style.ventoInfo,
              velocidade: style.ventoVelocidade,
              velocidadeSmall: style.ventoVelocidadeSmall,
            }}
          />
        )}
      </div>
    </div>
  )
}

export default App
