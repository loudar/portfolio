import {Generics} from "./generics.ts";
import {create} from "@targoninc/jess";

export class Home {
    static page() {
        return Generics.pageFrame(
            create("div")
                .classes("flex-v", "center-items")
                .children(
                    create("h1")
                        .classes("flex", "noflexwrap", "main-heading")
                        .text("Home page")
                        .build(),
                ).build(),
        );
    }
}