import { IRolloverModifierOptions, RolloverModifier, ModifierMouseArgs, EExecuteOn } from 'scichart';

export enum EExecuteWhen {
    Always = 'Always',
    Shift = 'Shift',
    Alt = 'Alt',
    Ctrl = 'Ctrl',
    Meta = 'Meta',
}

export enum EShowTooltipOptions {
    /*
     * Show tooltips when mouse is over a point
     */
    MouseOver = 'MouseOver',

    /*
     * Show tooltips when mouse hovers over the surface
     */
    MouseHover = 'MouseHover',

    /*
     * Always show tooltips
     */
    Always = 'Always',

    /*
     * Show tooltips when mouse left button is pressed
     */
    MouseLeftButtonDown = 'MouseLeftButtonDown',

    /*
     * Show tooltips when mouse right button is pressed
     */
    MouseRightButtonDown = 'MouseRightButtonDown',

    /*
     * Show tooltips when mouse middle button is pressed
     */
    MouseMiddleButtonDown = 'MouseMiddleButtonDown',

    /*
     * Show tooltips when left mouse button is double clicked
     */
    MouseDoubleClick = 'MouseDoubleClick',
}

export interface ICustomRolloverOptions extends IRolloverModifierOptions {
    showTooltipOn?: EShowTooltipOptions;
    executeWhen?: EExecuteWhen;
}

const debounce = (func: any, timeout = 1000) => {
    let timer: NodeJS.Timeout;
    return (...args: any) => {
        clearTimeout(timer);
        timer = setTimeout(() => func(...args), timeout);
    };
};

export class CustomRolloverModifier extends RolloverModifier {
    // additional custom flag to check if required event was triggered
    protected enableTooltipProperty = false;
    protected showTooltipOnProperty = EShowTooltipOptions.Always;
    protected executeWhenProperty = EExecuteWhen.Always;

    protected delayedHandler = debounce((args: ModifierMouseArgs) => {
        this.enableTooltip = true;
        super.modifierMouseMove(args);
    }, 1000);

    constructor(options?: ICustomRolloverOptions) {
        super(options);

        this.executeWhenProperty = options?.executeWhen ?? this.executeWhenProperty;
        this.showTooltipOnProperty = options?.showTooltipOn ?? this.showTooltipOnProperty;
        // setting some hitTestRadius will limit the HitTest to DataPoint
        this.hitTestRadius = this.showTooltipOn === EShowTooltipOptions.MouseOver ? this.hitTestRadius || 10 : 0;
        this.enableTooltipProperty =
            this.showTooltipOn === EShowTooltipOptions.Always || this.showTooltipOn === EShowTooltipOptions.MouseOver;
    }

    // override showTooltip get accessor to check both the original flag and the custom one;
    public get showTooltip() {
        // type error caused by access modifier; will be fixed in next lib versions
        // @ts-ignore
        return this.showTooltipProperty && this.enableTooltip;
    }

    public get showTooltipOn() {
        return this.showTooltipOnProperty;
    }

    public set showTooltipOn(value: EShowTooltipOptions) {
        if (value !== this.showTooltipOnProperty) {
            this.showTooltipOnProperty = value;
            this.enableTooltipProperty =
                value === EShowTooltipOptions.Always || value === EShowTooltipOptions.MouseOver;

            if (value === EShowTooltipOptions.MouseOver) {
                // setting some hitTestRadius will limit the HitTest to DataPoint
                this.hitTestRadius = 10;
            } else {
                this.hitTestRadius = 0;
            }
            // calls update
            this.onParentSurfaceRendered();
        }
    }

    public get executeWhen() {
        return this.executeWhenProperty;
    }

    public set executeWhen(value: EExecuteWhen) {
        if (value !== this.executeWhenProperty) {
            if (value !== EExecuteWhen.Always) {
                this.enableTooltip = false;
            }

            this.executeWhenProperty = value;
            this.onParentSurfaceRendered();
        }
    }

    public get enableTooltip() {
        return this.enableTooltipProperty;
    }

    public set enableTooltip(value: boolean) {
        if (value != this.enableTooltipProperty) {
            this.enableTooltipProperty = value;
            this.onParentSurfaceRendered();
        }
    }

    public modifierMouseMove(args: ModifierMouseArgs): void {
        if (this.showTooltipOn === EShowTooltipOptions.MouseHover) {
            this.enableTooltip = false;
            this.delayedHandler(args);
        }

        if (this.showTooltipOn === EShowTooltipOptions.MouseDoubleClick) {
            this.enableTooltip = false;
        }

        if (this.showTooltipOn === EShowTooltipOptions.Always) {
            this.enableTooltip = this.isAllowedKeyModifierValue(args);
        }

        super.modifierMouseMove(args);
    }

    public modifierMouseDown(args: ModifierMouseArgs): void {
        // preventing unwanted browser behavior, e.g. dragging of selected HTML content
        args.nativeEvent.preventDefault();

        const mouseDownOptions = [
            EShowTooltipOptions.MouseLeftButtonDown,
            EShowTooltipOptions.MouseRightButtonDown,
            EShowTooltipOptions.MouseMiddleButtonDown,
        ];

        if (mouseDownOptions.includes(this.showTooltipOnProperty)) {
            switch (this.showTooltipOnProperty) {
                case EShowTooltipOptions.MouseLeftButtonDown:
                    this.executeOn = EExecuteOn.MouseLeftButton;
                    break;
                case EShowTooltipOptions.MouseRightButtonDown:
                    this.executeOn = EExecuteOn.MouseRightButton;
                    break;
                case EShowTooltipOptions.MouseMiddleButtonDown:
                    this.executeOn = EExecuteOn.MouseMiddleButton;
                    break;
            }

            this.enableTooltip = args.button === this.executeOn && this.isAllowedKeyModifierValue(args);
        }

        super.modifierMouseDown(args);
    }

    public modifierMouseUp(args: ModifierMouseArgs): void {
        const mouseDownOptions = [
            EShowTooltipOptions.MouseLeftButtonDown,
            EShowTooltipOptions.MouseRightButtonDown,
            EShowTooltipOptions.MouseMiddleButtonDown,
        ];

        if (mouseDownOptions.includes(this.showTooltipOnProperty)) {
            this.enableTooltip = false;
        }

        super.modifierMouseUp(args);
    }

    public modifierMouseLeave(args: ModifierMouseArgs): void {
        const optionsWithPositionDependency = [
            EShowTooltipOptions.MouseLeftButtonDown,
            EShowTooltipOptions.MouseRightButtonDown,
            EShowTooltipOptions.MouseMiddleButtonDown,
            EShowTooltipOptions.MouseDoubleClick,
            EShowTooltipOptions.MouseOver,
            EShowTooltipOptions.MouseHover,
        ];

        if (optionsWithPositionDependency.includes(this.showTooltipOn)) {
            this.enableTooltip = false;
        }

        super.modifierMouseLeave(args);
    }

    public modifierPointerCancel(args: ModifierMouseArgs): void {
        this.modifierMouseLeave(args);
    }

    public modifierDoubleClick(args: ModifierMouseArgs): void {
        if (this.showTooltipOn === EShowTooltipOptions.MouseDoubleClick && this.isAllowedKeyModifierValue(args)) {
            this.enableTooltip = true;
            this.onParentSurfaceRendered();
        }
        super.modifierDoubleClick(args);
    }

    protected isAllowedKeyModifierValue(args: ModifierMouseArgs): boolean {
        const handleInvalidExecuteWhenValue = (value: never): never => {
            throw new Error(`Invalid EExecuteValue: "${value}"!`);
        };

        switch (this.executeWhen) {
            case EExecuteWhen.Alt:
                return args.altKey;

            case EExecuteWhen.Ctrl:
                return args.ctrlKey;

            case EExecuteWhen.Shift:
                return args.shiftKey;

            case EExecuteWhen.Meta: {
                return args.nativeEvent.metaKey;
            }

            case EExecuteWhen.Always:
                return true;

            default:
                return handleInvalidExecuteWhenValue(this.executeWhen);
        }
    }
}
