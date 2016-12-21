import "reflect-metadata";
import expect = require("expect.js");
import * as Rx from "rx";
import StateViewModel from "./fixtures/StateViewModel";
import ModelState from "../scripts/model/ModelState";

describe("ModelState, given a viewmodel", () => {

    let subject:StateViewModel;

    beforeEach(() => {
        subject = new StateViewModel();
    });

    context("when a ready state is pushed into the viewmodel", () => {
        it("should notify that new data is available", () => {
            subject.observe(Rx.Observable.just(ModelState.Ready(10)));
            expect(subject.models).to.eql([10]);
        });
    });

    context("when a loading state is pushed into the viewmodel", () => {
        it("should notify that it's loading new data", () => {
            subject.observe(Rx.Observable.just(ModelState.Loading()));
            expect(subject.loading).to.be(true);
        });
    });

    context("when a failed state is pushed into the viewmodel", () => {
        it("should notify that it has failed loading new data", () => {
            subject.observe(Rx.Observable.just(ModelState.Failed(new Error())));
            expect(subject.failure instanceof Error).to.be(true);
        });
    });
});
