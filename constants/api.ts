import wretch from "wretch";
import QueryStringAddon from "wretch/addons/queryString";
import AbortAddon from "wretch/addons/abort";

import { MOCHI_PAY_API, MOCHI_PROFILE_API, MOCHI_API, TONO_API } from "../envs";

const MOCHI_PROFILE = wretch(MOCHI_PROFILE_API)
  .addon(QueryStringAddon)
  .addon(AbortAddon())
  .errorType("json");

const MOCHI_PAY = wretch(MOCHI_PAY_API)
  .addon(QueryStringAddon)
  .addon(AbortAddon())
  .errorType("json");

const MOCHI = wretch(MOCHI_API)
  .addon(QueryStringAddon)
  .addon(AbortAddon())
  .errorType("json");

const TONO = wretch(TONO_API)
  .addon(QueryStringAddon)
  .addon(AbortAddon())
  .errorType("json");

export const API = {
  MOCHI_PAY,
  MOCHI,
  MOCHI_PROFILE,
  TONO,
};
