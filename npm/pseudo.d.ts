export declare const agentOrientation: () => string;
export declare const compilationFlowChart: () => Generator<string, string, boolean>;
export type Fuzzy<S extends string> = S | any;
export declare const fuzzy: (...args: [quality: number, description: string] | [description: string]) => any;
export declare const type: unknown;
export declare const node: <O, I>(inp: {
    guid: string;
    overview?: string;
    exterior: O;
    interior: (inp: O) => I;
}) => {
    guid: string;
    overview?: string;
    exterior: O;
    interior: (inp: O) => I;
    invoke: (inp: O) => I;
    toString: () => string;
};
export declare const entry: (inp: {
    guid: string;
}) => {
    guid: string;
};
//# sourceMappingURL=pseudo.d.ts.map