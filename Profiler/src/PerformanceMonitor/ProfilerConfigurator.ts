import { EPerformanceMarkType } from "scichart";
import { getRelatedSurfaceId } from "./data/markRelationships";
import { getSurfacesFromData, getEntryType } from "./data/MarksParsing";
import { TMarkType, TMark } from "./data/typeAliases";

export const isDefaultPerformanceMark = (mark: TMarkType) => {
    return Object.keys(EPerformanceMarkType).includes(mark);
};

export class ProfilerConfigurator {
    public getRelatedSurfaceId(mark: TMark, contextInfo: ReturnType<typeof getSurfacesFromData>) {
        const entryType = getEntryType(mark);

        if (isDefaultPerformanceMark(entryType)) {
            return getRelatedSurfaceId(mark, contextInfo);
        }

        const { canvasToSurfaceMap } = contextInfo;

        switch (entryType) {
            case "tryPerformAutoRangeOnStart":
            case "tryPerformAutoRangeOnEnd":
            case "GetXRangeStart":
            case "GetXRangeEnd": {
                return mark.detail.parentContextId;
            }

            case "measureBottomOuterAxesStart":
            case "measureBottomOuterAxesEnd":
            case "measureTopOuterAxesStart":
            case "measureTopOuterAxesEnd": {
                return mark.detail.contextId;
            }

            default: {
                return null;
                // const handleInvalidType = (type: never): never => {
                //     throw new Error(`Invalid Entry type: "${type}"!`);
                // };

                // return handleInvalidType(entryType);
            }
        }
    }
}
