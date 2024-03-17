import { Header } from "../../components/Header"
import { CodeWriter } from "./CodeWriter"

export function Home(){
    return (
        <div className="bg-fixed bg-center bg-no-repeat bg-cover h-screen">
            <Header/>
            <div className="flex-col flex justify-center items-center h-[80vh] w-full">
                <CodeWriter/>
            </div>
        </div>
    )
}