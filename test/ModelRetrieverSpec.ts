import "reflect-metadata";
import expect = require("expect.js");
import Rx = require("rx");
import {IMock, Mock, It, Times} from "typemoq";
import {IModelRetriever as ChupacabrasModelRetriever} from "chupacabras";
import ModelRetriever from "../scripts/model/ModelRetriever";
import ModelState from "../scripts/model/ModelState";
import TestCounter from "./fixtures/TestCounter";
import {ViewModelContext} from "ninjagoat";
import ModelPhase from "../scripts/model/ModelPhase";
import {IModelRetriever} from "../scripts/model/IModelRetriever";
import {IParametersRefresher} from "../scripts/parameters/ParametersRefresher";
import {Observable} from "rx";
import {Dictionary} from "ninjagoat";

describe("Model retriever, given an area and a viewmodel id", () => {

    let subject: IModelRetriever;
    let baseModelRetriever: IMock<ChupacabrasModelRetriever>;
    let modelContext = new ViewModelContext("Admin", "Bar");
    let holder: Dictionary<IParametersRefresher[]>;

    beforeEach(() => {
        holder = {};
        baseModelRetriever = Mock.ofType<ChupacabrasModelRetriever>();
        subject = new ModelRetriever(baseModelRetriever.object, holder);
    });

    context("when a viewmodel needs data to be loaded", () => {
        beforeEach(() => baseModelRetriever.setup(m => m.modelFor(It.isAny())).returns(() => {
            return Observable.just({count: 20});
        }));
        it("should send a loading state to the viewmodel", () => {
            let modelState: ModelState<TestCounter> = null;
            subject.modelFor<TestCounter>(modelContext).take(1).subscribe(item => modelState = item);

            expect(modelState.phase).to.be(ModelPhase.Loading);
        });
    });

    context("when a loading state has been sent to the viewmodel", () => {
        beforeEach(() => baseModelRetriever.setup(m => m.modelFor(It.isAny())).returns(() => {
            return Observable.just({count: 20});
        }));
        it("should load the data", () => {
            let modelState: ModelState<TestCounter> = null;
            subject.modelFor<TestCounter>(modelContext).skip(1).take(1).subscribe(item => modelState = item);

            expect(modelState.model.count).to.be(20);
        });
    });

    context("if something bad happens while retrieving the data needed by the viewmodel", () => {
        beforeEach(() => baseModelRetriever.setup(m => m.modelFor(It.isAny())).returns(() => {
            return Observable.throw({message: "Something bad happened"});
        }));

        it("should push a failed state to the viewmodel", () => {
            let modelState: ModelState<TestCounter> = null;
            subject.modelFor<TestCounter>(modelContext).skip(1).take(1).subscribe(item => modelState = item);

            expect(modelState.failure).to.eql({message: "Something bad happened"});
        });
    });

    context("when a model needs to be updated", () => {
        beforeEach(() => baseModelRetriever.setup(m => m.modelFor(It.isAny())).returns(context => {
            return Observable.just(context.parameters);
        }));
        it("should trigger a new request to prettygoat", () => {
            subject.modelFor(modelContext).subscribe();
            holder["Admin:Bar"][0].refresh({id: 20});

            baseModelRetriever.verify(b => b.modelFor(It.isValue({
                area: "Admin",
                modelId: "Bar",
                parameters: undefined
            })), Times.once());
            baseModelRetriever.verify(b => b.modelFor(It.isValue({
                area: "Admin",
                modelId: "Bar",
                parameters: {
                    id: 20
                }
            })), Times.once());
        });
    });
});
