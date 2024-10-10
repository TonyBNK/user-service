import { Paginator } from '../types';

export const mapPaginatorToViewModel =
  <I, O>(mapper: (item: I) => O) =>
  ({
    totalCount,
    pagesCount,
    page,
    pageSize,
    items,
  }: Paginator<I>): Paginator<O> => ({
    totalCount,
    pagesCount,
    page,
    pageSize,
    items: items.map(mapper),
  });
