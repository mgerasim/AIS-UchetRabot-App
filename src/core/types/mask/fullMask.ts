import IEnumModel from "@/core/types/enumModel";
import ISimpleMask from "@/core/types/mask/simpleMask";

interface IFullMask extends ISimpleMask {
    Type: IEnumModel,
    SourceEngine: IEnumModel,
    Source?: string,
    LogMessage?: string,
    Branch: any,
}

export default IFullMask;