import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, orderBy, query, doc, deleteDoc, getDoc, updateDoc, where } from 'firebase/firestore';
import {app, database} from '../services/firebase';
import { async } from '@firebase/util';

//definir collection
const produtos  = collection(database, 'produtos');
const descartados  = collection(database, 'descartados');

let ordem = '2';


export default function Read(){
    //read
    const [lista, setLista] = useState([]);
    const read = () => {


        getDocs(query(produtos, orderBy("validade")),ID)
            .then((data)=>{
                setLista(data.docs.map((item)=>{
                return{...item.data(), id:item.id};
            }));
                    
        });
    
    }

    const [listaEstragados, setlistaEstragados] = useState([]);
    const readEstragados = () => {


        getDocs(query(descartados, orderBy("validade")))
                .then((data)=>{
                    setlistaEstragados(data.docs.map((item)=>{
                    return{...item.data(), id:item.id};
                }));
                    
            });
    
    }


    const MudarExibir = () => {
        if(ordem === '2') {ordem = '1';}
        else if(ordem === '1'){ordem = '2';}
        console.log(ordem);
        //window.location.reload();
       // return(read.ordem);

        if(ordem === '1'){
            getDocs(query(produtos, orderBy("nome")))
                .then((data)=>{
                    setLista(data.docs.map((item)=>{
                    return{...item.data(), id:item.id};
                }));
                    
            });

            //console.log("AAA" + ordem);
        }

        else if(ordem === '2'){
            getDocs(query(produtos, orderBy("validade")))
                .then((data)=>{
                    setLista(data.docs.map((item)=>{
                    return{...item.data(), id:item.id};
                }));
                    
            });
        }
        
    }


    //mostrar documentos
    useEffect(()=>{
        read();
    }, []);

    useEffect(()=>{
        readEstragados();
    }, []);

    //excluir
    const deleteBtn = (id) => {
        const documento = doc(database, "produtos", id);
        deleteDoc(documento)
        .then(() => {read();});
    }

    //update
    const [ID, setID] = useState(null);
    const [produtosUnico, setProdutosUnico] = useState({});
    const [mostrar, setMostrar] = useState(false);
    const [nome, setNome] = useState("");
    const [validade, setValidade] = useState("");
    const [nomeEstragado, setNomeEstragado] = useState("");
    const [validadeEstragado, setValidadeEstragado] = useState("");
    const [status, setStatus] = useState("");
    // const [estragado, setEstragado] = useState(false);

    const show = async(id) =>{
        setID(id);
        if(ID !=null){
            const produtoSimples = doc(database, "produtos", ID);
            const resultado = await getDoc(produtoSimples);
            setProdutosUnico({...resultado.data(), id:resultado.id});
            setNome(produtosUnico.nome);
            setValidade(produtosUnico.validade);
        }

        if(validade != "") setMostrar(true);

    }

    useEffect(()=>{ show(); }, [ID]);


    const bt_cancelar = () => {
        setMostrar(false);
        setNome("");
        setValidade("");
        setID(null);
    }

    const bt_alterar = (id) =>{
        const produtoShow = doc(database, 'produtos', id);
        updateDoc(produtoShow, {
            nome:nome,
            validade:validade
        })
        .then(() =>{
            setNome("");
            setValidade("");
            setID(null);
            read();
            setMostrar(false);
        });
    }

    const bt_estragado = (id) =>{
        const produtoShow = doc(database, 'produtos', id);
        updateDoc(produtoShow, {
           status:1
        })
        .then(() =>{
            setNome("");
            setValidade("");
            setID(null);
            read();
            setMostrar(false);
        });
    }

    return(
        <>
            {mostrar ?(
                <div className='container'>
                    <h3 className="text-center">ALTERAR</h3>

                    {/* Nome */}
                    <input type="text" placeholder="Nome" className="form-control" required onChange={event=>setNome(event.target.value)} value={nome} /> <br/>
                    {/* Validade */}
                    <input type="date" placeholder="Validade" className="form-control" requir
                    ed onChange={event=>setValidade(event.target.value)} value={validade} /> <br/>

                    {/* Botão */}
                    <input type="submit" value="Salvar" className="btn btn-outline-dark form-control" onClick={()=> bt_alterar(produtosUnico.id)} />
                    <input type="submit" value="Cancelar" className="btn btn-outline-danger form-control" onClick={bt_cancelar} /> <br /> <br />
                </div>
            ):(<></>)}

            <div className='container'>
                <h3>Produtos Cadastrados:</h3> <br />
                <input className='btn btn-primary' type="button" value="Mudar Exibição" onClick={() => MudarExibir()} /> <br /> <br />
            </div>

            {/* {lista.map((lista)=>{
                return(
                    <>    
                        <div className='container'>                    
                            <table className='table table-bordered'> 
                                <tr> 
                                    <th scope="col">Nome:</th>
                                    <th scope="col">Validade:</th>
                                    <th scope="col">Ações:</th>
                                </tr>

                                <tr> 
                                    <td>{lista.nome}</td>
                                    <td>{lista.validade}</td>
                                    <td>
                                        <div className="input-group">
                                            <input type="button" value="Alterar" onClick={()=>show(lista.id)} className="btn btn-outline-warning form-control" />
                                            <input type="button" value="Consumido" onClick={()=>deleteBtn(lista.id)} className="btn btn-outline-success form-control" />
                                            <input type="button" value="Estragado" onClick={()=>deleteBtn(lista.id)} className="btn btn-outline-danger form-control" /> 
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </>
                );
            })} */}

            <div className='container'>
                <table className='table table-bordered'>
                    <tr>
                        <th scope="col">Nome:</th>                                    
                        <th scope="col">Validade:</th>
                        <th scope="col">Ações:</th>
                    </tr>

                    {lista.map((lista) =>{
                        return(
                            <>
                                <tr>
                                    <td>{lista.nome}</td>
                                    <td>{lista.validade}</td>
                                    <td>
                                        <div className="input-group">
                                            <input type="button" value="Alterar" onClick={()=>show(lista.id)} className="btn btn-outline-warning form-control" />
                                            <input type="button" value="Consumido" onClick={()=>deleteBtn(lista.id)} className="btn btn-outline-success form-control" />
                                            <input type="button" value="Estragado" onClick={()=>bt_estragado(lista.id)} className="btn btn-outline-danger form-control" /> 
                                        </div>
                                    </td>
                                </tr>
                            </>
                        );
                    })}
                </table>
            </div>

            <div className='container'>
                <table className='table table-bordered'>
                    <tr>
                        <th scope="col">Nome:</th>                                    
                        <th scope="col">Validade:</th>
                        <th scope="col">Ações:</th>
                    </tr>

                    {listaEstragados.map((listaEstragados) =>{
                        return(
                            <>
                                <tr>
                                    <td>{listaEstragados.nome}</td>
                                    <td>{listaEstragados.validade}</td>
                                    <td>
                                        <div className="input-group">
                                            <input type="button" value="Alterar" onClick={()=>show(listaEstragados.id)} className="btn btn-outline-warning form-control" />
                                            <input type="button" value="Consumido" onClick={()=>deleteBtn(listaEstragados.id)} className="btn btn-outline-success form-control" />
                                            <input type="button" value="Estragado" onClick={()=>bt_estragado(listaEstragados.id)} className="btn btn-outline-danger form-control" /> 
                                        </div>
                                    </td>
                                </tr>
                            </>
                        );
                    })}
                </table>
            </div>

        </>
    );

}