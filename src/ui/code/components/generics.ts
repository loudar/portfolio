import {Tab} from "../models/Tab.ts";
import {navigate} from "../routing/Router.ts";
import {AnyElement, compute, create, nullElement, Signal, signalMap, StringOrSignal} from "@targoninc/jess";

export class Generics {
    static notFound() {
        return Generics.pageFrame(
            create("h1")
                .text("404")
                .build()
        );
    }

    static pageFrame(...content: (AnyElement | Signal<AnyElement>)[]) {
        return create("div")
            .classes("container", "flex-v")
            .children(
                ...content
            ).build();
    }

    static container(layer: number, content: (AnyElement | Signal<AnyElement>)[], extraClasses: string[] = []) {
        return create("div")
            .classes("container", "border", "layer-" + layer, ...extraClasses)
            .children(...content)
            .build();
    }

    static image(src: StringOrSignal, extraClasses: StringOrSignal[] = [], size = "50") {
        return create("img")
            .classes(...extraClasses)
            .height(size)
            .src(src)
            .build();
    }

    static icon(icon: StringOrSignal, classes: StringOrSignal[] = [], onclick: Function = () => {
    }) {
        return create("i")
            .classes("material-symbols-outlined", ...classes)
            .text(icon)
            .onclick(onclick)
            .build();
    }

    static list<T>(entries: Signal<T[]> | T[], template: (entry: T) => AnyElement) {
        if (entries instanceof Signal) {
            return create("div")
                .classes("container", "layer-2")
                .children(
                    signalMap(entries, create("div").classes("flex-v"), template)
                ).build();
        }

        return create("div")
            .classes("container", "layer-2", "flex-v")
            .children(
                ...entries.map(template)
            ).build();
    }

    static loading() {
        return create("div")
            .classes("loading")
            .build();
    }

    static heading(level: number, text: StringOrSignal, classes: StringOrSignal[] = []) {
        return create(`h${level}`)
            .classes(...classes)
            .text(text)
            .build();
    }

    static table<T>(headers: StringOrSignal[], entries: Signal<T[]> | T[], rowTemplate: (entry: T) => AnyElement) {
        if (entries instanceof Signal) {
            return create("table")
                .classes("container", "layer-2")
                .children(
                    create("thead")
                        .children(
                            create("tr")
                                .children(
                                    ...headers.map(c => create("th").text(c).build())
                                ).build()
                        ).build(),
                    signalMap(entries, create("tbody"), rowTemplate)
                ).build();
        }

        return create("table")
            .classes("container", "layer-2")
            .children(
                create("thead")
                    .children(
                        create("tr")
                            .children(
                                ...headers.map(c => create("th").text(c).build())
                            ).build()
                    ).build(),
                create("tbody")
                    .children(
                        ...entries.map(rowTemplate)
                    ).build()
            ).build();
    }

    static tableRow(...data: any[]) {
        return create("tr")
            .children(
                ...data.map(d => create("td").text(d).build())
            ).build();
    }

    static tabSelector(tab$: Signal<string>, tabs: Tab[]) {
        return create("div")
            .classes("flex", "center-items")
            .children(
                ...tabs.map(tab => {
                    const activeClass = compute((t): string => t === tab.key ? "active" : "_", tab$);

                    return create("button")
                        .classes(activeClass)
                        .onclick(() => tab$.value = tab.key)
                        .children(
                            create("span")
                                .text(tab.text),
                            Generics.icon(tab.icon)
                        ).build();
                })
            ).build();
    }

    static tabContents(tab$: Signal<string>, templateMap: Record<string, Function>) {
        const template = compute(t => {
            if (templateMap[t]) {
                return templateMap[t]();
            }
            return nullElement();
        }, tab$);

        return create("div")
            .children(template)
            .build();
    }

    static link(url: StringOrSignal, title: StringOrSignal) {
        let isRemote = false;
        if (typeof url === "string") {
            isRemote = url.includes("http");
        } else {
            isRemote = url.value.includes("http");
        }

        return create("div")
            .classes("link-container")
            .children(
                create("a")
                    .classes("underline")
                    .href(url)
                    .target(isRemote ? "_blank" : "_self")
                    .title(url)
                    .text(title)
                    .onclick(e => {
                        if (!isRemote && e.button === 0) {
                            e.preventDefault();
                            if (typeof url === "string") {
                                navigate(url);
                            } else {
                                navigate(url.value);
                            }
                        }
                    }).build()
            ).build();
    }

    static divider() {
        return create("hr")
            .build();
    }

    static paragraph(text: StringOrSignal) {
        return create("p")
            .text(text)
            .build();
    }
}

