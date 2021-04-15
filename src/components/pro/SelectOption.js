import React from 'react';
import ReactDOM, { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Option extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      multiple: false,
      checked: false
    };

    this.optionRef = React.createRef();
  }

  componentDidMount() {
    this.setState({ multiple: this.context.multiple });
  }
  
  selectOption = (e) => {
    if(!this.props.disabled) {
      let selectedOption = this.optionRef.current;
      let value;
      let options = selectedOption.parentNode.children;

      if(this.state.multiple) {
        value = [];
        if(selectedOption.classList.contains('active')) {
          selectedOption.classList.remove('active');
          this.setState({ checked: false });
        } 
        else {
          selectedOption.classList.add('active');
          this.setState({checked: true});
        }

        // iterate throught child nodes options and add checked to arr
        Array.prototype.forEach.call(options, option => option.classList.contains('active') && value.push(option.textContent));
        
        if(value.length === 0) {
          value = 'Choode your option';
        }
      } 
      else {
        Array.prototype.forEach.call(selectedOption.children, child => {
          if(child.nodeName == 'SPAN') {
            value = child.textContent;
          }
        });

        Array.prototype.forEach.call(options, option => option.classList.remove('active'));
        selectedOption.classList.add('active');
      }

      this.context.triggerOptionChange(value);
    }
  }

  render() {
    const {
      className,
      children,
      disabled,
      icon,
      triggerOptionClick,
      ...attributes
    } = this.props;

    const classes = classNames(
      disabled ? 'disabled' : '',
      className
    );

    let input = null;
    let label = null;
    if (this.state.multiple) {
      if (!disabled) {
        input = <input type="checkbox" className="form-check-input" checked={this.state.checked}  />;
        label = <label style={{height: '10px'}} data-multiple={this.state.multiple}></label>;
      } else {
        input = <input type="checkbox" className="form-check-input" disabled />;
        label = <label style={{height: '10px'}} data-multiple={this.state.multiple}></label>;
      }
    }

    return (
      <li ref={this.optionRef} {...attributes} data-multiple={this.state.multiple} className={classes} onClick={this.selectOption}>
        {
          icon && <img src={this.props.icon} alt="icon" className="rounded-circle" />
        }
        <span data-multiple={this.state.multiple} className="filtrable">
          {input}
          {label}
          {children}
        </span>
      </li>
    );
  }
}

Option.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  triggerOptionClick: PropTypes.func
};

Option.defaultProps = {
  children: 'span',
  className: '',
  disabled: false,
  icon: '',
  triggerOptionClick: () => {}
};

Option.contextTypes = {
  triggerOptionChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool
};

export default Option;
export { Option as MDBSelectOption };

