interface YouTubeProps {
    /** Video ID — the `v=` query param, or the path segment in youtu.be/<id> URLs. */
    id: string;
    /** Optional accessible title for the iframe. */
    title?: string;
    /** Start playback at this many seconds. */
    start?: number;
    /** Width:height ratio. Defaults to 16/9. Pass a tuple like [4, 3] to override. */
    aspectRatio?: [number, number];
}
export declare function YouTube({ id, title, start, aspectRatio }: YouTubeProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=YouTube.d.ts.map