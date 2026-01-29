import hljs from "highlight.js";
import {Generics} from "./generics.ts";
import {compute, create, Signal} from "@targoninc/jess";

export class Article {
    static markdownToHtml(markdown: Signal<string>) {
        const converter = new window.showdown.Converter();
        const html = compute(md => converter.makeHtml(md).replaceAll(" href", ' target="_blank" href'), markdown);

        const content = create("div")
            .classes("article-content")
            .html(html)
            .build();

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

        return content;
    }
}