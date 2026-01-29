import {create, signal, signalMap, when} from "@targoninc/jess";
import {Generics, horizontal, vertical} from "./generics.ts";
import {navigate} from "../routing/Router.ts";

export class ArticlesOverview {
    static async page() {
        const articles$ = signal<{ id: string, name: string, date: string }[]>([]);
        const loading = signal(true);

        fetch("/api/articles")
            .then(r => r.json())
            .then(data => articles$.value = data)
            .finally(() => loading.value = false);

        return Generics.pageFrame(
            Generics.link("/", "Home", "home"),
            Generics.heading(1, "Articles"),
            when(loading, Generics.loading()),
            signalMap(articles$, vertical(), (article) => {
                return create("div")
                    .classes("flex", "align-children", "pointer", "article-item")
                    .onclick(() => navigate(`/article/${article.id}`))
                    .children(
                        Generics.icon("description"),
                        horizontal(
                            Generics.pill(article.date),
                            create("span").classes("article-title").text(article.name).build(),
                        ).build()
                    ).build();
            })
        );
    }
}
