import ILogger from "./ILogger";
import LogLevel from "./LogLevel";
import {injectable,inject} from "inversify";
import WinstonConfig from "../configs/IWinstonConfig";
import * as _ from "lodash";

@injectable()
class WinstonLogger implements ILogger {

    private logger = require('winston');
    private logLevel = LogLevel.Debug;

    constructor(@inject("WinstonConfig") private config:WinstonConfig){
        if(!_.isNil(config) && config.transport.length>0){
            _.forEach(config.transport, (value,key) => {
                let type = this.setTranspotType(value.type);
                if(type!=null){
                    this.logger.add(type,value.options);
                }
            })
        }
    }

    debug(message:string) {
        if (this.logLevel <= LogLevel.Debug)
            this.logger.log('debug', message);
    }

    info(message:string) {
        if (this.logLevel <= LogLevel.Info)
            this.logger.log('info', message);
    }

    warning(message:string) {
        if (this.logLevel <= LogLevel.Warning)
            this.logger.log('warn', message);
    }

    error(error:string|Error) {
        this.logger.log('error', error);
    }

    setLogLevel(level:LogLevel) {
        // this.logger.level = level;
        this.logLevel = level;
    }

    setTranspotType(type:string){
        let returnValue;

        switch (type) {
            case "file":
                returnValue = this.logger.transports.File;
                break;
            case "console":
                returnValue = this.logger.transports.Console;
                break;
            default:
                returnValue = null;
        }

        return returnValue;
    }
}

export default WinstonLogger