import style from './Header.module.css'

interface HeaderProps {
  modoNoite: boolean
  alternarModoNoite: () => void
  cidade?: string
  pais?: string
  hora?: string
  data?: string
}

export default function Header({ modoNoite, alternarModoNoite, cidade, pais, hora, data }: HeaderProps) {
  return (
    <div className={style.headerContainer}>
      <header className={style.header}>
        <div className={style.infoCidade}>
          <div className={style.cidadeBloco}>
            {cidade && (
              <span className={style.cidade}>
                {cidade}
                {pais ? `, ${pais}` : ''}
              </span>
            )}
            {data && <span className={style.data}> — {data}</span>}
          </div>
          {hora && <span className={style.hora}> — {hora}</span>}
        </div>

        <button
          className={`${style.botaoNoturno} ${modoNoite ? style.ativo : ''}`}
          onClick={alternarModoNoite}
          aria-pressed={modoNoite}
        >
          <span className="sr-only">{modoNoite ? 'Noite' : 'Dia'}</span>
        </button>
      </header>
    </div>
  )
}