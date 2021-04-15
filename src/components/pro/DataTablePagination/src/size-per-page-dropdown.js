import React from 'react';
import cs from 'classnames';
import PropTypes from 'prop-types';
import { MDBSelect, MDBSelectInput, MDBSelectOptions, MDBSelectOption } from '../../../../';

const sizePerPageDefaultClass = 'react-bs-table-sizePerPage-dropdown';

class SizePerPageDropDown extends React.Component {
  render() {
    const {
      open,
      hidden,
      options,
      className,
      variation,
      onSizePerPageChange
    } = this.props;

    const dropDownStyle = { visibility: hidden ? 'hidden' : 'visible' };
    const dropdownClasses = cs(
      open ? 'open show' : '',
      sizePerPageDefaultClass,
      variation,
      className,
    );

    return (
      <span
        style={ dropDownStyle }
        className={ dropdownClasses }
      >
        Show entries
        <MDBSelect>
          <MDBSelectInput selected="10"></MDBSelectInput>
          <MDBSelectOptions>
            {
              options.map(option => (
                <MDBSelectOption
                  key={option.text}
                  data-page={option.page}
                  onMouseDown={ (e) => {
                    e.preventDefault();
                    onSizePerPageChange(option.page);
                  } }
                >
                  { option.text }
                </MDBSelectOption>
              ))
            }
          </MDBSelectOptions>
        </MDBSelect>
      </span>
    );
  }
}

SizePerPageDropDown.propTypes = {
  currSizePerPage: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onSizePerPageChange: PropTypes.func.isRequired,
  open: PropTypes.bool,
  hidden: PropTypes.bool,
  btnContextual: PropTypes.string,
  variation: PropTypes.oneOf(['dropdown', 'dropup']),
  className: PropTypes.string
};
SizePerPageDropDown.defaultProps = {
  open: false,
  hidden: false,
  btnContextual: 'btn-default',
  variation: 'dropdown',
  className: ''
};


export default SizePerPageDropDown;
