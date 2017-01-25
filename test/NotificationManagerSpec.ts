import "reflect-metadata";
import expect = require("expect.js");
import * as TypeMoq from "typemoq";
import NotificationManager from "../scripts/notifications/NotificationManager";
import MockSocketClient from "./fixtures/MockSocketClient";
import {ViewModelContext} from "ninjagoat";

describe("NotificationManager, given an area and a viewmodel id", () => {

    let subject: NotificationManager;
    let client: TypeMoq.IMock<SocketIOClient.Socket>;

    beforeEach(() => {
        client = TypeMoq.Mock.ofType(MockSocketClient);
        subject = new NotificationManager(client.object);
    });


    context("when this viewmodel needs notifications about the model change", () => {
        it("should subscribe to the backend", () => {
            subject.notificationsFor(new ViewModelContext("Admin", "FakePage"));
            client.verify(c => c.emit('subscribe', TypeMoq.It.isValue({
                area: "Admin",
                viewmodelId: "FakePage",
                parameters: undefined
            })), TypeMoq.Times.once());
        });

        context("and custom parameters are needed on the backend side", () => {
            it("should also add these parameters to the subscription request", () => {
                subject.notificationsFor(new ViewModelContext("Admin", "FakePage", {id: 60}));
                client.verify(c => c.emit('subscribe', TypeMoq.It.isValue({
                    area: "Admin",
                    viewmodelId: "FakePage",
                    parameters: {id: 60}
                })), TypeMoq.Times.once());
            });
        });
    });

    context("when a notifications is not needed anymore", () => {
        it("should dispose the subscription", () => {
            let subscription = subject.notificationsFor(new ViewModelContext("Admin", "FakePage", {id: 60})).subscribe(_ => {
            });
            subscription.dispose();
            client.verify(c => c.emit('unsubscribe', TypeMoq.It.isValue({
                area: "Admin",
                viewmodelId: "FakePage",
                parameters: {id: 60}
            })), TypeMoq.Times.once());
        });
    });
});