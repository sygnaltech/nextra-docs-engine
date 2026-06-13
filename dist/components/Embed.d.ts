interface EmbedProps {
    /** Any URL — known providers render as a rich embed, unknown URLs render as a link card. */
    url: string;
    /** Optional accessible title for the iframe / link. */
    title?: string;
    /** Override aspect ratio for video providers. Defaults to 16:9. */
    aspectRatio?: [number, number];
}
export declare function Embed({ url, title, aspectRatio }: EmbedProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=Embed.d.ts.map