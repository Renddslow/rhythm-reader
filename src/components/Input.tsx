import React from 'react';
import styled from 'styled-components';

const Label = styled.label`
  font-family: var(--sans-serif);
  font-weight: 600;
  color: hsl(240deg, 14%, 45%);
  position: absolute;
  top: calc(2px + 12px);
  left: calc(2px + 12px);
  transition: 0.1s ease-in-out;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
`;

const InputStyled = styled.input`
  width: 100%;
  display: block;
  font-size: inherit;
  font-family: var(--sans-serif);
  font-weight: 500;
  padding: 12px;
  border-radius: 4px;
  border: 2px solid hsl(240deg, 14%, 75%);
  background: #fafaff;
  margin: 0 auto;

  &:focus {
    background: #fff;
    border-color: hsl(240deg, 100%, 75%);
    outline: none;
    outline-offset: 2px;
  }

  &:focus ~ ${Label}, &:not(:placeholder-shown) ~ ${Label} {
    font-size: 12px;
    top: -6px;
    background: linear-gradient(0deg, #fff 90%, #fff0);
    padding: 0 2px;
    color: hsl(240deg, 100%, 65%);
  }

  &:not(:placeholder-shown):not(:focus) ~ ${Label} {
    color: hsl(240deg, 14%, 45%);
  }
`;

const InputContainer = styled.div`
  position: relative;
`;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
}

const Input = ({ label, id, value, onChange, ...props }: Props) => {
  return (
    <InputContainer>
      <InputStyled id={id} {...props} placeholder=" " value={value} onChange={onChange} />
      <Label htmlFor={id}>{label}</Label>
    </InputContainer>
  );
};

export default Input;
