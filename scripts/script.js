'use strict'

const dataBase = JSON.parse(localStorage.getItem('awito')) || []
let counter = dataBase.length
const modalAdd = document.querySelector('.modal__add')
const addAd = document.querySelector('.add__ad')
const modalBtnSubmit = document.querySelector('.modal__btn-submit')
const modalSubmit = document.querySelector('.modal__submit')
const catalog = document.querySelector('.catalog')
const modalItem = document.querySelector('.modal__item')
const modalBbtnWarning = document.querySelector('.modal__btn-warning')
const modalFileInput = document.querySelector('.modal__file-input')
const modalFileBtn = document.querySelector('.modal__file-btn')
const modalImageAdd = document.querySelector('.modal__image-add')
const searchInput = document.querySelector('.search__input')
const modalImageItem = document.querySelector('.modal__image-item')
const modalHeaderItem = document.querySelector('.modal__header-item')
const modalStatusItem = document.querySelector('.modal__status-item')
const modalDescriptionItem = document.querySelector('.modal__description-item')
const modalCostItem = document.querySelector('.modal__cost-item')
const menuContainer = document.querySelector('.menu__container')



const textFileBtn = modalFileBtn.textContent
const srcModalImage = modalImageAdd.src

const elementsModalSubmit = [...modalSubmit.elements].filter(elem => elem.tagName !== 'BUTTON')

const infoPhoto = {}

const saveDB = () => {
    localStorage.setItem('awito', JSON.stringify(dataBase))
}

const closeModalByEscape = event => {

    if (event.code === 'Escape' && !modalAdd.classList.contains('hide')) {
        modalAdd.classList.add('hide')
        modalSubmit.reset()
        document.removeEventListener('keydown', closeModalByEscape)
    } else if (event.code === 'Escape' && !modalItem.classList.contains('hide')) {
        modalItem.classList.add('hide')
        document.removeEventListener('keydown', closeModalByEscape)
    }

}

const checkForm = () => {
    const validForm = elementsModalSubmit.every(elem => elem.value.trim())
    modalBtnSubmit.disabled = !validForm
    modalBbtnWarning.style.display = validForm ? 'none' : ''
    // if(validForm) {
    //     modalBbtnWarning.style.display = 'none'
    // } else {
    //     modalBbtnWarning.style.display = ''
    // }
}

modalSubmit.addEventListener('input', checkForm)

modalSubmit.addEventListener('submit', event => {
    event.preventDefault()
    const itemObject = {}
    
    for (const elem of elementsModalSubmit) {
        itemObject[elem.name] = elem.value
        
    }
    itemObject.id = counter++
    itemObject.image = infoPhoto.base64
    dataBase.push(itemObject)
    modalSubmit.reset()
    modalAdd.classList.add('hide')
    saveDB()
    renderCard()
    
})



addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide')
    modalBtnSubmit.disabled = true
    // modalBtnSubmit.setAttribute('disabled', 'true')
    document.addEventListener('keydown', closeModalByEscape)

})

const closeModal = function (event) {
    const target = event.target
    if (target.closest('.modal__close') || target === this) {
        this.classList.add('hide')
        if (this === modalAdd) {
            modalSubmit.reset()
            modalFileBtn.textContent = textFileBtn
            modalImageAdd.src = srcModalImage
        }
    }

}

modalAdd.addEventListener('click', closeModal)
modalItem.addEventListener('click', closeModal)

catalog.addEventListener('click', event => {
    const target = event.target
    const card = target.closest('.card')
    if (card) {
        const item = dataBase.find(elem => elem.id === +card.dataset.id) 
        
        modalImageItem.src = `data:image/jpeg;base64,${item.image}`
        modalHeaderItem.textContent = item.nameItem
        modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/у'
        modalDescriptionItem.textContent = item.descriptionItem
        modalCostItem.textContent = item.costItem
        modalItem.classList.remove('hide')
        document.addEventListener('keydown', closeModalByEscape)
    }

})

const renderCard = (DB = dataBase) => {
    catalog.textContent = ''
    DB.forEach(item => {
        catalog.insertAdjacentHTML('beforeend', `
        <li class="card" data-id="${item.id}">
            <img class="card__image" src="data:image/jpeg;base64,${item.image}" alt="test">
            <div class="card__description">
                <h3 class="card__header">${item.nameItem}</h3>
                <div class="card__price">${item.costItem} ₽</div>
            </div>
        </li>
        `)
    })
}


searchInput.addEventListener('input' , event => {
    const valueSearch = searchInput.value.trim().toLowerCase()
    
    if(valueSearch.length >= 2){
        const result = dataBase.filter(elem => elem.nameItem.toLowerCase().includes(valueSearch) || 
                                               elem.descriptionItem.toLowerCase().includes(valueSearch))
        
        renderCard(result)
    } else {
        renderCard(dataBase)
    }

    
})


modalFileInput.addEventListener('change', event => {
    const target = event.target
    const reader = new FileReader()
    let file = target.files[0];

    infoPhoto.filename = file.name
    infoPhoto.size = file.size

    reader.readAsBinaryString(file)
    reader.addEventListener('load', event => {
        if (infoPhoto.size < 200000) {
            modalFileBtn.textContent = infoPhoto.filename
            infoPhoto.base64 = btoa(event.target.result)
            modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`
        } else {
            modalFileBtn.textContent = 'Размер файла не должен привышать 200кб'
            modalFileInput.value = ''
            checkForm()
        }

    })
})

menuContainer.addEventListener('click', event => {
    const target = event.target
    if(target.tagName === 'A') {
        const result = dataBase.filter(item => item.category === target.dataset.category) 
            renderCard(result)
        
    }
})

renderCard()