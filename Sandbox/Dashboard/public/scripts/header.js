class SciChartDashboardHeader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this._render();
    }

    _render() {
        const container = document.createElement("div");
        container.innerHTML = `
        <style>
            * {
                box-sizing: border-box
            }
            nav {
                height: 64px;
                line-height: 64px;
                color: #fff;
                background-color: rgba(255, 255, 255, 1);
                width: 100%;
                padding-left: 15px;
                padding-right: 15px;
                box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
                position: relative;
                z-index: 10;
            }
            nav .brand-logo {
                position: absolute;
                color: #fff;
                display: inline-block;
                font-size: 2.1rem;
                padding: 10px 15px 0;
            }
            ul {
                padding-left: 0;
                list-style-type: none;
                margin: 0;
            }
            .right {
                float: right !important;
            }
            li {
                list-style-type: none;
                transition: background-color .3s;
                float: left;
                padding: 0;
            }
            a {
                transition: background-color .3s;
                font-size: 1rem;
                color: rgba(28, 34, 50, 1);
                background-color: #fff;
                display: block;
                padding: 0 15px;
                cursor: pointer;
                text-decoration: none;
                transition: background-color .3s ease-in;
            }
            a:not(.brand-logo):hover, nav ul li.active {
                transition: background-color .3s ease-out;
                background-color: rgba(28, 34, 50, 1);
                color: #fff;
            }
        </style>
        <nav>
            <div class="nav-wrapper">
            <a href="https://www.scichart.com/" class="brand-logo">
                <img src="https://www.scichart.com/wp-content/uploads/2019/10/scichart-logo-making-impossible-projects-possible@2x.png" alt="Fast, Native Charts for WPF, iOS, Android, JavaScript " width="209" style="width: 209px; height: 42px;" height="42">
            </a>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                <li><a href="#animate">Animate</a></li>
                <li><a href="#tooltip">Developer Mode</a></li>
                <li><a href="#lightMode">Light Mode</a></li>
            </ul>
            </div>
        </nav>`;

        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.appendChild(container);
    }
}
window.customElements.define("sci-header", SciChartDashboardHeader);