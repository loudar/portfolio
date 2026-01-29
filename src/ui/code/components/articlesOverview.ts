import {create, signal} from "@targoninc/jess";
import {Generics} from "./generics.ts";
import {navigate} from "../routing/Router.ts";

export class ArticlesOverview {
    static async page() {
        const articles$ = signal<{id: string, name: string}[]>([]);
        
        fetch("/api/articles")
            .then(r => r.json())
            .then(data => articles$.value = data);

        return Generics.pageFrame(
            Generics.heading(1, "Articles", "article"),
            Generics.list(articles$, (article) => {
                return create("div")
                    .classes("flex", "align-children", "pointer", "article-item")
                    .onclick(() => navigate(`/article/${article.id}`))
                    .children(
                        Generics.icon("description"),
                        create("span").text(article.name).build()
                    ).build();
            })
        );
    }
}
