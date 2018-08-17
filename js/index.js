/**
 * Resume 📄 by Ahmed Adel 🔥
 */

/**
 * View Model
 * main function handling model and view
 * @param {object} response xhr response from model.json
 */
function main(response) {

    //create header
    var headerTag = renderHeader(),
        //create the clock
        clock = new Clock(headerTag),
        //create info section
        infoSection = renderSection(),
        //create experience section
        expSection = renderSection(),
        //creat hoppies section
        hoppiesSection = renderSection(),
        //create contact me section
        contactSection = renderSection()

    /* Rendering  */
    //render the clock    
    clock.render()
    //render the avatar
    renderAvatar(response.personal.image, infoSection)
    //render the personal Info
    renderPersonalInfo(infoSection, response.personal)
    //render the experience list
    renderList(expSection, response.experience, 'Experience', true)
    //render the hoppies list
    renderList(hoppiesSection, response.hoppies, 'Hoppies', false)
    //render the contact me form
    renderForm(contactSection)

    //handle form submit
    onSubmitForm()
}

//create xhr request
var xhr = new XMLHttpRequest()

//get the data from the json file
xhr.open('GET', 'data/model.json')

//on request transaction success
xhr.onload = function () {

    //to remove loading alert
    hideAlertView();

    //in case of success
    if (xhr.status == 200) {
        //pass response to the main function
        main(JSON.parse(xhr.response));
    } else if (xhr.status == 404) {
        showAlertView('404!\n Data.json is not found')
    } else {
        showAlertView('something went wrong!\n please refresh the page')
    }
}

//show alert view of loading
xhr.onprogress = function () {
    showAlertView('loading...')
}

//show alert view of error
xhr.onerror = function () {
    showAlertView('something went wrong!\n please refresh the page')
}

//send the request
xhr.send()

/** View */
var mainTag = document.getElementsByTagName('main')[0],
    alertTag

/**
 * show alert message in the dom which takes on all the view
 * @param {string} text the input text of the alert
 */
function showAlertView(text) {
    text = text || 'something went wrong'

    //to prevent duplicates
    if (!alertTag) {
        alertTag = document.createElement('h1')
    }

    //format alertTag
    alertTag.style.textAlign = 'center'
    alertTag.innerText = text
    alertTag.role = 'alert'
    alertTag.id = 'alert'
    alertTag.classList.add('alert', 'alert-info')

    //render alertTag
    mainTag.appendChild(alertTag)

}

/**
 * hide any alert message on the view
 */
function hideAlertView() {
    if (alertTag) {
        alertTag.remove()
    }
}

/**
 * constructor Clock
 * @param {object} parentTag 
 */
function Clock(parentTag) {
    var _date = new Date()
    this._hr = _date.getHours()
    this._min = _date.getMinutes()
    this._sec = _date.getSeconds()
    this._parentTag = parentTag
}

/**
 * render the clock
 */
Clock.prototype.render = function () {
    if (!this._clockTag) {
        var pTag = document.createElement('p'),
            divTag = document.createElement('div')

        //style the parent div
        divTag.classList.add('col-sm-2', 'float-right')

        //add id clock to the clock element
        pTag.id = 'clock'
        //add the decorated clock text to the pTag
        pTag.innerText = this._decorateClockText()


        //store the clockTag in the class properties
        this._clockTag = pTag

        //append to the parent tag if defined
        this._parentTag = this._parentTag || mainTag
        divTag.appendChild(pTag)
        this._parentTag.appendChild(divTag)

        //update the clock every second
        this._update()
    }
}


/**
 * update the clock text every second
 */
Clock.prototype._update = function () {
    var that = this;
    setInterval(function () {
        if (that._clockTag) {
            
            //get the new date and update current props
            var _date = new Date()
            that._hr = _date.getHours()
            that._min = _date.getMinutes()
            that._sec = _date.getSeconds()

            //update the clock inner text
            that._clockTag.innerText = that._decorateClockText()
        }
    }, 1000)
}

/**
 * decorate the text of the clock
 */
Clock.prototype._decorateClockText = function () {
    var hr, sec, min, clock = ''

    //convert the digit to 2 digit format (5)=>(05)
    hr = this._toTwoDigitFormat(this._hr)
    min = this._toTwoDigitFormat(this._min)
    sec = this._toTwoDigitFormat(this._sec)

    //concat the hr:min:sec 🕖
    clock = hr + ':' + min + ':' + sec
    return clock
}

/**
 * return str of two digits format
 * @param {number} number 
 */
Clock.prototype._toTwoDigitFormat = function (number) {
    var str = '';
    if (number < 9)
        str = '0' + number
    else
        str = number
    return str;
}

function renderHeader() {
    var headerTag = document.createElement('header'),
        divTag = document.createElement('div'),
        h1Tag = document.createElement('h1'),
        textNode = document.createTextNode('My Resume')

    //format the header
    headerTag.classList.add('header', 'row')
    divTag.classList.add('col-sm-10', 'float-left')

    //render the header and its childs
    h1Tag.appendChild(textNode)
    divTag.appendChild(h1Tag)
    headerTag.appendChild(divTag)
    mainTag.appendChild(headerTag)

    return headerTag;
}

function renderSection() {
    //create section element
    var sectionTag = document.createElement('section')
    //add style row
    sectionTag.classList.add('row')
    //render the section to the main tag
    mainTag.appendChild(sectionTag)
    return sectionTag
}

function renderAvatar(imgUrl, parentTag) {
    var divTag = document.createElement('div'),
        imageTag = document.createElement('img')

    //format parent div
    divTag.classList.add('col-12', 'text-center')

    //set the imgurl and styles
    imageTag.src = imgUrl
    imageTag.classList.add('avatar')

    //render the avatar image
    divTag.appendChild(imageTag)
    parentTag.appendChild(divTag)
}

/**
 * render the name,email and education info
 * @param {Object} parentTag the parent tag
 * @param {Object} personalObj Personal info Object
 */
function renderPersonalInfo(parentTag, personalObj) {
    var divTag = document.createElement('div'),
        nameTag = document.createElement('h2'),
        emailTag = document.createElement('p'),
        educationTag = document.createElement('h4'),
        educationInfoTag = document.createElement('p'),
        hrTag = document.createElement('hr')

    //format the parent div
    divTag.classList.add('col-12', 'text-center', 'personal')

    //add info text to the tags
    nameTag.innerText = personalObj.name
    emailTag.innerText = personalObj.email
    educationTag.innerText = 'Education: '
    educationInfoTag.innerText =
        personalObj.education.department + '\n' +
        personalObj.education.college + '\n' +
        personalObj.education.univeristy

    //render the info
    divTag.appendChild(nameTag)
    divTag.appendChild(emailTag)
    divTag.appendChild(educationTag)
    divTag.appendChild(educationInfoTag)
    divTag.appendChild(hrTag)
    parentTag.appendChild(divTag)
}

/**
 * render array to a list
 * @param {object} parentTag 
 * @param {array} infoArr information array
 * @param {title} title title of the section
 * @param {boolean} ordered whether ordered list or unordered list
 */
function renderList(parentTag, infoArr, title, ordered) {
    var divTag = document.createElement('div'),
        h2Tag = document.createElement('h2'),
        hrTag = document.createElement('hr'),
        listTag

    //ordered list or unorded list
    if (ordered)
        listTag = document.createElement('ol')
    else
        listTag = document.createElement('ul')

    //format the parent div
    divTag.classList.add('col-md-12')

    //add title to the section
    h2Tag.innerText = title

    //add elements to the list from info Array
    for (var index = 0; index < infoArr.length; index++) {
        var element = infoArr[index];
        if (element.trim() != '') {
            var liTag = document.createElement('li')
            liTag.innerText = element
            listTag.appendChild(liTag)
        }
    }

    //render the list
    divTag.appendChild(h2Tag)
    divTag.appendChild(listTag)
    divTag.appendChild(hrTag)
    parentTag.appendChild(divTag)
}

/**
 * render Contact Me Form
 * @param {Object} parentTag the parent Tag
 */
function renderForm(parentTag) {
    var //form and row div
        form = document.createElement('form'),
        row = document.createElement('div'),
        //title
        h2Tag = document.createElement('h2'),
        h2Div = document.createElement('div'),
        //inputs
        name = createInputElement('name', 'text', 6, false),
        email = createInputElement('email', 'email', 6, false),
        subject = createInputElement('subject', 'text', 12, false),
        message = createInputElement('message', 'text', 12, true),
        //button
        button = document.createElement('button'),
        buttonDiv = document.createElement('div')

    //format title
    h2Div.classList.add('col-12')
    h2Tag.innerText = 'Contact Us'
    h2Div.appendChild(h2Tag)

    //format form
    form.classList.add('col-12')
    form.name = 'contact'
    form.method = 'POST'

    //create row
    row.classList.add('row')

    //format button
    button.classList.add('btn', 'btn-primary', 'btn-block')
    button.innerText = 'Submit'
    button.name = 'btn'
    buttonDiv.classList.add('col-12')
    buttonDiv.appendChild(button)

    //render the title
    parentTag.appendChild(h2Div)

    //render inputs and button in the form
    row.appendChild(name)
    row.appendChild(email)
    row.appendChild(subject)
    row.appendChild(message)
    row.appendChild(buttonDiv)
    form.appendChild(row)
    parentTag.appendChild(form)

}

/**
 * Create Div with label and input
 * @param {string} name name of the input
 * @param {string} type type of the input
 * @param {number} col how many coloumns (0-12)
 * @param {boolean} textArea whether the input is textArea or not
 */
function createInputElement(name, type, col, textArea) {
    var input,
        label = document.createElement('label'),
        divTag = document.createElement('div')

    //textArea or input
    if (textArea) {
        input = document.createElement('textarea')
    } else {
        input = document.createElement('input')
    }

    //format the parent div
    divTag.classList.add('col-md-' + col, 'form-group')

    //format label
    label.innerText = name.charAt(0).toUpperCase() + name.substr(1)
    label.for = name

    //format input
    input.name = name
    input.type = type
    input.placeholder = 'Enter ' + name
    input.required = "required"
    input.classList.add('form-control')

    //render the label and the input
    divTag.appendChild(label)
    divTag.appendChild(input)

    return divTag
}

/**
 * handle contact me form submit
 */
function onSubmitForm() {
    var form = document.forms['contact'],
        name = form['name'],
        email = form['email'],
        subject = form['subject'],
        message = form['message'],
        btn = form['btn'],
        statusMsg = document.createElement('small')

    //hide status message untill something happean
    statusMsg.style.display = 'none';

    if (form) {
        form.addEventListener('submit', function (event) {
            //prevent browser defaults
            event.preventDefault()

            //disable the button till loading finish
            btn.disabled = true

            //hide statusMsg
            statusMsg.style.display = 'none'
            form.appendChild(statusMsg)

            //store the inputs data
            var data = {
                "name": name.value.trim(),
                "email": email.value.trim(),
                "subject": subject.value.trim(),
                "message": message.value.trim()
            }

            var xhr = new XMLHttpRequest()

            //open XHR request
            xhr.open('POST', 'http://js.vacsera.com/api/final-project')

            //set content type header to JSON
            xhr.setRequestHeader('Content-Type', 'application/json')

            //on request transaction success
            xhr.onload = function () {
                var response

                //enable the button after loading
                btn.disabled = false

                //on success
                if (xhr.status == 200) {
                    response = JSON.parse(this.responseText)

                    //display success message in status message
                    if (response.success == true) {
                        statusMsg.innerText = 'Your message has been submitted successfully'
                        statusMsg.style.color = 'green'
                        statusMsg.style.display = 'block';
                    } else {
                        displayErrorStatusMsg(statusMsg);
                    }
                } else if (xhr.status == 422) {
                    response = JSON.parse(this.responseText)

                    // display errors in a status message
                    var errors = ''
                    for (var key in response.errors) {
                        if (response.errors.hasOwnProperty(key)) {
                            var element = response.errors[key];
                            errors += element + '\n'
                        }
                    }

                    statusMsg.innerText = errors
                    statusMsg.style.color = 'red'
                    statusMsg.style.display = 'block'

                } else {
                    //display error msg for (401, 404 ..)
                    displayErrorStatusMsg(statusMsg);
                }
            }

            xhr.onerror = function () {
                //enable the button after loading
                btn.disabled = false
                displayErrorStatusMsg(statusMsg);
            }

            //on request loading
            xhr.onprogress = function () {
                statusMsg.innerText = 'Loading...'
                statusMsg.color = 'blue'
                statusMsg.style.display = 'block'
            }

            //send the data to the server
            xhr.send(JSON.stringify(data))
        })
    }
}

/**
 * display an error when something goes wrong while submitting
 * @param {Object} statusMsg status message tag
 */
function displayErrorStatusMsg(statusMsg) {
    statusMsg.innerText = 'Something went wrong.. please retry';
    statusMsg.style.color = 'red';
    statusMsg.style.display = 'block';
}