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
                horizontal(
                    Generics.link("/", "Home", "home"),
                    Generics.link("/articles", "Articles", "article"),
                    Generics.button("arrow_upward", "To top", () => {
                        window.scrollTo({top: 0, behavior: "smooth"});
                    }, ["borderless"]),
                ).classes("sticky"),
            ).classes("small-gap", "top-links").build(),
            when(loading, Generics.loading()),
            Article.markdownToHtml(markdown$)
        );
    }
}
