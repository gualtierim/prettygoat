import "bluebird";
import "reflect-metadata";
import {injectable} from "inversify";
import ICassandraDeserializer from "./ICassandraDeserializer";
import {Event} from "./Event";

@injectable()
class CassandraDeserializer implements ICassandraDeserializer {
    toEvent(row):Event {
        let parsedEvent = JSON.parse(row["system.blobastext(event)"]);

        if (this.isNewEventType(parsedEvent)) {
            return {
                type: parsedEvent.payload.$manifest,
                payload: parsedEvent.payload,
                timestamp: row.timestamp.getDate(),
                splitKey: null
            };
        }

        return {
            type: parsedEvent.type,
            payload: parsedEvent.payload,
            timestamp: row.timestamp.getDate(),
            splitKey: null
        };
    }

    private isNewEventType(event):boolean {
        return (event.payload && event.payload.$manifest);
    }
}

export default CassandraDeserializer;
