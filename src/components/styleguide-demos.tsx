'use client'

import { useState } from 'react'
import { Collapse, Select, Button } from 'nextra/components'

export function ButtonDemo() {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Button onClick={() => alert('clicked')}>Default button</Button>
      <Button variant="outline" onClick={() => alert('clicked')}>
        Outline button
      </Button>
    </div>
  )
}

export function CollapseDemo() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <Button variant="outline" onClick={() => setIsOpen(o => !o)}>
        {isOpen ? 'Hide details' : 'Show details'}
      </Button>
      <Collapse isOpen={isOpen}>
        <div style={{ paddingTop: '1rem' }}>
          <p>
            This content is revealed when the trigger is clicked. The Collapse
            component animates height and opacity.
          </p>
          <ul>
            <li>Use it for optional / supplementary detail.</li>
            <li>Use <code>&lt;details&gt;</code> for SEO-indexable accordions.</li>
          </ul>
        </div>
      </Collapse>
    </div>
  )
}

export function SelectDemo() {
  const options = [
    { id: 'system', name: 'System' },
    { id: 'light', name: 'Light' },
    { id: 'dark', name: 'Dark' }
  ]
  const [value, setValue] = useState('system')
  const selected = options.find(o => o.id === value)
  return (
    <Select
      value={value}
      onChange={setValue}
      options={options}
      title="Theme"
      selectedOption={<span>Theme: {selected?.name}</span>}
    />
  )
}
