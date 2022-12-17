class Card extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const colors = {
      red: '#F38181',
      orange: '#FCE38A',
      white: '#EAFFD0',
      blue: '#95E1D3',
    };

    const name = this.getAttribute('name');
    const description = this.getAttribute('desc');
    const img = this.getAttribute('img');
    const link = this.getAttribute('href');
    const isWide = this.getAttribute('wide');

    if (isWide?.length === 0) {
      console.log('a');
    }

    const html = `
      ${link ? `<a href="${link}" target="_blank">` : ''}
        <div class="card ${isWide?.length === 0 ? 'wide' : null}">
          ${
            img
              ? `<div class="img-wrap">
            <img src="${img}" alt="${name}" />
          </div>`
              : ''
          }
          <div class="detail-wrap">
            <h2>${name}</h2>
            <p>${description}</p>
          </div>
        </div>
      ${link ? `</a>` : ''}
    `;

    this.innerHTML = html;
  }

  static get observedAttributes() {
    return ['img', 'name', 'desc', 'color'];
  }

  attributeChangedCallback() {
    this.render();
  }
}

customElements.define('card-', Card);
