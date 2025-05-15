import {Generics, horizontal, vertical} from "./generics.ts";
import {create} from "@targoninc/jess";
import {Employment} from "./employment.ts";

export class Home {
    static page() {
        return Generics.pageFrame(
            create("div")
                .classes("flex-v")
                .styles("padding-bottom", "5dvh")
                .children(
                    Generics.heading(1, "Alexander Fritsch"),
                    ...Home.contact(),
                    ...Home.company(),
                    ...Home.apps(),
                    ...Home.libraries(),
                    ...Home.certificates(),
                    ...Home.employment(),
                ).build(),
        );
    }

    static contact() {
        return [
            Generics.heading(2, "Contact"),
            horizontal(
                Generics.link("https://bsky.app/profile/illegal.trading", "Bluesky", "/img/bluesky.svg"),
                Generics.link("https://github.com/loudar", "Github", "/img/github.svg"),
                Generics.link("https://signal.me/#eu/eKJtXUYweDu1rxlutnJ7KAH5j3fgi2luKwTXb1GayW6JmWlveCxB35Kz16M-JNKY", "Signal", "/img/signal.svg"),
                Generics.link("mailto:alex@targoninc.com", "E-Mail", "send"),
            ),
            Generics.heading(3, "Languages"),
            vertical(
                Generics.text("German"),
                Generics.text("English"),
            )
        ];
    }

    static skills() {
        return [

        ]
    }

    static company() {
        return [
            Generics.heading(2, "Company"),
            Generics.project("https://targoninc.com", "Software company", "Targon Industries UG"),
            Generics.project("https://trirecords.eu", "Music label", "Tri Records"),
        ];
    }

    static apps() {
        return [
            Generics.heading(2, "Projects"),
            Generics.project("https://github.com/targoninc/botanika-desktop", "Desktop LLM client", "Botanika"),
            Generics.project("https://lyda.app", "Music service", "Lyda"),
            //Generics.project("https://blog.blob.group", "IT-related thoughts", "Blog"),
        ];
    }

    static libraries() {
        return [
            Generics.heading(2, "Libraries"),
            Generics.project("https://www.npmjs.com/package/@targoninc/jess", "Templating & state management", "Jess"),
            Generics.project("https://www.npmjs.com/package/@targoninc/data-exporter", "Data export to file or string", "data-exporter"),
            Generics.project("https://www.npmjs.com/package/@targoninc/ts-logging", "Logging library", "ts-logging"),
            Generics.project("https://www.npmjs.com/package/@targoninc/ts-search", "Search abstraction", "ts-search"),
            Generics.project("https://www.npmjs.com/package/@targoninc/ts-mail", "E-Mail simplification", "ts-mail"),
        ];
    }

    static employment() {
        const employments: Employment[] = [
            {
                title: "Software developer",
                company: "QUIBIQ Berlin GmbH",
                url: "https://www.quibiq.de/",
                start: new Date(2022, 3),
                end: new Date(),
                icon: "code"
            },
            {
                title: "GIS work",
                company: "Bremen University of Applied Sciences",
                url: "https://www.hs-bremen.de/",
                start: new Date(2021, 7),
                end: new Date(2022, 2),
                icon: "landscape_2_edit"
            },
            {
                title: "Multimedia assistant",
                company: "BREMER Blatt Verlags GmbH",
                url: "https://www.bremer.de/",
                start: new Date(2020, 8),
                end: new Date(2021, 11),
                icon: "newspaper"
            },
            {
                title: "Retail employee",
                company: "REWE Group",
                url: "https://www.rewe.de/",
                start: new Date(2019, 7),
                end: new Date(2020, 5),
                icon: "newspaper"
            }
        ].sort((a, b) => b.end.getTime() - a.end.getTime());

        return [
            Generics.heading(2, "Employment history"),
            Home.timeline(employments),
            ...employments.flatMap((e, i) => {
                if (i === employments.length - 1) {
                    return [Generics.employment(e.title, e.company, e.url, e.start, e.end)];
                }

                return [
                    Generics.employment(e.title, e.company, e.url, e.start, e.end),
                    Generics.dot()
                ];
            }),
        ];
    }

    static certificates() {
        return [
            Generics.heading(2, "Certificates"),
            Generics.project("https://learn.microsoft.com/api/credentials/share/en-us/AlexanderFritsch-9309/88DF17DA6E811F4F?sharingId=E6C821E6251813B9", "Microsoft Certified", "Azure AI Engineer Associate", "license"),
            Generics.project("https://learn.microsoft.com/api/credentials/share/en-us/AlexanderFritsch-9309/2784ABC91F604BDA?sharingId=E6C821E6251813B9", "Microsoft Certified", "Azure Developer Associate", "license"),
        ]
    }

    private static timeline(employments: Employment[]) {
        const first = employments.at(-1)!;
        const last = employments[0];
        const totalTimeSpan = last.end.getTime() - first.start.getTime();

        return create("div")
            .classes("flex", "no-gap", "relative", "timeline")
            .children(
                ...employments.toReversed().map((e, i) => {
                    const length = e.end.getTime() - e.start.getTime();
                    const partial = length / totalTimeSpan;

                    return create("div")
                        .classes("line")
                        .styles("width", `calc(${partial * 100}% - 5px)`)
                        .styles("opacity", Math.max(.5, i / employments.length).toString())
                        .styles("border-bottom-width", `${Math.ceil(partial * 5)}px`)
                        .children(
                            create("span")
                                .classes("line-employment")
                                .text(e.company)
                                .build()
                        ).build();
                })
            ).build();
    }
}