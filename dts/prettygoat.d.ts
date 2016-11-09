/// <reference path="../typings/index.d.ts" />

import {interfaces} from "inversify";
import {IObservable, IDisposable, Observable} from "rx";

declare module prettygoat {

    export interface IProjection<T> {
        name:string;
        split?:ISplit;
        definition:IWhen<T>;
        snapshotStrategy?:ISnapshotStrategy;
        filterStrategy?:IFilterStrategy<T>;
    }

    export interface ISplit {
        $default?:(e:Object, event?:Event) => string;
        [name:string]:(e:Object, event?:Event) => string;
    }

    export interface IWhen<T extends Object> {
        $init?:() => T;
        $any?:(s:T, payload:Object, event?:Event) => T;
        [name:string]:(s:T, payload:Object, event?:Event) => T;
    }

    export interface IProjectionRunner<T> extends IDisposable {
        state:T|Dictionary<T>;
        run(snapshot?:Snapshot<T|Dictionary<T>>):void;
        stop():void;
        notifications:Observable<Event>;
    }

    export interface IProjectionRunnerFactory {
        create<T>(projection:IProjection<T>):IProjectionRunner<T>
    }

    export interface IProjectionDefinition<T> {
        define(tickScheduler?:ITickScheduler):IProjection<T>;
    }

    export interface IMatcher {
        match(name:string):Function;
    }

    export interface Dictionary<T> {
        [index:string]:T
    }

    export interface ISnapshotRepository {
        initialize():Observable<void>;
        getSnapshots():Observable<Dictionary<Snapshot<any>>>;
        saveSnapshot<T>(streamId:string, snapshot:Snapshot<T>):void;
    }

    export interface IStreamFactory {
        from(lastEvent:Date):Observable<Event>;
    }

    interface ICassandraDeserializer {
        toEvent(row):Event;
    }

    export class Snapshot<T> {
        public static Empty:Snapshot<any>;

        constructor(memento:T, lastEvent:string);
    }

    export interface IEventEmitter {
        emitTo(clientId:string, event:string, parameters:any):void;
    }

    export class PushContext {
        area:string;
        viewmodelId:string;
        parameters:any;

        constructor(area:string, viewmodelId?:string, parameters?:any);
    }

    export interface IClientRegistry {
        add(clientId:string, context:PushContext):void;
        clientsFor(context:PushContext):ClientEntry[];
        remove(clientId:string, context:PushContext):void;
    }

    export class ClientEntry {
        id:string;
        parameters:any;

        constructor(id:string, parameters?:any);
    }

    export interface IProjectionRegistry {
        master<T>(constructor:interfaces.Newable<IProjectionDefinition<T>>):AreaRegistry;
        index<T>(constructor:interfaces.Newable<IProjectionDefinition<T>>):AreaRegistry;
        add<T>(constructor:interfaces.Newable<IProjectionDefinition<T>>, parametersKey?:(parameters:any) => string):IProjectionRegistry;
        forArea(area:string):AreaRegistry;
        getAreas():AreaRegistry[];
        getArea(areaId:string):AreaRegistry;
        getEntry<T>(id:string, area?:string):{ area:string, data:RegistryEntry<T>};
    }

    export class AreaRegistry {
        constructor(area:string, entries:RegistryEntry<any>[]);
    }

    export class RegistryEntry<T> {
        projection:IProjection<T>;
        name:string;
        parametersKey:(parameters:any) => string;

        constructor(projection:IProjection<T>, name:string, parametersKey?:(parameters:any) => string);
    }

    export function Projection(name:string);

    export class Engine {

        register(module:IModule):boolean;

        run(overrides?:any);
    }

    export interface IModule {
        modules?:(kernel:interfaces.Kernel) => void;
        register(registry:IProjectionRegistry, serviceLocator?:IServiceLocator, overrides?:any):void;
    }

    export  interface IServiceLocator {
        get<T>(key:string, name?:string):T;
    }

    export interface IEndpointConfig {
        host:string;
        port?:number;
        protocol:string;
        path?:string;
        notifications?:{
            host:string;
            port?:number;
            protocol:string;
            path?:string;
        }
    }

    export interface ICassandraConfig {
        hosts:string[];
        keyspace:string;
        readTimeout?:number;
        fetchSize?:number;
    }

    export interface WinstonConfig{
        transport:Function[]
    }

    export interface IPollToPushConfig {
        interval:number
    }

    export interface ISocketConfig {
        path:string;
    }

    export interface Event {
        type:string;
        payload:any;
        timestamp:string;
        splitKey:string;
    }

    export interface ISnapshotStrategy {
        needsSnapshot(event:Event):boolean;
    }

    export class TimeSnapshotStrategy implements ISnapshotStrategy {

        needsSnapshot(event:Event):boolean;

        saveThreshold(ms:number);
    }

    export class CountSnapshotStrategy implements ISnapshotStrategy {

        needsSnapshot(event:Event):boolean;

        saveThreshold(threshold:number):void;
    }

    export interface IFilterStrategy<T> {
        filter(state:T, context:IFilterContext):{filteredState:T, type:FilterOutputType};
    }

    export interface IFilterContext {
        headers:{ [key:string]:string };
        params:{ [key:string]:string };
    }

    export enum FilterOutputType {
        CONTENT,
        UNAUTHORIZED,
        FORBIDDEN
    }

    export enum LogLevel {
        Debug,
        Info,
        Warning,
        Error
    }

    export interface ILogger {
        debug(message:string);

        info(message:string);

        warning(message:string);

        error(error:string|Error);

        setLogLevel(level:LogLevel);
    }

    export class ConsoleLogger implements ILogger {

        debug(message:string);

        info(message:string);

        warning(message:string);

        error(error:string|Error);

        setLogLevel(level:LogLevel);
    }

    export class WinstonLogger implements ILogger {

        debug(message:string);

        info(message:string);

        warning(message:string);

        error(error:string|Error);

        setLogLevel(level:LogLevel);
    }


    export interface ITickScheduler extends IStreamFactory {
        schedule(dueTime:number | Date, state?:string, splitKey?:string);
    }

    export class Tick {
        state:string;
        clock:Date | number;

        constructor(clock:Date, state?:string);
    }
}

export = prettygoat;