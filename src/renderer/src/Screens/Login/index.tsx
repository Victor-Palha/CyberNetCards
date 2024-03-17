import { useContext, useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
// import instance from '../../lib/axios'
import { Link, Navigate } from 'react-router-dom'
import { authContext } from '../../context/authContext'
import { SignInRequest } from '~/src/shared/types/ipc'
import { toast } from 'react-toastify'
// import { authContext } from '../../context/authContext'

export function Login() {
  const {isAuth, setIsAuth} = useContext(authContext)

  const {register, handleSubmit} = useForm<SignInRequest>()

  async function handleSignIn(userInformation: SignInRequest) {
    window.api.signin({
      email: userInformation.email,
      password: userInformation.password
    }).catch((_err)=>{
      toast.error("Credenciais invalidas!")
      return
    })

    setIsAuth(true)
  }

  return (
    <div className='flex h-screen justify-center items-center'>
      {isAuth && (
        <Navigate to='/'/>
      )}
      <form className='max-w-md flex flex-col gap-4 text-white'
       onSubmit={handleSubmit(handleSignIn)}
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
          Cyber-Net-Cards
        </h1>
        
        <div className='cyber-input'>
          <input type="text" placeholder='Email' className='w-full px-1 py-2  border-none' {...register('email', {required: true})}/>
        </div>
        <div className='cyber-input'>
          <input type="password" placeholder='Senha' className='w-full px-1 py-2  border-none' {...register('password', {required: true})}/>
        </div>
        <Link to='/signup' className='text-blue-500 hover:text-blue-700 text-center'>
            Ainda não tem conta? Cadastre-se!
        </Link>
        <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full transition'>
          Login
        </button>
      </form>
    </div>
  )
}
