'use client'

import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import type { TextFieldClientComponent } from 'payload'
import React from 'react'
import { HexColorInput, HexColorPicker } from 'react-colorful'

const HEX = /^#[0-9a-f]{6}$/i

const boxStyle: React.CSSProperties = {
  height: 36,
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: 4,
}

export const ColorPickerField: TextFieldClientComponent = ({ field, path }) => {
  const { value, setValue, showError, errorMessage } = useField<string>({ path })
  const hasColor = Boolean(value && HEX.test(value))
  const label = typeof field.label === 'string' ? field.label : 'Color'

  return (
    <div className="field-type text" style={{ marginBottom: 'var(--base)' }}>
      <FieldLabel label={field.label} path={path} required={field.required} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 260 }}>
        <HexColorPicker
          aria-label={`${label} picker`}
          color={hasColor ? value : '#000000'}
          onChange={setValue}
          style={{ width: '100%', height: 160 }}
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span
            aria-hidden
            style={{
              ...boxStyle,
              width: 36,
              flexShrink: 0,
              background: hasColor
                ? value
                : 'repeating-conic-gradient(#ccc 0 25%, #fff 0 50%) 0 0 / 10px 10px',
            }}
          />
          <HexColorInput
            prefixed
            aria-label={`${label} hex`}
            placeholder="#1e3a5f"
            color={value || ''}
            onChange={(hex) => setValue(hex.length === 4 ? hex.replace(/[0-9a-f]/gi, '$&$&') : hex)}
            style={{
              ...boxStyle,
              flex: 1,
              minWidth: 0,
              padding: '0 10px',
              background: 'var(--theme-input-bg)',
              color: 'var(--theme-text)',
              fontFamily: 'monospace',
            }}
          />
          {value && (
            <button
              type="button"
              onClick={() => setValue(null)}
              style={{
                ...boxStyle,
                padding: '0 10px',
                background: 'transparent',
                color: 'var(--theme-text)',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>
      <FieldError path={path} message={errorMessage} showError={showError} />
      <FieldDescription path={path} description={field.admin?.description} />
    </div>
  )
}
