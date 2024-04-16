import {
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
  Flex,
  Button,
  Input,
} from "@chakra-ui/react";
import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
} from "@tanstack/react-router";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { HTMLProps } from "react";
import * as z from "zod";

type Todo = {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
};

const pageLimit = 10;

export const Route = createFileRoute("/credentials")({
  component: CredentialsRoute,
  validateSearch: z.object({
    _page: z.number().int().nonnegative().catch(1),
    _limit: z.number().int().nonnegative().catch(pageLimit),
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

export default function CredentialsRoute() {
  const columns = React.useMemo<ColumnDef<Todo>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "completed",
        header: "Completed",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "userId",
        header: "User Id",
        cell: (info) => info.getValue(),
      },
    ],
    []
  );

  const [rowSelection, setRowSelection] = React.useState({});
  const { data, totalCount } = Route.useLoaderData();
  const { _page } = Route.useSearch();

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    getRowId: (row) => row.id,
    manualPagination: true,
  });
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log(table.getState().rowSelection);

    // if only one item is selected naviagre to edit form
    if (Object.keys(table.getState().rowSelection).length === 1) {
      console.log();
      navigate({
        to: "/credentials/edit/$id",
        params: {
          id: Object.keys(table.getState().rowSelection)[0],
        },
      });
    } else {
      navigate({
        to: "/credentials",
      });
    }
  }, [table.getState().rowSelection]);

  return (
    <Flex flex={1}>
      <Flex maxWidth={"500px"} overflowX={"hidden"}>
        <div className="p-2">
          <div className="h-2" />
          <Flex borderWidth={1} borderStyle={"solid"}>
            <Table size={"md"}>
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <Th key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : (
                            <>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              {header.column.getCanFilter() ? (
                                <div>
                                  <Filter
                                    column={header.column}
                                    table={table}
                                  />
                                </div>
                              ) : null}
                            </>
                          )}
                        </Th>
                      );
                    })}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row) => {
                  return (
                    <Tr key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <Td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Td>
                        );
                      })}
                    </Tr>
                  );
                })}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Td className="p-1">
                    <IndeterminateCheckbox
                      {...{
                        checked: table.getIsAllPageRowsSelected(),
                        indeterminate: table.getIsSomePageRowsSelected(),
                        onChange: table.getToggleAllPageRowsSelectedHandler(),
                      }}
                    />
                  </Td>
                  <Td colSpan={20}>
                    Page Rows ({table.getRowModel().rows.length})
                  </Td>
                </Tr>
              </Tfoot>
            </Table>
          </Flex>

          <div className="h-2" />
          <Flex justifyContent={"center"} alignItems={"center"} gap={2}>
            <Button
              className="border rounded p-1"
              disabled={!table.getCanPreviousPage()}
            >
              <Link
                 preload="intent"
                search={(prev) => ({
                  ...prev,
                  _page: 1,
                })}
              >
                {"<<"}
              </Link>
            </Button>
            <Button
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <Link
                preload="intent"
                search={(prev) => ({
                  ...prev,
                  _page: prev._page - 1,
                })}
              >
                {"<"}
              </Link>
            </Button>

            <Button
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <Link
                preload="intent"
                search={(prev) => ({
                  ...prev,
                  _page: prev._page + 1,
                })}
              >
                {">"}
              </Link>
            </Button>
            <Button
              className="border rounded p-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <Link
                 preload="intent"
                search={(prev) => ({
                  ...prev,
                  _page: totalCount / pageLimit,
                })}
              >
                {">>"}
              </Link>
            </Button>
            <Flex className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {_page} of {totalCount / pageLimit}
              </strong>
            </Flex>
            <Flex alignItems={"center"} gap={1}>
              | Go to page:
              <Input
                type="number"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16"
              />
            </Flex>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Flex>
          <br />
          <div>
            {Object.keys(rowSelection).length} of {totalCount} Total Rows
            Selected
          </div>
          <br />
          <div>
            <label>Row Selection State:</label>
            <pre>{JSON.stringify(table.getState().rowSelection, null, 2)}</pre>
          </div>
        </div>
      </Flex>
      <Flex flexGrow={1}>
        <Outlet />
      </Flex>
    </Flex>
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[0] ?? "") as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={((column.getFilterValue() as any)?.[1] ?? "") as string}
        onChange={(e) =>
          column.setFilterValue((old: any) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(column.getFilterValue() ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  );
}
