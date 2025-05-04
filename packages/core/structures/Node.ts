export class Node {
    private _id: string;
    private _x: number;
    private _y: number;

    public constructor(id: string, x: number, y: number) {
        this._id = id;
        this._x = x;
        this._y = y;
    }

    public get id() {
        return this._id;
    }

    public get coordX() {
        return this._x;
    }

    public get coordY() {
        return this._y;
    }
}