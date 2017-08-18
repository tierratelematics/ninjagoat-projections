import "reflect-metadata";
import expect = require("expect.js");
import {IMock, Mock, It, Times} from "typemoq";
import {IModelRetriever as ChupacabrasModelRetriever} from "chupacabras";
import ModelRetriever from "../scripts/model/ModelRetriever";
import ModelState from "../scripts/model/ModelState";
import TestCounter from "./fixtures/TestCounter";
import {ViewModelContext, IViewModelRegistry, RegistryEntry} from "ninjagoat";
import ModelPhase from "../scripts/model/ModelPhase";
import {IModelRetriever} from "../scripts/model/IModelRetriever";
import {Observable, Subject} from "rx";
import {IParametersRefresherFactory} from "../scripts/parameters/ParametersRefresherFactory";
import {IParametersRefresher} from "../scripts/parameters/ParametersRefresher";

describe("Model retriever, given an area and a viewmodel id", () => {

    let subject: IModelRetriever;
    let baseModelRetriever: IMock<ChupacabrasModelRetriever>;
    let modelContext = new ViewModelContext("Admin", "Bar");
    let registry: IMock<IViewModelRegistry>;
    let parametersFactory: IMock<IParametersRefresherFactory>;
    let refreshes: Subject<object>;

    beforeEach(() => {
        refreshes = new Subject<object>();
        registry = Mock.ofType<IViewModelRegistry>();
        registry.setup(r => r.getEntry(It.isAny(), It.isAny())).returns(() => {
            return {
                area: null,
                viewmodel: new RegistryEntry(null, null, null)
            };
        });
        parametersFactory = Mock.ofType<IParametersRefresherFactory>();
        parametersFactory.setup(p => p.create(It.isAny(), It.isAny())).returns(() => {
            let refresher = Mock.ofType<IParametersRefresher>();
            refresher.setup(r => r.updates()).returns(() => refreshes);
            return refresher.object;
        });
        baseModelRetriever = Mock.ofType<ChupacabrasModelRetriever>();
        subject = new ModelRetriever(baseModelRetriever.object, parametersFactory.object, registry.object);
    });

    context("when a viewmodel needs data to be loaded", () => {
        beforeEach(() => baseModelRetriever.setup(m => m.modelFor(It.isAny(), It.isAny())).returns(() => {
            return Observable.just({count: 20});
        }));
        it("should send a loading state to the viewmodel", () => {
            let modelState: ModelState<TestCounter> = null;
            subject.modelFor<TestCounter>(modelContext).take(1).subscribe(item => modelState = item);

            expect(modelState.phase).to.be(ModelPhase.Loading);
        });
    });

    context("when a loading state has been sent to the viewmodel", () => {
        beforeEach(() => baseModelRetriever.setup(m => m.modelFor(It.isAny(), It.isAny())).returns(() => {
            return Observable.just({count: 20});
        }));
        it("should load the data", () => {
            let modelState: ModelState<TestCounter> = null;
            subject.modelFor<TestCounter>(modelContext).skip(1).take(1).subscribe(item => modelState = item);

            expect(modelState.model.count).to.be(20);
        });
    });

    context("if something bad happens while retrieving the data needed by the viewmodel", () => {
        beforeEach(() => baseModelRetriever.setup(m => m.modelFor(It.isAny(), It.isAny())).returns(() => {
            return Observable.throw({message: "Something bad happened"});
        }));

        it("should push a failed state to the viewmodel", () => {
            let modelState: ModelState<TestCounter> = null;
            subject.modelFor<TestCounter>(modelContext).skip(1).take(1).subscribe(item => modelState = item);

            expect(modelState.failure).to.eql({message: "Something bad happened"});
        });
    });

    context("when a model needs to be updated", () => {
        beforeEach(() => {
            baseModelRetriever.setup(m => m.modelFor(It.isAny(), It.isAny())).returns(context => {
                return Observable.just(context.parameters);
            });
            registry.reset();
            registry.setup(r => r.getEntry("Admin", "Bar")).returns(() => {
                let entry = new RegistryEntry(null, null, null);
                entry.notify = parameters => parameters.id;
                return {
                    area: null,
                    viewmodel: entry
                };
            });
            parametersFactory.reset();
            parametersFactory.setup(p => p.create(It.isAny(), "10")).returns(() => {
                let refresher = Mock.ofType<IParametersRefresher>();
                refresher.setup(r => r.updates()).returns(() => refreshes);
                return refresher.object;
            });
        });
        context("when a viewmodel exists for that model", () => {
            it("should trigger a new request to prettygoat", () => {
                subject.modelFor(new ViewModelContext("Admin", "Bar", {id: "10"})).subscribe();
                refreshes.onNext({id: "20"});

                baseModelRetriever.verify(b => b.modelFor(It.isValue({
                    area: "Admin",
                    modelId: "Bar",
                    parameters: {
                        id: "10"
                    }
                }), "10"), Times.once());
                baseModelRetriever.verify(b => b.modelFor(It.isValue({
                    area: "Admin",
                    modelId: "Bar",
                    parameters: {
                        id: "20"
                    }
                }), "20"), Times.once());
            });

            it("should merge the parameters with the previous ones", () => {
                subject.modelFor(new ViewModelContext("Admin", "Bar", {id: "10"})).subscribe();
                refreshes.onNext({test: "20"});
                refreshes.onNext({foo: "30"});

                baseModelRetriever.verify(b => b.modelFor(It.isValue({
                    area: "Admin",
                    modelId: "Bar",
                    parameters: {
                        id: "10",
                        test: "20",
                        foo: "30"
                    }
                }), "10"), Times.once());
            });
        });

        context("when a viewmodel does not exist for that model", () => {
            it("should use the provided notify key", () => {
                subject.modelFor(new ViewModelContext("Admin", "Foo", {id: "10"}), parameters => parameters.id).subscribe();

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
