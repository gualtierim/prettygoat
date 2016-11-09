import "bluebird";
import "reflect-metadata";
import expect = require("expect.js");
import sinon = require("sinon");
import IWinstonConfig from "../scripts/configs/IWinstonConfig";
import ILoggerRetriever from "../scripts/log/ILoggerRetriever";
import WinstonRetriever from "../scripts/log/WinstonRetriever";
import WinstonLogger from "../scripts/log/WinstonLogger";

describe("WinstonLogger, given a projection definition", () => {

    let winstonConfig:IWinstonConfig;
    let loggerRetriever:ILoggerRetriever;
    let logger:WinstonLogger;

    beforeEach(() => {
        winstonConfig = {
            "transport": [
                {"type":"file","options":{"filename":"/var/log/lug-demo/all-logs.log"}}
            ]
        };
        loggerRetriever = new WinstonRetriever();
    });

    context("when all the required properties are defined", () => {
        it("should create without error the logger system", () => {
            logger = new WinstonLogger(winstonConfig,loggerRetriever);
            expect(logger instanceof WinstonLogger).to.be(true);
        });
    });

    context("when not all the required properties are defined", () => {
        it("should throw an error", () => {
            expect(() => new WinstonLogger({},null)).to.throwError();
        });
    });

});