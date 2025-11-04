import { useEffect, useState } from 'react'; // adicione useEffect na importação
import style from './App.module.css';
import Header from './components/Header.tsx';
import SearchBar from './components/SearchBar';
import WeatherTitle from './components/WeatherTitle';
import WindIndicator from './components/WindIndicator';

interface WeatherData {
  temperature: number
  tempMin: number
  tempMax: number
  description: string
  rain: number | null
  humidity: number
  weatherId?: number
  windSpeed?: number        // velocidade do vento (m/s) - opcional
  windDeg?: number          // direção do vento (graus) - opcional
}

function App() {
  const [modoNoite, setModoNoite] = useState(false)
  const [busca, setBusca] = useState('')
  const [cidade, setCidade] = useState('')
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [horaCidade, setHoraCidade] = useState('') // novo estado para hora da cidade
  const [dataCidade, setDataCidade] = useState('') // novo estado para data local da cidade

  const alternarModoNoite = () => {
    setModoNoite(!modoNoite)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusca(cidade)
    setWeather(null)
    setErro('')
    setLoading(true)

    try {
      const apiKey = '4e06cde920bf91494f360abb00e81d97'

      // 1) Geocoding para obter lat/lon não ambíguos
      const geoResp = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cidade)}&limit=1&appid=${apiKey}`
      )
      const geoData = await geoResp.json()
      console.log('geoData', geoData)
      if (!Array.isArray(geoData) || geoData.length === 0) {
        setErro('Cidade não encontrada (geocoding).')
        setLoading(false)
        return
      }
      const { lat, lon, name: resolvedName, country: resolvedCountry } = geoData[0]

      // 2) Buscar clima por lat/lon (remove ambiguidade)
      const weatherResp = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=pt_br`
      )
      const weatherData = await weatherResp.json()
      console.log('weatherData', weatherData)

      if (weatherData.cod !== 200) {
        setErro('Cidade não encontrada (weather).')
        setLoading(false)
        return
      }

      // salvar nome resolvido no header (ex: "Roma, IT")
      setBusca(`${resolvedName}, ${resolvedCountry}`)

      setWeather({
        temperature: weatherData.main.temp,
        tempMin: weatherData.main.temp_min,
        tempMax: weatherData.main.temp_max,
        description: weatherData.weather[0].description,
        rain: weatherData.rain ? weatherData.rain['1h'] : null,
        humidity: weatherData.main.humidity
        , weatherId: weatherData.weather[0].id
        , windSpeed: weatherData.wind?.speed ?? 0    // salva velocidade do vento (m/s)
        , windDeg: weatherData.wind?.deg ?? 0        // salva direção do vento (graus)
      })

      // calcular hora local usando dt + timezone (como já faz)
      if (typeof weatherData.dt === 'number' && typeof weatherData.timezone === 'number') {
        const utcMs = weatherData.dt * 1000
        const offsetMs = weatherData.timezone * 1000
        const cityLocalMs = utcMs + offsetMs
        const cityDate = new Date(cityLocalMs)
        const hh = String(cityDate.getUTCHours()).padStart(2, '0')
        const mm = String(cityDate.getUTCMinutes()).padStart(2, '0')
        setHoraCidade(`${hh}:${mm}`)
        // formata data com dia da semana em pt-BR, ex: "quarta-feira, 22/10/2025"
        const df = new Intl.DateTimeFormat('pt-BR', {
          weekday: 'long',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
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

  // helper: converte weather id em classe de fundo (accept id ou descrição)
  const getWeatherBgClass = (id?: number, desc?: string) => {
    if (typeof id === 'number') {
      if (id === 800) return 'bg_sunny'
      if (id === 500) return 'bg_chuvaLeve'        // chuva leve -> chuvaLeve.jpg
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
    if (d.includes('chuva leve') || d.includes('light rain')) return 'bg_chuvaLeve' // fallback textual
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

  console.log('DBG: weatherId, desc =>', weather?.weatherId, weather?.description)
  console.log('DBG: getWeatherBgClass =>', resolvedClassName)
  console.log('DBG: resolved style class =>', bgCssClass)

  const bgInline = (!modoNoite && weather && resolvedClassName && !style[resolvedClassName as string])
    ? { backgroundImage: `url('/images/${resolvedClassName.replace('bg_', '')}.jpg')`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined

  // Para pegar a hora atual:
  

  useEffect(() => {
    // atualiza title quando houver dados de clima; fallback para título base
    if (weather) {
      const temp = Math.round(weather.temperature)
      const desc = weather.description ?? ''
      const place = busca || '' // nome da cidade resolvida exibida no header
      document.title = `${temp}°C — ${desc}${place ? ` | ${place}` : ''} | Projeto Clima`
    } else {
      document.title = 'Condições climáticas — Projeto Clima'
    }
  }, [weather, busca]) // roda quando weather ou busca mudarem

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
        data={dataCidade ? dataCidade : undefined}   // passa a data formatada para o Header
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
        {weather && (
          <div className={style.infoClima}>
            <p>Mínima: <strong>{weather.tempMin}°C</strong></p>
            <p>Máxima: <strong>{weather.tempMax}°C</strong></p>
            <p>Condição: <strong>{weather.description}</strong></p>
            <p>Umidade: <strong>{weather.humidity}%</strong></p>
            {weather.rain !== null && <p>Chuva (última hora): <strong>{weather.rain} mm</strong></p>}
          </div>
        )}

        {/* Indicador de vento: bússola + velocidade (aparece quando houver weather) */}
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