import {NotificationCharacters, NotificationColors, NotificationIcon, NotificationType} from "../elements/notification";
import {Vector3} from "../math/vector3";
import {Rgba} from "../math/rgba";
import {loadPedHeadshot, waitUntilReturns} from "../helpers/loaders";
import {noop} from "@babel/types";

export class Notification {
    public static Type = NotificationType
    public static NotificationIcon = NotificationIcon
    public static IconChars = NotificationCharacters
    public static Colors = NotificationColors

    private constructor(private readonly handle: number) {}

    /**
     * Hides this notification instantly.
     */
    public hide() {
        ThefeedRemoveItem(this.handle)
    }

    /**
     * Shows a simple notification
     * @param message Text
     * @param blink Should it blink (defaults to `false`)
     * @param showInBrief Should it be saved to the brief (defaults to `false`)
     */
    public static showNotification(message: string, blink = false, showInBrief = false) {
        AddTextEntry("ScaleformUINotification", message)
        BeginTextCommandThefeedPost("ScaleformUINotification")
        return new Notification(EndTextCommandThefeedPostTicker(blink, showInBrief))
    }

    /**
     * Shows a simple notification, but with a color!
     * @param message Text
     * @param color The color (`NotificationColors` enum)
     * @param blink Should it blink (defaults to `false`)
     * @param showInBrief Should it be saved to the brief (defaults to `false`)
     */
    public static showNotificationWithColor(message: string, color: NotificationColors, blink = false, showInBrief = false) {
        AddTextEntry("ScaleformUINotification", message)
        BeginTextCommandThefeedPost("ScaleformUINotification")
        ThefeedSetNextPostBackgroundColor(color)
        return new Notification(EndTextCommandThefeedPostTicker(blink, showInBrief))
    }

    /**
     * Shows a help notification for a set duration or custom draw it
     *
     * @param text The help text
     * @param duration The duration of the help text, in miliseconds. 5000 is the max. If you omit this, you will have to take care of showing the notification.
     * @param immutableText If set to `true`, you will get an optimized function back that will draw the help text while called. Its more optimized than calling `showHelpNotification()` in a loop, but you will not be able to change the help text. (default: `false`)
     */
    public static showHelpNotification<D extends number | undefined,
        T extends boolean = false>(text: string, duration?: D, immutableText?: T): D extends number ? T extends true ? () => void : void : void {
        AddTextEntry("ScaleformUIHelpText", text)
        if (duration) {
            BeginTextCommandDisplayHelp("ScaleformUIHelpText")
            EndTextCommandDisplayHelp(0, false, true, duration > 5000 ? 5000 : duration)
        } else {
            if (immutableText) {
                return (() => DisplayHelpTextThisFrame("ScaleformUIHelpText", false)) as D extends number ? T extends true ? () => void : void  : void
            }
            return DisplayHelpTextThisFrame("ScaleformUIHelpText", false) as D extends number ? T extends true ? () => void : void  : void
        }
        return undefined as D extends number ? T extends true ? () => void : void  : void //shut ts up
    }

    /**
     * Shows a floating help text notification.
     * @param text The help text
     * @param coords The coordinates provided as a `Vector3` class
     */
    public static showFloatingHelpNotification(text: string, coords: Vector3) {
        AddTextEntry("ScaleformUIFloatingHelpText", text)
        SetFloatingHelpTextWorldPosition(1, ...coords.toArr())
        SetFloatingHelpTextStyle(1, 1, 2, -1, 3, 0)
        BeginTextCommandDisplayHelp("ScaleformUIFloatingHelpText")
        EndTextCommandDisplayHelp(2, false, false, -1)
    }

    /**
     * Shows an advanced notification
     * @param title The title
     * @param subtitle The subtitle
     * @param text The body
     * @param characterIcon `NotificationCharacters` The character icon
     * @param notificationIcon `NotificationIcon` The notification icon (defaults to `ChatBox`)
     * @param notificationType `NotificationType` The notification type
     * @param backgroundColor `NotificationColors` The background color
     * @param flashColor `Rgba` The color of the flash (optional)
     * @param blink Whether it should blink (defaults to `false`)
     * @param sound Whether it should play sound (defaults to `false`)
     */
    public static showAdvancedNotification(
        title: string,
        subtitle: string,
        text: string,
        characterIcon = NotificationCharacters.Default,
        notificationIcon = NotificationIcon.ChatBox,
        notificationType = NotificationType.Default,
        backgroundColor = NotificationColors.Default,
        flashColor?: Rgba,
        blink: boolean = false,
        sound: boolean = false) {

        AddTextEntry("ScaleformUIAdvancedNotification", text)
        BeginTextCommandThefeedPost("ScaleformUIAdvancedNotification")
        AddTextComponentSubstringPlayerName(text)
        if (backgroundColor !== NotificationColors.Default) {
            ThefeedSetNextPostBackgroundColor(backgroundColor)
        }
        if (flashColor && !blink) {
            ThefeedSetAnimpostfxColor(flashColor.r, flashColor.g, flashColor.b, flashColor.a)
        }
        if (sound) {
            PlaySoundFrontend(-1, "DELETE", "HUD_DEATHMATCH_SOUNDSET", true)
        }
        return new Notification(EndTextCommandThefeedPostMessagetext(characterIcon, characterIcon, true, notificationType, title, subtitle))
    }

    /**
     * TODO! Investigate if newProgress should be a boolean or a number for EndTextCommandThefeedPostStats
     * Shows a stat notification
     * @param newProgress The new progress
     * @param oldProgress The old progress
     * @param title The title
     * @param blink Whether it should blink (defaults to `false`)
     * @param showInBrief Whether it should be saved in the brief (defaults to `false`)
     */
    public static async showStatNotification(newProgress: number, oldProgress: number, title: string, blink = false, showInBrief = false) {
        AddTextEntry("ScaleformUIStatsNotification", title)
        const handle = await loadPedHeadshot(PlayerPedId())
        const txd = GetPedheadshotTxdString(handle)
        BeginTextCommandThefeedPost("PS_UPDATE")
        AddTextComponentInteger(newProgress)
        //casted to boolean for now until we investigate
        EndTextCommandThefeedPostStats("ScaleformUIStatsNotification", 2, newProgress as unknown as boolean, oldProgress, false, txd, txd)
        const noti = new Notification(EndTextCommandThefeedPostTicker(blink, showInBrief))
        UnregisterPedheadshot(handle)
        return noti
    }


    public static showVersusNotification() {

    }



}