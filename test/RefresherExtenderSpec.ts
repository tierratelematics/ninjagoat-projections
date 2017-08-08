import "reflect-metadata";
import expect = require("expect.js");
import {IMock, Mock, Times, It} from "typemoq";
import RefresherExtender from "../scripts/parameters/RefresherExtender";
import RefreshableViewModel from "./fixtures/RefreshableViewModel";
import StateViewModel from "./fixtures/StateViewModel";
import {ParametersRefresher} from "../scripts/parameters/ParametersRefresher";
import {ViewModelContext} from "ninjagoat";

describe("Given a refresh extender", () => {

    let subject: RefresherExtender;
    let parametersRefresher = new ParametersRefresher();

    beforeEach(() => {
        subject = new RefresherExtender({
            "Admin:Test": [parametersRefresher]
        });
    });

    context("when a viewmodel is refreshable", () => {
        it("should receive a refresher service", () => {
            let viewmodel = Mock.ofType(RefreshableViewModel);
            subject.extend(viewmodel.object,  new ViewModelContext("Admin", "Test"), null);

            viewmodel.verify(v => v.parametersRefresherReceived(It.isValue(parametersRefresher)), Times.once());
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
