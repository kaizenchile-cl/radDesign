import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Select extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectValue: ''
    };
  }
  
  componentDidMount() {
    document.addEventListener('click', this.onClick);
  }

  componentDidUpdate(props, state) {
    if(state.selectValue !== this.state.selectValue && typeof this.props.getValue == 'function') {
      this.props.getValue(this.state.selectValue);
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClick);
  }

  getChildContext() {
    return {
      selectValue: this.state.selectValue,
      triggerOptionChange: this.triggerOptionChange,
      multiple: this.props.multiple
    }
  }

  triggerOptionChange = (option) => {
    (Array.isArray(option)) && (option = option.join(', '));
    this.setState({ selectValue: option });
  }

  // close all select dropdown (unless it has multiple property)
  // open nieghbour ul of clicked input
  onClick = (e) => {
    if (e.target.dataset.multiple === 'true') return;
    this.closeDropdowns();
    e.target.nextElementSibling && e.target.nextElementSibling.classList.add('fadeIn');
  }

  closeDropdowns = () => {
    let dropdowns = document.querySelectorAll('.dropdown-content');
    dropdowns.forEach(dropdown => dropdown.classList.contains('fadeIn') && dropdown.classList.remove('fadeIn'));
  }

  render() {
    const {
      className,
      children,
      multiple,
      color,
      getValue,
      ...attributes
    } = this.props;

    const classes = classNames(
      'select-wrapper',
      this.props.color ? 'colorful-select dropdown-' + this.props.color : '',
      className
    );

    return (
      <div {...attributes} data-color={color} data-multiple={multiple} value={this.state.selectValue} className={classes}>
        <span className="caret">▼</span>
        {children}
      </div>
    );
  }
}

Select.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  color: PropTypes.string,
  getValue: PropTypes.func,
  multiple: PropTypes.bool,
  value: PropTypes.string
};

Select.defaultProps = {
  children: 'div',
  className: '',
  color: '',
  getValue: () => {},
  multiple: false,
  value: ''
};

Select.childContextTypes = {
  selectValue: PropTypes.string.isRequired,
  triggerOptionChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool
};

export default Select;
export { Select as MDBSelect };
