import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import { MyField } from "./MyField"
import { OponentField } from "./OponentField"
import { Socket, io } from "socket.io-client";
import { Dialog } from "./Dialog";
import { GameState } from "./GameState";
import { Reaction } from "./Reaction";
import { Target } from "./Target";
import { History } from "./History"
import { env } from "../../../../shared/constants/config"
import { PlayerInformation } from "../../../../shared/types/ipc"

type AvatarProps = {
    id_avatar: string;
    name: string;
    description: string;
    image: string;
    set_avatar: string;
    unique_ability: string;
    passive_ability: string | null;
    hit_points: number;
    attack: number;
    defense: number;
    type_avatar: "OFENSIVO" | "DEFENSIVO" | "MODERADO";
    created_at: Date;
    updated_at: Date;
}

export function Game(){

    // Core information
    const [socket, setSocket] = useState<Socket | undefined>()
    const [Me, setMe] = useState<PlayerInformation>({} as PlayerInformation)

    const {room_id} = useParams()

    const [phase, setPhase] = useState<number>(1)
    const [_gameTurn, setGameTurn] = useState<number>(1)
    const [dialog, setDialog] = useState<boolean>(false)
    const [cardDialog, setCardDialog] = useState<Cards | Avatar | undefined>(undefined)
    const [historic, setHistoric] = useState<Historic[]>([])
    // States for Calculations to pop-up
    // My Avatar
    const [_myAvatarHp, setMyAvatarHp] = useState<number>(0)
    const [damageReceived, setDamageReceived] = useState<number>(0)
    const [_myAvatarAttack, setMyAvatarAttack] = useState<number>(0)
    const [_myAvatarDefense, setMyAvatarDefense] = useState<number>(0)
    const [differenceAttack, setDifferenceAttack] = useState<number>(0)
    const [differenceDefense, setDifferenceDefense] = useState<number>(0)
    // Enemy Avatar
    const [_enemyAvatarHp, setEnemyAvatarHp] = useState<number>(0)
    const [enemyDamageReceived, setEnemyDamageReceived] = useState<number>(0)
    const [_enemyAvatarAttack, setEnemyAvatarAttack] = useState<number>(0)
    const [_enemyAvatarDefense, setEnemyAvatarDefense] = useState<number>(0)
    const [differenceEnemyAttack, setDifferenceEnemyAttack] = useState<number>(0)
    const [differenceEnemyDefense, setDifferenceEnemyDefense] = useState<number>(0)
    // 0 - Compra
    // 1 - Preparação
    // 2 - Ação
    // 3 - Climax

    // States
    const [responseChainOptions, setResponseChainOptions] = useState<Field | null>(null)

    const [canSkip, setCanSkip] = useState<boolean>(false)
    const [myAvatar, setMyAvatar] = useState<AvatarProps>({} as AvatarProps)
    const [myHand, setMyHand] = useState<Cards[]>([])
    const [myDeck, setMyDeck] = useState<number>(0)
    const [myField, setMyField] = useState<Field>([])
    const [isMyTurn, setIsMyTurn] = useState<boolean>(false)
    const [setCard, setSetCard] = useState<string>("")

    const [ability, setAbility] = useState<string>("")
    const [inChain, setInChain] = useState<boolean>(false)

    const [enemyField, setEnemyField] = useState<Field>([])
    const [enemyDeck, setEnemyDeck] = useState<number>(0)
    const [enemyHand, setEnemyHand] = useState<number>(0)
    const [enemyAvatar, setEnemyAvatar] = useState<AvatarProps>({} as AvatarProps)
    // Render Game
    function renderGame({gameState, turnOf, player, enemy, inChain, turn, history}: RenderGame){
        setHistoric(history)
        if(gameState === 3 && turnOf === Me.id_player){
            climaxPhase(room_id)
        }
        
        if(turn === 1 && gameState === 1){
            // Initial Render set states
            setMyAvatarAttack(player.avatar.attack)
            setMyAvatarDefense(player.avatar.defense)
            setEnemyAvatarAttack(enemy.avatar.attack)
            setEnemyAvatarDefense(enemy.avatar.defense)
            setMyAvatarHp(player.avatar.hit_points)
            setEnemyAvatarHp(enemy.avatar.hit_points)
        }else{
            damageCalculation(player.avatar.hit_points, enemy.avatar.hit_points)
            differenceAttackCalculation(player.avatar.attack, enemy.avatar.attack)
            differenceDefenseCalculation(player.avatar.defense, enemy.avatar.defense)
        }
        setGameTurn(turn)
        setInChain(inChain)
        setCanSkip(player.canSkip)
        setPhase(gameState)
        setMyAvatar(player.avatar)
        setMyHand(player.hand)
        setMyDeck(player.deck)
        setMyField(player.field)
        if(turnOf === Me.id_player){
            setIsMyTurn(true)
        }else{
            setIsMyTurn(false)
        }
        setEnemyField(enemy.field)
        setEnemyAvatar(enemy.avatar)
        setEnemyHand(enemy.hand)
        setEnemyDeck(enemy.deck)
    }
    // Dialog
    function handleDialog(card: Cards | Avatar | undefined){
        setDialog(!dialog)
        setCardDialog(card)
    }
    // Target Selection
    const [typeTarget, setTypeTarget] = useState<"DECK" | "FIELD" | null>(null)

    // Hand functions / Field functions
    function handleDragStart(e:React.DragEvent<HTMLDivElement>, id:string){
        if(phase != 1){
            return
        }
        e.dataTransfer.setData("id", id)
        setSetCard(id)
    }

    function handleSetCards(e:React.DragEvent<HTMLDivElement>){
        if(phase != 1){
            return
        }
        const idFromCard = setCard
        const idFromField = e.currentTarget.id
        const field = myField.find(field => field.field_id === idFromField)
        if(field){
            if(field.card){
                toast.error("Campo já ocupado!")
                return
            }
        }

        if (idFromCard) {
            socket && socket.emit("set_Card", {
                room_id,
                player_id: Me.id_player,
                card: myHand.find(card => card._id === idFromCard),
                field_id: idFromField
            })
        }
    }

    function ativateCard(field_id: string, target?: string | number){
        setDamageReceived(0)
        setEnemyDamageReceived(0)
        setDifferenceAttack(0)
        setDifferenceDefense(0)
        setDifferenceEnemyAttack(0)
        setDifferenceEnemyDefense(0)
        if(responseChainOptions){
            setResponseChainOptions(null)
        }if(typeTarget){
            setTypeTarget(null)
        }
        socket && socket.emit("activate_Card", {field_id, room_id, player_id: Me.id_player, target})
    }

    function activateAbility(field_id: string){
        const typeTarget = myField.find(field => field.field_id === field_id)?.card?.targetCard.type
        if(typeTarget){
            setTypeTarget(typeTarget)
            setAbility(field_id)
        }
    }

    function skipTurn(){
        if(canSkip === false){
            toast.error("Você não pode pular o turno agora!")
            return
        }
        socket && socket.emit("skip_Turn", {room_id, player_id: Me.id_player})
    }
    // Climax
    function climaxPhase(id: any){
        setDamageReceived(0)
        setEnemyDamageReceived(0)
        setDifferenceAttack(0)
        setDifferenceDefense(0)
        setDifferenceEnemyAttack(0)
        setDifferenceEnemyDefense(0)
        setTimeout(() => {
            socket && socket.emit("climax_Phase", {room_id: id, player_id: Me.id_player})
        }, 3000);
    }
    // Chain
    function handleCancelChain(){
        setResponseChainOptions(null)
        socket && socket.emit("cancel_Chain", {room_id, player_id: Me.id_player})
    }
    // Damage Calculation to Animations
    function damageCalculation(myAvatarHp: number, enemyAvatarHp: number){
        setMyAvatarHp((prevValue) => {
            console.log("PrevV: "+prevValue)
            console.log("myAvatarHp: "+myAvatarHp)
            // Calculate damage based on previous value
            if(prevValue === myAvatarHp) return prevValue
            const damage = prevValue - myAvatarHp;
            setDamageReceived(damage)
            return myAvatarHp;
          });
        
          setEnemyAvatarHp((prevValue) => {
            // Calculate damage based on previous value
            if(prevValue === enemyAvatarHp) return prevValue
            const damage = prevValue - enemyAvatarHp;
            setEnemyDamageReceived(damage)
            return enemyAvatarHp;
          });
    }
    function differenceAttackCalculation(myAvatarAttack: number, enemyAvatarAttack: number){
        setMyAvatarAttack((prevValue) => {
            // Calculate damage based on previous value
            if(prevValue === myAvatarAttack) return prevValue
            const damage = prevValue - myAvatarAttack;
            setDifferenceAttack(damage)
            return myAvatarAttack;
          });
        
          setEnemyAvatarAttack((prevValue) => {
            // Calculate damage based on previous value
            if(prevValue === enemyAvatarAttack) return prevValue
            const damage = prevValue - enemyAvatarAttack;
            setDifferenceEnemyAttack(damage)
            return enemyAvatarAttack;
          });
    }
    function differenceDefenseCalculation(myAvatarDefense: number, enemyAvatarDefense: number){
        setMyAvatarDefense((prevValue) => {
            // Calculate damage based on previous value
            if(prevValue === myAvatarDefense) return prevValue
            const damage = prevValue - myAvatarDefense;
            setDifferenceDefense(damage)
            return myAvatarDefense;
          });
        
          setEnemyAvatarDefense((prevValue) => {
            // Calculate damage based on previous value
            if(prevValue === enemyAvatarDefense) return prevValue
            const damage = prevValue - enemyAvatarDefense;
            setDifferenceEnemyDefense(damage)
            return enemyAvatarDefense;
          });
    }

    useEffect(()=>{        
        socket && socket.emit("init_Game", {
            room_id,
            player_id: Me.id_player,
        })
        .on("room_Not_Found", ()=> {
            toast.error("Sala não encontrada!")
            window.location.href = "/confront/rooms"
        })
        .on("deal_Cards", (room: RenderGame)=>{
            renderGame(room)
        })
        .on("i_Set_Card", (newField: RenderGame)=>{
            renderGame(newField)
        })
        .on("enemy_Set_Card", (newField: RenderGame)=>{
            renderGame(newField)
        })
        .on("start_Action_Phase", (itsActionPhase: number)=> {
            setPhase(itsActionPhase)
        })
        .on("i_Activate_Card", (newField: RenderGame)=>{
            renderGame(newField)
        })
        .on("enemy_Activate_Card", (newField: RenderGame)=>{
            renderGame(newField)
        })
        .on("enemy_Activate_Ability", (data: ResponseChain)=>{
            const { response, to_enemy} = data;
            toast.success(`Oponente ativou uma carta habilidade!`)

            setResponseChainOptions(response)
            renderGame(to_enemy)
        })
        .on("skip_Turn", (data)=>{
            const {turnOf, gameState} = data
            if(turnOf === Me.id_player){
                setIsMyTurn(true)
            }else{
                setIsMyTurn(false)
            }
            if(gameState === 3 && turnOf === Me.id_player){
                climaxPhase(room_id)
            }
            setPhase(gameState)
        })
        .on("climax_Phase_End", (data: RenderGame)=>{
            renderGame(data)
        })
        .on("game_End", (data)=>{
            const {winner} = data
            if(winner != null){
                if(winner === Me.id_player){
                    toast.success("Você ganhou!")
                }else{
                    toast.error("Você perdeu!")
                }
            }
        })
    }, [socket])

    useEffect(()=>{
        window.api.getPlayerInfo().then(({player})=>{
            setMe(player)
            const socket = io(env.SOCKER_SERVER+"/game")
            setSocket(socket)
        })
    }, [])

    return (
        <main>
            <button className="cyber-button-small bg-red fg-white vt-bot z-10 absolute">
                    <p>Render-se</p>
                    <span className="glitchtext">Fracote</span>
                    <span className="tag">3023</span>
            </button>
                <OponentField 
                    enemyAvatar={enemyAvatar}
                    enemyField={enemyField}
                    enemyHand={enemyHand}
                    isMyTurn={isMyTurn}
                    enemyDeck={enemyDeck}
                    enemyAvatarDamage={enemyDamageReceived}
                    differenceAttack={differenceEnemyAttack}
                    differenceDefense={differenceEnemyDefense}
                    dialog={handleDialog}
                />

                <GameState phase={phase} isMyTurn={isMyTurn} skip={skipTurn} canSkip={canSkip} inChain={inChain}/>
                
                <History historic={historic} Me={Me}/>
                <MyField 
                    handleDragStart={handleDragStart} 
                    handleSetCards={handleSetCards}
                    ativateCard={ativateCard}
                    dialog={handleDialog}
                    activateAbility={activateAbility}
                    differenceAttack={differenceAttack}
                    differenceDefense={differenceDefense}
                    myAvatarDamage={damageReceived}
                    inChain={inChain}
                    isMyTurn={isMyTurn}
                    myAvatar={myAvatar} 
                    myDeck={myDeck} 
                    myField={myField} 
                    myHand={myHand}
                    phase={phase}
                />
                {dialog && (
                    <Dialog open={dialog} card={cardDialog} close={handleDialog}/>
                )}
                {responseChainOptions && (
                    <Reaction 
                        responseOptions={responseChainOptions} 
                        cancel={handleCancelChain} 
                        response={ativateCard}
                        responseWithAbility={activateAbility}
                    />
                )}
                {typeTarget && (
                    <Target
                        activateCard={ativateCard}
                        enemyField={enemyField}
                        type={typeTarget}
                        ability={ability}
                    />
                )}


        </main>
    )
}

type RenderGame = {
    gameState: number
    history: any[]
    turnOf: string;
    inChain: boolean;
    turn: number;
    player: {
        canSkip: boolean;
        hand: Cards[];
        avatar: Avatar;
        deck: number;
        field: Field;
    }
    enemy: {
        hand: number,
        avatar: Avatar;
        deck: number;
        field: Field;
    }
}

export type Avatar = {
        id_avatar: string;
        name: string;
        description: string;
        image: string;
        set_avatar: string;
        unique_ability: string;
        passive_ability: string | null;
        hit_points: number;
        attack: number;
        defense: number;
        type_avatar: "OFENSIVO" | "DEFENSIVO" | "MODERADO";
        created_at: Date;
        updated_at: Date;
}
export type Cards = {
        _id: string;
        name: string;
        description: string;
        image: string;
        set_card: string;
        type_card: "OFENSIVA" | "DEFENSIVA" | "HABILIDADE" | "HABILIDADE_UNICA";
        list: number;
        activate: boolean;
        created_at: Date;
        updated_at: Date;
        targetCard: CardTarget
        cartEffectOccurred: boolean
        negated: boolean
}
// Target is just a reference to client to know what show in the effect
type CardTarget = {
    has: boolean;
    type: "FIELD" | "DECK" | null
}
export type Field = {
    field_id: string;
    empty: boolean;
    card: Cards | null;
}[]

type ResponseChain = {
    response: Field,
    to_enemy: RenderGame
}

export type Historic = {
    player: string;
    turn: number;
    action: string;
    card: Cards;
    target?: string;
}