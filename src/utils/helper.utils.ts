import { injectable } from "inversify";
const Types = require('mongoose').Types;

@injectable()
export default class Helper {

    constructor() { }

    public IsNull(e: any): Boolean {
        if (e === undefined || e === null) return true;
        return false;
    }

    public IsNullValue(e: any): Boolean {
        if (e === undefined || e === null || e === "" || e === "undefined") return true;
        return false;
    }

    public ChangeToExactDecimal(v: any): void {
        if (v !== null && typeof v === "object") {
            Object.entries(v).forEach(([key, value]) => {
                if (v[key] && v[key].constructor.name === "Decimal128") {
                    if (!this.IsNullValue(v[key])) {
                        v[key] = parseFloat(v[key]);
                    }
                }
            });
        }
    };

    public IsArrayNull(e: any): Boolean {
        if (this.IsNull(e)) return true;
        if (e.length > 0) {
            return false;
        }
        return true;
    };

    public SetToJSON(v: any): void {
        if (!this.IsNullValue(v)) {
            v.set("toJSON", {
                getters: true,
                transform: (_, ret: any) => {
                    this.ChangeToExactDecimal(ret);
                    delete ret.__v;
                    delete ret.id;
                    return ret;
                },
            });
        }
    };

    public GetItemFromArray(arr: any, pos: number, defa: any): any {
        if (!this.IsArrayNull(arr)) {
            return pos > -1 ? arr[pos] : arr;
        }
        return defa;
    };

    public CloneObject(x: any): any {
        if (!this.IsNullValue(x)) {
            return JSON.parse(JSON.stringify(x));
        }
        return null;
    }

    public ObjectId(id: any): any {
        return new Types.ObjectId(id);
    };
}
