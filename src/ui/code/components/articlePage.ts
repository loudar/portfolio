import {signal, when} from "@targoninc/jess";
import {Generics, horizontal} from "./generics.ts";
import {Article} from "./article.ts";

export class ArticlePage {
    static async page(_route: any, params: { [key: string]: string }) {
        const id = params["id"];
        const markdown$ = signal<string>("");
        const loading = signal(true);

        fetch(`/api/article/${id}`)
            .then(async r => {
                if (!r.ok) throw new Error("Article not found");

                return r.text();
            })
            .then(text => markdown$.value = text)
            .catch(err => markdown$.value = "# Error\n" + err.message)
            .finally(() => loading.value = false);

        return Generics.pageFrame(
            horizontal(
                Generics.link("/", "Home", "home"),
                Generics.link("/articles", "Articles", "article"),
            ).classes("small-gap").build(),
            when(loading, Generics.loading()),
            Article.markdownToHtml(markdown$)
        );
    }
}
