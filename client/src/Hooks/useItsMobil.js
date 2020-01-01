import { useState, useEffect } from 'react';

export default function useItsMobil() {
  const [itsMobil, setItsMobil] = useState(null);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 576px)');

    mql.addListener(checkIfItsMobil);

    function checkIfItsMobil() {
      if (mql.matches) {
        setItsMobil(false);
      } else {
        setItsMobil(true);
      }
    }

    checkIfItsMobil();

    return () => mql.removeListener(checkIfItsMobil);
  }, []);

  return itsMobil;
}
