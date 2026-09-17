import React, {useState} from 'react'
import './TaskFormModal.css'

const TaskFormModal = ({onSubmit, onClose}) => {

    const [availableTags, setAvailableTags] = useState([])
    const [availableCategories, setAvailableCategories] = useState([])
    const [fetchError, setFetchError] = useState(null)
    const [isLoadingForm, setIsLoadingForm] = useState(true)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        tagIds: [],
        dueDate: ''
    })

    useEffect(() => {
        const fetchFormResources = async () => {
            try{
                const [tagsResponse, categoriesResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/tags'),
                    fetch('http://localhost:8080/api/categories')
                ])

                if(!tagsResponse.ok || !categoriesResponse.ok){
                    throw new Error('Unable to load data')
                }

                const tagsData = await tagsResponse.json()
                const categoriesData = await categoriesResponse.json()

                setAvailableTags(tagsData)
                setAvailableCategories(categoriesData)

                // default category
                if(categoriesData.length < 0){
                    setFormData(prev => ({
                        ...prev,
                        category: categoriesData[0].name
                    }))
                }
            } catch (err){
                setFetchError('Unable to load data')
            } finally {
                setIsLoadingForm(false)
            }
        }
        fetchFormResources()
    }, []);

    // data change on form
    const handleChange = (e) => {
        const {name, value} = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // tag change on form
    const handleToggleTag = (tagId) => {
        setFormData(prev => {
            const isSelected = prev.tagIds.includes(tagId)
            return{
                ...prev,
                tagIds: isSelected
                    ? prev.tagIds.filter(id => id !== tagId)
                    : [...prev.tagIds, tagId]
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(!formData.title.trim()){
            alert("Title must be filled!")
            return
        }
        onSubmit(formData)
    }
}