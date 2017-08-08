import "reflect-metadata";
import expect = require("expect.js");
import {IMock, Mock, Times, It} from "typemoq";
import RefresherExtender from "../scripts/parameters/RefresherExtender";
import RefreshableViewModel from "./fixtures/RefreshableViewModel";
import {Observable} from "rx";
import ParametersRefresher from "../scripts/parameters/ParametersRefresher";
import StateViewModel from "./fixtures/StateViewModel";

describe("Given a refresh extender", () => {

    let subject: RefresherExtender;
    let parametersRefresher = new ParametersRefresher();
    let model = Observable.just([null, parametersRefresher]);

    beforeEach(() => {
        subject = new RefresherExtender();
    });

    context("when a viewmodel is refreshable", () => {
        it("should receive a refresher service", () => {
            let viewmodel = Mock.ofType(RefreshableViewModel);
            subject.extend(viewmodel.object, null, model);

            viewmodel.verify(v => v.parametersRefresherReceived(It.isValue(parametersRefresher)), Times.once());
        });
    });

    context("when a viewmodel is not refreshable", () => {
        it("should behave normally", () => {
            let viewmodel = Mock.ofType(StateViewModel);
            subject.extend(viewmodel.object, null, model);

            expect(true).to.be(true);
        });
    });
});
