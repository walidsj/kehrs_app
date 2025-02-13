import { Button } from '@/components/ui/button'
import { CardDescription, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NextSeo } from 'next-seo'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import favicon from '@/assets/favicon.png'
import { Checkbox } from '@/components/ui/checkbox'
import { PasswordInput } from '@/components/ui/password-input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { api } from '@/utils/api'

const formSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
  remember: z.coerce.boolean(),
})

export function LoginPage() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues: {
      username: '',
      password: '',
      remember: false,
    },
  })

  const login = api.auth.login.useMutation({
    onSuccess: () => {
      const { redirect } = router.query
      router.push(redirect ? redirect.toString() : '/dashboard')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    login.mutate(values)
  }

  return (
    <div className="flex min-h-svh items-center justify-center">
      <NextSeo title="Login" />
      <div className="w-full max-w-sm space-y-6 p-6">
        <Image src={favicon.src} alt="Logo" width={50} height={50} className="size-10" />
        <div className="space-y-2">
          <CardTitle>Login</CardTitle>
          <CardDescription>Silakan login untuk mengakses fitur aplikasi</CardDescription>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remember"
              render={({ field }) => (
                <FormItem>
                  <div className="space-x-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel>Ingat Saya</FormLabel>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="inline-flex space-x-2">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
