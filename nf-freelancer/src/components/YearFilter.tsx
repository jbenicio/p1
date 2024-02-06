import React, { useState, useEffect } from 'react';

const FiltroAno = ({ onFiltrar }: any) => {
  const anoAtual = new Date().getFullYear();
  const anosDisponiveis = Array.from(
    { length: 11 },
    (_, index) => anoAtual - index
  );

  const [anoSelecionado, setAnoSelecionado] = useState(anoAtual);

  useEffect(() => {
    onFiltrar(anoSelecionado);
  }, [anoSelecionado, onFiltrar]);

  return (
    <div>
      <select
        id='ano'
        value={anoSelecionado}
        onChange={(e) => setAnoSelecionado(Number(e.target.value))}
      >
        {anosDisponiveis.map((ano) => (
          <option key={ano} value={ano}>
            {ano}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FiltroAno;
