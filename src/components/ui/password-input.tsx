import { EyeOffIcon, EyeIcon } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import React from 'react'
import { cn } from '@/lib/utils'

const PasswordInput = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    return (
      <div className="relative">
        <Input ref={ref} {...props} className={cn('pr-10', className)} type={showPassword ? 'text' : 'password'} />
        <Button
          type="button"
          variant="link"
          size="icon"
          className="absolute right-0 top-0 h-full"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {!showPassword ? <EyeIcon /> : <EyeOffIcon />}
        </Button>
      </div>
    )
  },
)
PasswordInput.displayName = 'PasswordInput'

export { PasswordInput }
