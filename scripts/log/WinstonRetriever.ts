import LogLevel from "./LogLevel";
import ILoggerRetriever from "./ILoggerRetriever";
import {injectable} from "inversify";

@injectable()
class WinstonRetriever implements ILoggerRetriever{
    getLogger():any{
        return require('winston');
    }
}

export default WinstonRetriever