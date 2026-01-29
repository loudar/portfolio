import {signal} from "@targoninc/jess";
import {Generics} from "./generics.ts";
import {Article} from "./article.ts";

export class ArticlePage {
    static async page(_route: any, params: { [key: string]: string }) {
        const id = params["id"];
        const markdown$ = signal<string>("Loading...");

        fetch(`/api/article/${id}`)
            .then(r => {
                if (!r.ok) throw new Error("Article not found");
                return r.text();
            })
            .then(text => markdown$.value = text)
            .catch(err => markdown$.value = "# Error\n" + err.message);

        return Generics.pageFrame(
            Article.markdownToHtml(markdown$)
        );
    }
}
