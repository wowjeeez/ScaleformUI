export abstract class Menu {
    private accessor visible: boolean = false
    public instructionalButtons: any[] = [] //TODO! type this

    protected abstract processMouse(): void
    protected abstract draw(): void

    public setVisible(state: boolean) {
        this.visible = state
        return this
    }

}