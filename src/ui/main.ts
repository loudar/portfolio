import {router} from "./code/state.ts";
import {startRouter} from "./code/routing/Router.ts";

import {routes} from "./code/components/routes.ts";

router.value!.setRoutes(routes);
startRouter();
