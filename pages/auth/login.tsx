import { useState } from 'react'
import axios from 'axios'
import { z } from 'zod'

const validation = z.object({
    username: z.string().min(1, { message: `Username is required` }),
    password: z.string().min(1, { message: `Password is required` })
})

const AuthLogin: React.FC = () => {
    const [submit, setSubmit] = useState<boolean>(false)

    const [message, setMessage] = useState('')
    const [validationMessage, setValidationMessage] = useState<{ [key: string]: string}>({})

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const validateLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setMessage('')
        setValidationMessage({})

        try {
            validation.parse({ username, password })

            handleLogin()
        } catch (error) {
            if(error instanceof z.ZodError) {
                const errorMap: { [key: string]: string } = {}
                error.errors.forEach((err) => {
                    if (err.path) {
                        errorMap[err.path[0]] = err.message
                    }
                })
                setValidationMessage(errorMap)
            } else {
                console.error(`Unknown error`)
            }
        }
    }

    const handleLogin = async () => {
        setSubmit(true)
        try {
            const { data } = await axios.post('/api/auth/login', {
                username,
                password,
            })

            setMessage(data.message)
        } catch (error: any) {
            if(error.response) {
                const fieldError = error.response.data.message
                setMessage(`Error: ${fieldError}`)
            } else {
                setMessage(`Unknown Error`)
            }
        }
        setSubmit(false)
    }

    return (
        <div className='w-full xl:flex xl:justify-center'>
            <div className='xl:w-1/2 p-4 sm:p-12.5 xl:p-17.5'>
                <h2 className="mb-9 text-2xl font-bold text-black">
                Masuk ke Akun
                </h2>

                { message && <p className={`${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'} text-white p-4 rounded-lg`}>{message}</p> }
                <form onSubmit={validateLogin}>
                    <div className="relative my-2">
                        <input
                            type='text'
                            placeholder='Username'
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={submit}
                            className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-blue-500 focus-visible:shadow-none bg-white disabled:cursor-not-allowed disabled:bg-gray-100'
                        />
                        { validationMessage.username && <p className='text-red-500'>{validationMessage.username}</p> }
                    </div>
                    <div className="relative my-2">
                        <input
                            type='password'
                            placeholder='Password'
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={submit}
                            className='w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-blue-500 focus-visible:shadow-none bg-white disabled:cursor-not-allowed disabled:bg-gray-100'
                        />
                        { validationMessage.password && <p className='text-red-500'>{validationMessage.password}</p> }
                    </div>
                    <div className="relative my-2">
                        <input
                            type='submit'
                            value={submit ? 'Loading...' : 'Login'}
                            disabled={submit}
                            className="w-full cursor-pointer rounded-lg border border-blue-500 bg-blue-500 p-4 text-white transition hover:bg-opacity-90 disabled:cursor-not-allowed"/>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AuthLogin