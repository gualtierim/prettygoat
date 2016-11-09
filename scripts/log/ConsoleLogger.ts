import ILogger from "./ILogger";
import LogLevel from "./LogLevel";
import {injectable} from "inversify";

@injectable()
class ConsoleLogger implements ILogger {

    private logLevel = LogLevel.Debug;

    debug(message:string) {
        if (this.logLevel <= LogLevel.Debug)
            console.log(this.logLevel+" "+message);
    }

    info(message:string) {
        if (this.logLevel <= LogLevel.Info)
            console.info(this.logLevel+" "+message);
    }

    warning(message:string) {
        if (this.logLevel <= LogLevel.Warning)
            console.warn(this.logLevel+" "+message);
    }

    error(error:string|Error) {
        console.error(this.logLevel+" "+error);
    }

    setLogLevel(level:LogLevel) {
        this.logLevel = level;
    }
}

export default ConsoleLogger