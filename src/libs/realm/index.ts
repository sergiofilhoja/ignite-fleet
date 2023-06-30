import { createRealmContext } from "@realm/react";

// Schemas
import { Historic } from "./schemas/Historic";

export const { RealmProvider, useRealm, useQuery, useObject } =
  createRealmContext({
    schema: [Historic],
  });
