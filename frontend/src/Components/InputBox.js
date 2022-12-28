import React,{useState, forwardRef} from 'react'

const InputBox = forwardRef((props, _ref) => {
  const {id, placeholderText, icon, clsName} = props
  const initialDivClass = `input-icon-div custom-format ${props.divCls}`.trim();
  const [divClass, setdivClass] = useState(initialDivClass)

  return (
    <div className={divClass} style={props.style}>
        <i className="fa regular" style={props.iconStyle}>{icon}</i>
        <input type="text" autoComplete="new-password" className={clsName} id={id} onChange={props.onChangeCallback}
            onFocus={()=>{setdivClass(`${initialDivClass} custom-box-shadow`)}} onBlur={()=>{setdivClass(initialDivClass)}} onKeyDown={props.onKeyDown}
             placeholder={placeholderText} ref={_ref}>
            </input>
    </div>
  )
});

InputBox.defaultProps = {
  clsName : 'input-default',
  divCls:'',
  style:{
    width:'fit-content',
    display:'felx',
    flexDirection: 'row',
    justifyContent: 'stretch',
    alignItems: 'center'
  }
}


export default InputBox;