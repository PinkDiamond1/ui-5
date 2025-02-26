import * as React from 'react'
import SemanticDatepicker from 'react-semantic-ui-datepickers'
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css'

import Input, {
  InputOnChangeData,
  InputProps
} from 'semantic-ui-react/dist/commonjs/elements/Input/Input'
import classnames from 'classnames'
import { Blockie } from '../Blockie/Blockie'
import { Button } from '../Button/Button'
import { Header } from '../Header/Header'
import './Field.css'

const DATE_TYPE = 'date'

export type FieldProps = InputProps & {
  /** Input label*/
  label?: string
  /** Boolean flag to show an error, default on false*/
  error?: boolean
  /** Message to display below the input*/
  message?: string
  /** Button text to display before input to dispatch an action*/
  action?: string
  /** On action function*/
  onAction?: (event: React.MouseEvent<HTMLButtonElement>) => void
  /** Style of input, default on simple*/
  kind?: 'simple' | 'full'
  /** Boolean flag to determine if it is resizable, default on false*/
  fitContent?: boolean
  /** Boolean flag to determine if datepicker can be cleared, default on true */
  isClearable?: boolean
}

export class Field extends React.PureComponent<FieldProps> {
  static defaultProps = {
    kind: 'simple',
    fitContent: false
  }

  hasAction(): boolean {
    const { loading, error, action } = this.props
    const hasOnAction =
      this.props.onAction !== null && this.props.onAction !== undefined
    return !this.isAddress() && !loading && !error && action && hasOnAction
  }

  isAddress(): boolean {
    const { type } = this.props
    return type === 'address'
  }

  onChangeDatePicker = (e, data) => {
    let newValue = ''

    if (data.value) {
      const year: string = data.value && data.value.getFullYear()
      // Added 0 to dates to match format. e.g. 9-10-2000 -> 09-10-2000
      const day =
        data.value &&
        `${data.value.getDate() < 10 ? '0' : ''}${data.value.getDate()}`
      const month =
        data.value &&
        `${data.value.getMonth() + 1 < 10 ? '0' : ''}${
          data.value.getMonth() + 1
        }`

      newValue = `${year}-${month}-${day}`
    }

    const inputProps: InputOnChangeData = {
      value: newValue
    }
    this.props.onChange && this.props.onChange(e, inputProps)
  }

  render(): JSX.Element {
    const {
      value,
      label,
      error,
      message,
      type,
      loading,
      action,
      onAction,
      disabled,
      kind,
      fitContent,
      isClearable = true,
      id,
      ...rest
    } = this.props

    const isAddress = this.isAddress()
    const icon = error && !isAddress ? 'warning circle' : void 0
    const classes = classnames('dcl field', kind, {
      error,
      disabled,
      address: isAddress,
      resizable: fitContent,
      ['has-label']: label
    })

    if (isAddress && action) {
      console.warn(
        `The address fields don't support actions, "${action}" will be ignored`
      )
    }

    return (
      <div className={classes}>
        {label ? (
          <Header sub>
            <label htmlFor={id}>{label}</label>
          </Header>
        ) : null}
        {type === DATE_TYPE ? (
          <SemanticDatepicker
            // Added the time to the date to prevent timezone variations that would change the date
            value={value ? new Date(`${value} 00:00:00`) : undefined}
            icon={icon ? icon : void 0}
            loading={loading && !isAddress}
            disabled={disabled}
            showOutsideDays
            className="datePickerWidth"
            clearable={isClearable}
            {...rest}
            onChange={this.onChangeDatePicker}
            id={id}
          />
        ) : (
          <Input
            id={id}
            value={value}
            type={isAddress ? 'text' : type}
            icon={icon}
            loading={loading && !isAddress}
            disabled={disabled}
            {...rest}
          />
        )}
        {this.hasAction() && (
          <div className="overlay">
            <Button onClick={onAction} disabled={disabled} basic>
              {action}
            </Button>
          </div>
        )}
        {this.isAddress() && value ? <Blockie seed={value} scale={4} /> : null}
        <p className="message">
          {message}
          &nbsp;
        </p>
      </div>
    )
  }
}
