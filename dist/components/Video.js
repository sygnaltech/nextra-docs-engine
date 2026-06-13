import { jsx as _jsx } from "react/jsx-runtime";
const videoStyle = {
    width: '100%',
    height: 'auto',
    borderRadius: 6,
    margin: '1.5rem 0',
    background: '#000'
};
export function Video({ src, poster, controls = true, preload = 'metadata', playsInline = true, style, ...rest }) {
    const sources = Array.isArray(src) ? src : [{ src }];
    return (_jsx("video", { controls: controls, preload: preload, playsInline: playsInline, poster: poster, style: { ...videoStyle, ...style }, ...rest, children: sources.map((s, i) => (_jsx("source", { src: s.src, type: s.type }, i))) }));
}
//# sourceMappingURL=Video.js.map