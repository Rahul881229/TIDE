import styles from './alert.scss';
const template = document.createElement('template');

template.innerHTML = `
<style> ${styles.toString()} </style>
<div class="tAlertContainer"></div>`;

class Alert extends HTMLElement {
    constructor() {
        super();
    }

    generateUniqueId() {
        return (Math.floor(Math.random() * (10000000 - 1)) + 1).toString();
    }

    show = (description = '', header = '', intervalTime = 0, alertIndication = 'default',) => {
        if (description != '') {
            this.addMessageBox(header, description, intervalTime, alertIndication);
        }
    }

    addMessageBox(header, description, intervalTime, alertIndication) {
        let uniqueId = 'alert-' + this.generateUniqueId();
        let messageBox = document.createElement('div');
        messageBox.className = 'messageBox ' + alertIndication;
        messageBox.id = uniqueId;

        let width = this.hasAttribute('width') ? this.getAttribute('width'):'320px';
        if (!width || parseInt(width) < 320) {
            width = '320px';  // Set a default value if the condition is not met
        }

        // Get the width from attribute or default to auto
      
        messageBox.style.width = width; // Set the width dynamically

        let msg = '';
        let headerIcon = '';

        switch (alertIndication) {
            case 'success':
                headerIcon = '<img src="data:image/png;base64,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">';
                break;
            case 'error':
                headerIcon = '<img src="data:image/png;base64,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">';
                break;
            case 'warning':
                headerIcon = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgEAYAAAAj6qa3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTEyLTIzVDEyOjExOjUzKzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0xMi0yM1QxMjoyNzowMSswNTozMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0xMi0yM1QxMjoyNzowMSswNTozMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowYTQzYzBhOC03NTJiLWI5NDktOTdmMy0yZTAxYmIyMDgzNGEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MGE0M2MwYTgtNzUyYi1iOTQ5LTk3ZjMtMmUwMWJiMjA4MzRhIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6MGE0M2MwYTgtNzUyYi1iOTQ5LTk3ZjMtMmUwMWJiMjA4MzRhIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDowYTQzYzBhOC03NTJiLWI5NDktOTdmMy0yZTAxYmIyMDgzNGEiIHN0RXZ0OndoZW49IjIwMjItMTItMjNUMTI6MTE6NTMrMDU6MzAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMi4wIChXaW5kb3dzKSIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz63MxqWAAAHxUlEQVRogc1ZbVBTVxp+z024BITAABNChAxFxrpOmnVc6grVXcd1HdapmLKWpZalTGu7SDUKImXBZSLDUEsRqdvFlrJCGZZV67RgrbUd6nRaS9n4sWzGZS3ruCzQEDOAMYQQws05++PeJEzIJxC7z58n95z3vF/nnHtuzosIIYQQWCqqWUI7WOYdYpk/ybGBax/lniWcfA83PpolUsSyzcoyk8wxxbGc67dw8re48e2LdRwtMQG9LPEULPPzAR4e0ijCwidSPmosf39zKqMy3hvt3/kSOWulp9duiIABRmwVJLWTPNKCVcI0hyMdVBFVbxwAOc8UKhwpRfmhiSvE6kT+28KqpHuXrsd++Uzt8Z9/LQUQ6mVXzZ3sKKaAZVsup2Z/oAEsNgH2wDVT4X+TvZUb1W9e3Xf5vecPJhHNzHGD7FUhGSWJOCO2KGDNnhyVIiM1PHERicOiYyL+dCi8LOPa706e4kUqn7z0apFhgJWytXDifici0ARwS513TV/UmLz2RO4tTFuyjW1v/oiUkTg8nvCl19EUUH5bAgDAgD11oVKqkyrVqigqrDw648izog5l3u30c1+xvTY1J+ZzawSUgA8v8BLHNHVDpX859mdgbGkWU2UuiKEEbsO42wGBBuwL7hKigwaQg4hS8crpdxrM8RfTVS8/9VoSwGZTpZYZ9KXSdwLw++Nb/01d0vXotnyX/NcviAzvIdKceq9alzvwBT55WRnDlJ568bxGvCGGTih77jOgXq67HoXLPcn7dFQnH7v1nbDm/v9F4H7YIVIswmdy5GO3J1RjLdVP+lblAbqzr2cn/HN3FWkj2STr93sX66srwgRy2W8UYBKJDij/ftPJYYIn1uRkgSkgZd4SbiUifKFyuy7v+Khkxa9LPYkt2AKj9Sc3JhWHCfgdFgFTMThFLsN2JE/0PrN+zDyPEgpXSgBE4n1Fvd8CAFBUCH++BMYMA6DXnW5KTwewYaPxe60vrfahnrcExIEaIoZhlj/7ET34+IpkSoWGkMXidN3V0fbZLFuBUulX4AGAT8fEPJYCsDBwhysUnw/A58fGpK4OULm3CRiHDWCSgmCSfm025sCC49E5EH9wHiEeBXWkBkpLipds2AUYz1qn/FjgGCxWg8Ffrf6DdKE1SHH4MGAVQYhy+O34ocu41yTufWoTyOEo3BaJltsBzJhNE+4PSxe5adO4frmtA8AO0MGVeJHWEnpMIkjfaG92JIDswRLUsWtnEEwDAADG/gWGsX+JWixQNNITw65d9mfnEr6IroAiIyNYhgkw2GIFIHiOMZvd9GOrddrklAsW0BqSSO4443QmoJEcBeWq1OCZZoHxtGnczQxjbDZPTAbbOgBRghg1pjridCQAVUEyqYkSBtsBjM1md0scY7PZXWKWG6gFTpFXoqPtz4/my20ePM20p8QEhEV8iTpfgtUwhI4+NC7RBZ+wYZNJp3PXPmXSBePt7wKyF5So2XnQOrdAM+hI4d27AWnz9gXmAWbTzRutrQA2xmAYHmb5v0MA06ab6rbWQLUFDnQKdOSQM07HNxkxoztI0NsLQDYCOM/J5cYco9f/6w6AXn+6aWN6sKx4QS1QUPHNNQAA+GT+O2A/YaCpu/sHcOmRAt/CQ9S67o/tz44EJMhTC8Y0vb2ggRqQ6YO2G0PpVam/2AogEu3ff/O6k0PpVSlbtyxRubcteRU2Qb1+neTo3GltbV+fvdm5AqhncwixYfIzKEPXTpxcNsMuiIr+VWbdG4B5/EhhggTAzlHRmTvq3gzIakCg8ikFVVTfDZQKEYId/i44NnCT4ApV+MdTSAbbiGZkNEj+YBcOGpAcFChixGprERbKMt8ecu1fkIDE0uK+kZMzFtiC9PBVcTFooQYkSy8c2PFw8tOuI/vAYGOMRu0omG2M0ajVAvPQ8OnlI0eWMSE6aAAZxCFa8GHE3dJ4yYv7aq+cm5G6ivm8ExxT196TPFPzFiSis9BX6d9186O6GrPDzRZEaro+IrWuTKw4PDn4deUDtpW5wXVr7HI+HU1Isz421lVVjDpRD6Scky3WoaDAjR2qjW4KK+raIFbk9V94vfoDTnCY69YskPdphHtpiEvKex5f/dwT0MUb4mdV/BZ0UAepEBGog8uC+XrHoQUyIY13I9wcq23SxFe8VP3FZwV/AIiXyjfNcvUBvN2TqkVWhtC2++UNT6ceyJEStXXvzPoTPyYdZIBUrPS+RZa6NeYFjj7nGenw+zR/T3zJ2rSq7jj6BdHlc+dj2N4ZrkJkbWKZCDxGssjS2CaWKOOD4Z7jb6yLHJhr19CtP1FeteVZc0yFyveAJu04K64tYM2eHM3lJdL8B4Mh/bHnU+pbJyMhU9/wyel02rhSva59Yj0rNcPdXs+VsGzL44af8ah3icXRApYo7gotpBHA8PR/mgX54/0Xqw7Gb8Y2tbF5JGXnQZi09piyf7qFtDFiq0xqAAVOY/oiVcAHIUhACjeo/JBsUyfVRw+HN39/Bq1dkSaK+8crIZ2SO+uLPn8hOvmXu4+929sCQGsj1VPcffEMx7MpXODcCrDt5vwr9BXAUhPgmogulnlctTakg+MKlmnuIoLm7nxCuNIVz14m38YSvsTyHFeLtHJlcSsX8FwWx9xKZPZw4+x/qH0Gbsf/AFvyZN3ebZsMAAAAAElFTkSuQmCC">';
                break;
            case 'info':
                headerIcon = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgEAYAAAAj6qa3AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0NDg4LCAyMDIwLzA3LzEwLTIyOjA2OjUzICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjIuMCAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTEyLTIzVDEyOjI1OjAxKzA1OjMwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0xMi0yM1QxMjoyNjoyOCswNTozMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0xMi0yM1QxMjoyNjoyOCswNTozMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpkOWI5YjdkOS00YTkzLTJh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">';
                break;
            default:
                break;
        }

        if (header != '' && header) {
            msg = `<div class='messageBoxHeader'>
                <div class="messageBoxTitle">
                    ${headerIcon}
                    <label style="padding-left: 10px;">${header}</label>
                </div>  
                <div class="messageBoxButton">
                    <button class="alertClose" id='close_${uniqueId}'>&#10006;</button>
                </div>
            </div>
            <div class='messageBoxContent'>
                ${description}
            </div>`;
        } else {
            msg = `<div class='messageBoxContent onlycontent'>
                <div class='messageDesc'>
                ${description}
                </div>
                <div class='messageClose'>
                    <button class="alertClose" id='close_${uniqueId}'>&#10006;</button>
                </div>
            </div>`;
        }
        messageBox.innerHTML = msg;
        this.querySelector(".tAlertContainer").appendChild(messageBox);

        if (intervalTime) {
            setTimeout(() => {
                try {
                    this.querySelector("#" + uniqueId).remove();
                } catch (error) { }
            }, intervalTime);
        }
    }

    static get observedAttributes() {
        return ["theme", "position", "lang", "width"];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if ((name == "theme" || name == "position") && newValue) {
            let alertC = this.querySelectorAll('.tAlertContainer');
            if (alertC.length > 0) {
                if (oldValue) {
                    alertC.forEach(element => {
                        element.classList.remove(oldValue);
                    });
                }
                alertC.forEach(element => {
                    element.classList.add(newValue);
                });
            }
        } else if (name == 'lang' && newValue) {
            let alertC = this.querySelectorAll('.tAlertContainer');
            if (alertC.length > 0) {
                if (newValue == 'ar') {
                    alertC.forEach(element => {
                        element.setAttribute('dir', 'rtl');
                        element.setAttribute('lang', 'ar');
                    });
                } else {
                    alertC.forEach(element => {
                        element.removeAttribute('dir');
                        element.setAttribute('lang', 'en');
                    });
                }
            }
        } else if (name == 'width' && newValue) {
            let alertC = this.querySelectorAll('.tAlertContainer .messageBox');
            if (alertC.length > 0) {
                alertC.forEach(element => {
                    element.style.width = newValue; // Update width dynamically
                });
            }
        }
    }

    disconnectedCallback() {
        this.querySelector('.tAlertContainer').removeEventListener('click', (e) => this.messageClose(e));
    }

    connectedCallback() {
        this.appendChild(template.content.cloneNode(true));
        let theme = this.hasAttribute("theme") ? this.getAttribute("theme") == '' ? 'dark' : this.getAttribute("theme") : "dark";
        this.querySelector('.tAlertContainer').classList.add(theme);
        let position = this.hasAttribute("position") ? this.getAttribute("position") == '' ? 'top-right' : this.getAttribute("position") : "top-right";
        this.querySelector('.tAlertContainer').classList.add(position);
        if (this.hasAttribute("lang")) {
            if (this.getAttribute("lang") == 'ar') {
                this.querySelector('.tAlertContainer').setAttribute('dir', 'rtl');
                this.querySelector('.tAlertContainer').setAttribute('lang', 'ar');
            }
        }
        if (this.hasAttribute('width')) {
            let width = this.getAttribute('width');
            this.querySelectorAll('.tAlertContainer .messageBox').forEach(element => {
                element.style.width = width; // Set width on initialization
            });
        }
        this.querySelector('.tAlertContainer').addEventListener('click', (e) => this.messageClose(e));
    }

    messageClose(event) {
        if (event.target.className == 'alertClose') {
            this.querySelector("#" + event.target.id.split('_')[1]).remove();
        }
    }

    updateMessage() {
        // Implementation if needed
    }
}
export default Alert;
