import { Flex, Heading } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import * as z from "zod";

type Todo = {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
};

const pageLimit = 10;

export const Route = createFileRoute("/")({
  component: Index,
  validateSearch: z.object({
    _page: z.number().int().nonnegative().default(1),
    _limit: z.number().int().nonnegative().default(pageLimit),
  }),
  loaderDeps: ({ search: { _page, _limit } }) => ({ _page, _limit }),
  loader: async ({ deps: { _page, _limit } }) => {
    const data = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_page=${_page}&_limit=${_limit}`
    );
    const totalCount = Number(data.headers.get("x-total-count"));
    const result = await data.json();
    return { totalCount, data: result };
  },
});

function Index() {
  return (
    <Flex alignItems={"center"} justifyContent={"center"} flexGrow={1}>
      <Heading>This is the index route </Heading>
    </Flex>
  );
}
