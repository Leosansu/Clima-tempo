import React from 'react';

export type SearchBarProps = {
  cidade: string;
  onCidadeChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  erro?: string;
  className?: string;           // classe do form (container)
  inputClassName?: string;      // classe do input (ex: style.inputBusca)
  buttonClassName?: string;     // classe do botão (ex: style.botaoBusca)
};

const SearchBar: React.FC<SearchBarProps> = ({
  cidade,
  onCidadeChange,
  onSubmit,
  loading = false,
  erro,
  className,
  inputClassName,
  buttonClassName,
}) => (
  <form onSubmit={onSubmit} className={className} aria-busy={loading}>
    <div>
      <input
        type="text"
        value={cidade}
        onChange={(e) => onCidadeChange(e.target.value)}
        placeholder="Digite o nome da cidade"
        aria-label="Cidade"
        aria-invalid={!!erro}
        aria-describedby={erro ? 'searchbar-error' : undefined}
        disabled={loading}
        className={inputClassName}
      />
      <button type="submit" className={buttonClassName} disabled={loading || !cidade.trim()}>
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
    </div>

    {erro && (
      <div id="searchbar-error" role="alert" style={{ color: 'red', marginTop: 8 }}>
        {erro}
      </div>
    )}
  </form>
);

export default SearchBar;
