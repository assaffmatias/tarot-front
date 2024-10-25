import React, { useMemo } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import CardComponent from "./CardComponent";
import { useFetch } from "../hooks";
import { useFilterStore } from "../stores";

const InfinityScroll = () => {
  const url = `/services/list_all`;
  const filters = useFilterStore((state) => state.home); // Ahora obtenemos los filtros directamente
  const setFilters = useFilterStore((state) => state.setHomeFilter);

  const dependencies = useMemo(
    () => [filters.tags, filters.search],
    [filters],
    [filters.tags, filters.search]
  );

  const {
    data = [],
    reload,
    getMore,
    loading,
    noMore,
  } = useFetch({
    url,
    fetch: true,
    withFilters: true,
    dependencies,
    setFilters,
    filters,
  });

  return (
    <>
      <FlatList
        onRefresh={reload}
        refreshing={loading}
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => <CardComponent data={item} />}
        keyExtractor={(item) => item._id}
        onEndReached={getMore}
        onEndReachedThreshold={0.5} // Ajusta el umbral de disparo
        contentContainerStyle={{ gap: 15, paddingVertical: 5 }}
        ListFooterComponent={() =>
          loading && !noMore ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null
        }
      />
    </>
  );
};

export default InfinityScroll;
