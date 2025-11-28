export interface FetchPaginated<T> {
  totalDeItens: number;
  totalDePaginas: number;
  paginaCorrente: number;
  itens: T[];
}
