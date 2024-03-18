import { useForm } from "react-hook-form"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { CreateUserRequest } from "~/src/shared/types/ipc"

export function SignUp(){

    async function handleSignUp(userRequest: CreateUserRequest){
        window.api.signup(userRequest)
            .then((data)=>{
                if(data.status === 201){
                    toast.success("Usuário criado com sucesso!")
                    reset()
                }
            })
            .catch((error)=>{
                toast.error(error)
            })
    }

    const {register, handleSubmit, reset} = useForm<CreateUserRequest>()
    
    return (
        <div className='flex h-screen justify-center items-center'>
        <form className='max-w-md flex flex-col gap-4 text-white'
            onSubmit={handleSubmit(handleSignUp)}
         >
            <h1 className="
                text-xl
                font-bold
                text-center
                text-blue-500
                transition
                hover:text-blue-700
                cyberpunk-font-og
                cyber-glitch-0
            ">
            Cyber Net Cards
            </h1>
            <div className="cyber-input">

                <input 
                    type="text" placeholder='Username' className='w-full px-1 py-2 rounded border-none' 
                    {...register('username', {required: true})}
                />
            </div>
            <div className="cyber-input">

                <input 
                    type="email" placeholder='Email' className='w-full px-1 py-2 rounded border-none' 
                    {...register('email', {required: true})}
                />
            </div>
            <div className="cyber-input">

                <input 
                    type="password" placeholder='Password' className='w-full px-1 py-2 rounded border-none'
                    min={6}
                    {...register('password', {required: true})}
                />
            </div>
            <Link to='/login' className='text-blue-500 hover:text-blue-700 text-center'>
                Já possui conta? Faça login!
            </Link>
            <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition'>
                Cadastrar
            </button>
        </form>
      </div>
    )
}