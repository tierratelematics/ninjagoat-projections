import "reflect-metadata";
import expect = require("expect.js");
import {ParametersDeserializer} from "../scripts/ParametersDeserializer";
import {MockParametersProvider} from "./fixtures/ParametersProvider";
import {ModelContext} from "chupacabras";

describe("Given a parameters deserializer", () => {
    let subject: ParametersDeserializer;

    beforeEach(() => {
        subject = new ParametersDeserializer([new MockParametersProvider()]);
    });

    context("when a registered context is supplied", () => {
        it("should deserialize the parameters", () => {
            expect(subject.deserialize(new ModelContext("Admin", "Profile"))).to.eql({test: 10});
        });
    });

    context("when an unregistered context is supplied", () => {
        it("should do nothing", () => {
            expect(subject.deserialize(new ModelContext("Admin", "Profile2"))).not.to.be.ok();
        });
    });
});
