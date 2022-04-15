import logoImg from '../assets/images/logo.svg'
import Button from '../components/Button'
import { RoomCode } from '../components/RoomCode'
import '../styles/room.scss'
import {Link, useHistory, useParams} from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {database} from '../services/firebase'
import Question from '../components/Question'
import {useRoom} from '../hooks/useRoom'
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import '../styles/modal.scss'

type RoomParams = {
    id:string;
}

export default function AdminRoom(){
    const history = useHistory();
    const params = useParams<RoomParams>();
    const roomId = params.id;

    const [modalEndRoomIsOpen, setModalEndRoomOpen] = useState(false);
    const [modalDeleteQuestIsOpen, setModalDeleteQuestOpen] = useState(false);
    const [questionToDeleteId, setQuestionToDeleteId] = useState("");
    
    const {user} = useAuth();
    const {questions, title} = useRoom(roomId);

    useEffect(() =>{ 
        const roomCreatorId = database.ref(`rooms/${roomId}`)
        roomCreatorId.once('value', (data) =>{
        const roomCreatorId = data.val().authorId;
        if(user?.id === roomCreatorId){
            return
        }
        history.push(`/rooms/${roomId}`)
        })
    })
    

    async function handleEndRoom(){
        await database.ref(`rooms/${roomId}`).update({
            closedAt: new Date(),
        })
        history.push('/');  
    }

    async function handleDeleteQuestion(questionId:string){
        await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        
    }

    async function handleCheckQuestionAsAnswered(questionId:string){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ 
                isAnswered:true,
            })
    }
    
    async function handleHighlightQuestion(questionId:string){
            await database.ref(`rooms/${roomId}/questions/${questionId}`).update({ 
                isHighlighted:true,
            })
    }

    

   
    return(
       <div id="page-room">
            <Modal
          
          isOpen={modalEndRoomIsOpen}
          className="modal"
          overlayClassName="modal-overlay"
        >
            <h2>Você quer mesmo encerrar essa sala? </h2>
            <div className="modal-buttons">
            <button className="btn-yes" onClick={() => {
                handleEndRoom()
                setModalEndRoomOpen(false)
                }}>Vamos lá!</button>
            <button className="btn-no" onClick={() => setModalEndRoomOpen(false)}>Não!</button>
            </div>
        </Modal>
        <Modal
          
          isOpen={modalDeleteQuestIsOpen}
          className="modal"
          overlayClassName="modal-overlay"
        >
            <h2>Você quer apagar essa pergunta?</h2>
            <div className="modal-buttons">
            <button className="btn-yes" onClick={() => {
                handleDeleteQuestion(questionToDeleteId)
                setModalDeleteQuestOpen(false)
                }}>Vamos lá!</button>
            <button className="btn-no" onClick={() => setModalDeleteQuestOpen(false)}>Não!</button>
            </div>
        </Modal>
           <header>
               <div className="content">
                   <Link to="/">
                   <img src={logoImg} alt="Letmeask" />
                   </Link>
                   <div>
                   <RoomCode code={params.id}/>
                   <Button isOutlined onClick={() => setModalEndRoomOpen(true)}>Encerrar sala</Button>
                   </div>
               </div>
           </header>
           <main className="content">
               <div className="room-title">
                   <h1>Sala {title}</h1>
                   {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}

               </div>
              
               <div className="question-list">
                    {questions.map(question =>{
                        return(
                            <Question 
                            key={question.id}
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}
                            >
                               {!question.isAnswered && (
                                    <>
                                        <button
                                        type="button"
                                        onClick={() =>{handleCheckQuestionAsAnswered(question.id)}}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida"/>
        
                                        </button>
                                        <button
                                        type="button"
                                        onClick={() =>{handleHighlightQuestion(question.id)}}
                                        >
                                            <img src={answerImg} alt="Dar destaque a pergunta"/>
        
                                        </button>
                                    </>
                               )}
                                <button
                                type="button"
                                onClick={() =>{
                                    setQuestionToDeleteId(question.id)
                                    setModalDeleteQuestOpen(true)
                                }}
                                >
                                    <img src={deleteImg} alt="Remover pergunta"/>

                                </button>
                            </Question>
                        )
                    })}
               </div>
               
           </main>
       </div>
    )
}