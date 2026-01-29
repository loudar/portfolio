import {Tab} from "../models/Tab.ts";
import {navigate} from "../routing/Router.ts";
import {
    AnyElement,
    AnyNode,
    compute,
    create,
    nullElement,
    Signal,
    signalMap,
    StringOrSignal,
    when
} from "@targoninc/jess";

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
        if (icon.constructor === String && (icon.includes("/") || icon.includes(":"))) {
            return Generics.image(icon, [...classes, "icon-image"]);
        }

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

    static heading(level: number, text: StringOrSignal, icon?: StringOrSignal, classes: StringOrSignal[] = []) {
        return create(`h${level}`)
            .classes("flex", "align-children", ...classes)
            .children(
                when(icon, Generics.icon(icon ?? "")),
                create("span")
                    .text(text)
                    .build(),
            ).build();
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

    static link(url: StringOrSignal, title: StringOrSignal, icon?: StringOrSignal) {
        let isRemote = false;
        if (typeof url === "string") {
            isRemote = url.includes(":");
        } else {
            isRemote = url.value.includes(":");
        }

        return create("a")
            .classes("link-container", "flex", "align-children", "small-gap")
            .href(url)
            .target(isRemote ? "_blank" : "_self")
            .onclick(e => {
                if (!isRemote && e.button === 0) {
                    e.preventDefault();
                    if (typeof url === "string") {
                        navigate(url);
                    } else {
                        navigate(url.value);
                    }
                }
            })
            .children(
                create("span")
                    .text(title)
                    .build(),
                when(icon, Generics.icon(icon ?? ""))
            ).build();
    }

    static button(icon: StringOrSignal, text: StringOrSignal, onclick: () => void) {
        return create("button")
            .classes("flex")
            .onclick(onclick)
            .children(
                Generics.icon(icon),
                create("span")
                    .text(text)
                    .build(),
            ).build();
    }

    static text(text: string) {
        return create("span")
            .text(text)
            .build();
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

    static employment(title: string, name: string, link: string, skills: string[], start: Date, end: Date, icon?: StringOrSignal) {
        return create("div")
            .classes("flex-v", "employment", "small-gap")
            .children(
                Generics.dateSpan(start, end),
                create("div")
                    .classes("flex", "break-small")
                    .children(
                        Generics.heading(3, title + " @", icon),
                        Generics.link(link, name, "arrow_outward"),
                    ).build(),
                create("div")
                    .classes("flex", "small-gap")
                    .children(
                        ...skills.map(Generics.skill)
                    ).build()
            ).build();
    }

    static skill(text: string) {
        return create("span")
            .classes("skill")
            .text(text)
            .build();
    }

    private static dateSpan(start: Date, end: Date) {
        const endIsToday = Date.now() - end.getTime() < 24 * 60 * 60 * 1000;

        return create("div")
            .classes("flex", "small-gap", "secondary")
            .children(
                when(endIsToday, create("span")
                    .text("Since")
                    .build()),
                Generics.date(start),
                when(endIsToday, create("span")
                    .text("-")
                    .build(), true),
                when(endIsToday, Generics.date(end), true),
            ).build();
    }

    static date(date: Date) {
        const month = new Intl.DateTimeFormat("en-US", {
            month: "long"
        }).format(date);

        return create("span")
            .text(month + " " + date.getFullYear())
            .build();
    }

    static dot() {
        return create("div")
            .classes("dot")
            .build();
    }

    static project(link: string, description: string, name: string, overrideIcon?: StringOrSignal) {
        return create("div")
            .classes("flex", "break-small", "space-between")
            .children(
                Generics.link(link, name, overrideIcon ?? "arrow_outward"),
                create("div")
                    .classes("line", "flex-grow")
                    .build(),
                create("span")
                    .classes("secondary")
                    .text(description)
                    .build(),
            ).build();
    }

    static webbutton(img: string, url?: string) {
        if (!url) {
            return create("img")
                .classes("webbutton")
                .src(`img/${img}`)
                .build();
        }

        return create("a")
            .href(url)
            .target("_blank")
            .children(
                create("img")
                    .classes("webbutton")
                    .src(`/img/${img}`)
                    .build(),
            ).build();
    }
}

export function vertical(...children: AnyNode[]) {
    return create("div")
        .classes("flex-v")
        .children(...children);
}

export function horizontal(...children: AnyNode[]) {
    return create("div")
        .classes("flex")
        .children(...children);
}