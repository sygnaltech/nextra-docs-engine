import { ReactNode } from 'react';
type CalloutType = 'default' | 'info' | 'tip' | 'success' | 'warning' | 'error' | 'important';
interface CalloutProps {
    type?: CalloutType;
    emoji?: string | ReactNode;
    children: ReactNode;
}
export declare function Callout({ type, emoji, children }: CalloutProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Callout.d.ts.map