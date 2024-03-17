import { contextBridge, ipcRenderer } from 'electron'
import {CreateUserResponse, CreateUserRequest, SignInRequest, SignInResponse} from '../shared/types/ipc'
import { ElectronAPI, electronAPI } from '@electron-toolkit/preload'
import { IPC } from '../shared/constants/ipc'

// Custom APIs for renderer
declare global {
  export interface Window {
    electron: ElectronAPI,
    api: typeof api
  }
}

const api = {
  signup(req: CreateUserRequest): Promise<CreateUserResponse>{
    return ipcRenderer.invoke(IPC.USERS.CREATE, req)
  },
  signin(req: SignInRequest): Promise<SignInResponse> {
    return ipcRenderer.invoke(IPC.USERS.SIGNIN, req)
  },
  getPlayerInfo(): Promise<SignInResponse> {
    return ipcRenderer.invoke(IPC.USERS.GET_INFO)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
