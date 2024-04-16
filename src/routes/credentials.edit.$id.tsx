import { Flex } from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/credentials/edit/$id")({
  loader: async ({ params }) => {
    const data = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${params.id}`
    );
    const result = await data.json();
    return { result };
  },
  component: CredentialsEditRoute,
});

function CredentialsEditRoute() {
  const { result } = Route.useLoaderData();
  return (
    <Flex padding={2}>
      <form style={{ display: "flex", flexDirection: "column" }}>
        <Flex gap={2}>
          <label>Title</label>
          <input defaultValue={result.title} />
        </Flex>
        <Flex gap={2}>
          <label>Completed</label>
          <input defaultValue={result.completed} />
        </Flex>
        <Flex gap={2}>
          <label>User Id</label>
          <input defaultValue={result.userId} />
        </Flex>{" "}
        <Flex gap={2}>
          <label>Title</label>
          <input defaultValue={result.title} />
        </Flex>
      </form>
    </Flex>
  );
}
