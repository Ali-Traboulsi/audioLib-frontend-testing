import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import openSocket from "socket.io-client";
import axios from "axios";

import Input from '../../components/Form/Input/Input';


const Category = props => {

    const [text, setText] = useState("");
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");
    const [state, setState] = useState({
        name: "",
        description: ""
    })
    const [name, setName] = useState("")
    const [description, setDescription] = useState("");

    let socket;

    useEffect(() => {
        getCategories();
        socket = openSocket("http://localhost:5005", {
            transports: ["websocket", "polling", "flashsocket"]
        });
        socket.on("post", data => {
            setCategories([...categories, data]);
            console.log(categories);
        })
    }, [])

    const getCategories = () => {
        fetch("http://localhost:5005/categories")
            .then(res => {
                // console.log(res.json());
                return res.json();
            })
            .then(resData => {
                // console.log(resData.result);
                return setCategories(resData.result);
            })
            .then(() => {
                if (categories.length > 0) {
                    console.log(categories);
                }
            })
    }

    const handleChange = (e) => {
        e.preventDefault();
        const value = e.target.value;
        setText(value);
    }

    const handleInputChange = (e) => {
        e.preventDefault();
        const {id, value} = e.target
        setState(prevState => ({
            ...prevState,
            [id]: value
        }))
    }

    const handleChangeName = (e) => {
        e.preventDefault();
        setName(e.target.value)
    }

    const handleChangeDescription = (e) => {
        e.preventDefault();
        setDescription(e.target.value)
    }



    const handleFormSubmit = async () => {
        try {
            const success = await axios.post("http://localhost:5005/categories", {
                name: name,
                description: description
            })
            console.log(success);
        } catch (err) {
            console.log(err)
        }
    }



    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="category name"
                    onChange={handleChangeName}
                    value={name}
                />
                <input
                    type="text"
                    name="description"
                    id="description"
                    placeholder="category description"
                    onChange={handleChangeDescription}
                    value={description}
                />
                {/*<input onChange={handleChange} type="text" name="name" id="name"/>*/}
                <button type="submit">Submit</button>
            </form>

            <hr/>
            <div>
                {/*{isClicked ? (<h2>{text}</h2>) : null}*/}
            </div>
            <div>
                {
                    (categories.length > 0)
                        ? (categories.map(cat => {
                            return <h1>
                                {cat.name}
                            </h1>
                        }))
                        : null
                }
            </div>
        </div>
    );
};

Category.propTypes = {

};

export default Category;