import React from "react";
import {FormGroup, Input} from "reactstrap";

const InputText = ({label, id, name, value, onChange, error}) => {
    return (
        <FormGroup>
            <label>{label}</label>
            <Input
                placeholder={"Enter " + label}
                type="text"
                value={value}
                id={id}
                name={name}
                onChange={onChange}
            />
            {error ? <div className="alert alert-danger">{error}</div> : ''}
        </FormGroup>
    );
}

const InputSelect = ({label, id, name, value, onChange, options, error}) => {
    return (
        <FormGroup>
            {label ? <label>{label}</label> : ''}
            <select
                className="form-control form-control-lg"
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"
                placeholder={"Select " + label}
                value={value}
                id={id}
                name={name}
                onChange={onChange}
            >{options}</select>
            {error ? <div className="alert alert-danger">{error}</div> : ''}
        </FormGroup>
    );
}

const InputNumber = ({label, id, name, value, onChange, error}) => {
    return (
        <FormGroup>
            <label>{label}</label>
            <Input
                placeholder={"Enter " + label}
                type="number"
                value={value}
                id={id}
                name={name}
                onChange={onChange}
            />
            {error ? <div className="alert alert-danger">{error}</div> : ''}
        </FormGroup>
    );
}

export {InputText, InputSelect, InputNumber};