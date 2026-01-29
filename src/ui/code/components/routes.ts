import {Route} from "../routing/Route.ts";
import {Home} from "./home.ts";
import {Generics} from "./generics.ts";
import {ArticlesOverview} from "./articlesOverview.ts";
import {ArticlePage} from "./articlePage.ts";

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
        path: "articles",
        title: "Articles",
        template: ArticlesOverview.page,
        icon: "article",
        showInNav: true,
    },
    {
        path: "article",
        pathParams: ["id"],
        template: ArticlePage.page,
    },
    {
        path: "404",
        title: "404",
        aliases: ["error", "not-found"],
        template: Generics.notFound,
    },
];