require('./index.css');

const delimiterIcon = require('./icons/delimiter.js');
const asteriskIcon = require('./icons/asterisk.js');
const getLineWidthIcon = require('./icons/line.js');
const getThicknessIcon = require('./icons/thickness.js');

/**
 * Delimiter plugin for Editor.js
 * Supported config:
 *     * defaultStyle {string} (Default: 'star')
 *     * styleOptions {string[]} (Default: Delimiter.DELIMITER_STYLES)
 *     * defaultLineWidth {number} (Default: 25)
 *     * lineWidthOptions {number[]} (Default: Delimiter.SUPPORTED_LINE_WIDTHS)
 *     * defaultLineThickness {number} (Default: 2)
 *     * lineThicknessOptions {number[]} (Default: Delimiter.LINE_THICKNESS)
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
      icon: delimiterIcon, title: 'Delimiter',
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
  static get SUPPORTED_LINE_WIDTHS() {
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
   * @type {number[]}
   */
  static get LINE_THICKNESS() {
    return [1, 2, 3, 4, 5, 6];
  }

  /**
   * Default thickness for delimiter line style
   *
   * @static
   * @readonly
   * @type {number}
   */
  static get DEFAULT_LINE_THICKNESS() {
    return 2;
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
      wrapper: 'ce-delimiter',
      wrapperForStyle: (style) => `ce-delimiter-${style}`,
      wrapperForThickness: (thickness) => `ce-delimiter-thickness-${thickness}`,
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
    return this._config.styleOptions ? Delimiter.DELIMITER_STYLES.filter(
      (style) => this._config.styleOptions.includes(style),
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
    return this._config.lineWidthOptions ? Delimiter.SUPPORTED_LINE_WIDTHS.filter(
      (width) => this._config.lineWidthOptions.includes(width),
    ) : Delimiter.SUPPORTED_LINE_WIDTHS;
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
   * @type {number[]}
   */
  get availableLineThickness() {
    return this._config.lineThicknessOptions ? Delimiter.LINE_THICKNESS.filter(
      (thickness) => this._config.lineThicknessOptions.includes(thickness),
    ) : Delimiter.LINE_THICKNESS;
  }

  /**
   * User's default line thickness
   * - Finds union of user choice and the actual default
   *
   * @readonly
   * @type {number}
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
   * @returns {{ style: string; lineWidth: number; lineThickness: number; }}
   */
  _normalizeData(data) {
    const newData = {};
    if (typeof data !== 'object') {
      data = {};
    }

    newData.style = data.style || this.userDefaultDelimiterStyle;
    newData.lineWidth = parseInt(data.lineWidth, 10) || this.userDefaultLineWidth;
    newData.lineThickness = parseInt(data.lineThickness, 10) || this.userDefaultLineThickness;
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
   * @type {number}
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

  
  /**
   * Create a child element of the block parent
   *
   * @returns {*}
   */
  _createChildElement() {
    const delimiterMap = {
      'star': '***',
      'dash': '———'
    };

    let child;

    if (this.currentDelimiterStyle in delimiterMap) {
      child = document.createElement('span');
      child.textContent = delimiterMap[this.currentDelimiterStyle];
    } else {
      child = document.createElement('hr');
      child.style.width = `${this.currentLineWidth}%`;
      child.classList.add(this._CSS.wrapperForThickness(this.currentLineThickness));
    }

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
    div.appendChild(this._createChildElement());
    return div;
  }

  /**
   * Replace the current element with a new one
   */
  _replaceElement() {
    if (this._element.parentNode) {
      const newElement = this._getElement();
      this._element.parentNode.replaceChild(newElement, this._element);
      this._element = newElement;
    }
  }

  /**
   * Callback for Delimiter style change to star
   */
  _setStar() {
    if (this.currentDelimiterStyle !== 'star') {
      this._data.style = 'star';
      this._replaceElement();
    }
  }

  /**
   * Callback for Delimiter style change to dash
   */
  _setDash() {
    if (this.currentDelimiterStyle !== 'dash') {
      this._data.style = 'dash';
      this._replaceElement();
    }
  }

  /**
   * Callback for Delimiter style change (to line) or line width change
   *
   * @param {number} newWidth
   */
  _setLine(newWidth) {
    this._data.lineWidth = newWidth;

    if (this.currentDelimiterStyle !== 'line') {
      this._data.style = 'line';
      this._replaceElement();
    } else {
      // Change hr width
      const hrElement = this._element.querySelector('hr');
      if (hrElement) {
        hrElement.style.width = `${newWidth}%`;
      }
    }
  }

  /**
   * Callback for line thickness change
   *
   * @param {number} newThickness
   */
  _setLineThickness(newThickness) {
    this._data.lineThickness = newThickness;

    // Change hr thickness
    const hrElement = this._element.querySelector('hr');
    if (hrElement) {
      Delimiter.LINE_THICKNESS.forEach((thickness) => {
        const thicknessClass = this._CSS.wrapperForThickness(thickness);
  
        // Remove the old thickness class
        hrElement.classList.remove(thicknessClass);
  
        if (newThickness === thickness) {
          // Add the new thickness class
          hrElement.classList.add(thicknessClass);
        }
      });
    }
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
   * @returns {{ style: string; lineWidth: number; lineThickness: number; }}
   */
  save() {
    if (this.currentDelimiterStyle === 'line') {
      return {
        style: this.currentDelimiterStyle,
        lineWidth: this.currentLineWidth,
        lineThickness: this.currentLineThickness,
      };
    }
    return {
      style: this.currentDelimiterStyle
    };
  }

  /**
   * Get formatted label for Block settings menu
   *
   * @param {string} name
   * @param {string} prefix
   * @returns {string}
   */
  _getFormattedLabel(name, prefix, suffix) {
    if (prefix || suffix) {
      return this._api.i18n.t(`${prefix || ''}${name}${suffix || ''}`);
    }
    return this._api.i18n.t(name.charAt(0).toUpperCase() + name.slice(1));
  }

  /**
   * Create a Block menu setting
   *
   * @param {string} icon
   * @param {string} label
   * @param {*} onActivate
   * @param {boolean} isActive
   * @param {string} group
   * @returns {{ icon: string; label: string; onActivate: any; isActive: boolean; closeOnActivate: boolean; toggle: string; }}
   */
  _createSetting = (icon, label, onActivate, isActive, group) => ({
    icon,
    label,
    onActivate,
    isActive,
    closeOnActivate: true,
    toggle: group,
  });

  /**
   * Block settings menu items
   *
   * @returns {[{*}]}
   */
  renderSettings() {
    const starStyle = this._createSetting(
      asteriskIcon, 'Star', () => this._setStar(), this.currentDelimiterStyle === 'star', 'star'
    );
    const dashStyle = this._createSetting(
      delimiterIcon, 'Dash', () => this._setDash(), this.currentDelimiterStyle === 'dash', 'dash'
    );
    const lineWidths = this.availableLineWidths.map(width => 
      this._createSetting(
        getLineWidthIcon(width), this._getFormattedLabel(width, 'Line ', '%'), () => this._setLine(width), 
        this.currentDelimiterStyle === 'line' && width === this.currentLineWidth, 'line'
      )
    );
    let lineThickness = [];
    if (this.currentDelimiterStyle === 'line') {
      lineThickness = this.availableLineThickness.map(thickness => 
        this._createSetting(
          getThicknessIcon(thickness), this._getFormattedLabel(thickness, 'Thickness '), 
          () => this._setLineThickness(thickness), thickness === this.currentLineThickness, 'thickness')
      );
    }

    return [starStyle, dashStyle, ...lineWidths, ...lineThickness];
  }
}
