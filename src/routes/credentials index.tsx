import {
  Flex,
  Heading
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/credentials index")({
  component: CredentialsRoute,
});

export default function CredentialsRoute() {
  return (
    <Flex alignItems={"center"} justifyContent={"center"}>
      <Heading>This is the index credntials route</Heading>
    </Flex>
  );
}
