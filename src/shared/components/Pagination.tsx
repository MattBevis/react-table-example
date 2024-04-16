import { Flex, Button, Input } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";

export default function Pagination() {
  return (
    <Flex justifyContent={"center"} alignItems={"center"} gap={2}>
      <Button
        className="border rounded p-1"
       //  disabled={!table.getCanPreviousPage()}
      >
        <Link
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
        // onClick={() => table.previousPage()}
      //  disabled={!table.getCanPreviousPage()}
      >
        <Link
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
      //  disabled={!table.getCanNextPage()}
      >
        <Link
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
         //  defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            // const page = e.target.value ? Number(e.target.value) - 1 : 0;
            //table.setPageIndex(page);
          }}
          className="border p-1 rounded w-16"
        />
      </Flex>
      {/* <select
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
      </select> */}
    </Flex>
  );
}
