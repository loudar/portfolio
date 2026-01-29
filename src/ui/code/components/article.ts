import hljs from "highlight.js";
import {Generics} from "./generics.ts";
import {compute, create, Signal} from "@targoninc/jess";
import showdown from "showdown";

export class Article {
    static markdownToHtml(markdown: Signal<string>) {
        const converter = new showdown.Converter();
        const html = compute(md => converter.makeHtml(md).replaceAll(" href", ' target="_blank" href'), markdown);

        const content = create("div")
            .classes("article-content")
            .html(html)
            .build();

        function update() {
            for (let a of content.querySelectorAll("a")) {
                if (a.innerText.trim().startsWith(">")) {
                    a.classList.add("citation");
                    a.innerText = a.innerText.trim().substring(1);
                }
            }

            const h1 = content.querySelector("h1");
            if (h1) {
                document.title = h1.innerText.trim();
            }

            for (let codeInPres of content.querySelectorAll("pre code")) {
                const pre = codeInPres.parentElement;
                if (!pre) {
                    continue;
                }
                const code = codeInPres as HTMLPreElement;

                pre.classList.add("flex-v", "rendered");
                if (code.innerText.trim().startsWith("{{md:execute-js}}")) {
                    const trimmed = code.innerText.replaceAll("{{md:execute-js}}", "").trim();
                    const result = eval(`"use strict";(() => {${trimmed}})()`);
                    codeInPres.innerHTML = "";
                    codeInPres.classList.add("rendered");
                    pre.insertBefore(create("span")
                        .classes("rendered_text")
                        .text("Rendered").build(), pre.firstChild);
                    codeInPres.appendChild(result);
                } else {
                    pre.insertBefore(Generics.button("content_copy", "Copy code", () => {
                        navigator.clipboard.writeText(code.innerText);
                    }), pre.firstChild);
                    hljs.highlightElement(code);
                }
            }
        }

        html.subscribe(update);
        update();

        return content;
    }
}