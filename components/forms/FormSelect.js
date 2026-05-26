"use client";
import { useState } from "react";

export default function FormSelect({ label, value, onChange, options, placeholder, required = false }) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o === value);

  const labelStyle = { 
    display: "block", 
    fontSize: 11, 
    fontWeight: 700, 
    color: "#5A6B7D", 
    textTransform: "uppercase", 
    letterSpacing: "0.07em", 
    marginBottom: 8 
  };

  return (
    <div>
      <label style={labelStyle}>{label} {required && "*"}</label>
      <div style={{ position: "relative" }}>
        <button 
          type="button" 
          onClick={() => setOpen(!open)}
          style={{ 
            width: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            padding: "11px 14px", 
            borderRadius: 8, 
            border: `1.5px solid ${open ? "#FF9500" : "#E8EDF2"}`, 
            background: "#FAFDFD", 
            fontSize: 14, 
            color: selected ? "#002B54" : "#9CA3AF", 
            cursor: "pointer", 
            outline: "none", 
            transition: "all 0.2s ease", 
            textAlign: "left" 
          }}
        >
          <span>{selected || placeholder}</span>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#9CA3AF" 
            strokeWidth="2.5"
            style={{ 
              transform: open ? "rotate(180deg)" : "rotate(0deg)", 
              transition: "all 0.2s ease", 
              flexShrink: 0 
            }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>

        {open && (
          <>
            <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
            <div style={{ 
              position: "absolute", 
              top: "calc(100% + 6px)", 
              left: 0, 
              right: 0, 
              zIndex: 20, 
              background: "#FFFFFF", 
              borderRadius: 12, 
              border: "1px solid #E8EDF2", 
              boxShadow: "0 10px 15px -3px rgba(0,43,84,0.12)", 
              overflow: "hidden", 
              maxHeight: 260, 
              overflowY: "auto" 
            }}>
              {options.map(o => (
                <button 
                  key={o} 
                  type="button" 
                  onClick={() => { onChange(o); setOpen(false); }}
                  style={{ 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "space-between", 
                    width: "100%", 
                    padding: "10px 14px", 
                    textAlign: "left", 
                    fontSize: 13, 
                    color: value === o ? "#002B54" : "#5A6B7D", 
                    fontWeight: value === o ? 600 : 400, 
                    background: value === o ? "#FAFDFD" : "transparent", 
                    border: "none", 
                    cursor: "pointer", 
                    borderBottom: "1px solid #F0F3F7" 
                  }}
                >
                  <span>{o}</span>
                  {value === o && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}