
class SciChartDashboardModal extends HTMLElement {
    static get observedAttributes() { return ['opened', 'title', 'content']; }
    constructor() {
        super();
    }

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback(name, value, updatedValue) {

        if (name === 'opened') {
            updatedValue === "true" ? this.shadowRoot.querySelector('.wrapper').classList.add('active') : this.shadowRoot.querySelector('.wrapper').classList.remove('active');
        }
        console.log(name, updatedValue);
        if (name === 'title') {
            this.shadowRoot.querySelector('.wrapper .modal-image').setAttribute('src', `/images/cars/${updatedValue}.svg`);
            this.shadowRoot.querySelector('.wrapper .modal-title').innerHTML = updatedValue;
        }
        if (name === 'content') {
            this.shadowRoot.querySelector('.wrapper .modal-content').innerHTML = updatedValue;
        }
    }

    _render() {
        const container = document.createElement("div");
        container.innerHTML = `
        <style>
            .wrapper {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: -1;
            }
            
            .wrapper.active {
                background: rgba(0, 0, 0, 0.5);
                transition: all 0.3s ease;
                z-index: 9999;
            }
            
            .popup {
                opacity: 0;
                visibility: hidden;
                height: 400px;
                width: 400px;
                flex-shrink: 0;
                border-radius: 3px;
                position: relative;
                z-index: 3;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }
            
            .popup-inside {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 100%;
                overflow: hidden;
                border-radius: 50%;
                box-shadow: 0 0 0 black;
                transition: box-shadow 0.5s ease 0.7s, border-radius 0.35s ease 0.7s;
            }
            
            .backgrounds {
                position: absolute;
                left: 0;
                top: 0;
                height: 100%;
                width: 100%;
                overflow: hidden;
            }
            
            .background {
                --offset: 0;
                position: absolute;
                left: var(--offset);
                right: var(--offset);
                bottom: var(--offset);
                top: var(--offset);
                background: linear-gradient(to right, rgba(19, 174, 255, 1), rgba(186, 103, 157, 1));
                transform: scale(0);
                transition: all 0.5s ease 0s;
                border-radius: 50%;
            }
            
            .background2 {
                --offset: 10%;
                position: absolute;
                left: var(--offset);
                right: var(--offset);
                bottom: var(--offset);
                top: var(--offset);
                background: linear-gradient(to right, rgba(19, 174, 255, 0.9), rgba(186, 103, 157, 0.9));
                transform: scale(0);
                transition: all 0.5s ease 0.1s;
            }
            
            .background3 {
                --offset: 20%;
                position: absolute;
                left: var(--offset);
                right: var(--offset);
                bottom: var(--offset);
                top: var(--offset);
                background: linear-gradient(to right, rgba(19, 174, 255, 0.8), rgba(186, 103, 157, 0.8));
                z-index: 2;
                transition: all 0.5s ease 0.2s;
            }
            
            .background4 {
                --offset: 30%;
                position: absolute;
                left: var(--offset);
                right: var(--offset);
                bottom: var(--offset);
                top: var(--offset);
                background: linear-gradient(to right, rgba(19, 174, 255, 0.7), rgba(186, 103, 157, 0.7));
                z-index: 3;
                transition: all 0.5s ease 0.3s;
            }
            
            .background5 {
                --offset: 40%;
                position: absolute;
                left: var(--offset);
                right: var(--offset);
                bottom: var(--offset);
                top: var(--offset);
                background: linear-gradient(to right, rgba(19, 174, 255, 0.6), rgba(186, 103, 157, 0.6));
                z-index: 4;
                transition: all 0.5s ease 0.4s;
            }
            
            .background6 {
                --offset: 40%;
                position: absolute;
                left: var(--offset);
                right: var(--offset);
                bottom: var(--offset);
                top: var(--offset);
                background: white;
                z-index: 5;
                transition: all 0.8s ease 0.4s;
            }
            
            .content {
                --offset: 0;
                position: absolute;
                left: var(--offset);
                right: var(--offset);
                bottom: var(--offset);
                top: var(--offset);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: all 0.35s ease 0.75s;
                z-index: 10;
            }
            
            .content-wrapper {
                text-align: center;
            }
            
            .wrapper.active .content {
                opacity: 1;
                transform: none;
            }
            
            .wrapper.active .popup {
                opacity: 1;
                visibility: visible;
            }
            
            .wrapper.active .popup-inside {
                border-radius: 0;
                box-shadow: -50px 0 200px -50px rgba(19, 174, 255, 1), 50px 0 200px -50px rgba(186, 103, 157, 0.6);
            }
            
            .wrapper.active .background {
                transform: scale(1);
            }
            
            .wrapper.active .background6 {
                transform: scale(8);
            }
            .wrapper .modal-image {
                filter: brightness(0);
                width: 100px;
            }
            .wrapper .modal-title {
                text-transform: capitalize;
            }
        </style>
        <div class="wrapper" onclick="SciChartDashboard.onPopupClick()">
            <div class="popup">
                <div class="popup-inside">
                    <div class="backgrounds">
                        <div class="background"></div>
                        <div class="background background2"></div>
                        <div class="background background3"></div>
                        <div class="background background4"></div>
                        <div class="background background5"></div>
                        <div class="background background6"></div>
                    </div>
                </div>
                <div class="content">
                    <div class="content-wrapper">
                        <img class="modal-image" />
                        <h3 class="modal-title"></h3>
                        <p class="modal-content"></p>
                    </div>
                </div>
            </div>
        </div>`;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(container);
    }
}
window.customElements.define("sci-modal", SciChartDashboardModal);