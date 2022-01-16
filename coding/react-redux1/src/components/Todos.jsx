import {useState, useEffect} from "react"
import {useSelector,useDispatch} from "react-redux"
import { addTodoLoading,addTodoSuccess,addTodoError,addTodo,getTodoSuccess,getTodoError,getTodoLoading } from "../store/actions";

export const Todos = () => {

    const [text, setText] = useState("");
    const {loading, todos, error} = useSelector((state) => ({loading : state.loading, todos: state.todos, error: state.error}),
    function (prev, curr){
        if(prev.loading === curr.loading && prev.error === curr.error){
            return true
       }
       return false
    });
    const dispatch = useDispatch();

    useEffect(() => {
        getTodos()
    },[])
    async function getTodos(){
        try{
            dispatch(getTodoLoading());
         const data = await  fetch("http://localhost:3001/todos").then((d) => 
             d.json());
             dispatch(getTodoSuccess(data));
        
          
        } catch(err) {
            dispatch(getTodoError(err));
        }
    }

    const addTodo = () => {
        dispatch(addTodoLoading())

        fetch(" http://localhost:3001/todos", {
            method : "POST",
            headers : {
             "content-Type": "application/json"
         },
            body : JSON.stringify({status : false, title: text })
        }).then((d) => d.json()).then((res) => {
            //success
            dispatch(addTodoSuccess(res))
            getTodos()


        }).catch((err) => {
            //error
            dispatch(addTodoError(err))
        })
    }


    return loading ? (
    <div>Loading...</div>) : error ? (<div>Something went wrong...</div>) : ( <div>
        <input value={text} type="text" placeholder="Enter Todo" onChange={(e) => setText(e.target.value)} />

        <button onClick={() => {
           addTodo()

        }}>AddTodo</button>
        {todos.map((e,i) =>(<div key={i}>{e.title} - {e.status ? "done" : "Notdone"}</div> ) 
            )}
    </div>
    )
}