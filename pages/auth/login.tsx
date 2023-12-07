import { useState } from 'react'
import axios from 'axios'

const AuthLogin: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleLogin = async () => {
        const { data } = await axios.post('/api/auth/login', {
            username,
            password,
        })
        console.log(data)
    }

    return (
        <div>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default AuthLogin