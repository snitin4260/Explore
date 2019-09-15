import React from 'react'
import { Field, ErrorMessage } from 'formik'
import styles from './InputLabelError.module.css'

function InputLabelError (props) {
  const { inputName, inputLabel, inputType,disabled } = props
  
  return (
    <>
      <div className={styles['form-label-field']}>
        <label className={styles['input-label']} htmlFor={inputName}>
          {inputLabel}
        </label>
        <Field
          id={inputName}
          className={styles['input-style']}
          type={inputType}
          name={inputName}
          autoComplete='true'
          disabled={disabled}
        />
        <ErrorMessage
          className={styles['error-message']}
          name={inputName}
          component='div'
        />
      </div>
    </>
  )
}

export default InputLabelError
