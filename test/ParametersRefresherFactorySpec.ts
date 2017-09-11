import "reflect-metadata";
import expect = require("expect.js");
import {IMock, Mock, Times, It} from "typemoq";
import {ParametersRefresherFactory} from "../scripts/parameters/ParametersRefresherFactory";
import {ViewModelContext} from "ninjagoat";
import {IParametersRefresher} from "../scripts/parameters/ParametersRefresher";

describe("Given a parameters refresher factory", () => {
    let subject: ParametersRefresherFactory;
    beforeEach(() => {
        subject = new ParametersRefresherFactory();
    });
    context("when a refresher is requested", () => {
        context("when it is not already built", () => {
            it("should be built", () => {
                let refresher = subject.create(new ViewModelContext("Admin", "Test"), "asset-1");

                expect(refresher).to.be.ok();
            });
        });
        context("when it's already built", () => {
            let refresher: IParametersRefresher;
            beforeEach(() => {
                refresher = subject.create(new ViewModelContext("Admin", "Test"), "asset-1");
            });
            it("should cache the result", () => {
                expect(subject.create(new ViewModelContext("Admin", "Test"), "asset-1")).not.to.be(refresher);
            });
            it("should not cache the result if recreated", () => {
                subject.create(new ViewModelContext("Admin", "Fixture"), "asset-1");
                expect(subject.get(new ViewModelContext("Admin", "Test"), "asset-1")).to.be(refresher);
            });
        });
    });
});
