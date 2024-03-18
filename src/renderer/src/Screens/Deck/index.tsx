import { Header } from "../../components/Header";
import { TbCardsFilled } from "react-icons/tb"
import { RxCardStackPlus } from "react-icons/rx"
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { TbHttpDelete } from "react-icons/tb";
import { toast } from "react-toastify";
import { MyDecksResponse } from "~/src/shared/types/ipc";

export function Deck(){
    const [myDecks, setMyDecks] = useState<MyDecksResponse[]>([])

    async function fetchMyDecks(){
        const response = await window.api.getMyDecks()
        setMyDecks(response)
    }

    async function handleDeleteDeck(id_deck: string){
        if(!window.confirm("Tem certeza que deseja deletar este deck?")) return
        await window.api.deleteDeck(id_deck)
        toast.success("Deck deletado com sucesso!")
        fetchMyDecks()
    }

    useEffect(()=>{
        fetchMyDecks()
    }, [])

    return (
        <>
            <Header/>
            <div className="flex flex-col justify-center pt-20 items-center gap-10 ">
                <h1 className="text-2xl font-bold text-blue-500">Decks</h1>
                    <Link to={"/deck/create"} className="">
                        <div className="cyber-tile-small cyber-glitch-1 bg-black flex justify-center items-center text-white flex-col border-2 border-red-400">
                                <RxCardStackPlus className="w-10 h-10 text-blue-500"/>
                                <p>Criar novo Deck</p>
                        </div>
                    </Link>
                <div className="flex cyber-tile-big w-full p-4 gap-2 flex-wrap justify-center items-center">
                    {myDecks.map((deck)=>(
                        <div key={deck.id_deck}>
                            <Link to={"/deck/"+deck.id_deck} key={deck.id_deck}>
                                <div className="cyber-tile-small cyber-glitch-1 bg-black flex justify-center items-center text-white flex-col border-yellow-400 border-2">
                                    <TbCardsFilled className="w-10 h-10 text-blue-500"/>
                                    <p>{deck.name}</p>
                                </div>
                            </Link>

                            <button className="w-full items-center flex justify-center group" onClick={()=>handleDeleteDeck(deck.id_deck)}>
                                <TbHttpDelete size={25} className="text-red-strong group-hover:scale-105 transition"/>
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}