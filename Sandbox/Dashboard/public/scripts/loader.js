
class SciChartDashboardLoader extends HTMLElement {
    static get observedAttributes() { return ['loaded']; }
    constructor() {
        super();
    }

    connectedCallback() {
        this._render();
    }

    attributeChangedCallback(name, value, updatedValue) {
        console.log(name, name === 'loaded' && updatedValue === "true");
        if (name === 'loaded' && updatedValue === "true") {
            this.shadowRoot.querySelector('.wrapper').classList.add('loaded');
        }
    }

    _render() {
        const container = document.createElement("div");
        container.innerHTML = `
        <style>

            .wrapper.loaded {
                display: none;
            }

            .wrapper {
                background-color: rgba(28, 34, 50, 1);
                width: 100vw;
                height: 100vh;
                position: fixed;
                left: 0;
                top: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            }
            .loader {
                position: relative;
            }
          .loader .dot {
            -webkit-animation-name: movement;
                    animation-name: movement;
            -webkit-animation-duration: 2s;
                    animation-duration: 2s;
            -webkit-animation-iteration-count: infinite;
                    animation-iteration-count: infinite;
            -webkit-animation-timing-function: ease-in-out;
                    animation-timing-function: ease-in-out;
            height: 10px;
            position: absolute;
            top: -10px;
            transform: translate3d(0, -25px, 0) scale(1);
            width: 10px;
          }
          .loader .dot:nth-of-type(1) {
            -webkit-animation-delay: -0.1s;
                    animation-delay: -0.1s;
            left: 150px;
          }
          .loader .dot:nth-of-type(1)::before {
            -webkit-animation-delay: -0.1s;
                    animation-delay: -0.1s;
          }
          .loader .dot:nth-of-type(2) {
            -webkit-animation-delay: -1.2s;
                    animation-delay: -1.2s;
            left: 150px;
          }
          .loader .dot:nth-of-type(2)::before {
            -webkit-animation-delay: -1.2s;
                    animation-delay: -1.2s;
          }
          .loader .dot:nth-of-type(3) {
            -webkit-animation-delay: -0.3s;
                    animation-delay: -0.3s;
            left: 125px;
          }
          .loader .dot:nth-of-type(3)::before {
            -webkit-animation-delay: -0.3s;
                    animation-delay: -0.3s;
          }
          .loader .dot:nth-of-type(4) {
            -webkit-animation-delay: -1.4s;
                    animation-delay: -1.4s;
            left: 125px;
          }
          .loader .dot:nth-of-type(4)::before {
            -webkit-animation-delay: -1.4s;
                    animation-delay: -1.4s;
          }
          .loader .dot:nth-of-type(5) {
            -webkit-animation-delay: -0.5s;
                    animation-delay: -0.5s;
            left: 100px;
          }
          .loader .dot:nth-of-type(5)::before {
            -webkit-animation-delay: -0.5s;
                    animation-delay: -0.5s;
          }
          .loader .dot:nth-of-type(6) {
            -webkit-animation-delay: -1.6s;
                    animation-delay: -1.6s;
            left: 100px;
          }
          .loader .dot:nth-of-type(6)::before {
            -webkit-animation-delay: -1.6s;
                    animation-delay: -1.6s;
          }
          .loader .dot:nth-of-type(7) {
            -webkit-animation-delay: -0.7s;
                    animation-delay: -0.7s;
            left: 75px;
          }
          .loader .dot:nth-of-type(7)::before {
            -webkit-animation-delay: -0.7s;
                    animation-delay: -0.7s;
          }
          .loader .dot:nth-of-type(8) {
            -webkit-animation-delay: -1.8s;
                    animation-delay: -1.8s;
            left: 75px;
          }
          .loader .dot:nth-of-type(8)::before {
            -webkit-animation-delay: -1.8s;
                    animation-delay: -1.8s;
          }
          .loader .dot:nth-of-type(9) {
            -webkit-animation-delay: -0.9s;
                    animation-delay: -0.9s;
            left: 50px;
          }
          .loader .dot:nth-of-type(9)::before {
            -webkit-animation-delay: -0.9s;
                    animation-delay: -0.9s;
          }
          .loader .dot:nth-of-type(10) {
            -webkit-animation-delay: -2s;
                    animation-delay: -2s;
            left: 50px;
          }
          .loader .dot:nth-of-type(10)::before {
            -webkit-animation-delay: -2s;
                    animation-delay: -2s;
          }
          .loader .dot:nth-of-type(11) {
            -webkit-animation-delay: -1.1s;
                    animation-delay: -1.1s;
            left: 25px;
          }
          .loader .dot:nth-of-type(11)::before {
            -webkit-animation-delay: -1.1s;
                    animation-delay: -1.1s;
          }
          .loader .dot:nth-of-type(12) {
            -webkit-animation-delay: -2.2s;
                    animation-delay: -2.2s;
            left: 25px;
          }
          .loader .dot:nth-of-type(12)::before {
            -webkit-animation-delay: -2.2s;
                    animation-delay: -2.2s;
          }
          .loader .dot:nth-of-type(13) {
            -webkit-animation-delay: -1.3s;
                    animation-delay: -1.3s;
            left: 0px;
          }
          .loader .dot:nth-of-type(13)::before {
            -webkit-animation-delay: -1.3s;
                    animation-delay: -1.3s;
          }
          .loader .dot:nth-of-type(14) {
            -webkit-animation-delay: -2.4s;
                    animation-delay: -2.4s;
            left: 0px;
          }
          .loader .dot:nth-of-type(14)::before {
            -webkit-animation-delay: -2.4s;
                    animation-delay: -2.4s;
          }
          .loader .dot:nth-of-type(15) {
            -webkit-animation-delay: -1.5s;
                    animation-delay: -1.5s;
            left: -25px;
          }
          .loader .dot:nth-of-type(15)::before {
            -webkit-animation-delay: -1.5s;
                    animation-delay: -1.5s;
          }
          .loader .dot:nth-of-type(16) {
            -webkit-animation-delay: -2.6s;
                    animation-delay: -2.6s;
            left: -25px;
          }
          .loader .dot:nth-of-type(16)::before {
            -webkit-animation-delay: -2.6s;
                    animation-delay: -2.6s;
          }
          .loader .dot:nth-of-type(17) {
            -webkit-animation-delay: -1.7s;
                    animation-delay: -1.7s;
            left: -50px;
          }
          .loader .dot:nth-of-type(17)::before {
            -webkit-animation-delay: -1.7s;
                    animation-delay: -1.7s;
          }
          .loader .dot:nth-of-type(18) {
            -webkit-animation-delay: -2.8s;
                    animation-delay: -2.8s;
            left: -50px;
          }
          .loader .dot:nth-of-type(18)::before {
            -webkit-animation-delay: -2.8s;
                    animation-delay: -2.8s;
          }
          .loader .dot:nth-of-type(19) {
            -webkit-animation-delay: -1.9s;
                    animation-delay: -1.9s;
            left: -75px;
          }
          .loader .dot:nth-of-type(19)::before {
            -webkit-animation-delay: -1.9s;
                    animation-delay: -1.9s;
          }
          .loader .dot:nth-of-type(20) {
            -webkit-animation-delay: -3s;
                    animation-delay: -3s;
            left: -75px;
          }
          .loader .dot:nth-of-type(20)::before {
            -webkit-animation-delay: -3s;
                    animation-delay: -3s;
          }
          .loader .dot:nth-of-type(21) {
            -webkit-animation-delay: -2.1s;
                    animation-delay: -2.1s;
            left: -100px;
          }
          .loader .dot:nth-of-type(21)::before {
            -webkit-animation-delay: -2.1s;
                    animation-delay: -2.1s;
          }
          .loader .dot:nth-of-type(22) {
            -webkit-animation-delay: -3.2s;
                    animation-delay: -3.2s;
            left: -100px;
          }
          .loader .dot:nth-of-type(22)::before {
            -webkit-animation-delay: -3.2s;
                    animation-delay: -3.2s;
          }
          .loader .dot:nth-of-type(23) {
            -webkit-animation-delay: -2.3s;
                    animation-delay: -2.3s;
            left: -125px;
          }
          .loader .dot:nth-of-type(23)::before {
            -webkit-animation-delay: -2.3s;
                    animation-delay: -2.3s;
          }
          .loader .dot:nth-of-type(24) {
            -webkit-animation-delay: -3.4s;
                    animation-delay: -3.4s;
            left: -125px;
          }
          .loader .dot:nth-of-type(24)::before {
            -webkit-animation-delay: -3.4s;
                    animation-delay: -3.4s;
          }
          .loader .dot:nth-of-type(25) {
            -webkit-animation-delay: -2.5s;
                    animation-delay: -2.5s;
            left: -150px;
          }
          .loader .dot:nth-of-type(25)::before {
            -webkit-animation-delay: -2.5s;
                    animation-delay: -2.5s;
          }
          .loader .dot:nth-of-type(26) {
            -webkit-animation-delay: -3.6s;
                    animation-delay: -3.6s;
            left: -150px;
          }
          .loader .dot:nth-of-type(26)::before {
            -webkit-animation-delay: -3.6s;
                    animation-delay: -3.6s;
          }
          .loader .dot::before {
            -webkit-animation-name: size-opacity;
                    animation-name: size-opacity;
            -webkit-animation-duration: 2s;
                    animation-duration: 2s;
            -webkit-animation-iteration-count: infinite;
                    animation-iteration-count: infinite;
            -webkit-animation-timing-function: ease;
                    animation-timing-function: ease;
            background: rgba(19, 174, 255, 1);
            border-radius: 50%;
            content: "";
            display: block;
            height: 100%;
            width: 100%;
          }
          .loader .dot:nth-of-type(even)::before {
            background-color: rgba(186, 103, 157, 1);
            box-shadow: inset 0 0 4px #ff1492;
          }
          
          @-webkit-keyframes movement {
            0% {
              transform: translate3d(0, -25px, 0);
              z-index: 0;
            }
            50% {
              transform: translate3d(0, 25px, 0);
              z-index: 10;
            }
            100% {
              transform: translate3d(0, -25px, 0);
              z-index: -5;
            }
          }
          
          @keyframes movement {
            0% {
              transform: translate3d(0, -25px, 0);
              z-index: 0;
            }
            50% {
              transform: translate3d(0, 25px, 0);
              z-index: 10;
            }
            100% {
              transform: translate3d(0, -25px, 0);
              z-index: -5;
            }
          }
          @-webkit-keyframes size-opacity {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            25% {
              transform: scale(1.5);
            }
            50% {
              opacity: 1;
            }
            75% {
              opacity: 0.35;
              transform: scale(0.5);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes size-opacity {
            0% {
              opacity: 1;
              transform: scale(1);
            }
            25% {
              transform: scale(1.5);
            }
            50% {
              opacity: 1;
            }
            75% {
              opacity: 0.35;
              transform: scale(0.5);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        </style>
        <div class="wrapper">
            <div class="loader">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>`;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(container);
    }
}
window.customElements.define("sci-loader", SciChartDashboardLoader);