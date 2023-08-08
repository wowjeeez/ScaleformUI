import {Vector3} from "../math/vector3";

export class ScaleformLabel {
    constructor(public readonly label: string) {}
}

export class ScaleformLiteral {
    constructor(public readonly literal: string) {}
}
export class Scaleform {
    private deleted = false
    private constructor(private readonly name: string, readonly handle: number) {}

    public static request(name: string) {
        return new Scaleform(name, RequestScaleformMovie(name))
    }

    public static requestWideScreen(name: string) {
        return new Scaleform(name, RequestScaleformMovieInstance(name))
    }

    public callFunction(funcName: string, returnData: boolean,...args: (number | boolean | string | ScaleformLiteral | ScaleformLabel)[]) {
        BeginScaleformMovieMethod(this.handle, funcName)
        this.processScaleformArgs(funcName, args)
        if (returnData) {
            return EndScaleformMovieMethodReturnValue()
        } else {
            EndScaleformMovieMethod()
        }
    }

    /**
     * Render the scaleform in fullscreen
     */
    public render2d() {
        DrawScaleformMovieFullscreen(this.handle, 255, 255, 255, 255, 0)
    }

    /**
     * Render the scaleform in a specific rectangle
     * @param x
     * @param y
     * @param width
     * @param height
     */
    public render2dNormal(x: number, y: number, width: number, height: number) {
        DrawScaleformMovie(this.handle, x, y, width, height, 255, 255, 255, 255, 0)
    }

    /**
     * Render the scaleform in a rectangle with screen space coordinates
     * @param localX
     * @param localY
     * @param sizeX
     * @param sizeY
     */
    public render2dScreenSpace(localX: number, localY: number, sizeX: number, sizeY: number) {
        const [w, h] = GetScreenResolution()
        const x = localY / w
        const y = localX / h
        const width = sizeX / w
        const height = sizeY / h
        DrawScaleformMovie(this.handle, x + (width / 2.0), y + (height / 2.0), width, height, 255, 255, 255, 255, 0)
    }

    /**
     * Render the scaleform in 3d
     * @param coords `Vector3`
     * @param rot `Vector3`
     * @param scale `Vector3`
     */
    public render3d(coords: Vector3, rot: Vector3, scale: Vector3) {
        DrawScaleformMovie_3dSolid(this.handle, ...coords.toArr(), ...rot.toArr(), 2.0, 2.0, 1.0, ...scale.toArr(), 2)
    }

    /**
     * Render the scaleform in 3D space with additive blending
     * @param coords `Vector3`
     * @param rot `Vector3`
     * @param scale `Vector3`
     */
    public render3dAdditive(coords: Vector3, rot: Vector3, scale: Vector3) {
        DrawScaleformMovie_3d(this.handle, ...coords.toArr(), ...rot.toArr(), 2.0, 2.0, 1.0, ...scale.toArr(), 2)
    }

    /**
     * Destroy the scaleform
     */
    public destroy() {
        SetScaleformMovieAsNoLongerNeeded(this.handle)
        this.deleted = true
    }

    public isValid() {
        return !this.deleted
    }

    public hasLoaded() {
        return !!HasScaleformMovieLoaded(this.handle)
    }


    private processScaleformArgs(fname: string, args: (number | boolean | string | ScaleformLiteral | ScaleformLabel)[]) {
        for (const [argIndex, arg] of args.entries()) {
            if (typeof arg === "boolean") {
                ScaleformMovieMethodAddParamBool(arg)
            } else if (typeof arg === "number") {
                if (Number.isInteger(arg)) {
                    ScaleformMovieMethodAddParamInt(arg)
                } else {
                    ScaleformMovieMethodAddParamFloat(arg)
                }
            } else if (typeof arg === "string") {
                this.addStringArg(arg)
            } else if (arg instanceof ScaleformLiteral) {
                ScaleformMovieMethodAddParamTextureNameString_2(arg.literal)
            } else if (arg instanceof  ScaleformLabel) {
                BeginTextCommandScaleformString(arg.label)
                EndTextCommandScaleformString()
            } else {
                throw new Error(`Received invalid argument: ${arg} at position #${argIndex} while calling scaleform function: ${fname}`)
            }
        }
    }

    private addStringArg(arg: string) {
        if (["menu_", "menu_lobby_desc_{", "PauseMenu_", "menu_pause_playerTab{"].some(prefix => arg.startsWith(prefix))) {
            BeginTextCommandScaleformString(arg)
            EndTextCommandScaleformString_2()
        } else {
            ScaleformMovieMethodAddParamTextureNameString(arg)
        }
    }
}