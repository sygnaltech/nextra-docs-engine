'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Collapse, Select, Button } from 'nextra/components';
export function ButtonDemo() {
    return (_jsxs("div", { style: { display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }, children: [_jsx(Button, { onClick: () => alert('clicked'), children: "Default button" }), _jsx(Button, { variant: "outline", onClick: () => alert('clicked'), children: "Outline button" })] }));
}
export function CollapseDemo() {
    const [isOpen, setIsOpen] = useState(false);
    return (_jsxs("div", { children: [_jsx(Button, { variant: "outline", onClick: () => setIsOpen(o => !o), children: isOpen ? 'Hide details' : 'Show details' }), _jsx(Collapse, { isOpen: isOpen, children: _jsxs("div", { style: { paddingTop: '1rem' }, children: [_jsx("p", { children: "This content is revealed when the trigger is clicked. The Collapse component animates height and opacity." }), _jsxs("ul", { children: [_jsx("li", { children: "Use it for optional / supplementary detail." }), _jsxs("li", { children: ["Use ", _jsx("code", { children: "<details>" }), " for SEO-indexable accordions."] })] })] }) })] }));
}
export function SelectDemo() {
    const options = [
        { id: 'system', name: 'System' },
        { id: 'light', name: 'Light' },
        { id: 'dark', name: 'Dark' }
    ];
    const [value, setValue] = useState('system');
    const selected = options.find(o => o.id === value);
    return (_jsx(Select, { value: value, onChange: setValue, options: options, title: "Theme", selectedOption: _jsxs("span", { children: ["Theme: ", selected?.name] }) }));
}
//# sourceMappingURL=styleguide-demos.js.map