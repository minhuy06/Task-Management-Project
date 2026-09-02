import React, {useState, useEffect} from 'react'
import './Slibar.css'

const Slibar = () => {

    // State
    const [categories, setCategories] = useState([])
    const [tags, setTags] = useState([])

    // State for category form
    const [isCategoryPopupOpen, setIsCategoryPopupOpen] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')

    // State for tag form
    const [isTagPopupOpen, setIsTagPopupOpen] = useState(false)
    const [newTagName, setNewTagName] = useState('')
    const [newTagColor, setNewTagColor] = useState('007bff') // default green

    useEffect(() => {
        fetchCategory()
        fetchTag()
    }, []);

    const fectCategory = async () => {
        try{
            const response = await fetch('http://localhost:8080/api/categories')
            const data = await response.json()
            setCategories(data)
        } catch (error){
            console.error("Catched trouble when loading Category: ", error)
        }
    }

    const fetchTag = async () => {
        try{
            const response = await fetch('http://localhost:8080/api/tags')
            const data = await response.json()
            setTags(data)
        } catch (error){
            console.error("Catched trouble when loading Tag: ", error)
        }
    }

    // Create new Category
    const handleCreateCategory = async (e) => {
        e.preventDefault()
        try{
            const response = await fetch('http://localhost:8080/api/categories', {
                method : 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: newCategoryName})
            })

            if(response.ok){
                const newCategory = await response.json()
                setNewCategoryName([...categories, newCategory])
                setNewCategoryName('')
                setIsCategoryPopupOpen(false)
            }
        } catch (error){
            console.error("Can't create a new Category")
        }
    }

    // Create new Tag
    const handleCreateTag = async (e) => {
        e.preventDefault()
        try{
            const response = await fetch('http://localhost:8080/api/tags', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: newTagName, color: newTagColor})
            })

            if(response.ok){
                const newTag = await response.json()
                setTags([...tags, newTag])
                setNewTagName('')
                setNewTagColor('007bff')
                setIsTagPopupOpen(false)
            }
        } catch (error){
            console.error("Can't create a new Category")
        }
    }


}