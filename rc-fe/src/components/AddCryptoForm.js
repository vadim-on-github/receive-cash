import React, {Component} from 'react';
import {Button, Card, Form} from "react-bootstrap";
import {components} from "react-select";
import AsyncSelect from "react-select/async";

const {Option} = components

let allCryptos = [];

const filterCryptos = (inputValue) => {
    return allCryptos.filter((i) =>
        i.label.toLowerCase().includes(inputValue.toLowerCase())
    );
};

let waitToLoadOptions;
const loadOptions = (inputValue, callback) => {
    clearTimeout(waitToLoadOptions);

    waitToLoadOptions = setTimeout(() => {
        fetch('https://api.coingecko.com/api/v3/search?query=' + inputValue)
            .then((response) => {
                response.json().then((data) => {
                    allCryptos = data.coins.map(item => {
                        return {
                            value: item.symbol,
                            symbol: item.symbol,
                            name: item.name,
                            label: `${item.name} ${item.symbol}`,
                            logo: item.large,
                            icon: item.thumb
                        }
                    });
                    callback(filterCryptos(inputValue));
                }).catch(() => {
                    callback(filterCryptos(inputValue))
                })
            })
    }, 1000);
};

class AddCryptoForm extends Component {
    constructor(props) {
        super(props);
        this.addCryptoBtn = React.createRef();
        this.addCryptoForm = React.createRef();
        this.cryptoNameInput = React.createRef(); //todo see if we can get rid of these refs
    }

    state = {
        searchedCrypto: '',
        selectedCrypto: '',
        address: '',
        addressError: '',
    };

    showAddCryptoForm = () => {
        this.addCryptoForm.current.classList.remove('hidden');
        this.addCryptoBtn.current.classList.add('hidden');
    }

    saveCrypto = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (this.state.selectedCrypto === '' || this.state.address.trim() === '') {
            return false
        }

        const cryptoFromDropdown = allCryptos.filter((item) => item.value === this.cryptoNameInput.current.getValue()[0].value)[0];
        if (this.props.logging) console.log(cryptoFromDropdown);

        const crypto = {
            id: `${Date.now()}`,
            name: cryptoFromDropdown.name,
            symbol: cryptoFromDropdown.symbol,
            address: this.state.address,
            logo: cryptoFromDropdown.logo,
            icon: cryptoFromDropdown.icon,
            ref: React.createRef()
        }

        const cryptoAdding = await this.props.addCrypto(crypto);
        if (cryptoAdding !== false) {
            this.cryptoNameInput.current.clearValue();
            this.setState({selectedCrypto: '', address: ''});
            form.reset();
        }
    }

    handleInputChange = (newValue) => {
        const inputValue = newValue;
        this.setState({
            searchedCrypto: inputValue,
        });
        this.props.clearNewCryptoNameError();
        return inputValue;
    };

    selectBoxStyles = {
        light: {
            control: (provided, state) => ({
                ...provided,
                borderRadius: '0.375rem',
                boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : null,
                borderColor: state.isFocused ? '#86b7fe' : '#ced4da',
                ':hover': {
                    borderColor: '#ced4da',
                }
            }),
            dropdownIndicator: (provided) => ({
                ...provided,
                color: '#7d878f'
            }),
            placeholder: (provided) => ({
                ...provided,
                color: '#6c757d'
            }),
        },
        dark: {
            control: (provided, state) => ({
                ...provided,
                borderColor: '#101010',
                borderRadius: '0.375rem',
                boxShadow: state.isFocused ? '0 0 0 0.25rem rgba(13, 110, 253, 0.25)' : null,
                ':hover': {
                    borderColor: '#101010',
                }
            }),
            placeholder: (provided) => ({
                ...provided,
                color: '#e9ecef'
            }),
            dropdownIndicator: (provided) => ({
                ...provided,
                color: '#adb5bd'
            }),
            indicatorSeparator: (provided) => ({
                ...provided,
                backgroundColor: '#6c757d'
            }),
            noOptionsMessage: (provided) => ({
                ...provided,
                color: '#adb5bd'
            }),
            loadingMessage: (provided) => ({
                ...provided,
                color: '#adb5bd'
            }),
            singleValue: (provided) => ({
                ...provided,
                color: '#e9ecef'
            }),
        }
    }

    selectBoxThemes = {
        light: (theme) => ({...theme}),
        dark: (theme) => ({
            ...theme,
            colors: {
                ...theme.colors,
                primary: 'gray',
                primary25: '#602d02',
                neutral0: '#151515',
                neutral5: 'hsl(0,0%,12%)',
                neutral10: 'hsl(0,0%,15%)',
                neutral20: 'hsl(0, 0%, 20%)',
                neutral30: 'hsl(0, 0%, 30%)',
                neutral40: 'hsl(0, 0%, 40%)',
                neutral50: 'hsl(0, 0%, 50%)',
                neutral60: 'hsl(0, 0%, 60%)',
                neutral70: 'hsl(0, 0%, 70%)',
                neutral80: 'hsl(0, 0%, 80%)',
                neutral90: 'hsl(0, 0%, 90%)',
            },
        })
    };

    CustomSelectOption = props => {
        return (
            <Option {...props} className={'dropdown-option'}>
        <span className="d-flex align-items-center">
          <img src={props.data.icon} alt='' className='me-2'/>
          <span>{props.data.name} <sup>{props.data.symbol}</sup></span>
        </span>
            </Option>
        )
    };

    CustomSingleValue = ({...props}) => {
        return (
            <components.SingleValue {...props}>
        <span className="d-flex align-items-center">
          <img src={props.data.icon} alt='' className='me-2'/>
          <span>{props.data.name} <sup>{props.data.symbol}</sup></span>
        </span>
            </components.SingleValue>
        )
    };

    render() {
        return (
            <Card className='mb-4'
                  bg={this.props.theme}
                  text={this.props.theme === 'light' ? 'dark' : 'white'}
            >
                <Card.Header as='h5' className='text-center'>New crypto</Card.Header>
                <Card.Body>
                    <Form ref={this.addCryptoForm}
                          className="add-crypto-form"
                          onSubmit={this.saveCrypto}
                    >
                        <AsyncSelect
                            className='react-select'
                            ref={this.cryptoNameInput}
                            styles={this.selectBoxStyles[this.props.theme]}
                            theme={this.selectBoxThemes[this.props.theme]}
                            noOptionsMessage={() => {
                                return 'Start typing'
                            }}
                            placeholder='Name or code'
                            cacheOptions
                            loadOptions={loadOptions}
                            defaultOptions={false}
                            onInputChange={this.handleInputChange}
                            onChange={(selectedCrypto) => {
                                if (selectedCrypto) {
                                    this.setState({selectedCrypto: selectedCrypto.symbol})
                                }
                            }}
                            components={{
                                Option: this.CustomSelectOption,
                                SingleValue: this.CustomSingleValue
                            }}
                        />

                        {this.props.newCryptoNameError === '' ? '' : (
                            <Form.Text className={'text-danger text-start text-input-error d-block mb-3 ps-2'}>
                                {this.props.newCryptoNameError}
                            </Form.Text>
                        )}

                        <Form.Control
                            placeholder='Receiving address'
                            type="text"
                            className={'mt-3'}
                            value={this.state.address}
                            onInput={(e) => {
                                this.setState({address: e.currentTarget.value.trim()})
                            }}
                        />

                        <div className='text-center'>
                            <Button
                                variant="success"
                                className={'mt-3'}
                                type='submit'
                                disabled={this.state.selectedCrypto === '' || this.state.address === ''}
                            >Add</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        );
    }
}

export default AddCryptoForm;
