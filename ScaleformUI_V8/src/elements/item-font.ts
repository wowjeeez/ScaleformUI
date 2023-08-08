export class ItemFont {
    constructor(public readonly fotName: string, public readonly fontId = 0) {}

    public static registerFont(gfxName: string, fontName: string) {
        RegisterFontFile(gfxName)
        return new ItemFont(fontName, RegisterFontId(fontName))
    }
}