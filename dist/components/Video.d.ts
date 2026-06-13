import type { VideoHTMLAttributes } from 'react';
interface VideoProps extends Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> {
    /** Single source URL, or an array of sources with MIME types for multi-format fallback. */
    src: string | {
        src: string;
        type?: string;
    }[];
    /** Poster image shown before playback. */
    poster?: string;
}
export declare function Video({ src, poster, controls, preload, playsInline, style, ...rest }: VideoProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Video.d.ts.map