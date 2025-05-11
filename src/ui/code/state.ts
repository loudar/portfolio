import {Router} from "./routing/Router.ts";
import {Route} from "./routing/Route.ts";
import {signal} from "@targoninc/jess";

export const router = signal<Router|null>(null);

export const currentRoute = signal<Route|null|undefined>(null);