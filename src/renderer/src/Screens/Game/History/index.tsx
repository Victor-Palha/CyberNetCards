import { PlayerInformation } from "~/src/shared/types/ipc";
import { Historic as H } from "..";

type HistoryProps = {
    historic: H[]
    Me: PlayerInformation
}
export function History({historic, Me}: HistoryProps){
    return (
        <code className="code-block absolute right-2 w-[300px] max-h-[400px] overflow-y-scroll cyber-glitch-0 pb-10" data-title="Histórico: ">
            {historic.map((item, index) => (
                <div key={index} className="border-b-2 border-red-600 mt-2">
                    <span className="italic">Turno {item.turn}</span><br />
                    <span>{item.player === Me.id_player ? "Você " : "O inimigo "}ativou {item.card.name}</span>
                </div>
            ))}
        </code>
    )
}