import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { YouTube } from './YouTube.js';
const iframeWrap = {
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
const cardStyle = {
    display: 'block',
    padding: '1rem 1.25rem',
    margin: '1.5rem 0',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    textDecoration: 'none',
    color: 'inherit',
    background: 'transparent'
};
function ratioWrap(aspectRatio) {
    const [w, h] = aspectRatio;
    return { ...iframeWrap, paddingBottom: `${(h / w) * 100}%` };
}
function parseYouTubeId(url) {
    if (url.hostname === 'youtu.be')
        return url.pathname.slice(1) || null;
    if (/(^|\.)youtube\.com$/.test(url.hostname)) {
        if (url.pathname === '/watch')
            return url.searchParams.get('v');
        const m = url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/);
        if (m)
            return m[1];
    }
    return null;
}
function parseVimeoId(url) {
    if (!/(^|\.)vimeo\.com$/.test(url.hostname))
        return null;
    const m = url.pathname.match(/^\/(\d+)/);
    return m ? m[1] : null;
}
function parseLoomId(url) {
    if (!/(^|\.)loom\.com$/.test(url.hostname))
        return null;
    const m = url.pathname.match(/^\/share\/([a-z0-9]+)/i);
    return m ? m[1] : null;
}
function parseCodePen(url) {
    if (!/(^|\.)codepen\.io$/.test(url.hostname))
        return null;
    const m = url.pathname.match(/^\/([^/]+)\/(?:pen|details|full)\/([^/]+)/);
    return m ? { user: m[1], id: m[2] } : null;
}
function isFigmaUrl(url) {
    return /(^|\.)figma\.com$/.test(url.hostname) && /^\/(file|design|proto|board)\//.test(url.pathname);
}
export function Embed({ url, title, aspectRatio = [16, 9] }) {
    let parsed;
    try {
        parsed = new URL(url);
    }
    catch {
        return _jsx(LinkCard, { url: url, title: title });
    }
    const youtubeId = parseYouTubeId(parsed);
    if (youtubeId) {
        const startParam = parsed.searchParams.get('t') ?? parsed.searchParams.get('start');
        const start = startParam ? parseInt(startParam, 10) : undefined;
        return _jsx(YouTube, { id: youtubeId, title: title, start: Number.isFinite(start) ? start : undefined, aspectRatio: aspectRatio });
    }
    const vimeoId = parseVimeoId(parsed);
    if (vimeoId) {
        return (_jsx("div", { style: ratioWrap(aspectRatio), children: _jsx("iframe", { src: `https://player.vimeo.com/video/${vimeoId}`, title: title ?? 'Vimeo video', loading: "lazy", allow: "autoplay; fullscreen; picture-in-picture", allowFullScreen: true, style: iframeStyle }) }));
    }
    const loomId = parseLoomId(parsed);
    if (loomId) {
        return (_jsx("div", { style: ratioWrap(aspectRatio), children: _jsx("iframe", { src: `https://www.loom.com/embed/${loomId}`, title: title ?? 'Loom recording', loading: "lazy", allowFullScreen: true, style: iframeStyle }) }));
    }
    const pen = parseCodePen(parsed);
    if (pen) {
        return (_jsx("div", { style: { ...iframeWrap, paddingBottom: '60%' }, children: _jsx("iframe", { src: `https://codepen.io/${pen.user}/embed/${pen.id}?default-tab=result&theme-id=dark`, title: title ?? `CodePen by ${pen.user}`, loading: "lazy", allowFullScreen: true, style: iframeStyle }) }));
    }
    if (isFigmaUrl(parsed)) {
        return (_jsx("div", { style: ratioWrap(aspectRatio), children: _jsx("iframe", { src: `https://www.figma.com/embed?embed_host=docs&url=${encodeURIComponent(url)}`, title: title ?? 'Figma frame', loading: "lazy", allowFullScreen: true, style: iframeStyle }) }));
    }
    return _jsx(LinkCard, { url: url, title: title });
}
function LinkCard({ url, title }) {
    let host = url;
    try {
        host = new URL(url).hostname.replace(/^www\./, '');
    }
    catch {
        /* ignore */
    }
    return (_jsxs("a", { href: url, target: "_blank", rel: "noopener noreferrer", style: cardStyle, children: [_jsx("div", { style: { fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.6 }, children: host }), _jsx("div", { style: { marginTop: '0.25rem', fontWeight: 500 }, children: title ?? url })] }));
}
//# sourceMappingURL=Embed.js.map