import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi'

import api from '../../services/api';

import './styles.css';

import logoImg from '../../assets/logo.svg';

export default function UpdateIncident() {

    let incidenct;
    const id = localStorage.getItem('incidentId');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');

    const history = useHistory();

    const ongId = localStorage.getItem('ongId');

    useEffect(() => {        
        GetDados();
    }, []);

    async function GetDados()
    {
        var dados = await api.get(`incidents/update/${id}`);
        const {title, description, value} = dados.data;
        setTitle(title);
        setDescription(description);
        setValue(value);
    }


    async function handleUpdateIncident(e) {
        e.preventDefault();

        const data = {
            title,
            description,
            value,
            id
        };

        try {
            await api.put('incidents', data, {
                headers: {
                    Authorization: ongId,
                }
            });

            history.push('/profile');
        }catch(err) {
            alert('Erro ao cadastrar caso, tente novamente')
        }
    }

    return (
        <div className="new-incident-container">
        <div className="content">
            <section>
                <img src={logoImg} alt ="Be The Hero" />

                <h1>Atualizar caso</h1>
                <p>Atualize o detalhadamente para encontrar um herói para resolver isso.</p>

                <Link className="back-link" to="/profile">
                    <FiArrowLeft size={16} color="#E02041"/>
                    Voltar para home
                </Link>
            </section>

            <form onSubmit={handleUpdateIncident}>
                <input 
                    placeholder="Título do caso" 
                    value={title}
                    onChange={e =>setTitle(e.target.value)}
                />
                <textarea  
                    placeholder = "Descrição" 
                    value={description}
                    onChange={e =>setDescription(e.target.value)}
                />
                <input 
                    placeholder="Valor em reais" 
                    value={value}
                    onChange={e =>setValue(e.target.value)}
                />

                <button className="button" type="submit">Atualizar</button>

            </form>
        </div>
    </div>
    );
}