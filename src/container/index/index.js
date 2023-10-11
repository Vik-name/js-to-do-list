class Todo {
  static #NAME = 'todo'

  static #saveData = () => {
    localStorage.setItem(
      this.#NAME,
      JSON.stringify({
        list: this.#list,
        count: this.#count,
      }),
    )
  }

  static #loadData = () => {
    const data = localStorage.getItem(this.#NAME)

    if (data) {
      const { list, count } = JSON.parse(data)
      this.#list = list
      this.#count = count
    }
  }

  static #list = []
  static #count = 0

  static #createTaskData = (text) => {
    this.#list.push({
      id: ++this.#count,
      text,
      done: false,
    })
  }

  static #block = null
  static #template = null
  static #input = null
  static #button = null

  static init = () => {
    this.#template =
      document.getElementById(
        'task',
      ).content.firstElementChild

    this.#block = document.querySelector('.task__list')

    this.#input = document.querySelector('.form__input')
    this.#button = document.querySelector('.form__button')

    this.#button.onclick = this.#handleAdd // подключает к кнопке на onclick функцию handleAdd

    this.#loadData()

    this.#render()
  }

  static #handleAdd = () => {
    const value = this.#input.value // value - значение вводимое в инпут
    // если длинна введенного в инпут текста больше 1 символа (не пустое) создаем задачу
    if (value.length > 1) {
      this.#createTaskData(this.#input.value)
      this.#input.value = '' //очищает поле после добавления задачи
      this.#render()
      this.#saveData()
    }
  }

  static #render = () => {
    this.#block.innerHTML = '' //очищается список, чтобы все время повторно не добавлялись задачи

    if (this.#list.length === 0) {
      this.#block.innerText = `Список задач пустий`
    } else {
      this.#list.forEach((taskData) => {
        const el = this.#createTaskElem(taskData)
        this.#block.append(el)
      })
    }
  }

  static #createTaskElem = (data) => {
    const el = this.#template.cloneNode(true) //создается копия списка из template для изменения

    const [id, text, btnDo, btnCancel] = el.children // вытаскиваем элементы через деструкутризацию
    id.innerText = `${data.id}.`
    text.innerText = data.text

    btnCancel.onclick = this.#handleCancel(data)

    btnDo.onclick = this.#handleDo(data, btnDo, el)

    if (data.done) {
      // если приходят данные с done, то переключаем классы
      el.classList.add('task--done')
      btn.classList.toggle('task__button--do')
      btn.classList.toggle('task__button--done')
    }

    return el
  }

  static #handleDo = (data, btn, el) => () => {
    const result = this.#toggleDone(data.id) //в result true, false или null

    if (result === true || result === false) {
      // если в result что-то кроме true или false, переключение классов не выполняется
      el.classList.toggle('task--done')
      btn.classList.toggle('task__button--do')
      btn.classList.toggle('task__button--done')

      this.#saveData()
    }
  }

  static #toggleDone = (id) => {
    const task = this.#list.find((item) => item.id === id)

    if (task) {
      // если объект task есть
      task.done = !task.done // меняет св-во done на противоположное (false на true и наоборот)
      return task.done
    } else {
      return null
    }
  }

  static #handleCancel = (data) => () => {
    if (confirm('Видалити задачу?')) {
      const result = this.#deleteById(data.id) // удаляет
      if (result) {
        this.#render() // если удаление произошло, вызывает #render чтобы обновить список
        this.#saveData()
      }
    }
  }

  static #deleteById = (id) => {
    this.#list = this.#list.filter((item) => item.id !== id) // фильтрует по id и обновляет #list
    return true // возвращает true, чтобы понимать, что действие произошло
  }
}

Todo.init()

window.todo = Todo
