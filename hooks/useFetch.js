import { useCallback, useEffect, useState } from "react";
import { api } from "../axios";
import { useAuthStore } from "../stores";

const useFetch = ({
  url = "",
  fetch = true,
  dependencies = [],
  withFilters = false,
  filters = {}, // Filtros iniciales
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [localPage, setLocalPage] = useState(0); // Estado de página para getMore
  const [currentFilters, setCurrentFilters] = useState(filters); // Estado de filtros

  const auth = useAuthStore((state) => state.auth);

  // Solo actualizamos los filtros si realmente cambiaron
  useEffect(() => {
    setCurrentFilters((prevFilters) => {
      if (JSON.stringify(prevFilters) !== JSON.stringify(filters)) {
        setLocalPage(0); // Resetear página al cambiar filtros
        return { ...filters, page: 1 }; // Reiniciar página a 1 si withFilters es true
      }
      return prevFilters;
    });
  }, [filters]);

  const getData = useCallback(async () => {
    if (!auth) return;
    try {
      setLoading(true);
      setNoMore(false);
      setLocalPage(1);

      const values = [url];
      if (withFilters) {
        values.push({ ...currentFilters, page: 1 }); // Forzar la página 1 si withFilters es true
      } else {
        values.push(currentFilters);
      }

      const res = await api.GET(...values);
      if (res) setData(res);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [url, currentFilters, withFilters, auth, ...dependencies]);

  const getMore = useCallback(async () => {
    if (!auth) return;
    try {
      if (loading || noMore) return;
      setLoading(true);

      const nextPage = localPage + 1;
      const res = await api.GET(url, { ...currentFilters, page: nextPage }); // Usar la página local para cargar más

      if (!res || res.length === 0) {
        setNoMore(true);
        setLoading(false);
        return;
      }

      setLocalPage(nextPage); // Actualizar la página local
      setData((prev) => [...prev, ...res]);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  }, [url, currentFilters, loading, noMore, localPage, ...dependencies]);

  useEffect(() => {
    if (fetch) getData();
    if (!fetch) setData([]);
  }, [fetch, url, currentFilters, ...dependencies]);

  return { data, reload: getData, setData, loading, getMore, noMore };
};

export default useFetch;
