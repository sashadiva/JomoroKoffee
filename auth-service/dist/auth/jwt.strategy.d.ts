declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: {
        id: number;
        role: string;
    }): {
        userId: number;
        role: string;
    };
}
export {};
