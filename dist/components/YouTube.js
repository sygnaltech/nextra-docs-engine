import { jsx as _jsx } from "react/jsx-runtime";
const wrapperBase = {
    position: 'relative',
    height: 0,
    overflow: 'hidden',
    margin: '1.5rem 0',
    borderRadius: 6,
    background: '#000'
};
const iframeStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 0
};
export function YouTube({ id, title, start, aspectRatio = [16, 9] }) {
    const [w, h] = aspectRatio;
    const params = new URLSearchParams({ rel: '0' });
    if (start)
        params.set('start', String(start));
    const src = `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`;
    return (_jsx("div", { style: { ...wrapperBase, paddingBottom: `${(h / w) * 100}%` }, children: _jsx("iframe", { src: src, title: title ?? 'YouTube video', loading: "lazy", allow: "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture", allowFullScreen: true, style: iframeStyle }) }));
}
//# sourceMappingURL=YouTube.js.map