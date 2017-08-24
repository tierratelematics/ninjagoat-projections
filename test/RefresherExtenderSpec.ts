import "reflect-metadata";
import expect = require("expect.js");
import {IMock, Mock, Times, It} from "typemoq";
import RefresherExtender from "../scripts/parameters/RefresherExtender";
import RefreshableViewModel from "./fixtures/RefreshableViewModel";
import StateViewModel from "./fixtures/StateViewModel";
import {ViewModelContext, IViewModelRegistry, RegistryEntry} from "ninjagoat";
import {IParametersRefresherFactory} from "../scripts/parameters/ParametersRefresherFactory";
import {IParametersRefresher} from "../scripts/parameters/ParametersRefresher";

describe("Given a refresh extender", () => {

    let subject: RefresherExtender;
    let registry: IMock<IViewModelRegistry>;
    let parametersFactory: IMock<IParametersRefresherFactory>;
    let refresher = Mock.ofType<IParametersRefresher>();

    beforeEach(() => {
        registry = Mock.ofType<IViewModelRegistry>();
        registry.setup(r => r.getEntry(It.isAny(), It.isAny())).returns(() => {
            return {
                area: null,
                viewmodel: new RegistryEntry(null, null, null)
            };
        });
        parametersFactory = Mock.ofType<IParametersRefresherFactory>();
        parametersFactory.setup(p => p.get(It.isAny(), It.isAny())).returns(() => refresher.object);
        subject = new RefresherExtender(parametersFactory.object, registry.object);
    });

    context("when a viewmodel is refreshable", () => {
        it("should receive a refresher service", () => {
            let viewmodel = Mock.ofType(RefreshableViewModel);
            subject.extend(viewmodel.object,  new ViewModelContext("Admin", "Test"), null);

            viewmodel.verify(v => v.parametersRefresherReceived(It.isValue(refresher.object)), Times.once());
        });
    });

    context("when a viewmodel is not refreshable", () => {
        it("should behave normally", () => {
            let viewmodel = Mock.ofType(StateViewModel);
            subject.extend(viewmodel.object, new ViewModelContext("Admin", "Test"), null);

            expect(true).to.be(true);
        });
    });
});
