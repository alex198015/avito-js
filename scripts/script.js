'use strict'

const dataBase = []

const modalAdd = document.querySelector('.modal__add')
const addAd = document.querySelector('.add__ad')
const modalBtnSubmit = document.querySelector('.modal__btn-submit')
const modalSubmit = document.querySelector('.modal__submit')
const catalog = document.querySelector('.catalog')
const modalItem = document.querySelector('.modal__item')
const modalBbtnWarning = document.querySelector('.modal__btn-warning')

const elementsModalSubmit = [...modalSubmit.elements].filter(elem => elem.tagName !== 'BUTTON')


const closeModalByEscape = event => {
    
    if( event.code === 'Escape' && !modalAdd.classList.contains('hide')) {
        modalAdd.classList.add('hide')
        modalSubmit.reset()
        document.removeEventListener('keydown' , closeModalByEscape)
    } else if (event.code === 'Escape' && !modalItem.classList.contains('hide')) {
        modalItem.classList.add('hide')
        document.removeEventListener('keydown' , closeModalByEscape)
    }

}

modalSubmit.addEventListener('input', () => {
    const validForm = elementsModalSubmit.every(elem => elem.value.trim())
    modalBtnSubmit.disabled = !validForm
    modalBbtnWarning.style.display = validForm ? 'none' : ''
    // if(validForm) {
    //     modalBbtnWarning.style.display = 'none'
    // } else {
    //     modalBbtnWarning.style.display = ''
    // }
})

modalSubmit.addEventListener('submit', event => {
    event.preventDefault()
    const itemObject = {}
    for (const elem of elementsModalSubmit) {
        itemObject[elem.name] = elem.value
    }
    dataBase.push(itemObject)
    modalSubmit.reset()
    modalAdd.classList.add('hide')
    console.log(dataBase);
})



addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide')
    modalBtnSubmit.disabled = true
    // modalBtnSubmit.setAttribute('disabled', 'true')
    document.addEventListener('keydown' , closeModalByEscape)

})

const closeModal = function (event) {
    const target = event.target
    if (target.closest('.modal__close') || target === this) {
        this.classList.add('hide')
        if (this === modalAdd) {
            modalSubmit.reset()
        }
    }

}

modalAdd.addEventListener('click', closeModal)
modalItem.addEventListener('click', closeModal)

catalog.addEventListener('click', event => {
    const target = event.target
    if (target.closest('.card')) {
        modalItem.classList.remove('hide')
        document.addEventListener('keydown' , closeModalByEscape)
    }

})

