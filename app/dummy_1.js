const template = document.createElement('template');

template.innerHTML = `
<style>
.tAlertContainer {
    position: fixed;
    right: 0px;
    top: 0;
    z-index: 1;
    min-width: 20vw;
    width: auto;
}
.tAlertContainer .messageBox {
    color: #fff;
    background-color: #262626;
    width: 100%;
    font-family: Helvetica,Calibri,Arial,sans-serif;
    margin: 0.5em;
    border-radius: 0;
    border: 1px solid #131313;
    padding: 5px;
} 
.tAlertContainer .messageBox .messageBoxHeader {
    display: flex;
    align-items: center;
    font-size: 12px;
    width: 100%;
    height: 30px;
    border-bottom: 1px solid #404040;
}
.tAlertContainer .messageBox .messageBoxHeader .messageBoxTitle{
    width: 80%;
    color: #fff; 
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: left;
}
.tAlertContainer .messageBox .messageBoxHeader .messageBoxButton{
    width: 20%;
    display: flex;
    align-items: center;
    justify-content: end;
}

.tAlertContainer .messageBox .messageBoxHeader .messageBoxButton button{
    width: 22px;
    height: 22px;
    font-weight: 400;
    white-space: nowrap;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    font-size: 10px;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    outline: none;
    color: #fff;
    background-color: #404040;
    border: 1px solid #131313;
    display: flex;
    align-items: center;
    justify-content: center;
}

.tAlertContainer .messageBox .messageBoxContent{
    font-size: 12px;
    padding: 5px 0;
}
</style>

<div class="tAlertContainer"></div>`;
class Dummy extends HTMLElement {
    constructor() {
        super();

        this._message = "This website uses cookies to ensure you get the best experience";

        this._header = "Header";
    }

    get message() {
        return this._message;
    }

    generateUniqueId() {
        return (Math.floor(Math.random() * (10000000 - 1)) + 1).toString();
    }

    tideAlert = (header, description) => {
        console.log("tideAlert -> ", header, description);
        this._header = header;
        this._description = description;
        this.addMessageBox();
    }

    addMessageBox() {
        let uniqueId = 'alert_' + this.generateUniqueId();
        let messageBox = document.createElement('div');
        messageBox.className = 'messageBox';
        messageBox.id = uniqueId;
        let msg = ` <div class='messageBoxHeader'>
                <div class="messageBoxTitle">${this._header}</div>  
                <div class="messageBoxButton">
                    <button>X</button>
                </div>       
            </div>
            <div class='messageBoxContent'>
            ${this._description}
            </div>
        `;
        messageBox.innerHTML = msg;
        this.querySelector(".tAlertContainer").appendChild(messageBox);
    }

    set message(value) {
        console.log("message -> ", value);
        this._message = value;
        // this.setAttribute("message", value);
        this.updateMessage();
    }

    static get observedAttributes() {
        return ["message"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            if (name === "message") {
                this._message = newValue;
                this.updateMessage();
            }
        }
    }

    connectedCallback() {
        this.appendChild(template.content.cloneNode(true));
        // this.updateMessage();
    }

    updateMessage() {
        // let messageBox = document.createElement('div');
        // messageBox.className = 'messageBox';
        // messageBox.innerText = this._message;
        // this.querySelector(".tAlertContainer").appendChild(messageBox);
        // this.querySelector(".messageBox").innerHTML = this._message;
    }
}
export default Dummy;