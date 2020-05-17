import {LitElement, html, customElement, property, css} from 'lit-element';
import {
  ConsoleLogger,
  DefaultDeviceController,
  DefaultMeetingSession,
  LogLevel,
  MeetingSessionConfiguration
} from 'amazon-chime-sdk-js';
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('my-element')
export class MyElement extends LitElement {

  constructor(){
    super();
    console.log('constructor initiated');
    
  }

  connectedCallback(){
    super.connectedCallback();
    console.log('connected callback');
    
  }
  static styles = css`
    :host {
      display: block;
      border: solid 1px gray;
      padding: 16px;
      max-width: 800px;
    }
  `;



  /**
   * The name to say "Hello" to.
   */
  @property()
  name = 'World1';

  /**
   * The number of times the button has been clicked.
   */
  @property({type: Number})
  count = 0;

  render() {
    return html`
      <h1>Hellox, ${this.name}!</h1>
      <button @click=${this._onClick} part="button">
        Click Count: ${this.count}
      </button>
      <slot></slot>
    `;
  }

  private _onClick() {
    this.count++;
  }

  foo(): string {
    return 'foo';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-element': MyElement;
  }
}
