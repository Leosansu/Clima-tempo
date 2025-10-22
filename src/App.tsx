import { useState } from 'react'
import Header from './components/Header.tsx'
import style from './App.module.css'

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

  // helper: converte weather id em classe de fundo (string correspondente ao CSS)
  const getWeatherBgClass = (id?: number) => {
    if (!id) return undefined
    if (id === 800) return 'bg_sunny'
    if (id >= 200 && id < 300) return 'bg_thunder'
    if (id >= 300 && id < 400) return 'bg_drizzle'
    if (id >= 500 && id < 600) return 'bg_rain'
    if (id >= 600 && id < 700) return 'bg_snow'
    if (id >= 700 && id < 800) return 'bg_fog'
    // 801-804 nuvens
    return 'bg_clouds'
  }

  // aplicar imagem de fundo apenas no modo dia
  const bgCssClass = (!modoNoite && weather?.weatherId) ? style[getWeatherBgClass(weather.weatherId) as string] : ''

  // Para pegar a hora atual:
  const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`${modoNoite ? style.modoNoite : style.modoDia} ${bgCssClass}`}>
      <Header
        modoNoite={modoNoite}
        alternarModoNoite={alternarModoNoite}
        cidade={busca ? busca : undefined}
        hora={horaCidade ? horaCidade : undefined}
        data={dataCidade ? dataCidade : undefined}   // passa a data formatada para o Header
      />

      {/* Agrupa temperatura + título */}
      <div className={style.tituloContainer}>
        {weather ? (                                      // se há dados do clima, mostra temperatura + descrição
          <>
            <span className={style.temperaturaLocal}>{Math.round(weather.temperature)}°C</span>
            <h1 className={style.titulo}>{weather.description}</h1>
          </>
        ) : (                                            // caso contrário, texto padrão ao entrar no app
          <h1 className={style.titulo}>Condições climáticas</h1>
        )}
      </div>

      <form onSubmit={handleSubmit} className={style.formBusca}>
        <input
          type="text"
          value={cidade}
          onChange={e => setCidade(e.target.value)}
          placeholder="Digite o nome da cidade"
          className={style.inputBusca}
        />
        <button type="submit" className={style.botaoBusca}>Buscar</button>
      </form>
      {loading && <p>Carregando...</p>}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
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
        <div className={style.ventoContainer} aria-hidden={false}>
          <div className={style.compass} title={`Direção do vento: ${weather.windDeg}°`}>
            <div className={style.compassRing} />                    {/* anel externo */}
            <div className={style.compassLabels}>                   {/* N E S W */}
              <span className={style.north}>N</span>
              <span className={style.east}>E</span>
              <span className={style.south}>S</span>
              <span className={style.west}>W</span>
            </div>
            <div
              className={style.needle}
              style={{ transform: `rotate(${weather.windDeg ?? 0}deg)` }} // gira agulha conforme windDeg
            />
            <div className={style.centerDot} />                       {/* ponto central */}
          </div>
          <div className={style.ventoInfo}>
            <div className={style.ventoVelocidade}>
              {(weather.windSpeed ?? 0).toFixed(1)} m/s
            </div>
            <div className={style.ventoVelocidadeSmall}>
              ({Math.round((weather.windSpeed ?? 0) * 3.6)} km/h)
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App