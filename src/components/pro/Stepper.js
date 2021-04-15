import React from 'react';
import classNames from 'classnames';
import './Stepper.css';

class Stepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {

    const {
      tag: Tag,
      vertical,
      form,
      icon,
    } = this.props

    const stepperClass = classNames(
      form ? 'steps-form' : (icon && vertical) ? 'steps-form-3' : (icon && !vertical) ? 'steps-form-2' : 'stepper',
      (vertical && !icon) ? 'stepper-vertical' : (form || icon) ? null : 'stepper-horizontal',
      this.props.className
    );

    const wrapperFix = classNames(
      form ? 'steps-row' : (icon && vertical) ? 'steps-row-3 d-flex justify-content-between' : (icon && !vertical) ? 'steps-row-2 d-flex justify-content-between' : null
    )

    // wrapper shim in case this.props.form
    let stepper;
    if (form || icon) {
      stepper = (<div className={stepperClass}>
                  <div className={wrapperFix}>
                    {this.props.children}
                  </div>
                </div>)
    } else {
      stepper = (<ul className={stepperClass}>
                  {this.props.children}
                </ul>)
    }

    return(
      stepper
    );
  };
}

Stepper.defaultProps = {
  tag: 'ul',
  form: false
}

export default Stepper;
export { Stepper as MDBStepper }
