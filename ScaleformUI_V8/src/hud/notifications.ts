import {NotificationCharacters, NotificationColors, NotificationIcon, NotificationType} from "../elements/notification";
import {NumericRange, Range} from "../helpers/ranged-type";

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
     * @param blink Should it blink (default: `false`)
     * @param showInBrief Should it be saved to the brief (default: `false`)
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
     * @param blink Should it blink (default: `false`)
     * @param showInBrief Should it be saved to the brief (default: `false`)
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
        T extends boolean = false>(text: string, duration?: D, immutableText?: T) {
        AddTextEntry("ScaleformUIHelpText", text)
        if (duration) {
            BeginTextCommandDisplayHelp("ScaleformUIHelpText")
            EndTextCommandDisplayHelp(0, false, true, duration > 5000 ? 5000 : duration)
        } else {
            if (immutableText) {
                return () => DisplayHelpTextThisFrame("ScaleformUIHelpText", false)
            } else {
                return DisplayHelpTextThisFrame("ScaleformUIHelpText", false)
            }
        }
    }


}