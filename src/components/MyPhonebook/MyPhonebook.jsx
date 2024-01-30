import { useState, useEffect } from "react";
import styles from './my-phonebook.module.css';
import PhonebookForm from "../Phonebook Form/PhonebookForm";
import PhonebookList from "../Phonebook List/PhonebookList"
import { nanoid } from "nanoid";

const MyPhonebook = () => {
    const [contacts, setContacts] = useState(() => {
        const data = JSON.parse(localStorage.getItem("phonebook"));
        return data || [];
    });

    const [filter, setFilter] = useState("")

    useEffect(() => {
        localStorage.setItem("phonebook", JSON.stringify(contacts));
    }, [contacts]);

    const isDublicate = ({name, number}) => {
        const normalizedName = name.toLowerCase();
        const normalizedNumber = number.toLowerCase();

        const dublicate = contacts.find(item => {
            const normalizedCurrentName = item.name.toLowerCase();
            const normalizedCurrentNumber = item.number.toLowerCase();
            return (normalizedCurrentName === normalizedName || normalizedCurrentNumber === normalizedNumber);
        })

        return Boolean(dublicate);
    }

    const addContact = (data) => {
        if(isDublicate(data)) {
            return alert(`You've already added ${data.name} with a number ${data.number} to your phonebook.`)
        }

        setContacts(prevContacts =>{
            const newContact = {
                id: nanoid(),
                ...data,
            };

            return [...prevContacts, newContact, ];
        })
    };

    const removeContact = (id) => {
        setContacts(prevContacts => prevContacts.filter(item => item.id !== id))
    };

    const changeFilter = ({target}) => setFilter(target.value);


    const getFilteredContacts = () => {
        if(!filter) {
            return contacts;
        }

        const normalizedFilter = filter.toLowerCase();

        const filteredContacts = contacts.filter(({name, number}) => {
            const normalizedName = name.toLowerCase();
            const normalizedNumber = number.toLowerCase();

            return (normalizedName.includes(normalizedFilter) ||  normalizedNumber.includes(normalizedFilter)); 
        })
        return filteredContacts;
    }

    const items = getFilteredContacts();

    return (
        <div className={styles.wrap}>
            <PhonebookForm onSubmit={addContact} />
            <div className={styles.listWrap}>
                <input className={styles.input} onChange={changeFilter} name="filter" placeholder="Search" />
                <PhonebookList items={items} removeContact={removeContact} />
            </div>
        </div>
    )
}

export default MyPhonebook;
