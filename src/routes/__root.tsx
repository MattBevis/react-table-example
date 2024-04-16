import { Flex } from "@chakra-ui/react";
import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <>
      <Flex flexGrow={1} className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/credentials" className="[&.active]:font-bold">
          Credentials
        </Link>
      </Flex>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
