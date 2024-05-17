require('./index.css');

import { IconDelimiter } from '@codexteam/icons';

/**
 * Delimiter plugin for Editor.js
 * Supported config:
 *     * defaultStyle {string} (Default: 'star')
 *     * styles {string[]} (Default: Delimiter.DELIMITER_STYLES)
 *     * defaultLineWidth {number} (Default: 25)
 *     * lineWidths {number[]} (Default: Delimiter.LINE_WIDTHS)
 *     * defaultLineThickness {string} (Default: '1px')
 *     * lineThickness {string[]} (Default: Delimiter.LINE_THICKNESS)
 *
 * @class Delimiter
 * @typedef {Delimiter}
 */
export default class Delimiter {
  /**
   * Editor.js Toolbox settings
   *
   * @static
   * @readonly
   * @type {{ icon: any; title: string; }}
   */
  static get toolbox() {
    return {
      icon: IconDelimiter, title: 'Delimiter',
    };
  }

  /**
   * To notify Editor.js core that read-only is supported
   *
   * @static
   * @readonly
   * @type {boolean}
   */
  static get isReadOnlySupported() {
    return true;
  }

  /**
   * All supported delimiter styles
   *
   * @static
   * @readonly
   * @type {string[]}
   */
  static get DELIMITER_STYLES() {
    return ['star', 'dash', 'line'];
  }

  /**
   * Default delimiter style
   *
   * @static
   * @readonly
   * @type {string}
   */
  static get DEFAULT_DELIMITER_STYLE() {
    return 'star';
  }

  /**
   * All supported widths for delimiter line style
   *
   * @static
   * @readonly
   * @type {number[]}
   */
  static get LINE_WIDTHS() {
    return [8, 15, 25, 35, 50, 60, 100];
  }

  /**
   * Default width for delimiter line style
   *
   * @static
   * @readonly
   * @type {number}
   */
  static get DEFAULT_LINE_WIDTH() {
    return 25;
  }

  /**
   * All supported thickness options for delimiter line style
   *
   * @static
   * @readonly
   * @type {string[]}
   */
  static get LINE_THICKNESS() {
    return ['0.5px', '1px', '1.5px', '2px', '2.5px', '3px'];
  }

  /**
   * Default thickness for delimiter line style
   *
   * @static
   * @readonly
   * @type {string}
   */
  static get DEFAULT_LINE_THICKNESS() {
    return '1px';
  }

  /**
   * Automatic sanitize config for Editor.js
   *
   * @static
   * @readonly
   * @type {{ style: boolean; lineWidth: boolean; lineThickness: boolean; }}
   */
  static get sanitize() {
    return {
      style: false,
      lineWidth: false,
      lineThickness: false,
    };
  }

  /**
   * Creates an instance of Delimiter.
   *
   * @constructor
   * @param {{ api: {}; config: {}; data: {}; }} props
   */
  constructor({
    api, config, data,
  }) {
    this._api = api;
    this._config = config || {};
    this._data = this._normalizeData(data);
    this._CSS = {
      block: this._api.styles.block,
      wrapper: 'cb-delimiter',
      wrapperForStyle: (style) => `cb-delimiter-${style}`,
    };
    this._element = this._getElement();
  }

  /**
   * All available delimiter styles
   * - Finds intersection between supported and user selected delimiter styles
   *
   * @readonly
   * @type {string[]}
   */
  get availableDelimiterStyles() {
    return this._config.styles ? Delimiter.DELIMITER_STYLES.filter(
      (style) => this._config.styles.includes(style),
    ) : Delimiter.DELIMITER_STYLES;
  }

  /**
   * User's default delimiter style
   * - Finds union of user choice and the actual default
   *
   * @readonly
   * @type {string}
   */
  get userDefaultDelimiterStyle() {
    if (this._config.defaultStyle) {
      const userSpecified = this.availableDelimiterStyles.find(
        (style) => style === this._config.defaultStyle,
      );
      if (userSpecified) {
        return userSpecified;
      }
      // eslint-disable-next-line no-console
      console.warn('(ง\'̀-\'́)ง Delimiter Tool: the default style specified is invalid');
    }
    return Delimiter.DEFAULT_DELIMITER_STYLE;
  }

  /**
   * All available widths for delimiter line style
   * - Finds all valid user selected line widths (falls back to default when empty)
   *
   * @readonly
   * @type {number[]}
   */
  get availableLineWidths() {
    return this._config.lineWidths ? Delimiter.LINE_WIDTHS.filter(
      (width) => this._config.lineWidths.includes(width),
    ) : Delimiter.LINE_WIDTHS;
  }

  /**
   * User's default line width
   * - Finds union of user choice and the actual default
   *
   * @readonly
   * @type {number}
   */
  get userDefaultLineWidth() {
    if (this._config.defaultLineWidth) {
      const userSpecified = this.availableLineWidths.find(
        (width) => width === this._config.defaultLineWidth,
      );
      if (userSpecified) {
        return userSpecified;
      }
      // eslint-disable-next-line no-console
      console.warn('(ง\'̀-\'́)ง Delimiter Tool: the default line width specified is invalid');
    }
    return Delimiter.DEFAULT_LINE_WIDTH;
  }

  /**
   * All available line thickness options
   * - Finds intersection between supported and user selected line thickness options
   *
   * @readonly
   * @type {string[]}
   */
  get availableLineThickness() {
    return this._config.lineThickness ? Delimiter.LINE_THICKNESS.filter(
      (thickness) => this._config.lineThickness.includes(thickness),
    ) : Delimiter.LINE_THICKNESS;
  }

  /**
   * User's default line thickness
   * - Finds union of user choice and the actual default
   *
   * @readonly
   * @type {string}
   */
  get userDefaultLineThickness() {
    if (this._config.defaultLineThickness) {
      const userSpecified = this.availableLineThickness.find(
        (thickness) => thickness === this._config.defaultLineThickness,
      );
      if (userSpecified) {
        return userSpecified;
      }
      // eslint-disable-next-line no-console
      console.warn('(ง\'̀-\'́)ง Delimiter Tool: the default line thickness specified is invalid');
    }
    return Delimiter.DEFAULT_LINE_THICKNESS;
  }

  /**
   * To normalize input data
   *
   * @param {*} data
   * @returns {{ style: string; lineWidth: number; lineThickness: string; }}
   */
  _normalizeData(data) {
    const newData = {};
    if (typeof data !== 'object') {
      data = {};
    }

    newData.style = data.style || this.userDefaultDelimiterStyle;
    newData.lineWidth = parseInt(data.lineWidth, 10) || this.userDefaultLineWidth;
    newData.lineThickness = data.lineThickness || this.userDefaultLineThickness;
    return newData;
  }

  /**
   * Current delimiter style
   *
   * @readonly
   * @type {string}
   */
  get currentDelimiterStyle() {
    let delimiterStyle = this.availableDelimiterStyles.find((style) => style === this._data.style);
    if (!delimiterStyle) {
      delimiterStyle = this.userDefaultDelimiterStyle;
    }
    return delimiterStyle;
  }

  /**
   * Current width for delimiter line style
   *
   * @readonly
   * @type {number}
   */
  get currentLineWidth() {
    let lineWidth = this.availableLineWidths.find((width) => width === this._data.lineWidth);
    if (!lineWidth) {
      lineWidth = this.userDefaultLineWidth;
    }
    return lineWidth;
  }

  /**
   * Current thickness for delimiter line style
   *
   * @readonly
   * @type {string}
   */
  get currentLineThickness() {
    let lineThickness = this.availableLineThickness.find(
      (thickness) => thickness === this._data.lineThickness,
    );
    if (!lineThickness) {
      lineThickness = this.userDefaultLineThickness;
    }
    return lineThickness;
  }

  createChildElement() {
    let child;
    if (this.currentDelimiterStyle === 'star') {
      child = document.createElement('span');
      child.textContent = '***';
      return child;
    } if (this.currentDelimiterStyle === 'dash') {
      child = document.createElement('span');
      child.textContent = '———';
      return child;
    }
    child = document.createElement('hr');
    child.style.width = `${this.currentLineWidth}%`;
    child.style.borderWidth = this.currentLineThickness;
    return child;
  }

  /**
   * Create and return block element
   *
   * @returns {*}
   */
  _getElement() {
    const div = document.createElement('DIV');
    div.classList.add(
      this._CSS.wrapper,
      this._CSS.block,
      this._CSS.wrapperForStyle(this.currentDelimiterStyle),
    );
    div.appendChild(this.createChildElement());
    return div;
  }

  /**
   * Callback for Delimiter style change to star
   */
  _setStar() {
    if (this.currentDelimiterStyle !== 'star') {
      this._data.style = 'star';

      // Replace hr child with span child
      if (this._element.parentNode) {
        const newElement = this._getElement();
        this._element.parentNode.replaceChild(newElement, this._element);
        this._element = newElement;
      }
    }
  }

  /**
   * Callback for Delimiter style change to dash
   */
  _setDash() {
    if (this.currentDelimiterStyle !== 'dash') {
      this._data.style = 'dash';

      // Replace hr child with span child
      if (this._element.parentNode) {
        const newElement = this._getElement();
        this._element.parentNode.replaceChild(newElement, this._element);
        this._element = newElement;
      }
    }
  }

  /**
   * Callback for Delimiter style change to line or line width change
   *
   * @param {number} newWidth
   */
  _setLine(newWidth) {
    this._data.lineWidth = newWidth;

    if (this.currentDelimiterStyle !== 'line') {
      this._data.style = 'line';

      // Replace span child with hr child
      if (this._element.parentNode) {
        const newElement = this._getElement();
        this._element.parentNode.replaceChild(newElement, this._element);
        this._element = newElement;
      }
    } else {
      // Change hr width
      const hrElement = this._element.querySelector('hr');
      hrElement.style.width = `${newWidth}%`;
    }
  }

  /**
   * Callback for line thickness change
   *
   * @param {string} newThickness
   */
  _setLineThickness(newThickness) {
    this._data.lineThickness = newThickness;

    // Change hr thickness
    const hrElement = this._element.querySelector('hr');
    hrElement.style.borderWidth = newThickness;
  }

  /**
   * HTML element to render on the UI by Editor.js
   *
   * @returns {*}
   */
  render() {
    return this._element;
  }

  /**
   * Editor.js save method to extract block data from the UI
   *
   * @param {*} blockContent
   * @returns {{ style: string; lineWidth: number; lineThickness: string; }}
   */
  save() {
    return {
      style: this.currentDelimiterStyle,
      lineWidth: this.currentLineWidth,
      lineThickness: this.currentLineThickness,
    };
  }

  /**
   * Block Tunes Menu items
   *
   * @returns {[{*}]}
   */
  renderSettings() {
    const starStyle = [{
      icon: IconDelimiter,
      label: 'Star',
      onActivate: () => this._setStar(),
      isActive: this.currentDelimiterStyle === 'star',
      closeOnActivate: true,
      toggle: 'star',
    }];
    const dashStyle = [{
      icon: IconDelimiter,
      label: 'Dash',
      onActivate: () => this._setDash(),
      isActive: this.currentDelimiterStyle === 'dash',
      closeOnActivate: true,
      toggle: 'dash',
    }];
    const lineWidths = this.availableLineWidths.map((width) => ({
      icon: IconDelimiter,
      label: `Line ${width}%`,
      onActivate: () => this._setLine(width),
      isActive: this.currentDelimiterStyle === 'line' && width === this.currentLineWidth,
      closeOnActivate: true,
      toggle: 'line',
    }));
    let lineThickness = [];
    if (this.currentDelimiterStyle === 'line') {
      lineThickness = this.availableLineThickness.map((thickness) => ({
        icon: IconDelimiter,
        label: `Thickness ${parseInt(parseFloat(thickness) * 2, 10)}`,
        onActivate: () => this._setLineThickness(thickness),
        isActive: thickness === this.currentLineThickness,
        closeOnActivate: true,
        toggle: 'thickness',
      }));
    }

    return [...starStyle, ...dashStyle, ...lineWidths, ...lineThickness];
  }
}
