export default function FormInput({ 
  label, 
  name, 
  type = "text", 
  value, 
  onChange, 
  required = false, 
  placeholder, 
  min, 
  max, 
  step,
  suffix,
  rows
}) {
  const labelStyle = { 
    display: "block", 
    fontSize: 11, 
    fontWeight: 700, 
    color: "#5A6B7D", 
    textTransform: "uppercase", 
    letterSpacing: "0.07em", 
    marginBottom: 8 
  };

  const inputStyle = { 
    width: "100%", 
    padding: suffix ? "11px 40px 11px 14px" : "11px 14px", 
    borderRadius: 8, 
    border: "1.5px solid #E8EDF2", 
    fontSize: 14, 
    boxSizing: "border-box", 
    outline: "none", 
    background: "#FAFDFD", 
    color: "#002B54", 
    transition: "all 0.2s ease" 
  };

  const Component = type === "textarea" ? "textarea" : "input";

  return (
    <div>
      <label style={labelStyle}>{label} {required && "*"}</label>
      <div style={{ position: "relative" }}>
        <Component
          type={type === "textarea" ? undefined : type}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          rows={rows}
          style={type === "textarea" ? { ...inputStyle, resize: "vertical", lineHeight: 1.6 } : inputStyle}
          onFocus={e => e.target.style.borderColor = "#FF9500"}
          onBlur={e => e.target.style.borderColor = "#E8EDF2"}
        />
        {suffix && (
          <span style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", fontSize: 13, fontWeight: 700, color: "#FF9500" }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}