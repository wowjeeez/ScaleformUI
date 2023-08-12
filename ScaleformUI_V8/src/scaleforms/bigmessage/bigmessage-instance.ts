import {Singleton} from "../../helpers/singleton.decorator";
import {Scaleform} from "../scaleform";
import {cache} from "@babel/traverse";
import scope = cache.scope;
import {block, noop, waitUntilReturns} from "../../helpers/loaders";
import {Color} from "../../elements/color";

@Singleton
export class BigmessageInstance {
    private scaleform?: Scaleform
    private manualDispose = false
    private transition: "TRANSITION_OUT" | "TRANSITION_UP" | "TRANSITION_DOWN"  = "TRANSITION_OUT"
    private transitionDuration = 0.15
    private transitionPreventAutoExpansion = false
    private transitionExecuted = false
    private start = 0
    private duration = 0

    constructor() {}

    public async load() {
        if (this.scaleform) return
        this.scaleform = Scaleform.request("MP_BIG_MESSAGE_FREEMODE")
        const start = GetGameTimer()
        const to = 1000
        await waitUntilReturns(noop, () => this.scaleform!.hasLoaded() && GetGameTimer() - start < to, true, 0)
    }

    public async destroy() {
        if (!this.scaleform) return
        if (this.manualDispose) {
            this.scaleform.callFunction(this.transition, false, this.transitionDuration, this.transitionPreventAutoExpansion)
            await block((this.transitionDuration * .5) * 1000)
            this.manualDispose = false
        }
        this.start = 0
        this.transitionExecuted = false
        this.scaleform.destroy()
        delete this.scaleform
    }

    public async showMissionPassedMessage(message: string, duration = 5000, manualDispose = false) {
        await this.drawCustomScaleformFunction(manualDispose, duration, "SHOW_MISSION_PASSED_MESSAGE", message, "", 100, true, 0, true)
    }

    public async showColoredShard(message: string, description: string, textColor: Color, bgColor: Color, duration = 5000, manualDispose = false) {
        await this.drawCustomScaleformFunction(manualDispose, duration, "SHOW_SHARD_CENTERED_MP_MESSAGE", message, description, bgColor, textColor)
    }

    public async showSimpleShard(message: string, subtitle: string, duration = 5000, manualDispose = false) {
        await this.drawCustomScaleformFunction(manualDispose, duration, "SHOW_SHARD_CREW_RANKUP_MP_MESSAGE", message, subtitle)
    }



    private async drawCustomScaleformFunction(manualDispose: boolean, duration: number, funcName: string, ...args: any[]) {
        await this.load()
        this.start = GetGameTimer()
        this.manualDispose = manualDispose
        this.scaleform?.callFunction(funcName, false, ...args)
        this.duration = duration
    }
}