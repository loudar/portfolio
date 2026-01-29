import {create, signal} from "@targoninc/jess";
import {Generics, horizontal} from "./generics.ts";
import {navigate} from "../routing/Router.ts";

export class ArticlesOverview {
    static async page() {
        const articles$ = signal<{ id: string, name: string, date: string }[]>([]);

        fetch("/api/articles")
            .then(r => r.json())
            .then(data => articles$.value = data);

        return Generics.pageFrame(
            Generics.link("/", "Home", "home"),
            Generics.heading(1, "Articles"),
            Generics.list(articles$, (article) => {
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
