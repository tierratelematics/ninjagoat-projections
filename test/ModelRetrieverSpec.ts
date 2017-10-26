import "reflect-metadata";
import expect = require("expect.js");
import {IMock, Mock, It, Times} from "typemoq";
import {IModelRetriever as ChupacabrasModelRetriever} from "chupacabras";
import ModelRetriever from "../scripts/model/ModelRetriever";
import ModelState from "../scripts/model/ModelState";
import TestCounter from "./fixtures/TestCounter";
import {ViewModelContext} from "ninjagoat";
import ModelPhase from "../scripts/model/ModelPhase";
import {IModelRetriever} from "../scripts/model/IModelRetriever";
import {Observable} from "rx";

describe("Model retriever, given an area and a viewmodel id", () => {

    let subject: IModelRetriever;
    let baseModelRetriever: IMock<ChupacabrasModelRetriever>;
    let modelContext = new ViewModelContext("Admin", "Bar");

    beforeEach(() => {
        baseModelRetriever = Mock.ofType<ChupacabrasModelRetriever>();
        subject = new ModelRetriever(baseModelRetriever.object);
    });

    context("when a viewmodel needs data to be loaded", () => {
        beforeEach(() => baseModelRetriever.setup(m => m.modelFor(It.isAny(), It.isAny())).returns(() => {
            return Observable.just({count: 20});
        }));
        it("should send a loading state to the viewmodel", () => {
            let modelState: ModelState<TestCounter> = null;
            subject.controllerFor<TestCounter>(modelContext).model.take(1).subscribe(item => modelState = item);

            expect(modelState.phase).to.be(ModelPhase.Loading);
        });
    });

    context("when a loading state has been sent to the viewmodel", () => {
        beforeEach(() => baseModelRetriever.setup(m => m.modelFor(It.isAny(), It.isAny())).returns(() => {
            return Observable.just({count: 20});
        }));
        it("should load the data", () => {
            let modelState: ModelState<TestCounter> = null;
            subject.controllerFor<TestCounter>(modelContext).model.skip(1).take(1).subscribe(item => modelState = item);

            expect(modelState.model.count).to.be(20);
        });
    });

    context("if something bad happens while retrieving the data needed by the viewmodel", () => {
        beforeEach(() => baseModelRetriever.setup(m => m.modelFor(It.isAny(), It.isAny())).returns(() => {
            return Observable.throw({message: "Something bad happened"});
        }));

        it("should push a failed state to the viewmodel", () => {
            let modelState: ModelState<TestCounter> = null;
            subject.controllerFor<TestCounter>(modelContext).model.skip(1).take(1).subscribe(item => modelState = item);

            expect(modelState.failure).to.eql({message: "Something bad happened"});
        });
    });

    context("when a model needs to be updated", () => {
        beforeEach(() => {
            baseModelRetriever.setup(m => m.modelFor(It.isAny(), It.isAny())).returns(context => {
                return Observable.just(context.parameters);
            });
        });
        it("should trigger a new request to prettygoat", () => {
            let controller = subject.controllerFor(new ViewModelContext("Admin", "Bar", {id: "10"}));
            controller.model.subscribe();
            controller.refresh({id: "20"});

            baseModelRetriever.verify(b => b.modelFor(It.isValue({
                area: "Admin",
                modelId: "Bar",
                parameters: {
                    id: "10"
                }
            }), null), Times.once());
            baseModelRetriever.verify(b => b.modelFor(It.isValue({
                area: "Admin",
                modelId: "Bar",
                parameters: {
                    id: "20"
                }
            }), null), Times.once());
        });

        it("should merge the parameters with the previous ones", () => {
            let controller = subject.controllerFor(new ViewModelContext("Admin", "Bar", {id: "10"}));
            controller.model.subscribe();
            controller.refresh({test: "20"});
            controller.refresh({foo: "30"});

            baseModelRetriever.verify(b => b.modelFor(It.isValue({
                area: "Admin",
                modelId: "Bar",
                parameters: {
                    id: "10",
                    test: "20",
                    foo: "30"
                }
            }), null), Times.once());
        });

        context("when a notify key is provided", () => {
            it("should use the provided notify key", () => {
                subject.controllerFor(new ViewModelContext("Admin", "Foo", {id: "10"}), parameters => parameters.id).model.subscribe();

                baseModelRetriever.verify(b => b.modelFor(It.isValue({
                    area: "Admin",
                    modelId: "Foo",
                    parameters: {
                        id: "10"
                    }
                }), "10"), Times.once());
            });
        });
    });
});
