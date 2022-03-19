import React from 'react';
import { Switch as HeadlessSwitch, Combobox as HeadlessCombobox } from '@headlessui/react';
import styled, { AnyStyledComponent } from 'styled-components';

import ComboboxArrowSvg from '-!svg-react-loader!../../assets/comboboxArrow.svg';
import ComboboxCheckSvg from '-!svg-react-loader!../../assets/comboboxCheck.svg';
import { SrOnly } from './common';

const FormControlContainer = styled.div`
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
`;

const Switch = styled(HeadlessSwitch)` 
    position: relative;
    display: inline-flex;
    align-items: center;
    width: 2.75rem;
    border-radius: 9999px;
    height: 1.5rem;
    background-color: ${(props: any) => (props.checked) ? 'rgba(31, 41, 55, 1)' : 'rgba(75, 85, 99, 1)'};   
`;
const SwitchLabel = styled.span`
    flex-grow: 1;
    padding-left: .75rem;
    padding-right: .75rem;
`;

const SwitchButton: any = styled.span`
    display: inline-block;
    width: 1rem;
    height: 1rem;
    background-color: #fff;
    border-radius: 9999px;
    transform: ${(props: any) => (props.checked) ? 'translate(1.5rem, 0)' : 'translate(0.3rem, 0)'};
`;

type ToggleProps = {
    label: string,
    srLabel?: string,
    value: boolean,
    callback?: any
}

export const ToggleSwitch = ({ label, srLabel, value, callback }: ToggleProps) => {
    return (
        <FormControlContainer> 
            <SwitchLabel>{label}</SwitchLabel>
            <Switch checked={value} onChange={callback}>
                <SrOnly>{srLabel}</SrOnly>
                <SwitchButton checked={value} />
            </Switch>
        </FormControlContainer>
    ); 
}



const ComboboxOuter = styled.div`
    position: relative;
    margin-top: .25rem;
    border-radius: 0.375rem;
    flex-grow: 1;
`;
const ComboboxInner = styled.div`
    position: relative;
    width: 100%;
    overflow: hidden;
    text-align: left;
    border-radius: 0.375rem;
    background-color: ${({ theme }) => theme.SETTINGS_CONTROL_BG};
    cursor: pointer;
`;
const ComboboxInput: any = styled(HeadlessCombobox.Input)`
    width: 100%;
    border: none;
    padding-top: .5rem;
    padding-bottom: .5rem;
    padding-left: .75rem;
    padding-right: 2.5rem;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.SETTINGS_CONTROL_TEXT};
    border-radius: 0.375rem;
    background-color: ${({ theme }) => theme.SETTINGS_CONTROL_BG};
    border: solid 1px ${({ theme }) => theme.SETTINGS_CONTROL_BORDER};
    cursor: pointer;
`;
const ComboboxButton = styled(HeadlessCombobox.Button)`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: .5rem;
`;
const ComboboxArrow = styled(ComboboxArrowSvg)`
    width: 1.25rem;
    height: 1.25rem;
`;

const ComboboxOptions = styled(HeadlessCombobox.Options)`
    position: absolute;
    width: 100%;
    margin-top: .25rem;
    max-height: 15rem;
    overflow: auto;
    border-radius: .375rem;
    background-color: ${({ theme }) => theme.SETTINGS_CONTROL_BG};
    padding-top: .25rem;
    padding-bottom: .25rem;
    z-index: 5;
`;

const ComboboxOption = styled(HeadlessCombobox.Option)`
    padding-bottom: .5rem;
    padding-top: .5rem;
    padding-left: 1rem;
    padding-right: 1rem;
    user-select: none;
    cursor: pointer;
    position: relative;
    display: flex;
    gap: 1.5rem;

    &:hover {
        color: ${({ theme }) => theme.NAV_TEXT_HOVER};
        background-color: ${({ theme }) => theme.NAV_BG_HOVER};
    }
`;

const ComboboxOptionNone = styled(ComboboxOption)`
    &:hover {
        color: inherit;
        background-color: inherit;
    }
`;
const checkMarkCss = `
    height: 1rem;
    width: 1rem;
`;
const ComboboxCheckStyled = styled(ComboboxCheckSvg)`
    ${checkMarkCss}
`;
const ComboboxUnchecked = styled.div`
    ${checkMarkCss}
`;

type ComboboxProps = {
    value: string,
    options: Array<any>,
    defaultLabel?: string,
    noOptionsLabel?: string,
    callback?: any
}

export const Combobox = ({ value, options, callback, defaultLabel, noOptionsLabel }: ComboboxProps) => {

    // Match our selected value from the options.
    let selectedValue = options.filter((item) => {
        return item.value === value;
    });

    const emptyLabel = defaultLabel || '';
    const notFound = noOptionsLabel ?? 'Nothing found.';
    return (
        <FormControlContainer>
            <HeadlessCombobox value={selectedValue[0] || ''} onChange={callback}>
                <ComboboxOuter>
                    <ComboboxInner>
                        <ComboboxInput displayValue={(option: any) => (option) ? option.displayValue : emptyLabel } readOnly={true} />
                        <ComboboxButton><ComboboxArrow /></ComboboxButton>
                    </ComboboxInner>
                    <ComboboxOptions>
                        {options.length === 0 ? (
                            <ComboboxOptionNone key={''} value={''}>{notFound}</ComboboxOptionNone>
                        ) : (
                        options.map((option: any) => (
                            <ComboboxOption key={option.value} value={option}>
                                {({ selected }: any) => (
                                <>
                                    {selected && <ComboboxCheckStyled />}
                                    {!selected && <ComboboxUnchecked />}
                                    <span>{option.displayValue}</span>
                                </>
                                )}
                            </ComboboxOption>
                        )))}
                    </ComboboxOptions>
                </ComboboxOuter>
            </HeadlessCombobox>
        </FormControlContainer>
    ); 
}