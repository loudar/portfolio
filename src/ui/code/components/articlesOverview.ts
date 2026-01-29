import {create, signal, signalMap, when} from "@targoninc/jess";
import {Generics, horizontal, vertical} from "./generics.ts";
import {navigate} from "../routing/Router.ts";

export class ArticlesOverview {
    static async page() {
        const articles$ = signal<{ id: string, name: string, date: string }[]>([]);
        const loading = signal(true);

        fetch("/api/articles")
            .then(r => r.json())
            .then(data => articles$.value = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()))
            .finally(() => loading.value = false);

        return Generics.pageFrame(
            horizontal(
                horizontal(
                    Generics.link("/", "Home", "west", "left"),
                    Generics.upDownButtons()
                ).classes("sticky")
            ).classes("top-links").build(),
            Generics.heading(1, "Articles"),
            when(loading, Generics.loading()),
            signalMap(articles$, vertical(), (article) => {
                return create("div")
                    .classes("flex", "align-children", "pointer", "article-item")
                    .onclick(() => navigate(`/article/${article.id}`))
                    .children(
                        Generics.icon("auto_stories"),
                        horizontal(
                            Generics.pill(article.date),
                            create("span").classes("article-title").text(article.name).build(),
                        ).build()
                    ).build();
            })
        );
    }
}
