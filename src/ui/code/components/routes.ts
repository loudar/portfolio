import {Route} from "../routing/Route.ts";
import {Home} from "./home.ts";
import {Generics} from "./generics.ts";

export const routes: Route[] = [
    {
        path: "/",
        title: "Alexander Fritsch",
        aliases: ["home"],
        template: Home.page,
        icon: "home",
        showInNav: true,
    },
    {
        path: "404",
        title: "404",
        aliases: ["error", "not-found"],
        template: Generics.notFound,
    },
];