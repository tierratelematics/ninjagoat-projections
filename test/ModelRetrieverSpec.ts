import "reflect-metadata";
import expect = require("expect.js");
import Rx = require("rx");
import * as TypeMoq from "typemoq";
import IModelRetriever from "../scripts/model/IModelRetriever";
import {IHttpClient} from "ninjagoat";
import INotificationManager from "../scripts/notifications/INotificationManager";
import ModelRetriever from "../scripts/model/ModelRetriever";
import ModelState from "../scripts/model/ModelState";
import TestCounter from "./fixtures/TestCounter";
import {ViewModelContext} from "ninjagoat";
import ModelPhase from "../scripts/model/ModelPhase";
import {HttpResponse} from "ninjagoat";
import MockHttpClient from "./fixtures/MockHttpClient";
import MockNotificationManager from "./fixtures/MockNotificationManager";

describe("Model retriever, given an area and a viewmodel id", () => {

    let subject: IModelRetriever;
    let httpClient: TypeMoq.IMock<IHttpClient>;
    let notificationManager: TypeMoq.IMock<INotificationManager>;

    beforeEach(() => {
        httpClient = TypeMoq.Mock.ofType(MockHttpClient);
        notificationManager = TypeMoq.Mock.ofType(MockNotificationManager);
        subject = new ModelRetriever(httpClient.object, notificationManager.object);
        notificationManager.setup(n => n.notificationsFor(TypeMoq.It.isAny())).returns(context => {
            return Rx.Observable.just({url: 'http://testurl/' + (context.parameters ? context.parameters.id : "")});
        });
        httpClient.setup(h => h.get("http://testurl/")).returns(() => {
            return Rx.Observable.just(new HttpResponse({count: 20}, 200));
        });
        httpClient.setup(h => h.get("http://testurl/60")).returns(() => {
            return Rx.Observable.just(new HttpResponse({count: 60}, 200));
        });
    });

    context("when a viewmodel needs data to be loaded", () => {
        it("should send a loading state to the viewmodel", () => {
            let modelState: ModelState<TestCounter> = null;
            subject.modelFor<TestCounter>(new ViewModelContext("Admin", "Bar")).take(1).subscribe(item => modelState = item);
            expect(modelState.phase).to.be(ModelPhase.Loading);
        });
    });

    context("when a loading state has been sent to the viewmodel", () => {
        it("should load the data", () => {
            let modelState: ModelState<TestCounter> = null;
            subject.modelFor<TestCounter>(new ViewModelContext("Admin", "Bar")).skip(1).take(1).subscribe(item => modelState = item);
            expect(modelState.model.count).to.be(20);
        });

        context("and some parameters are needed to construct the model", () => {
            it("should append those parameters when requesting the model", () => {
                let modelState: ModelState<TestCounter> = null;
                subject.modelFor<TestCounter>(new ViewModelContext("Admin", "Bar", {id: 60})).skip(1).take(1).subscribe(item => modelState = item);
                expect(modelState.model.count).to.be(60);
            });
        });

        context("and some parameters are needed on the backend side", () => {
            it("should pass those parameters in the query string", () => {

            });
        });

        context("and parameters aren't needed on the backend side", () => {
            it("should keep the query string empty", () => {

            });
        });
    });

    context("if something bad happens while retrieving the data needed by the viewmodel", () => {

        beforeEach(() => {
            httpClient.reset();
            httpClient.setup(h => h.get(TypeMoq.It.isAny())).returns(() => {
                return Rx.Observable.throw<HttpResponse>({message: 'Something bad happened'});
            });
        });

        it("should push a failed state to the viewmodel", () => {
            let modelState: ModelState<TestCounter> = null;
            subject.modelFor<TestCounter>(new ViewModelContext("Admin", "Bar", {id: 60})).skip(1).take(1).subscribe(item => modelState = item);
            expect(modelState.failure).to.eql({message: 'Something bad happened'});
        });
    });
});