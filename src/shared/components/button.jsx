// src/shared/components/Button.jsx
import './Button.css'

const Button = ({
  className = '',
  variant = 'default',
  size = 'default',
  children,
  render,
  ...props
}) => {
  const variantClass = `button-${variant}`
  const sizeClass = `button-${size}`
  
  const buttonContent = (
    <button
      className={`button ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  )

  // Si hay un render prop, envolvemos el botón con el Link
  if (render) {
    return render(buttonContent)
  }

  return buttonContent
}

export default Button