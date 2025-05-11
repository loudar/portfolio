import {Generics} from "./generics.ts";
import {create} from "@targoninc/jess";

export class Home {
    static page() {
        return Generics.pageFrame(
            create("div")
                .classes("flex-v")
                .children(
                    Generics.heading(1, "Alexander Fritsch"),
                    Generics.heading(2, "Company"),
                    Generics.link("https://targoninc.com", "Targon Industries UG", "arrow_outward"),
                ).build(),
        );
    }
}