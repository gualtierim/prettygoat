import IProjectionDefinition from "../../../scripts/registry/IProjectionDefinition";
import {IProjection, AllStreamSource} from "../../../scripts/projections/IProjection";
import Projection from "../../../scripts/registry/ProjectionDecorator";

@Projection("Split")
class SplitProjectionDefinition implements IProjectionDefinition<number> {

    define():IProjection<number> {
        return {
            name: "test",
            streamSource: new AllStreamSource(),
            definition: {
                $init: () => 10
            },
            split: {
                test: (e:any) => e.id
            }
        };
    }

}

export default SplitProjectionDefinition