import { useEffect, useState } from "react"
import { MagicMotion } from "react-magic-motion"
import { Header } from "../../../components/Header"
import { CardModel, CardsProps } from "../../../components/Card"
import { AvatarModel, AvatarsProps } from "../../../components/Avatar"
import { CreateDeckRequest } from "~/src/shared/types/ipc"
import { toast } from "react-toastify"

export function CreateDeck(){
    const [searchCards, setSearchCards] = useState("")
    const [cards, setCards] = useState<CardsProps[]>([])
    const [avatars, setAvatars] = useState<AvatarsProps[]>([])

    const [deckName, setDeckName] = useState("")
    const [cardsSelected, setCardsSelected] = useState<CardsProps[]>([])
    const [avatarSelected, setAvatarSelected] = useState<AvatarsProps | undefined>(undefined)

    const [cardInfo, setCardInfo] = useState<CardsProps | undefined>(undefined)
    const [avatarInfo, setAvatarInfo] = useState<AvatarsProps | undefined>(undefined)

    function handleInfoCards(cards: CardsProps | null, avatar: AvatarsProps | null){
        if(!cards && avatar){
            setCardInfo(undefined)
            setAvatarInfo(avatar)
        }
        else if(!avatar && cards){
            setCardInfo(cards)
            setAvatarInfo(undefined)
        }

    }

    async function FetchCards(){
        const {avatars, cards} = await window.api.fetchCards(searchCards)

        setCards(cards)
        setAvatars(avatars)
    }

    function addCardToDeck(e:React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>, card: CardsProps){
        e.preventDefault()
        // Só pode adicionar o máximo de 3 copias de uma carta
        if(card.type_card === "HABILIDADE_UNICA"){
            const thisCardIsAlreadyInTheDeck = cardsSelected.filter((cardSelected)=> cardSelected.id_card === card.id_card)
            if(thisCardIsAlreadyInTheDeck.length > 0){
                toast.warn("Você só pode adicionar uma copia de uma carta de habilidade única")
                return
            }
        }
        if(cardsSelected.length === 22){
            toast.warn("Seu deck só pode ter 22 cartas")
            return
        }
        const cardsRepeat = cardsSelected.filter((cardSelected)=>cardSelected.id_card === card.id_card)
        if(cardsRepeat.length >= 3){
            toast.warn("Você só pode adicionar 3 copias de uma carta")
            return
        }else{
            setCardsSelected([...cardsSelected, card])
        }
    }

    function removeCardFromDeck(e:React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>, card: CardsProps){
        e.preventDefault()
        // Quando uma carta for removida, somente a primeira copia será removida
        const cardsRemove:CardsProps[] = cardsSelected.filter((cardSelect) => cardSelect.id_card === card.id_card)
        const otherCards:CardsProps[] = cardsSelected.filter((cardSelect) => cardSelect.id_card !== card.id_card)


        if(cardsRemove.length === 0){
            toast.warn("Você não pode remover uma carta que não existe")
            return
        }
        let counterCards = cardsRemove.length
        while(counterCards > 1){
            otherCards.push(cardsRemove[0])
            counterCards--
        }

        setCardsSelected(otherCards)
    }

    function addAvatarToDeck(e:React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>, avatar: AvatarsProps){
        e.preventDefault()
        setAvatarSelected(avatar)
    }

    function removeAvatarFromDeck(e:React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>, avatar:AvatarsProps){
        e.preventDefault()
        setAvatarSelected(undefined)
    }
    async function handleCreateDeck(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
        if(cardsSelected.length < 12){
            alert("Seu deck precisa ter no mínimo 12 cartas")
            return
        }
        const deck: CreateDeckRequest = {
            avatar_id: avatarSelected?.id_avatar || "",
            deck_name: deckName,
            cards: cardsSelected.map((card)=>card.id_card)
        }
        try {
            await window.api.createDeck(deck)
            alert("Deck criado com sucesso!")
        } catch (error) {
            alert("Erro ao criar deck")
        }
    }

    useEffect(()=>{
        FetchCards()
    }, [searchCards])
    return (
        <>
            <Header/>
            <div className="grid grid-cols-3 gap-2">
                {/* Cards info */}
                <div>
                    <div className="cyber-tile-big bg-gray-900">
                        {cardInfo && (
                            <>
                                <div className="flex justify-center">
                                    <img src={cardInfo.image} alt={cardInfo.name} className="w-1/2"/>
                                </div>
                                <div className="flex flex-col gap-2 text-center">
                                    <div className="flex justify-center">
                                        <p className="text-white cyber-h text-lg">{cardInfo.name}</p>
                                    </div>
                                    <p className="text-white">{cardInfo.description}</p>
                                    <p className="text-white bg-black">{cardInfo.type_card}</p>
                                </div>
                            </>
                        )}
                        {avatarInfo && (
                            <>
                                <div className="flex justify-center">
                                    <img src={avatarInfo.image} alt={avatarInfo.name} className="w-1/2"/>
                                </div>
                                <div className="flex flex-col gap-2 text-center">
                                    <div>
                                        <p className="text-white">{avatarInfo.name}</p>
                                    </div>
                                    <p className="text-white">{avatarInfo.description}</p>
                                    <p className="text-white bg-black">{avatarInfo.type_avatar}</p>
                                    <div className="text-white">
                                        <p>ATK: {avatarInfo.attack}</p>
                                        <p>DEF: {avatarInfo.defense}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
                {/* Cards to create Deck */}
                <MagicMotion>
                <form onSubmit={(e)=>handleCreateDeck(e)} className="bg-gray-900 cyber-tile-big pt-4">
                    <div className="flex items-center mb-10 flex-wrap justify-center">
                        {avatarSelected && (
                            <button className={"cyber-button-small vt-bot z-10"} disabled={deckName === ""}>
                                <span className="text-black font-bold">
                                    Salvar deck
                                </span>
                                <span className="glitchtext"></span>
                            </button>
                        )}
                        <div className="cyber-input text-white">
                            <input type="text" className="" placeholder="Meu novo deck"
                                value={deckName}
                                onChange={(e) => setDeckName(e.target.value)}
                            />
                        </div>
                    </div>
                    {avatarSelected && (
                        <div className="flex justify-center">
                            <AvatarModel 
                                avatar={avatarSelected} 
                                cards={cards} 
                                handleAvatar={removeAvatarFromDeck}
                                handleAvatarInfo={handleInfoCards}
                            />
                        </div>
                    )}
                    <div className="flex flex-wrap gap-2 mt-10">
                        {cardsSelected.map((card, index) => (
                            <CardModel 
                                card={card} 
                                handleCard={removeCardFromDeck}
                                handleCardInfo={handleInfoCards}
                                key={card.id_card+index}
                            />
                        ))}
                    </div>
                </form>
                </MagicMotion>
                {/* Cards from DB */}
                
                <div className="gap-4 max-h-[90vh] overflow-x-hidden">
                    <h1 className="cyber-h">Cartas</h1>
                    <form className="cyber-input my-4">
                        <input type="search" placeholder="Pesquisar cartas"
                            value={searchCards}
                            onChange={(e) => setSearchCards(e.target.value)}
                        />
                    </form>
                    <div className="flex flex-wrap gap-2">
                        {avatars.map((avatar) => (
                            <AvatarModel 
                                avatar={avatar} 
                                cards={cards} 
                                key={avatar.id_avatar}
                                handleAvatar={addAvatarToDeck}
                                handleAvatarInfo={handleInfoCards}    
                            />
                        ))}
                        {cards.map((card) => (
                            <CardModel 
                                card={card} 
                                key={card.id_card} 
                                handleCard={addCardToDeck}
                                handleCardInfo={handleInfoCards}
                            />
                        ))}
                        {cards.length === 0 && avatars.length === 0 && (
                            <div className="cyber-att-2 w-full cyber-glitch-4">
                                <p className="text-white">Nenhuma carta encontrada</p>
                            </div>
                        )}
                    </div>
                </div>
                
            </div>  
        </>
    )
}