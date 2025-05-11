import {Generics, horizontal} from "./generics.ts";
import {create} from "@targoninc/jess";

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
                Generics.link("mailto:alex@targoninc.com", "E-Mail", "send"),
            )
        ];
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
        return [
            Generics.heading(2, "Employment history"),
            Generics.employment("Software developer", "QUIBIQ Berlin GmbH", "https://www.quibiq.de/", new Date(2022, 3), new Date(), "code"),
            Generics.dot(),
            Generics.employment("GIS work", "Bremen University of Applied Sciences", "https://www.hs-bremen.de/", new Date(2021, 7), new Date(2022, 2), "landscape_2_edit"),
            Generics.dot(),
            Generics.employment("Multimedia assistant", "BREMER Blatt Verlags GmbH", "https://www.bremer.de/", new Date(2020, 8), new Date(2021, 11), "newspaper"),
            Generics.dot(),
            Generics.employment("Retail employee", "REWE Group", "https://www.rewe.de/", new Date(2018, 7), new Date(2019, 5), "point_of_sale"),
        ];
    }

    static certificates() {
        return [
            Generics.heading(2, "Certificates"),
            Generics.project("https://learn.microsoft.com/api/credentials/share/en-us/AlexanderFritsch-9309/88DF17DA6E811F4F?sharingId=E6C821E6251813B9", "Microsoft Certified", "Azure AI Engineer Associate", "license"),
            Generics.project("https://learn.microsoft.com/api/credentials/share/en-us/AlexanderFritsch-9309/2784ABC91F604BDA?sharingId=E6C821E6251813B9", "Microsoft Certified", "Azure Developer Associate", "license"),
        ]
    }
}